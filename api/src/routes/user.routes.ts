import { Application, Router } from "express";
import userController from "../controllers/user.controllers";
import { authenticate } from "../middlewares/auth.middleware";

export default (app: Application): void => {
  const router = Router();

  // Inscription publique, liste réservée aux utilisateurs connectés
  router.get("/", authenticate, userController.getAll);
  router.post("/", userController.create);

  app.use("/api/users", router);
};
