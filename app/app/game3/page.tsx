"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/app/context/WalletContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const SCOOTER_SIZE = 30;
const GRAVITY_CONSTANT = 500;
const TIME_LIMIT = 30; // seconds

interface Vector2 {
    x: number;
    y: number;
}

interface BlackHole {
    x: number;
    y: number;
    mass: number;
    radius: number;
}

const BLACK_HOLES: BlackHole[] = [
    { x: 200, y: 300, mass: 1.5, radius: 40 },
    { x: 500, y: 150, mass: 1.2, radius: 35 },
    { x: 600, y: 450, mass: 2.0, radius: 50 },
];

const DELIVERY_ZONE = { x: 700, y: 50, radius: 40 };
const START_POS = { x: 50, y: 550 };

export default function BlackHoleBrothGame() {
    const { unlockRoute } = useWallet();
    const router = useRouter();

    const [gameState, setGameState] = useState<"start" | "playing" | "won" | "lost">("start");
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

    // Physics state
    const pos = useRef<Vector2>({ ...START_POS });
    const vel = useRef<Vector2>({ x: 0, y: 0 });
    const angle = useRef<number>(0); // degrees
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);

    // Input state
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
        setTimeLeft(TIME_LIMIT);
        pos.current = { ...START_POS };
        vel.current = { x: 0, y: 0 };
        angle.current = 0;
        lastTimeRef.current = performance.now();
    };

    const updateGame = useCallback((time: number) => {
        if (gameState !== "playing") return;

        const deltaTime = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        // 1. Handle Input (Rotation & Thrust)
        if (keys.current["ArrowLeft"]) angle.current -= 180 * deltaTime;
        if (keys.current["ArrowRight"]) angle.current += 180 * deltaTime;

        let thrust = { x: 0, y: 0 };
        if (keys.current["ArrowUp"]) {
            const rad = (angle.current - 90) * (Math.PI / 180);
            const thrustPower = 200;
            thrust.x = Math.cos(rad) * thrustPower;
            thrust.y = Math.sin(rad) * thrustPower;
        }

        // 2. Calculate Gravity from Black Holes
        let gravity = { x: 0, y: 0 };
        let crashed = false;

        for (const bh of BLACK_HOLES) {
            const dx = bh.x - pos.current.x;
            const dy = bh.y - pos.current.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            if (dist < bh.radius + SCOOTER_SIZE / 2) {
                crashed = true;
                break;
            }

            const force = (GRAVITY_CONSTANT * bh.mass) / Math.max(distSq, 100);
            gravity.x += (dx / dist) * force;
            gravity.y += (dy / dist) * force;
        }

        if (crashed) {
            setGameState("lost");
            return;
        }

        // 3. Update Velocity & Position
        vel.current.x += (thrust.x + gravity.x) * deltaTime;
        vel.current.y += (thrust.y + gravity.y) * deltaTime;

        // Damping (friction)
        vel.current.x *= 0.99;
        vel.current.y *= 0.99;

        pos.current.x += vel.current.x * deltaTime;
        pos.current.y += vel.current.y * deltaTime;

        // 4. Boundary Check
        if (
            pos.current.x < 0 || pos.current.x > GAME_WIDTH ||
            pos.current.y < 0 || pos.current.y > GAME_HEIGHT
        ) {
            setGameState("lost");
            return;
        }

        // 5. Win Condition (Delivery Zone)
        const dx = DELIVERY_ZONE.x - pos.current.x;
        const dy = DELIVERY_ZONE.y - pos.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < DELIVERY_ZONE.radius) {
            setGameState("won");
            unlockRoute(4); // Unlock Route 4
            return;
        }

        // Force re-render for position updates
        setTimeLeft(prev => {
            const newTime = prev - deltaTime;
            if (newTime <= 0) {
                setGameState("lost");
                return 0;
            }
            return newTime;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, unlockRoute]);

    useEffect(() => {
        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(updateGame);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, updateGame]);

    return (
        <div className="min-h-screen bg-[#0a091a] flex flex-col items-center justify-center p-6 font-mono text-paper">
            <div className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-gold drop-shadow-[0_0_15px_rgba(255,201,91,0.5)] mb-2">Black Hole Broth</h1>
                <p className="text-cyan text-sm">Singularity Station • Navigate the gravity wells to deliver the ramen!</p>
            </div>

            <div
                className="relative bg-[#05040d] border-4 border-gold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,201,91,0.2)]"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
                {/* HUD */}
                <div className="absolute top-4 left-4 right-4 flex justify-between z-10 text-xl font-bold">
                    <div className={timeLeft < 10 ? "text-pink animate-pulse" : "text-cyan"}>
                        Time: {Math.ceil(timeLeft)}s
                    </div>
                </div>

                {/* Game Elements */}
                {gameState === "playing" && (
                    <>
                        {/* Black Holes */}
                        {BLACK_HOLES.map((bh, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-black border-2 border-purple shadow-[0_0_30px_rgba(147,51,234,0.8)] animate-pulse"
                                style={{
                                    left: bh.x - bh.radius,
                                    top: bh.y - bh.radius,
                                    width: bh.radius * 2,
                                    height: bh.radius * 2,
                                }}
                            />
                        ))}

                        {/* Delivery Zone */}
                        <div
                            className="absolute rounded-full border-4 border-dashed border-cyan bg-cyan/20 animate-spin-slow flex items-center justify-center"
                            style={{
                                left: DELIVERY_ZONE.x - DELIVERY_ZONE.radius,
                                top: DELIVERY_ZONE.y - DELIVERY_ZONE.radius,
                                width: DELIVERY_ZONE.radius * 2,
                                height: DELIVERY_ZONE.radius * 2,
                            }}
                        >
                            <span className="text-2xl" style={{ animation: "spin 10s linear infinite reverse" }}>🛰️</span>
                        </div>

                        {/* Scooter */}
                        <div
                            className="absolute flex items-center justify-center text-3xl"
                            style={{
                                left: pos.current.x - SCOOTER_SIZE / 2,
                                top: pos.current.y - SCOOTER_SIZE / 2,
                                width: SCOOTER_SIZE,
                                height: SCOOTER_SIZE,
                                transform: `rotate(${angle.current}deg)`,
                            }}
                        >
                            🛸
                            {keys.current["ArrowUp"] && (
                                <div className="absolute -bottom-4 w-2 h-4 bg-pink rounded-full blur-sm animate-pulse" />
                            )}
                        </div>
                    </>
                )}

                {/* Overlays */}
                {gameState === "start" && (
                    <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div className="text-6xl mb-6">🌌</div>
                        <h2 className="text-3xl font-bold text-paper mb-4">Gravity Navigation</h2>
                        <p className="text-muted mb-8 max-w-md text-center">Use Left/Right arrows to rotate and Up arrow to thrust. Slingshot around the black holes to reach the delivery zone (🛰️) before time runs out. Don't crash or fly out of bounds!</p>
                        <button onClick={startGame} className="btn-primary text-xl px-8 py-3">Start Engine</button>
                    </div>
                )}

                {gameState === "won" && (
                    <div className="absolute inset-0 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center z-20 border-4 border-gold rounded-lg">
                        <div className="text-7xl mb-4 animate-bounce">🏅</div>
                        <h2 className="text-4xl font-bold text-gold mb-2 drop-shadow-[0_0_15px_rgba(255,201,91,0.5)]">MISSION ACCOMPLISHED</h2>
                        <p className="text-cyan mb-8">Route 4: Comet Creamy Unlocked!</p>
                        <div className="flex gap-4">
                            <button onClick={() => router.push("/app/map")} className="btn-secondary">Return to Map</button>
                        </div>
                    </div>
                )}

                {gameState === "lost" && (
                    <div className="absolute inset-0 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center z-20 border-4 border-pink rounded-lg">
                        <div className="text-7xl mb-4">💥</div>
                        <h2 className="text-4xl font-bold text-pink mb-2">SPAGHETTIFIED</h2>
                        <p className="text-muted mb-8">The broth was lost to the void.</p>
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
