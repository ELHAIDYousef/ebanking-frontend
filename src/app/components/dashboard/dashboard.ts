import {
  Component, OnInit, AfterViewInit,
  ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account';
import { CustomerService } from '../../services/customer';
import { BankAccount, CurrentAccount, SavingAccount } from '../../models/account.model';
import { Customer } from '../../models/customer.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {

  customers: Customer[] = [];
  accounts: BankAccount[] = [];
  isLoading: boolean = true;

  // Stats
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;
  totalCurrentAccounts: number = 0;
  totalSavingAccounts: number = 0;
  activatedAccounts: number = 0;
  suspendedAccounts: number = 0;

  // Charts
  private accountTypeChart?: Chart;
  private accountStatusChart?: Chart;
  private balanceChart?: Chart;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {}

  loadData(): void {
    this.isLoading = true;

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.totalCustomers = customers.length;

        this.accountService.getAccounts().subscribe({
          next: (accounts) => {
            this.accounts = accounts;
            this.computeStats();
            this.isLoading = false;
            this.cdr.detectChanges();

            setTimeout(() => {
              this.buildCharts();
            }, 100);
          }
        });
      }
    });
  }

  computeStats(): void {
    this.totalAccounts = this.accounts.length;

    this.totalCurrentAccounts = this.accounts.filter(
      a => a.type === 'CurrentAccount'
    ).length;

    this.totalSavingAccounts = this.accounts.filter(
      a => a.type === 'SavingAccount'
    ).length;

    this.activatedAccounts = this.accounts.filter(
      a => a.status === 'ACTIVATED'
    ).length;

    this.suspendedAccounts = this.accounts.filter(
      a => a.status === 'SUSPENDED'
    ).length;

    this.totalBalance = this.accounts.reduce((sum, a) => {
      return sum + (a.balance || 0);
    }, 0);
  }

  buildCharts(): void {
    this.buildAccountTypeChart();
    this.buildAccountStatusChart();
    this.buildBalancePerCustomerChart();
  }

  buildAccountTypeChart(): void {
    const canvas = document.getElementById(
      'accountTypeChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.accountTypeChart) {
      this.accountTypeChart.destroy();
    }

    this.accountTypeChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Current Accounts', 'Saving Accounts'],
        datasets: [{
          data: [this.totalCurrentAccounts, this.totalSavingAccounts],
          backgroundColor: ['#0d6efd', '#198754'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  buildAccountStatusChart(): void {
    const canvas = document.getElementById(
      'accountStatusChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.accountStatusChart) {
      this.accountStatusChart.destroy();
    }

    const created = this.accounts.filter(
      a => a.status === 'CREATED'
    ).length;

    this.accountStatusChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Activated', 'Suspended', 'Created'],
        datasets: [{
          data: [
            this.activatedAccounts,
            this.suspendedAccounts,
            created
          ],
          backgroundColor: ['#198754', '#dc3545', '#ffc107'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  buildBalancePerCustomerChart(): void {
    const canvas = document.getElementById(
      'balanceChart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.balanceChart) {
      this.balanceChart.destroy();
    }

    const customerBalances = this.customers.map(customer => {
      const customerAccounts = this.accounts.filter(
        a => a.customerDTO?.id === customer.id
      );
      const balance = customerAccounts.reduce(
        (sum, a) => sum + (a.balance || 0), 0
      );
      return { name: customer.name, balance };
    });

    this.balanceChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: customerBalances.map(c => c.name),
        datasets: [{
          label: 'Total Balance (MAD)',
          data: customerBalances.map(c => c.balance),
          backgroundColor: '#0d6efd',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                value.toLocaleString() + ' MAD'
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.accountTypeChart?.destroy();
    this.accountStatusChart?.destroy();
    this.balanceChart?.destroy();
  }
}