export default function TimerView({
  activeRoutine,
  activeItems,
  activeStretch,
  remaining,
  formatTime,
  mode,
  currentIndex,
  onPause,
  onResume,
  onReset,
  onDone,
  onGoToRoutines,
  onGoToIndex
}) {
  const activeItem = activeItems[currentIndex];
  const activeDuration = activeItem?.duration ?? activeStretch?.duration ?? 0;
  const safeDuration = Math.max(activeDuration, 1);
  const rawProgress = (safeDuration - remaining) / safeDuration;
  const progress =
    mode === "completed" ? 1 : Math.min(1, Math.max(0, rawProgress));
  const canGoPrev = currentIndex > 0 && mode !== "completed";
  const canGoNext =
    currentIndex < activeItems.length - 1 && mode !== "completed";

  return (
    <section className="panel panel--timer">
      <div className="panel__header">
        <div>
          <h2>Timer</h2>
          <p>Stay present with every breath.</p>
        </div>
      </div>

      {!activeRoutine && (
        <div className="empty-block">
          <p>Select a routine to start your flow.</p>
          <button className="primary" onClick={onGoToRoutines}>
            Go to Routines
          </button>
        </div>
      )}

      {activeRoutine && (
        <div className="timer timer--focus">
          <div className="timer__meta">
            <h3>{activeRoutine.name}</h3>
            <span className={`badge badge--${mode}`}>{mode}</span>
          </div>

          <div className="timer__ring" style={{ "--progress": progress }}>
            <div className="timer__ring-inner">
              <p className="timer__label">Now</p>
              <div className="timer__count">{formatTime(remaining)}</div>
              <p className="timer__stretch">{activeStretch?.name ?? "Stretch"}</p>
            </div>
          </div>

          <div className="timer__controls timer__controls--primary">
            <button
              className="ghost timer__icon"
              onClick={() => onGoToIndex(currentIndex - 1)}
              disabled={!canGoPrev}
              aria-label="Previous stretch"
            >
              Prev
            </button>
            {mode === "running" && (
              <button className="secondary" onClick={onPause}>
                Pause
              </button>
            )}
            {mode === "paused" && (
              <button className="primary" onClick={onResume}>
                Resume
              </button>
            )}
            {mode === "completed" && (
              <button className="primary" onClick={onDone}>
                Done
              </button>
            )}
            {mode !== "completed" && (
              <button className="ghost timer__icon" onClick={onReset}>
                X
              </button>
            )}
            <button
              className="ghost timer__icon"
              onClick={() => onGoToIndex(currentIndex + 1)}
              disabled={!canGoNext}
              aria-label="Next stretch"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
