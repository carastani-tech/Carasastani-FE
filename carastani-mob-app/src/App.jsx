import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import UsedCars from './pages/UsedCars';
import Ads from './pages/Ads';
import Dealers from './pages/Dealers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Reviews from './pages/Reviews';
import Careers from './pages/Careers';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <div className="flex-grow pt-[52px] sm:pt-[60px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/used" element={<UsedCars />} />
            <Route path="/used-cars" element={<Navigate to="/used" replace />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/careers" element={<Careers />} />
            {/* Fallback for other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
