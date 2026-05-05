import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-customer.html',
  styleUrl: './new-customer.css'
})
export class NewCustomer {

  customer: Customer = {
    id: 0,
    name: '',
    email: ''
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  saveCustomer(form: NgForm): void {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.saveCustomer(this.customer).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.errorMessage = err.error?.errorMessage || 'An error occurred';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}