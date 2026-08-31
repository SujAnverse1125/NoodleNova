import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const PAGE_SIZE = 20;
const VALID_TX_TYPES = ["sponsor_route", "delivery_funded", "delivery_completed", "game_win", "send_xlm"] as const;
const VALID_TX_STATUSES = ["unverified", "verified", "failed"] as const;
const VALID_RATINGS = [1, 2, 3, 4, 5] as const;

function sanitizePage(v: string | undefined): number {
    const n = parseInt(v || "1");
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function sanitizeEnum<T extends readonly string[]>(v: string | undefined, valid: T): T[number] | undefined {
    if (!v) return undefined;
    return (valid as readonly string[]).includes(v) ? (v as T[number]) : undefined;
}

function sanitizeRating(v: string | undefined): number | undefined {
    if (!v) return undefined;
    const n = parseInt(v);
    return Number.isFinite(n) && VALID_RATINGS.includes(n as typeof VALID_RATINGS[number]) ? n : undefined;
}

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_ACCESS_TOKEN;

    if (!token || !adminToken || token !== adminToken) {
        return (
            <div className="min-h-screen bg-ink flex items-center justify-center text-paper font-sans">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-muted">You do not have permission to view this page.</p>
                    <p className="text-muted text-sm mt-2">Set an <code>admin_token</code> cookie to authenticate.</p>
                </div>
            </div>
        );
    }

    const userPage = sanitizePage(searchParams.userPage as string);
    const txPage = sanitizePage(searchParams.txPage as string);
    const fbPage = sanitizePage(searchParams.fbPage as string);

    const txTypeFilter = sanitizeEnum(searchParams.txType as string, VALID_TX_TYPES);
    const txStatusFilter = sanitizeEnum(searchParams.txStatus as string, VALID_TX_STATUSES);
    const fbRatingFilter = sanitizeRating(searchParams.fbRating as string);

    const [
        users, usersTotal,
        transactions, transactionsTotal,
        feedbacks, feedbacksTotal,
        globalVerifiedCount,
        globalMatchedTx,
        globalUnmatchedTx,
        avgRatingResult,
        txTypeCounts,
        ratingDistribution,
    ] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            skip: (userPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.user.count(),
        prisma.transaction.findMany({
            orderBy: { createdAt: "desc" },
            skip: (txPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            where: {
                ...(txTypeFilter ? { type: txTypeFilter } : {}),
                ...(txStatusFilter ? { verificationStatus: txStatusFilter } : {}),
            },
            include: { user: true },
        }),
        prisma.transaction.count({
            where: {
                ...(txTypeFilter ? { type: txTypeFilter } : {}),
                ...(txStatusFilter ? { verificationStatus: txStatusFilter } : {}),
            },
        }),
        prisma.feedback.findMany({
            orderBy: { createdAt: "desc" },
            skip: (fbPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            where: fbRatingFilter ? { rating: fbRatingFilter } : undefined,
            include: { user: true },
        }),
        prisma.feedback.count({
            where: fbRatingFilter ? { rating: fbRatingFilter } : undefined,
        }),
        prisma.transaction.count({ where: { verificationStatus: "verified" } }),
        prisma.transaction.count({ where: { userId: { not: null } } }),
        prisma.transaction.count({ where: { userId: null } }),
        prisma.feedback.aggregate({ _avg: { rating: true } }),
        prisma.transaction.groupBy({ by: ["type"], _count: true }),
        prisma.feedback.groupBy({ by: ["rating"], _count: true, orderBy: { rating: "asc" } }),
    ]);

    const avgRating = avgRatingResult._avg.rating;

    const totalTxPages = Math.ceil(transactionsTotal / PAGE_SIZE);
    const totalFbPages = Math.ceil(feedbacksTotal / PAGE_SIZE);
    const totalUserPages = Math.ceil(usersTotal / PAGE_SIZE);

    const txTypeMap: Record<string, number> = {};
    txTypeCounts.forEach((t) => { txTypeMap[t.type] = t._count; });

    const ratingMap: Record<number, number> = {};
    ratingDistribution.forEach((r) => { ratingMap[r.rating] = r._count; });

    return (
        <div className="min-h-screen bg-ink text-paper font-sans p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
                    <div>
                        <p className="text-cyan font-mono text-xs tracking-widest mb-2 uppercase">ADMIN OVERRIDE</p>
                        <h1 className="text-4xl font-bold tracking-tight text-gold drop-shadow-[0_0_15px_rgba(255,201,91,0.2)]">
                            Noodle Nova Admin
                        </h1>
                    </div>
                    <div className="px-4 py-2 rounded-full border-2 border-red-500 bg-red-500/10 text-red-400 font-bold text-sm flex items-center gap-2">
                        <i className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Admin Active
                    </div>
                </header>

                {/* ── Global Statistics (unfiltered) ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Registered Users" value={usersTotal} color="text-cyan" />
                    <StatCard label="Feedback Records" value={feedbacksTotal} color="text-pink" />
                    <StatCard label="Recorded Transactions" value={globalMatchedTx + globalUnmatchedTx} color="text-gold" />
                    <StatCard label="Verified Successful Transactions" value={globalVerifiedCount} color="text-green-400" />
                    <StatCard label="Matched Transactions" value={globalMatchedTx} color="text-cyan" />
                    <StatCard label="Unmatched Transactions" value={globalUnmatchedTx} color="text-red-400" />
                    <StatCard label="Average Rating" value={avgRating ? avgRating.toFixed(2) : "N/A"} color="text-gold" />
                    <div className="bg-ink-2/50 border border-white/10 rounded-xl p-4">
                        <p className="text-xs text-muted uppercase tracking-wider mb-2">Rating Distribution</p>
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((r) => (
                                <div key={r} className="flex items-center gap-2 text-xs">
                                    <span className="text-gold w-12">{"★".repeat(r)}</span>
                                    <span className="text-muted">{ratingMap[r] || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Transaction Type Breakdown (global) ── */}
                <div className="bg-ink-2/50 border border-white/10 rounded-xl p-4 mb-8">
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">Transaction Types (all)</p>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(txTypeMap).map(([type, count]) => (
                            <span key={type} className="px-3 py-1 rounded-full border border-white/10 text-xs">
                                <span className="text-cyan font-bold">{type}</span>{" "}
                                <span className="text-muted">({count})</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* ── Users Table ── */}
                    <div className="bg-ink-2/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-cyan mb-6">Registered Couriers ({usersTotal})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted">
                                        <th className="pb-3 pr-4">Name</th>
                                        <th className="pb-3 pr-4">Wallet Address</th>
                                        <th className="pb-3">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 pr-4 font-bold text-pink-neon">{user.name}</td>
                                            <td className="py-4 pr-4 font-mono text-xs text-lavender/70">
                                                {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-8)}
                                            </td>
                                            <td className="py-4 text-xs text-muted">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-muted">No couriers registered yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={userPage} totalPages={totalUserPages} pageParam="userPage" />
                    </div>

                    {/* ── Transactions Table (filtered) ── */}
                    <div className="bg-ink-2/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-gold mb-6">Transaction Log ({transactionsTotal})</h2>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <FilterLink label="All" active={!txTypeFilter && !txStatusFilter} params={{}} />
                            {VALID_TX_TYPES.map((t) => (
                                <FilterLink key={t} label={t.replace(/_/g, " ")} active={txTypeFilter === t}
                                    params={{ txType: t, ...(txStatusFilter ? { txStatus: txStatusFilter } : {}) }} />
                            ))}
                            <span className="border-l border-white/10 mx-1" />
                            {VALID_TX_STATUSES.map((s) => (
                                <FilterLink key={s} label={s} active={txStatusFilter === s}
                                    params={{ txStatus: s, ...(txTypeFilter ? { txType: txTypeFilter } : {}) }} />
                            ))}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted">
                                        <th className="pb-3 pr-4">Type</th>
                                        <th className="pb-3 pr-4">Hash</th>
                                        <th className="pb-3 pr-4">Wallet</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">User</th>
                                        <th className="pb-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 pr-4 text-xs font-bold text-cyan uppercase">{tx.type.replace(/_/g, " ")}</td>
                                            <td className="py-4 pr-4 font-mono text-xs text-lavender/70">
                                                <a href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                                                    {tx.hash.slice(0, 8)}...
                                                </a>
                                            </td>
                                            <td className="py-4 pr-4 font-mono text-xs text-lavender/70">
                                                {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${tx.verificationStatus === "verified" ? "bg-green-500/20 text-green-400" : tx.verificationStatus === "failed" ? "bg-red-500/20 text-red-400" : "bg-white/10 text-muted"}`}>
                                                    {tx.verificationStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4 text-xs text-muted">
                                                {tx.user?.name || <span className="text-red-400">unmatched</span>}
                                            </td>
                                            <td className="py-4 text-xs text-muted">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-muted">No transactions match filters.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={txPage} totalPages={totalTxPages} pageParam="txPage"
                            extraParams={{ ...(txTypeFilter ? { txType: txTypeFilter } : {}), ...(txStatusFilter ? { txStatus: txStatusFilter } : {}) }} />
                    </div>
                </div>

                {/* ── Feedback Table (filtered) ── */}
                <div className="bg-ink-2/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-pink mb-6">User Feedback ({feedbacksTotal})</h2>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <FilterLink label="All" active={!fbRatingFilter} params={{}} />
                        {[5, 4, 3, 2, 1].map((r) => (
                            <FilterLink key={r} label={`${"★".repeat(r)} (${ratingMap[r] || 0})`} active={fbRatingFilter === r}
                                params={{ fbRating: String(r) }} />
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted">
                                    <th className="pb-3 pr-4">Courier</th>
                                    <th className="pb-3 pr-4">Rating</th>
                                    <th className="pb-3 pr-4">Message</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((fb) => (
                                    <tr key={fb.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 pr-4 font-bold text-cyan">{fb.user?.name || "Unknown"}</td>
                                        <td className="py-4 pr-4 text-gold">{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</td>
                                        <td className="py-4 pr-4 text-sm text-paper max-w-md truncate">{fb.message}</td>
                                        <td className="py-4 text-xs text-muted">
                                            {new Date(fb.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {feedbacks.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-muted">No feedback match filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={fbPage} totalPages={totalFbPages} pageParam="fbPage"
                        extraParams={fbRatingFilter ? { fbRating: String(fbRatingFilter) } : {}} />
                </div>
            </div>
        </div>
    );
}

/* ── Components ── */

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className="bg-ink-2/50 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    );
}

function FilterLink({ label, active, params }: { label: string; active: boolean; params: Record<string, string> }) {
    const qs = new URLSearchParams(params).toString();
    const href = qs ? `?${qs}` : "?";
    return (
        <a href={href}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${active ? "border-gold bg-gold/10 text-gold" : "border-white/10 text-muted hover:text-paper"}`}>
            {label}
        </a>
    );
}

function Pagination({
    currentPage,
    totalPages,
    pageParam,
    extraParams = {},
}: {
    currentPage: number;
    totalPages: number;
    pageParam: string;
    extraParams?: Record<string, string>;
}) {
    if (totalPages <= 1) return null;

    function href(page: number) {
        const qs = new URLSearchParams({ ...extraParams, [pageParam]: String(page) });
        return `?${qs.toString()}`;
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-white/10">
            {currentPage > 1 && (
                <a href={href(currentPage - 1)} className="px-3 py-1 rounded text-xs border border-white/10 text-muted hover:text-paper hover:border-white/30 transition-colors">Prev</a>
            )}
            <span className="text-xs text-muted">Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages && (
                <a href={href(currentPage + 1)} className="px-3 py-1 rounded text-xs border border-white/10 text-muted hover:text-paper hover:border-white/30 transition-colors">Next</a>
            )}
        </div>
    );
}
