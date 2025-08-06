# 🍕 Mozzarella - Pizza Delivery App

A complete pizza delivery application built with Angular 20, TypeScript, and TailwindCSS. This app features a modern, responsive design inspired by the provided Figma mockups with full CRUD functionality, user authentication, and admin dashboard.

## ✨ Features

### 🏠 Core Application

- **Beautiful Landing Page** - Welcome screen with animated pizza graphics matching Figma design
- **User Authentication** - Login and registration with validation
- **Pizza Menu** - Browse pizzas with categories, search, and filtering
- **Pizza Details** - Detailed view with ingredients, size selection, and quantity picker
- **Shopping Cart** - Add/remove items, quantity management, and price calculation
- **Checkout Process** - Address selection and payment method choice
- **Order Tracking** - View order history and status updates
- **User Profile** - Account management and settings

### 👨‍💼 Admin Dashboard

- **Pizza Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Order Management** - View and update order statuses
- **Statistics** - Dashboard with key metrics and analytics
- **Category Management** - Organize pizzas by categories

### 🎨 Design & UX

- **Pixel-Perfect Implementation** - Matches Figma designs exactly
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Spanish Language Support** - Full Spanish interface as per design
- **Modern UI Components** - Clean, accessible, and user-friendly interface
- **Loading States** - Smooth animations and loading indicators
- **Error Handling** - User-friendly error messages and validation

## 🛠 Tech Stack

- **Frontend**: Angular 20 + TypeScript
- **Styling**: TailwindCSS 3.4.11 with custom pizza-themed color palette
- **Fonts**: Lobster (serif) + Poppins (sans-serif)
- **Icons**: Custom SVG icons and Heroicons
- **State Management**: Angular Signals for reactive state management
- **Routing**: Angular Router with hash-based navigation
- **Forms**: Angular Reactive Forms with validation
- **Testing**: Angular Testing Framework (Jasmine + Karma)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/                 # Login & Registration
│   │   ├── layout/               # Header & Navigation
│   │   ├── home/                 # Landing Page
│   │   ├── menu/                 # Pizza Menu
│   │   ├── pizza/                # Pizza Details
│   │   ├── cart/                 # Shopping Cart
│   │   ├── checkout/             # Checkout Process
│   │   ├── order/                # Order Management
│   │   ├── user/                 # User Profile
│   │   └── admin/                # Admin Dashboard
│   ├── services/
│   │   ├── auth.service.ts       # Authentication
│   │   ├── pizza.service.ts      # Pizza Data Management
│   │   ├── cart.service.ts       # Shopping Cart Logic
│   │   └── order.service.ts      # Order Processing
│   ├── models/
│   │   └── pizza.model.ts        # TypeScript Interfaces
│   └── app.routes.ts             # Route Configuration
└── styles.css                   # Global Styles & Theme
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Angular CLI (v17+)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pizza-delivery-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser**
   ```
   http://localhost:4200
   ```

## 🧪 Demo Credentials

For testing purposes, use these demo credentials:

- **Email**: `james@example.com`
- **Password**: Any password (authentication is simulated)
- **Role**: Admin user with full dashboard access

## 📱 Key Pages & Features

### 🏠 Home Page (`/`)

- Animated pizza splash screen (3 seconds)
- Hero section with gradient background
- Feature highlights
- Call-to-action buttons

### 🔐 Authentication (`/login`, `/register`)

- Beautiful forms matching Figma design
- Form validation and error handling
- Demo credentials for testing
- Automatic redirection after login

### 🍕 Menu (`/menu`)

- Search functionality
- Category filtering (All, Vegetarian, Classic, Meat, Breakfast)
- Pizza cards with images, prices, and quick add buttons
- "Add to Cart" notifications

### 📄 Pizza Details (`/pizza/:id`)

- Large circular pizza image
- Size selection (S, M, L)
- Ingredients display
- Quantity picker
- Add to cart functionality

### 🛒 Shopping Cart (`/cart`)

- Item management (add/remove/update quantities)
- Price calculations (subtotal, taxes, delivery)
- Checkout button (requires authentication)
- Empty cart state

### 💳 Checkout (`/checkout`)

- Address selection (Home/Office)
- Payment method selection (Online/Cash)
- Order summary
- Place order functionality

### 📊 Admin Dashboard (`/admin`)

- **Pizza Management**: CRUD operations with form validation
- **Order Management**: Status updates and order tracking
- **Statistics**: Revenue, orders, and pizza counts
- **Responsive Tables**: Clean data presentation

## 🎨 Design System

### Colors

- **Primary**: Red shades (`#dc2626`, `#b91c1c`)
- **Secondary**: Amber/Orange shades (`#f59e0b`, `#ea580c`)
- **Background**: Cream/Beige tones (`#FFF8E1`, `#FBDAB8`)
- **Text**: Brown (`#7B4B28`) and standard grays

### Typography

- **Headers**: Lobster (serif) for branding
- **Body**: Poppins (sans-serif) for readability
- **Weights**: 400, 500, 600, 700

### Components

- Rounded corners (`rounded-lg`, `rounded-xl`)
- Soft shadows for cards
- Hover animations and transitions
- Consistent spacing using Tailwind utilities

## 🛡 Security Features

- **Route Guards**: Authentication and admin role protection
- **Form Validation**: Client-side validation for all forms
- **Input Sanitization**: Safe handling of user inputs
- **Error Boundaries**: Graceful error handling

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible Grid**: CSS Grid and Flexbox layouts
- **Touch-Friendly**: Appropriate button sizes and spacing

## 🔄 State Management

Using Angular Signals for reactive state management:

- **AuthService**: User authentication state
- **CartService**: Shopping cart with computed totals
- **PizzaService**: Pizza data and CRUD operations
- **OrderService**: Order processing and history

## 🧭 Navigation

Hash-based routing for compatibility:

- Automatic redirects for unauthenticated users
- Admin role verification
- Breadcrumb navigation
- Mobile-friendly hamburger menu

## 🚀 Deployment

The app is configured for easy deployment:

1. **Build for production**

   ```bash
   npm run build
   ```

2. **Deploy to hosting service**
   - Files will be in `dist/` folder
   - Configure routing for SPA (Single Page Application)
   - Ensure hash routing works correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built for demonstration purposes. Please check with the appropriate licensing for commercial use.

## 🍕 About

This pizza delivery app showcases modern Angular development practices with a focus on:

- Clean, maintainable code architecture
- Responsive, accessible design
- Real-world features and functionality
- Professional UI/UX implementation

Perfect for learning Angular concepts, state management, and building production-ready applications!
