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
  onSaveRoutine,
  onEditRoutine,
  onCancelEdit,
  isEditing,
  onStartRoutine,
  onDeleteRoutine,
  formatTime
}) {
  return (
    <section className="panel">
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
            {draftItems.map((item, index) => {
              const stretch = stretches.find(
                (entry) => entry.id === item.stretchId
              );
              return (
                <div key={`${item.stretchId}-${index}`} className="builder__item">
              <span>
                    {stretch?.name ?? "Missing stretch"} - {formatTime(
                      item.duration ?? stretch?.duration ?? 0
                    )}
              </span>
                  <label className="inline-label">
                    Seconds
                    <input
                      type="number"
                      min="10"
                      max="600"
                      value={item.duration ?? stretch?.duration ?? 0}
                      onChange={(event) =>
                        onDraftDurationChange(index, event.target.value)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onRemoveDraftItem(index)}
                  >
                    Remove
                  </button>
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
