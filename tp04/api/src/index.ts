import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import db from "./models";
import initRoutes from "./routes";

const app: Application = express();

const configuredOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);
const corsOptions: CorsOptions = {
  origin: configuredOrigins?.length ? configuredOrigins : "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  exposedHeaders: "Authorization"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// health checks
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Pollution API." });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

initRoutes(app);

// set port, listen on 0.0.0.0 for Render and container environments
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const start = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log("Database connected and synchronized.");
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}.`);
    });
  } catch (err: unknown) {
    console.error("Unable to start the API:", err);
    process.exitCode = 1;
  }
};

void start();

export default app;
