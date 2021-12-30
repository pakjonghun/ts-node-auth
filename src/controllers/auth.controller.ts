import { Request, Response } from "express";
import { Joi } from "express-validation";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { verify } from "jsonwebtoken";

const registerValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = registerValidation.validate(body);

  if (error) {
    res.status(400).json(error.details);
    return;
  }

  if (body.password !== body.passwordConfirm) {
    res.status(400).json("password confirm check plz");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const user = new userModel({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: hashedPassword,
  });

  const result = await user.save();
  const { password, ...data } = await result.toJSON();
  res.status(201).json(data);
};

export const login = async (req: Request, res: Response) => {
  const body = req.body;

  const user = await userModel.findOne({ email: body.email });
  if (!user) res.status(404).json({ message: "no user" });
  const isPasswordCorrect = await bcrypt.compare(body.password, user!.password);
  if (!isPasswordCorrect) res.status(400).json({ message: "wrong password" });

  const token = jwt.sign({ id: user!._id }, process.env.SECRET!);
  const { password, ...rest } = await user!.toJSON();
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
  res.status(203).json({ user: rest });
};

export const user = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies["jwt"];

    const payload: any = verify(cookie, process.env.SECRET!);

    if (!payload) {
      res.status(401).json({ message: "unauthorized" });
    }

    const user = await userModel.findById(payload.id);

    if (!user) {
      res.status(404).json({ message: "no user" });
    }

    const { password, ...rest } = await user!.toJSON();

    res.status(200).json(rest);
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.sendStatus(200);
};
