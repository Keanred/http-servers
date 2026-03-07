import { Request, Response } from "express";

export const validateHandler = (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (body.length > 140) {
      return res.status(400).json({ error: "Chirp is too long" });
    }
    return res.status(200).json({ "valid": true });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
