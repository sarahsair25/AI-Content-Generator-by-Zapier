import React from "react";
import "./TopicInput.css";

export function TopicInput({ topic, onTopicChange, instructions, onInstructionsChange }) {
  return (
    <>
      <div className="section">
        <label className="section-label">
          <span className="label-num">04</span> Topic / Subject
        </label>
        <input
          className="topic-input"
          type="text"
          placeholder="e.g. The future of remote work in 2030"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          maxLength={200}
        />
        <span className="char-count">{topic.length}/200</span>
      </div>

      <div className="section">
        <label className="section-label">
          <span className="label-num">05</span> Additional Instructions
          <span className="label-opt">optional</span>
        </label>
        <textarea
          className="instructions-textarea"
          placeholder="e.g. Include statistics, target B2B SaaS companies, end with a CTA..."
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>
    </>
  );
}
