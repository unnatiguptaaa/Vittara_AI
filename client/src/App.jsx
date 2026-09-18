import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { JourneyProvider } from './context/JourneyContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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
    <LanguageProvider>
      <JourneyProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-500 selection:text-white">
            <Navbar />
            
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
        </BrowserRouter>
      </JourneyProvider>
    </LanguageProvider>
  );
}
