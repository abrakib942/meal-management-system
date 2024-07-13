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
