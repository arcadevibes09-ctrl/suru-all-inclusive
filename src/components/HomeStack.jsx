// FILE: src/components/HomeStack.jsx
import React, { useState, useRef } from 'react';
import { Heart, Dumbbell, Layers, LayoutGrid, Sparkles } from 'lucide-react';

export default function HomeStack({
  onOpenFullView,
  suruSummary,
  gymSummary,
  onOpenAI
}) {
  // 'A' = Suru Front (3D Stack), 'B1' = Gym Front (3D Stack), 'B2' = Unstacked Vertical Grid
  const [viewMode, setViewMode] = useState('A');
  const touchStart = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = (e) => {
    const dx = touchStart.current.x - e.changedTouches[0].clientX;
    const dy = touchStart.current.y - e.changedTouches[0].clientY;

    // Horizontal swipe (> 45px) -> Swap between A and B1 in 3D Stack
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (viewMode === 'B2') {
        setViewMode(dx > 0 ? 'B1' : 'A');
      } else {
        setViewMode((prev) => (prev === 'A' ? 'B1' : 'A'));
      }
    }
    // Vertical swipe (> 50px) -> Toggle between Stacked (A/B1) and Unstacked Grid (B2)
    else if (Math.abs(dy) > 50) {
      if (dy < -50) {
        // Swipe Down -> Unstack to B2
        setViewMode('B2');
      } else if (dy > 50 && viewMode === 'B2') {
        // Swipe Up -> Restack to A
        setViewMode('A');
      }
    }
  };

  const handleCardInteraction = (cardType) => {
    // If in 3D stack and clicking the back card, bring it to front first (A <-> B1)
    if (viewMode === 'A' && cardType === 'gym') {
      setViewMode('B1');
      return;
    }
    if (viewMode === 'B1' && cardType === 'suru') {
      setViewMode('A');
      return;
    }
    // Clicking the front card (or any card in B2) opens Full View
    onOpenFullView(cardType);
  };

  return (
    <div
      className="home-stack-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Gesture State Pill & AI Trigger */}
      <div className="stack-status-bar">
        <div className="state-pills">
          <button
            className={`state-pill ${viewMode === 'A' ? 'active' : ''}`}
            onClick={() => setViewMode('A')}
          >
            A · SURU
          </button>
          <button
            className={`state-pill ${viewMode === 'B1' ? 'active' : ''}`}
            onClick={() => setViewMode('B1')}
          >
            B1 · GYM
          </button>
          <button
            className={`state-pill ${viewMode === 'B2' ? 'active' : ''}`}
            onClick={() => setViewMode('B2')}
            title="Toggle B2 Split Grid"
          >
            {viewMode === 'B2' ? <Layers size={13} /> : <LayoutGrid size={13} />} B2
          </button>
        </div>

        <button className="ai-mini-trigger" onClick={onOpenAI} title="Open 500MB AI">
          <Sparkles size={15} /> AI
        </button>
      </div>

      {/* 3D STACKED OR B2 SPLIT CONTAINER */}
      <div className={`cards-stage mode-${viewMode.toLowerCase()}`}>
        {/* CYAN CARD: SURU (Notes + Tasks + Nursing Portion) */}
        <div
          className={`square-card cyan-card ${
            viewMode === 'A' ? 'is-front' : viewMode === 'B1' ? 'is-back' : 'is-grid'
          }`}
          onClick={() => handleCardInteraction('suru')}
        >
          <div className="card-top-row">
            <Heart className="card-heart-icon" size={24} fill="#e11d48" color="#e11d48" />
            <span className="card-brand-title">Suru</span>
          </div>

          {viewMode !== 'B2' ? (
            <div className="card-handwritten-body">
              <p className="card-day-label">{suruSummary.dayLabel}</p>
              <p className="card-note-preview">{suruSummary.previewText}</p>
              <div className="card-sub-chips">
                <span>Notes: {suruSummary.notesCount}</span>
                <span>Tasks: {suruSummary.pendingTasks}</span>
              </div>
            </div>
          ) : (
            <div className="card-b2-minimal">
              <span className="b2-label">SURU · NOTES & STUDY</span>
            </div>
          )}
        </div>

        {/* RED CARD: GYM (PRs + Progress Line Graph) */}
        <div
          className={`square-card red-card ${
            viewMode === 'B1' ? 'is-front' : viewMode === 'A' ? 'is-back' : 'is-grid'
          }`}
          onClick={() => handleCardInteraction('gym')}
        >
          <div className="card-top-row">
            <div className="gym-avatar-badge">
              <Dumbbell size={18} color="#fff" />
            </div>
            <span className="card-brand-title">GYM</span>
          </div>

          {viewMode !== 'B2' ? (
            <div className="card-handwritten-body">
              <p className="card-day-label">{gymSummary.dayLabel}</p>
              <p className="card-note-preview">{gymSummary.previewText}</p>
              <div className="card-sub-chips">
                <span>Chest: {gymSummary.chestPR}</span>
                <span>Back: {gymSummary.backPR}</span>
              </div>
            </div>
          ) : (
            <div className="card-b2-minimal">
              <span className="b2-label">GYM · PR & PROGRESS</span>
            </div>
          )}
        </div>
      </div>

      <p className="gesture-hint">
        Swipe Left/Right for <strong>A / B1</strong> · Swipe Down for <strong>B2</strong> · Tap front square for <strong>Full View</strong>
      </p>
    </div>
  );
}
