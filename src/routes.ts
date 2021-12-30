import { forget, reset } from "./controllers/foreget.controller";
import { Router } from "express";
import { register, login, user, logout } from "./controllers/auth.controller";

export const routes = (router: Router) => {
  router.post("/api/login", login);
  router.post("/api/register", register);
  router.get("/api/user", user);
  router.get("/api/logout", logout);
  router.post("/api/forget", forget);
  router.post("/api/reset", reset);
};
