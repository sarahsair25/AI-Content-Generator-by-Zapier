import React from "react";
import { CONTENT_TYPES } from "../utils/constants";
import "./ContentTypeSelector.css";

export function ContentTypeSelector({ value, onChange }) {
  return (
    <div className="section">
      <label className="section-label">
        <span className="label-num">01</span> Content Type
      </label>
      <div className="content-type-grid">
        {CONTENT_TYPES.map((ct) => (
          <button
            key={ct.id}
            className={`ct-card ${value === ct.id ? "ct-card--active" : ""}`}
            onClick={() => onChange(ct.id)}
          >
            <span className="ct-icon">{ct.icon}</span>
            <span className="ct-name">{ct.id}</span>
            <span className="ct-desc">{ct.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
