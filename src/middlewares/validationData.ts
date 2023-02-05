import { NextFunction, Request, Response } from 'express';

export const validationData = (request: Request, response: Response, next: NextFunction ) => {
    const { name, cpf, email, age } = request.body;

    const newCPF = cpf?.replace(/[^a-zA-Z0-9]/g, '');

    if (!name || !newCPF || !email || !age) {
        return response.status(400).json({ message: 'Invalid format, bro' });
    }
    
     return next()
}