import multer from "multer";
import path from "path";

// Define the folder path where profile pictures will be stored
const imgFolderPath = path.join("public", "img", "profile-pics");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgFolderPath);
  },
  filename: (req, file, cb) => {
    const fullFileName = Date.now() + "-" + file.originalname;
    cb(null, fullFileName);
  },
});

const limits = {
  fileSize: 1 * 1024 * 1024, // Limit file size to 1MB
};

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images are allowed"), false);
  }
  cb(null, true);
};

const multerUpload = multer({ storage, limits, fileFilter });

export default multerUpload;
