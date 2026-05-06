import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class Customers implements OnInit {

  customers: Customer[] = [];
  errorMessage: string = '';
  searchKeyword: string = '';
  isLoading: boolean = false;

constructor(
  private customerService: CustomerService,
  public authService: AuthService,
  private router: Router,
  private route: ActivatedRoute,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
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

  searchCustomers(): void {
    if (!this.searchKeyword.trim()) {
      this.loadCustomers();
      return;
    }
    this.isLoading = true;
    this.customerService.searchCustomers(this.searchKeyword).subscribe({
      next: (data) => {
        this.customers = data;
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

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== customer.id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        }
      });
    }
  }

  viewAccounts(customer: Customer): void {
    this.router.navigate(['/accounts'], {
      queryParams: {
        customerId: customer.id,
        customerName: customer.name
      }
    });
  }
}