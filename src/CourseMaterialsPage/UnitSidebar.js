
const UnitSideBar = ({ lessons, units, isEnglish, setActiveLesson, setActiveUnit, activeLesson, activeUnit, contents, courseProgress }) => {

    return (
        <>

            <div className="hero-progress mb-4 p-4 shadow-sm rounded-4 bg-white">

                {!navigator.onLine && (
                    <div className="alert alert-warning text-center">
                        ⚠ You are currently offline. You can download materials, but upload will not work.
                    </div>
                )}
                <div className="hero-progress mb-4 p-4 shadow-sm rounded-4 bg-white">

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="fw-bold mb-1">
                                {contents.intro}

                            </h4>
                            <small className="text-muted">
                                {contents.tracking}
                            </small>
                        </div>

                        <div className="text-end">
                            <div className="fw-bold fs-3 text-primary">
                                {courseProgress}%
                            </div>
                            <small className="text-muted">Completed</small>
                        </div>
                    </div>

                    <div className="progress mt-3" style={{ height: "14px" }}>
                        <div
                            className="progress-bar"
                            style={{
                                width: `${courseProgress}%`,
                                background: "linear-gradient(90deg,#4e73df,#1cc88a)"
                            }}
                        />
                    </div>

                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="course-sidebar shadow-sm rounded-4 bg-white p-4">
                        <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary">
                            {contents.course_content}
                        </h5>
                        <div className="units-wrapper" >
                            {units.map(unit => (
                                <div key={unit.id} className="mb-3 border-bottom pb-2">
                                    <div
                                        className={`p-3 rounded shadow-sm ${activeUnit === unit.id ? "bg-primary text-white" : "bg-light text-dark"}`}
                                        onClick={() => {
                                            console.log("UNIT CLICKED:", unit.id);

                                            setActiveUnit(Number(unit.id));
                                             setActiveLesson(null);
                                        }}
                                        style={{ cursor: "pointer", transition: "0.3s" }}
                                    >
                                        {isEnglish? unit.title : unit.title_ar}
                                    </div>

                                    {activeUnit === unit.id && (
                                        <div className="ms-2 mt-2 p-2 bg-white rounded shadow-sm">
                                            {unit.description && (
                                                <p className="text-muted small mb-2 border-start ps-2" style={{ fontStyle: "italic" }}>
                                                    {isEnglish ? unit.description: unit.description_ar}
                                                </p>
                                            )}

                                            <hr className="my-1" />
                                            <div className="ms-2 mt-2">
                                                {lessons?.map(lesson => (
                                                    <div
                                                         key={lesson.id}
                                                        className={`p-3 my-2 rounded-3 border-start border-4 ${activeLesson === lesson.id
                                                            ? "bg-primary-subtle border-primary shadow-sm"
                                                            : "bg-white border-light-subtle shadow-xs"
                                                            }`}
                                                        onClick={() => setActiveLesson(lesson.id)}
                                                        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                                                    >
                                                        <div className="d-flex align-items-center mb-1">
                                                            <i className={`bi ${activeLesson === lesson.id ? "bi-journal-check" : "bi-journal-text"} me-2 fs-5`}></i>
                                                            <strong className={activeLesson === lesson.id ? "text-primary" : "text-dark"}>
                                                                {isEnglish ? lesson.title : lesson.title_ar}
                                                            </strong>
                                                        </div>

                                                        <div
                                                            className={`small ${activeLesson === lesson.id ? "text-primary-emphasis" : "text-muted"}`}
                                                            style={{ fontSize: "0.8rem", lineHeight: "1.4" }}
                                                        >
                                                            {isEnglish ? lesson.content : lesson.content_ar}
                                                        </div>
                                                    </div>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
export default UnitSideBar;