import React from "react";
import "./GenerateButton.css";

export function GenerateButton({ onClick, isStreaming, disabled }) {
  return (
    <button
      className={`generate-btn ${isStreaming ? "generate-btn--loading" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isStreaming ? (
        <>
          <span className="gen-dots">
            <span /><span /><span />
          </span>
          Generating…
        </>
      ) : (
        <>
          <span className="gen-spark">✦</span>
          Generate Content
        </>
      )}
    </button>
  );
}
