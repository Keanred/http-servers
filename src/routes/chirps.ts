import { UUID } from "crypto";
import { Request, Response } from "express";
import { BadRequestError, InternalServerError } from '../errors/errors';
import { getAllChirps, insertChirp } from '../db/queries/chirps';

type ChirpParams = {
  body: string,
  userId: UUID
}

const badWords = ["kerfuffle", "sharbert", "fornax"];
const profaneReplacement = "****";

export const createChirp = async (req: Request, res: Response) => {
  const { body, userId }: ChirpParams = req.body;

  if (!body || !userId) {
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
