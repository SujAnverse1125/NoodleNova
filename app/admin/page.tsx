import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage({
    searchParams,
}: {
    searchParams: { token?: string };
}) {
    const token = searchParams.token;
    const adminToken = process.env.ADMIN_ACCESS_TOKEN;

    if (!token || token !== adminToken) {
        return (
            <div className="min-h-screen bg-ink flex items-center justify-center text-paper font-sans">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-muted">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    const transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
    });

    const feedbacks = await prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true },
    });

    return (
        <div className="min-h-screen bg-ink text-paper font-sans p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
                    <div>
                        <p className="text-cyan font-mono text-xs tracking-widest mb-2 uppercase">ADMIN OVERRIDE • 管理者</p>
                        <h1 className="text-4xl font-bold tracking-tight text-gold drop-shadow-[0_0_15px_rgba(255,201,91,0.2)]">
                            Noodle Nova Admin
                        </h1>
                    </div>
                    <div className="px-4 py-2 rounded-full border-2 border-red-500 bg-red-500/10 text-red-400 font-bold text-sm flex items-center gap-2">
                        <i className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Admin Active
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Users Table */}
                    <div className="bg-ink-2/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-cyan mb-6">Registered Couriers ({users.length})</h2>
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
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-ink-2/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-gold mb-6">Transaction Log ({transactions.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted">
                                        <th className="pb-3 pr-4">Type</th>
                                        <th className="pb-3 pr-4">Hash</th>
                                        <th className="pb-3 pr-4">Wallet</th>
                                        <th className="pb-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 pr-4 text-xs font-bold text-cyan uppercase">{tx.type}</td>
                                            <td className="py-4 pr-4 font-mono text-xs text-lavender/70">
                                                <a href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
                                                    {tx.hash.slice(0, 8)}...
                                                </a>
                                            </td>
                                            <td className="py-4 pr-4 font-mono text-xs text-lavender/70">
                                                {tx.walletAddress.slice(0, 4)}...{tx.walletAddress.slice(-4)}
                                            </td>
                                            <td className="py-4 text-xs text-muted">
                                                {new Date(tx.createdAt).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-muted">No transactions recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Feedback Table */}
                <div className="bg-ink-2/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-pink mb-6">User Feedback ({feedbacks.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-muted">
                                    <th className="pb-3 pr-4">Courier</th>
                                    <th className="pb-3 pr-4">Rating</th>
                                    <th className="pb-3 pr-4">Message</th>
                                    <th className="pb-3">Time</th>
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
                                        <td colSpan={4} className="py-8 text-center text-muted">No feedback received yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
