# Blog API

A robust RESTful API for blog management system built with Express.js, TypeScript, and Prisma.

_Available at [blog-api.ttools.xyz](https://blog-api.ttools.xyz/v1/docs)_

## 🚀 Features

- User authentication and authorization
- Blog post management (CRUD operations)
- Tag-based categorization
- JWT-based authentication
- OpenAPI/Swagger documentation
- Docker support for development and production
- Comprehensive test coverage

## 🛠️ Technology Stack

- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT
- **Documentation**: OpenAPI/Swagger
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions

## 📋 Requirements

See [REQUIREMENTS.md](REQUIREMENTS.md) for detailed functional and technical requirements.

## 🚀 Getting Started

### Prerequisites

- Node.js 22
- Docker and Docker Compose
- PostgreSQL 16 (if running without Docker)

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/lavieennoir/blog-api.git
   cd blog-api
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Adjust the variables in `.env` if needed.

4. Start the development database in Docker if needed:

   ```bash
   npm run dev:db
   ```

5. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

6. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### Production Setup

1. Update `.env` file with production values.

2. Build and run with Docker Compose:

   ```bash
   docker compose -f docker-compose.prod.yaml up --build
   ```

3. For manual deployment:

   ```bash
   # Build the application
   npm run build

   # Start the application
   npm start
   ```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: `http://localhost:3000/v1/docs`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

```bash
npm run test:coverage
```

## 🐳 Docker Commands

### Development

```bash
# Run PostgreSQL DB and PgAdmin images
npm run dev:db

# Stop PostgreSQL DB and PgAdmin images
npm run dev:db:down
```

### Production

```bash
# Build and start production environment
docker compose -f docker-compose.prod.yaml up --build

# Stop production environment
docker compose -f docker-compose.prod.yaml down
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
