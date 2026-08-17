import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { hash, walletAddress, type } = body;

        if (!hash || !walletAddress || !type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const transaction = await prisma.transaction.create({
            data: {
                hash,
                walletAddress,
                type,
            },
        });

        return NextResponse.json({ transaction }, { status: 201 });
    } catch (error) {
        console.error("Error saving transaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
