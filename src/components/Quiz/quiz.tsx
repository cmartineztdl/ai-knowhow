import { useState } from "react";
import clsx from "clsx";
import styles from "./quiz.module.css";

export interface Question {
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizProps {
  questions: Question[];
}

export default function Quiz({ questions = [] }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return; // Prevent changing answer after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  let score = 0;
  if (showResults) {
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswerIndex) score++;
    });
  }

  if (!questions || questions.length === 0) {
    return <div className={styles.container}>No questions provided.</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.quizTitle}>Knowledge Check</h3>
      {questions.map((q, qIndex) => {
        const selectedOption = selectedAnswers[qIndex];
        const isCorrect =
          showResults && selectedOption === q.correctAnswerIndex;
        const isWrong =
          showResults &&
          selectedOption !== undefined &&
          selectedOption !== q.correctAnswerIndex;

        return (
          <div
            key={qIndex}
            className={clsx(styles.questionBlock, {
              [styles.correctQuestion]: isCorrect,
              [styles.wrongQuestion]: isWrong,
            })}
          >
            <p className={styles.questionText}>
              <strong>Q{qIndex + 1}:</strong> {q.text}
            </p>
            <div className={styles.optionsList}>
              {q.options.map((opt, optIndex) => {
                const isSelected = selectedOption === optIndex;
                const isCorrectOption =
                  showResults && optIndex === q.correctAnswerIndex;
                const isWrongSelected =
                  showResults && isSelected && !isCorrectOption;

                return (
                  <button
                    key={optIndex}
                    type="button"
                    onClick={() => handleSelect(qIndex, optIndex)}
                    disabled={showResults}
                    className={clsx(styles.optionButton, {
                      [styles.selected]: isSelected && !showResults,
                      [styles.correct]: isCorrectOption,
                      [styles.wrong]: isWrongSelected,
                    })}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div
                className={clsx(styles.explanationBox, {
                  [styles.explanationCorrect]: isCorrect,
                  [styles.explanationWrong]: isWrong,
                })}
              >
                <strong>{isCorrect ? "✅ Correct!" : "❌ Incorrect."}</strong>{" "}
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      <div className={styles.actions}>
        {!showResults ? (
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length}
          >
            Submit Answers
          </button>
        ) : (
          <div className={styles.resultsArea}>
            <div className={styles.scoreText}>
              You scored {score} out of {questions.length}
            </div>
            <button className={styles.resetButton} onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
