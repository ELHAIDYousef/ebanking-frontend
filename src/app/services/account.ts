import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AccountHistory, BankAccount } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}/accounts`);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/accounts/${id}`);
  }

  getCustomerAccounts(customerId: number): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(
      `${this.apiUrl}/customers/${customerId}/accounts`
    );
  }

  getAccountHistory(
    accountId: string,
    page: number,
    size: number
  ): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(
      `${this.apiUrl}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`
    );
  }

  debit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/debit`, {
      accountId, amount, description
    });
  }

  credit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/credit`, {
      accountId, amount, description
    });
  }

  transfer(
    accountSource: string,
    accountDestination: string,
    amount: number
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/transfer`, {
      accountSource, accountDestination, amount
    });
  }
}