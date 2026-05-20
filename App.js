import React, { useState } from "react";
import { ContentTypeSelector } from "./components/ContentTypeSelector";
import { ToneSelector } from "./components/ToneSelector";
import { LengthSelector } from "./components/LengthSelector";
import { TopicInput } from "./components/TopicInput";
import { GenerateButton } from "./components/GenerateButton";
import { OutputPanel } from "./components/OutputPanel";
import { useContentGenerator } from "./hooks/useContentGenerator";
import "./App.css";

export default function App() {
  const [contentType, setContentType] = useState("Blog Post");
  const [tone, setTone]               = useState("Professional");
  const [length, setLength]           = useState("Medium");
  const [topic, setTopic]             = useState("");
  const [instructions, setInstructions] = useState("");

  const { output, isStreaming, error, generate, stop, clear } =
    useContentGenerator();

  const handleGenerate = () => {
    generate({ contentType, tone, length, topic, instructions });
  };

  const handleRegenerate = () => {
    clear();
    generate({ contentType, tone, length, topic, instructions });
  };

  return (
    <div className="app">
      {/* Ambient background */}
      <div className="app-bg">
        <div className="bg-blob bg-blob--1" />
        <div className="bg-blob bg-blob--2" />
        <div className="bg-grid" />
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-mark">✦</span>
            <span className="brand-name">Inkforge</span>
            <span className="brand-tag">AI Content Generator</span>
          </div>
          <div className="header-badge">
            <span className="badge-dot" />
            Powered by Claude
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="app-main">
        {/* ── Left: Controls ── */}
        <aside className="controls-col">
          <div className="controls-scroll">
            <ContentTypeSelector value={contentType} onChange={setContentType} />
            <ToneSelector        value={tone}        onChange={setTone} />
            <LengthSelector      value={length}      onChange={setLength} />
            <TopicInput
              topic={topic}
              onTopicChange={setTopic}
              instructions={instructions}
              onInstructionsChange={setInstructions}
            />
            <div className="section">
              <GenerateButton
                onClick={handleGenerate}
                isStreaming={isStreaming}
                disabled={!topic.trim() || isStreaming}
              />
            </div>
          </div>
        </aside>

        {/* ── Right: Output ── */}
        <section className="output-col">
          <OutputPanel
            output={output}
            isStreaming={isStreaming}
            error={error}
            onStop={stop}
            onRegenerate={handleRegenerate}
          />
        </section>
      </main>
    </div>
  );
}
