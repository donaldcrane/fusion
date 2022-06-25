import { Request, Response, NextFunction } from "express";
import db from "../models/index";
import {errorResponse, successResponse} from '../utils/responses';
import Payment from "../middlewares/paystack";

const { initializePayment, verifyPayment } = Payment;

/**
 * @class creditController
 * @description create transaction, get all transactions, get a transaction, delete a transaction
 * @exports creditController
 */
export default class creditController {
  static async addMoney(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return errorResponse(res, 422, "Invalid amount.");
      }

      const user = await db.users.findUnique({where: {id}});
      if (!user) return errorResponse(res, 400, "user does not exist");

      const transaction = await db.credit.create({
        data: { 
        amount,
        type: "card_payment",
        user: user.id,
        sender: user.id,
       }});

      const paystack_data = {
        amount: amount * 100,
        email: user.email,
        metadata: {
          senderName: user.name,
          userId: user.id,
          transactionId: transaction.id,
        },
      };
      const paymentDetails = await initializePayment(paystack_data);

      return successResponse(res, 201, "Transaction Created", paymentDetails);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user errorResponse object
   * @returns {object} Success message
   */
  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { trxref } = req.query;
      if (!trxref) return errorResponse(res, 404, "No transaction reference found.");

      const resp: any = await verifyPayment(trxref as string );
      const { data } = resp.data;
      const transaction = await db.credit.findUnique({ where: { id: data.metadata.transactionId } });
      if (!transaction) {
        return errorResponse(res, 404, "Transaction record not found, please contact support");
      }
      await db.credit.update({
        where: {
          id: data.metadata.transactionId
        }, 
        data: { reference: data.reference }
      });

      if (transaction.status !== "pending" && transaction.status !== "failed") {
        return errorResponse(res, 400, "Transaction already settled");
      }

      await db.users.update({
        where: {
          id: transaction.user
        }, 
        data: { balance: {increment: data.amount} }
      });
      await db.credit.update({
        where: { id: data.metadata.transactionId }, 
        data: { status: data.status }
      });
      const Transaction = await db.credit.findUnique({
        where: {
          id: data.metadata.transactionId
        }
      });
      return successResponse(res, 200, "Transaction verified Successfully.", Transaction);
    } catch (error) {
      return errorResponse(res, 500, "Server error." );
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user errorResponse object
     * @returns {object} Success message
     */
  static async getUserCredits(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await db.credit.findMany();
      return successResponse(res, 200, "Successfully retrived all Credit Transactions.", transactions);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user errorResponse object
     * @returns {object} Success message
     */
  static async getUserCreditById(req: Request, res: Response, next: NextFunction) {
    try {
      const { creditId } = req.params;
      const transaction = await db.credit.findUnique({where: { id: creditId}});
      if (!transaction) return errorResponse(res, 404, "Transaction not found" );
      return successResponse(res,  200, "Successfully retrived Transaction.", transaction,);
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }

  /**
     * @param {object} req - The user request object
     * @param {object} res - The user errorResponse object
     * @returns {object} Success message
     */
  static async deleteCreditTransaction(req: Request, res: Response, next: NextFunction) {
    try {
       const { creditId } = req.params;
      const transaction = await db.credit.findUnique({where: { id: creditId}});
      if (!transaction) return errorResponse(res, 404, "Transaction not found." );
      await db.credit.delete({where: { id: creditId}});
      return successResponse(res, 200, "Successfully Deleted transaction.");
    } catch (error) {
      return errorResponse(res, 500,  "Resource not found.");
    }
  }

  static async paystackWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body;
      if (data.status === "success" && data.gateway_response === "Successful")
        return successResponse(res, 200, "Transaction was Successful");

      return successResponse(res, 200, "Transaction was not Successful");
    } catch (error) {
      return errorResponse(res, 500, "Server error." );
    }
  }
}
