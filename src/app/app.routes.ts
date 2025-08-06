import { Routes } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};

// Admin guard function
const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  } else {
    router.navigate(["/"]);
    return false;
  }
};

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./components/auth/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./components/auth/register.component").then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: "menu",
    loadComponent: () =>
      import("./components/menu/menu.component").then((m) => m.MenuComponent),
  },
  {
    path: "pizza/:id",
    loadComponent: () =>
      import("./components/pizza/pizza-detail.component").then(
        (m) => m.PizzaDetailComponent,
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./components/cart/cart.component").then((m) => m.CartComponent),
  },
  {
    path: "checkout",
    loadComponent: () =>
      import("./components/checkout/checkout.component").then(
        (m) => m.CheckoutComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "order-confirmation/:id",
    loadComponent: () =>
      import("./components/order/order-confirmation.component").then(
        (m) => m.OrderConfirmationComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "orders",
    loadComponent: () =>
      import("./components/order/orders.component").then(
        (m) => m.OrdersComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./components/user/profile.component").then(
        (m) => m.ProfileComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./components/admin/admin-dashboard.component").then(
        (m) => m.AdminDashboardComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
