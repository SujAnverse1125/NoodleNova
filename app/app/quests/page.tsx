"use client";

const QUESTS = [
    {
        name: "HANA",
        title: "The Midnight Run",
        avatar: "/pixel_hana.png",
        color: "pink",
        speech: `"I need someone to cover my shift tonight. The tips are good, but the route is dangerous. You in?"`,
        objective: "Fund 3 routes in one day",
        reward: "1x Rare Stamp",
        rewardColor: "text-gold",
        completed: false,
    },
    {
        name: "CHEF NOVA",
        title: "Secret Recipe",
        avatar: "/pixel_chef.png",
        color: "cyan",
        speech: `"You found the missing ingredients! The broth is perfect. Here's your reward, courier."`,
        objective: "Collect 500 stardust in Noodle Run",
        reward: "Unlocked Chapter 2",
        rewardColor: "text-cyan",
        completed: true,
    },
    {
        name: "BEAM",
        title: "System Upgrade",
        avatar: "/icon_logo.png",
        color: "gold",
        speech: `"My navigation sensors require calibration. Please execute a test transaction on the network."`,
        objective: "Send 1 XLM to the test address",
        reward: "1x Common Stamp",
        rewardColor: "text-gold",
        completed: false,
    },
];

export default function QuestsPage() {
    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-10">
                <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-1 animate-pulse">Side Quests</p>
                <h1 className="text-4xl md:text-5xl font-bold text-paper mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Bounty Board
                </h1>
                <p className="text-muted text-sm max-w-md">
                    Complete side missions to earn extra stamps and unlock new story chapters.
                </p>
            </header>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {QUESTS.map((quest, idx) => {
                    const borderColor = quest.color === "pink" ? "border-pink" : quest.color === "cyan" ? "border-cyan" : "border-gold";
                    const shadowColor = quest.color === "pink" ? "shadow-neon-pink" : quest.color === "cyan" ? "shadow-neon-cyan" : "shadow-neon-gold";
                    const bgAccent = quest.color === "pink" ? "bg-pink/10" : quest.color === "cyan" ? "bg-cyan/10" : "bg-gold/10";

                    return (
                        <div
                            key={idx}
                            className={`relative rounded-2xl border-2 ${borderColor} ${shadowColor} bg-ink-2/60 backdrop-blur-md p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${quest.completed ? "opacity-70" : ""}`}
                        >
                            {/* Completed badge */}
                            {quest.completed && (
                                <div className="absolute top-4 right-4 bg-cyan/20 text-cyan text-xs font-mono px-3 py-1 rounded-full border border-cyan/30">
                                    ✓ COMPLETED
                                </div>
                            )}

                            {/* Character row */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-14 h-14 rounded-full border-2 ${borderColor} overflow-hidden flex items-center justify-center ${bgAccent} p-1`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={quest.avatar} alt={quest.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <p className={`font-mono text-xs tracking-widest ${quest.color === "pink" ? "text-pink" : quest.color === "cyan" ? "text-cyan" : "text-gold"}`}>
                                        {quest.name}
                                    </p>
                                    <h2 className="text-xl font-bold text-paper">{quest.title}</h2>
                                </div>
                            </div>

                            {/* Speech bubble */}
                            <div className={`${bgAccent} rounded-xl px-4 py-3 mb-4 border border-white/5`}>
                                <p className="text-muted text-sm italic">{quest.speech}</p>
                            </div>

                            {/* Objective */}
                            <div className="mb-4">
                                <span className="text-muted text-xs font-mono uppercase tracking-wider">Objective:</span>
                                <p className="text-paper font-bold mt-1">{quest.objective}</p>
                            </div>

                            {/* Footer: reward + button */}
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                <div>
                                    <span className="text-xs font-mono text-muted uppercase tracking-wider">Reward</span>
                                    <p className={`font-bold text-sm ${quest.rewardColor}`}>{quest.reward}</p>
                                </div>
                                {quest.completed ? (
                                    <span className="text-xs font-mono text-muted bg-ink-3 px-4 py-2 rounded-full border border-white/10">
                                        Completed
                                    </span>
                                ) : (
                                    <button className="px-5 py-2 bg-pink text-ink font-bold text-sm rounded-full border-2 border-ink shadow-[4px_4px_0_var(--gold)] hover:translate-y-1 hover:shadow-[2px_2px_0_var(--gold)] transition-all active:translate-y-2">
                                        Start Quest
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
