import bcrypt from "bcrypt";
import db from "../models/index";
import {errorResponse, successResponse} from '../utils/responses';
import { Request, Response, NextFunction } from "express";
import jwtHelper from "../utils/jwt";

const { generateToken } = jwtHelper;
/**
 * @class UserController
 * @description create, verify and log in user
 * @exports UserController
 */
export default class UserController {
  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password } = req.body;
      const Email = email.toLowerCase();
      const EmailExist = await db.users.findUnique({where: {email: Email}});
      if (EmailExist) return errorResponse(res, 409, "Email already used by another user." );
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await db.users.create({
        data: {
          email: Email, name, password: hashedPassword
        }});
      return successResponse(res, 201,"User created Successfuly, Kindly log in!");
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const Email = email.toLowerCase();
      const user = await db.users.findUnique({
        where: { email: Email }
        });
      if (!user) return errorResponse(res, 404,"Email does not exist.");
      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) return errorResponse(res, 400, "Password is not correct!.");
      let { name, id } = user;
      const token = await generateToken({ id, name, email });
      const loggedUser = await db.users.findUnique({
        where: { email: Email },
        select: { id: true, email:true, name: true, balance: true },
        });
      return successResponse(res, 200, "User Logged in Successfully.", {token, loggedUser});
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getUserBenficiaries(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req?.user;
      const users = await db.beneficiary.findMany({where:{owner: id} });
      return successResponse(res, 200, "Successfully retrived all beneficiaries",users);
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }

  static async addBeneficiaryAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { beneficiaryId } = req.params;
      const ownerDetails = await db.users.findFirst({where: { id}});
      if (!ownerDetails) return res.status(409).json({ status: 409, error: " Sorry account does not exists" });
      
      const accountExist = await db.beneficiary.findFirst({where: { owner: id, beneficiaryId}});
      if (accountExist) return res.status(409).json({ status: 409, error: "Beneficiary account already exists" });
      const beneficiaryDetails = await db.users.findFirst({where: { id: beneficiaryId}});
      if (!beneficiaryDetails) return res.status(409).json({ status: 409, error: " Beneficiary does not exists" });
      const { name, email } = beneficiaryDetails;
      const beneficiary = await db.beneficiary.create({
        data: { 
        owner: ownerDetails.id, beneficiaryName: name , beneficiaryEmail: email, beneficiaryId
      }});
      return successResponse(res, 201, "Successfully added beneficiary account.", beneficiary);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

}
