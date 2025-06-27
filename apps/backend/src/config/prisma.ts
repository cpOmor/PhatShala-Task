import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma; 
// This file initializes a Prisma Client instance for database operations.
// It imports the PrismaClient from the '@prisma/client' package and creates an instance.
// The instance is exported as the default export of the module, allowing it to be imported and
// used in other parts of the application for database interactions.
// The Prisma Client is a type-safe database client that provides an easy-to-use API for querying           