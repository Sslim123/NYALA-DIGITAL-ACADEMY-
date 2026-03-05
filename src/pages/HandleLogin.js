import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HandleLogin = ({ isEnglish }) => {
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const HandleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
const token = localStorage.getItem('token');
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { 
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "فشل تسجيل الدخول");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("studentName", data.user.name);
navigator('/login')
  } catch (err) {
    setError("تعذر الاتصال بالخادم");
    setLoading(false);
  }
};

  return (
    <div className="card shadow p-4 mx-auto" style={{ maxWidth: "400px", borderRadius: "15px" }}>
      <h2 className="text-center mb-4 text-primary">
        {isEnglish ? "Student Login" : "تسجيل دخول الطلاب"}
      </h2>

      <form onSubmit={HandleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            {isEnglish ? "Email" : "البريد الإلكتروني"}
          </label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            {isEnglish ? "Password" : "كلمة المرور"}
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger p-2 small">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "..." : isEnglish ? "Login" : "دخول"}
        </button>
      </form>
    </div>
  );
};

export default HandleLogin;
