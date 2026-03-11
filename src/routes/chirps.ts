import { Request, Response } from "express";
import { UnauthorizedError, BadRequestError, NotFoundError, InternalServerError, ForbiddenError } from '../errors/errors';
import { deleteChirpById, getAllChirps, getChirpById, insertChirp } from '../db/queries/chirps';
import { getBearerToken, validateJWT } from '../auth';
import { config } from "src/config";

type CreateChirpParams = {
  body: string,
}

type GetChirpParams = {
  id: string
}

const badWords = ["kerfuffle", "sharbert", "fornax"];
const profaneReplacement = "****";

export const createChirp = async (req: Request, res: Response) => {
  const { body } = req.body as CreateChirpParams;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.apiConfig.SECRET);
  if (!userId) {
    throw new UnauthorizedError("Invalid token");
  }
  if (!body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = body
    .split(" ")
    .map((word) => badWords.includes(word.toLowerCase()) ? profaneReplacement : word)
    .join(" ");

  const result = await insertChirp({ body: cleanedBody, userId });

  if (!result) {
    throw new InternalServerError("Failed to create chirp");
  }

  res.status(201).json(result);
};

export const getChirps = async (req: Request, res: Response) => {
  const result = await getAllChirps();
  if (!result) {
    throw new InternalServerError("Failed to fetch chirps");
  }
  res.status(200).json(result);
}

export const getChirp = async (req: Request, res: Response) => {
  const { id } = req.params as GetChirpParams;
  if (!id) {
    throw new BadRequestError("Missing chirp ID");
  }
  const result = await getChirpById(id);
  if (!result) {
    throw new NotFoundError("Chirp not found");
  }
  res.status(200).json(result);
}

export const deleteChirp = async (req: Request, res: Response) => {
  const { id } = req.params as GetChirpParams;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.apiConfig.SECRET);
  if (!userId) {
    throw new UnauthorizedError("Invalid token");
  }
  if (!id) {
    throw new BadRequestError("Missing chirp ID");
  }
  const chirp = await getChirpById(id);
  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }
  if (chirp.userId !== userId) {
    throw new ForbiddenError("You can only delete your own chirps");
  }

  await deleteChirpById(id);
  res.status(204).send();
}
