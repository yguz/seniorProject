import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './CommentModal.css';

const CommentModal = ({ isOpen, onClose, recipeId, recipeTitle }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (isOpen && recipeId) {
      fetchComments();
    }
  }, [isOpen, recipeId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching comments for recipe:', recipeId);
      const response = await axios.get(`http://localhost:3000/api/comments/${recipeId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error.response?.data?.error || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.delete(`http://localhost:3000/api/comments/${commentId}`);
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      setSuccess('Comment deleted successfully');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError(error.response?.data?.error || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId) {
      setError('Please log in to post comments');
      return;
    }
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Posting comment:', {
        userId: user.userId,
        recipeId: recipeId,
        content: newComment.trim()
      });

      const response = await axios.post('http://localhost:3000/api/comments', {
        userId: parseInt(user.userId),
        recipeId: parseInt(recipeId),
        content: newComment.trim()
      });

      setNewComment('');
      setComments(prevComments => [response.data, ...prevComments]);
      setSuccess('Comment posted successfully');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error posting comment:', error);
      setError(error.response?.data?.error || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Stop propagation of click events inside modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className="modal-header">
          <h2>Comments for {recipeTitle}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="comments-section">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          {loading && <div className="loading">Loading...</div>}
          {!loading && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.user?.username || 'Anonymous'}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
                {user && comment.user?.id === user.userId && (
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    className="delete-comment-btn"
                    disabled={loading}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : !loading && (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            rows="3"
            disabled={loading || !user}
          />
          <button type="submit" disabled={loading || !user}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
