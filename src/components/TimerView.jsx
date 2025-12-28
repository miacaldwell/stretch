export default function TimerView({
  activeRoutine,
  activeItems,
  activeStretch,
  nextStretch,
  remaining,
  formatTime,
  mode,
  phase,
  breakDuration,
  currentIndex,
  onPause,
  onResume,
  onReset,
  onDone,
  onGoToRoutines,
  onGoToIndex,
  routines,
  stretches,
  onStartRoutine
}) {
  const activeItem = activeItems[currentIndex];
  const activeDuration =
    phase === "break"
      ? breakDuration
      : activeItem?.duration ?? activeStretch?.duration ?? 0;
  const safeDuration = Math.max(activeDuration, 1);
  const rawProgress = (safeDuration - remaining) / safeDuration;
  const progress =
    mode === "completed" ? 1 : Math.min(1, Math.max(0, rawProgress));
  const status =
    mode === "completed"
      ? "completed"
      : mode === "paused"
      ? "paused"
      : phase === "break"
      ? "break"
      : "running";
  const canGoPrev = currentIndex > 0 && mode !== "completed";
  const canGoNext =
    currentIndex < activeItems.length - 1 && mode !== "completed";

  return (
    <section className="panel panel--timer">
      <div className="panel__header">
        <div>
          <h2>Stretch</h2>
          <p>Time to get flexible</p>
        </div>
      </div>

      {!activeRoutine && (
        <div className="empty-block">
          <p>Select a routine to start your flow.</p>
          <button className="btn btn--primary" onClick={onGoToRoutines}>
            Go to Routines
          </button>
        </div>
      )}

      {activeRoutine && (
        <div className="timer timer--focus">
          <div className="timer__meta">
            <h3>{activeRoutine.name}</h3>
            <span className={`badge badge--${status}`}>{status}</span>
          </div>

          <div className="timer__ring" style={{ "--progress": progress }}>
            <div className="timer__ring-inner">
              <p className="timer__label">
                {phase === "break" ? "Break" : "Now"}
              </p>
              <div className="timer__count">{formatTime(remaining)}</div>
              <p className="timer__stretch">
                {phase === "break"
                  ? `Next: ${nextStretch?.name ?? "Stretch"}`
                  : activeStretch?.name ?? "Stretch"}
              </p>
            </div>
          </div>

          <div className="timer__controls timer__controls--primary">
            <button
              className="btn btn--ghost timer__icon"
              onClick={() => onGoToIndex(currentIndex - 1)}
              disabled={!canGoPrev}
              aria-label="Previous stretch"
            >
              Prev
            </button>
            {mode === "running" && (
              <button className="btn btn--secondary" onClick={onPause}>
                Pause
              </button>
            )}
            {mode === "paused" && (
              <button className="btn btn--primary" onClick={onResume}>
                Resume
              </button>
            )}
            {mode === "completed" && (
              <button className="btn btn--primary" onClick={onDone}>
                Done
              </button>
            )}
            {mode !== "completed" && (
              <button className="btn btn--ghost timer__icon" onClick={onReset}>
                X
              </button>
            )}
            <button
              className="btn btn--ghost timer__icon"
              onClick={() => onGoToIndex(currentIndex + 1)}
              disabled={!canGoNext}
              aria-label="Next stretch"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="panel__section">
        <h3>Saved routines</h3>
        <div className="card-grid">
          {routines.length === 0 && <p className="empty">No routines saved yet.</p>}
          {routines.map((routine) => (
            <article key={routine.id} className="card">
              <div className="card__content">
                <h3>{routine.name}</h3>
                <p>{routine.items.length} stretches</p>
                <p>
                  {formatTime(
                    routine.items.reduce((total, item) => {
                      const stretch = stretches.find(
                        (entry) => entry.id === item.stretchId
                      );
                      const duration =
                        item.duration ?? stretch?.duration ?? 0;
                      return total + duration;
                    }, 0)
                  )}
                </p>
              </div>
              <div className="card__actions">
                <button
                  className="btn btn--primary"
                  onClick={() => onStartRoutine(routine.id)}
                >
                  Start
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}
