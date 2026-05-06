import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

/**
 * @author ELHAID Yousef
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  handleSearch(keyword: string): void {
    this.router.navigate(['/customers'], {
      queryParams: { keyword }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}