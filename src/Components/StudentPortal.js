import React, { useState, useEffect } from 'react';
import HandleLogin from './HandleLogin';

const StudentPortal = ({ isEnglish }) => {
  const [user, setUser] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    const storedTrack = localStorage.getItem('studentTrack');
    
    if (storedName && storedTrack) {
      setUser({ name: storedName, track: storedTrack });

      // Use storedTrack directly to ensure we don't wait for state
      fetch(`http://localhost:5000/api/materials/${storedTrack}`)
        .then(res => res.json())
        .then(data => {
          console.log("Data found for", storedTrack, ":", data);
          setMaterials(data);
        })
        .catch(err => console.error("Materials Fetch Error:", err));
    }
  }, []); // Run once on load

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload(); // Refresh to clear all states
  };

  const trackInfo = {
    Cisco: {
      en: "Cisco Networking",
      ar: "شبكات سيسكو",
      units: [
        { en: "Network Fundamentals", ar: "أساسيات الشبكات" },
        { en: "Routing & Switching", ar: "التوجيه والتحويل" },
        { en: "Advanced Security", ar: "الأمن المتقدم" }
      ],
      color: "primary",
    },
    Archiving: {
      en: "Digital Archiving",
      ar: "الأرشفة الرقمية",
      units: [
        { en: "Preservation Basics", ar: "أساسيات الحفظ" },
        { en: "Metadata Management", ar: "إدارة البيانات" },
        { en: "Digital Repositories", ar: "المستودعات الرقمية" }
      ],
      color: "success",
    },
    CyberSecurity: {
      en: "Cybersecurity",
      ar: "الأمن السيبراني",
      units: [
        { en: "Security Fundamentals", ar: "أساسيات الأمن" },
        { en: "Threat Analysis", ar: "تحليل التهديدات" },
        { en: "Defensive Techniques", ar: "تقنيات الدفاع" }
      ],
      color: "danger",
    }
  };
  if (!user) {
    return (
      <div className="container py-5" style={{ minHeight: '80vh' }}>
        <HandleLogin isEnglish={isEnglish} onLoginSuccess={(userData) => {
          setUser(userData);
          window.location.reload(); // Refresh to trigger the fetch
        }} />
      </div>
    );
  }
const currentTrack = trackInfo[user.track] || { en: 'Course', ar: 'مسار تدريبي', color: 'dark' };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn pb-5">
      {/* Header section */}
      <div className="card p-4 shadow-sm border-0 mb-4 bg-white" style={{ borderRadius: '15px' }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={isEnglish ? 'text-start' : 'text-end'}>
            <h2 className="text-primary mb-0">{isEnglish ? `Welcome, ${user.name}` : `مرحباً بك، ${user.name}`}</h2>
            <span className={`badge bg-${currentTrack.color} mt-2`}></span>
              {user.track}
            </div>
          <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">{isEnglish ? "Logout" : "خروج"}</button>
        </div>
      </div>

      <div className="row mt-4">
        {[1, 2, 3].map((unitNum) => {
          const unitMaterials = materials.filter(m => m.unit_number === unitNum);
          
          const downloadAll = () => {
            unitMaterials.forEach((file, index) => {
              setTimeout(() => {
                const link = document.createElement('a');
                link.href = file.file_url;
                link.download = file.title;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }, index * 500);
            });
          };

          const isLocked = unitNum > 1;
// Get the specific unit title from our trackInfo
          const unitTitle = trackInfo[user.track]?.units[unitNum - 1];
          return (
            <div key={unitNum} className="col-lg-4 col-md-6 mb-4">
              <div className={`card h-100 border-0 shadow-sm ${isLocked ? 'opacity-75' : ''}`} style={{ borderRadius: '15px' }}>
                <div className={`card-header bg-${isLocked ? 'secondary' : currentTrack.color} text-white d-flex justify-content-between align-items-center`}>
                  <h6 className="mb-0">
                    {isLocked && <i className="bi bi-lock-fill me-2"></i>}
                    {isEnglish ? unitTitle?.en : unitTitle?.ar}
                    {/* {isEnglish ? `Unit ${unitNum}` : `الوحدة ${unitNum}`} */}
                  </h6>
                  {!isLocked && unitMaterials.length > 0 && (
                    <button onClick={downloadAll} className="btn btn-sm btn-light p-1">
                      <i className="bi bi-cloud-arrow-down-fill"></i>
                    </button>
                  )}
                </div>

                <div className="card-body p-0">
                  {isLocked ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-shield-lock display-6"></i>
                      <p className="small mt-2">{isEnglish ? "Locked" : "مغلق"}</p>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {unitMaterials.map((item, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="small">{item.title}</span>
                          <a href={item.file_url} download><i className="bi bi-download"></i></a>
                        </li>
                      ))}
                      {unitMaterials.length === 0 && <li className="list-group-item text-center py-3 text-muted small">No materials yet</li>}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

     {/* 3. Admin Switcher (With Arabic) */}
      {user.name === "salem" && (
        <div className="mt-5 p-4 bg-light border rounded-4 text-center">
          <h6 className="fw-bold">{isEnglish ? "Admin View Toggle" : "تبديل عرض المسؤول"}</h6>
          <div className="btn-group mt-2">
            <button className="btn btn-outline-primary" onClick={() => { localStorage.setItem('studentTrack', 'Cisco'); window.location.reload(); }}>
              {isEnglish ? "Cisco" : "سيسكو"}
            </button>
            <button className="btn btn-outline-success" onClick={() => { localStorage.setItem('studentTrack', 'Archiving'); window.location.reload(); }}>
              {isEnglish ? "Archiving" : "الأرشفة"}
            </button>
            <button className="btn btn-outline-danger" onClick={() => { localStorage.setItem('studentTrack', 'CyberSecurity'); window.location.reload(); }}>
              {isEnglish ? "Cyber" : "الأمن"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;