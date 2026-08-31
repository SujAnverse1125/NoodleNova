import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const walletAddress = searchParams.get("walletAddress");

        if (!walletAddress) {
            return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { walletAddress },
            select: {
                routesFunded: true,
                xlmEarned: true,
                stampsEarned: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, stats: user }, { status: 200 });
    } catch (error) {
        console.error("Fetch stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
