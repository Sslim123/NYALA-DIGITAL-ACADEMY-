import axios from "axios"
import { useState } from "react"

export default function StartExam() {

  const [message, setMessage] = useState("")

  const startExam = async () => {

    const response = await axios.post(
      "http://localhost:5000/api/exam/start",
      {
        user_id: 1,
        exam_id: 1
      }
    )

    if (!response.data.allowed) {
      setMessage("You reached maximum attempts")
      return
    }

    setMessage("Exam started. Attempt #" + response.data.attempt.attempt_number)

  }

  return (
    <div>

      <button onClick={startExam}>
        Start Exam
      </button>

      <p>{message}</p>

    </div>
  )
}