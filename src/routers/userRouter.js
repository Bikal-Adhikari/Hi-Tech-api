import express from "express";
import {
  newUserValidation,
  updateUserValidation,
} from "../middlewares/joiValidation.js";
import {
  getAUser,
  getAUserById,
  insertUser,
  updateUser,
  updateUserById,
  updateUserPassword,
} from "../models/user/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  accountUpdatedNotification,
  emailVerificationMail,
  sendOtpMail,
} from "../email/nodemailer.js";
import {
  deleteManySession,
  deleteSession,
  insertSession,
} from "../models/session/sessionModel.js";
import { getTokens, signAccessJWT, verifyRefreshJWT } from "../utils/jwt.js";
import { auth } from "../middlewares/auth.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import multerUpload from "../utils/multer.js";

const router = express.Router();

router.get("/", auth, (req, res, next) => {
  try {
    const { userInfo } = req;
    userInfo.password = undefined;

    // userInfo.refreshJWT = undefined;

    userInfo?.status === "active"
      ? res.json({
          status: "success",
          message: "",
          userInfo,
        })
      : res.json({
          status: "error",
          message:
            "your account has not been activated. Check your email to verify your account",
        });
  } catch (error) {
    next(error);
  }
});

router.get("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const user = await getAUserById(_id);
    user.password = undefined;

    if (user?._id) {
      return res.json({
        status: "success",
        message: "",
        user,
      });
    }

    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
});

// image upload
router.patch(
  "/uploadProfilePic/:_id",
  multerUpload.single("profilePic"), // Multer middleware
  async (req, res, next) => {
    try {
      if (req.file) {
        const profilePicPath = req.file.path.replace("public", "");

        // Extract the user ID from the request body
        const { _id } = req.params;
        // Create an object with the field you want to update
        const updateData = { profilePic: profilePicPath };

        // Update the user's profile picture in the database
        const result = await updateUserById(_id, updateData);

        return res.json({
          status: "success",
          message: "Profile picture updated successfully",
          data: result,
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", newUserValidation, async (req, res, next) => {
  try {
    // encrypt password
    req.body.password = hashPassword(req.body.password);

    const user = await insertUser(req.body);

    if (user?._id) {
      // create unique url and add in the database
      const token = uuidv4();
      const obj = {
        token,
        associate: user.email,
        type: "email-verification",
      };

      const result = await insertSession(obj);
      if (result?._id) {
        //process for sending email

        emailVerificationMail({
          email: user.email,
          fName: user.fName,
          url:
            process.env.FE_ROOT_URL + `/verify-user?c=${token}&e=${user.email}`,
        });
        return res.json({
          status: "success",
          message:
            "We have send you an email with instructions to verify your  account. Please check email/junk to verify your account",
        });
      }
    }

    res.json({
      status: "error",
      message: "Error Unable to create an account, Contact administration",
    });
  } catch (error) {
    next(error);
  }
});

//user verification
router.post("/user-verification", async (req, res, next) => {
  try {
    const { c, e } = req.body;

    const session = await deleteSession({
      token: c,
      associate: e,
    });

    if (session?._id) {
      const result = await updateUser(
        { email: e },
        {
          status: "active",
          isEmailVerified: true,
        }
      );
      if (result?._id) {
        return res.json({
          status: "success",
          message: "Your account has been verified. You may sign in now",
        });
      }
    }

    return res.json({
      status: "error",
      message: "Invalid link, contact admin",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let message = "";
    const { email, password } = req.body;
    // 1. check if user exist with email
    const user = await getAUser({ email });

    if (user?._id && user?.status === "active" && user?.isEmailVerified) {
      //verify passwords

      const confirmPass = comparePassword(password, user.password);

      if (confirmPass) {
        //user is now authenticated

        // create jwts then return

        return res.json({
          status: "success",
          message: "Login Successful",
          jwts: await getTokens(email),
        });
      }
    }

    if (user?.status === "inactive") {
      message = "Your account is not active, contact admin";
    }

    if (!user?.isEmailVerified) {
      message = "User not verified, please check your email and verify";
    }

    res.json({
      status: "error",
      message: message || "Invalid login details",
    });
  } catch (error) {
    next(error);
  }
});

// logout user
router.delete("/logout", auth, async (req, res, next) => {
  try {
    const { email } = req.userInfo;

    await updateUser(
      {
        email,
      },
      { refreshJWT: "" }
    );

    await deleteManySession({ associate: email });

    res.json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Route for new access JWT
router.get("/new-accessjwt", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // verify jwt
    const decoded = verifyRefreshJWT(authorization);
    console.log(decoded);
    if (decoded?.email) {
      //check if exist in the user table
      const user = await getAUser({
        email: decoded.email,
        refreshJWT: authorization,
      });
      //create new accessJWT and return
      if (user?._id) {
        const accessJWT = await signAccessJWT(decoded.email);
        if (accessJWT) {
          return res.json({
            status: "success",
            message: "",
            accessJWT,
          });
        }
      }
    }

    //else return 401
    res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await getAUser({ email });
    if (user?._id) {
      const token = otpGenerator();

      const session = await insertSession({
        token,
        associate: email,
        type: "otp",
      });
      session?._id && sendOtpMail({ token, fName: user.fName, email });
    }

    res.json({
      status: "success",
      message:
        "If your email exists in our system, please check your email for OTP",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/password/reset", async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if ((email, otp, password)) {
      const session = await deleteSession({
        token: otp,
        associate: email,
        type: "otp",
      });
      if (session?._id) {
        const user = await updateUser(
          { email },
          { password: hashPassword(password) }
        );
        if (user?._id) {
          accountUpdatedNotification({ email, fName: user.fName });
          return res.json({
            status: "success",
            message: "Your password has been reset successfully",
          });
        }
      }
    }

    return res.json({
      status: "error",
      message: "Invalid data, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

// update profile
router.put("/profile/update", async (req, res, next) => {
  try {
    const { password, _id, ...rest } = req.body;

    const user = await getAUserById(_id);

    if (!user._id) {
      return res.json({
        status: "error",
        message: "User not found",
      });
    }

    const confirmPass = comparePassword(password, user.password);
    if (!confirmPass) {
      return res.json({
        status: "error",
        message: "Password does not match, try again with correct password",
      });
    }

    const userInfo = await updateUserById(_id, rest);
    if (!userInfo?._id) {
      return res.json({
        status: "error",
        message: "Failed to update profile, please try again",
      });
    }

    return res.json({
      status: "success",
      message: "Your profile has been updated successfully",
      userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// Password change
router.patch("/password/change", async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: "error",
        message: "New passwords do not match!",
      });
    }

    // Fetch user by email from the request body
    const user = await getAUser({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found!",
      });
    }

    // Verify old password
    const isMatch = comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Old password is incorrect!",
      });
    }

    // Hash the new password
    if (isMatch) {
      const password = hashPassword(newPassword);
      await updateUserPassword({ email }, { password });

      return res.status(200).json({
        status: "success",
        message: "Password updated successfully!",
      });
    }

    // Update user with new password
  } catch (error) {
    next(error);
  }
});

export default router;
