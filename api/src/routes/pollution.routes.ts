import { Application, Router } from "express";
import pollutionController from "../controllers/pollution.controllers";
import { authenticate } from "../middlewares/auth.middleware";

export default (app: Application): void => {
  const router = Router();

  router.get("/", pollutionController.getAll);
  router.get("/:id", pollutionController.getById);
  // Lecture publique, écriture réservée aux utilisateurs connectés
  router.post("/", authenticate, pollutionController.create);
  router.put("/:id", authenticate, pollutionController.update);
  router.delete("/:id", authenticate, pollutionController.remove);

  app.use("/api/pollutions", router);
};
