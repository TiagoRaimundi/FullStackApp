import { getFavorite, toggleFavorite } from "#/controllers/favorite";
import { isVerified, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router()

router.post("/", mustAuth, isVerified, toggleFavorite)
router.get("/", mustAuth, getFavorite)

export default router