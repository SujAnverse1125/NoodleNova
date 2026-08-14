"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/app/context/WalletContext";

interface GameItem {
    id: number;
    type: "star" | "ramen" | "rock" | "laser";
    x: number;
    y: number;  // progress 0-100%
    lane: number;
}

const LANES = [0, 1, 2];
const LANE_LABELS = ["Top", "Mid", "Bot"];

export default function GamePage() {
    const { unlockRoute, isConnected, connect, isLoading } = useWallet();
    const [gameState, setGameState] = useState<"start" | "playing" | "paused" | "result">("start");
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [time, setTime] = useState(30);
    const [playerLane, setPlayerLane] = useState(1);
    const [playerX, setPlayerX] = useState(16);
    const [items, setItems] = useState<GameItem[]>([]);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const gameRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const itemIdRef = useRef(0);

    const DIALOGUES = [
        "Let's go, courier! The noodles won't deliver themselves!",
        "Watch out for those asteroids! 🪨",
        "Sweet! You're collecting stardust like a pro! ⭐",
        "Chef Nova will be proud of this haul! 🍜",
    ];

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setCombo(0);
        setHearts(3);
        setTime(30);
        setPlayerLane(1);
        setPlayerX(16);
        setItems([]);
        setDialogueIndex(0);
    };

    const spawnItem = useCallback(() => {
        const types: GameItem["type"][] = ["star", "star", "ramen", "rock", "laser"];
        const type = types[Math.floor(Math.random() * types.length)];
        const lane = LANES[Math.floor(Math.random() * LANES.length)];
        setItems((prev) => [
            ...prev,
            { id: itemIdRef.current++, type, x: 100, y: 0, lane },
        ]);
    }, []);

    // Game loop
    useEffect(() => {
        if (gameState !== "playing") return;

        timerRef.current = setInterval(() => {
            setTime((t) => {
                if (t <= 1) {
                    setGameState("result");
                    unlockRoute(2); // Unlock Route 2 (Aurora Shoyu)
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        let spawnCounter = 0;
        gameRef.current = setInterval(() => {
            spawnCounter++;
            if (spawnCounter % 8 === 0) spawnItem();
            if (spawnCounter % 25 === 0) {
                setDialogueIndex((d) => (d + 1) % 4);
            }

            setItems((prev) => {
                const updated = prev
                    .map((item) => ({ ...item, x: item.x - 2.5 }))
                    .filter((item) => item.x > -10);
                return updated;
            });
        }, 100);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (gameRef.current) clearInterval(gameRef.current);
        };
    }, [gameState, spawnItem]);

    // Collision detection
    useEffect(() => {
        if (gameState !== "playing") return;

        setItems((prev) => {
            let newScore = 0;
            let newCombo = 0;
            let hitRock = false;

            const remaining = prev.filter((item) => {
                if (item.lane === playerLane && item.x >= playerX - 4 && item.x <= playerX + 6) {
                    if (item.type === "star") {
                        newScore += 10;
                        newCombo = 1;
                        return false;
                    }
                    if (item.type === "ramen") {
                        newScore += 25;
                        newCombo = 1;
                        return false;
                    }
                    if (item.type === "rock" || item.type === "laser") {
                        hitRock = true;
                        return false;
                    }
                }
                return true;
            });

            if (newScore > 0) {
                setScore((s) => s + newScore);
                setCombo((c) => c + newCombo);
            }
            if (hitRock) {
                setCombo(0);
                setHearts((h) => {
                    if (h <= 1) {
                        setGameState("result");
                        return 0;
                    }
                    return h - 1;
                });
            }

            return remaining;
        });
    }, [playerLane, playerX, gameState, items]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "p" || e.key === "Escape") {
                setGameState((prev) => (prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev));
                return;
            }
            if (gameState !== "playing") return;
            if (e.key === "ArrowUp" || e.key === "w") setPlayerLane((l) => Math.max(0, l - 1));
            if (e.key === "ArrowDown" || e.key === "s") setPlayerLane((l) => Math.min(2, l + 1));
            if (e.key === "ArrowLeft" || e.key === "a") setPlayerX((x) => Math.max(5, x - 5));
            if (e.key === "ArrowRight" || e.key === "d") setPlayerX((x) => Math.min(80, x + 5));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    const laneY = (lane: number) => `${18 + lane * 29}%`;
    const itemEmoji = (type: string) =>
        type === "star" ? "⭐" : type === "ramen" ? "🍜" : "🪨";

    return (
        <div className="max-w-[1240px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between min-h-[54px] mb-3">
                <div className="text-center leading-none">
                    <span className="text-cyan font-mono text-xs tracking-widest">ARCADE MODE</span>
                    <b className="block mt-1 text-sm">Noodle Run</b>
                </div>
            </div>

            {/* Game Stage */}
            <div className="game-stage starfield">
                <div className="stars"></div>
                <div className="stars2"></div>
                <div className="stars3"></div>



                {/* HUD */}
                {(gameState === "playing" || gameState === "paused") && (
                    <div className="game-hud">
                        <div className="hud-box">
                            <small>SCORE</small>
                            <b>{score.toLocaleString()}</b>
                        </div>
                        <div className="hud-box">
                            <small>COMBO</small>
                            <b style={{ color: "var(--pink)" }}>{combo}x</b>
                        </div>
                        <div className="hud-box">
                            <small>HEARTS</small>
                            <b style={{ color: "var(--pink)" }}>{"❤️".repeat(hearts)}</b>
                        </div>
                        <div className="hud-box" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
                            <div>
                                <small>TIME</small>
                                <b>{time}s</b>
                            </div>
                            <button
                                onClick={() => setGameState(gameState === "playing" ? "paused" : "playing")}
                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                {gameState === "playing" ? "⏸️" : "▶️"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Rider */}
                {(gameState === "playing" || gameState === "paused") && (
                    <div
                        className="absolute z-[6] w-[100px] h-[100px] transition-all duration-150"
                        style={{
                            left: `${playerX}%`,
                            top: laneY(playerLane),
                            transform: "translate(-50%, -50%)",
                            mixBlendMode: "screen"
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Thruster Fire Effect */}
                            <div className="rocket-fire" />

                            {/* Rocket Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/icon_routes.png"
                                alt="Player"
                                className="w-[120%] h-[120%] object-contain relative z-10"
                                style={{
                                    transform: "rotate(90deg)",
                                    filter: "contrast(2.5) brightness(0.5) drop-shadow(0 0 10px rgba(90, 229, 225, 0.5))",
                                    maskImage: "radial-gradient(circle at center, black 40%, transparent 65%)",
                                    WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 65%)"
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Items */}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`absolute z-[4] flex items-center justify-center ${item.type === "laser" ? "" : "w-[38px] h-[38px] text-3xl animate-item-pulse"}`}
                        style={{
                            left: `${item.x}%`,
                            top: laneY(item.lane),
                            transform: "translate(-50%, -50%)",
                            filter:
                                item.type === "star"
                                    ? "drop-shadow(0 0 10px gold)"
                                    : item.type === "ramen"
                                        ? "drop-shadow(0 0 10px #ff5e9e)"
                                        : "none",
                        }}
                    >
                        {item.type === "laser" ? (
                            <div className="w-[10px] h-[80px] bg-pink rounded-full" style={{ boxShadow: "0 0 15px var(--pink), 0 0 30px var(--pink)" }} />
                        ) : (
                            itemEmoji(item.type)
                        )}
                    </div>
                ))}

                {/* Comic dialogue */}
                {(gameState === "playing" || gameState === "paused") && (
                    <div className="absolute z-[7] left-4 bottom-[58px] max-w-[55%] flex gap-2 p-[10px_12px] border-2 border-ink rounded-[10px] text-ink bg-paper"
                        style={{ boxShadow: "4px 4px 0 var(--pink)" }}>
                        <span className="text-xl">🍜</span>
                        <p className="m-0 text-xs font-bold leading-snug">{DIALOGUES[dialogueIndex]}</p>
                    </div>
                )}

                {/* Mission strip */}
                {(gameState === "playing" || gameState === "paused") && (
                    <div className="absolute z-[8] left-[18px] bottom-[17px] flex items-center gap-2 px-[10px] py-2 border border-white/20 rounded-[5px_11px] bg-[#09071ac7] text-[#d9d4e6] text-[0.67rem]">
                        <span className="text-cyan font-mono text-xs tracking-wider">MISSION</span>
                        <i className="w-1 h-1 rounded-full bg-gold inline-block" />
                        Collect 100 stardust
                    </div>
                )}

                {/* Start overlay */}
                {gameState === "start" && (
                    <div className="game-overlay">
                        <div className="text-center text-paper">
                            <div className="text-pink font-mono text-xs tracking-widest font-bold mb-2">ARCADE MODE</div>
                            <h1 className="text-[clamp(2.3rem,6vw,4.2rem)] font-bold tracking-tight leading-[0.86] mb-4 text-paper">
                                Noodle<br />Run
                            </h1>
                            <p className="max-w-[450px] mx-auto text-sm font-bold leading-relaxed mb-5 text-paper/80">
                                Dodge asteroids, collect stardust, and deliver ramen bowls across the cosmos. Use ↑↓ arrow keys to switch lanes.
                            </p>
                            <button className="button primary" onClick={startGame}>
                                🚀 Start Run
                            </button>
                            <small className="block mt-4 text-paper/30 font-mono text-xs">
                                Use WASD or Arrow Keys to move. Press P or Esc to pause.
                            </small>
                        </div>
                    </div>
                )}

                {/* Paused overlay */}
                {gameState === "paused" && (
                    <div className="game-overlay bg-black/50 backdrop-blur-sm">
                        <div className="text-center text-paper">
                            <h2 className="text-4xl font-bold tracking-tight mb-4">PAUSED</h2>
                            <button className="button primary" onClick={() => setGameState("playing")}>
                                ▶️ Resume
                            </button>
                        </div>
                    </div>
                )}

                {/* Result overlay */}
                {gameState === "result" && (
                    <div className="game-overlay">
                        <div className="text-center text-paper">
                            <div className="text-pink font-mono text-xs tracking-widest font-bold mb-2">RUN COMPLETE</div>
                            <h2 className="text-4xl font-bold tracking-tight mb-4">
                                <span className="text-pink">{score}</span>{" "}
                                <span className="text-paper/40 text-lg">points</span>
                            </h2>
                            <div className="flex justify-center gap-6 mb-6 font-mono text-sm">
                                <span>⭐ Stars: {Math.floor(score / 10)}</span>
                                <span>🍜 Bowls: {Math.floor(score / 25)}</span>
                                <span>❤️ Hearts: {hearts}</span>
                            </div>
                            <div className="flex justify-center gap-3">
                                <button className="button primary" onClick={startGame}>
                                    🔄 Play Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile controls */}
            <div className="grid grid-cols-5 gap-2 mt-3 sm:hidden">
                <button className="min-h-[42px] border border-white/10 rounded-lg bg-ink-3 text-paper text-xl" onClick={() => setPlayerX((x) => Math.max(5, x - 5))}>
                    ←
                </button>
                <button className="min-h-[42px] border border-white/10 rounded-lg bg-ink-3 text-paper text-xl" onClick={() => setPlayerLane((l) => Math.max(0, l - 1))}>
                    ↑
                </button>
                <button className="min-h-[42px] border border-white/10 rounded-lg bg-gold text-ink text-sm font-bold" onClick={startGame}>
                    {gameState === "playing" ? `${LANE_LABELS[playerLane]}` : "START"}
                </button>
                <button className="min-h-[42px] border border-white/10 rounded-lg bg-ink-3 text-paper text-xl" onClick={() => setPlayerLane((l) => Math.min(2, l + 1))}>
                    ↓
                </button>
                <button className="min-h-[42px] border border-white/10 rounded-lg bg-ink-3 text-paper text-xl" onClick={() => setPlayerX((x) => Math.min(80, x + 5))}>
                    →
                </button>
            </div>

            {/* Not connected overlay */}
            {!isConnected && (
                <div className="game-overlay bg-space-dark/90 backdrop-blur-md z-50">
                    <div className="text-center text-paper max-w-md mx-auto p-8 bg-ink-2/80 rounded-2xl border border-pink/30 shadow-[0_0_30px_rgba(255,42,133,0.2)]">
                        <div className="w-16 h-16 mx-auto mb-4 bg-pink/20 rounded-full flex items-center justify-center border border-pink/50">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <path d="M1 10h22" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Wallet Required</h2>
                        <p className="text-muted text-sm mb-6">
                            You must connect your wallet to play Noodle Run and earn stardust.
                        </p>
                        <button className="button primary w-full" onClick={() => connect()} disabled={isLoading}>
                            {isLoading ? "Connecting..." : "Connect Wallet"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
