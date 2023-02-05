import { NextFunction, Request, Response } from 'express';
import { listUsers } from '..';

export const validationTransactionsExist = (request: Request, response: Response, next: NextFunction ) => {    
    const { id, idTransaction } = request.params

    if (!id || !idTransaction) {
        return response.status(400).json({ message: 'ID not found, bro' });
    }

    const userIndex = listUsers.findIndex(user => user.id === id);
    const existeTransaction = listUsers[userIndex].transactions?.some((transaction) => transaction.id == idTransaction)

    if(!existeTransaction){
        return response.status(400).json({ message: 'This transaction don´t exist!' });
    }
     return next()
}