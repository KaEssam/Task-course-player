import React, { useContext } from 'react';
import { Badge, Table } from 'reactstrap';
import { CoursePlayerContext } from '../../context/CoursePlayerContext';
import Popup from './Popup';

const Leaderboard = ({ isOpen, onClose }) => {
  // Get course progress and course info from context
  const { courseProgress, courseInfo } = useContext(CoursePlayerContext);

  // This would typically come from your API
  const leaderboardData = [
    { id: 1, name: 'John Doe', progress: 98, points: 1250, rank: 1, isCurrentUser: false },
    { id: 2, name: 'Emily Chen', progress: 95, points: 1180, rank: 2, isCurrentUser: false },
    { id: 3, name: 'You', progress: 92, points: 1050, rank: 3, isCurrentUser: true },
    { id: 4, name: 'Michael Brown', progress: 87, points: 950, rank: 4, isCurrentUser: false },
    { id: 5, name: 'Sarah Johnson', progress: 82, points: 860, rank: 5, isCurrentUser: false },
    { id: 6, name: 'David Wilson', progress: 78, points: 780, rank: 6, isCurrentUser: false },
    { id: 7, name: 'Lisa Garcia', progress: 75, points: 740, rank: 7, isCurrentUser: false },
    { id: 8, name: 'Robert Martinez', progress: 70, points: 690, rank: 8, isCurrentUser: false },
    { id: 9, name: 'Jennifer Lee', progress: 65, points: 620, rank: 9, isCurrentUser: false },
    { id: 10, name: 'James Taylor', progress: 60, points: 580, rank: 10, isCurrentUser: false },
  ];

  // Find the current user's progress, rank, and points
  const userProgress = leaderboardData.find(student => student.isCurrentUser)?.progress || courseProgress;
  const userRank = leaderboardData.find(student => student.isCurrentUser)?.rank || 3;
  const userPoints = leaderboardData.find(student => student.isCurrentUser)?.points || 1050;

  // Generate motivational quote based on progress
  const getMotivationalQuote = (progress) => {
    if (progress < 25) {
      return "Every expert was once a beginner. Keep going!";
    } else if (progress < 50) {
      return "You're making great progress! The journey of a thousand miles begins with a single step.";
    } else if (progress < 75) {
      return "You're more than halfway there! Your dedication is paying off.";
    } else if (progress < 95) {
      return "The finish line is in sight! You've come so far, don't stop now.";
    } else {
      return "Outstanding work! Your commitment to excellence shows in your results.";
    }
  };

  const motivationalQuote = getMotivationalQuote(userProgress);

  // Format the title with styled course name
  const formattedTitle = (
    <>
      <span className="course-name">{courseInfo.name}</span> Leaderboard
    </>
  );

  return (
    <Popup isOpen={isOpen} onClose={onClose} title={formattedTitle}>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="user-performance-card">
            <div className="user-rank-section">
              <div className={`big-rank-badge ${userRank <= 3 ? `rank-${userRank}` : ''}`}>
                <span className="rank-number">{userRank}</span>
                <span className="rank-text">RANK</span>
              </div>
            </div>

            <div className="user-stats-section">
              <h3 className="user-stats-title">Your Performance</h3>
              <div className="user-stats-grid">
                <div className="user-stat-card">
                  <div className="stat-value">{userPoints}</div>
                  <div className="stat-label">Points</div>
                </div>

                <div className="user-stat-card">
                  <div className="stat-value">{userProgress}%</div>
                  <div className="stat-label">Progress</div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${userProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational quote section */}
          <div className="motivational-quote-container">
            <blockquote className="motivational-quote">
              <i className="bi bi-quote"></i>
              <p>{motivationalQuote}</p>
            </blockquote>
          </div>
        </div>

        <h4 className="leaderboard-section-title">Top Students</h4>
        <div className="leaderboard-table-container">
          <Table className="leaderboard-table" responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Progress</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((student) => (
                <tr
                  key={student.id}
                  className={student.isCurrentUser ? 'current-user-row' : ''}
                >
                  <td className="rank-cell">
                    {student.rank <= 3 ? (
                      <div className={`rank-badge rank-${student.rank}`}>
                        {student.rank}
                      </div>
                    ) : (
                      student.rank
                    )}
                  </td>
                  <td>
                    {student.name}
                    {student.isCurrentUser && (
                      <Badge color="info" pill className="ms-2">You</Badge>
                    )}
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-mini">
                        <div
                          className="progress-bar-mini-fill"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span>{student.progress}%</span>
                    </div>
                  </td>
                  <td className="points-cell">{student.points}</td>
                  <td>
                    {student.rank === 1 && (
                      <i className="bi bi-trophy-fill text-warning"></i>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Popup>
  );
};

export default Leaderboard;
