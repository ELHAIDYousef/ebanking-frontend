import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account';
import { BankAccount } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {

  accounts: BankAccount[] = [];
  filteredAccounts: BankAccount[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  customerName: string = '';
  customerId: number = 0;
  searchKeyword: string = '';
  filterType: string = 'ALL';

  constructor(
    private accountService: AccountService,
    public router: Router,
    public route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['customerId']) {
        this.customerId = +params['customerId'];
        this.customerName = params['customerName'] || '';
        this.loadCustomerAccounts(this.customerId);
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
        this.filteredAccounts = data;
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
        this.filteredAccounts = data;
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

  applyFilter(): void {
    let result = this.accounts;

    // Filter by type
    if (this.filterType !== 'ALL') {
      result = result.filter(a => a.type === this.filterType);
    }

    // Filter by keyword (account id or customer name)
    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase();
      result = result.filter(a =>
        a.id.toLowerCase().includes(kw) ||
        a.customerDTO.name.toLowerCase().includes(kw)
      );
    }

    this.filteredAccounts = result;
    this.cdr.detectChanges();
  }

  clearFilter(): void {
    this.searchKeyword = '';
    this.filterType = 'ALL';
    this.filteredAccounts = this.accounts;
    this.cdr.detectChanges();
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