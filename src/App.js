import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Body from './Components/body.js';
import Footer from './Components/footer.js';
import StudentPortal from './Components/StudentPortal.js';
import Roadmap from './Components/RoadMaps.js';
import Verify from './Components/Verify';
import ApplyForm from './Components/ApplyForm.js';
import Navbar from './Components/Navbar.js';
import AdminDashboard from './Components/AdminDashboard.js';
import HandleLogin from './Components/HandleLogin.js';
import Hero from './Components/Hero.js';
import AboutBlogs from './Components/AboutBlogs.js';

function App() {

  const [isEnglish, setIsEnglish] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Default is 'not logged in'
  const handleAdminLogin = (status) => {
    setIsAdmin(status)
  }

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };
  return (
    <div className="App">
      <div className={isEnglish ? 'App en-dir' : 'App ar-dir'} dir={isEnglish ? 'ltr' : 'rtl'}>
        <Router>
          <Navbar toggleLanguage={toggleLanguage} onLogin={handleAdminLogin} isEnglish={isEnglish} isAdmin={isAdmin} />          
          <main>
            <Routes>
              <Route path="/" element={
                <>
                <Hero isEnglish={isEnglish}/>
                  <Body isEnglish={isEnglish} />
                </>
              } />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/apply" element={<ApplyForm isEnglish={isEnglish} />} />
              <Route path="/portal" element={<StudentPortal isEnglish={isEnglish} />} />
              <Route path="/path" element={<Roadmap isEnglish={isEnglish} />} />
              <Route path="/verify" element={<Verify isEnglish={isEnglish} />} />
              <Route path="/login" element={<HandleLogin isEnglish={isEnglish} />} />
            </Routes>
          </main>
          <AboutBlogs isEnglish={isEnglish}/>
          <Footer isEnglish={isEnglish} />
        </Router>
      </div>
    </div>
  );
}

export default App;
