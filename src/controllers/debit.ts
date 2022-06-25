import { Request, Response, NextFunction } from "express";
import {errorResponse, successResponse} from '../utils/responses';
import db from "../models/index";

/**
 * @class AdmintransactionController
 * @description create transaction, get all transactions, get a transaction, delete a transaction
 * @exports AdminController
 */
export default class AdminDebitController {
  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async sendMoney(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { email, amount } = req.body;
      if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return errorResponse(res, 422, "Invalid amount.");
      }
      const user = await db.users.findFirst({where: {id}});
      if (!user) {
        return errorResponse(res, 404, "Sorry Sender Account not found." );
      }
      const beneficiary = await db.beneficiary.findFirst({ where: { beneficiaryEmail: email } });
      if (!beneficiary) {
        return errorResponse(res, 409, "Sorry you can only send money to your beneficiaries." );
      }
      const { balance } = user;
      if (balance < amount) {
        return errorResponse(res, 409, "Sorry there is not enough money in your account.");
      }
      const receiver = await db.users.findUnique({ where: { email } });
      if (!receiver) {
        return errorResponse(res, 400, "Sorry receiver account does not exist." );
      }
      await db.users.update({
        where: {
          id: id
        }, 
        data: { balance: {increment: - amount} }
      });
      await db.users.update({
        where: {
          id: receiver.id
        }, 
        data: { balance: {increment: amount} }
      });
      const createTransaction = await db.debit.create({
        data: {
        user: user.id, amount, type: "transfer", receiver: receiver.id,
        }
      });
      
      await db.credit.create({
        data: { 
        amount,
        type: "online_transfer",
        user: receiver.id,
        sender: user.id,
       }});
      return successResponse(res, 201,"Amount has been sent successfully.", createTransaction );
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async getDebitTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user
      const transactions = await db.debit.findMany({where: { user: id}});
     return successResponse(res,  200, "Successfully retrived all Debit Transactions.", transactions);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async getDebitTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { debitId } = req.params;
      const transaction = await db.debit.findUnique({where: { id: debitId }});
      if (!transaction) return errorResponse(res, 404, "Transaction not found");
      return successResponse(res, 200, "Successfully retrived Transaction.", transaction);
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user response object
     * @returns {object} Success message
     */
  static async deleteDebitTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { debitId } = req.params;
      const transaction = await db.debit.findUnique({where: { id: debitId }});
      if (!transaction) return errorResponse(res, 404, "Transaction not found.");
      await db.debit.delete({where: { id: debitId}});
      return successResponse(res, 200, "Successfully Deleted transaction.");
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }
  
}
