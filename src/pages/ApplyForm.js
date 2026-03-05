import { useNavigate } from "react-router-dom";

const ApplyForm = ({ isEnglish }) => {
  const navigator = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      track: e.target.track.value,
      password: e.target.password.value
    };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Application Submitted Successfully!");
        navigator('/');

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the server. Is server.js running?");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-10">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold text-primary">
                {isEnglish ? "Pioneer Application" : "طلب انضمام للمؤسسة"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">{isEnglish ? "Full Name" : "الاسم الكامل"}</label>
                  <input type="text" className="form-control form-control-lg" name="name" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">{isEnglish ? "password" : "كلمة المرور"}</label>
                  <input type="password" className="form-control form-control-lg" name="password" required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">{isEnglish ? "Email" : "البريد الإلكتروني"}</label>
                  <input type="email" className="form-control form-control-lg" name="email" required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">{isEnglish ? "Select Track" : "اختر المسار"}</label>
                  <select className="form-select form-select-lg" name="track">
                    <option value="Cisco">{isEnglish ? "Cisco Networking" : " شبكات سيسكو "}</option>
                    <option value="Archiving">{isEnglish ? "Digital Archiving" : " الأرشفة الرقمية "}</option>
                    <option value="Archiving">{isEnglish ? "Cybersecurity" : "الأمن السيبراني"}</option>

                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
                  {isEnglish ? "Submit Application" : "إرسال الطلب"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplyForm;


