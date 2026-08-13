import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { walletAddress, name } = body;

        if (!walletAddress || !name) {
            return NextResponse.json(
                { error: "Missing walletAddress or name" },
                { status: 400 }
            );
        }

        // Upsert user (create if not exists, update if exists)
        const user = await prisma.user.upsert({
            where: { walletAddress },
            update: { name },
            create: { walletAddress, name },
        });

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Error saving user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
