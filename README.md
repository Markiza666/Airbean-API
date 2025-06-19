# AirBean API

![AirBean Logo (placeholder)](./public/images/logo-sml.svg)

Welcome to the AirBean API, the backend system powering AirBean's revolutionary drone coffee delivery service! This API handles user authentication, order placement, order status tracking, and product information management to ensure a smooth and efficient customer experience.

---

## About the Project

The AirBean API is the core of AirBean's digital infrastructure. It's a **RESTful API** built with **Node.js** and **Express.js**, using **MongoDB** as its database. Its primary purpose is to provide the necessary functionalities for AirBean's mobile or web application, including:

- Secure user registration and login.
- Ability to place new coffee orders.
- Retrieval of real-time order status and history.
- Access to current product/menu information.
- Static information about AirBean.

---

## 🌟 Features

- **User Authentication:** Securely register and log in users using **JWT (JSON Web Tokens)**.
- **Order Management:** Create new orders with detailed product lists, total price, and delivery address.
- **Order Status:** Retrieve current status and estimated time of arrival (ETA) for specific orders.
- **Order History:** View a complete list of past orders for an authenticated user.
- **Product Information:** Provides a dynamic list of available products (the menu).
- **"About Us" Page:** Serves static information about the company.
- **Robust Error Handling:** Catches and handles server-side errors for a stable experience.

---

## 🛠️ **Technologies**

This project is built using the following technologies:

- **Node.js:** [JavaScript runtime environment for the server.](https://nodejs.org/)
- **Express.js:** Web application framework for Node.js to build RESTful APIs.
- **MongoDB:** NoSQL database for storing application data.
- **Mongoose:** ODM (Object Data Modeling) for MongoDB and Node.js, simplifying database interactions.
- `date-fns`: A robust library for date and time manipulation.
- `jsonwebtoken`: For handling JWTs for authentication.
- `bcryptjs`: For secure password hashing.
- `dotenv`: For loading environment variables.

---

## 🚀 **Installation and Getting Started**

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

1. [Node.js](https://nodejs.org/) (LTS version recommended)
2. [npm](https://www.npmjs.com/) (comes with Node.js)
3. [MongoDB](https://www.mongodb.com/try/download/community) (local installation or access to a cloud database like MongoDB Atlas)

### Clone the Repository

```bash
git clone [https://github.com/yourgithubusername/airbean-api.git](https://github.com/yourgithubusername/airbean-api.git)
cd airbean-api
```

### Environment Variables

Create a .env file in the root of your project with the following variables:

```bash
Code snippet

NODE_ENV=development
PORT=3000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=some_very_secret_key_here
JWT_EXPIRES_IN=1h
```

- MONGO_URI: Your MongoDB connection string (e.g., mongodb://localhost:27017/airbean for a local database, or a string from MongoDB Atlas).
- JWT_SECRET: A long, random string used to sign your JWTs. Generate a secure string (e.g., using node -e "console.log(require('crypto').randomBytes(32).toString('hex'))").
- JWT_EXPIRES_IN: How long a JWT should be valid (e.g., 1h for one hour, 7d for seven days).
  
### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm start
```

The server will now be running on [http://localhost:3000](http://localhost:3000) (or the port you specified in your .env file).

## API Endpoints

Here's an overview of the primary API endpoints. All endpoints are prefixed with /api.

### Authentication

| Method | Endpoint           | Description                       | Access |
| ------ | ------------------ | --------------------------------- | ------ |
| POST   | /api/auth/register | Registers a new user.             | Public |
| POST   | /api/auth/login    | Logs in a user and returns a JWT. | Public |

### Orders

| Method | Endpoint                    | Description                                        | Access |
| ------ | --------------------------- | -------------------------------------------------- | ------ |
| POST   | /api/orders                 | Creates a new order.                               | Private |
| GET    | /api/orders/:orderId/status | Retrieves the status and ETA for a specific order. | Private |
| GET    | /api/orders/history         | Retrieves the authenticated user's order history.  | Private |

### Products

| Method | Endpoint          | Description                              | Access |
| ------ | ----------------- | ---------------------------------------- | ------ |
| GET    | /api/products     | Retrieves all available products (menu). | Public |
| GET    | /api/products/:id | Retrieves a specific product by ID.      | Public |

### About Us

| Method | Endpoint   | Description                                 | Access |
| ------ | ---------- | ------------------------------------------- | ------ |
| GET    | /api/about | Retrieves static information about AirBean. | Public |

## 📂 **Project Structure**

```bash
.
├── config/             # Database connection setup
│   └── db.js
├── controllers/        # Logic for API endpoints
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   └── aboutController.js
├── models/             # Mongoose Schemas for the database
│   ├── User.js
│   ├── Order.js
│   └── Product.js
├── routes/             # API routes definitions
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── aboutRoutes.js
├── public/             # Static files served directly (e.g., images, CSS)
│   └── images/
│       └── owner.jpg
│       └── airbean_logo_placeholder.png
├── .env                # Environment variables (not version controlled)
├── .gitignore          # Files/folders to ignore in Git
├── app.js              # Main application file, server start, middleware, route configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```
