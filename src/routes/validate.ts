import { Request, Response } from "express";
import type { RequestBody } from '../types/requestBody';
import { BadRequestError } from '../errors/errors';

const badWords = ["kerfuffle", "sharbert", "fornax"];
const profaneReplacement = "****";

export const validate = async (
  req: Request<unknown, unknown, RequestBody>,
  res: Response,
): Promise<void> => {
  const { body } = req.body;

  if (typeof body !== "string") {
    res.status(400).json({ error: "Something went wrong" });
    return;
  }

  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = body
    .split(" ")
    .map((word) => badWords.includes(word.toLowerCase()) ? profaneReplacement : word)
    .join(" ");

  res.status(200).json({ cleaned_body: cleanedBody });
};
