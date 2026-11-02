"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  className?: string;
  variant?: "bars" | "wave" | "circular";
  color?: string;
}

export function AudioVisualizer({
  audioElement,
  isPlaying,
  className = "w-full h-24",
  variant = "bars",
  color = "#57f1ef",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement) return;

    const setupAudioContext = () => {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass =
            window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!AudioContextClass) return;

          const ctx = new AudioContextClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.85;

          try {
            // Only connect if not already connected
            const source = ctx.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceRef.current = source;
          } catch {
            // Already connected or cross-origin restriction
          }

          audioContextRef.current = ctx;
          analyserRef.current = analyser;
        }

        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume();
        }
      } catch (err) {
        console.warn("Web Audio API initialization notice:", err);
      }
    };

    if (isPlaying) {
      setupAudioContext();
    }
  }, [audioElement, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const analyser = analyserRef.current;
      const bufferLength = analyser ? analyser.frequencyBinCount : 32;
      const dataArray = new Uint8Array(bufferLength);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else if (isPlaying) {
        // Fallback smooth harmonic wave if CORS restricts media element source
        const time = Date.now() / 150;
        for (let i = 0; i < bufferLength; i++) {
          const val = Math.sin(time + i * 0.4) * 0.5 + 0.5;
          dataArray[i] = Math.floor(val * 160 + 40);
        }
      } else {
        // Idling baseline
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 12;
        }
      }

      if (variant === "wave") {
        ctx.beginPath();
        ctx.lineWidth = 2 * dpr;
        ctx.strokeStyle = color;
        ctx.shadowBlur = 10 * dpr;
        ctx.shadowColor = color;

        const sliceWidth = width / (bufferLength - 1);
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 255.0;
          const y = height / 2 + (v - 0.5) * (height * 0.8);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Bars variant (sleek modern obsidian/cyan spectrum)
        const barCount = 28;
        const totalSpacing = width * 0.015;
        const barWidth = (width - totalSpacing * (barCount - 1)) / barCount;

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * (bufferLength * 0.8));
          const value = dataArray[dataIndex] || 10;
          const normalized = value / 255;
          const barHeight = Math.max(4 * dpr, normalized * (height * 0.85));

          const x = i * (barWidth + totalSpacing);
          const y = height / 2 - barHeight / 2;

          // Glowing gradient
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, color);
          gradient.addColorStop(0.5, color + "dd");
          gradient.addColorStop(1, "rgba(87, 241, 239, 0.15)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          const radius = Math.min(barWidth / 2, 3 * dpr);
          ctx.roundRect(x, y, barWidth, barHeight, radius);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, variant, color]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
