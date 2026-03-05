import { useState } from "react";

const  SetPassword =() =>  {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitPassword = async () => {
    setError("");

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔑 مهم جدًا
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        setLoading(false);
        return;
      }

      window.location.replace("/portal");
    } catch (err) {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-3">إنشاء كلمة المرور</h2>

      <input
        type="password"
        className="form-control mb-3"
        placeholder="كلمة المرور (8 أحرف على الأقل)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      <button
        className="btn btn-primary w-100"
        onClick={submitPassword}
        disabled={loading}
      >
        {loading ? "جارٍ الحفظ..." : "حفظ وبدء الكورس"}
      </button>
    </div>
  );
}
export default SetPassword;