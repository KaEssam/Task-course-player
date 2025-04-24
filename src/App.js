import { Fragment, lazy, Suspense } from 'react';
import { Container, Spinner } from 'reactstrap';

import Comments from './components/comments/comments';
import Header from './components/header/header';
import { Materials } from './components/materials/materials';
import { Navbtns } from './components/navbtns/navbtns';
import { Topic, Topicheader } from './components/topics/topic';

import AskQuestion from './components/popups/AskQuestion';
import ExamPopup from './components/popups/ExamPopup';
import Leaderboard from './components/popups/Leaderboard';
import PdfViewer from './components/popups/PdfViewer';

import { useContext } from 'react';
import { CoursePlayerContext, CoursePlayerProvider } from './context/CoursePlayerContext';

const LazyPlayer = lazy(() => import("./components/player/Player"));

function CoursePlayerContent() {
  const {
    currentVideo,
    popups,
    togglePdfViewer,
    toggleExamPopup,
    toggleAskQuestionPopup,
    toggleLeaderboardPopup
  } = useContext(CoursePlayerContext);

  return (
    <Fragment>
      <Header />
      <Container className='pagebody'>
        <main className='mainview'>
          <Suspense fallback={<Spinner color="secondary">Loading Video...</Spinner>}>
            <LazyPlayer
              videoUrl={currentVideo.url}
              lessonId={currentVideo.id}
            />
          </Suspense>
        </main>
        <main className='materials'>
          <Navbtns />
          <Materials />
        </main>
        <main className='topics'>
          <Topicheader />
          <Topic />
        </main>
        <main className='comments'>
          <Comments />
        </main>
      </Container>

      <PdfViewer
        isOpen={popups.pdfViewer.isOpen}
        onClose={() => togglePdfViewer()}
        pdfUrl={popups.pdfViewer.pdfUrl}
        title={popups.pdfViewer.title}
      />

      <ExamPopup
        isOpen={popups.exam.isOpen}
        onClose={() => toggleExamPopup()}
        examData={popups.exam.examData}
        lessonId={popups.exam.lessonId}
      />

      <AskQuestion
        isOpen={popups.askQuestion.isOpen}
        onClose={() => toggleAskQuestionPopup()}
      />

      <Leaderboard
        isOpen={popups.leaderboard.isOpen}
        onClose={() => toggleLeaderboardPopup()}
      />
    </Fragment>
  );
}

function App() {
  return (
    <CoursePlayerProvider>
      <CoursePlayerContent />
    </CoursePlayerProvider>
  );
}

export default App;
