import React, { useEffect, useState } from "react";
import downloadPDF from "./DownloadPdf";
const CertificationsPage = () => {


    const [cert, setCert] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch("/api/certificate", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setCert(data))
            .catch(err => console.error(err));

    }, []);

    if (!cert) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading Certificate...</h4>
            </div>
        );
    }

    return (

        <div className="container mt-5">

            <div className="card shadow-lg border-0">

                <div className="card-body p-5 text-center">
                    <img
                        src="/logo.png"
                        alt="Academy Logo"
                        style={{ width: "120px", marginBottom: "20px" }}
                    />
                    <div id="certificate">

                        <h5 className="text-muted mb-4">
                            Nyala Digital Academy
                        </h5>

                        <h1 className="fw-bold text-success mb-4">
                            Certificate of Completion
                        </h1>

                        <p className="fs-5">
                            This certificate is proudly presented to
                        </p>

                        <h2 className="fw-bold text-primary mb-3">
                            Student #{cert.user_id}
                        </h2>

                        <p className="fs-5">
                            for successfully completing the course
                        </p>

                        <h3 className="fw-semibold mb-4">
                            {cert.course_name}
                        </h3>

                        <div className="row mt-4">

                            <div className="col-md-6">
                                <p className="text-muted">
                                    Certificate Code
                                </p>
                                <strong>{cert.certificate_code}</strong>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <p className="text-muted">
                                Issued Date
                            </p>
                            <strong>
                                {new Date(cert.issued_at).toLocaleDateString()}
                            </strong>
                        </div>

                    </div>

                    <hr className="my-4" />

                    <div className="d-flex justify-content-center gap-3">

                        <button
                            className="btn btn-success btn-lg"
                            onClick={downloadPDF}
                                // window.open("/api/certificate/download", "_blank")
                            
                        >
                            Download PDF
                        </button>

                        <button
                            className="btn btn-outline-primary btn-lg"
                            onClick={() => window.print()}
                        >
                            Print
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}
export default CertificationsPage;