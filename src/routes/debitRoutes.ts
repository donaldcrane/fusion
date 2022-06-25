import { Router } from "express";
import AdminDebitController from "../controllers/debit";
import Authentication from "../middlewares/authenticate";
import validator from "../middlewares/validator";

import {
  debitValidation, validateId
} from "../validations/debit";

const router = Router();
const { verifyToken } = Authentication;
const {
  sendMoney, getDebitTransactions, getDebitTransactionById, deleteDebitTransaction
} = AdminDebitController;

router.get("/", verifyToken, getDebitTransactions);
router.get("/:debitId", verifyToken,validator(validateId), getDebitTransactionById);

router.post("/", verifyToken,validator(debitValidation), sendMoney);

router.delete("/:debitId", verifyToken,validator(validateId), deleteDebitTransaction);

export default router;
