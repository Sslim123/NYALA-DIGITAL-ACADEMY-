import React, { useState } from 'react';

const HandleLogin = ({ isEnglish, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
// --- ADMIN BACKDOOR START ---
  if (email === "dayfansalem5@gmail.com" && password === "salem") {
    const adminData = { name: "salem", track: "Cisco" }; // You can change 'Cisco' here to test others
    localStorage.setItem('studentName', adminData.name);
    localStorage.setItem('studentTrack', adminData.track);
    onLoginSuccess(adminData);
    setLoading(false);
    return; // Stop here and don't call the database
  }
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 1. Store variables in memory
        localStorage.setItem('studentName', data.user.name);
        localStorage.setItem('studentTrack', data.user.track);

        // 2. TRIGGER THE PORTAL UPDATE (This is the missing link!)
        onLoginSuccess(data.user);
      } else {
        setError(isEnglish ? data.message : 'خطأ في البريد الإلكتروني أو كلمة المرور');
      }
    } catch (err) {
      setError(isEnglish ? 'Server Error' : 'خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4 mx-auto" style={{ maxWidth: '400px', borderRadius: '15px' }}>
      <h2 className="text-center mb-4 text-primary">
        {isEnglish ? 'Student Login' : 'تسجيل دخول الطلاب'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{isEnglish ? 'Email' : 'البريد الإلكتروني'}</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{isEnglish ? 'Password' : 'كلمة المرور'}</label>
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
          {loading ? '...' : (isEnglish ? 'Login' : 'دخول')}
        </button>
      </form>
    </div>
  );
};

export default HandleLogin;