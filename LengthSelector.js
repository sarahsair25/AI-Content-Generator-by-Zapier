import React from "react";
import { LENGTHS } from "../utils/constants";
import "./LengthSelector.css";

export function LengthSelector({ value, onChange }) {
  return (
    <div className="section">
      <label className="section-label">
        <span className="label-num">03</span> Length
      </label>
      <div className="length-options">
        {LENGTHS.map((l) => (
          <button
            key={l.id}
            className={`length-btn ${value === l.id ? "length-btn--active" : ""}`}
            onClick={() => onChange(l.id)}
          >
            <span className="length-bars">
              {[1, 2, 3].map((b) => (
                <span
                  key={b}
                  className={`length-bar ${b <= l.bars ? "length-bar--filled" : ""}`}
                />
              ))}
            </span>
            <span className="length-name">{l.id}</span>
            <span className="length-words">{l.words}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
