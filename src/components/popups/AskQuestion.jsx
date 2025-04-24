import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import Popup from './Popup';

const AskQuestion = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedDraft = sessionStorage.getItem('question-draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setQuestion(draft.question || '');
          setTopic(draft.topic || '');
        } catch (error) {
          console.error('Error parsing saved question draft:', error);
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (question || topic) {
      sessionStorage.setItem('question-draft', JSON.stringify({
        question,
        topic,
      }));
    }
  }, [question, topic]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setQuestion('');
      setTopic('');
      setSubmitted(false);
      sessionStorage.removeItem('question-draft');
    }, 1500);
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title="Ask a Question"
    >
      {!submitted ? (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="topic">Topic</Label>
            <Input
              type="select"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            >
              <option value="">Select a topic</option>
              <option>Week 1: Introduction to Storytelling</option>
              <option>Week 2: Character Development</option>
              <option>Week 3: Plot Structures</option>
              <option>Week 4: Advanced Techniques</option>
              <option>Other</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="question">Your Question</Label>
            <Input
              type="textarea"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows={5}
              required
            />
          </FormGroup>
          <div className="d-flex justify-content-end">
            <Button color="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Submit Question
            </Button>
          </div>
        </Form>
      ) : (
        <div className="text-center py-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3">Question Submitted!</h4>
          <p>The instructor will respond to your question shortly.</p>
        </div>
      )}
    </Popup>
  );
};

export default AskQuestion;
