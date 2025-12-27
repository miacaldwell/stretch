export default function TimerView({
  activeRoutine,
  activeItems,
  activeStretch,
  activePhoto,
  remaining,
  formatTime,
  mode,
  currentIndex,
  onPause,
  onResume,
  onReset,
  onDone,
  onGoToRoutines,
  onGoToIndex,
  stretches
}) {
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
        <div className="timer">
          <div className="timer__header">
            <h3>{activeRoutine.name}</h3>
            <span className={`badge badge--${mode}`}>{mode}</span>
          </div>
          <div className="timer__body">
            <div className="timer__now">
              <div className="timer__media">
                {activePhoto ? (
                  <img src={activePhoto} alt={activeStretch?.name ?? "Stretch"} />
                ) : (
                  <div className="photo-placeholder" aria-hidden="true" />
                )}
              </div>
              <p className="timer__label">Now</p>
              <h4>{activeStretch?.name ?? "Stretch"}</h4>
            </div>
            <div className="timer__count">{formatTime(remaining)}</div>
          </div>

          <div className="timer__controls">
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
              <button className="ghost" onClick={onReset}>
                Stop
              </button>
            )}
          </div>

          <div className="timer__nav">
            <button
              className="ghost"
              onClick={() => onGoToIndex(currentIndex - 1)}
              disabled={currentIndex === 0 || mode === "completed"}
            >
              Previous
            </button>
            <button
              className="ghost"
              onClick={() => onGoToIndex(currentIndex + 1)}
              disabled={currentIndex >= activeItems.length - 1 || mode === "completed"}
            >
              Next
            </button>
          </div>

          <div className="timer__list">
            {activeItems.map((item, index) => {
              const stretch = stretches.find(
                (entry) => entry.id === item.stretchId
              );
              const duration = item.duration ?? stretch?.duration ?? 0;
              return (
                <div
                  key={`${item.stretchId}-${index}`}
                  className={
                    index === currentIndex
                      ? "timer__row timer__row--active"
                      : "timer__row"
                  }
                >
                  <span>{stretch?.name ?? "Missing stretch"}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
