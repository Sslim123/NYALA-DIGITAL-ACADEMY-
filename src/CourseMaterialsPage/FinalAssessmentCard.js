import React from "react";

const FinalAssessmentCard = ({ materials, lessons, courseStatus, activeLesson, currentUnitProgress, submitAssessment}) => {
     const lessonMaterials = materials.filter(
        m => m.lesson_id === activeLesson
    );
   const finalMaterial = lessonMaterials.find(
        m => m.type === "unit_final"
    );
    const courseFinal = lessonMaterials.find(
        m => m.type === "course_final"
    );
    const currentLesson = lessons.find(
        l => l.id === activeLesson
    );

    return (

        <div>
            {currentLesson && currentLesson.is_final && finalMaterial && (
                <div className="card border-warning shadow-sm mt-4">
                    <div className="card-body">
                        <h6>Unit Final Assessment</h6>
                        {finalMaterial && (
                            <a
                                href={`http://localhost:5000${finalMaterial.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-danger mb-3"
                            >
                                Download Final Assessment
                            </a>
                        )}
                        <button
                            disabled={currentUnitProgress < 70}
                            onClick={() =>
                                document.getElementById(`unitFinal-${activeLesson}`).click()
                            }
                        >
                            Submit Final
                        </button>
                        <input
                            type="file"
                            id={`unitFinal-${activeLesson}`}
                            style={{ display: "none" }}
                            onChange={(e) =>
                                submitAssessment(finalMaterial.id, e.target.files[0])
                            }
                        />
                    </div>
                </div>)}
            {currentLesson && currentLesson.is_final && courseFinal && (

                <div className="card border-danger shadow-sm mt-4">
                    <div className="card-body">
                        <h6>Final Course Assessment</h6>
                        {courseFinal && (
                            <a
                                href={`http://localhost:5000${courseFinal.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-danger mb-3"
                            >
                                Download Course Final
                            </a>
                        )}
                        <button
                            disabled={!courseStatus?.courseUnlocked}
                            onClick={() =>
                                document.getElementById("courseFinalInput").click()
                            }
                        >
                            Submit Course Final
                        </button>
                    </div>
                </div>
            )}
        </div>
    )

}
export default FinalAssessmentCard;