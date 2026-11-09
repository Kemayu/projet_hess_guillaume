import { Request, Response } from "express";
import db from "../models";
import { PollutionCreationAttributes } from "../models/pollutions.model";

const Pollutions = db.pollutions;

const fields = [
  "title",
  "type",
  "description",
  "observationDate",
  "location",
  "latitude",
  "longitude",
  "photoUrl"
] as const;

const getId = (req: Request): number | null => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getPayload = (body: unknown): PollutionCreationAttributes => {
  if (!body || typeof body !== "object") {
    throw new Error("Le corps de la requête est invalide.");
  }

  const input = body as Record<string, unknown>;
  const missing = fields
    .filter((field) => field !== "photoUrl" && (typeof input[field] !== "string" || input[field] === ""))
    .filter((field) => field !== "latitude" && field !== "longitude");
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);

  if (missing.length > 0 || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Les données de pollution sont invalides.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Les coordonnées sont invalides.");
  }

  return {
    title: input.title as string,
    type: input.type as string,
    description: input.description as string,
    observationDate: input.observationDate as string,
    location: input.location as string,
    latitude,
    longitude,
    photoUrl: typeof input.photoUrl === "string" && input.photoUrl !== "" ? input.photoUrl : null
  };
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des données de pollution: " + message
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant est invalide." });
    return;
  }
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      message: `Erreur lors de la récupération de la pollution id=${id}: ` + message
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const pollution = await Pollutions.create(getPayload(req.body));
    res.status(201).json(pollution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant est invalide." });
    return;
  }
  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }
    await pollution.update(getPayload(req.body));
    res.status(200).json(pollution);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(400).json({ message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = getId(req);
  if (id === null) {
    res.status(400).json({ message: "L'identifiant est invalide." });
    return;
  }
  try {
    const deleted = await Pollutions.destroy({ where: { id } });
    if (deleted === 0) {
      res.status(404).json({ message: `Aucune pollution trouvée avec l'id=${id}.` });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: "Erreur lors de la suppression : " + message });
  }
};

export default { getAll, getById, create, update, remove };
