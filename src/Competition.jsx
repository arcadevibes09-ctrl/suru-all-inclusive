import React, { useState } from 'react';
import './styles/Competition.css';

export default function Competition({ topicTitle, modeData, modeName, onClose, onUpdateScore }) {
  const [phase, setPhase] = useState('mcq'); 
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [bossRevealed, setBossRevealed] = useState(false);
  const [voted, setVoted] = useState(false);

  const safeModeData = modeData || {};
  const quiz = safeModeData.quiz || [];
  const boss = safeModeData.bossBattle || { scenario: "Missing data", opponentAnswer: "Missing data" };

  const handleMCQ = (selectedIndex) => {
    if (selectedIndex === quiz[currentQ].correct) {
      onUpdateScore('user', 1);
    } else {
      onUpdateScore('user', -1);
      onUpdateScore('opponent', 1);
    }
    if (currentQ + 1 < quiz.length) setCurrentQ(currentQ + 1);
    else setPhase('boss');
  };

  const handleVote = (winner) => {
    if (voted) return;
    if (winner === 'user') onUpdateScore('user', 5);
    if (winner === 'opponent') onUpdateScore('opponent', 5);
    setVoted(true);
    setTimeout(() => setPhase('results'), 1000);
  };

  // Sleek SVG Close Icon
  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <div className="competition-arena">
      <div className="comp-header">
        <h2>{topicTitle} <span style={{fontSize: '0.8em', color: 'var(--text-muted)'}}></span></h2>
        <button className="comp-close" onClick={onClose}><CloseIcon /></button>
      </div>

      {phase === 'mcq' && quiz.length > 0 && (
        <div className="mcq-section">
          <p style={{color: 'var(--text-muted)', fontSize: '0.8em', letterSpacing: '1px'}}>QUESTION {currentQ + 1} / {quiz.length}</p>
          <p className="question-text">{quiz[currentQ].q}</p>
          <div className="options-grid">
            {quiz[currentQ].options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => handleMCQ(i)}>{opt}</button>
            ))}
          </div>
        </div>
      )}

      {phase === 'mcq' && quiz.length === 0 && (
        <div className="mcq-section">
          <p style={{color: 'var(--text-muted)'}}>No questions found. Proceeding to simulation.</p>
          <button className="reveal-btn" onClick={() => setPhase('boss')}>Continue</button>
        </div>
      )}

      {phase === 'boss' && (
        <div className="boss-section">
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '1em', letterSpacing: '1px' }}>CLINICAL SIMULATION</h3>
          <p className="scenario-text">{boss.scenario}</p>
          
          <textarea 
            className="boss-input" 
            placeholder="Document your intervention..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={bossRevealed}
          />

          {!bossRevealed ? (
            <button className="reveal-btn" onClick={() => setBossRevealed(true)}>Execute & Compare</button>
          ) : (
            <div className="judgment-zone">
              <div className="opponent-answer">
                <h4>System Protocol:</h4>
                <p>{boss.opponentAnswer}</p>
              </div>
              
              <h4>Did your intervention match the protocol?</h4>
              <div className="vote-buttons">
                <button className="vote-btn user-win" onClick={() => handleVote('user')}>Valid</button>
                <button className="vote-btn opp-win" onClick={() => handleVote('opponent')}>Critical Failure</button>
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'results' && (
        <div className="results-section">
          <h3 style={{color: 'var(--accent-calm)', fontWeight: 'normal'}}>Simulation Complete.</h3>
          <p style={{color: 'var(--text-muted)'}}>Metrics have been updated in the global array.</p>
          <button className="reveal-btn" style={{marginTop: '20px'}} onClick={onClose}>Return</button>
        </div>
      )}
    </div>
  );
}