import { useState, useEffect, useRef } from 'react'

export default function RestTimerModal({ duration = 90, onClose }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [totalTime, setTotalTime] = useState(duration);
  const intervalRef = useRef(null);
  const circumference = 2 * Math.PI * 52; // r=52

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          // Vibrate on mobile if supported
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          setTimeout(onClose, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const adjustTime = (delta) => {
    setTimeLeft(prev => {
      const newTime = Math.max(0, prev + delta);
      setTotalTime(t => Math.max(t, newTime));
      return newTime;
    });
  };

  const progress = 1 - (timeLeft / totalTime);
  const dashOffset = circumference * (1 - progress);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="rest-timer-modal" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal rest-timer-modal">
        <div className="timer-ring-container">
          <svg className="timer-ring" viewBox="0 0 120 120">
            <circle className="timer-ring-bg" cx="60" cy="60" r="52" />
            <circle
              className="timer-ring-progress"
              cx="60" cy="60" r="52"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: dashOffset,
              }}
            />
          </svg>
          <div className="timer-display">
            <span className="timer-value">{formatTime(timeLeft)}</span>
            <span className="timer-label">REST</span>
          </div>
        </div>
        <div className="timer-controls">
          <button className="timer-btn" onClick={() => adjustTime(-15)}>−15s</button>
          <button className="btn btn-primary" onClick={onClose}>Skip</button>
          <button className="timer-btn" onClick={() => adjustTime(15)}>+15s</button>
        </div>
      </div>
    </div>
  )
}
