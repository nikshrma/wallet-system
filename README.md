# Wallet System

A robust and scalable wallet application designed to handle high-frequency financial transactions. This system features a comprehensive architecture that includes:

-   **User-Side Application**: A Next.js-based frontend for users to manage their wallets, send money, and track transactions.
-   **Bank Webhook Handler**: A dedicated Express.js service to securely process and validate incoming webhook events from banking providers (e.g., for on-ramp transactions).
-   **P2P Transfer Engine**: optimized logic for safe and fast peer-to-peer money transfers between users.
-   **Secure Authentication**: NextAuth.js integration with hashed passwords and secure session management.

Built as a TurboRepo monorepo, it shares rigorous configuration and type definitions across all applications to ensure code quality and consistency.

## CI/CD Pipeline & Docker

This project employs a fully automated CI/CD pipeline using **GitHub Actions** and **Docker**.

### Continuous Integration (CI)
On every Pull Request to the `main` branch, the `Build surceeds on PR` workflow triggers. It performs the following checks:
-   **Linting**: Ensures code style consistency.
-   **Type Checking**: Validates TypeScript types across the monorepo.
-   **Build Verification**: Compiles all apps and packages to ensure no build errors.
-   **Database Generation**: Generates the Prisma client to verify schema integrity.

### Continuous Deployment (CD)
On every push to the `main` branch, the `Build and Deploy to Docker Hub` workflow executes:
1.  **Docker Build**: Builds a Docker image for the user application, identifying it with the `latest` tag.
2.  **Push to Docker Hub**: Pushes the built image to the [official Docker Hub repository](https://hub.docker.com/r/nikshrma/wallet-images).
3.  **Deploy to EC2**: Connects to the production EC2 instance via SSH, pulls the latest image, runs database migrations, and restarts the application container.
(Note: The EC2 instance is currently not running, so the deployment will fail at the SSH step.)
**Docker Hub Repository:** [nikshrma/wallet-images](https://hub.docker.com/r/nikshrma/wallet-images)

## Tech Stack

This project leverages a modern TypeScript stack:

-   **Monorepo Management**: [TurboRepo](https://turbo.build/repo)
-   **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
-   **Backend / Webhooks**: [Express.js](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **State Management**: [Jotai](https://jotai.org/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Styling**: [TailwindCSS](https://tailwindcss.com/)

## Folder Structure

The project is organized into `apps` and `packages`:

```
.
├── apps
│   ├── user-side            # Next.js user-facing application
│   └── bank_webhook_handler # Express.js server for handling bank webhooks
├── packages
│   ├── db                   # Shared Prisma client and schema
│   ├── store                # Shared state management (Jotai atoms)
│   ├── ui                   # Shared React UI components
│   ├── eslint-config        # Shared ESLint configurations
│   ├── tailwind-config      # Shared Tailwind configurations
│   └── typescript-config    # Shared TypeScript configurations
└── ...
```

## Local Setup

Follow these steps to get the project running locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [PostgreSQL](https://www.postgresql.org/) (running locally or via Docker) - *Docker setup coming soon*

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd wallet-system
    ```

2.  **Install dependencies:**

    This project uses `npm` workspaces.

    ```bash
    npm install
    ```

### Configuration

1.  **Environment Variables:**

    Create a `.env` file in the root directory. You can duplicate the structure of the keys below.

    ```env
    DATABASE_URL="postgresql://postgres:password@localhost:5432/wallet"
    NEXTAUTH_SECRET="your_secret_key"
    ```

    *Note: Adjust `DATABASE_URL` to match your local PostgreSQL credentials.*

2.  **Database Setup:**

    Generate the Prisma client and push the schema to your database.

    ```bash
    npm run db:client
    cd packages/db && npx prisma db push && cd ../..
    ```
    *(Or use `npx prisma db push` directly inside `packages/db`)*

### Running the Project

You can run all applications simultaneously using TurboRepo.

1.  **Start the development environment:**

    ```bash
    npm run dev
    ```

    This command typically starts:
    -   `user-side` app on [http://localhost:3000](http://localhost:3000)
    -   `bank_webhook_handler` on port 3003

### Build

To build all apps and packages:

```bash
npm run build
```


## Developer's Note
The goal of this project was not to build a production-ready application, but to learn and experiment with different technologies and concepts. The project is a work in progress and is not intended for production use. My main motive here was to understand numerous small topics in depth, such as: 
- CI/CD
- Docker
- GitHub Actions
- Monorepo
- P2P Transfer Engine with DB row locking
- Bank Webhook Handler
- Secure Authentication

And now instead of spending my time in polishing this project, I'm going to spend my time learning further about system design and distributed systems and use this project as a base to learn those future technologies.