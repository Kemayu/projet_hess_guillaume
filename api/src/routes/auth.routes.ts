import { Application, Router } from "express";
import authController from "../controllers/auth.controllers";
import { authenticate } from "../middlewares/auth.middleware";

export default (app: Application): void => {
  const router = Router();

  router.post("/login", authController.login);
  router.post("/refresh", authController.refresh);
  router.post("/logout", authController.logout);
  router.get("/me", authenticate, authController.me);

  app.use("/api/auth", router);
};
