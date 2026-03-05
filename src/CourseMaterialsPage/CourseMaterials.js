import React, { useEffect, useState } from "react";
import UnitSideBar from "./UnitSidebar";
import LessonContent from "./LessonContent";
import FinalAssessmentCard from './FinalAssessmentCard';
import { Translations } from "../TranslateContent/Translations";

const CourseMaterials = ({ isEnglish }) => {

    const contents = isEnglish ? Translations.en : Translations.ar;

    const submitAssessment = async (assessmentId, file) => {
        const formData = new FormData();
        formData.append("assessmentId", assessmentId);
        formData.append("file", file);
        await fetch("/api/assessments/submit", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        alert("Submitted successfully");
    };

    useEffect(() => {
        document.documentElement.dir = isEnglish ? "ltr" : "rtl";
    }, [isEnglish]);


    const [units, setUnits] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [activeUnit, setActiveUnit] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [courseStatus,] = useState(null);
    const [unitProgress, setUnitProgress] = useState({});
    const [courseProgress, setCourseProgress] = useState(0);
    const currentUnitProgress = unitProgress?.[activeUnit] ?? 0;
    useEffect(() => {
        const fetchUnits = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, redirecting to login...");
                return;
            }
            try {

                const res = await fetch(`/api/units/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setUnits(data);

                if (units.length > 0 && !activeUnit) {
                    setActiveUnit(units[0].id);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
            }
        }
        fetchUnits();

    }, []);

    useEffect(() => {

        if (activeUnit === null) return;
        console.log("LESSONS EFFECT TRIGGERED, activeUnit:", activeUnit);

        const fetchLessons = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(
                    `/api/lessons/${activeUnit}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const data = await res.json();
                setLessons(data);

                if (data.length > 0 && !activeLesson) {
                    setActiveLesson(data[0].id);
                }
            } catch (err) {
                console.error("Lessons fetch failed:", err);
            }
        };

        fetchLessons();

    }, [activeUnit]);

    useEffect(() => {
        if (!activeLesson) return;

        const fetchMaterials = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(
                    `/api/materials/${activeLesson}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();
                setMaterials(data);
            } catch (err) {
                console.error("Failed to fetch materials:", err);

            }
        };

        fetchMaterials();
    }, [activeLesson]);

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                return;
            }
            const res = await fetch("/api/free-course-progress",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Cache-Control": "no-cache",
                        "Content-Type": "application/json"
                    }
                });
            if (res.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }
            const data = await res.json();
            setUnitProgress(data.unitProgress);
            setCourseProgress(data.courseProgress);

            if (data?.progress !== undefined) {
                setCourseProgress(data.progress);
            }
        } catch (error) {
            console.error("Network or Parsing Error:", error);
        }
    };
    console.log("units", units);
    console.log("lessons", lessons);
    console.log("materials", materials)
    useEffect(() => {

        fetchProgress();
    }, []);

    if (!units.length) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <>

            <UnitSideBar units={units} courseProgress={courseProgress} activeLesson={activeLesson} isEnglish={isEnglish} contents={contents} activeUnit={activeUnit}
                setActiveUnit={setActiveUnit} lessons={lessons} setActiveLesson={setActiveLesson} />
            <LessonContent fetchProgress={fetchProgress} isEnglish={isEnglish} materials={materials} lessons={lessons} activeLesson={activeLesson} />
            <FinalAssessmentCard materials={materials} lessons={lessons} submitAssessment={submitAssessment} currentUnitProgress={currentUnitProgress} activeLesson={activeLesson} courseStatus={courseStatus} />

        </>
    )
}

export default CourseMaterials;