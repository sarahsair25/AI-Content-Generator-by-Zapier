import React from "react";
import { TONES } from "../utils/constants";
import "./ToneSelector.css";

export function ToneSelector({ value, onChange }) {
  return (
    <div className="section">
      <label className="section-label">
        <span className="label-num">02</span> Tone
      </label>
      <div className="tone-pills">
        {TONES.map((t) => (
          <button
            key={t.id}
            className={`tone-pill ${value === t.id ? "tone-pill--active" : ""}`}
            style={{ "--pill-color": t.color }}
            onClick={() => onChange(t.id)}
          >
            <span
              className="tone-dot"
              style={{ background: t.color }}
            />
            {t.id}
          </button>
        ))}
      </div>
    </div>
  );
}
