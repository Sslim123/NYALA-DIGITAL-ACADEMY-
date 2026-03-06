import React, { useEffect, useState} from "react";
const CertificationsPage = () => {
    const [cert, setCert]= useState({});
    useEffect(() => {
const token = localStorage.getItem('token');
        fetch("/api/certificate", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(setCert)

    }, [])
    return (

        <div>
            <h5>🎓 Certificate of Completion
                Nyala Digital Academy

                2026  </h5>
            <p>
                Awarded to:
                Student Name

                Course:
                Digital Systems Foundations


            </p>
            <span>
                Date:

            </span>
        </div>
    )
}
export default CertificationsPage;