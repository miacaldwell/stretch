import { useEffect, useRef, useState } from "react";

export default function RoutinesView({
  stretches,
  routines,
  draftName,
  setDraftName,
  draftItems,
  selectedStretchId,
  setSelectedStretchId,
  onAddDraftItem,
  onRemoveDraftItem,
  onDraftDurationChange,
  onReorderDraftItems,
  onSaveRoutine,
  onEditRoutine,
  onCancelEdit,
  isEditing,
  editScrollToken,
  onStartRoutine,
  onDeleteRoutine,
  formatTime
}) {
  const sectionRef = useRef(null);
  const [moveIndex, setMoveIndex] = useState(null);
  const longPressRef = useRef(null);

  useEffect(() => {
    if (!editScrollToken) return;
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editScrollToken]);

  useEffect(() => {
    return () => {
      if (longPressRef.current) {
        window.clearTimeout(longPressRef.current);
      }
    };
  }, []);

  const handleStartMove = (index) => {
    setMoveIndex((prev) => (prev === index ? null : index));
  };

  const handleMoveTo = (targetIndex) => {
    if (moveIndex === null) return;
    if (targetIndex < 0 || targetIndex >= draftItems.length) return;
    onReorderDraftItems(moveIndex, targetIndex);
    setMoveIndex(targetIndex);
  };

  const isInteractiveTarget = (event) =>
    event.target.closest("button, input, select, textarea, a");

  const handlePointerDown = (index) => (event) => {
    if (isInteractiveTarget(event)) return;
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    if (longPressRef.current) {
      window.clearTimeout(longPressRef.current);
    }
    longPressRef.current = window.setTimeout(() => {
      handleStartMove(index);
    }, 450);
  };

  const handlePointerUp = () => {
    if (longPressRef.current) {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handleDoubleClick = (index) => (event) => {
    if (isInteractiveTarget(event)) return;
    handleStartMove(index);
  };
  return (
    <section className="panel" ref={sectionRef}>
      <div className="panel__header">
        <div>
          <h2>Routine Builder</h2>
          <p>Create your own routine.</p>
        </div>
      </div>

      <form className="panel__form" onSubmit={onSaveRoutine}>
        <label>
          Routine name
          <input
            type="text"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            placeholder="dumb stretch"
            required
          />
        </label>
        <div className="builder">
          <div className="builder__controls">
            <label>
              Add stretch
              <select
                value={selectedStretchId}
                onChange={(event) => setSelectedStretchId(event.target.value)}
              >
                {stretches.map((stretch) => (
                  <option key={stretch.id} value={stretch.id}>
                    {stretch.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onAddDraftItem}
            >
              Add to Routine
            </button>
          </div>
          <div className="builder__list">
            {draftItems.length === 0 && (
              <p className="empty">No stretches added yet.</p>
            )}
            {draftItems.length > 0 && (
              <div className="builder__header">
                <span>Stretch</span>
                <span>Seconds</span>
                <span aria-hidden="true" />
              </div>
            )}
            {draftItems.map((item, index) => {
              const stretch = stretches.find(
                (entry) => entry.id === item.stretchId
              );
              const isSelected = moveIndex === index;
              const canMoveUp = isSelected && index > 0;
              const canMoveDown = isSelected && index < draftItems.length - 1;
              return (
                <div key={`${item.stretchId}-${index}`} className="builder__row">
                  {isSelected && canMoveUp && (
                    <button
                      type="button"
                      className="builder__move-arrow"
                      onClick={() => handleMoveTo(index - 1)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                  )}
                  <div
                    className={`builder__item${isSelected ? " builder__item--selected" : ""}`}
                    onPointerDown={handlePointerDown(index)}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onDoubleClick={handleDoubleClick(index)}
                  >
                    <span className="builder__name">
                      {stretch?.name ?? "Missing stretch"}
                    </span>
                    <label className="inline-label">
                      <input
                        className="input--secondary"
                        type="number"
                        min="10"
                        max="600"
                        value={item.duration ?? stretch?.duration ?? 0}
                        onChange={(event) =>
                          onDraftDurationChange(index, event.target.value)
                        }
                      />
                    </label>
                    <div className="builder__actions-inline">
                      {isSelected && (
                        <button
                          type="button"
                          className="btn btn--light builder__select"
                          onClick={() => handleStartMove(index)}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn--ghost builder__remove"
                        onClick={() => onRemoveDraftItem(index)}
                        aria-label="Remove stretch"
                      >
                        X
                      </button>
                    </div>
                  </div>
                  {isSelected && canMoveDown && (
                    <button
                      type="button"
                      className="builder__move-arrow"
                      onClick={() => handleMoveTo(index + 1)}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="builder__actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!draftName || draftItems.length === 0}
          >
            {isEditing ? "Update Routine" : "Save Routine"}
          </button>
          {isEditing && (
            <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="panel__section">
        <h3>Saved routines</h3>
        <div className="card-grid">
          {routines.length === 0 && <p className="empty">No routines saved yet.</p>}
          {routines.map((routine) => (
            <article key={routine.id} className="card card--tall">
              <div>
                <h3>{routine.name}</h3>
                <ul className="list">
                  {routine.items.map((item, index) => {
                    const stretch = stretches.find(
                      (entry) => entry.id === item.stretchId
                    );
                    return (
                      <li key={`${item.stretchId}-${index}`}>
                        {stretch?.name ?? "Missing stretch"} - {formatTime(
                          item.duration ?? stretch?.duration ?? 0
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {routine.link && (
                <div className="card__link">
                  <a
                    href={routine.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more
                  </a>
                </div>
              )}
              <div className="card__actions">
                <button
                  className="btn btn--primary"
                  onClick={() => onStartRoutine(routine.id)}
                >
                  Start
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={() => onEditRoutine(routine.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => onDeleteRoutine(routine.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
