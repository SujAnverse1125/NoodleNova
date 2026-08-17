"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/app/context/WalletContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BOWL_WIDTH = 100;
const BOWL_HEIGHT = 40;
const ITEM_SIZE = 40;
const WIN_SCORE = 20;
const MAX_LIVES = 3;

type ItemType = "noodle" | "shoyu" | "egg" | "pork" | "junk";

interface FallItem {
    id: number;
    x: number;
    y: number;
    type: ItemType;
    speed: number;
}

const ITEM_EMOJIS: Record<ItemType, string> = {
    noodle: "🍜",
    shoyu: "🍶",
    egg: "🥚",
    pork: "🥩",
    junk: "☄️",
};

export default function AuroraShoyuGame() {
    const { unlockRoute } = useWallet();
    const router = useRouter();

    const [gameState, setGameState] = useState<"start" | "playing" | "won" | "lost">("start");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [bowlX, setBowlX] = useState(GAME_WIDTH / 2 - BOWL_WIDTH / 2);
    const [items, setItems] = useState<FallItem[]>([]);

    const requestRef = useRef<number>();
    const lastItemTimeRef = useRef<number>(0);
    const itemIdCounter = useRef(0);

    // Movement state
    const keys = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setLives(MAX_LIVES);
        setItems([]);
        setBowlX(GAME_WIDTH / 2 - BOWL_WIDTH / 2);
        lastItemTimeRef.current = performance.now();
    };

    const spawnItem = (time: number) => {
        if (time - lastItemTimeRef.current > 1000) {
            const types: ItemType[] = ["noodle", "shoyu", "egg", "pork", "junk", "junk"];
            const type = types[Math.floor(Math.random() * types.length)];
            const newItem: FallItem = {
                id: itemIdCounter.current++,
                x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
                y: -ITEM_SIZE,
                type,
                speed: 3 + Math.random() * 3,
            };
            setItems(prev => [...prev, newItem]);
            lastItemTimeRef.current = time;
        }
    };

    const updateGame = useCallback((time: number) => {
        if (gameState !== "playing") return;

        // Move bowl
        setBowlX(prev => {
            let newX = prev;
            if (keys.current["ArrowLeft"]) newX -= 8;
            if (keys.current["ArrowRight"]) newX += 8;
            return Math.max(0, Math.min(newX, GAME_WIDTH - BOWL_WIDTH));
        });

        // Spawn and move items
        spawnItem(time);

        setItems(prevItems => {
            const newItems: FallItem[] = [];
            let currentScore = score;
            let currentLives = lives;

            for (const item of prevItems) {
                const nextY = item.y + item.speed;

                // Collision detection
                if (
                    nextY + ITEM_SIZE >= GAME_HEIGHT - BOWL_HEIGHT &&
                    nextY <= GAME_HEIGHT &&
                    item.x + ITEM_SIZE >= bowlX &&
                    item.x <= bowlX + BOWL_WIDTH
                ) {
                    if (item.type === "junk") {
                        currentLives -= 1;
                    } else {
                        currentScore += 1;
                    }
                    continue; // Item caught
                }

                // Item missed
                if (nextY > GAME_HEIGHT) {
                    if (item.type !== "junk") {
                        currentLives -= 1; // Missed a good ingredient
                    }
                    continue;
                }

                newItems.push({ ...item, y: nextY });
            }

            if (currentLives !== lives) setLives(currentLives);
            if (currentScore !== score) setScore(currentScore);

            if (currentLives <= 0) {
                setGameState("lost");
            } else if (currentScore >= WIN_SCORE) {
                setGameState("won");
                unlockRoute(3); // Unlock Route 3
            }

            return newItems;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, score, lives, bowlX, unlockRoute]);

    useEffect(() => {
        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, updateGame]);

    const { address } = useWallet();
    const [rewardStatus, setRewardStatus] = useState<"pending" | "success" | "error" | null>(null);

    useEffect(() => {
        if (gameState === "won" && address && rewardStatus === null) {
            setRewardStatus("pending");
            fetch("/api/rewards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: address, type: "game_win" }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) setRewardStatus("success");
                    else setRewardStatus("error");
                })
                .catch(() => setRewardStatus("error"));
        }
    }, [gameState, address, rewardStatus]);

    return (
        <div className="min-h-screen bg-[#0a091a] flex flex-col items-center justify-center p-6 font-mono text-paper">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-pink drop-shadow-[0_0_15px_rgba(255,94,158,0.5)] mb-2">Aurora Shoyu</h1>
                <p className="text-cyan text-sm">Lightwave Arcade • Catch {WIN_SCORE} ingredients. Avoid space junk!</p>
            </div>

            <div
                className="relative bg-[#121126] border-4 border-pink rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,94,158,0.2)]"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(var(--pink) 1px, transparent 1px), linear-gradient(90deg, var(--pink) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                {/* HUD */}
                <div className="absolute top-4 left-4 right-4 flex justify-between z-10 text-xl font-bold">
                    <div className="text-gold">Score: {score}/{WIN_SCORE}</div>
                    <div className="text-pink">Lives: {"❤️".repeat(lives)}</div>
                </div>

                {/* Game Elements */}
                {gameState === "playing" && (
                    <>
                        {/* Bowl */}
                        <div
                            className="absolute bottom-0 h-10 bg-cyan rounded-t-full border-4 border-b-0 border-ink shadow-[0_0_15px_rgba(90,229,225,0.5)] flex items-center justify-center text-2xl"
                            style={{ left: bowlX, width: BOWL_WIDTH }}
                        >
                            🍜
                        </div>

                        {/* Falling Items */}
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="absolute text-4xl"
                                style={{ left: item.x, top: item.y, width: ITEM_SIZE, height: ITEM_SIZE }}
                            >
                                {ITEM_EMOJIS[item.type]}
                            </div>
                        ))}
                    </>
                )}

                {/* Overlays */}
                {gameState === "start" && (
                    <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="text-6xl mb-6">🍶</div>
                        <h2 className="text-3xl font-bold text-paper mb-4">Ingredient Catch</h2>
                        <p className="text-muted mb-8 max-w-md text-center">Use Left/Right arrows to move the bowl. Catch noodles, shoyu, egg, and pork. Avoid the space junk! Don't let good ingredients fall.</p>
                        <button onClick={startGame} className="btn-primary text-xl px-8 py-3">Start Game</button>
                    </div>
                )}

                {gameState === "won" && (
                    <div className="absolute inset-0 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center z-20 border-4 border-gold rounded-lg">
                        <div className="text-7xl mb-4 animate-bounce">🏅</div>
                        <h2 className="text-4xl font-bold text-gold mb-2 drop-shadow-[0_0_15px_rgba(255,201,91,0.5)]">MISSION ACCOMPLISHED</h2>
                        <p className="text-cyan mb-4">Route 3: Black Hole Broth Unlocked!</p>

                        {rewardStatus === "pending" && <p className="text-muted mb-8 animate-pulse">Sending 5 XLM reward...</p>}
                        {rewardStatus === "success" && <p className="text-gold font-bold mb-8 drop-shadow-[0_0_10px_rgba(255,201,91,0.5)]">+5 XLM Reward Sent!</p>}
                        {rewardStatus === "error" && <p className="text-pink mb-8">Failed to send reward.</p>}

                        <div className="flex gap-4">
                            <button onClick={() => router.push("/app/map")} className="btn-secondary">Return to Map</button>
                        </div>
                    </div>
                )}

                {gameState === "lost" && (
                    <div className="absolute inset-0 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center z-20 border-4 border-pink rounded-lg">
                        <div className="text-7xl mb-4">💥</div>
                        <h2 className="text-4xl font-bold text-pink mb-2">MISSION FAILED</h2>
                        <p className="text-muted mb-8">The broth is ruined!</p>
                        <div className="flex gap-4">
                            <button onClick={startGame} className="btn-primary">Try Again</button>
                            <button onClick={() => router.push("/app/map")} className="btn-secondary">Return to Map</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
