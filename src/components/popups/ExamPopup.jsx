import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Progress } from 'reactstrap';
import Popup from './Popup';

const ExamPopup = ({ isOpen, onClose, examData, lessonId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (lessonId && isOpen) {
      const savedProgress = sessionStorage.getItem(`exam-progress-${lessonId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setAnswers(progress.answers || {});
        setCurrentQuestion(progress.currentQuestion || 0);
        setSubmitted(progress.submitted || false);
        setScore(progress.score || 0);
      }
    }
  }, [lessonId, isOpen]);

  useEffect(() => {
    if (lessonId) {
      sessionStorage.setItem(`exam-progress-${lessonId}`, JSON.stringify({
        answers,
        currentQuestion,
        submitted,
        score
      }));
    }
  }, [answers, currentQuestion, submitted, score, lessonId]);

  const calculateScore = () => {
    if (!examData) return 0;
    
    let correctAnswers = 0;
    examData.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / examData.questions.length) * 100);
  };

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setSubmitted(true);
    
    if (lessonId) {
      localStorage.setItem(`exam-completed-${lessonId}`, 'true');
      localStorage.setItem(`exam-score-${lessonId}`, calculatedScore.toString());
    }
  };

  const resetExam = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setScore(0);
    
    if (lessonId) {
      sessionStorage.removeItem(`exam-progress-${lessonId}`);
    }
  };

  if (!examData) return null;

  const currentQuestionData = examData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / examData.questions.length) * 100;
  const allQuestionsAnswered = examData.questions.every(q => answers[q.id]);

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={submitted ? "Exam Results" : examData.title}
    >
      {!submitted ? (
        <div className="exam-container">
          <div className="exam-progress-container">
            <div className="d-flex justify-content-between mb-1">
              <small>Question {currentQuestion + 1} of {examData.questions.length}</small>
              <small>{Math.round(progress)}% Complete</small>
            </div>
            <Progress
              value={progress}
              className="exam-progress-bar"
            />
          </div>

          <div className="exam-question-container">
            <div className="exam-question">
              <h4>{currentQuestionData.question}</h4>

              <Form className="exam-answers">
                {currentQuestionData.options.map((option) => (
                  <FormGroup key={option.id} check className="exam-answer-option">
                    <Label check>
                      <Input
                        type="radio"
                        name={`question-${currentQuestionData.id}`}
                        checked={answers[currentQuestionData.id] === option.id}
                        onChange={() => handleAnswerChange(currentQuestionData.id, option.id)}
                      />
                      {option.text}
                    </Label>
                  </FormGroup>
                ))}
              </Form>
            </div>
          </div>

          <div className="exam-navigation">
            <Button
              color="light"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < examData.questions.length - 1 ? (
              <Button
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                color="success"
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
              >
                Submit Exam
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="exam-results">
          <div className="text-center mb-4">
            <div className="score-circle">
              <h2>{score}%</h2>
            </div>
            <h3 className="mt-3">
              {score >= 70 ? 'Congratulations!' : 'Almost there!'}
            </h3>
            <p>
              {score >= 70 
                ? 'You have successfully passed the exam.' 
                : 'Keep studying and try again to improve your score.'}
            </p>
          </div>

          <div className="exam-actions d-flex justify-content-center">
            <Button color="secondary" onClick={onClose} className="me-2">
              Close
            </Button>
            <Button color="primary" onClick={resetExam}>
              Retake Exam
            </Button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ExamPopup;
