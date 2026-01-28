# Backend Starter Kit

A production-ready Node.js backend starter kit with Express, TypeScript, Prisma ORM, and PostgreSQL. Features clean modular architecture, JWT authentication, and Zod validation.

## 🚀 Features

- **TypeScript** - Type-safe development
- **Express.js** - Fast, minimalist web framework
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Powerful relational database
- **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- **Zod Validation** - Runtime type validation
- **Modular Architecture** - Feature-based folder structure
- **Clean Separation** - Controllers, models, routes, and services
- **Error Handling** - Centralized async error wrapper

## 📁 Project Structure

```
backend-starter-kit/
├── server.ts                 # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── app.ts               # Express app configuration
│   ├── config/
│   │   └── dbConnect.ts     # Database connection
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── validateSchema.ts
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

### User Module

#### Register User
```http
POST /api/users/register
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
POST /api/users/login
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
GET /api/users/profile
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
POST /api/users/logout
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

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure token generation
- **HTTP-only Cookies** - Prevents XSS attacks
- **Input Validation** - Zod schema validation
- **CORS Configuration** - Controlled cross-origin requests

## 🗄️ Database

This starter kit uses PostgreSQL with Prisma ORM. The User model includes:

- `id` - UUID primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - Enum (ADMIN, USER)
- `createdAt` - Timestamp

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
