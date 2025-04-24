import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import "../../style/player.css";

const Player = memo(({ videoUrl, lessonId, courseCover }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const progressTooltipRef = useRef(null);
  const [playerState, setPlayerState] = useState({
    playing: false,
    fullScreen: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playedSeconds: 0,
    loadedSeconds: 0,
    watchedProgress: 0,
    isWatched: false,
    playbackRate: 1.0,
    showControls: false,
    buffering: false,
    showShortcutsPanel: false,
    showNextButton: false,
    showSpeedOptions: false,
  });

  // Check if URL is YouTube to determine which player to use
  const isYouTube = videoUrl && (
    videoUrl.includes('youtube.com') ||
    videoUrl.includes('youtube.be')
  );

  // Define all callback functions first, before they're used in any useEffect
  const handleSeek = useCallback((seconds) => {
    playerRef.current?.seekTo(seconds);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const volume = parseFloat(e.target.value);
    setPlayerState(prev => ({ ...prev, volume, muted: volume === 0 }));
    localStorage.setItem('player-volume', volume.toString());
  }, []);

  const handleMuteToggle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      muted: !prev.muted
    }));
  }, []);

  const handleFullScreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setPlayerState(prev => ({ ...prev, fullScreen: true }));
    } else {
      document.exitFullscreen();
      setPlayerState(prev => ({ ...prev, fullScreen: false }));
    }
  }, []);

  const handleForward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerState.playedSeconds;
      const newTime = Math.min(currentTime + 10, playerState.duration);
      handleSeek(newTime);
    }
  }, [playerState.duration, playerState.playedSeconds, handleSeek]);

  const handleRewind = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerState.playedSeconds;
      const newTime = Math.max(currentTime - 10, 0);
      handleSeek(newTime);
    }
  }, [playerState.playedSeconds, handleSeek]);

  const handlePlay = useCallback(() => {
    setPlayerState(prev => ({ ...prev, playing: true }));
  }, []);

  const handlePause = useCallback(() => {
    setPlayerState(prev => ({ ...prev, playing: false }));
  }, []);

  const handlePlayPause = useCallback(() => {
    setPlayerState(prev => ({ ...prev, playing: !prev.playing }));
  }, []);

  const handleDuration = useCallback((duration) => {
    setPlayerState(prev => ({ ...prev, duration }));
  }, []);

  // Load progress from localStorage on component mount - using useCallback to optimize
  const loadProgress = useCallback(() => {
    if (typeof lessonId !== 'undefined') {
      const savedProgress = localStorage.getItem(`course-progress-${lessonId}`);
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          // Load saved playback rate preference
          const savedRate = localStorage.getItem('playback-rate-preference');
          const playbackRate = savedRate ? parseFloat(savedRate) : (progress.playbackRate || 1.0);

          // Load saved volume preference
          const savedVolume = localStorage.getItem('player-volume');
          const volume = savedVolume ? parseFloat(savedVolume) : (progress.volume || 0.8);
          const muted = volume === 0;

          setPlayerState(prev => ({
            ...prev,
            played: progress.played || 0,
            playedSeconds: progress.playedSeconds || 0,
            isWatched: progress.isWatched || false,
            watchedProgress: progress.watchedProgress || 0,
            playbackRate,
            volume,
            muted
          }));
        } catch (e) {
          console.error("Error loading saved progress:", e);
        }
      }
    }
  }, [lessonId]);

  // Track progress and save to localStorage - using useCallback to optimize
  const handleProgress = useCallback((state) => {
    // Don't update if not playing to avoid unnecessary updates
    if (!playerState.playing) return;

    // Calculate if video is considered watched (80% completion)
    const watchedThreshold = 0.8;
    const isWatched = state.played >= watchedThreshold;

    // Show next button when near the end of the video (95%)
    const showNextButton = state.played >= 0.95;

    // Update watched status in global context if newly watched
    if (isWatched && !playerState.isWatched) {
      // Dispatch a custom event to notify the app that a video has been watched
      window.dispatchEvent(new CustomEvent('videoWatched', {
        detail: { lessonId: lessonId || '', isWatched: true }
      }));
    }

    setPlayerState(prev => ({
      ...prev,
      played: state.played,
      loaded: state.loaded,
      playedSeconds: state.playedSeconds,
      loadedSeconds: state.loadedSeconds,
      watchedProgress: Math.floor(state.played * 100),
      isWatched,
      showNextButton
    }));

    // Save progress to localStorage
    if (typeof lessonId !== 'undefined') {
      localStorage.setItem(`course-progress-${lessonId}`, JSON.stringify({
        played: state.played,
        playedSeconds: state.playedSeconds,
        isWatched,
        watchedProgress: Math.floor(state.played * 100),
        playbackRate: playerState.playbackRate,
        volume: playerState.volume,
        timestamp: Date.now()
      }));
    }
  }, [playerState.isWatched, playerState.playing, playerState.playbackRate, playerState.volume, lessonId]);

  // Handle mouse enter/leave to show/hide controls
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPlayerState(prev => ({ ...prev, showControls: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (playerState.playing) {
        setPlayerState(prev => ({
          ...prev,
          showControls: false,
          showSpeedOptions: false
        }));
      }
    }, 2000);
  }, [playerState.playing]);

  const toggleSpeedOptions = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      showSpeedOptions: !prev.showSpeedOptions
    }));
  }, []);

  const handlePlaybackRateChange = useCallback((rate) => {
    setPlayerState(prev => ({
      ...prev,
      playbackRate: rate,
      showSpeedOptions: false
    }));
    // Save playback rate setting to localStorage
    localStorage.setItem('playback-rate-preference', rate.toString());
  }, []);

  // Handle seeking on progress bar click
  const handleProgressBarClick = useCallback((e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;

    handleSeek(percent * playerState.duration);
  }, [playerState.duration, handleSeek]);

  // Handle progress bar hover to show the time tooltip
  const handleProgressBarHover = useCallback((e) => {
    if (!progressTooltipRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;

    // Calculate time at this position
    const timeAtPosition = percent * playerState.duration;

    // Update tooltip text and position
    progressTooltipRef.current.textContent = formatTime(timeAtPosition);
    progressTooltipRef.current.style.left = `${offsetX}px`;
    progressTooltipRef.current.style.opacity = '1';
  }, [playerState.duration]);

  const handleProgressBarLeave = useCallback(() => {
    if (!progressTooltipRef.current) return;
    progressTooltipRef.current.style.opacity = '0';
  }, []);

  // Load the next lecture
  const handleNextLecture = useCallback(() => {
    // Implement logic to load the next lecture
    console.log("Load next lecture");
    // This would typically involve finding the next item in the course and loading it
  }, []);

  const toggleShortcutsPanel = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      showShortcutsPanel: !prev.showShortcutsPanel
    }));
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Keyboard shortcuts for player
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current || !containerRef.current.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          handleFullScreenToggle();
          break;
        case 'm':
          e.preventDefault();
          handleMuteToggle();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleRewind();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const newVolume = Math.min(1, playerState.volume + 0.05);
          handleVolumeChange({ target: { value: newVolume } });
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newVol = Math.max(0, playerState.volume - 0.05);
          handleVolumeChange({ target: { value: newVol } });
          break;
        case '?':
          e.preventDefault();
          setPlayerState(prev => ({ ...prev, showShortcutsPanel: !prev.showShortcutsPanel }));
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (e.key === '0') {
            e.preventDefault();
            handleSeek(0);
          } else {
            e.preventDefault();
            handleSeek(playerState.duration * (parseInt(e.key) / 10));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    playerState.playing,
    playerState.duration,
    playerState.volume,
    handleForward,
    handleFullScreenToggle,
    handleMuteToggle,
    handlePlayPause,
    handleRewind,
    handleSeek,
    handleVolumeChange
  ]);

  // Listen for fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setPlayerState(prev => ({ ...prev, fullScreen: false }));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`udemy-player-container ${playerState.fullScreen ? 'fullscreen' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex="0"
    >
      <div className="player-aspect-ratio-container">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={playerState.playing}
          volume={playerState.volume}
          muted={playerState.muted}
          playbackRate={playerState.playbackRate}
          onProgress={handleProgress}
          onPlay={handlePlay}
          onPause={handlePause}
          onDuration={handleDuration}
          onBuffer={() => setPlayerState(prev => ({ ...prev, buffering: true }))}
          onBufferEnd={() => setPlayerState(prev => ({ ...prev, buffering: false }))}
          config={isYouTube ? {
            youtube: {
              playerVars: {
                modestBranding: 1,
                rel: 0,
                showinfo: 0,
                start: Math.floor(playerState.playedSeconds),
                playsinline: 1
              }
            }
          } : {
            file: {
              attributes: {
                poster: courseCover,
                preload: "auto",
                controlsList: "noDownload"
              },
              forceVideo: true,
              forceAudio: false
            }
          }}
          className="react-player"
        />

        {/* Video player controls overlay */}
        {/* Udemy-style controls overlay */}
        {!isYouTube && (
          <div className={`udemy-controls-overlay ${playerState.showControls || !playerState.playing ? 'visible' : ''}`}>
            {/* Video title and chapter info */}
            <div className="video-info-bar">
              <div className="video-title">Current Lesson: {lessonId || 'Introduction'}</div>
              <div className="video-chapter">Chapter: Introduction to the Course</div>
            </div>

            {/* Progress bar */}
            <div
              className="progress-container"
              onClick={handleProgressBarClick}
              onMouseMove={handleProgressBarHover}
              onMouseLeave={handleProgressBarLeave}
            >
              <div className="progress-bar">
                <div className="progress-loaded" style={{ width: `${playerState.loaded * 100}%` }}></div>
                <div className="progress-played" style={{ width: `${playerState.played * 100}%` }}></div>
              </div>
              <div
                className="progress-handle"
                style={{ left: `${playerState.played * 100}%` }}
              ></div>
              <div
                ref={progressTooltipRef}
                className="progress-tooltip"
              ></div>
            </div>

            {/* Control bar */}
            <div className="control-bar">
              <div className="left-controls">
                <button
                  className="control-button play-button"
                  onClick={handlePlayPause}
                >
                  <i className={`bi ${playerState.playing ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                  <span className="tooltip">{playerState.playing ? 'Pause' : 'Play'}</span>
                </button>

                <div className="forward-backward-container">
                  <button
                    className="forward-backward-button"
                    onClick={handleRewind}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <span className="forward-backward-label">10</span>
                    <span className="tooltip">Rewind 10 seconds</span>
                  </button>

                  <button
                    className="forward-backward-button"
                    onClick={handleForward}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                    <span className="forward-backward-label">10</span>
                    <span className="tooltip">Forward 10 seconds</span>
                  </button>
                </div>

                <div className="volume-container">
                  <button
                    className="control-button"
                    onClick={handleMuteToggle}
                  >
                    <i className={`bi ${playerState.muted || playerState.volume === 0
                      ? 'bi-volume-mute-fill'
                      : playerState.volume < 0.5
                        ? 'bi-volume-down-fill'
                        : 'bi-volume-up-fill'}`}
                    ></i>
                    <span className="tooltip">Mute</span>
                  </button>
                  <div className="volume-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={playerState.muted ? 0 : playerState.volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>
                </div>

                <div className="time-display">
                  <span>{formatTime(playerState.playedSeconds)}</span>
                  <span className="time-separator">/</span>
                  <span>{formatTime(playerState.duration)}</span>
                </div>
              </div>

              <div className="center-controls">
                {/* Center area can be used for captions or chapter markers */}
              </div>

              <div className="right-controls">
                {/* Speed control with direct click menu */}
                <div className="speed-control">
                  <button
                    className="speed-control-button"
                    onClick={toggleSpeedOptions}
                  >
                    <span>{playerState.playbackRate}x</span>
                    <i className="bi bi-chevron-down ms-1"></i>
                  </button>

                  {playerState.showSpeedOptions && (
                    <div className="speed-options-dropdown">
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                        <button
                          key={rate}
                          className={`speed-option ${playerState.playbackRate === rate ? 'active' : ''}`}
                          onClick={() => handlePlaybackRateChange(rate)}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="subtitle-settings-container">
                  <button className="control-button settings-button" onClick={toggleShortcutsPanel}>
                    <i className="bi bi-gear"></i>
                    <span className="tooltip">Settings</span>
                  </button>
                </div>

                <button
                  className="control-button"
                  onClick={handleFullScreenToggle}
                >
                  <i className={`bi ${playerState.fullScreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                  <span className="tooltip">{playerState.fullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed indicator */}
        {playerState.isWatched && (
          <div className="completed-indicator">
            <i className="bi bi-check-circle-fill"></i>
            <span>Completed</span>
          </div>
        )}

        {/* Next lecture button */}
        {playerState.showNextButton && (
          <button
            className={`next-lecture-button ${playerState.showNextButton ? 'visible' : ''}`}
            onClick={handleNextLecture}
          >
            <span>Next Lecture</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        )}

        {/* Play button overlay */}
        {!playerState.playing && !isYouTube && (
          <div
            className="play-overlay"
            onClick={handlePlayPause}
          >
            <div className="big-play-button">
              <i className="bi bi-play-fill"></i>
            </div>
          </div>
        )}

        {/* Keyboard shortcuts help panel */}
        <div className={`keyboard-shortcuts-panel ${playerState.showShortcutsPanel ? 'visible' : ''}`}>
          <h3>Keyboard Shortcuts</h3>

          <button
            className="close-shortcuts-button"
            onClick={toggleShortcutsPanel}
          >
            <i className="bi bi-x"></i>
          </button>

          <div className="shortcut-group">
            <div className="shortcut-group-title">Playback</div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">space</span>
                <span className="key">k</span>
              </div>
              <div className="shortcut-description">Play/Pause</div>
            </div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">←</span>
              </div>
              <div className="shortcut-description">Rewind 10 seconds</div>
            </div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">→</span>
              </div>
              <div className="shortcut-description">Forward 10 seconds</div>
            </div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">0</span>-<span className="key">9</span>
              </div>
              <div className="shortcut-description">Jump to 0-90% of video</div>
            </div>
          </div>

          <div className="shortcut-group">
            <div className="shortcut-group-title">Volume</div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">m</span>
              </div>
              <div className="shortcut-description">Mute/Unmute</div>
            </div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">↑</span>
              </div>
              <div className="shortcut-description">Increase volume</div>
            </div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">↓</span>
              </div>
              <div className="shortcut-description">Decrease volume</div>
            </div>
          </div>

          <div className="shortcut-group">
            <div className="shortcut-group-title">Other</div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">f</span>
              </div>
              <div className="shortcut-description">Fullscreen</div>
            </div>

            <div className="shortcut-row">
              <div className="shortcut-keys">
                <span className="key">?</span>
              </div>
              <div className="shortcut-description">Show/Hide keyboard shortcuts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Helper function to format time in MM:SS format
function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default Player;
