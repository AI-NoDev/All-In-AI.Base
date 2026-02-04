import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

export const corsPlugin = new Elysia({ name: "plugin/cors" })
  .use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
