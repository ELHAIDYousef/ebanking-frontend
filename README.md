# E-Banking Frontend

> A modern Angular 19 Digital Banking web application with JWT authentication, role-based access control, and an AI-powered chat assistant.

**Author:** ELHAID Yousef  
**Institution:** ENSET Mohammedia  
**Academic Year:** 2025–2026

---

## Screenshots

### Login Page
![alt text](imgs/image.png)

### Dashboard
![alt text](imgs/image-1.png)

### Customers List
![alt text](imgs/image-5.png)

### Accounts List
![alt text](imgs/image-2.png)

### Account Details & Operations
![alt text](imgs/image-3.png)

### AI Chat Assistant
![alt text](imgs/image-4.png)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 19 | Frontend framework |
| TypeScript | 5.x | Language |
| Bootstrap | 5.3 | UI styling |
| Bootstrap Icons | 1.x | Icons |
| Chart.js | 4.x | Dashboard charts |
| RxJS | 7.x | Reactive programming |

---

## Project Structure

```
src/app/
├── components/
│   ├── login/                  # Login page
│   ├── navbar/                 # Top navigation bar
│   ├── dashboard/              # Stats + ChartJS charts
│   ├── customers/              # Customer list + search
│   ├── new-customer/           # Create customer form
│   ├── edit-customer/          # Edit customer form
│   ├── accounts/               # Account list + filter
│   ├── account-details/        # Operations + debit/credit/transfer
│   ├── new-account/            # Create account form
│   └── chat/                   # AI chat widget
├── services/
│   ├── auth.service.ts         # Login, logout, token management
│   ├── customer.ts             # Customer HTTP calls
│   └── account.ts              # Account HTTP calls
├── guards/
│   ├── auth.guard.ts           # Blocks unauthenticated users
│   └── admin.guard.ts          # Blocks non-admin users
├── interceptors/
│   └── auth.interceptor.ts     # Adds JWT token to every request
├── models/
│   ├── customer.model.ts       # Customer interface
│   └── account.model.ts        # BankAccount, AccountHistory interfaces
├── environments/
│   └── environment.development.ts
├── app.routes.ts               # Application routes
├── app.config.ts               # App configuration
├── app.ts                      # Root component
└── app.html                    # Root template
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 19
- E-Banking Backend running on port 8085

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/ELHAIDYousef/ebanking-frontend.git
cd ebanking-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**

Open `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  backendUrl: 'http://localhost:8085/api'
};
```

**4. Run the application**
```bash
ng serve
```

Open `http://localhost:4200`

---

## Features

### Authentication
- JWT-based login with token stored in `localStorage`
- Automatic redirect to login when token is missing or expired
- Logout clears token and redirects to login

### Role-based Access Control

| Feature | ADMIN | USER |
|---|---|---|
| View Dashboard | ✅ | ✅ |
| View Customers | ✅ | ✅ |
| Add Customer | ✅ | ❌ |
| Edit Customer | ✅ | ❌ |
| Delete Customer | ✅ | ❌ |
| View Accounts | ✅ | ✅ |
| Create Account | ✅ | ❌ |
| Debit / Credit | ✅ | ✅ |
| Transfer | ✅ | ✅ |
| AI Chat | ✅ | ✅ |

### Dashboard
- Total customers count
- Total accounts count
- Total balance across all accounts
- Account type chart (Current vs Saving) — Doughnut
- Account status chart (Activated/Suspended/Created) — Pie
- Balance per customer — Bar chart

### Customers
- List all customers with search by name or email
- Create new customer (ADMIN only)
- Edit customer (ADMIN only)
- Delete customer with confirmation (ADMIN only)
- Navigate to customer accounts
- Create new account for customer (ADMIN only)

### Accounts
- List all accounts with search and type filter
- View specific customer accounts
- Account cards showing balance, type, status, currency

### Account Details
- Paginated operation history
- Debit operation form
- Credit operation form
- Transfer between accounts form

### AI Chat Assistant
- Floating chat bubble (bottom right corner)
- Powered by OpenAI GPT-4o-mini via Spring AI
- Can answer questions about customers, accounts, balances
- Same AI engine as the Telegram bot

---

## Routing

| Route | Guard | Description |
|---|---|---|
| `/login` | None | Login page |
| `/dashboard` | authGuard | Dashboard with charts |
| `/customers` | authGuard | Customer list |
| `/customers/new` | authGuard + adminGuard | Create customer |
| `/customers/edit/:id` | authGuard + adminGuard | Edit customer |
| `/customers/:id/accounts/new` | authGuard + adminGuard | Create account |
| `/accounts` | authGuard | Account list |
| `/accounts/:id` | authGuard | Account details |

---

## HTTP Interceptor

Every HTTP request automatically includes the JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

This is handled transparently by `auth.interceptor.ts` — no manual token management needed in services.

---

## Environment Variables

```typescript
// src/environments/environment.development.ts
export const environment = {
  production: false,
  backendUrl: 'http://localhost:8085/api'
};
```



