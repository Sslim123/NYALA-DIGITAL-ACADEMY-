import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ isEnglish }) => {
    const navigate = useNavigate();
  return (
    <div className="bg-dark text-white py-5 shadow-lg" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/images/nyala_bg.jpg")',
      backgroundSize: 'cover', backgroundPosition: 'center'
    }}>
      <div className="container text-center py-5">
        <h2 className="display-3 fw-bold mb-3 animate__animated animate__fadeInDown">
          {isEnglish ? "Nyala Digital.. Building Bridges, Securing the Future" : "نيالا الرقمية.. نبني الجسور، نؤمّن المستقبل"}
        </h2>
        <p className="lead fs-4 mb-4 opacity-75">
          {isEnglish 
            ? "The first integrated technical platform in the heart of Darfur." 
            : "أول منصة تعليمية وتقنية متكاملة في قلب دارفور."}
        </p>
        <button onClick={() => navigate('./apply')} className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold">
          {isEnglish ? "Join the Waitlist" : "انضم إلى قائمة الانتظار"}
        </button>
      </div>
    </div>
  );
};

export default Hero;