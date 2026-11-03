import React, { useEffect, useState } from "react";
import "./App.css";

const questions = [
  {
    id: 1,
    category: "HTML",
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"]
  },
  {
    id: 2,
    category: "HTML",
    question: "Which attribute is used to provide alternative text for an image?",
    options: ["title", "src", "alt", "name"]
  },
  {
    id: 3,
    category: "CSS",
    question: "Which CSS property is used to change text color?",
    options: ["font-style", "text-color", "color", "background-color"]
  },
  {
    id: 4,
    category: "JavaScript",
    question: "Which keyword declares a block-scoped variable that can be reassigned?",
    options: ["const", "let", "static", "final"]
  },
  {
    id: 5,
    category: "JavaScript",
    question: "What does === check in JavaScript?",
    options: [
      "Only value",
      "Only data type",
      "Value and data type",
      "Variable name"
    ]
  },
  {
    id: 6,
    category: "JavaScript",
    question: "Which method converts a JSON string into a JavaScript object?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.object()"
    ]
  },
  {
    id: 7,
    category: "JavaScript",
    question: "Which array method creates a new array by transforming each element?",
    options: ["filter()", "reduce()", "map()", "find()"]
  },
  {
    id: 8,
    category: "React",
    question: "Which hook is used to manage state in a functional React component?",
    options: ["useEffect", "useState", "useRef", "useMemo"]
  },
  {
    id: 9,
    category: "React",
    question: "What is the purpose of the useEffect hook?",
    options: [
      "To create CSS styles",
      "To handle side effects",
      "To declare variables",
      "To create HTML elements"
    ]
  },
  {
    id: 10,
    category: "React",
    question: "Why are keys used when rendering lists in React?",
    options: [
      "To add CSS",
      "To identify list elements between renders",
      "To create API requests",
      "To store passwords"
    ]
  },
  {
    id: 11,
    category: "React",
    question: "What is JSX in React?",
    options: [
      "A database",
      "A syntax extension for JavaScript",
      "A CSS framework",
      "A backend language"
    ]
  },
  {
    id: 12,
    category: "Node.js",
    question: "What is Node.js primarily used for?",
    options: [
      "Running JavaScript outside the browser",
      "Writing CSS",
      "Creating database tables only",
      "Designing images"
    ]
  },
  {
    id: 13,
    category: "Node.js",
    question: "Which command initializes a Node.js project?",
    options: [
      "node start",
      "npm init",
      "npm create-db",
      "node install"
    ]
  },
  {
    id: 14,
    category: "MySQL",
    question: "Which SQL command retrieves records from a table?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"]
  },
  {
    id: 15,
    category: "Logic",
    question: "What is the output of 5 + 3 * 2 in JavaScript?",
    options: ["16", "11", "13", "10"]
  }
];

function App() {
  const [page, setPage] = useState("welcome");

  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (page !== "test" || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [page, submitted]);

  useEffect(() => {
    if (page === "test" && timeLeft === 0 && !submitted && !sending) {
      submitTest();
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, timeLeft, submitted, sending]);

  const handleCandidateChange = (e) => {
    setCandidate({
      ...candidate,
      [e.target.name]: e.target.value
    });
  };

  const startTest = (e) => {
    e.preventDefault();
    setPage("test");
  };

  const selectAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const correctAnswers = [1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 0, 1, 2, 1];

  const submitTest = async () => {
    if (sending || submitted) return;

    setSending(true);
    setSendError("");

    const correct = questions.reduce(
      (total, item, index) => total + (answers[index] === correctAnswers[index] ? 1 : 0),
      0
    );
    const wrong = questions.length - correct;

    const submission = {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      score: correct,
      correct,
      wrong,
      total: questions.length,
      answers: questions.map((item, index) => ({
        question: item.question,
        selectedAnswer:
          answers[index] !== undefined ? item.options[answers[index]] : "Not answered",
        correctAnswer: item.options[correctAnswers[index]],
        isCorrect: answers[index] === correctAnswers[index]
      }))
    };

    try {
      const response = await fetch(
"http://201.18.204.95/n8n/webhook/cbb68ec4-9edc-4001-9678-9bc34313e0bb"  ,     {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission)
        }
      );

      if (!response.ok) throw new Error(`Submission failed (${response.status})`);
      setSubmitted(true);
    } catch (error) {
      console.error("Screening submission error:", error);
      setSendError(
        "Your test could not be sent right now. Please contact the recruitment team."
      );
    } finally {
      setSending(false);
    }
  };

  const finishTest = () => {
    submitTest();
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const question = questions[currentQuestion];

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span>Manjal</span>Karu
        </div>
        <div className="header-tag">CAREERS 2026</div>
      </header>

      <main className="main-container">

        {page === "welcome" && (
          <section className="welcome-card">
            <div className="eyebrow">MANJALKARU RECRUITMENT</div>

            <h1>
              Your journey<br />
              starts <span>here.</span>
            </h1>

            <p className="intro">
              Welcome to the Full Stack Developer screening
              assessment. Showcase your technical knowledge
              and take the next step with ManjalKaru.
            </p>

            <div className="test-info">
              <div><strong>15</strong><span>Questions</span></div>
              <div><strong>15</strong><span>Minutes</span></div>
              <div><strong>15</strong><span>Total Marks</span></div>
            </div>

            <form onSubmit={startTest} className="candidate-form">
              <h2>Candidate details</h2>

              <label>Full name</label>
              <input
                name="name"
                value={candidate.name}
                onChange={handleCandidateChange}
                placeholder="Enter your full name"
                required
              />

              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={candidate.email}
                onChange={handleCandidateChange}
                placeholder="Enter your email"
                required
              />

              <label>Mobile number</label>
              <input
                type="tel"
                name="phone"
                value={candidate.phone}
                onChange={handleCandidateChange}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />

              <button type="submit">
                Start screening →
              </button>
            </form>

            <p className="notice">
              Please ensure your details are accurate before starting.
            </p>
          </section>
        )}

        {page === "test" && !submitted && (
          <section className="test-card">
            <div className="test-topbar">
              <div>
                <div className="eyebrow">FULL STACK DEVELOPER</div>
                <h2>Screening Assessment</h2>
              </div>

              <div className={`timer ${timeLeft <= 60 ? "timer-warning" : ""}`}>
                <span>TIME LEFT</span>
                <strong>{formatTime()}</strong>
              </div>
            </div>

            <div className="progress-details">
              <span>Question {currentQuestion + 1} of 15</span>
              <span>{answeredCount} answered</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentQuestion + 1) / 15) * 100}%`
                }}
              />
            </div>

            <div className="question-section">
              <span className="question-category">
                {question.category}
              </span>

              <h2>{question.question}</h2>

              <div className="options-list">
                {question.options.map((option, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`option ${
                      answers[currentQuestion] === index
                        ? "option-selected"
                        : ""
                    }`}
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="question-navigation">
              <button
                className="secondary-button"
                disabled={currentQuestion === 0}
                onClick={() =>
                  setCurrentQuestion(currentQuestion - 1)
                }
              >
                ← Previous
              </button>

              {currentQuestion < 14 ? (
                <button
                  className="primary-button"
                  onClick={() =>
                    setCurrentQuestion(currentQuestion + 1)
                  }
                >
                  Next question →
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={finishTest}
                  disabled={sending}
                >
                  {sending ? "Submitting..." : "Submit test"}
                </button>
              )}
            </div>

            <div className="question-grid">
              {questions.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className={`question-number ${
                    currentQuestion === index ? "active-question" : ""
                  } ${
                    answers[index] !== undefined ? "answered-question" : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>
        )}

        {page === "test" && sendError && !submitted && (
          <section className="welcome-card confirmation">
            <h2>Submission issue</h2>
            <p>{sendError}</p>
            <button className="primary-button" onClick={submitTest} disabled={sending}>
              {sending ? "Retrying..." : "Retry submission"}
            </button>
          </section>
        )}

        {page === "test" && submitted && (
          <section className="welcome-card confirmation">
            <div className="success-icon">✓</div>
            <h1>Test <span>submitted!</span></h1>
            <p>
              Thank you, {candidate.name}.
            </p>
            <p>
              Your responses have been submitted successfully.
              Our recruitment team will review your assessment
              and contact you regarding the next steps.
            </p>
            <p className="notice">
              ManjalKaru Recruitment Team
            </p>
          </section>
        )}

      </main>

      <footer>
        © 2026 ManjalKaru Pvt Limited. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
