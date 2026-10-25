// FILE: src/Task.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Check,
  Trash2,
  Clock,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import './styles/Task.css';

const CATEGORIES = ['General', 'Gym', 'Life', 'Study', 'Urgent'];
const PRESET_TIMERS = [
  { label: 'No Timer', mins: 0 },
  { label: '15m', mins: 15 },
  { label: '30m', mins: 30 },
  { label: '45m', mins: 45 },
  { label: '60m', mins: 60 }
];

export default function Task() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('suru_realtime_tasks_v5');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 't_1',
        text: 'Hit daily workout session & log sets',
        category: 'Gym',
        done: false,
        totalSeconds: 2700,
        remainingSeconds: 2700,
        isRunning: false,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [selectedCat, setSelectedCat] = useState('General');
  const [selectedMins, setSelectedMins] = useState(0);
  const [customMins, setCustomMins] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('suru_realtime_tasks_v5', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const hasRunning = tasks.some((t) => t.isRunning && t.remainingSeconds > 0);
    if (!hasRunning) return;

    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (!t.isRunning || t.remainingSeconds <= 0) return t;
          const nextRem = t.remainingSeconds - 1;
          if (nextRem === 0 && navigator.vibrate) {
            navigator.vibrate([120, 80, 120]);
          }
          return {
            ...t,
            remainingSeconds: nextRem,
            isRunning: nextRem > 0
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const mins = customMins ? Number(customMins) : selectedMins;
    const totalSecs = Math.max(0, Math.round(mins * 60));

    const newTask = {
      id: 'task_' + Date.now(),
      text: inputText.trim(),
      category: selectedCat,
      done: false,
      totalSeconds: totalSecs,
      remainingSeconds: totalSecs,
      isRunning: totalSecs > 0,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTasks((prev) => [newTask, ...prev]);
    setInputText('');
    setCustomMins('');
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, isRunning: !t.done ? false : t.isRunning }
          : t
      )
    );
  };

  const toggleTimer = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && t.remainingSeconds > 0
          ? { ...t, isRunning: !t.isRunning }
          : t
      )
    );
  };

  const resetTimer = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false }
          : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  const formatClock = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = secs % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'timed') return t.totalSeconds > 0;
    if (filter === 'done') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="task-view-wrap">
      <div className="task-header-bar">
        <div>
          <h2 className="task-heading-title">Directives & Timers</h2>
          <span className="task-heading-date">{todayLabel}</span>
        </div>

        <span className="uni-btn subtle">
          {doneCount}/{tasks.length} Done ({progressPct}%)
        </span>
      </div>

      <div className="task-progress-track">
        <div
          className="task-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <form className="task-creator-card" onSubmit={handleAddTask}>
        <div className="task-input-row">
          <input
            className="task-main-input"
            placeholder="Write a task, goal, or session..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="uni-btn subtle active">
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="task-pill-group">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`uni-btn subtle ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="task-pill-group">
          <span className="task-group-label">
            <Clock size={13} />
          </span>
          {PRESET_TIMERS.map((p) => (
            <button
              type="button"
              key={p.label}
              className={`uni-btn subtle ${selectedMins === p.mins && !customMins ? 'active' : ''}`}
              onClick={() => {
                setSelectedMins(p.mins);
                setCustomMins('');
              }}
            >
              {p.label}
            </button>
          ))}
          <input
            type="number"
            min="1"
            placeholder="Custom min"
            value={customMins}
            onChange={(e) => setCustomMins(e.target.value)}
            className="task-custom-min-input"
          />
        </div>
      </form>

      <div className="task-filter-bar">
        <div className="task-filter-pills">
          {['all', 'active', 'timed', 'done'].map((f) => (
            <button
              key={f}
              className={`uni-btn subtle ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {doneCount > 0 && (
          <button className="uni-btn subtle" onClick={clearCompleted}>
            Clear Done
          </button>
        )}
      </div>

      <div className="task-items-list">
        {filteredTasks.length === 0 ? (
          <div className="task-empty-msg">
            No tasks in this view. Add one above to get started.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isTimeUp = t.totalSeconds > 0 && t.remainingSeconds === 0 && !t.done;
            return (
              <div
                key={t.id}
                className={`task-row-card ${t.done ? 'completed' : ''} ${
                  isTimeUp ? 'time-up' : ''
                }`}
              >
                <button
                  type="button"
                  className={`task-tick-btn ${t.done ? 'active' : ''}`}
                  onClick={() => toggleDone(t.id)}
                  aria-label="Toggle Complete"
                >
                  {t.done && <Check size={13} />}
                </button>

                <div className="task-body-col">
                  <div className="task-title-text">{t.text}</div>

                  <div className="task-meta-row">
                    <span className="task-category-tag">
                      {t.category} • {t.createdAt}
                    </span>

                    {t.totalSeconds > 0 && (
                      <div className="task-timer-controls">
                        <span
                          className={`uni-btn subtle task-timer-badge ${
                            t.isRunning ? 'active' : ''
                          } ${isTimeUp ? 'alert' : ''}`}
                        >
                          ⏱ {isTimeUp ? 'TIME UP' : formatClock(t.remainingSeconds)}
                        </span>
                        {!t.done && t.remainingSeconds > 0 && (
                          <button
                            type="button"
                            className="uni-btn subtle task-icon-pill"
                            onClick={() => toggleTimer(t.id)}
                          >
                            {t.isRunning ? <Pause size={11} /> : <Play size={11} />}
                          </button>
                        )}
                        <button
                          type="button"
                          className="uni-btn subtle task-icon-pill"
                          onClick={() => resetTimer(t.id)}
                          title="Reset Timer"
                        >
                          <RotateCcw size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="uni-btn subtle task-icon-pill"
                  onClick={() => deleteTask(t.id)}
                  aria-label="Delete Task"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
