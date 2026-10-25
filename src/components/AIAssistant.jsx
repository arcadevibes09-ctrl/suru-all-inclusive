// FILE: src/components/AIAssistant.jsx
import React, { useState } from 'react';
import { Sparkles, X, Send, Cpu } from 'lucide-react';
import { aiEngine } from '../ai/localAI';

export default function AIAssistant({
  isOpen,
  onClose,
  notes,
  setNotes,
  gymData,
  setGymData
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Suru Local AI (~520MB Qwen2.5-0.5B) ready. Ask me to summarize a study page, create a note with examples, or log a new Gym PR!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(aiEngine.statusText);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    // Quick local intent hooks so the 500MB model can also mutate app state directly
    const lower = userText.toLowerCase();
    if (lower.startsWith('add note:')) {
      const content = userText.slice(9).trim();
      setNotes((prev) => [
        {
          id: 'note_' + Date.now(),
          title: 'AI QUICK NOTE',
          subtitle: 'Generated via Suru AI',
          text: `## Quick Note\n\n${content}`,
          glossary: {},
          updatedAt: new Date().toLocaleDateString()
        },
        ...prev
      ]);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Added a new note to your Suru Notes library!' }
      ]);
      setLoading(false);
      return;
    }

    const contextSummary = `Current Gym PRs: ${gymData.prs
      .map((p) => `${p.name}=${p.value}`)
      .join(', ')}. Total Notes: ${notes.length}.`;

    const reply = await aiEngine.ask(
      userText,
      `You are Suru OS local 500MB AI. Context: ${contextSummary}. Keep answers concise and practical.`,
      (prog, txt) => setStatus(txt)
    );

    setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    setLoading(false);
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="ai-drawer-box" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#06b6d4" />
            <h3 style={{ margin: 0 }}>Suru Local AI (500MB)</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="ai-status-strip">
          <Cpu size={13} /> <span>{status}</span>
        </div>

        <div className="ai-chat-feed">
          {messages.map((m, idx) => (
            <div key={idx} className={`ai-msg ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="ai-msg assistant">Running local weights...</div>}
        </div>

        <form className="ai-input-row" onSubmit={handleSend}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI or type 'add note: ...'"
          />
          <button type="submit" disabled={loading}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
