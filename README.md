# Backend Starter Kit

A production-ready Node.js backend starter kit with Express, TypeScript, Prisma ORM, and PostgreSQL. Features clean modular architecture, JWT authentication, and Zod validation.

## 🚀 Features

- **TypeScript** - Type-safe development
- **Express.js** - Fast, minimalist web framework
- **Prisma ORM** - Modern database toolkit with PostgreSQL adapter
- **PostgreSQL** - Powerful relational database
- **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- **Zod Validation** - Runtime type validation for all inputs
- **Modular Architecture** - Feature-based folder structure
- **Clean Separation** - Controllers, models, routes, and services
- **Error Handling** - Centralized async error wrapper and error middleware
- **Security** - Helmet for HTTP headers, CORS, rate limiting
- **Rate Limiting** - Prevent brute force attacks and API abuse
- **Environment Validation** - Startup validation of required env variables
- **Structured Logging** - Color-coded logger with timestamps and log levels
- **Soft Delete** - Built-in soft delete support in database schema


## 📁 Project Structure

```
backend-starter-kit/
├── server.ts                 # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── app.ts               # Express app configuration
│   ├── config/
│   │   ├── dbConnect.ts     # Database connection (Prisma singleton)
│   │   ├── env.ts           # Environment validation
│   │   └── logger.ts        # Structured logging utility
│   ├── middlewares/
│   │   ├── auth.middleware.ts      # JWT authentication
│   │   ├── error.middleware.ts     # Centralized error handling
│   │   ├── rateLimit.middleware.ts # Rate limiting
│   │   └── validateSchema.ts       # Zod validation
│   ├── modules/
│   │   └── user/            # User module (template)
│   │       ├── user.route.ts
│   │       ├── user.controller.ts
│   │       ├── user.schema.ts
│   │       └── user.model.ts
│   ├── routes/
│   │   └── index.ts         # Main router
│   ├── services/
│   │   └── catchError.ts    # Error wrapper
│   ├── utils/
│   │   └── token.util.ts    # JWT utilities
│   └── types/
│       └── index.ts         # TypeScript types
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
└── nodemon.json
```


## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup Steps

1. **Clone or copy this starter kit**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file with your settings:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Base URL
All API endpoints are prefixed with `/api/v1`

### User Module

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Profile (Protected)
```http
GET /api/v1/users/profile
Cookie: token=<jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Logout (Protected)
```http
POST /api/v1/users/logout
Cookie: token=<jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```


## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 📦 Adding New Modules

Follow the user module pattern to add new features:

1. **Create module folder**
   ```
   src/modules/product/
   ├── product.route.ts
   ├── product.controller.ts
   ├── product.schema.ts
   └── product.model.ts
   ```

2. **Define Prisma model** in `prisma/schema.prisma`

3. **Create Zod schemas** in `product.schema.ts`

4. **Create model functions** in `product.model.ts` (Prisma queries)

5. **Create controllers** in `product.controller.ts` (business logic)

6. **Define routes** in `product.route.ts`

7. **Register routes** in `src/routes/index.ts`:
   ```typescript
   import productRouter from '../modules/product/product.route';
   mainRouter.use('/products', productRouter);
   ```

## 🏗️ Architecture Principles

### Separation of Concerns

- **Routes** - Define endpoints and apply middleware
- **Controllers** - Handle request/response, business logic
- **Models** - Database queries (Prisma)
- **Schemas** - Input validation (Zod)
- **Middleware** - Authentication, validation, error handling
- **Services** - Shared utilities and helpers

### Key Rules

1. `server.ts` is the only entry point
2. `app.ts` configures Express but doesn't start the server
3. Controllers never access Prisma directly (use models)
4. Routes never contain business logic
5. All input must be validated with Zod
6. Prisma client is a singleton
7. Use `catchError` wrapper for async controllers

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds (10)
- **JWT Tokens** - Secure token generation and verification
- **HTTP-only Cookies** - Prevents XSS attacks
- **Helmet** - Sets secure HTTP headers (XSS protection, HSTS, etc.)
- **CORS Configuration** - Controlled cross-origin requests
- **Rate Limiting** - Multiple tiers:
  - API limiter: 100 requests per 15 minutes
  - Auth limiter: 5 attempts per 15 minutes (prevents brute force)
  - General limiter: 30 requests per minute
- **Input Validation** - Zod schema validation on all inputs
- **Environment Validation** - Required variables checked at startup
- **Centralized Error Handling** - Prevents information leakage
- **Soft Delete** - Data retention with deletedAt field


## 🗄️ Database

This starter kit uses PostgreSQL with Prisma ORM. The User model includes:

- `id` - UUID primary key
- `name` - User's full name
- `email` - Unique email address (indexed for performance)
- `password` - Hashed password
- `role` - Enum (ADMIN, USER)
- `createdAt` - Timestamp
- `updatedAt` - Auto-updated timestamp
- `deletedAt` - Soft delete timestamp (nullable)


## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 📄 License

MIT

## 🤝 Contributing

This is a starter kit template. Feel free to customize it for your projects!

---

**Happy Coding! 🎉**
