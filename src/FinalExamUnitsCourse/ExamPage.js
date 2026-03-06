import { useEffect, useState } from "react";

export default function ExamPage({ lessonId }) {

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result,setResult] = useState(null);

  useEffect(() => {

    fetch(`/api/exams/${lessonId}`)
      .then(res => res.json())
      .then(setExam);

  }, [lessonId]);
  const submitExam = async () => {

    const token = localStorage.getItem("token");

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
          lesson_id: lessonId,
          answers: payload
        })
      });

      const result = await res.json();

      alert(`Score: ${result.percentage}%`);

    } catch (err) {

      console.error("Exam submission failed:", err);

    }

  };
  setResult(result);

  if (!exam) return <p>Loading exam...</p>;

  return (

    <div>

      <h4 className="mb-4">Final Assessment</h4>

      {exam.questions.map((q, index) => (

        <div key={q.id} className="card p-3 mb-3">

          <p>
            {index + 1}. {q.question}
          </p>

          {q.options.map(opt => (

            <div key={opt}>

              <label>
                <input type="radio" name={`q-${q.id}`} />
                {opt}
              </label>

            </div>

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