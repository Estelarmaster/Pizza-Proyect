import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/layout/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showHeader = true;

  // Routes where header should be hidden
  private headerlessRoutes = [
    '/',
    '/login',
    '/register',
    '/order-confirmation',
    '/profile'
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check auth status on app init
    this.authService.checkAuthStatus();

    // Listen to route changes to toggle header visibility
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = !this.headerlessRoutes.some(route => 
          event.url === route || event.url.startsWith('/order-confirmation')
        );
      });
  }
}
