import { useEffect, useMemo, useRef, useState } from "react";

const formatDateKey = (dateValue = new Date()) => {
  const date =
    typeof dateValue === "string" ? new Date(`${dateValue}T00:00:00`) : dateValue;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDurationLabel = (value) => {
  if (!value && value !== 0) return "";
  const total = Number(value);
  if (Number.isNaN(total) || total <= 0) return "";
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${hours}h ${minutes}m`;
};

export default function LogView({
  activities,
  routines,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity
}) {
  const [viewMode, setViewMode] = useState("timeline");
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateKey(new Date())
  );
  const [manualRoutineId, setManualRoutineId] = useState(
    routines[0]?.id ?? ""
  );
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState("routine");
  const [customName, setCustomName] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [monthOffset, setMonthOffset] = useState(0);
  const pillRefs = useRef({});
  const didInitScrollRef = useRef(false);
  const [scrollTarget, setScrollTarget] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    name: "",
    description: "",
    duration: ""
  });

  useEffect(() => {
    if (!routines.length) {
      setManualRoutineId("");
      return;
    }
    const exists = routines.some((routine) => routine.id === manualRoutineId);
    if (!exists) {
      setManualRoutineId(routines[0].id);
    }
  }, [manualRoutineId, routines]);

  const activitiesByDate = useMemo(
    () =>
      activities.reduce((groups, entry) => {
        if (!groups[entry.date]) {
          groups[entry.date] = [];
        }
        groups[entry.date].push(entry);
        return groups;
      }, {}),
    [activities]
  );

  const todayKey = formatDateKey(new Date());
  const stripDates = useMemo(() => {
    const end = new Date(`${todayKey}T00:00:00`);
    const start = new Date(end);
    start.setDate(end.getDate() - 30);
    return Array.from({ length: 31 }, (_, index) => {
      const next = new Date(start);
      next.setDate(start.getDate() + index);
      return next;
    });
  }, [todayKey]);


  const selectedActivities = useMemo(
    () =>
      (activitiesByDate[selectedDate] ?? []).slice().sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      ),
    [activitiesByDate, selectedDate]
  );

  const activeDaySet = useMemo(
    () => new Set(Object.keys(activitiesByDate)),
    [activitiesByDate]
  );

  useEffect(() => {
    if (didInitScrollRef.current) return;
    const target = pillRefs.current[todayKey];
    if (!target) return;
    target.scrollIntoView({
      behavior: "auto",
      inline: "center",
      block: "nearest"
    });
    didInitScrollRef.current = true;
  }, [todayKey]);

  useEffect(() => {
    if (!scrollTarget) return;
    const target = pillRefs.current[scrollTarget];
    if (!target) return;
    target.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
    setScrollTarget(null);
  }, [scrollTarget]);

  const handleManualAdd = () => {
    if (addType === "routine") {
      if (!manualRoutineId) return;
      const routine = routines.find((entry) => entry.id === manualRoutineId);
      onAddActivity({
        routineId: manualRoutineId,
        routineName: routine?.name ?? "Routine",
        description: customDescription.trim() || null,
        date: selectedDate,
        manual: true
      });
      return;
    }
    const trimmed = customName.trim();
    if (!trimmed) return;
    const parsedDuration = Number(customDuration);
    onAddActivity({
      routineId: null,
      routineName: null,
      customName: trimmed,
      duration: Number.isNaN(parsedDuration) ? null : parsedDuration,
      description: customDescription.trim() || null,
      date: selectedDate,
      manual: true
    });
    setCustomName("");
    setCustomDuration("");
    setCustomDescription("");
  };

  const monthDate = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    return base;
  }, [monthOffset]);

  const calendarDays = useMemo(() => {
    const startDay = monthDate.getDay();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    return cells;
  }, [monthDate]);

  const monthLabel = monthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });

  return (
    <section className="panel panel--log">
      <div className="panel__header">
        <div className="panel__actions">
          {viewMode === "timeline" ? (
            <button className="btn btn--card" onClick={() => setViewMode("calendar")}>
              View calendar
            </button>
          ) : (
            <button className="btn btn--card" onClick={() => setViewMode("timeline")}>
              View timeline
            </button>
          )}
        </div>
      </div>

      <div className="log__dateblock">
        <div className="log__date-actions">
          <button
            className="btn btn--card"
            onClick={() => {
              setSelectedDate(todayKey);
              setScrollTarget(todayKey);
            }}
          >
            Go to today
          </button>
        </div>
        <div className="log__date-strip">
          {stripDates.map((date) => {
            const key = formatDateKey(date);
            const isSelected = key === selectedDate;
            return (
              <button
                key={key}
                type="button"
                className={`log__date-pill${
                  isSelected ? " log__date-pill--active" : ""
                }`}
                onClick={() => setSelectedDate(key)}
                ref={(node) => {
                  if (node) {
                    pillRefs.current[key] = node;
                  }
                }}
              >
                <span className="log__date-pill-month">
                  {date.toLocaleDateString(undefined, { month: "short" })}
                </span>
                <span className="log__date-pill-day">{date.getDate()}</span>
                <span className="log__date-pill-weekday">
                  {date.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="log__spacer" aria-hidden="true" />

      {addOpen && (
        <div className="log__add-panel">
          <div className="log__add-tabs">
            <button
              className={addType === "routine" ? "tab tab--active" : "tab"}
              onClick={() => setAddType("routine")}
            >
              Routine
            </button>
            <button
              className={addType === "custom" ? "tab tab--active" : "tab"}
              onClick={() => setAddType("custom")}
            >
              Custom
            </button>
          </div>
          {addType === "routine" && (
            <div className="log__add-custom">
              <label>
                Routine
                <select
                  value={manualRoutineId}
                  onChange={(event) => setManualRoutineId(event.target.value)}
                  disabled={routines.length === 0}
                >
                  {routines.map((routine) => (
                    <option key={routine.id} value={routine.id}>
                      {routine.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Description
                <textarea
                  value={customDescription}
                  onChange={(event) => setCustomDescription(event.target.value)}
                  placeholder="Notes or focus for this session"
                />
              </label>
            </div>
          )}
          {addType === "custom" && (
            <div className="log__add-custom">
              <label>
                Activity name
                <input
                  type="text"
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Evening stretch"
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={customDuration}
                  onChange={(event) => setCustomDuration(event.target.value)}
                  placeholder="30"
                />
              </label>
              <label>
                Description
                <textarea
                  value={customDescription}
                  onChange={(event) => setCustomDescription(event.target.value)}
                  placeholder="Notes or focus for this session"
                />
              </label>
            </div>
          )}
          <button
            className="btn btn--secondary"
            onClick={() => {
              handleManualAdd();
              setAddOpen(false);
            }}
            disabled={
              addType === "routine"
                ? !manualRoutineId
                : !customName.trim()
            }
          >
            Add to log
          </button>
        </div>
      )}

      {viewMode === "timeline" && (
        <div className="log__details">
          <div className="log__timeline">
            {selectedActivities.length === 0 && (
              <p className="empty">No routines logged for this day.</p>
            )}
            {selectedActivities.map((entry) => (
              <div key={entry.id} className="log__timeline-item">
                <button
                  type="button"
                  className="log__timeline-card"
                  onClick={() =>
                    setExpandedId((prev) => (prev === entry.id ? null : entry.id))
                  }
                >
                  <h4>{entry.customName ?? entry.routineName ?? "Routine"}</h4>
                  {formatDurationLabel(entry.duration) && (
                    <p>{formatDurationLabel(entry.duration)}</p>
                  )}
                </button>
                {expandedId === entry.id && (
                  <div className="log__timeline-details">
                    {editingId === entry.id ? (
                      <div className="log__edit-form">
                        <label>
                          Name
                          <input
                            type="text"
                            value={editDraft.name}
                            onChange={(event) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                name: event.target.value
                              }))
                            }
                          />
                        </label>
                        <label>
                          Duration (minutes)
                          <input
                            type="number"
                            min="1"
                            max="600"
                            value={editDraft.duration}
                            onChange={(event) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                duration: event.target.value
                              }))
                            }
                          />
                        </label>
                        <label>
                          Description
                          <textarea
                            value={editDraft.description}
                            onChange={(event) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                description: event.target.value
                              }))
                            }
                          />
                        </label>
                        <div className="log__edit-actions">
                          <button
                            className="btn btn--secondary"
                            onClick={() => {
                              const parsed = Number(editDraft.duration);
                              onUpdateActivity(entry.id, {
                                customName: editDraft.name.trim() || null,
                                description: editDraft.description.trim() || null,
                                duration: Number.isNaN(parsed) ? null : parsed
                              });
                              setEditingId(null);
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn--ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="log__timeline-meta">
                        {entry.description && <p>{entry.description}</p>}
                        <div className="log__edit-actions">
                          <button
                            className="btn btn--secondary"
                            onClick={() => {
                              setEditingId(entry.id);
                              setEditDraft({
                                name:
                                  entry.customName ??
                                  entry.routineName ??
                                  "Routine",
                                description: entry.description ?? "",
                                duration: entry.duration ?? ""
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn--ghost"
                            onClick={() => onDeleteActivity(entry.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              className="btn btn--card log__timeline-add"
              type="button"
              onClick={() => setAddOpen(true)}
            >
              + Add entry
            </button>
          </div>
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="calendar">
          <div className="calendar__header">
            <button
              className="btn btn--ghost"
              onClick={() => setMonthOffset((prev) => prev - 1)}
            >
              Prev
            </button>
            <h4>{monthLabel}</h4>
            <button
              className="btn btn--ghost"
              onClick={() => setMonthOffset((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
          <div className="calendar__grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="calendar__weekday">
                {day}
              </div>
            ))}
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="calendar__cell" />;
              }
              const key = formatDateKey(date);
              const isActive = activeDaySet.has(key);
              const isSelected = key === selectedDate;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`calendar__day${
                      isActive ? " calendar__day--active" : ""
                    }${isSelected ? " calendar__day--selected" : ""}`}
                    onClick={() => {
                      setSelectedDate(key);
                      setScrollTarget(key);
                    }}
                  >
                    {isActive ? "✓" : date.getDate()}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
}
