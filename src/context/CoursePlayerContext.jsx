import React, { createContext, useEffect, useRef, useState } from 'react';

// Create Context
export const CoursePlayerContext = createContext();

// Provider Component
export const CoursePlayerProvider = ({ children }) => {
  // State for current video
  const [currentVideo, setCurrentVideo] = useState({
    id: 'intro',
    title: 'Course Introduction',
    type: 'video',
    url: null, // Will use default from Player component
  });

  // Course information - in a real app, this would come from an API
  const [courseInfo, setCourseInfo] = useState({
    id: 'web-dev-2023',
    name: 'Advanced Web Development',
    instructor: 'John Smith',
    totalLessons: 20
  });

  // State for popups
  const [popups, setPopups] = useState({
    pdfViewer: { isOpen: false, pdfUrl: null, title: null },
    exam: { isOpen: false, examData: null, lessonId: null },
    askQuestion: { isOpen: false },
    leaderboard: { isOpen: false },
  });

  // Refs for scrolling to sections
  const sectionsRef = {
    topics: useRef(null),
    comments: useRef(null),
  };

  // Calculate overall course progress
  const [courseProgress, setCourseProgress] = useState(0);

  // Define calculateProgress outside of useEffect so it can be called from anywhere
  const calculateProgress = () => {
    // Get all keys from localStorage that match our pattern
    const keys = Object.keys(localStorage).filter(key =>
      key.startsWith('course-progress-')
    );

    if (keys.length === 0) return 0;

    // Count how many are marked as watched (80% complete)
    const watchedCount = keys.filter(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return data.isWatched === true;
      } catch (e) {
        return false;
      }
    }).length;

    // Get total number of lessons that can be watched (videos only, not quizzes)
    let totalLessons = courseInfo.totalLessons;

    return Math.round((watchedCount / totalLessons) * 100);
  };

  useEffect(() => {
    // Calculate initial progress
    setCourseProgress(calculateProgress());

    // Listen for the videoWatched event to update progress
    const handleVideoWatched = () => {
      // Immediately update progress when a video is watched
      const newProgress = calculateProgress();
      setCourseProgress(newProgress);
    };

    window.addEventListener('videoWatched', handleVideoWatched);
    // Also listen for storage events to update when localStorage changes
    window.addEventListener('storage', handleVideoWatched);

    return () => {
      window.removeEventListener('videoWatched', handleVideoWatched);
      window.removeEventListener('storage', handleVideoWatched);
    };
  }, []);

  // Function to scroll to sections
  const scrollToSection = (sectionName) => {
    if (sectionsRef[sectionName]?.current) {
      sectionsRef[sectionName].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Toggle popup functions
  const togglePdfViewer = (pdfUrl = null, title = null) => {
    setPopups(prev => ({
      ...prev,
      pdfViewer: {
        isOpen: pdfUrl !== null ? true : !prev.pdfViewer.isOpen,
        pdfUrl,
        title
      }
    }));
  };

  const toggleExamPopup = (examData = null, lessonId = null) => {
    setPopups(prev => ({
      ...prev,
      exam: {
        isOpen: examData !== null ? true : !prev.exam.isOpen,
        examData,
        lessonId
      }
    }));
  };

  const toggleAskQuestionPopup = () => {
    setPopups(prev => ({
      ...prev,
      askQuestion: { isOpen: !prev.askQuestion.isOpen }
    }));
  };

  const toggleLeaderboardPopup = () => {
    setPopups(prev => ({
      ...prev,
      leaderboard: { isOpen: !prev.leaderboard.isOpen }
    }));
  };

  // Function to change current video
  const changeVideo = (videoData) => {
    setCurrentVideo(videoData);
  };

  // Function to manually update progress - can be called from components
  const updateProgress = () => {
    setCourseProgress(calculateProgress());
  };

  return (
    <CoursePlayerContext.Provider
      value={{
        currentVideo,
        changeVideo,
        courseInfo,
        popups,
        togglePdfViewer,
        toggleExamPopup,
        toggleAskQuestionPopup,
        toggleLeaderboardPopup,
        courseProgress,
        updateProgress,
        scrollToSection,
        sectionsRef
      }}
    >
      {children}
    </CoursePlayerContext.Provider>
  );
};
