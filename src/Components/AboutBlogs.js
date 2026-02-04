import React from 'react';

const AboutBlog = ({ isEnglish }) => {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
             {/* Preparing for your Video/Image */}
             <div className="ratio ratio-16x9 shadow rounded-4 overflow-hidden bg-dark">
                <video controls poster="/images/nyala_video_thumb.jpg">
                   <source src="/videos/intro_nyala.mp4" type="video/mp4" />
                   Your browser does not support the video tag.
                </video>
             </div>
          </div>
          <div className="col-lg-6" dir={isEnglish ? 'ltr' : 'rtl'}>
            <h2 className="fw-bold text-primary mb-4">
              {isEnglish ? "From Nyala to the World" : "من نيالا إلى العالم"}
            </h2>
            <p className="lh-lg text-muted">
              {isEnglish 
                ? "Imagine a youth in Al-Matar or Al-Nahda neighborhood managing global networks from home. This is the reality we build." 
                : "تخيل شاباً في مقتبل العمر يدير أمن شبكات عالمية وهو في منزله بحي المطار أو النهضة. هذا هو الواقع الذي نبنيه."}
            </p>
            <div className="alert alert-info border-0 shadow-sm mt-4">
                <strong>{isEnglish ? "Digital Transformation is:" : "التحول الرقمي ليس مجرد أجهزة، بل هو:"}</strong>
                <ul className="mt-2 mb-0">
                    <li>{isEnglish ? "Reclaiming Time" : "استعادة الزمن"}</li>
                    <li>{isEnglish ? "Protecting Memory" : "حماية الذاكرة"}</li>
                    <li>{isEnglish ? "Opening Global Doors" : "فتح الأبواب العالمية"}</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBlog;