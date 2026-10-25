// FILE: src/components/SquareStack.jsx
import React, { useState, useRef } from 'react';

export default function SquareStack({
  cards,
  deckTitle,
  onSelectItem,
  onDirectOpenCard,
  onLongPressStack,
  herOverlayNote
}) {
  const [frontIndex, setFrontIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState('3d');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const isScrolling = useRef(false);
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startLongPress = () => {
    clearLongPress();
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      if (!isScrolling.current && onLongPressStack) {
        longPressTriggered.current = true;
        if (navigator.vibrate) navigator.vibrate(25);
        onLongPressStack();
      }
    }, 480);
  };

  const handleTouchStart = (e) => {
    if (expandedCardId) return;
    isScrolling.current = false;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now()
    };
    startLongPress();
  };

  const handleTouchMove = (e) => {
    if (expandedCardId) return;
    const dy = Math.abs(e.targetTouches[0].clientY - touchStart.current.y);
    const dx = Math.abs(e.targetTouches[0].clientX - touchStart.current.x);

    if (dy > 10 || dx > 10) {
      isScrolling.current = true;
      clearLongPress();
    }
  };

  const handleTouchEnd = (e) => {
    clearLongPress();
    if (expandedCardId || longPressTriggered.current) return;

    const dx = touchStart.current.x - e.changedTouches[0].clientX;
    const dy = touchStart.current.y - e.changedTouches[0].clientY;
    const dt = Date.now() - touchStart.current.time;
    const isFastSwipe = dt < 350;

    if (layoutMode === '3d' && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx > 0) {
        setFrontIndex((prev) => (prev + 1) % cards.length);
      } else {
        setFrontIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
      return;
    }

    if (layoutMode === '3d' && dy < -65 && isFastSwipe) {
      setLayoutMode('b2');
      return;
    }

    const isAtTop = window.scrollY === 0;
    if (layoutMode === 'b2' && dy > 90 && isFastSwipe && isAtTop) {
      setLayoutMode('3d');
    }
  };

  const handleSquareClick = (e, card, index) => {
    e.stopPropagation();
    if (isScrolling.current || longPressTriggered.current) return;
    if (expandedCardId === card.id) return;

    if (layoutMode === '3d' && index !== frontIndex) {
      setFrontIndex(index);
      return;
    }

    if (card.directOpen && onDirectOpenCard) {
      onDirectOpenCard(card);
      return;
    }

    setExpandedCardId(card.id);
  };

  const getRelativePosition = (index) => {
    const diff = (index - frontIndex + cards.length) % cards.length;
    if (diff === 0) return 'pos-0';
    if (diff === 1) return 'pos-1';
    if (diff === 2) return 'pos-2';
    return 'pos-hidden';
  };

  const expandedCard = cards.find((c) => c.id === expandedCardId);

  return (
    <div
      className={`stack-viewport ${layoutMode === 'b2' ? 'is-b2-active' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => !expandedCardId && startLongPress()}
      onMouseUp={clearLongPress}
      onMouseLeave={clearLongPress}
      onClick={() => {
        if (expandedCardId && !isScrolling.current && !longPressTriggered.current) {
          setExpandedCardId(null);
        }
      }}
    >
      {deckTitle && !expandedCard && (
        <p style={{ color: '#444', fontSize: '0.72rem', letterSpacing: '2px', marginBottom: '22px' }}>
          {deckTitle}
        </p>
      )}

      {expandedCard ? (
        <div
          className="stack-Deck expanded-view"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="stack-square is-expanded">
            <div className="sq-header">
              <div className="sq-title-wrap">
                {expandedCard.icon}
                <h2 className="sq-title">{expandedCard.title}</h2>
              </div>
            </div>

            <div className="expanded-list-container" onTouchStart={(e) => e.stopPropagation()}>
              {expandedCard.items?.map((item) => (
                <div
                  key={item.id}
                  className="expanded-list-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(expandedCard, item);
                  }}
                >
                  <div className="expanded-item-title">{item.title}</div>
                  {item.subtitle && (
                    <div className="expanded-item-sub">{item.subtitle}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={`stack-Deck ${layoutMode === 'b2' ? 'b2-grid' : 'stacked-3d'}`}>
          {cards.map((card, index) => {
            const isFront = index === frontIndex || layoutMode === 'b2';
            return (
              <div
                key={card.id}
                className={`stack-square ${card.theme} ${getRelativePosition(index)}`}
                onClick={(e) => handleSquareClick(e, card, index)}
              >
                <div className="sq-header">
                  <div className="sq-title-wrap">
                    {card.icon}
                    <h2 className="sq-title">{card.title}</h2>
                  </div>
                  <span style={{ fontSize: '0.68rem', opacity: 0.4 }}>
                    {card.badge}
                  </span>
                </div>

                <div className="sq-hand-body">
                  <p className="sq-day">{card.subtitle}</p>
                  <p className="sq-desc">{card.description}</p>

                  {/* Blossom's Inline Flow Note when Long-Pressed on Home */}
                                    {isFront && herOverlayNote && (
                    <p className="her-whisper-line" style={{ marginTop: '12px', marginBottom: 0 }}>
                      {herOverlayNote.text}
                    </p>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
