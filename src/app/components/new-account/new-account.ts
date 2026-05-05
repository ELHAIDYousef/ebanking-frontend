import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../services/account';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-account.html',
  styleUrl: './new-account.css'
})
export class NewAccount implements OnInit {

  customerId!: number;
  customer!: Customer;
  accountType: string = 'CURRENT';
  initialBalance: number = 0;
  overDraft: number = 0;
  interestRate: number = 0;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['customerId'];
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }

  createAccount(form: NgForm): void {
    if (form.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    const operation$ = this.accountType === 'CURRENT'
      ? this.accountService.createCurrentAccount(
          this.customerId,
          this.initialBalance,
          this.overDraft
        )
      : this.accountService.createSavingAccount(
          this.customerId,
          this.initialBalance,
          this.interestRate
        );

    operation$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/accounts'], {
          queryParams: {
            customerId: this.customerId,
            customerName: this.customer.name
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.errorMessage || err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}