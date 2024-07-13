# Meal Management System

### Live site - https://meal-management.netlify.app/

This guide will walk you through the process of setting up the Meal Management System project. By following these steps, you will clone the project, install dependencies, and configure. Let's get started!

## Installation Steps

### Follow these steps to clone and set up starter project:

1. `Clone the project:` Open your terminal or command prompt and run the following command to clone the project repository:

```bash
git clone https://github.com/abrakib942/meal-management-system.git
```

2. `Navigate into the project directory:` Use the cd command to navigate into the project directory:

```bash
cd meal-management-system
```

# for frontend

```bash
cd ./frontend
```

# for backend

```bash
cd ./backend
```

3. `Install project dependencies:` Next, install the project dependencies by running the following command:

```bash
yarn install
```

### for ./backend

Create a `.env` file in the project root with the following content:

```env
NODE_ENV=development
PORT=5000

# PostgreSQL Database Configuration

DB_USER=The username for connecting to the database.
DB_HOST="The database server's address."
DB_PASS="The password for connecting to the database."
DB_PORT="The port on which the database server is running."
DB_NAME="The name of the database."

BCRYPT_SALT_ROUNDS=12

# jwt configuration

JWT_SECRET= 'very secret'
JWT_EXPIRES_IN= 1d
JWT_REFRESH_SECRET= 'refresh-secret'
JWT_REFRESH_EXPIRES_IN= 365d"
```

```bash
yarn install
```

```bash
yarn dev
```

    The application will be accessible at http://localhost:5000. and frontend will accessible at http://localhost:5173/

That's it! You have successfully set up the Meal management project. You can now start exploring and working with the codebase. Refer to the project documentation or README for further instructions on how to run and use the system.

Happy coding!

```

```

### API Information (Request and Response)

## Base URL

The base URL for all API endpoints is: `https://meal-management-backend.vercel.app/api/v1`

## Registration and Login

### User Registration

- **POST** `/auth/signup`

  - Create a new user account.
  - Request Body:

    ```json
    {
      "name": "admin2",
      "email": "admin2@gmail.com",
      "role": "admin",
      "password": "123456"
    }
    ```

    - Response:

    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "User Signed up successfully",
      "data": {
        "userId": "578ba201-be6b-4719-b49e-76909b3ad6e1",
        "name": "admin2",
        "email": "admin2@gmail.com",
        "password": "$2b$12$.ZfHl1XXn/EzcweiZ09djO1v/dgiptkcm8k9j4dyG3jc6od25PN6m",
        "role": "admin",
        "status": "active",
        "createdAt": "2024-07-13T19:47:54.583Z",
        "updatedAt": "2024-07-13T19:47:54.583Z"
      }
    }
    ```

### User Login

- **POST** `/auth/login`

  - Authenticate the user.
  - Request Body:

    ```json
    {
      "email": "admin@gmail.com",
      "password": "123456"
    }
    ```

    - Response:

    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "user login successfully",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3N2E3MGVlOS03YzA1LTQ3Y2YtYTZlMS02NTk1NWJhYzkwODEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyMDkwMDA4MCwiZXhwIjoxNzIwOTg2NDgwfQ._jAhx72-UI5E6Zok8rnwmHwY6RY5uiIZCrnPANzpYqI"
      }
    }
    ```

    ### Item

    - **POST** `/items/create`
    - Request Body:

    ```json
    {
      "name": "Fish Curry",
      "category": "Protein"
    }
    ```

    - Response:

    ```json
    {
      "statusCode": 200,
      "success": true,
      "message": "Item created successfully",
      "data": {
        "itemId": "fb6ee6df-628d-4c06-bbe7-253d384d5535",
        "name": "Fish Curry",
        "category": "Protein",
        "createdAt": "2024-07-13T20:46:15.067Z",
        "updatedAt": "2024-07-13T20:46:15.067Z",
        "meals": []
      }
    }
    ```

- **GET** `/items`

  - for filters `/items?category=Protein`

  ### Meal

  - **POST** `/meals/create`
  - Request Body:

  ```json
  {
    "mealDay": "Tuesday",
    "items": [
      "02bd44fa-9146-4ee6-8b56-3027a09bf001",
      "2d6ec6dd-6b9f-4515-aec9-293146318b64",
      "7b9336c9-e6d3-4887-ac75-bb4bd3eb976d"
    ]
  }
  ```

  - Response:

  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Meal created successfully",
    "data": {
      "mealId": "09358c0e-e25f-4b65-9bb9-a04b82bf7b46",
      "mealDay": "Tuesday",
      "repeatedDays": null,
      "status": "Completed",
      "createdAt": "2024-07-13T20:51:54.074Z",
      "updatedAt": "2024-07-13T20:51:54.074Z",
      "items": [
        {
          "mealItemId": "fa72c225-fc92-41b4-92f5-234c6a4e4e9f",
          "mealId": "09358c0e-e25f-4b65-9bb9-a04b82bf7b46",
          "itemId": "7b9336c9-e6d3-4887-ac75-bb4bd3eb976d",
          "createdAt": "2024-07-13T20:51:54.074Z",
          "updatedAt": "2024-07-13T20:51:54.074Z"
        },
        {
          "mealItemId": "e0e485c9-05be-43e4-bdbe-8c5456476eb6",
          "mealId": "09358c0e-e25f-4b65-9bb9-a04b82bf7b46",
          "itemId": "2d6ec6dd-6b9f-4515-aec9-293146318b64",
          "createdAt": "2024-07-13T20:51:54.074Z",
          "updatedAt": "2024-07-13T20:51:54.074Z"
        },
        {
          "mealItemId": "06457776-c55f-4814-b599-efe255cffab0",
          "mealId": "09358c0e-e25f-4b65-9bb9-a04b82bf7b46",
          "itemId": "02bd44fa-9146-4ee6-8b56-3027a09bf001",
          "createdAt": "2024-07-13T20:51:54.074Z",
          "updatedAt": "2024-07-13T20:51:54.074Z"
        }
      ]
    }
  }
  ```

  - **GET** `/meals`
