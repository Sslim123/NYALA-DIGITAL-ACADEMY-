const Roadmap = ({ isEnglish }) => {
    return (
        <div className="container py-5">
            <h2 className={`mb-5 ${isEnglish ? "text-center" : "text-center"}`}>
                {isEnglish ? "Your Learning Journey" : "رحلتك التعليمية"}
            </h2>

            <div className="row g-4">
                {/* Cisco Path */}
                <div className="col-lg-4 col-md-6">
                    {/* COLUMN HEADER */}
                    <div className={`mb-4 text-${isEnglish ? "start" : "end"}`}>
                        <h3 className="fw-bold">
                            {isEnglish ? "Cisco Networking Path" : "مسار شبكات سيسكو"}
                        </h3>
                        <p className="text-muted small">
                            {isEnglish ? "From basics to CCNA readiness" : "من الأساسيات حتى الجاهزية لشهادة CCNA"}
                        </p>
                    </div>

                    {/* STEP CARD 1 */}
                    <div className="p-4 bg-white shadow-sm mb-3">
                        <h5 className="text-primary mb-1">
                            01. {isEnglish ? "Foundations" : "التأسيس"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish ? "Hardware & IP Basics" : "أساسيات العتاد والعناوين"}
                        </p>
                    </div>

                    {/* STEP CARD 2 */}
                    <div className="p-4 bg-white shadow-sm mb-3">
                        <h5 className="text-primary mb-1">
                            02. {isEnglish ? "Configuration" : "الإعداد"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish ? "Switching & Routing" : "التبديل والتوجيه"}
                        </p>
                    </div>

                    {/* STEP CARD 3 */}
                    <div className="p-4 bg-white shadow-sm">
                        <h5 className="text-success mb-1">
                            03. {isEnglish ? "Certification" : "الاحتراف"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish ? "Ready for CCNA" : "جاهز لشهادة CCNA"}
                        </p>
                    </div>
                </div>

                {/* Digital Archiving Path */}
                <div className="col-lg-4 col-md-6">
                    {/* COLUMN HEADER */}
                    <div className={`mb-4 text-${isEnglish ? "start" : "end"}`}>
                        <h3 className="fw-bold">
                            {isEnglish ? "Digital Archiving Path" : "مسار الأرشفة الرقمية"}
                        </h3>
                        <p className="text-muted small">
                            {isEnglish
                                ? "Build professional digital records skills"
                                : "بناء مهارات احترافية في إدارة السجلات الرقمية"}
                        </p>
                    </div>

                    {/* STEP 1 */}
                    <div className="p-4 bg-white shadow-sm mb-3">
                        <h5 className="text-primary mb-1">
                            01. {isEnglish ? "Foundations" : "التأسيس"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish
                                ? "Digital Records & File Formats"
                                : "السجلات الرقمية وصيغ الملفات"}
                        </p>
                    </div>

                    {/* STEP 2 */}
                    <div className="p-4 bg-white shadow-sm mb-3">
                        <h5 className="text-primary mb-1">
                            02. {isEnglish ? "Organization" : "التنظيم"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish
                                ? "Indexing, Metadata & Classification"
                                : "الفهرسة والبيانات الوصفية والتصنيف"}
                        </p>
                    </div>

                    {/* STEP 3 */}
                    <div className="p-4 bg-white shadow-sm">
                        <h5 className="text-success mb-1">
                            03. {isEnglish ? "Professional Practice" : "التطبيق المهني"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish
                                ? "Digital Preservation & Compliance"
                                : "الحفظ الرقمي والامتثال"}
                        </p>
                    </div>
                </div>


                {/* Cybersecurity Path */}
                <div className="col-lg-4 col-md-6">
                    {/* COLUMN HEADER */}
                    <div className={`mb-4 text-${isEnglish ? "start" : "end"}`}>
                        <h3 className="fw-bold">
                            {isEnglish ? "Cybersecurity Path" : "مسار الأمن السيبراني"}
                        </h3>
                        <p className="text-muted small">
                            {isEnglish
                                ? "From security fundamentals to SOC readiness"
                                : "من أساسيات الأمن حتى الجاهزية لمراكز العمليات"}
                        </p>
                    </div>

                    {/* STEP 1 */}
                    <div className="p-4 bg-white shadow-sm mb-3">
                        <h5 className="text-primary mb-1">
                            01. {isEnglish ? "Foundations" : "التأسيس"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish
                                ? "Networking, Linux & Security Basics"
                                : "أساسيات الشبكات ولينكس والأمن"}
                        </p>
                    </div>

                    {/* STEP 2 */}
                    <div className="p-4 bg-white shadow-sm mb-3">
                        <h5 className="text-primary mb-1">
                            02. {isEnglish ? "Defense & Analysis" : "الدفاع والتحليل"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish
                                ? "Firewalls, SIEM & Threat Detection"
                                : "الجدران النارية وأنظمة SIEM واكتشاف التهديدات"}
                        </p>
                    </div>

                    {/* STEP 3 */}
                    <div className="p-4 bg-white shadow-sm">
                        <h5 className="text-success mb-1">
                            03. {isEnglish ? "Hands-on Labs" : "التطبيق العملي"}
                        </h5>
                        <p className="text-muted mb-0">
                            {isEnglish
                                ? "Incident Response & SOC Skills"
                                : "الاستجابة للحوادث ومهارات SOC"}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );

};
export default Roadmap;