import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Body from './Components/body.js';
import Footer from './Components/footer.js';
import StudentPortal from './pages/StudentPortal.js';
import Roadmap from './Components/RoadMaps.js';
import Verify from './Components/Verify';
import ApplyForm from './pages/ApplyForm.js';
import Navbar from './Components/Navbar.js';
import AdminDashboard from './Components/AdminDashboard.js';
import HandleLogin from './pages/HandleLogin.js';
import Hero from './Components/Hero.js';
import AboutBlogs from './Components/AboutBlogs.js';
import CourseMaterials from './CourseMaterialsPage/CourseMaterials'
function App() {

  const [isEnglish, setIsEnglish] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleAdminLogin = (status) => {
    setIsAdmin(status)
  }

  const toggleLanguage = () => {

    setIsEnglish(!isEnglish);
  };
  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      isEnglish ? "ltr" : "rtl"
    );
  }, [isEnglish]);
  return (
    <div className="App">
      <Router>
        <Navbar toggleLanguage={toggleLanguage} onLogin={handleAdminLogin} isEnglish={isEnglish} isAdmin={isAdmin} />
        <Routes>

          <Route path="/" element={
            <>
              <Hero isEnglish={isEnglish} />
              <Body isEnglish={isEnglish} />
              <AboutBlogs isEnglish={isEnglish} />
            </>
          } />
          <Route path="portal/free-course" element={<CourseMaterials isEnglish={isEnglish} />} />
          <Route path="/login" element={<StudentPortal isEnglish={isEnglish} toggleLanguage={toggleLanguage} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/apply" element={<ApplyForm isEnglish={isEnglish} />} />
          <Route path="/path" element={<Roadmap isEnglish={isEnglish} />} />
          <Route path="/verify" element={<Verify isEnglish={isEnglish} />} />
          <Route path="/portal" element={<HandleLogin isEnglish={isEnglish} />} />
        </Routes>
        <Footer isEnglish={isEnglish} />
      </Router>
    </div >
  );
}

export default App;
