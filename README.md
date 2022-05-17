# Öviks VägAssistance Website

This is a website for the company Öviks VägAssistance. The website allows users to calculate the cost of a transport from point A to point B as well as ordering the transport. Also, it displays information about the company and its business.

The backend has services for transport cost calculation, order management, integration with [Stripe](https://stripe.com), and email notifications.

The frontend has a simple and intuitive UI which features core information that the company wants to show. This includes a home page with their own personal hero image and a CTA, their contact information, an ordering page and an "_about us_" page for those who are curious.

## Getting Started

### Dependencies

- [Docker](https://www.docker.com/)

### Setting up the development environment

1. Clone the repo.

2. Go into the **backend** folder
   1. Create a _.env_ file and provide the necessary environment variables (available below).
   2. Run the command `make build` to build the docker image.
   3. Run the command `make dev` to start the container.
   4. Execute an interactive `sh` shell on the container and run `npx prisma migrate dev` to start the initial DB migration.
3. Go into the **frontend** folder
   1. Create a _.env_ file and provide the necessary environment variables (available below).
   2. Run the command `make build` to build the docker image.
   3. Run the command `make dev` to start the container.

#### Other
* The Docker images are configured to allow for hot-reloading.
* Frontend is by default available on port 9000.
* Backend is by default available on port 3000.
* pgAdmin is by default available on port 5555.

### Frontend environment variables

| **Key**          | **Description**                     |
| ---------------- | ----------------------------------- |
| `BACKEND_URL`    | The URL used by the backend         |
| `STRIPE_API_KEY` | The publishable API key from Stripe |
| `GOOGLE_API_KEY` | The API key from Google             |

### Backend environment variables

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

**Frontend**

- Starting the development server silently

  ```
  make dev
  ```

- Starting the development server (verbose)

  ```
  make dev-v
  ```

- Running unit tests (inside container)

  ```
  npm run test:unit
  ```

- Running the linter (inside container)

  ```
  npm run lint
  ```

**Backend**

- Starting the development server silently

  ```
  make dev
  ```

- Running unit tests (inside container)

  ```
  npm run test
  ```

## Authors

[@CrispyCroissant](https://github.com/crispycroissant)

## Version History

## License
