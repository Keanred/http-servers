import { Request, Response } from "express";

type RequestBody = {
  body: string;
};
const badWords = ["kerfuffle", "sharbert", "fornax"];
const profaneReplacement = "****";

export const validateHandler = async (
  req: Request<unknown, unknown, RequestBody>,
  res: Response,
): Promise<void> => {
  const { body } = req.body;

  if (typeof body !== "string") {
    res.status(400).json({ error: "Something went wrong" });
    return;
  }

  if (body.length > 140) {
    throw new Error("Chirp is too long");
  }

  const cleanedBody = body
    .split(" ")
    .map((word) => badWords.includes(word.toLowerCase()) ? profaneReplacement : word)
    .join(" ");

  res.status(200).json({ cleaned_body: cleanedBody });
};
