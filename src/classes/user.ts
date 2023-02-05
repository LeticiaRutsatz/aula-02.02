import { Transaction, TransactionDTO } from "./transaction";
import { v4 as uuid} from 'uuid';


export interface UserDTO{
  name: string,
  cpf: string,
  email: string,
  age: number,
}

export class User {
  private _name: string;
  private _cpf: string;
  private _email: string;
  private _age: number;
  private _transactions?: Transaction[];
  private _id: string; 

  constructor(params: UserDTO){
    this._name = params.name;
    this._cpf = params.cpf;
    this._email = params.email;
    this._age = params.age;
    this._transactions = [];
    this._id = uuid();
  }

  get name () {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get cpf () {
    return this._cpf;
  }
  
  set cpf(cpf: string) {
    this._cpf = cpf;
  }

  get email () {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  get age () {
    return this._age;
  }

  set age(age: number) {
    this._age = age;
  }

  get transactions () {
    return this._transactions;
  }

  set transactions (transaction : Transaction[] | undefined) {
    this._transactions = transaction;
  }

  get id () {
    return this._id;
  }

  handleProperties() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf,
      email: this.email,
      age: this.age,
    }
  }
}