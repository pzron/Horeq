import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, RefreshCw, Shield, Terminal, Skull, Bug, Zap, AlertTriangle } from "lucide-react";

const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const hackerMessages = [
  "INITIATING BREACH PROTOCOL...",
  "ACCESSING MAINFRAME...",
  "BYPASSING FIREWALL...",
  "DECRYPTING DATA STREAMS...",
  "ANALYZING SECURITY LAYERS...",
  "ERROR: PAGE_NOT_FOUND",
  "INTRUSION DETECTED",
  "SYSTEM ALERT TRIGGERED",
  "SCANNING FOR VULNERABILITIES...",
  "TRACE ROUTE FAILED",
];

const warningMessages = [
  "UNAUTHORIZED ACCESS ATTEMPT LOGGED",
  "IP ADDRESS HAS BEEN RECORDED",
  "SECURITY PROTOCOLS ACTIVATED",
  "CYBER DEFENSE SYSTEMS ONLINE",
  "ANOMALY DETECTED IN SECTOR 404",
];

function MatrixRain() {
  const [columns, setColumns] = useState<{ chars: string[]; speed: number; x: number }[]>([]);

  useEffect(() => {
    const cols = [];
    const numColumns = Math.floor(window.innerWidth / 20);
    for (let i = 0; i < numColumns; i++) {
      const colChars = [];
      const length = Math.floor(Math.random() * 15) + 5;
      for (let j = 0; j < length; j++) {
        colChars.push(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
      }
      cols.push({
        chars: colChars,
        speed: Math.random() * 2 + 1,
        x: i * 20,
      });
    }
    setColumns(cols);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute text-green-500 font-mono text-sm animate-matrix-fall"
          style={{
            left: col.x,
            animationDuration: `${col.speed + 3}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {col.chars.map((char, j) => (
            <div
              key={j}
              className="opacity-80"
              style={{ opacity: 1 - j * 0.06 }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      let iterations = 0;
      const maxIterations = 10;
      
      const scramble = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (iterations > maxIterations - 3 && i < iterations - (maxIterations - 3)) {
                return text[i];
              }
              return Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char;
            })
            .join("")
        );
        iterations++;
        if (iterations >= maxIterations) {
          clearInterval(scramble);
          setDisplayText(text);
          setIsGlitching(false);
        }
      }, 50);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return (
    <span
      className={`${className} ${isGlitching ? "animate-pulse" : ""}`}
      style={{
        textShadow: isGlitching
          ? "2px 0 #ff0000, -2px 0 #00ff00, 0 0 10px rgba(0,255,0,0.5)"
          : "0 0 20px rgba(0,255,0,0.3)",
      }}
    >
      {displayText}
    </span>
  );
}

function TerminalWindow() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= hackerMessages.length) {
      setTimeout(() => {
        setLines([]);
        setCurrentLineIndex(0);
      }, 2000);
      return;
    }

    const timer = setTimeout(() => {
      setLines((prev) => [...prev, `> ${hackerMessages[currentLineIndex]}`]);
      setCurrentLineIndex((prev) => prev + 1);
    }, 800 + Math.random() * 500);

    return () => clearTimeout(timer);
  }, [currentLineIndex]);

  return (
    <div className="bg-black/80 border border-green-500/50 rounded-lg p-4 font-mono text-sm max-w-md w-full backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500/30">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-green-500/70 text-xs">terminal@horeq:~</span>
      </div>
      <div className="space-y-1 min-h-[200px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`text-green-400 ${i === lines.length - 1 ? "animate-pulse" : ""}`}
          >
            {line}
            {i === lines.length - 1 && (
              <span className="animate-blink ml-1">_</span>
            )}
          </div>
        ))}
        {lines.length === 0 && (
          <div className="text-green-400">
            <span className="animate-blink">_</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingIcons() {
  const icons = [Skull, Bug, Zap, AlertTriangle, Shield, Terminal];
  const [positions] = useState(() =>
    icons.map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }))
  );

  return (
    <>
      {icons.map((Icon, i) => (
        <div
          key={i}
          className="absolute text-green-500/20 animate-float pointer-events-none"
          style={{
            left: `${positions[i].x}%`,
            top: `${positions[i].y}%`,
            animationDelay: `${positions[i].delay}s`,
            animationDuration: `${positions[i].duration}s`,
          }}
        >
          <Icon className="w-8 h-8 md:w-12 md:h-12" />
        </div>
      ))}
    </>
  );
}

function WarningBanner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % warningMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bg-red-500/20 border-b border-red-500/50 py-2 overflow-hidden">
      <div className="flex items-center justify-center gap-3 text-red-400 text-sm font-mono animate-pulse">
        <AlertTriangle className="w-4 h-4" />
        <span>{warningMessages[messageIndex]}</span>
        <AlertTriangle className="w-4 h-4" />
      </div>
    </div>
  );
}

function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
      }}
    />
  );
}

export default function NotFound() {
  const [showTerminal, setShowTerminal] = useState(true);

  const handleReset = useCallback(() => {
    setShowTerminal(false);
    setTimeout(() => setShowTerminal(true), 100);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-green-400 relative overflow-hidden">
      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glitch-skew {
          0%, 100% { transform: skew(0deg); }
          20% { transform: skew(-2deg); }
          40% { transform: skew(2deg); }
          60% { transform: skew(-1deg); }
          80% { transform: skew(1deg); }
        }
        .animate-matrix-fall { animation: matrix-fall linear infinite; }
        .animate-blink { animation: blink 1s infinite; }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-glitch-skew { animation: glitch-skew 0.5s infinite; }
      `}</style>

      <MatrixRain />
      <FloatingIcons />
      <ScanLines />
      <WarningBanner />

      <div className="relative z-10 flex flex-col items-center px-4 pt-12">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <GlitchText
              text="404"
              className="text-8xl md:text-9xl font-bold font-mono tracking-wider"
            />
            <div
              className="absolute inset-0 text-8xl md:text-9xl font-bold font-mono tracking-wider text-red-500/30 animate-glitch-skew"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
            >
              404
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Skull className="w-6 h-6 text-red-500 animate-pulse" />
          <h1 className="text-xl md:text-2xl font-mono">
            <GlitchText text="ACCESS DENIED" className="text-red-400" />
          </h1>
          <Skull className="w-6 h-6 text-red-500 animate-pulse" />
        </div>

        <p className="text-green-500/70 font-mono text-sm mb-8 text-center max-w-md">
          The page you're looking for has been compromised, deleted, or never existed.
          <br />
          <span className="text-red-400">Your activity has been logged.</span>
        </p>

        {showTerminal && <TerminalWindow />}

        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Link href="/">
            <Button
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:text-green-300 font-mono gap-2"
              data-testid="button-go-home"
            >
              <Home className="w-4 h-4" />
              ESCAPE TO SAFETY
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-mono gap-2"
            onClick={handleReset}
            data-testid="button-retry-hack"
          >
            <RefreshCw className="w-4 h-4" />
            RETRY HACK
          </Button>
        </div>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-green-500/50 text-xs font-mono">
            <Shield className="w-4 h-4" />
            <span>HOREQ SECURITY SYSTEM v4.0.4</span>
            <Shield className="w-4 h-4" />
          </div>
          <p className="text-green-500/30 text-xs font-mono mt-2">
            Just kidding - we couldn't find that page!
          </p>
        </div>
      </div>
    </div>
  );
}
