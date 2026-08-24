import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import DemoModeBanner from './components/DemoModeBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import AIChatbot from './components/AIChatbot';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ForecastPage from './pages/ForecastPage';
import MarketComparisonPage from './pages/MarketComparisonPage';
import RevenueCalculatorPage from './pages/RevenueCalculatorPage';
import PriceFactorsPage from './pages/PriceFactorsPage';
import WeatherPage from './pages/WeatherPage';
import HistoricalPage from './pages/HistoricalPage';
import NotificationsPage from './pages/NotificationsPage';
import HowAiWorksPage from './pages/HowAiWorksPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
            <DemoModeBanner />
            <Navbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/markets" element={<MarketComparisonPage />} />
                <Route path="/calculator" element={<RevenueCalculatorPage />} />
                <Route path="/factors" element={<PriceFactorsPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/historical" element={<HistoricalPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/how-ai-works" element={<HowAiWorksPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>

            <AIChatbot />
            <MobileBottomNav />
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

