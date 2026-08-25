import { track } from "@vercel/analytics";

/**
 * Centralized event names keep the product funnel consistent and prevent
 * wallet addresses, emails, transaction hashes, or private response text from
 * being sent as analytics properties.
 */
export type ProductEvent =
    | "landing_view"
    | "wallet_connect_started"
    | "wallet_connected"
    | "wallet_connect_failed"
    | "onboarding_completed"
    | "transaction_submitted"
    | "transaction_succeeded"
    | "transaction_failed"
    | "feedback_submitted"
    | "feedback_failed";

export function trackProductEvent(
    event: ProductEvent,
    properties?: Record<string, string | number | boolean | null>
) {
    track(event, properties);
}
