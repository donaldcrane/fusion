import {Router} from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/authenticate";
import validator from "../middlewares/validator";

import { validateSignup, validateLogin, beneficiaryValidation} from "../validations/user";

const router = Router();
const { verifyToken } = Authentication;
const {
  registerUser, loginUser, getUserBenficiaries, addBeneficiaryAccount
} = UserController;

router.post("/signin",validator(validateLogin), loginUser);
router.post("/signup",validator(validateSignup), registerUser);
router.post("/beneficiary/:beneficiaryId",verifyToken, validator(beneficiaryValidation), addBeneficiaryAccount);

router.get("/beneficiaries", verifyToken, getUserBenficiaries);

export default router;
