import { useEffect, useMemo, useRef, useState } from "react";
import RoutinesView from "./components/RoutinesView.jsx";
import StretchesView from "./components/StretchesView.jsx";
import TimerView from "./components/TimerView.jsx";
import LogView from "./components/LogView.jsx";

const STORAGE_ROUTINES = "stretch.routines";
const STORAGE_ACTIVITIES = "stretch.activities";
const BREAK_DURATION = 5;
const DEFAULT_ROUTINE_DURATION = 30;

const ASSET_BASE = import.meta.env.BASE_URL;

const defaultStretches = [
  // --------- NECK ---------
  {
    id: "neck-rotation",
    name: "Neck Rotation",
    photo: "",
    tags: ["Neck"],
    instructions:
      "Slowly turn your head to look over one shoulder, then the other. Move gently and avoid forcing the stretch."
  },
    {
    id: "ear-to-shoulder",
    name: "Ear to Shoulder",
    photo: "",
    tags: ["Neck"],
    instructions:
      "Gently tilt your head toward one shoulder until you feel a stretch in the side of your neck. Hold and switch sides."
  },


  // --------- SHOULDERS & CHEST ---------
  {
    id: "shoulder-circle",
    name: "Shoulder Circles",
    photo: "",
    tags: ["Shoulders & Chest"],
    instructions:
      "Roll shoulders up, back, and down in a smooth circle. Reverse direction halfway."
  },
  {
    id: "shoulder-rotations-arm-circles",
    name: "Shoulder Rotations & Arm Circles",
    photo: "",
    tags: ["Shoulders & Chest"],
    instructions:
      "Roll shoulders forward and back, then make smooth arm circles forward and back with both arms."
  },
  {
    id: "cross-body-shoulder",
    name: "Cross-Body Shoulder Stretch",
    photo: "",
    tags: ["Shoulders & Chest"],
    instructions:
      "Bring one arm across your chest and gently pull it closer with the opposite arm. Switch sides halfway."
  },
  {
    id: "shoulder-open",
    name: "Shoulder Opener",
    photo: "",
    tags: ["Shoulders & Chest"],
    instructions:
      "Interlace fingers behind your back and straighten your arms. Lift hands slightly and open your chest."
  },
  {
    id: "chest-opener-wall",
    name: "Wall Chest Opener",
    photo: "",
    tags: ["Shoulders & Chest"],
    instructions:
      "Place one hand on a wall behind you and gently turn your chest away. Keep shoulder down. Switch sides halfway."
  },

  // --------- SPINE & BACK ---------
  {
    id: "cat-cow",
    name: "Cat-Cow",
    photo: "",
    tags: ["Spine & Back"],
    instructions:
      "On hands and knees, inhale to arch your back and lift your chest. Exhale to round your spine and tuck your chin."
  },
  {
    id: "childs-pose",
    name: "Child's Pose",
    photo: "",
    tags: ["Spine & Back"],
    instructions:
      "Sit back on your heels and fold forward. Stretch arms out or rest them by your sides. Relax your neck."
  },
  {
    id: "seated-forward-fold",
    name: "Seated Forward Fold",
    photo: "",
    tags: ["Spine & Back"],
    instructions:
      "Sit with legs extended. Hinge at the hips and fold forward, reaching toward your shins or feet."
  },
  {
    id: "supine-twist",
    name: "Supine Spinal Twist",
    photo: "",
    tags: ["Spine & Back"],
    instructions:
      "Lie on your back, hug one knee in, and guide it across your body. Extend opposite arm. Switch sides halfway."
  },

  // --------- HIPS & GLUTES ---------
  {
    id: "butterfly",
    name: "Butterfly Stretch",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "Sit with soles of feet together. Let knees fall outward and keep chest lifted."
  },
  {
    id: "reclined-butterfly",
    name: "Reclined Butterfly",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "Lie on your back with feet together and knees open. Let gravity relax your hips."
  },
  {
    id: "figure-four",
    name: "Figure Four",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "Cross one ankle over opposite knee and pull the uncrossed leg toward your chest. Switch sides halfway."
  },
  {
    id: "hip-flexor",
    name: "Hip Flexor Lunge",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "Step into a low lunge with back knee down. Gently press hips forward while keeping torso upright."
  },
  {
    id: "frog-stretch",
    name: "Frog Stretch",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "On hands and knees, widen knees and bring feet outward. Lower hips gently while keeping chest down."
  },

  // --------- HAMSTRINGS & LEGS ---------
  {
    id: "standing-forward-fold",
    name: "Standing Forward Fold",
    photo: "",
    tags: ["Hamstrings & Legs"],
    instructions:
      "Hinge at the hips and fold forward. Let your head hang and bend knees slightly if needed."
  },
  {
    id: "hamstring-strap",
    name: "Supine Hamstring Stretch",
    photo: "",
    tags: ["Hamstrings & Legs"],
    instructions:
      "Lie on your back and lift one leg up, holding behind the thigh or calf. Keep hips grounded. Switch sides halfway."
  },
  {
    id: "wide-leg-forward-fold",
    name: "Wide-Leg Forward Fold",
    photo: "",
    tags: ["Hamstrings & Legs"],
    instructions:
      "Stand with feet wide and fold forward from the hips. Keep spine long and head relaxed."
  },
  {
    id: "calf-stretch",
    name: "Calf Stretch",
    photo: "",
    tags: ["Hamstrings & Legs"],
    instructions:
      "Step one foot back and press heel toward the floor. Keep back leg straight. Switch sides halfway."
  },

  // --------- FULL BODY / FLOW ---------
  {
    id: "downward-dog",
    name: "Downward Dog",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "From hands and knees, lift hips up and back. Press heels toward floor and lengthen your spine."
  },
  {
    id: "cobra",
    name: "Cobra Stretch",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Lie face down and press into hands to lift chest. Keep hips grounded and shoulders relaxed."
  },
  {
    id: "standing-side-bend",
    name: "Standing Side Bend",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Reach one arm overhead and gently lean to the opposite side. Keep chest open. Switch sides halfway."
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Jump feet out while raising arms overhead, then return to start. Keep a steady rhythm to raise your heart rate."
  },
  {
    id: "high-knees",
    name: "High Knees",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Jog in place while lifting knees toward your chest. Keep your torso tall and move quickly."
  },
  {
    id: "brisk-walk-jog",
    name: "Brisk Walk / Jog",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Walk or jog for a few minutes to warm your body and increase blood flow before stretching."
  },
  {
    id: "knee-pull-ups",
    name: "Knee Pull-Ups",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "Standing tall, pull one knee into your chest until you feel a stretch. Switch sides and repeat."
  },
  {
    id: "hip-rotations",
    name: "Hip Rotations",
    photo: "",
    tags: ["Hips & Glutes"],
    instructions:
      "Balance on one leg, lift the other knee, and gently rotate the hip outward. Switch sides."
  },
  {
    id: "deep-squats",
    name: "Deep Squats",
    photo: "",
    tags: ["Hamstrings & Legs"],
    instructions:
      "Step wide and squat down as far as comfortable with heels grounded, then stand and repeat on the other side."
  },
  {
    id: "flag-and-reach",
    name: "Flag & Reach",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Standing on one foot, reach the opposite arm and leg away from your body. Switch sides."
  },
  {
    id: "reverse-outside-flag",
    name: "Reverse Outside Flag & Reach",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Bend one knee while stepping the other leg behind you and reaching the opposite arm up. Switch sides."
  },
  {
    id: "torso-twists",
    name: "Torso Twists",
    photo: "",
    tags: ["Spine & Back"],
    instructions:
      "Stand with arms bent at chest height and gently twist side to side, keeping hips stable."
  },
  {
    id: "neck-rolls",
    name: "Neck Rolls",
    photo: "",
    tags: ["Neck"],
    instructions:
      "Relax your head and roll it in gentle circles, then switch directions."
  },
  {
    id: "forearm-extensor-stretch",
    name: "Forearm Extensor Stretch",
    photo: "",
    tags: ["Shoulders & Chest"],
    instructions:
      "Extend one arm, place fingers on the opposite palm, and gently pull back. Repeat with fingers facing down."
  },
  {
    id: "easy-climbing",
    name: "Easy Climbing",
    photo: "",
    tags: ["Full Body / Flow"],
    instructions:
      "Climb a few routes or problems well below your max to warm up movement and footwork."
  }
];

const premadeRoutines = [
  {
    id: "preset-morning-mobility",
    name: "Morning Mobility",
    items: [
      { stretchId: "cat-cow", duration: 30 },
      { stretchId: "childs-pose", duration: 30 },
      { stretchId: "standing-side-bend", duration: 30 },
      { stretchId: "standing-forward-fold", duration: 30 },
      { stretchId: "downward-dog", duration: 30 }
    ]
  },
  {
    id: "preset-desk-reset",
    name: "Desk Reset",
    items: [
      { stretchId: "neck-rotation", duration: 20 },
      { stretchId: "ear-to-shoulder", duration: 20 },
      { stretchId: "shoulder-circle", duration: 30 },
      { stretchId: "cross-body-shoulder", duration: 30 },
      { stretchId: "chest-opener-wall", duration: 30 }
    ]
  },
  {
    id: "preset-hips-hamstrings",
    name: "Hips + Hamstrings",
    items: [
      { stretchId: "hip-flexor", duration: 40 },
      { stretchId: "frog-stretch", duration: 40 },
      { stretchId: "figure-four", duration: 40 },
      { stretchId: "hamstring-strap", duration: 40 },
      { stretchId: "calf-stretch", duration: 30 }
    ]
  },
  {
    id: "preset-climbing-warmup",
    name: "Climbing Warm-Up",
    link: "https://www.theclimbingguy.com/ten-climbing-warmup-and-stretches/",
    items: [
      { stretchId: "jumping-jacks", duration: 45 },
      { stretchId: "high-knees", duration: 60 },
      { stretchId: "brisk-walk-jog", duration: 120 },
      { stretchId: "knee-pull-ups", duration: 40 },
      { stretchId: "hip-rotations", duration: 40 },
      { stretchId: "deep-squats", duration: 45 },
      { stretchId: "flag-and-reach", duration: 40 },
      { stretchId: "reverse-outside-flag", duration: 40 },
      { stretchId: "shoulder-rotations-arm-circles", duration: 40 },
      { stretchId: "torso-twists", duration: 30 },
      { stretchId: "neck-rolls", duration: 30 },
      { stretchId: "forearm-extensor-stretch", duration: 30 },
      { stretchId: "easy-climbing", duration: 180 }
    ]
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

const mergeRoutinesWithPresets = (storedRoutines, presets) => {
  const routinesList = Array.isArray(storedRoutines) ? storedRoutines : [];
  if (!presets.length) return routinesList;
  const existingIds = new Set(routinesList.map((routine) => routine.id));
  const merged = [...routinesList];
  presets.forEach((preset) => {
    if (!existingIds.has(preset.id)) {
      merged.push(preset);
    }
  });
  return merged;
};

const formatTime = (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatDateKey = (dateValue = new Date()) => {
  const date =
    typeof dateValue === "string" ? new Date(`${dateValue}T00:00:00`) : dateValue;
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const makeId = () => `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export default function App() {
  const [view, setView] = useState("timer");
  const [editScrollToken, setEditScrollToken] = useState(0);
  const stretches = defaultStretches;
  const [routines, setRoutines] = useState(() =>
    mergeRoutinesWithPresets(loadJSON(STORAGE_ROUTINES, []), premadeRoutines)
  );
  const [activities, setActivities] = useState(() =>
    loadJSON(STORAGE_ACTIVITIES, [])
  );
  const [draftName, setDraftName] = useState("");
  const [draftItems, setDraftItems] = useState([]);
  const [selectedStretchId, setSelectedStretchId] = useState(
    defaultStretches[0]?.id ?? ""
  );
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [activeRoutineId, setActiveRoutineId] = useState(null);
  const [activeRunId, setActiveRunId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [mode, setMode] = useState("idle");
  const [phase, setPhase] = useState("stretch");
  const lastToneSecondRef = useRef(null);
  const loggedRunRef = useRef(null);

  const playCountdownTone = () => {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.12;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
    oscillator.onended = () => {
      context.close();
    };
  };

  const activeRoutine = useMemo(
    () => routines.find((routine) => routine.id === activeRoutineId) ?? null,
    [routines, activeRoutineId]
  );

  const activeItems = activeRoutine?.items ?? [];

  useEffect(() => {
    saveJSON(STORAGE_ROUTINES, routines);
  }, [routines]);

  useEffect(() => {
    saveJSON(STORAGE_ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    if (!selectedStretchId && stretches[0]) {
      setSelectedStretchId(stretches[0].id);
    }
  }, [stretches, selectedStretchId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const normalizeView = (hashValue) => {
      const trimmed = hashValue.replace("#", "").trim();
      const allowed = new Set(["timer", "log", "stretches", "routines"]);
      return allowed.has(trimmed) ? trimmed : null;
    };

    const initialView = normalizeView(window.location.hash);
    if (initialView) {
      setView(initialView);
    }

    const handleHashChange = () => {
      const nextView = normalizeView(window.location.hash);
      if (nextView) {
        setView(nextView);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nextHash = `#${view}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [view]);

  const getRoutineDuration = (routine) => {
    const totalSeconds = routine.items.reduce((total, item) => {
      const stretch = stretches.find((entry) => entry.id === item.stretchId);
      const duration = item.duration ?? stretch?.duration ?? 0;
      return total + duration;
    }, 0);
    return Math.round(totalSeconds / 60);
  };

  const addActivity = ({
    routineId,
    routineName,
    date,
    manual = false,
    customName,
    duration,
    description
  }) => {
    if (!routineId && !customName) return;
    const resolvedRoutine =
      routineId && routines.find((routine) => routine.id === routineId);
    const entry = {
      id: makeId(),
      routineId: routineId ?? null,
      routineName:
        routineName ?? resolvedRoutine?.name ?? (customName ? null : "Routine"),
      customName: customName ?? null,
      duration:
        duration ??
        (resolvedRoutine ? getRoutineDuration(resolvedRoutine) : null),
      description: description ?? null,
      date: formatDateKey(date ?? new Date()),
      manual,
      createdAt: new Date().toISOString()
    };
    setActivities((prev) => [...prev, entry]);
  };

  const updateActivity = (activityId, updates) => {
    setActivities((prev) =>
      prev.map((entry) =>
        entry.id === activityId ? { ...entry, ...updates } : entry
      )
    );
  };

  const deleteActivity = (activityId) => {
    setActivities((prev) => prev.filter((entry) => entry.id !== activityId));
  };

  useEffect(() => {
    if (mode !== "completed") return;
    if (!activeRoutine || activeItems.length === 0) return;
    if (loggedRunRef.current === activeRunId) return;
    addActivity({
      routineId: activeRoutine.id,
      routineName: activeRoutine.name,
      duration: getRoutineDuration(activeRoutine),
      manual: false
    });
    loggedRunRef.current = activeRunId;
  }, [mode, activeRoutine, activeItems.length, activeRunId]);

  useEffect(() => {
    if (mode !== "running") return;
    if (!activeRoutine || activeItems.length === 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (phase === "stretch") {
            const nextIndex = currentIndex + 1;
            if (nextIndex >= activeItems.length) {
              setMode("completed");
              return 0;
            }
            setPhase("break");
            return BREAK_DURATION;
          }
          const nextIndex = currentIndex + 1;
          const nextItem = activeItems[nextIndex];
          const nextStretch = stretches.find(
            (stretch) => stretch.id === nextItem?.stretchId
          );
          const nextDuration =
            nextItem?.duration ?? nextStretch?.duration ?? 0;
          setCurrentIndex(nextIndex);
          setPhase("stretch");
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, activeRoutine, activeItems, currentIndex, stretches, phase]);

  useEffect(() => {
    if (mode !== "running" || phase !== "stretch") {
      lastToneSecondRef.current = null;
      return;
    }
    if (remaining > 3) {
      lastToneSecondRef.current = null;
      return;
    }
    if (remaining > 0 && remaining <= 3) {
      if (lastToneSecondRef.current === remaining) return;
      lastToneSecondRef.current = remaining;
      playCountdownTone();
    }
  }, [mode, phase, remaining]);

  const handleAddDraftItem = () => {
    if (!selectedStretchId) return;
    const stretch = stretches.find((entry) => entry.id === selectedStretchId);
    setDraftItems((prev) => [
      ...prev,
      {
        stretchId: selectedStretchId,
        duration: stretch?.duration ?? DEFAULT_ROUTINE_DURATION
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

  const handleReorderDraftItems = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setDraftItems((prev) => {
      if (fromIndex < 0 || toIndex < 0) return prev;
      if (fromIndex >= prev.length || toIndex >= prev.length) return prev;
      const nextItems = [...prev];
      const [moved] = nextItems.splice(fromIndex, 1);
      nextItems.splice(toIndex, 0, moved);
      return nextItems;
    });
  };

  const handleSaveRoutine = (event) => {
    event.preventDefault();
    const trimmedName = draftName.trim();

    if (!trimmedName || draftItems.length === 0) return;

    if (editingRoutineId) {
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === editingRoutineId
            ? {
                ...routine,
                name: trimmedName,
                items: draftItems
              }
            : routine
        )
      );
      setEditingRoutineId(null);
    } else {
      const newRoutine = {
        id: makeId(),
        name: trimmedName,
        items: draftItems
      };

      setRoutines((prev) => [...prev, newRoutine]);
    }

    setDraftName("");
    setDraftItems([]);
  };

  const handleEditRoutine = (routineId) => {
    const routine = routines.find((item) => item.id === routineId);
    if (!routine) return;
    setDraftName(routine.name);
    setDraftItems(routine.items);
    setEditingRoutineId(routineId);
    setEditScrollToken((prev) => prev + 1);
    if (!selectedStretchId && stretches[0]) {
      setSelectedStretchId(stretches[0].id);
    }
  };

  const handleCancelEdit = () => {
    setDraftName("");
    setDraftItems([]);
    setEditingRoutineId(null);
  };

  const handleDeleteRoutine = (routineId) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
    if (routineId === activeRoutineId) {
      resetTimer();
    }
    if (routineId === editingRoutineId) {
      handleCancelEdit();
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
    setActiveRunId(makeId());
    setCurrentIndex(0);
    setRemaining(firstDuration);
    setPhase("stretch");
    setMode(routine.items.length ? "running" : "completed");
    setView("timer");
  };

  const resetTimer = () => {
    setMode("idle");
    setActiveRoutineId(null);
    setActiveRunId(null);
    setCurrentIndex(0);
    setRemaining(0);
    setPhase("stretch");
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
    setPhase("stretch");
  };

  const activeStretchId = activeItems[currentIndex]?.stretchId;
  const activeStretch = stretches.find(
    (stretch) => stretch.id === activeStretchId
  );
  const nextItem = activeItems[currentIndex + 1];
  const nextStretch = stretches.find(
    (stretch) => stretch.id === nextItem?.stretchId
  );
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <img
            className="app__logo"
            src={`${import.meta.env.BASE_URL}cat-lilac.png`}
            alt="Stretching cat icon"
          />
          <h1>Stretch</h1>
        </div>
        <nav className="tabs">
          <button
            className={view === "timer" ? "tab tab--active" : "tab"}
            onClick={() => setView("timer")}
          >
            Stretch
          </button>
          <button
            className={view === "log" ? "tab tab--active" : "tab"}
            onClick={() => setView("log")}
          >
            Log
          </button>
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
        </nav>
      </header>

      <main className="app__main">
        {view === "stretches" && (
          <StretchesView stretches={stretches} />
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
            onReorderDraftItems={handleReorderDraftItems}
            onSaveRoutine={handleSaveRoutine}
            onEditRoutine={handleEditRoutine}
            onCancelEdit={handleCancelEdit}
            isEditing={Boolean(editingRoutineId)}
            editScrollToken={editScrollToken}
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
            nextStretch={nextStretch}
            remaining={remaining}
            formatTime={formatTime}
            mode={mode}
            phase={phase}
            breakDuration={BREAK_DURATION}
            currentIndex={currentIndex}
            onPause={handlePause}
            onResume={handleResume}
            onReset={resetTimer}
            onDone={resetTimer}
            onGoToRoutines={() => setView("routines")}
            onGoToIndex={goToIndex}
            routines={routines}
            stretches={stretches}
            onStartRoutine={startRoutine}
          />
        )}

        {view === "log" && (
          <LogView
            activities={activities}
            routines={routines}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
            onDeleteActivity={deleteActivity}
          />
        )}
      </main>
    </div>
  );
}
