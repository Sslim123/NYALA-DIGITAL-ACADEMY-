import ActivityCard from './ActivityCard';

const LessonContent = ({ lessons, materials, isEnglish, fetchProgress, activeLesson }) => {

    const lessonMaterials = materials.filter(
        m => m.lesson_id === activeLesson
    );
    const contents = lessonMaterials.find(
        m => m.type === "content"
    );
    const activities = lessonMaterials.filter(
        m => ["lab", "homework", "assessment"].includes(m.type)
    );

    const currentLesson = lessons.find(
        l => l.id === activeLesson
    );

    return (
        <div>
            < div className="col-md-9  lesson-content-area" >
                <div className="lesson-card bg-white shadow-sm rounded-4 p-4">
                    <div className="mb-4 p-3 bg-light rounded-3 border">
                        {currentLesson && !currentLesson.is_final && (
                            <div className="card border-0 shadow-sm mb-4 p-3">
                                <h6 className="fw-bold text-primary">
                                    {isEnglish ? "Step 1: Download Lesson Material" : "الخطوة الأولى: تحميل مواد الدرس "}
                                </h6>
                                <p className="text-muted small">
                                    {isEnglish ? "Download the lesson sheet and study offline." : "قم بتنزيل ورقة الدرس وادرسها دون اتصال بالإنترنت."}
                                </p>
                                {contents && (
                                    <a
                                    href={contents.url}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        download
                                    >
                                        {isEnglish ? "Download Lesson Content" : "📄 تحميل محتوى الدرس"}
                                    </a>
                                )}

                            </div>
                        )}
                    </div>
                
                    <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <span className="badge bg-primary me-2">  {isEnglish ? "Lesson" : "الدرس"} {activeLesson} :</span>
                    </h5>
                    <div className="row g-4">
                        {activities.map((material) => (
                            <div key={material.id} className="col-md-4 d-flex">
                                <ActivityCard
                                    material={material}
                                    fetchProgress={fetchProgress}
                                    isEnglish={isEnglish}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </div>
    )
}
export default LessonContent;