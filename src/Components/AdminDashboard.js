import React, { useEffect, useState } from 'react';
const AdminDashboard = ({ isEnglish }) => {
  const [students, setStudents] = useState([]);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setStudents(prev => prev.map(s =>
          s.student_id === id ? { ...s, status: newStatus } : s
        ));
      }
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };
  useEffect(() => {
    const FetchStudents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/students', {

          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 403 || res.status === 401) {
          console.error("غير مصرح لك بالدخول!");
          return;

        }
        if (!res.ok) {
          throw new Error(`server error: ${res.status}`);
        }
        const data =
          await res.json();
        setStudents(data);
      } catch (err) {
        console.error("invailed token", err.error)
      }
    }
    FetchStudents();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard - Student Applications</h2>
      <table className="table table-hover mt-4 shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Track</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.full_name}</td>
              <td>{s.current_track}</td>
              <td>
                <span className={`badge ${s.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                  {s.status}
                </span>
              </td>
              <td>

                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleStatusUpdate(s.student_id, 'accepted')}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleStatusUpdate(s.student_id, 'rejected')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;