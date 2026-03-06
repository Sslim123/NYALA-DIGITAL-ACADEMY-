import { useEffect, useState } from "react";

export default function ExamPage({ lessonId }) {

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [examRoute, setExamRoute] = useState(lessonId);

  useEffect(() => {
    const token = localStorage.getItem("token");

    let examRoute = lessonId;
    if (lessonId === 16 && result?.passed) {
      examRoute = "final-course";
    }
    fetch(`/api/exams/${examRoute}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setExam);
  }, [examRoute]);



  const submitExam = async () => {

    const token = localStorage.getItem("token");

    console.log("answers", answers);
    const payload = Object.entries(answers).map(([q, a]) => ({
      question_id: Number(q),
      selected: a
    }));
    try {

      const res = await fetch("/api/exams/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lesson_id: examRoute,
          answers: payload
        })
      });

      const result = await res.json();
      setResult(result);
      if (result?.passed && lessonId === 16) {
        alert("Final course exam unlocked");
        setExamRoute("final-course");
        setAnswers({})
        setResult(null);
      }

      if (result.certificate) {

        alert("🎉 Congratulations! Certificate unlocked");

        window.location.href = "/certificate";

      }
    } catch (err) {

      console.error("Exam submission failed:", err);

    }

  };

  if (!exam) return <p>Loading exam...</p>;

  return (

    <div>

      <h4 className="mb-4">Final Assessment</h4>

      {exam.questions?.map((q, index) => (

        <div key={q.id} className="card p-3 mb-3">

          <p>
            {index + 1}. {q.question}
          </p>
          {q.options.map((option, optionIndex) => (

            <label key={optionIndex}>

              <input
                type="radio"
                name={`q-${q.id}`}
                onChange={() =>
                  setAnswers(prev => ({
                    ...prev,
                    [q.id]: optionIndex
                  })
                  )}
              />

              {option}

            </label>

          ))}

        </div>

      ))}
      <button
        className="btn btn-success mt-4"
        onClick={submitExam}
      >
        Submit Exam
      </button>
      {result && (
        <div className="alert alert-info mt-4">

          Score: {result.percentage}%

          {result.passed
            ? " ✅ Passed"
            : " ❌ Failed"}

        </div>
      )}
    </div>

  );

}