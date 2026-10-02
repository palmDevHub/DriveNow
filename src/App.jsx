import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { CarsPage } from './pages/customer/CarsPage';
import { CarDetailPage } from './pages/customer/CarDetailPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCarsPage } from './pages/admin/AdminCarsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

const MainContent = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      // Customer Portal
      case 'home':
        return <HomePage />;
      case 'cars':
        return <CarsPage />;
      case 'car-detail':
        return <CarDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'my-bookings':
        return <MyBookingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;

      // Admin Portal
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-cars':
        return <AdminCarsPage />;
      case 'admin-bookings':
        return <AdminBookingsPage />;
      case 'admin-users':
        return <AdminUsersPage />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-kanit flex flex-col justify-between selection:bg-red-500 selection:text-white">
      <Navbar />
      <NotificationToast />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {renderView()}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
