import { defineConfig } from "@prisma/config";
import path from "path";
import dotenv from "dotenv";

// Buscando o .env na raiz do projeto
dotenv.config({ path: path.join(__dirname, "../../.env") });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
