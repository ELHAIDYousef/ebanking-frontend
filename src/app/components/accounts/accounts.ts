import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account';
import { BankAccount } from '../../models/account.model';
import { DatePipe, DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {

  accounts: BankAccount[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  customerName: string = '';

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.customerName = params['customerName'] || '';
        this.loadCustomerAccounts(+params['customerId']);
      } else {
        this.loadAllAccounts();
      }
    });
  }

  loadAllAccounts(): void {
    this.isLoading = true;
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
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

  loadCustomerAccounts(customerId: number): void {
    this.isLoading = true;
    this.accountService.getCustomerAccounts(customerId).subscribe({
      next: (data) => {
        this.accounts = data;
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

  viewDetails(account: BankAccount): void {
    this.router.navigate(['/accounts', account.id]);
  }

  getAccountType(account: BankAccount): string {
    return account.type === 'CurrentAccount' ? 'Current' : 'Saving';
  }

  getAccountTypeClass(account: BankAccount): string {
    return account.type === 'CurrentAccount'
      ? 'badge bg-primary'
      : 'badge bg-success';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVATED': return 'badge bg-success';
      case 'SUSPENDED': return 'badge bg-danger';
      default:          return 'badge bg-warning text-dark';
    }
  }
}