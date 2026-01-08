
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingView from './views/LandingView';
import LoginView from './views/LoginView';
import ProfileView from './views/ProfileView';
import IdentityVerificationView from './views/IdentityVerificationView';
import LoanReviewView from './views/LoanReviewView';
import ScoringView from './views/ScoringView';
import ResultView from './views/ResultView';
import HistoryView from './views/HistoryView';
import UpgradeScoreView from './views/UpgradeScoreView';
import LockedView from './views/LockedView';
import Chatbot from './components/Chatbot';
import { UserProfile, LoanRequest, LoanRecord } from './types';
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });

  // Kiểm tra thiết bị đã bị khóa (đã đăng ký một lần) chưa
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('device_locked') === 'true';
  });

  const [currentLoan, setCurrentLoan] = useState<LoanRequest | null>(() => {
    const saved = localStorage.getItem('current_loan');
    return saved ? JSON.parse(saved) : null;
  });

  const [loanHistory, setLoanHistory] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('loan_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) localStorage.setItem('user_profile', JSON.stringify(user));
    localStorage.setItem('is_logged_in', isLoggedIn.toString());
    if (currentLoan) localStorage.setItem('current_loan', JSON.stringify(currentLoan));
    localStorage.setItem('loan_history', JSON.stringify(loanHistory));
  }, [user, isLoggedIn, currentLoan, loanHistory]);

  return (
    <Router>
      <Layout hideNav={!isLoggedIn}>
        <Routes>
          {/* Nếu máy đã bị khóa, luôn chuyển về LockedView hoặc ResultView */}
          <Route path="/" element={
            isLocked ? <Navigate to="/locked" /> : (
              <LandingView 
                isLoggedIn={isLoggedIn} 
                onStartLoan={(loan) => {
                  setCurrentLoan(loan);
                }} 
              />
            )
          } />
          
          <Route path="/locked" element={<LockedView />} />

          <Route path="/login" element={
            isLocked ? <Navigate to="/locked" /> : <LoginView onLogin={() => setIsLoggedIn(true)} />
          } />

          <Route path="/profile" element={
            isLocked ? <Navigate to="/locked" /> : (
              isLoggedIn ? (
                <ProfileView user={user} onSave={(profile) => setUser(profile)} />
              ) : <Navigate to="/login" />
            )
          } />

          <Route path="/identity-verify" element={
            isLocked ? <Navigate to="/locked" /> : (
              isLoggedIn && user ? (
                <IdentityVerificationView 
                  user={user} 
                  onSave={(updatedUser) => setUser(updatedUser)} 
                />
              ) : <Navigate to="/login" />
            )
          } />

          <Route path="/loan-review" element={
            isLocked ? <Navigate to="/locked" /> : (
              isLoggedIn && currentLoan ? (
                <LoanReviewView loan={currentLoan} />
              ) : <Navigate to="/" />
            )
          } />

          <Route path="/scoring" element={
            isLoggedIn && currentLoan && user ? (
              <ScoringView 
                user={user} 
                loan={currentLoan} 
                onComplete={(record) => {
                  setLoanHistory(prev => [record, ...prev]);
                  setIsLocked(true); // Khóa thiết bị ngay khi hoàn tất
                  localStorage.setItem('device_locked', 'true');
                }} 
              />
            ) : <Navigate to="/" />
          } />

          <Route path="/result" element={
            isLoggedIn ? <ResultView history={loanHistory} /> : <Navigate to="/" />
          } />

          <Route path="/history" element={
            isLoggedIn ? <HistoryView history={loanHistory} /> : <Navigate to="/login" />
          } />

          <Route path="/upgrade-score" element={
            isLoggedIn ? <UpgradeScoreView /> : <Navigate to="/login" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {isLoggedIn && <Chatbot />}
      </Layout>
    </Router>
  );
};

export default App;
