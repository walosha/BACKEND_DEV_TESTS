# Backend Test API

This is a backend test API built with ExpressJS, using MongoDB as the persistent storage and Redis as the cache storage. It has the ability to handle user authentication, authorization and transfer of funds between accounts.

### Built With

- ExpressJS - The Node.js framework used
- MongoDB - The NoSQL database used
- Redis - The cache storage used
- Docker - The containerization platform used
- [Swagger](https://swagger.io)

## Getting Started

To get started with the API, follow the steps below:

### Prerequisites

To run this application, you will need to have the following installed or use github codespace which is faster and free!

Docker
Docker Compose

### Installation

1. Clone the repository to your local machine:

```bash
   git clone git@github.com:walosha/BACKEND_DEV_TESTS.git

```

2. Create an .env file in the root of the project directory, and copy the contents from the .env.example file. Edit the environment variables in the .env file to your preference.

3. Run the following command in the root of the project directory to start the application:

```bash
docker-compose up --build
```

This command will build and start the Docker containers.

4. Access the API at http://localhost:3000

### API Documentation

This API is documented using Swagger. You can access the API documentation at http://localhost:3000/api/v1/api-docs after starting the application.

### Usage

The following routes are available:

- /api/v1/auth/signup - Creates an account
- /api/v1/auth/login - Logs in a user
- /api/v1/account - Retrieves account information
- /api/v1/transfer - Transfers funds between accounts

### API Versioning

This API is versioned using the URI path. The current version is v1, which is included in all routes, e.g. /api/v1/auth/signup.

### Rate Limiting

Rate limiting is currently implemented with Redis

### Authentication and Authorization

This API uses JWT-based authentication and authorization. The signup and login routes are not protected, but all other routes require a valid JWT access token. The transfer route is also protected by an authorization middleware that checks the user's role.

### Refresh Tokens

Refresh tokens are used for re-authenticating users. They are stored in Redis and can be invalidated at any time by the user or by an administrator. Refresh tokens are automatically invalidated when they expire, which is currently set to 30 days.

### Roles

This API defines two roles: user and admin. The user role is the default role for all users, and the admin role can be assigned by an administrator. The transfer route is protected by an authorization middleware

### Directory Structure

The project directory structure is as follows:

```text
├── modules
│   ├── auth
│   │   ├── controllers
│   │   ├── models
│   │   ├── services
│   │   └── types
│   ├── transfer
│   │   ├── controllers
│   │   ├── models
│   │   ├── services
│   │   └── types
│   └── user
│       ├── controllers
│       ├── models
│       ├── services
│       └── types
├── database
│   ├── index
├── middlewares
│   ├── isLoggedIn.ts
│   ├── protect.ts
│   └── error.ts
├── utils
│   ├── appErrors.ts
│   ├── catchAsync.ts
└── @types
    ├── express
```

- **modules**: This directory contains the different modules of the API, including auth, transfer, and user. Each module has its own controllers, models, services, and types.

- **database**: This directory contains the mongoose configuration file and the database models.

- **middlewares**: This directory contains the middleware functions used in the API, including the auth middleware, the error handler middleware, and the not-found handler middleware.

- **utils**: This directory contains utility functions used in the API, including error handling functions, logger functions, and input validators.

- @**types**: This directory contains the type definitions for external libraries used in the API.
