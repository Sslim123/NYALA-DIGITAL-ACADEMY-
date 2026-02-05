import React from 'react';

const Features = ({ isEnglish }) => {
  const tracks = [
    {
      titleEn: "Digital Archiving",
      titleAr: "الأرشفة الرقمية",
      icon: "bi-archive-fill",
      color: "success",
      descEn: "Turning hills of paper into smart digital assets using OCR.",
      descAr: "نحول تلال الورق إلى أصول رقمية ذكية عبر حلول الأرشفة المتقدمة."
    },
    {
      titleEn: "Cisco Networking",
      titleAr: "هندسة الشبكات",
      icon: "bi-router-fill",
      color: "primary",
      descEn: "Building the high-speed information highways of the future.",
      descAr: "نتعلم كيف نبني الطرق السريعة للمعلومات من الصفر حتى الاحتراف."
    },
    {
      titleEn: "Cybersecurity",
      titleAr: "الأمن السيبراني",
      icon: "bi-shield-lock-fill",
      color: "danger",
      descEn: "Security is Sovereignty. Protect data and build digital fortresses.",
      descAr: "الأمان هو السيادة. ندربك على حماية البيانات وبناء الحصون الرقمية."
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold">{isEnglish ? "Our Power Tracks" : "مسارات القوة"}</h2>
        <div className="row g-4">
          {tracks.map((track, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-top transition">
                <div className="card-body text-center p-4">
                  <i className={`bi ${track.icon} display-4 text-${track.color} mb-3`}></i>
                  <h4 className="fw-bold mb-3">{isEnglish ? track.titleEn : track.titleAr}</h4>
                  <p className="text-muted small">{isEnglish ? track.descEn : track.descAr}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;