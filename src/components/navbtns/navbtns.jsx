import React, { useContext } from "react";
import { Button } from "reactstrap";
import { CoursePlayerContext } from "../../context/CoursePlayerContext";

export function Navbtns() {
  const {
    scrollToSection,
    toggleAskQuestionPopup,
    toggleLeaderboardPopup
  } = useContext(CoursePlayerContext);

  const handleCurriculumClick = () => {
    scrollToSection('topics');
  };

  const handleCommentsClick = () => {
    scrollToSection('comments');
  };

  const handleAskQuestionClick = () => {
    toggleAskQuestionPopup();
  };

  const handleLeaderboardClick = () => {
    toggleLeaderboardPopup();
  };

  return (
    <section className='pageshortcut'>
      <div className="nav-btn-container">
        <Button
          outline
          className='pageshortcutbtn bi-list-ul'
          onClick={handleCurriculumClick}
          title="Go to Curriculum"
          aria-label="Go to Curriculum"
        />
      </div>

      <div className="nav-btn-container">
        <Button
          outline
          className='pageshortcutbtn bi-chat-left-dots'
          onClick={handleCommentsClick}
          title="Go to Comments"
          aria-label="Go to Comments"
        />
      </div>

      <div className="nav-btn-container">
        <Button
          outline
          className='pageshortcutbtn bi-trophy'
          onClick={handleLeaderboardClick}
          title="View Leaderboard"
          aria-label="View Leaderboard"
        />
      </div>

      <div className="nav-btn-container">
        <Button
          outline
          className='pageshortcutbtn bi-question-circle'
          onClick={handleAskQuestionClick}
          title="Ask a Question"
          aria-label="Ask a Question"
        />
      </div>
    </section>
  );
}
