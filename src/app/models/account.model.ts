import { Customer } from './customer.model';

export interface AccountOperation {
  id:            number;
  operationDate: Date;
  amount:        number;
  type:          'DEBIT' | 'CREDIT';
  description:   string;
}

export interface BankAccount {
  id:          string;
  balance:     number;
  createdAt:   Date;
  status:      'CREATED' | 'ACTIVATED' | 'SUSPENDED';
  currency:    string;
  customerDTO: Customer;
  type:        string;
}

export interface CurrentAccount extends BankAccount {
  overDraft: number;
}

export interface SavingAccount extends BankAccount {
  interestRate: number;
}

export interface AccountHistory {
  accountId:           string;
  balance:             number;
  currentPage:         number;
  totalPages:          number;
  pageSize:            number;
  accountOperationDTOS: AccountOperation[];
}