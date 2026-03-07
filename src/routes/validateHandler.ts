import { Request, Response } from "express";

type RequestBody = {
  body: string;
};
const badWords = ["kerfuffle", "sharbert", "fornax"];
const profaneReplacement = "****";

export const validateHandler = (req: Request<unknown, unknown, RequestBody>, res: Response) => {
  try {
    const { body } = req.body;

    if (typeof body !== "string") {
      return res.status(400).json({ error: "Something went wrong" });
    }

    if (body.length > 140) {
      return res.status(400).json({ error: "Chirp is too long" });
    }

    const cleanedBody = body
      .split(" ")
      .map((word) => badWords.includes(word.toLowerCase()) ? profaneReplacement : word)
      .join(" ");

    return res.status(200).json({ cleanedBody: cleanedBody });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};
