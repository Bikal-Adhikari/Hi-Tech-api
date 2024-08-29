# Hi-Tech Client API

## Overview

The Hi-Tech Client API is a RESTful API designed for managing and interacting with the Hi-Tech app. It offers endpoints for user management, data operations, and integration with core app features.

## Features

- User authentication and management
- Data retrieval and manipulation
- Integration with core Hi-Tech features
- Secure and efficient API endpoints

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher) or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Bikal-Adhikari/Hi-Tech-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd hi-tech-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   # or
   yarn add
   ```

4. Create a `.env` file in the root directory with the following content:
   `env
    MONGOOSE_URL
    SMTP_SERVER
    SMTP_EMAIL
    APP_PASSWORD
    FE_ROOT_URL
    ACCESS_JWT_SECRET
    REFRESH_JWT_SECRET
    stripe_SecretKey
stripe_PublishableKey
    `

5. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```
   The API will be running on `http://localhost:8000`.

## Contributing

If you would like to contribute to the Hi-Tech Client API, please follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-branch
   ```

3. Commit your changes:

   ```bash
   git commit -am 'Add new feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature-branch
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

For further information or support, please contact [bikaladhikari5@gmail.com](mailto:bikaladhikari5@gmail.com).
