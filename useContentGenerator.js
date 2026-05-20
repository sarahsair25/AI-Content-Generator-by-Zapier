import { useState, useRef, useCallback } from "react";

/**
 * useContentGenerator
 * Manages streaming generation state and the fetch/abort lifecycle.
 */
export function useContentGenerator() {
  const [output, setOutput]       = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError]         = useState(null);
  const abortRef                  = useRef(null);

  const generate = useCallback(async (params) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setOutput("");
    setError(null);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server error");
      }

      // Read the SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete last line

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") { setIsStreaming(false); return; }

          try {
            const text = JSON.parse(payload);
            if (typeof text === "string") {
              setOutput((prev) => prev + text);
            } else if (text?.error) {
              throw new Error(text.error);
            }
          } catch (parseErr) {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return; // user stopped — not an error
      setError(err.message);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
  }, []);

  const clear = useCallback(() => {
    setOutput("");
    setError(null);
  }, []);

  return { output, isStreaming, error, generate, stop, clear };
}
