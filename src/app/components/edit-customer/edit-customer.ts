import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.css'
})
export class EditCustomer implements OnInit {

  customer: Customer = {
    id: 0,
    name: '',
    email: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.customerService.getCustomer(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.errorMessage || 'Customer not found';
        this.cdr.detectChanges();
      }
    });
  }

  updateCustomer(form: NgForm): void {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.customerService.updateCustomer(this.customer.id, this.customer).subscribe({
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