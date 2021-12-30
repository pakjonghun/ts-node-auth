import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Joi } from "express-validation";
import resetModel from "../models/reset.model";
import { createTransport } from "nodemailer";
import userModel from "../models/user.model";
const validation = Joi.object({
  email: Joi.string().email().required(),
});

const transport = createTransport({
  host: "0.0.0.0",
  port: 1025,
});

export const forget = async (req: Request, res: Response) => {
  const body = req.body;

  const { error } = validation.validate(body);

  if (error) {
    res.status(400).json({ message: "wrong email type" });
    return;
  }

  const token = Math.random().toString(20).substring(2, 12);

  const reset = new resetModel({
    token,
    email: body.email,
  });

  reset.save();

  const url = `http://localhost:3000/reset/${token}`;
  console.log(body.email);
  await transport.sendMail({
    from: "fireking5997@gmail.com",
    to: body.email,
    subject: "reset password ",
    html: `<a href=${url}>click here</a> to reset password`,
  });

  res.status(200).json({ message: "send email" });
};

export const reset = async (req: Request, res: Response) => {
  const body = req.body;

  if (body.password !== body.passwordConfirm) {
    res.status(400).json({ message: "wrong password" });
    return;
  }

  const resetPassword = await resetModel.findOne({ token: body.token });

  if (!resetPassword) {
    res.status(404).json({ message: "no reset wrong token" });
    return;
  }

  const { email } = await resetPassword.toJSON();
  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "no user" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(body.password, salt);
  user.save();

  res.status(200).json({ message: "success" });
};
