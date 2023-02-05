import express, { Request, Response } from 'express';
import { lutimes } from 'fs/promises';
import { User, Transaction, TransactionDTO } from './classes';
import { validationUserExists, CPFvalidator, validationData } from './middlewares';
import { validationDataTransactions } from './middlewares/validationDataTransactions';
import { validationTransactionsExist } from './middlewares/validationTransactionsExiste';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* USUARIO */

export const listUsers: Array<User> = [];

// POST

app.post('/users', validationData, CPFvalidator, (request: Request, response: Response) => {
  const { name, cpf, email, age } = request.body;

  const newCPF = cpf.replace(/[^a-zA-Z0-9]/g, '');

  const newUser = new User({ name, cpf: newCPF, email, age })
  listUsers.push(newUser);

  console.log(listUsers);


  return response
    .status(201)
    .json({
      body: newUser.handleProperties(),
      message: 'User created sucessfull, bro',
    });
});

// GET - ID - não pode mostrar a lista de transações
app.get('/users/:id', validationUserExists,(request: Request, response: Response) => {
  const { id } = request.params
 
  const user = listUsers.find((user) =>  user.id === id) as User;

  return response
    .status(201)
    .json({ user: user.handleProperties(), message: 'its list, bro' });
});


// GET USERS - query cpf, name, email
app.get('/users', (request: Request, response: Response) => {
  const { name, email, cpf } = request.query 

  const users = listUsers.filter((user) => {
    if(name && email && cpf) {
      return (
        user.name.includes(name as string) &&
        user.cpf.includes(cpf as string) &&
        user.email.includes(email as string)
      ); 
    }

    if (name || email || cpf) {
      return (
        user.name.includes(name as string) ||
        user.cpf.includes(cpf as string) ||
        user.email.includes(email as string)
      );
    }

    return user
  })
    
    return response
    .status(201)
    .json({ users: users.map((user) => user.handleProperties()) , message: 'its list, bro' });

})

// PUT - 
app.put('/users/:id', validationUserExists, (request: Request, response: Response) => {
    const { id } = request.params
    const { name, email, cpf, age } = request.body

    const userIndex = listUsers.findIndex(user => user.id === id);

    listUsers[userIndex].name = name ?? listUsers[userIndex].name;
    listUsers[userIndex].email = email ?? listUsers[userIndex].email;
    listUsers[userIndex].cpf = cpf ?? listUsers[userIndex].cpf;
    listUsers[userIndex].age = age ?? listUsers[userIndex].age;

    return response.status(200).json({ user: listUsers[userIndex].handleProperties() , message: 'its list, bro' });
})

// DELETE - USER

app.delete('/users/:id', validationUserExists, (request: Request, response: Response) => {
  const { id } = request.params
  const userIndex = listUsers.findIndex(user => user.id === id);

  listUsers.splice(userIndex, 1);

  return response.status(200).json({ user: listUsers, message: 'Was deleted, bro' });
})



/* TRANSAÇÕES */

// POST - TRANSACTIONS
export const listTransactions : Array<Transaction> = []

app.post('/user/:id/transaction', validationUserExists, validationDataTransactions, (request: Request, response: Response) => {
  const {id} = request.params
  const { title, value, type} = request.body

  const newTransaction = new Transaction({title, value, type})
  listTransactions.push(newTransaction)

  const userIndex = listUsers.findIndex(user => user.id === id);
  listUsers[userIndex].transactions = listTransactions;
 
return response.status(200).json({transaction: newTransaction.handlePropertiesTran(), message: 'Your transactions was successfully'})

})

// GET - TRANSACTIONS por id
app.get('/user/:id/transaction/:idTransaction', validationUserExists, (request: Request, response: Response) => {
  const {id, idTransaction} = request.params

  if(!idTransaction){
    return response.status(400).json({ message: 'You need send a id for the transaction' });
  }

  const existeTransaction = listTransactions.find((transaction) => transaction.id === idTransaction);
  return response.status(200).json({transaction: existeTransaction?.handlePropertiesTran()})
})

// GET - TRANSACTIONS por filtro

app.get('/user/:id/transactions', validationUserExists, (request: Request, response: Response) => {
  const {id} = request.params
  const { title, type} = request.query 

  const userIndex = listUsers.findIndex(user => user.id === id);

  const transactionsFiltred = listUsers[userIndex].transactions?.filter((transaction) => {
    if(title && type){
      return transaction.title === title && transaction.type === type;
    }

    if(title || type){
      return transaction.title === title || transaction.type === type;
    }

    return transaction;
  })

  const transactionsIncome = listUsers[userIndex].transactions?.filter((transaction)=> transaction.type == 'income')

  let somaIncome = transactionsIncome?.reduce((acumulador, proximo) => {
    return Number(acumulador) + Number(proximo.value);
  }, 0)

  const transactionsOutcome = listUsers[userIndex].transactions?.filter((transaction)=> transaction.type == 'outcome')

  let somaOutcome = transactionsOutcome?.reduce((acumulador, proximo) => {
    return Number(acumulador) + Number(proximo.value);
  }, 0)

  return response.status(200).json({
    transaction: transactionsFiltred?.map((transaction) => transaction.handlePropertiesTran()), 
    balance:{
      income: somaIncome, 
      outcome: somaOutcome
    }
  })
})



// PUT - TRANSACTIONS 
app.put('/user/:id/transaction/:idTransaction', validationUserExists, validationTransactionsExist, (request: Request, response: Response) => {
 const { id, idTransaction } = request.params
 const { title} = request.body 

  const userIndex = listUsers.findIndex(user => user.id === id);
  const transactionIndex = listUsers[userIndex].transactions?.findIndex((transaction) => transaction.id === idTransaction);

  listUsers[userIndex].transactions?.forEach((trasaction, index) => {
    if(transactionIndex === index){
      trasaction.title = title;
    }
  })
  return response.status(200).json({
    transaction: listUsers[userIndex].transactions?.map((transaction) => transaction.handlePropertiesTran()),
    message: 'Your transaction was modificated' 
  });
})


//DELETE - TRANSACTIONS
app.delete('/user/:id/transaction/:idTransaction', validationUserExists, validationTransactionsExist, (request: Request, response: Response) => {
  const { id, idTransaction } = request.params

  const userIndex = listUsers.findIndex(user => user.id === id);
  const transactionIndex = listUsers[userIndex].transactions?.findIndex((transaction) => transaction.id === idTransaction);

   
  if(transactionIndex == undefined){
    return response.status(400).json({message: 'Transaction not found'})
  }
    
  listUsers[userIndex].transactions?.splice(transactionIndex, 1);
  return response.status(200).json({ 
    userTransactions: listUsers[userIndex].transactions?.map((transaction) => transaction.handlePropertiesTran()), 
    message: 'Was deleted, bro' 
  });
})

app.listen(8080, () => console.log('Servidor rodando'));
