import { useEffect, useMemo, useState } from "react";
import RoutinesView from "./components/RoutinesView.jsx";
import StretchesView from "./components/StretchesView.jsx";
import TimerView from "./components/TimerView.jsx";

const STORAGE_ROUTINES = "stretch.routines";

const defaultStretches = [
  {
    id: "neck-release",
    name: "Neck Release",
    duration: 30,
    photo: ""
  },
  {
    id: "shoulder-open",
    name: "Shoulder Opener",
    duration: 45,
    photo: ""
  },
  {
    id: "hip-flexor",
    name: "Hip Flexor Lunge",
    duration: 50,
    photo: ""
  },
  {
    id: "hamstring",
    name: "Hamstring Fold",
    duration: 45,
    photo: ""
  },
  {
    id: "figure-four",
    name: "Figure Four",
    duration: 40,
    photo: ""
  },
  {
    id: "spinal",
    name: "Supine Twist",
    duration: 50,
    photo: ""
  }
];

const loadJSON = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

const formatTime = (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const makeId = () => `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export default function App() {
  const [view, setView] = useState("stretches");
  const stretches = defaultStretches;
  const [routines, setRoutines] = useState(() =>
    loadJSON(STORAGE_ROUTINES, [])
  );
  const [draftName, setDraftName] = useState("");
  const [draftItems, setDraftItems] = useState([]);
  const [selectedStretchId, setSelectedStretchId] = useState(
    defaultStretches[0]?.id ?? ""
  );
  const [activeRoutineId, setActiveRoutineId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [mode, setMode] = useState("idle");

  const activeRoutine = useMemo(
    () => routines.find((routine) => routine.id === activeRoutineId) ?? null,
    [routines, activeRoutineId]
  );

  const activeItems = activeRoutine?.items ?? [];

  useEffect(() => {
    saveJSON(STORAGE_ROUTINES, routines);
  }, [routines]);

  useEffect(() => {
    if (!selectedStretchId && stretches[0]) {
      setSelectedStretchId(stretches[0].id);
    }
  }, [stretches, selectedStretchId]);

  useEffect(() => {
    if (mode !== "running") return;
    if (!activeRoutine || activeItems.length === 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          const nextIndex = currentIndex + 1;
          if (nextIndex >= activeItems.length) {
            setMode("completed");
            return 0;
          }
          const nextItem = activeItems[nextIndex];
          const nextStretch = stretches.find(
            (stretch) => stretch.id === nextItem?.stretchId
          );
          const nextDuration =
            nextItem?.duration ?? nextStretch?.duration ?? 0;
          setCurrentIndex(nextIndex);
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, activeRoutine, activeItems, currentIndex, stretches]);

  const handleAddDraftItem = () => {
    if (!selectedStretchId) return;
    const stretch = stretches.find((entry) => entry.id === selectedStretchId);
    setDraftItems((prev) => [
      ...prev,
      {
        stretchId: selectedStretchId,
        duration: stretch?.duration ?? 0
      }
    ]);
  };

  const handleRemoveDraftItem = (index) => {
    setDraftItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDraftDurationChange = (index, value) => {
    const durationValue = Number(value);
    setDraftItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              duration: Number.isNaN(durationValue) ? 0 : durationValue
            }
          : item
      )
    );
  };

  const handleSaveRoutine = (event) => {
    event.preventDefault();
    const trimmedName = draftName.trim();

    if (!trimmedName || draftItems.length === 0) return;

    const newRoutine = {
      id: makeId(),
      name: trimmedName,
      items: draftItems
    };

    setRoutines((prev) => [...prev, newRoutine]);
    setDraftName("");
    setDraftItems([]);
  };

  const handleDeleteRoutine = (routineId) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    if (routineId === activeRoutineId) {
      resetTimer();
    }
  };

  const startRoutine = (routineId) => {
    const routine = routines.find((item) => item.id === routineId);
    if (!routine) return;

    const firstStretchId = routine.items[0]?.stretchId;
    const firstStretch = stretches.find(
      (stretch) => stretch.id === firstStretchId
    );
    const firstDuration =
      routine.items[0]?.duration ?? firstStretch?.duration ?? 0;

    setActiveRoutineId(routineId);
    setCurrentIndex(0);
    setRemaining(firstDuration);
    setMode(routine.items.length ? "running" : "completed");
    setView("timer");
  };

  const resetTimer = () => {
    setMode("idle");
    setActiveRoutineId(null);
    setCurrentIndex(0);
    setRemaining(0);
  };

  const handlePause = () => setMode("paused");
  const handleResume = () => setMode("running");

  const goToIndex = (nextIndex) => {
    if (!activeRoutine) return;
    if (nextIndex < 0) return;
    if (nextIndex >= activeItems.length) {
      setMode("completed");
      setRemaining(0);
      return;
    }

    const nextItem = activeItems[nextIndex];
    const nextStretch = stretches.find(
      (stretch) => stretch.id === nextItem?.stretchId
    );
    const nextDuration = nextItem?.duration ?? nextStretch?.duration ?? 0;

    setCurrentIndex(nextIndex);
    setRemaining(nextDuration);
  };

  const activeStretchId = activeItems[currentIndex]?.stretchId;
  const activeStretch = stretches.find(
    (stretch) => stretch.id === activeStretchId
  );
  const activePhoto = activeStretch?.photo;

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Stretch</h1>
        </div>
        <nav className="tabs">
          <button
            className={view === "stretches" ? "tab tab--active" : "tab"}
            onClick={() => setView("stretches")}
          >
            Stretches
          </button>
          <button
            className={view === "routines" ? "tab tab--active" : "tab"}
            onClick={() => setView("routines")}
          >
            Routines
          </button>
          <button
            className={view === "timer" ? "tab tab--active" : "tab"}
            onClick={() => setView("timer")}
          >
            Timer
          </button>
        </nav>
      </header>

      <main className="app__main">
        {view === "stretches" && (
          <StretchesView stretches={stretches} formatTime={formatTime} />
        )}

        {view === "routines" && (
          <RoutinesView
            stretches={stretches}
            routines={routines}
            draftName={draftName}
            setDraftName={setDraftName}
            draftItems={draftItems}
            selectedStretchId={selectedStretchId}
            setSelectedStretchId={setSelectedStretchId}
            onAddDraftItem={handleAddDraftItem}
            onRemoveDraftItem={handleRemoveDraftItem}
            onDraftDurationChange={handleDraftDurationChange}
            onSaveRoutine={handleSaveRoutine}
            onStartRoutine={startRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            formatTime={formatTime}
          />
        )}

        {view === "timer" && (
          <TimerView
            activeRoutine={activeRoutine}
            activeItems={activeItems}
            activeStretch={activeStretch}
            activePhoto={activePhoto}
            remaining={remaining}
            formatTime={formatTime}
            mode={mode}
            currentIndex={currentIndex}
            onPause={handlePause}
            onResume={handleResume}
            onReset={resetTimer}
            onDone={() => {
              resetTimer();
              setView("routines");
            }}
            onGoToRoutines={() => setView("routines")}
            onGoToIndex={goToIndex}
            stretches={stretches}
          />
        )}
      </main>
    </div>
  );
}
