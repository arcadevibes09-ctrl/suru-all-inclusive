// FILE: src/components/GymView.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Check,
  Timer,
  Dumbbell,
  Trophy,
  Activity,
  Flame,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import '../styles/GymView.css';

const SPLITS = ['PUSH', 'PULL', 'LEGS', 'UPPER', 'FULL', 'CARDIO', 'REST'];

const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getRollingDays = (centerDate = new Date()) => {
  const days = [];
  for (let i = -5; i <= 1; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    days.push({
      key: formatDateKey(d),
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      isToday: formatDateKey(d) === formatDateKey(new Date())
    });
  }
  return days;
};

export default function GymView({ gymData, setGymData }) {
  const todayKey = formatDateKey(new Date());
  const rollingDays = getRollingDays();
  const currentMonthTitle = new Date()
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    .toUpperCase();

  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [subTab, setSubTab] = useState('workout');

  const [exerciseName, setExerciseName] = useState('');
  const [setWeight, setSetWeight] = useState('');
  const [setReps, setSetReps] = useState('');

  const [newLiftName, setNewLiftName] = useState('');
  const [newLiftWeight, setNewLiftWeight] = useState('');

  const [restSeconds, setRestSeconds] = useState(90);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restRunning, setRestRunning] = useState(false);

  useEffect(() => {
    if (!restRunning || restRemaining <= 0) {
      if (restRemaining === 0 && restRunning) {
        setRestRunning(false);
        if (navigator.vibrate) navigator.vibrate([100, 60, 100]);
      }
      return;
    }
    const interval = setInterval(() => {
      setRestRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [restRunning, restRemaining]);

  const startRestTimer = (secs) => {
    setRestSeconds(secs);
    setRestRemaining(secs);
    setRestRunning(true);
  };

  const dayLogs = gymData.logsByDate || {};
  const activeDayLog = dayLogs[selectedDateKey] || {
    split: 'PUSH',
    exercises: [],
    bodyWeight: gymData.lastBodyWeight || 70,
    protein: 0,
    water: 0
  };

  const updateActiveDayLog = (updater) => {
    setGymData((prev) => {
      const prevLogs = prev.logsByDate || {};
      const current = prevLogs[selectedDateKey] || {
        split: 'PUSH',
        exercises: [],
        bodyWeight: prev.lastBodyWeight || 70,
        protein: 0,
        water: 0
      };
      const updated = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        lastBodyWeight: updated.bodyWeight || prev.lastBodyWeight || 70,
        logsByDate: {
          ...prevLogs,
          [selectedDateKey]: updated
        }
      };
    });
  };

  const handleSelectSplit = (splitName) => {
    updateActiveDayLog((log) => ({ ...log, split: splitName }));
  };

  const handleAddExerciseSet = (e) => {
    e.preventDefault();
    if (!exerciseName.trim() || !setReps) return;
    const cleanName = exerciseName.trim().toUpperCase();
    const weightNum = Number(setWeight) || 0;
    const repsNum = Number(setReps) || 1;

    updateActiveDayLog((log) => {
      const existingIdx = log.exercises.findIndex((ex) => ex.name === cleanName);
      const newSet = {
        id: 's_' + Date.now(),
        weight: weightNum,
        reps: repsNum,
        done: true
      };
      if (existingIdx > -1) {
        const updatedEx = [...log.exercises];
        updatedEx[existingIdx] = {
          ...updatedEx[existingIdx],
          sets: [...updatedEx[existingIdx].sets, newSet]
        };
        return { ...log, exercises: updatedEx };
      }
      return {
        ...log,
        exercises: [
          ...log.exercises,
          { id: 'ex_' + Date.now(), name: cleanName, sets: [newSet] }
        ]
      };
    });

    setSetReps('');
    startRestTimer(restSeconds);
  };

  const toggleSetDone = (exId, setId) => {
    updateActiveDayLog((log) => ({
      ...log,
      exercises: log.exercises.map((ex) =>
        ex.id !== exId
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, done: !s.done } : s
              )
            }
      )
    }));
  };

  const duplicateLastSet = (exId) => {
    updateActiveDayLog((log) => ({
      ...log,
      exercises: log.exercises.map((ex) => {
        if (ex.id !== exId || ex.sets.length === 0) return ex;
        const last = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { ...last, id: 's_' + Date.now(), done: true }]
        };
      })
    }));
    startRestTimer(restSeconds);
  };

  const deleteExercise = (exId) => {
    updateActiveDayLog((log) => ({
      ...log,
      exercises: log.exercises.filter((ex) => ex.id !== exId)
    }));
  };

  const prsList = gymData.prs || [
    { name: 'BENCH PRESS', value: 80 },
    { name: 'SQUAT', value: 100 },
    { name: 'DEADLIFT', value: 120 }
  ];

  const updatePR = (index, delta) => {
    setGymData((prev) => {
      const list = [...(prev.prs || prsList)];
      list[index] = {
        ...list[index],
        value: Math.max(0, list[index].value + delta)
      };
      return { ...prev, prs: list };
    });
  };

  const addLiftPR = (e) => {
    e.preventDefault();
    if (!newLiftName.trim() || !newLiftWeight) return;
    setGymData((prev) => ({
      ...prev,
      prs: [
        ...(prev.prs || prsList),
        { name: newLiftName.trim().toUpperCase(), value: Number(newLiftWeight) }
      ]
    }));
    setNewLiftName('');
    setNewLiftWeight('');
  };

  const deletePR = (index) => {
    setGymData((prev) => ({
      ...prev,
      prs: (prev.prs || prsList).filter((_, idx) => idx !== index)
    }));
  };

  const calcDayVolume = (dateKey) => {
    const log = dayLogs[dateKey];
    if (!log || !log.exercises) return 0;
    return log.exercises.reduce((acc, ex) => {
      const exVol = ex.sets
        .filter((s) => s.done)
        .reduce((sAcc, s) => sAcc + (Number(s.weight) || 1) * Number(s.reps), 0);
      return acc + exVol;
    }, 0);
  };

  const activeDayVolume = calcDayVolume(selectedDateKey);
  const completedSetsCount = activeDayLog.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.done).length,
    0
  );

  const chartVolumes = rollingDays.map((d) => ({
    label: d.dayName.slice(0, 2) + ' ' + d.dayNum,
    volume: calcDayVolume(d.key),
    isSelected: d.key === selectedDateKey
  }));
  const maxChartVol = Math.max(1000, ...chartVolumes.map((c) => c.volume));

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="gym-full-view">
      {/* Sub-Navigation Pills */}
      <div className="gym-nav-tabs">
        <button
          className={`uni-btn subtle ${subTab === 'workout' ? 'active' : ''}`}
          onClick={() => setSubTab('workout')}
        >
          <Dumbbell size={13} /> Log
        </button>
        <button
          className={`uni-btn subtle ${subTab === 'prs' ? 'active' : ''}`}
          onClick={() => setSubTab('prs')}
        >
          <Trophy size={13} /> PRs
        </button>
        <button
          className={`uni-btn subtle ${subTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setSubTab('vitals')}
        >
          <Flame size={13} /> Vitals
        </button>
        <button
          className={`uni-btn subtle ${subTab === 'progress' ? 'active' : ''}`}
          onClick={() => setSubTab('progress')}
        >
          <Activity size={13} /> Graph
        </button>
      </div>

      {/* Live Month & 7-Day Strip */}
      <div className="gym-calendar-header">
        <h3 className="gym-month-heading">{currentMonthTitle}</h3>
        {selectedDateKey !== todayKey && (
          <button
            className="uni-btn subtle"
            onClick={() => setSelectedDateKey(todayKey)}
          >
            Today
          </button>
        )}
      </div>

      <div className="gym-date-strip">
        {rollingDays.map((d) => (
          <button
            key={d.key}
            className={`gym-day-pill ${selectedDateKey === d.key ? 'active' : ''} ${
              d.isToday && selectedDateKey !== d.key ? 'today-outline' : ''
            }`}
            onClick={() => setSelectedDateKey(d.key)}
          >
            <span className="gym-day-name">{d.dayName}</span>
            <span className="gym-day-num">{d.dayNum}</span>
          </button>
        ))}
      </div>

      {/* Rest Timer Card */}
      <div className="gym-rest-bar">
        <div className={`gym-rest-status ${restRunning ? 'running' : ''}`}>
          <Timer size={15} />
          <span>
            {restRemaining > 0 ? `REST • ${formatTimer(restRemaining)}` : 'REST TIMER'}
          </span>
        </div>
        <div className="gym-rest-actions">
          {[60, 90, 120].map((sec) => (
            <button
              key={sec}
              className={`uni-btn subtle ${restSeconds === sec && restRunning ? 'active' : ''}`}
              onClick={() => startRestTimer(sec)}
            >
              {sec}s
            </button>
          ))}
          {restRemaining > 0 && (
            <>
              <button
                className="uni-btn subtle"
                onClick={() => setRestRunning((r) => !r)}
              >
                {restRunning ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                className="uni-btn subtle"
                onClick={() => {
                  setRestRunning(false);
                  setRestRemaining(0);
                }}
              >
                <RotateCcw size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* TAB 1: WORKOUT LOGGER */}
      {subTab === 'workout' && (
        <div className="gym-panel">
          <div className="gym-split-strip">
            {SPLITS.map((sp) => (
              <button
                key={sp}
                className={`uni-btn subtle ${activeDayLog.split === sp ? 'active' : ''}`}
                onClick={() => handleSelectSplit(sp)}
              >
                {sp}
              </button>
            ))}
          </div>

          <div className="gym-summary-strip">
            <div>
              <span className="gym-summary-label">SPLIT</span>
              <span className="gym-summary-value">{activeDayLog.split}</span>
            </div>
            <div>
              <span className="gym-summary-label">DONE SETS</span>
              <span className="gym-summary-value">{completedSetsCount}</span>
            </div>
            <div>
              <span className="gym-summary-label">VOLUME</span>
              <span className="gym-summary-value">{activeDayVolume} KG</span>
            </div>
          </div>

          <form className="gym-exercise-form" onSubmit={handleAddExerciseSet}>
            <input
              className="gym-input-full"
              placeholder="Exercise name (e.g. Incline DB Press)"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              list="common-exercises"
            />
            <datalist id="common-exercises">
              <option value="BENCH PRESS" />
              <option value="INCLINE DB PRESS" />
              <option value="LAT PULLDOWN" />
              <option value="BARBELL ROW" />
              <option value="SQUAT" />
              <option value="ROMANIAN DEADLIFT" />
              <option value="OVERHEAD PRESS" />
              <option value="LATERAL RAISE" />
              <option value="BICEP CURL" />
              <option value="TRICEP PUSHDOWN" />
            </datalist>

            <div className="gym-form-row">
              <input
                className="gym-input-metric"
                type="number"
                step="0.5"
                placeholder="Weight (KG)"
                value={setWeight}
                onChange={(e) => setSetWeight(e.target.value)}
              />
              <input
                className="gym-input-metric"
                type="number"
                placeholder="Reps"
                value={setReps}
                onChange={(e) => setSetReps(e.target.value)}
              />
              <button type="submit" className="uni-btn subtle active">
                <Plus size={14} /> Log Set
              </button>
            </div>
          </form>

          {activeDayLog.exercises.length === 0 ? (
            <div className="gym-empty-state">
              No sets logged for this date yet. Enter an exercise above to start tracking.
            </div>
          ) : (
            <div className="gym-pr-list">
              {activeDayLog.exercises.map((ex) => (
                <div key={ex.id} className="gym-exercise-card">
                  <div className="gym-exercise-top">
                    <span className="gym-pr-name">{ex.name}</span>
                    <div className="gym-exercise-actions">
                      <button
                        className="uni-btn subtle"
                        onClick={() => duplicateLastSet(ex.id)}
                      >
                        + Repeat
                      </button>
                      <button
                        className="uni-btn subtle"
                        onClick={() => deleteExercise(ex.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="gym-sets-grid">
                    {ex.sets.map((s, idx) => (
                      <button
                        key={s.id}
                        className={`uni-btn subtle gym-set-chip ${s.done ? 'active done' : ''}`}
                        onClick={() => toggleSetDone(ex.id, s.id)}
                      >
                        <span>#{idx + 1}</span>
                        <span>
                          {s.weight > 0 ? `${s.weight}kg × ${s.reps}` : `${s.reps} reps`}
                        </span>
                        {s.done && <Check size={11} />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL-TIME PRS */}
      {subTab === 'prs' && (
        <div className="gym-panel">
          <p className="gym-section-label">ALL-TIME PERSONAL RECORDS</p>
          <div className="gym-pr-list">
            {prsList.map((item, idx) => (
              <div key={idx} className="gym-pr-capsule">
                <span className="gym-pr-name">{item.name}</span>
                <div className="gym-pr-controls">
                  <button className="uni-btn subtle" onClick={() => updatePR(idx, -2.5)}>
                    −
                  </button>
                  <div className="gym-pr-badge">{item.value} kg</div>
                  <button className="uni-btn subtle" onClick={() => updatePR(idx, 2.5)}>
                    +
                  </button>
                  <button className="uni-btn subtle" onClick={() => deletePR(idx)}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form className="gym-exercise-form" onSubmit={addLiftPR}>
            <div className="gym-form-row">
              <input
                className="gym-input-full"
                placeholder="Lift Name (e.g. Squat)"
                value={newLiftName}
                onChange={(e) => setNewLiftName(e.target.value)}
              />
              <input
                className="gym-input-metric"
                type="number"
                step="0.5"
                placeholder="KG"
                value={newLiftWeight}
                onChange={(e) => setNewLiftWeight(e.target.value)}
              />
              <button type="submit" className="uni-btn subtle active">
                <Plus size={14} /> Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: VITALS */}
      {subTab === 'vitals' && (
        <div className="gym-panel">
          <p className="gym-section-label">DAILY METRICS ({selectedDateKey})</p>
          <div className="gym-pr-list">
            <div className="gym-pr-capsule">
              <span className="gym-pr-name">BODY WEIGHT</span>
              <div className="gym-pr-controls">
                <button
                  className="uni-btn subtle"
                  onClick={() =>
                    updateActiveDayLog((l) => ({
                      ...l,
                      bodyWeight: Number(Math.max(30, (l.bodyWeight || 70) - 0.2).toFixed(1))
                    }))
                  }
                >
                  −
                </button>
                <div className="gym-pr-badge">{activeDayLog.bodyWeight || 70} kg</div>
                <button
                  className="uni-btn subtle"
                  onClick={() =>
                    updateActiveDayLog((l) => ({
                      ...l,
                      bodyWeight: Number(((l.bodyWeight || 70) + 0.2).toFixed(1))
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="gym-pr-capsule">
              <span className="gym-pr-name">PROTEIN INTAKE</span>
              <div className="gym-pr-controls">
                <button
                  className="uni-btn subtle"
                  onClick={() =>
                    updateActiveDayLog((l) => ({
                      ...l,
                      protein: Math.max(0, (l.protein || 0) - 10)
                    }))
                  }
                >
                  −10g
                </button>
                <div className="gym-pr-badge">{activeDayLog.protein || 0} g</div>
                <button
                  className="uni-btn subtle"
                  onClick={() =>
                    updateActiveDayLog((l) => ({
                      ...l,
                      protein: (l.protein || 0) + 25
                    }))
                  }
                >
                  +25g
                </button>
              </div>
            </div>

            <div className="gym-pr-capsule">
              <span className="gym-pr-name">HYDRATION</span>
              <div className="gym-pr-controls">
                <button
                  className="uni-btn subtle"
                  onClick={() =>
                    updateActiveDayLog((l) => ({
                      ...l,
                      water: Number(Math.max(0, (l.water || 0) - 0.25).toFixed(2))
                    }))
                  }
                >
                  −
                </button>
                <div className="gym-pr-badge">{activeDayLog.water || 0} L</div>
                <button
                  className="uni-btn subtle"
                  onClick={() =>
                    updateActiveDayLog((l) => ({
                      ...l,
                      water: Number(((l.water || 0) + 0.5).toFixed(2))
                    }))
                  }
                >
                  +0.5L
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VOLUME GRAPH */}
      {subTab === 'progress' && (
        <div className="gym-panel">
          <p className="gym-section-label">7-DAY VOLUME LOAD (KG × REPS)</p>
          <div className="progress-chart-card">
            <svg viewBox="0 0 320 220" className="progress-svg">
              <line x1="30" y1="20" x2="30" y2="185" stroke="#222" strokeWidth="1.5" />
              <line x1="30" y1="185" x2="300" y2="185" stroke="#222" strokeWidth="1.5" />

              {chartVolumes.map((pt, i) => {
                const x = 48 + i * 38;
                const barHeight = Math.max(4, Math.round((pt.volume / maxChartVol) * 145));
                const y = 185 - barHeight;
                return (
                  <g key={pt.label}>
                    <rect
                      x={x - 10}
                      y={y}
                      width="20"
                      height={barHeight}
                      rx="5"
                      fill={pt.isSelected ? '#d4d4d4' : '#262626'}
                    />
                    {pt.volume > 0 && (
                      <text x={x} y={y - 6} fill="#999" fontSize="7.5" textAnchor="middle">
                        {pt.volume}
                      </text>
                    )}
                    <text
                      x={x}
                      y="202"
                      fill={pt.isSelected ? '#e5e5e5' : '#666'}
                      fontSize="8"
                      textAnchor="middle"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
