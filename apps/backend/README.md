# PathShala Backend - Express + TypeScript + Prisma + PostgreSQL

This is a scalable backend boilerplate built with **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. It uses a **modular feature-based architecture**, making it easy to maintain and scale as your app grows.

## 🏗️ Tech Stack

- **Node.js + Express** – API framework
- **TypeScript** – Type safety
- **Prisma** – Type-safe ORM
- **PostgreSQL** – Database
- **Dotenv** – Environment management
- **Nodemon** – Auto-reloading dev server

## 📁 Project Structure

```

src/
├── config/             # Configuration (e.g. DB client)
├── features/           # Modular feature-based structure
│   └── auth/           # Example feature module
│       ├── auth.router.ts
│       ├── auth.service.ts
│       └── auth.types.ts
├── middleware/         # Optional: error handlers, auth guards, etc.
├── utils/              # Optional: helpers, shared utils
├── app.ts              # Main app with route wiring
└── server.ts           # Entry point
prisma/
└── schema.prisma       # Prisma schema definition

````

## 🚀 Getting Started

### 1. Setup Environment Variables

Create a `.env` file in the root with the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=5000
```

### 2. Initialize Prisma

Generate the Prisma client and create the initial migration:

```bash
npx prisma generate           # Generate Prisma client
```

### 3. Start the Dev Server

```bash
npm run dev
```

API will be available at: [http://localhost:5000](http://localhost:5000)

## 🧪 Health Check

**GET** `/health`

```bash
curl http://localhost:5000/health
```

```json
{
  "status": "ok",
  "message": "Server is healthy 🚀"
}
```

## 🧠 Prisma Workflow & Best Practices

### 🌱 1. Create a New Model (example)

Edit `prisma/schema.prisma`:

```prisma
model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
  author  User?   @relation(fields: [authorId], references: [id])
  authorId Int?
}
```

### 🧬 2. Generate and Migrate

```bash
npx prisma generate                    # Always regenerate after schema changes
npx prisma migrate dev --name post-model  # Creates migration & updates DB
```

### 📚 3. Seed the Database (optional)

Create a `prisma/seed.ts` file:

```ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'securepassword',
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run:

```bash
npx ts-node prisma/seed.ts
```

## ✅ Useful Commands

| Command                             | Description                      |
| ----------------------------------- | -------------------------------- |
| `npx prisma generate`               | Regenerate Prisma client         |
| `npx prisma migrate dev --name xyz` | Create and apply a new migration |
| `npx prisma studio`                 | Visual DB browser (dev only)     |
| `npm run dev`                       | Start dev server (with Nodemon)  |
| `npm run build`                     | Compile TypeScript to JS         |
| `npm start`                         | Start production server          |

## 🔒 Notes on Security

* Use hashing (e.g., bcrypt) for passwords (not shown here).
* Sanitize user input and validate DTOs (e.g., using `zod`).
* Set proper CORS policies in production.

## 📦 Future Improvements (Suggestions)

* Add request validation (e.g. with `zod`)
* Add JWT-based authentication
* Add global error handling middleware
* Add logging (e.g., `winston` or `pino`)
* Add testing (e.g., Jest + Supertest)