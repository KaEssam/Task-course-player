import React, { useContext } from 'react';
import { Badge, Col, ListGroup, ListGroupItem, Row } from "reactstrap";
import { CoursePlayerContext } from '../../context/CoursePlayerContext';

export function Materials() {
  const { currentVideo, courseProgress, togglePdfViewer } = useContext(CoursePlayerContext);

  const totalDuration = 3; // 3 weeks
  const remainingDuration = Math.round((100 - courseProgress) / 100 * totalDuration * 10) / 10;



  return (
    <section className='coursematerials'>
      <h2 className='coursematerialsheader'>
        Course Materials
        {currentVideo && currentVideo.title && (
          <Badge
            color="light"
            className="ms-3 py-2 px-3"
            style={{ fontSize: '14px', fontWeight: 'normal' }}
          >
            <i className="bi bi-play-circle me-2"></i>
            {currentVideo.title}
          </Badge>
        )}
      </h2>
      <Row className='coursematerialsbody text-secondary'>
        <Col xl={{ offset: 0, size: 5 }} className='lgdivider'>
          <ListGroup flush>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-clock"></i> &nbsp; Duration : </span>
              <span>3 weeks</span>
              <div className="hover-title">Course duration in weeks</div>
            </ListGroupItem>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-journal-text"></i> &nbsp; Lessons : </span>
              <span>36</span>
              <div className="hover-title">Total number of lessons in this course</div>
            </ListGroupItem>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-person-plus"></i> &nbsp; Enrolled : </span>
              <span>65 students</span>
              <div className="hover-title">Number of students enrolled in this course</div>
            </ListGroupItem>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-translate"></i> &nbsp; Language : </span>
              <span>English</span>
              <div className="hover-title">Course's primary language</div>
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col xl={{ offset: 2, size: 5 }}>
          <ListGroup flush>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-bar-chart"></i> &nbsp; Your Progress : </span>
              <span className="d-flex align-items-center">
                <span className="me-2">{courseProgress}%</span>
                <div className="progress-bar-mini" style={{ width: '80px' }}>
                  <div
                    className="progress-bar-mini-fill"
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
              </span>
              <div className="hover-title">Your current progress in this course</div>
            </ListGroupItem>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-hourglass-split"></i> &nbsp; Est. Remaining : </span>
              <span>{remainingDuration > 0 ? `${remainingDuration} weeks` : 'Complete'}</span>
              <div className="hover-title">Estimated time to complete the course</div>
            </ListGroupItem>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-person"></i> &nbsp; Instructor : </span>
              <span>Karim Essam</span>
              <div className="hover-title">Course instructor information</div>
            </ListGroupItem>
            <ListGroupItem className='coursematerialsitem course-material-hover' tag="div">
              <span><i className="bi bi-card-text"></i> &nbsp; Certificate : </span>
              <span>
                {courseProgress >= 100 ? (
                  <Badge color="success" pill>Available</Badge>
                ) : (
                  'Finish the course'
                )}
              </span>
              <div className="hover-title">Course certification status</div>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </section>
  );
}
