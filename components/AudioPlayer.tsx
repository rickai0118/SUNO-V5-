
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, X, Music, Activity, Monitor, Volume2, ChevronDown } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { Language } from '../types';

interface AudioPlayerProps {
  src: string;
  fileName: string;
  onRemove: () => void;
  statusLabel: string; 
  language?: Language;
}

type VisualizerMode = 'nebula' | 'grid' | 'tunnel' | 'matrix' | 'mist' | 'retro' | 'scope' | 'hex' | 'fire' | 'dna' | 'radar' | 'seismic';

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, fileName, onRemove, statusLabel, language = 'en' as Language }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>();
  const mistParticlesRef = useRef<any[]>([]); 

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visualMode, setVisualMode] = useState<VisualizerMode>('nebula');
  const t = getTranslation(language);

  // Initialize Audio Context & Analyser
  useEffect(() => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048; 
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        try {
            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
        } catch (e) {
            // Already connected
        }
    }

    return () => { }
  }, [src]);

  // Handle Play/Pause
  useEffect(() => {
      if(isPlaying && audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
      }
      
      if (isPlaying) {
          startVisualizer();
      } else {
          cancelAnimationFrame(animationRef.current!);
      }
  }, [isPlaying, visualMode]);

  const startVisualizer = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const render = () => {
          animationRef.current = requestAnimationFrame(render);
          
          if (visualMode === 'scope' || visualMode === 'seismic') {
              analyserRef.current!.getByteTimeDomainData(dataArray);
          } else {
              analyserRef.current!.getByteFrequencyData(dataArray);
          }

          ctx.fillStyle = '#09090b';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          switch (visualMode) {
              case 'nebula': drawNebula(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'grid': drawGrid(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'tunnel': drawTunnel(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'matrix': drawMatrix(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'mist': drawMist(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'retro': drawRetro(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'scope': drawScope(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'hex': drawHex(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'fire': drawFire(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'dna': drawDNA(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'radar': drawRadar(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
              case 'seismic': drawSeismic(ctx, canvas.width, canvas.height, dataArray, bufferLength); break;
          }
      };
      render();
  }

  // --- Visualizer Engines ---
  const getAverageVolume = (data: Uint8Array, start: number, end: number) => {
      let sum = 0;
      for(let i = start; i < end; i++) {
          sum += data[i];
      }
      return sum / (end - start);
  }

  // ... (Keeping all existing draw functions: Nebula, Grid, Tunnel, etc.)
  
  const drawNebula = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const bass = getAverageVolume(data, 1, 6); 
      const scale = 1 + (bass / 255) * 0.8;
      const gradient = ctx.createRadialGradient(cx, cy, 10 * scale, cx, cy, 150 * scale);
      gradient.addColorStop(0, `rgba(245, 158, 11, ${0.8 + (bass/255)*0.2})`);
      gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();
      const step = Math.floor(len / 50);
      for(let i=0; i<50; i++) {
          const index = i * step;
          const val = data[index];
          const angle = (i / 50) * Math.PI * 2 + (Date.now() * 0.0005);
          const r = 50 + (val * 0.8);
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          ctx.fillStyle = `rgba(34, 211, 238, ${val/255})`;
          ctx.beginPath();
          ctx.arc(px, py, 2 + (val/255)*3, 0, Math.PI * 2);
          ctx.fill();
      }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
    const bass = getAverageVolume(data, 1, 10);
    const shake = (bass / 255) * 5;
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
    ctx.lineWidth = 1;
    const time = Date.now() * 0.05;
    for(let x = 0; x <= w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(w/2 + (Math.random()-0.5)*shake, h/2 + (Math.random()-0.5)*shake);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for(let y = 0; y < h/2; y+=20) {
        const offset = (y + time + (bass/10)) % (h/2);
        const yPos = (h/2) + offset;
        const widthAtY = w * (offset / (h/2));
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(w, yPos);
        ctx.strokeStyle = `rgba(6, 182, 212, ${(offset/(h/2)) * 0.5})`;
        ctx.stroke();
    }
    const barCount = 32;
    const barWidth = w / barCount;
    const step = Math.floor(len / 2 / barCount);
    for(let i=0; i<barCount; i++) {
        const val = data[i * step];
        const height = (val / 255) * (h/2.5);
        ctx.fillStyle = `rgba(245, 158, 11, 0.9)`;
        ctx.fillRect(i * barWidth, (h/2) - height, barWidth - 2, height);
        ctx.fillStyle = `rgba(245, 158, 11, 0.2)`;
        ctx.fillRect(i * barWidth, (h/2), barWidth - 2, height * 0.5);
    }
  };

  const drawTunnel = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const cx = w / 2;
      const cy = h / 2;
      ctx.lineWidth = 2;
      const bass = getAverageVolume(data, 0, 5);
      for (let i = 0; i < 20; i++) {
          const val = data[i * 5];
          const offset = (Date.now() * 0.1 + i * 20) % 360;
          const radius = (i * 15) + (val * 0.1) + ((bass/255) * 20); 
          ctx.strokeStyle = `hsl(${offset}, 80%, 50%)`;
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(0, radius), 0, Math.PI * 2);
          ctx.stroke();
      }
  };

  const drawMatrix = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const fontSize = 20; 
      ctx.font = `bold ${fontSize}px monospace`;
      const colWidth = fontSize + 4;
      const cols = Math.floor(w / colWidth);
      const step = Math.floor(len / cols);
      for (let i = 0; i < cols; i++) {
          const val = data[i * step];
          if (val > 20) {
            const height = (val / 255) * h;
            const yPos = h - height + (Math.random() * 20);
            ctx.fillStyle = '#4ade80';
            const char = String.fromCharCode(0x30A0 + (Math.random() * 96));
            ctx.fillText(char, i * colWidth, yPos);
            ctx.fillStyle = 'rgba(22, 163, 74, 0.3)';
            ctx.fillRect(i * colWidth, h - height, fontSize - 4, height);
          }
      }
  };

  const drawMist = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      if (mistParticlesRef.current.length < 100) {
          const needed = 100 - mistParticlesRef.current.length;
          for (let i = 0; i < needed; i++) {
              mistParticlesRef.current.push({
                  x: Math.random() * w,
                  y: Math.random() * h,
                  vx: (Math.random() - 0.5) * 0.5,
                  vy: (Math.random() - 0.5) * 0.5,
                  r: 40 + Math.random() * 60
              });
          }
      }
      const bass = getAverageVolume(data, 1, 8); 
      const treble = getAverageVolume(data, 100, 300);
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)'; 
      ctx.fillRect(0, 0, w, h);
      mistParticlesRef.current.forEach(p => {
          p.x += p.vx + (bass/255)*0.8;
          p.y += p.vy;
          if (p.x < -150) p.x = w + 150;
          if (p.x > w + 150) p.x = -150;
          if (p.y < -150) p.y = h + 150;
          if (p.y > h + 150) p.y = -150;
          const pulse = (bass / 255) * 60;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r + pulse);
          g.addColorStop(0, `rgba(139, 92, 246, 0.4)`); 
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2);
          ctx.fill();
      });
      if (treble > 60) {
          const intensity = (treble - 60) / 100;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + intensity})`;
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#22d3ee';
          ctx.lineWidth = 2 + intensity * 3;
          ctx.beginPath();
          const p1 = mistParticlesRef.current[Math.floor(Math.random() * mistParticlesRef.current.length)];
          const p2 = mistParticlesRef.current[Math.floor(Math.random() * mistParticlesRef.current.length)];
          ctx.moveTo(p1.x, p1.y);
          const segments = 8;
          let cx = p1.x;
          let cy = p1.y;
          const dx = (p2.x - p1.x) / segments;
          const dy = (p2.y - p1.y) / segments;
          for(let i=1; i<segments; i++) {
              cx += dx;
              cy += dy;
              const jitter = (Math.random() - 0.5) * 100 * intensity;
              ctx.lineTo(cx + jitter, cy + jitter);
          }
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.shadowBlur = 0;
      }
  };

  const drawRetro = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const bass = getAverageVolume(data, 1, 10);
      const sunY = h * 0.6;
      const sunR = 80 + (bass / 255) * 20;
      const g = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
      g.addColorStop(0, '#fde047');
      g.addColorStop(0.5, '#f97316');
      g.addColorStop(1, '#ec4899');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(w/2, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();
      const time = Date.now() * 0.02;
      ctx.fillStyle = '#09090b'; 
      for(let i=0; i<8; i++) {
          const bandH = 4 + i * 2;
          const y = (sunY + sunR*0.2) + ((time + i * 20) % (sunR * 1.5));
          if(y < sunY + sunR) {
              ctx.fillRect(w/2 - sunR, y, sunR*2, bandH);
          }
      }
      const horizonY = sunY + sunR * 0.5;
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, horizonY, w, h - horizonY); 
      ctx.strokeStyle = '#a855f7'; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      const speed = Date.now() * 0.1 + (bass * 0.1);
      for(let i=0; i<10; i++) {
           const p = (i * 30 + speed) % 200;
           const y = horizonY + (p*p)/100;
           if(y < h) {
               ctx.moveTo(0, y);
               ctx.lineTo(w, y);
           }
      }
      for(let i=-10; i<=10; i++) {
           ctx.moveTo(w/2 + i * 20, horizonY);
           ctx.lineTo(w/2 + i * 150, h);
      }
      ctx.stroke();
  };

  const drawScope = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10b981';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();
      const sliceWidth = w / len;
      let x = 0;
      for(let i = 0; i < len; i++) {
          const v = data[i] / 128.0;
          const y = (v * h/2);
          if(i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
      }
      ctx.lineTo(w, h/2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<w; i+=50) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
      for(let i=0; i<h; i+=50) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
      ctx.stroke();
  };

  const drawHex = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const cx = w/2;
      const cy = h/2;
      const bass = getAverageVolume(data, 1, 6);
      const r = 50 + (bass / 255) * 50;
      const time = Date.now() * 0.001;
      ctx.strokeStyle = '#06b6d4'; 
      ctx.lineWidth = 2;
      const layers = 5;
      for(let j=0; j<layers; j++) {
          const layerR = r * (0.5 + j * 0.3);
          ctx.beginPath();
          for(let i=0; i<=6; i++) {
              const angle = (i / 6) * Math.PI * 2 + time * (j % 2 === 0 ? 1 : -1);
              const x = cx + Math.cos(angle) * layerR;
              const y = cy + Math.sin(angle) * layerR;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
      }
      ctx.fillStyle = `rgba(6, 182, 212, ${bass/255})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.3, 0, Math.PI*2);
      ctx.fill();
  };

  const drawFire = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const barCount = 64;
      const barWidth = w / barCount;
      const step = Math.floor(len / 2 / barCount);
      for(let i=0; i<barCount; i++) {
          const val = data[i * step];
          const height = (val / 255) * h;
          const g = ctx.createLinearGradient(0, h - height, 0, h);
          g.addColorStop(0, '#ef4444'); 
          g.addColorStop(0.5, '#f97316'); 
          g.addColorStop(1, '#fde047'); 
          ctx.fillStyle = g;
          ctx.fillRect(i * barWidth, h - height, barWidth + 1, height);
          if (val > 150 && Math.random() > 0.8) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(i * barWidth + Math.random()*barWidth, h - height - Math.random()*20, 2, 2);
          }
      }
  };

  const drawDNA = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const bass = getAverageVolume(data, 1, 6);
      const time = Date.now() * 0.002;
      const particles = 40;
      const spacing = h / particles;
      
      ctx.lineWidth = 2;
      
      for(let i=0; i<particles; i++) {
          const y = i * spacing + (time * 20 % spacing);
          const offset = Math.sin(i * 0.3 + time) * (50 + bass * 0.5);
          
          const x1 = w/2 + offset;
          const x2 = w/2 - offset;
          
          // Strand 1
          ctx.fillStyle = '#6366f1'; // Indigo
          ctx.beginPath();
          ctx.arc(x1, y, 4, 0, Math.PI*2);
          ctx.fill();
          
          // Strand 2
          ctx.fillStyle = '#a855f7'; // Purple
          ctx.beginPath();
          ctx.arc(x2, y, 4, 0, Math.PI*2);
          ctx.fill();
          
          // Connection
          if (i % 3 === 0) {
              ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
              ctx.beginPath();
              ctx.moveTo(x1, y);
              ctx.lineTo(x2, y);
              ctx.stroke();
          }
      }
  };

  const drawRadar = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const cx = w/2;
      const cy = h/2;
      const radius = Math.min(w, h) * 0.45;
      const time = Date.now() * 0.002;
      
      // Radar rings
      ctx.strokeStyle = '#15803d'; // Green
      ctx.lineWidth = 1;
      [0.3, 0.6, 1].forEach(r => {
          ctx.beginPath();
          ctx.arc(cx, cy, radius * r, 0, Math.PI*2);
          ctx.stroke();
      });
      
      // Sweep
      const sweepAngle = time % (Math.PI*2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, sweepAngle, sweepAngle + 0.2);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fill();
      
      // Blips from audio
      const step = Math.floor(len / 10);
      for(let i=0; i<10; i++) {
          const val = data[i*step];
          if(val > 100) {
              const angle = i * (Math.PI*2/10) + time*0.5;
              const dist = (val/255) * radius;
              const bx = cx + Math.cos(angle) * dist;
              const by = cy + Math.sin(angle) * dist;
              ctx.fillStyle = '#4ade80';
              ctx.fillRect(bx, by, 4, 4);
          }
      }
  };

  const drawSeismic = (ctx: CanvasRenderingContext2D, w: number, h: number, data: Uint8Array, len: number) => {
      const cx = w/2;
      const cy = h/2;
      const r = 100;
      
      ctx.strokeStyle = '#fbbf24'; // Amber
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for(let i=0; i<len; i+=5) {
          const angle = (i/len) * Math.PI * 2;
          const v = data[i] / 128.0;
          const currentR = r * v;
          const x = cx + Math.cos(angle) * currentR;
          const y = cy + Math.sin(angle) * currentR;
          
          if(i===0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Echo rings
      const bass = getAverageVolume(data, 1, 6);
      if(bass > 180) {
           ctx.strokeStyle = `rgba(251, 191, 36, ${(bass-180)/100})`;
           ctx.beginPath();
           ctx.arc(cx, cy, r*1.5, 0, Math.PI*2);
           ctx.stroke();
      }
  };

  // --- Player Logic ---

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if(audioRef.current) {
        audioRef.current.currentTime = 0;
    }
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };
  
  const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      cancelAnimationFrame(animationRef.current!);
  }

  const formatTime = (seconds: number) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-zinc-950/80 border border-zinc-800/50 rounded-lg p-0 flex flex-col relative overflow-hidden">
      <audio
        ref={audioRef}
        src={src}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      {/* 1. VISUALIZER SCREEN (Takes remaining space, 3:4 aspect ratio preference handled via sizing) */}
      <div className="relative flex-1 bg-black overflow-hidden group shadow-inner min-h-0 w-full flex items-center justify-center">
          {/* Visualizer Container - Enforce 3:4 or cover */}
          <div className="w-full h-full relative">
               <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={800}
                    className="w-full h-full object-cover opacity-90"
                />
               {/* Overlay Info */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
                     <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest bg-black/50 px-2 rounded">LIVE SIGNAL</span>
                     </div>
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] font-mono text-zinc-500">{visualMode.toUpperCase()}</span>
                         <span className="text-[9px] font-mono text-zinc-600">600x800 // 60FPS</span>
                     </div>
                </div>

                {/* Mode Selector */}
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="relative group/select">
                        <select 
                            value={visualMode}
                            onChange={(e) => setVisualMode(e.target.value as VisualizerMode)}
                            className="appearance-none bg-black/60 backdrop-blur border border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase rounded pl-3 pr-8 py-1.5 outline-none focus:border-amber-500 hover:bg-black/80 cursor-pointer transition-colors font-mono shadow-xl"
                        >
                            {(Object.keys(t.visModes) as VisualizerMode[]).map((mode) => (
                                <option key={mode} value={mode}>{t.visModes[mode]}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-2 text-zinc-500 pointer-events-none"/>
                    </div>
                </div>
          </div>
      </div>

      {/* 2. Controls Footer (Fixed height) */}
      <div className="shrink-0 bg-[#0c0c0e] border-t border-zinc-800 p-4 flex flex-col gap-3 relative z-30">
          
          {/* Timeline */}
          <div className="flex flex-col gap-1.5">
              <div className="h-1.5 bg-zinc-800 rounded-full relative group cursor-pointer">
                    <div className="absolute inset-0 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{width: `${(progress/duration)*100}%`}}></div>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
              </div>
          </div>

          {/* Buttons & Info - GRID LAYOUT */}
          <div className="grid grid-cols-3 items-center">
               
               {/* Left: Track Info */}
               <div className="flex items-center gap-3 overflow-hidden justify-self-start w-full pr-2">
                   <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
                        <Music size={16} className="text-amber-700" />
                   </div>
                   <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Now Playing</span>
                        <span className="text-xs font-bold text-zinc-300 truncate w-full block" title={fileName}>{fileName}</span>
                   </div>
               </div>

               {/* Center: Play Button */}
               <div className="flex justify-center">
                   <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-zinc-100 hover:bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95">
                       {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-1"/>}
                   </button>
               </div>

               {/* Right: Close / Status */}
               <div className="flex items-center gap-3 justify-self-end">
                   <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                        <Activity size={10} className={isPlaying ? "text-green-500 animate-pulse" : "text-zinc-600"} />
                        <span className="text-[9px] font-mono text-zinc-500">{statusLabel}</span>
                   </div>
                   <button onClick={onRemove} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-red-400 transition-colors">
                        <X size={16} />
                   </button>
               </div>
          </div>
      </div>
      
    </div>
  );
};

export default AudioPlayer;
