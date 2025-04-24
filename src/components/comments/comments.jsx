import React, { useContext, useState } from 'react';
import { Button, Input } from 'reactstrap';
import { CoursePlayerContext } from '../../context/CoursePlayerContext';

import user1Image from '../../photo/commentsender/user1-image.webp';
import user2Image from '../../photo/commentsender/user2-image.webp';
import user3Image from '../../photo/commentsender/user3-image.webp';

const commentsData = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      image: user1Image
    },
    comment: 'This course is incredibly detailed and well-structured. I appreciate how the instructor breaks down complex concepts into manageable parts.',
    date: '2 days ago'
  },
  {
    id: 2,
    user: {
      name: 'Emily Chen',
      image: user2Image
    },
    comment: 'I was struggling with character development in my stories, but the techniques presented in week 2 have been a game-changer for me. Now my characters feel much more three-dimensional.',
    date: '1 week ago'
  },
  {
    id: 3,
    user: {
      name: 'Michael Rodriguez',
      image: user3Image
    },
    comment: 'The section on plot structures was eye-opening. I never thought about storytelling this way before. Highly recommend paying close attention to the lectures in weeks 3-4.',
    date: '2 weeks ago'
  }
];

export default function Comments() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(commentsData);
  const { sectionsRef } = useContext(CoursePlayerContext);
  const currentUserImage = user2Image;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: 'You',
        image: currentUserImage
      },
      comment: comment,
      date: 'Just now'
    };

    setComments([newComment, ...comments]);
    setComment('');
  };

  return (
    <div ref={sectionsRef.comments}>
      <h2 className="commentsheader">Comments</h2>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="commentitem d-flex">
            <div
              className="commentsenderphoto me-4"
              style={{ backgroundImage: `url(${comment.user.image})` }}
            ></div>
            <div className="comment-content">
              <div className="d-flex align-items-center mb-2">
                <h5 className="mb-0 me-3">{comment.user.name}</h5>
                <small className="text-muted">{comment.date}</small>
              </div>
              <p className="mb-0">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="commentsform">
        <Input
          type="textarea"
          className="commentsforminput"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleCommentChange}
        />
        <div className="d-flex justify-content-end mt-3">
          <Button
            color="success"
            className="commentsformsubmit"
            onClick={handleSubmit}
            disabled={!comment.trim()}
          >
            Submit Review <i className="bi bi-arrow-right ms-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
