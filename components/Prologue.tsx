"use client";

import { useState, useEffect } from "react";

interface PrologueProps {
    onComplete: () => void;
}

const SLIDES = [
    {
        art: "/pixel_ramen.png",
        isImage: true,
        color: "gold",
        kicker: "CHAPTER 0 · PROLOGUE",
        title: "The night the stars tasted like miso",
        dialogue: "Every courier in Nova City knows the rule — deliver hot, deliver fast, or don't deliver at all.",
        speaker: "NARRATOR",
    },
    {
        art: "/pixel_hana.png",
        isImage: true,
        color: "pink",
        kicker: "INTRODUCING",
        title: "Meet Hana — the fastest courier in orbit",
        dialogue: "They said no one could run the Starlight Express route in under four minutes. I did it in three.",
        speaker: "HANA",
    },
    {
        art: "/pixel_chef.png",
        isImage: true,
        color: "cyan",
        kicker: "THE CAPTAIN",
        title: "Chef Nova's legendary kitchen",
        dialogue: "The broth must be perfect. The noodles must sing. And the delivery? That's where you come in, courier.",
        speaker: "CHEF NOVA",
    },
    {
        art: "/pixel_star.png",
        isImage: true,
        color: "gold",
        kicker: "YOUR MISSION",
        title: "Fund routes. Collect stardust. Save the noodles.",
        dialogue: "Sponsor delivery routes with XLM on Stellar Testnet. Earn stamps. Write your name in the cosmic ledger.",
        speaker: "MISSION CONTROL",
    },
];

export function Prologue({ onComplete }: PrologueProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const completed = localStorage.getItem("noodle-nova-prologue-complete");
        if (completed === "true") {
            setVisible(false);
            onComplete();
        }
    }, [onComplete]);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide((prev) => prev + 1);
        } else {
            handleSkip();
        }
    };

    const handleSkip = () => {
        localStorage.setItem("noodle-nova-prologue-complete", "true");
        setVisible(false);
        onComplete();
    };

    if (!visible) return null;

    const slide = SLIDES[currentSlide];
    const isLast = currentSlide === SLIDES.length - 1;

    const shadowColor = slide.color === "pink" ? "var(--cyan)"
        : slide.color === "cyan" ? "var(--gold)"
            : "var(--pink)";

    const artBg = slide.color === "pink" ? "var(--pink)"
        : slide.color === "cyan" ? "var(--cyan)"
            : "var(--gold)";

    return (
        <div className="prologue">
            <div className="prologue-stars" />

            {/* Skip button */}
            <button className="skip-story" onClick={handleSkip}>
                Skip prologue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 4l10 8-10 8V4zM19 5v14" />
                </svg>
            </button>

            <div className="prologue-inner">
                {/* Chapter kicker */}
                <div className="chapter-kicker">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {slide.kicker}
                </div>

                {/* Story card */}
                <div className="story-card" style={{ boxShadow: `10px 12px 0 ${shadowColor}` }}>
                    {/* Art panel */}
                    <div className="story-art" style={{ backgroundColor: artBg }}>
                        {slide.isImage ? (
                            <img src={slide.art} alt={slide.title} className="w-full h-full object-cover" />
                        ) : (
                            <span style={{ fontSize: "8rem" }}>{slide.art}</span>
                        )}
                    </div>

                    {/* Content panel */}
                    <div className="story-content">
                        <p>{slide.speaker}</p>
                        <h1>{slide.title}</h1>
                        <div className="speech-bubble">
                            {slide.dialogue}
                        </div>
                        <div className="story-footer">
                            <div className="story-dots">
                                {SLIDES.map((_, i) => (
                                    <i key={i} className={i === currentSlide ? "active" : ""} />
                                ))}
                            </div>
                            <button className="button primary" onClick={handleNext}>
                                {isLast ? "Enter Nova City →" : "Continue →"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
