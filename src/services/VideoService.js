/**
 * VideoService - Service for managing video-related operations
 */
export const VideoService = {
  /**
   * Save video progress to localStorage
   * @param {string} lessonId - The lesson ID
   * @param {Object} progress - Progress data to save
   */
  saveProgress: (lessonId, progress) => {
    if (!lessonId) return;
    localStorage.setItem(`course-progress-${lessonId}`, JSON.stringify({
      ...progress,
      timestamp: Date.now()
    }));
  },

  /**
   * Load video progress from localStorage
   * @param {string} lessonId - The lesson ID
   * @returns {Object|null} The progress data or null
   */
  loadProgress: (lessonId) => {
    if (!lessonId) return null;

    try {
      const savedProgress = localStorage.getItem(`course-progress-${lessonId}`);
      if (savedProgress) {
        return JSON.parse(savedProgress);
      }
    } catch (e) {
      console.error("Error loading saved progress:", e);
    }

    return null;
  },

  /**
   * Get playback rate preference
   * @returns {number} The playback rate
   */
  getPlaybackRate: () => {
    const savedRate = localStorage.getItem('playback-rate-preference');
    return savedRate ? parseFloat(savedRate) : 1.0;
  },

  /**
   * Save playback rate preference
   * @param {number} rate - The playback rate to save
   */
  savePlaybackRate: (rate) => {
    localStorage.setItem('playback-rate-preference', rate.toString());
  },

  /**
   * Get volume preference
   * @returns {number} The volume level
   */
  getVolume: () => {
    const savedVolume = localStorage.getItem('player-volume');
    return savedVolume ? parseFloat(savedVolume) : 0.8;
  },

  /**
   * Save volume preference
   * @param {number} volume - The volume level to save
   */
  saveVolume: (volume) => {
    localStorage.setItem('player-volume', volume.toString());
  },

  /**
   * Check if a video is considered watched
   * @param {number} progress - Current progress (0-1)
   * @returns {boolean} Whether the video is considered watched
   */
  isWatched: (progress) => {
    const watchedThreshold = 0.8; // 80%
    return progress >= watchedThreshold;
  }
};

export default VideoService;
