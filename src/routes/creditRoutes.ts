import { Router } from "express";
import AdminCreditController from "../controllers/credit";
import Authentication from "../middlewares/authenticate";
import validator from "../middlewares/validator";

import {
  creditValidation, validateId
} from "../validations/credit";

const router = Router();
const { verifyToken } = Authentication;
const {
  addMoney, verify, getUserCredits, getUserCreditById, deleteCreditTransaction, paystackWebhook
} = AdminCreditController;

router.get("/", verifyToken, getUserCredits);
router.get("/:creditId", verifyToken,validator(validateId), getUserCreditById);

router.get("/paystack/verify", verify);

router.post("/paystack/initialize", verifyToken,validator(creditValidation), addMoney);
router.post("/paystack/webhook", paystackWebhook);

router.delete("/:creditId", verifyToken,validator(validateId), deleteCreditTransaction);

export default router;
