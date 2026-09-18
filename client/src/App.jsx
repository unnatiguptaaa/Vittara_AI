import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { JourneyProvider } from './context/JourneyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ParticleConstellation from './components/common/ParticleConstellation';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoanAssistantPage from './pages/LoanAssistantPage';
import EmiCalculatorPage from './pages/EmiCalculatorPage';
import ComparePage from './pages/ComparePage';
import InsurancePage from './pages/InsurancePage';
import TermExplainerPage from './pages/TermExplainerPage';
import DocumentPage from './pages/DocumentPage';
import SummaryPage from './pages/SummaryPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const { theme } = useTheme();
  const isBright = theme === 'bright';
  return (
    <LanguageProvider>
      <JourneyProvider>
        <BrowserRouter>
          <div
            className="min-h-screen bg-midnight-900 text-ivory selection:bg-emerald-500/30 selection:text-emerald-200 theme-transition"
            style={{
              backgroundColor: isBright ? '#F5F7FB' : '#000000',
              color: isBright ? '#002970' : '#FFFFFF',
            }}
          >
            <ParticleConstellation />
            <Sidebar />
              <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/loans" element={<LoanAssistantPage />} />
                    <Route path="/calculator" element={<EmiCalculatorPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/insurance" element={<InsurancePage />} />
                    <Route path="/terms" element={<TermExplainerPage />} />
                    <Route path="/documents" element={<DocumentPage />} />
                    <Route path="/summary" element={<SummaryPage />} />
                    <Route path="*" element={<Navigate to="/chat" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </JourneyProvider>
      </LanguageProvider>
  );
}