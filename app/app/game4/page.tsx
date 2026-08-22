"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/app/context/WalletContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const TILE_SIZE = 40;
const PLAYER_SIZE = 30;
const TIME_LIMIT = 60; // seconds
const TARGET_DELIVERIES = 5;

// Maze layout (20x15)
// 1 = Wall, 0 = Path, K = Kitchen, C = Customer spawn point
const MAZE_LAYOUT = [
    "11111111111111111111",
    "1K0001000000010000C1",
    "11110101111101011111",
    "10000001C00100000001",
    "10111111010111111101",
    "10100000010000000101",
    "10101111111111110101",
    "10001C00000000C10001",
    "11101011111111010111",
    "1C0010100000010100C1",
    "10111010111101011101",
    "100000001C0100000001",
    "11110111101111011111",
    "1C0000000000000000C1",
    "11111111111111111111",
];

interface Vector2 {
    x: number;
    y: number;
}

interface Customer {
    id: number;
    x: number;
    y: number;
    patience: number; // 0 to 100
}

export default function CometCreamyGame() {
    const { unlockRoute, address } = useWallet();
    const router = useRouter();

    const [gameState, setGameState] = useState<"start" | "playing" | "won" | "lost">("start");
    const [rewardStatus, setRewardStatus] = useState<"pending" | "success" | "error" | null>(null);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [deliveries, setDeliveries] = useState(0);
    const [hasRamen, setHasRamen] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const pos = useRef<Vector2>({ x: 60, y: 60 }); // Start near kitchen
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const keys = useRef<{ [key: string]: boolean }>({});

    // Parse maze
    const walls: Vector2[] = [];
    const customerSpawns: Vector2[] = [];
    let kitchen: Vector2 = { x: 0, y: 0 };

    for (let y = 0; y < MAZE_LAYOUT.length; y++) {
        for (let x = 0; x < MAZE_LAYOUT[y].length; x++) {
            const char = MAZE_LAYOUT[y][x];
            if (char === "1") walls.push({ x: x * TILE_SIZE, y: y * TILE_SIZE });
            if (char === "C") customerSpawns.push({ x: x * TILE_SIZE, y: y * TILE_SIZE });
            if (char === "K") kitchen = { x: x * TILE_SIZE, y: y * TILE_SIZE };
        }
    }

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

    const spawnCustomer = useCallback(() => {
        const spawn = customerSpawns[Math.floor(Math.random() * customerSpawns.length)];
        setCustomers(prev => {
            if (prev.length >= 3) return prev; // Max 3 customers at a time
            return [...prev, { id: Date.now(), x: spawn.x, y: spawn.y, patience: 100 }];
        });
    }, [customerSpawns]);

    const startGame = () => {
        setGameState("playing");
        setTimeLeft(TIME_LIMIT);
        setDeliveries(0);
        setHasRamen(false);
        setCustomers([]);
        pos.current = { x: kitchen.x + TILE_SIZE / 2, y: kitchen.y + TILE_SIZE / 2 };
        lastTimeRef.current = performance.now();
        spawnCustomer();
    };

    const updateGame = useCallback((time: number) => {
        if (gameState !== "playing") return;

        const deltaTime = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        // 1. Movement
        const speed = 200 * deltaTime;
        let dx = 0;
        let dy = 0;
        if (keys.current["ArrowLeft"]) dx -= speed;
        if (keys.current["ArrowRight"]) dx += speed;
        if (keys.current["ArrowUp"]) dy -= speed;
        if (keys.current["ArrowDown"]) dy += speed;

        // 2. Collision with walls
        const nextX = pos.current.x + dx;
        const nextY = pos.current.y + dy;
        let canMoveX = true;
        let canMoveY = true;

        const pRect = { left: nextX - PLAYER_SIZE / 2, right: nextX + PLAYER_SIZE / 2, top: nextY - PLAYER_SIZE / 2, bottom: nextY + PLAYER_SIZE / 2 };

        for (const wall of walls) {
            const wRect = { left: wall.x, right: wall.x + TILE_SIZE, top: wall.y, bottom: wall.y + TILE_SIZE };
            if (
                pRect.left < wRect.right && pRect.right > wRect.left &&
                (pos.current.y - PLAYER_SIZE / 2 < wRect.bottom && pos.current.y + PLAYER_SIZE / 2 > wRect.top)
            ) {
                canMoveX = false;
            }
            if (
                (pos.current.x - PLAYER_SIZE / 2 < wRect.right && pos.current.x + PLAYER_SIZE / 2 > wRect.left) &&
                pRect.top < wRect.bottom && pRect.bottom > wRect.top
            ) {
                canMoveY = false;
            }
        }

        if (canMoveX) pos.current.x = nextX;
        if (canMoveY) pos.current.y = nextY;

        // 3. Interactions
        // Kitchen
        const distToKitchen = Math.hypot(pos.current.x - (kitchen.x + TILE_SIZE / 2), pos.current.y - (kitchen.y + TILE_SIZE / 2));
        if (distToKitchen < TILE_SIZE && !hasRamen) {
            setHasRamen(true);
        }

        // Customers
        setCustomers(prev => {
            let newCustomers = [...prev];
            let delivered = false;

            for (let i = 0; i < newCustomers.length; i++) {
                const c = newCustomers[i];
                const distToCustomer = Math.hypot(pos.current.x - (c.x + TILE_SIZE / 2), pos.current.y - (c.y + TILE_SIZE / 2));

                if (distToCustomer < TILE_SIZE && hasRamen) {
                    // Delivered!
                    newCustomers.splice(i, 1);
                    setHasRamen(false);
                    setDeliveries(d => d + 1);
                    delivered = true;
                    break;
                }

                // Decrease patience
                c.patience -= 5 * deltaTime;
                if (c.patience <= 0) {
                    // Customer left angry
                    newCustomers.splice(i, 1);
                }
            }

            if (delivered || Math.random() < 0.01) {
                // Randomly spawn new customers if needed
                if (newCustomers.length < 3) {
                    const spawn = customerSpawns[Math.floor(Math.random() * customerSpawns.length)];
                    newCustomers.push({ id: Date.now(), x: spawn.x, y: spawn.y, patience: 100 });
                }
            }

            return newCustomers;
        });

        // 4. Win/Loss
        if (deliveries >= TARGET_DELIVERIES) {
            setGameState("won");
            return; // Don't request next frame
        }

        setTimeLeft(prev => {
            const newTime = prev - deltaTime;
            if (newTime <= 0) {
                setGameState("lost");
                return 0;
            }
            return newTime;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, hasRamen, deliveries, customerSpawns, kitchen, walls]);

    useEffect(() => {
        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, updateGame]);

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
                <h1 className="text-4xl font-bold text-purple drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] mb-2">Comet Creamy</h1>
                <p className="text-cyan text-sm">Moonbean Market • Pick up ramen from the kitchen (K) and deliver to customers (👽)!</p>
            </div>

            <div
                className="relative bg-[#05040d] border-4 border-purple rounded-xl overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.2)]"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {/* HUD */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-10 text-xl font-bold bg-ink/50 backdrop-blur-sm border-b border-white/10">
                    <div className="text-gold">Deliveries: {deliveries}/{TARGET_DELIVERIES}</div>
                    <div className="text-pink">Status: {hasRamen ? "🍜 Holding Ramen" : "🏃 Go to Kitchen"}</div>
                    <div className={timeLeft < 10 ? "text-pink animate-pulse" : "text-cyan"}>
                        Time: {Math.ceil(timeLeft)}s
                    </div>
                </div>

                {/* Game Elements */}
                {gameState === "playing" && (
                    <>
                        {/* Walls */}
                        {walls.map((w, i) => (
                            <div
                                key={i}
                                className="absolute bg-[#1a1836] border border-[#2a2856]"
                                style={{ left: w.x, top: w.y, width: TILE_SIZE, height: TILE_SIZE }}
                            />
                        ))}

                        {/* Kitchen */}
                        <div
                            className="absolute bg-pink/20 border-2 border-pink flex items-center justify-center text-2xl animate-pulse"
                            style={{ left: kitchen.x, top: kitchen.y, width: TILE_SIZE, height: TILE_SIZE }}
                        >
                            K
                        </div>

                        {/* Customers */}
                        {customers.map(c => (
                            <div
                                key={c.id}
                                className="absolute flex flex-col items-center justify-center"
                                style={{ left: c.x, top: c.y, width: TILE_SIZE, height: TILE_SIZE }}
                            >
                                <span className="text-2xl animate-bounce">👽</span>
                                <div className="w-full h-1 bg-ink mt-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: `${c.patience}%` }} />
                                </div>
                            </div>
                        ))}

                        {/* Player */}
                        <div
                            className="absolute flex items-center justify-center text-2xl z-10"
                            style={{
                                left: pos.current.x - PLAYER_SIZE / 2,
                                top: pos.current.y - PLAYER_SIZE / 2,
                                width: PLAYER_SIZE,
                                height: PLAYER_SIZE,
                            }}
                        >
                            {hasRamen ? "🛵" : "🛸"}
                        </div>
                    </>
                )}

                {/* Overlays */}
                {gameState === "start" && (
                    <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="text-6xl mb-6">🏪</div>
                        <h2 className="text-3xl font-bold text-paper mb-4">Market Dash</h2>
                        <p className="text-muted mb-8 max-w-md text-center">Use Arrow Keys to navigate the market maze. Pick up ramen from the Kitchen (K) and deliver it to waiting customers (👽) before they lose patience. Complete {TARGET_DELIVERIES} deliveries before time runs out!</p>
                        <button onClick={startGame} className="btn-primary text-xl px-8 py-3">Start Shift</button>
                    </div>
                )}

                {gameState === "won" && (
                    <div className="absolute inset-0 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center z-20 border-4 border-gold rounded-lg">
                        <div className="text-7xl mb-4 animate-bounce">🏆</div>
                        <h2 className="text-4xl font-bold text-gold mb-2 drop-shadow-[0_0_15px_rgba(255,201,91,0.5)]">LEGENDARY COURIER</h2>
                        <p className="text-cyan mb-4">You've mastered all routes!</p>

                        {rewardStatus === "pending" && <p className="text-muted mb-8 animate-pulse">Sending 5 XLM reward...</p>}
                        {rewardStatus === "success" && <p className="text-gold font-bold mb-8 drop-shadow-[0_0_10px_rgba(255,201,91,0.5)]">+5 XLM Reward Sent!</p>}
                        {rewardStatus === "error" && <p className="text-pink mb-8">Failed to send reward.</p>}

                        <div className="flex gap-4">
                            <button onClick={() => router.push("/app/stamps")} className="btn-primary">View Stamp Vault</button>
                            <button onClick={() => router.push("/app/map")} className="btn-secondary">Return to Map</button>
                        </div>
                    </div>
                )}

                {gameState === "lost" && (
                    <div className="absolute inset-0 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center z-20 border-4 border-pink rounded-lg">
                        <div className="text-7xl mb-4">⏰</div>
                        <h2 className="text-4xl font-bold text-pink mb-2">SHIFT OVER</h2>
                        <p className="text-muted mb-8">You ran out of time.</p>
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
