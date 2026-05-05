import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AccountService } from '../../services/account';
import { AccountHistory, BankAccount } from '../../models/account.model';

@Component({
  selector: 'app-account-details',
  standalone: true,
imports: [RouterLink, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css'
})
export class AccountDetails implements OnInit {

  accountId!: string;
  account!: BankAccount;
  accountHistory!: AccountHistory;
  errorMessage: string = '';
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 5;

  // Operation form
  operationType: string = 'DEBIT';
  amount: number = 0;
  description: string = '';
  transferDestination: string = '';
  operationError: string = '';
  operationSuccess: string = '';
  operationLoading: boolean = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.params['id'];
    this.loadAccount();
    this.loadHistory();
  }

  loadAccount(): void {
    this.accountService.getAccount(this.accountId).subscribe({
      next: (data) => {
        this.account = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  loadHistory(): void {
    this.isLoading = true;
    this.accountService.getAccountHistory(
      this.accountId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (data) => {
        this.accountHistory = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadHistory();
  }

  getPages(): number[] {
    if (!this.accountHistory) return [];
    return Array.from(
      { length: this.accountHistory.totalPages },
      (_, i) => i
    );
  }

  executeOperation(form: NgForm): void {
    if (form.invalid) return;

    this.operationLoading = true;
    this.operationError = '';
    this.operationSuccess = '';

    let operation$;

    if (this.operationType === 'DEBIT') {
      operation$ = this.accountService.debit(
        this.accountId, this.amount, this.description
      );
    } else if (this.operationType === 'CREDIT') {
      operation$ = this.accountService.credit(
        this.accountId, this.amount, this.description
      );
    } else {
      operation$ = this.accountService.transfer(
        this.accountId, this.transferDestination, this.amount
      );
    }

    operation$.subscribe({
      next: () => {
        this.operationSuccess = `${this.operationType} operation completed successfully`;
        this.operationLoading = false;
        this.amount = 0;
        this.description = '';
        this.transferDestination = '';
        form.resetForm();
        this.loadAccount();
        this.loadHistory();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.operationError = err.error?.errorMessage || err.message;
        this.operationLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}