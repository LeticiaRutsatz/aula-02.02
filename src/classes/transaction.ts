import { v4 as uuid} from 'uuid';

export interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome'
}

export class Transaction {
  protected _id: string;
  protected _title: string;
  protected _value: number;
  protected _type: 'income' | 'outcome';

  constructor(params: TransactionDTO){
    this._id = uuid();
    this._title = params.title;
    this._value = params.value;
    this._type = params.type
  }

  get id(){
    return this._id;
  }
  get title() {
    return this._title;
  }

  set title(title: string){
    this._title = title;
  }

  get value() {
     return this._value;
  }

  set value(value: number){
    this.value = value;
  }

  get type() {
    return this._type;
  }

  set type(type: string){
    this._title = type;
  }

  handlePropertiesTran() {
    return {
      id: this.id, 
      title: this.title, 
      value: this.value, 
      type: this.type, 
    }
  }
}


