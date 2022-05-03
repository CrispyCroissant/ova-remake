# Öviks VägAssistance Website

A website for the company Öviks VägAssistance.

## Getting Started

### Dependencies

- [Node v.16 or higher](https://nodejs.org/en/)

### Installing

- Clone the repo.

- Install the npm packages in the following folders

  - backend
  - frontend

- Set the environment variables listed below.

#### Frontend environment variables

| **Key**          | **Description**                     |
| ---------------- | ----------------------------------- |
| `BACKEND_URL`    | The URL used by the backend         |
| `STRIPE_API_KEY` | The publishable API key from Stripe |
| `GOOGLE_API_KEY` | The API key from Google             |

#### Backend environment variables

| **Key**                 | **Description**                                        |
| ----------------------- | ------------------------------------------------------ |
| `NODE_ENV`              | Either _production_ or _dev_                           |
| `PORT`                  | the port the server listens to for connections         |
| `FRONTEND_URL`          | the URL used by the frontend                           |
| `GOOGLE_API_KEY`        | The API key from Google                                |
| `STRIPE_API_KEY`        | The secret API key from Stripe                         |
| `STRIPE_WEBHOOK_SECRET` | The webhook secret provided by Stripe on its dashboard |
| `DATABASE_URL`          | The URL to the PostgreSQL DB server                    |

### Usage

- **Frontend**

  - Starting the development server

    ```
    quasar dev
    ```

  - Building the project files for production

    ```
    quasar build
    ```

  - Running unit tests

    ```
    npm run test:unit
    ```

  - Running the linter

    ```
    npm run lint
    ```

- **Backend**

  - Starting the development server

    ```
    npm run dev
    ```

  - Running unit tests

    ```
    npm run test
    ```

  - _Starting the production server_

    ```
    npm run start
    ```

## Authors

[@CrispyCroissant](https://github.com/crispycroissant)

## Version History

## License
