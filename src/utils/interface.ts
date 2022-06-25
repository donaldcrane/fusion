import { Request } from "express";

export interface CustomRequest {
  user: IUser
}
export interface IUserRequest extends Request {
    user: any
}

export interface IUser {
   id?: string        
  email: string        
  password: string
  name?: string
  createdAt?: Date     
  updatedAt?: Date        
}

export interface ILogin {    
  email: string        
  password: string      
}

export interface IBeneficiary {    
  beneficiaryId: string        
}

export interface IDebit {    
  email: string        
  amount: number        
}

export interface ICredit {    
  amount: number        
}

export interface IDebitValidate {    
  debitId: string        
}

export interface ICreditValidate {    
  creditId: string        
}