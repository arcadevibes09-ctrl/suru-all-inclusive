// FILE: src/CustomSelect.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ value, onChange, options, className = 'uni-btn subtle' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button
        type="button"
        className={`${className} custom-select-trigger`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOption?.label || 'Font'}</span>
      </button>

      {isOpen && (
        <div className="custom-select-menu">
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`custom-select-option ${opt.value === value ? 'active' : ''}`}
              style={{ fontFamily: opt.value }}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
