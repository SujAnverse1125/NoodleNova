import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { walletAddress, message, rating } = await req.json();

        if (!walletAddress || !message || typeof rating !== "number") {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const feedback = await prisma.feedback.create({
            data: {
                walletAddress,
                message,
                rating,
            },
        });

        return NextResponse.json({ success: true, feedback }, { status: 201 });
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        const adminToken = process.env.ADMIN_ACCESS_TOKEN;

        if (!token || token !== adminToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const feedbacks = await prisma.feedback.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true },
        });

        return NextResponse.json({ success: true, feedbacks }, { status: 200 });
    } catch (error) {
        console.error("Feedback fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
    }
}
