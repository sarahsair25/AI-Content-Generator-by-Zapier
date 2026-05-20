import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./OutputPanel.css";

const COPY_TIMEOUT = 2000;

export function OutputPanel({ output, isStreaming, error, onStop, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("rendered"); // "rendered" | "raw"
  const bottomRef = useRef(null);

  // Auto-scroll while streaming
  useEffect(() => {
    if (isStreaming && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [output, isStreaming]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_TIMEOUT);
  };

  const wordCount = output
    ? output.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const isEmpty = !output && !isStreaming && !error;

  return (
    <div className="output-panel">
      {/* Header bar */}
      <div className="output-header">
        <div className="output-meta">
          <span className="output-title">
            {isStreaming ? (
              <><span className="writing-dot" /> Writing…</>
            ) : output ? (
              "Output"
            ) : (
              "Preview"
            )}
          </span>
          {output && (
            <span className="output-wordcount">{wordCount} words</span>
          )}
        </div>

        <div className="output-controls">
          {output && (
            <div className="view-toggle">
              <button
                className={viewMode === "rendered" ? "vtoggle--active" : ""}
                onClick={() => setViewMode("rendered")}
              >MD</button>
              <button
                className={viewMode === "raw" ? "vtoggle--active" : ""}
                onClick={() => setViewMode("raw")}
              >Raw</button>
            </div>
          )}

          {isStreaming && (
            <button className="ctrl-btn ctrl-btn--stop" onClick={onStop}>
              ⬛ Stop
            </button>
          )}
          {output && !isStreaming && (
            <>
              <button className="ctrl-btn" onClick={onRegenerate}>
                ↻ Regenerate
              </button>
              <button
                className={`ctrl-btn ctrl-btn--copy ${copied ? "ctrl-btn--copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied!" : "⎘ Copy"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="output-body">
        {isEmpty && (
          <div className="output-empty">
            <div className="empty-glyph">✦</div>
            <p>Your generated content will appear here.</p>
            <p className="empty-sub">Fill in the form and hit Generate.</p>
          </div>
        )}

        {error && (
          <div className="output-error">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {(output || isStreaming) && !error && (
          <>
            {viewMode === "rendered" ? (
              <div className="output-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {output}
                </ReactMarkdown>
                {isStreaming && <span className="cursor-blink" />}
              </div>
            ) : (
              <pre className="output-raw">{output}</pre>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
