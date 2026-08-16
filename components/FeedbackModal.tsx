"use client";

import { useState } from "react";
import { useWallet } from "@/app/context/WalletContext";
import { useToast } from "@/app/context/ToastContext";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const { address } = useWallet();
    const { showSuccess, showError } = useToast();
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            showError("Please connect your wallet first");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: address, message, rating }),
            });

            if (res.ok) {
                showSuccess("Thank you for your feedback!");
                setMessage("");
                setRating(5);
                onClose();
            } else {
                showError("Failed to submit feedback");
            }
        } catch (error) {
            showError("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-space-dark/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-ink-2/90 border border-gold/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(255,201,91,0.15)] relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-muted hover:text-pink transition-colors"
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center border border-gold/50 mb-6 shadow-[0_0_15px_rgba(255,201,91,0.3)]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-paper tracking-tight mb-2">Courier Feedback</h2>
                    <p className="text-muted text-sm mb-6">
                        Help us improve the Noodle Nova network. Rate your experience and leave a comment!
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-mono text-gold mb-2 tracking-widest uppercase">
                                Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-colors ${rating >= star ? 'text-gold' : 'text-white/20 hover:text-gold/50'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-xs font-mono text-gold mb-2 tracking-widest uppercase">
                                Comments
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="What did you think of the delivery experience?"
                                className="w-full bg-ink-3 border border-white/10 rounded-lg px-4 py-3 text-paper focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all min-h-[100px] resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gold text-ink font-bold py-3 rounded-lg mt-2 hover:bg-gold/90 transition-colors shadow-[0_0_15px_rgba(255,201,91,0.4)]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
