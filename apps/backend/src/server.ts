import dotenv from "dotenv";
import app from "./app";
import prisma from './config/prisma';
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
}

startServer();
