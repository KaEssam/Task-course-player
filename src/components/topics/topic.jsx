import React, { useContext, useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, ListGroup, ListGroupItem } from 'reactstrap';
import { CoursePlayerContext } from '../../context/CoursePlayerContext';

// Mock course content data
const courseContent = [
  {
    id: 'week1',
    title: 'Week 1-4',
    subtitle: 'Advanced story telling techniques for writers: Personas, Characters & Plots',
    items: [
      { id: 'intro', title: 'Introduction', type: 'video', locked: false, duration: 10, questions: 0 },
      { id: 'overview', title: 'Course Overview', type: 'video', locked: false, duration: 15, questions: 2, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'exercise-files', title: 'Course Exercise / Reference Files', type: 'pdf', locked: false, duration: 0, questions: 0, url: process.env.PUBLIC_URL + '/Karim-Essam-Backend-Engineer.pdf' },
      { id: 'editor', title: 'Code Editor Installation (Optional if you have one)', type: 'video', locked: true, duration: 8, questions: 0 },
      { id: 'embedding', title: 'Embedding PHP in HTML', type: 'video', locked: true, duration: 12, questions: 0 },
      { id: 'quiz1', title: 'Week 1 Quiz', type: 'exam', locked: false, duration: 20, questions: 10 }
    ]
  },
  {
    id: 'week2',
    title: 'Week 5-8',
    subtitle: 'Advanced story telling techniques for writers: Personas, Characters & Plots',
    items: [
      { id: 'functions', title: 'Defining Functions', type: 'video', locked: true, duration: 15, questions: 0 },
      { id: 'parameters', title: 'Function Parameters', type: 'video', locked: true, duration: 12, questions: 0 },
      { id: 'return', title: 'Return Values From Functions', type: 'video', locked: false, duration: 10, questions: 5 },
      { id: 'global', title: 'Global Variable and Scope', type: 'video', locked: true, duration: 8, questions: 0 },
      { id: 'constants', title: 'Newer Way of creating a Constant', type: 'video', locked: true, duration: 12, questions: 0 },
      { id: 'quiz2', title: 'Week 2 Quiz', type: 'exam', locked: false, duration: 20, questions: 10 }
    ]
  },
  {
    id: 'week3',
    title: 'Week 9-12',
    subtitle: 'Advanced story telling techniques for writers: Personas, Characters & Plots',
    items: [
      { id: 'loops', title: 'Loops and Iteration', type: 'video', locked: true, duration: 15, questions: 0 },
      { id: 'conditionals', title: 'Conditional Statements', type: 'video', locked: true, duration: 12, questions: 0 },
      { id: 'arrays', title: 'Working with Arrays', type: 'video', locked: false, duration: 10, questions: 5 },
      { id: 'objects', title: 'Object-Oriented Programming', type: 'video', locked: true, duration: 18, questions: 0 },
      { id: 'inheritance', title: 'Inheritance and Polymorphism', type: 'video', locked: true, duration: 22, questions: 0 },
      { id: 'quiz3', title: 'Final Exam', type: 'exam', locked: false, duration: 30, questions: 20 }
    ]
  }
];

// Mock exam data
const examData = {
  quiz1: {
    id: 'quiz1',
    title: 'Week 1 Quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is the main purpose of storytelling in writing?',
        options: [
          { id: 'a', text: 'To entertain the reader' },
          { id: 'b', text: 'To communicate complex ideas through narrative' },
          { id: 'c', text: 'To demonstrate writing skills' },
          { id: 'd', text: 'All of the above' }
        ],
        correctAnswer: 'd'
      },
      {
        id: 'q2',
        question: 'Which of these is NOT a common character archetype?',
        options: [
          { id: 'a', text: 'The Hero' },
          { id: 'b', text: 'The Mentor' },
          { id: 'c', text: 'The Antagonist' },
          { id: 'd', text: 'The Programmer' }
        ],
        correctAnswer: 'd'
      }
      // More questions would be added here
    ]
  }
  // Other quiz data would be defined here
};

export function Topic() {
  const [open, setOpen] = useState(['week1']);
  const {
    currentVideo,
    changeVideo,
    togglePdfViewer,
    toggleExamPopup,
    courseProgress,
    sectionsRef
  } = useContext(CoursePlayerContext);

  // Local state to track watched status (pulled from localStorage)
  const [watchedItems, setWatchedItems] = useState({});

  // Load watched status from localStorage on component mount
  useEffect(() => {
    const loadWatchedStatus = () => {
      const watchedStatus = {};
      courseContent.forEach(week => {
        week.items.forEach(item => {
          const savedProgress = localStorage.getItem(`course-progress-${item.id}`);
          if (savedProgress) {
            try {
              const progress = JSON.parse(savedProgress);
              watchedStatus[item.id] = progress.isWatched || false;
            } catch (e) {
              watchedStatus[item.id] = false;
            }
          } else {
            watchedStatus[item.id] = false;
          }
        });
      });
      setWatchedItems(watchedStatus);
    };

    loadWatchedStatus();

    // Set up event listener for storage changes
    const handleStorageChange = () => loadWatchedStatus();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Listen for the videoWatched custom event
  useEffect(() => {
    // Handler for when videos are marked as watched
    const handleVideoWatched = (event) => {
      const { lessonId, isWatched } = event.detail;
      if (isWatched) {
        setWatchedItems(prev => ({
          ...prev,
          [lessonId]: true
        }));
      }
    };

    // Listen for the custom event
    window.addEventListener('videoWatched', handleVideoWatched);

    return () => {
      window.removeEventListener('videoWatched', handleVideoWatched);
    };
  }, []);

  const toggle = (id) => {
    if (open.includes(id)) {
      setOpen(open.filter(item => item !== id));
    } else {
      setOpen([...open, id]);
    }
  };

  const handleItemClick = (item) => {
    if (item.locked) return; // Don't do anything for locked items

    switch(item.type) {
      case 'video':
        changeVideo({
          id: item.id,
          title: item.title,
          type: 'video',
          url: item.url || null, // Use default if not specified
        });
        break;
      case 'pdf':
        togglePdfViewer(item.url, item.title);
        break;
      case 'exam':
        const exam = examData[item.id];
        if (exam) {
          toggleExamPopup(exam, item.id);
        }
        break;
      default:
        break;
    }
  };

  return (
    <section ref={sectionsRef.topics}>
      <Accordion open={open} toggle={toggle}>
        {courseContent.map((week) => (
          <AccordionItem key={week.id} className='mb-5'>
            <AccordionHeader targetId={week.id} tag={'div'} className='topicheaderbtn'>
              <div>
                <h5 className='text-dark'>{week.title}</h5>
                <p className='mb-0 text-secondary'>
                  {week.subtitle}
                </p>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId={week.id} className='topicbody'>
              <ListGroup flush>
                {week.items.map((item) => (
                  <ListGroupItem
                    key={item.id}
                    className={`topicitem text-secondary ${watchedItems[item.id] ? 'topic-item-watched' : ''}`}
                    tag="div"
                    onClick={() => handleItemClick(item)}
                    style={{ cursor: item.locked ? 'default' : 'pointer' }}
                  >
                    <span>
                      {item.type === 'video' && !watchedItems[item.id] && <i className="bi bi-play-circle me-2"></i>}
                      {item.type === 'video' && watchedItems[item.id] && <i className="bi bi-check-circle-fill me-2 text-success"></i>}
                      {item.type === 'pdf' && <i className="bi bi-file-earmark-text me-2"></i>}
                      {item.type === 'exam' && <i className="bi bi-pencil-square me-2"></i>}
                      {item.title}
                    </span>

                    {item.locked ? (
                      <span><i className="bi bi-lock ms-3"></i></span>
                    ) : (
                      <div className='topiciteminfo'>

                        {item.questions > 0 && (
                          <div className='topicitemque mb-1 mb-xxl-0'>{item.questions} QUESTION{item.questions > 1 ? 'S' : ''}</div>
                        )}
                        {item.duration > 0 && (
                          <div className='topicitemmin mb-1 mb-xxl-0'>{item.duration} MINUTE{item.duration > 1 ? 'S' : ''}</div>
                        )}
                      </div>
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function Topicheader() {
  const { courseProgress, updateProgress } = useContext(CoursePlayerContext);

  // Call updateProgress when component mounts to ensure latest progress
  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  return (
    <header className='topicsheader'>
      <h2 className='topicsheadertitle'>Topics for This Course</h2>
      <div className='topicsheaderprogress'>
        <div className='topicsheaderprogresslocsignbar'>
          <div
            className='topicsheaderprogresslocsign bi'
            style={{ marginLeft: `calc(${courseProgress}% - 22px)` }}
          >
            You
          </div>
        </div>
        <div className='progress topicsheaderprogressbar' style={{ backgroundColor: "#e9ecef" }}>
          <div
            className='progress-bar'
            role="progressbar"
            style={{
              width: `${courseProgress}%`,
              backgroundColor: "var(--successbgprogress)"
            }}
            aria-valuenow={courseProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className='topicsheaderprogressvaluebar'>
          <div
            className='topicsheaderprogressvalue'
            style={{ marginLeft: `calc(${courseProgress}% - 11px)` }}
          >
            {courseProgress}%
          </div>
        </div>
      </div>
    </header>
  );
}
