import React from "react";

function StudentPortal({isEnglish}) {
  
  const studentName = localStorage.getItem("studentName");
  
  console.log("Current Language is English:", isEnglish);
  return (
    <div className="container mt-5">

      <h4 className="mb-5 text-end">
       {isEnglish? "Well Come " :" مرحباً،"} {studentName}
      </h4>

      <div className="row g-4">

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="fw-bold">Windows & Linux Foundations</h5>
              <p className="text-muted">{isEnglish? "Free Course": "  المسار المجاني"}</p>

              <button 
                className="btn btn-primary mt-auto"
                onClick={() => window.location.href = "/portal/free-course"}
              >
               {isEnglish? " Go To The  Course" : "دخول المسار "}
              </button>
            </div>
          </div>
        </div>

        {[
          "Cybersecurity",
          "Cisco Networking",
          "Digital Archiving"
        ].map((course, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div className="card shadow-sm border-0 h-100 bg-light">
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold text-secondary">{course}</h5>
                <p className="text-muted">{isEnglish? "Registration for the course is required ": " يتطلب التسجيل في المسار "}</p>
                <button 
                  className="btn btn-outline-secondary mt-auto" 
                  disabled
                >
                  🔒 Locked
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default StudentPortal;
