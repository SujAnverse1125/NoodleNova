"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error";

interface ToastData {
    id: string;
    type: ToastType;
    message: string;
    txHash?: string;
}

interface ToastContextType {
    toasts: ToastData[];
    showSuccess: (message?: string, txHash?: string) => void;
    showError: (message: string) => void;
    dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
    toasts: [],
    showSuccess: () => { },
    showError: () => { },
    dismissToast: () => { },
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showSuccess = useCallback(
        (message: string = "Transaction sent!", txHash?: string) => {
            const id = `toast-${Date.now()}`;
            const toast: ToastData = {
                id,
                type: "success",
                message,
                txHash,
            };
            setToasts((prev) => [...prev, toast]);

            // Auto-dismiss success after 8 seconds
            setTimeout(() => {
                dismissToast(id);
            }, 8000);
        },
        [dismissToast]
    );

    const showError = useCallback((message: string) => {
        const id = `toast-${Date.now()}`;
        const toast: ToastData = {
            id,
            type: "error",
            message,
        };
        setToasts((prev) => [...prev, toast]);
        // Error toasts do NOT auto-dismiss
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showSuccess, showError, dismissToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
