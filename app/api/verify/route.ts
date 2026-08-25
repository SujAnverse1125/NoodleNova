import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

export async function POST(req: Request) {
    try {
        const { transactionId } = await req.json();

        if (!transactionId) {
            return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });
        }

        const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!tx) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        try {
            const horizonTx = await server.transactions().transaction(tx.hash).call();

            if (horizonTx.successful) {
                await prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        verificationStatus: "verified",
                        verifiedAt: new Date(),
                        verificationError: null,
                    },
                });
                return NextResponse.json({ success: true, status: "verified" }, { status: 200 });
            } else {
                await prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        verificationStatus: "failed",
                        verifiedAt: new Date(),
                        verificationError: horizonTx.result_xdr || "Transaction failed on Horizon",
                    },
                });
                return NextResponse.json({ success: true, status: "failed" }, { status: 200 });
            }
        } catch (horizonError: unknown) {
            const errMsg = horizonError instanceof Error ? horizonError.message : "Unknown Horizon error";
            const isNotFound = errMsg.includes("404") || errMsg.includes("not found");

            if (isNotFound) {
                await prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        verificationStatus: "failed",
                        verifiedAt: new Date(),
                        verificationError: "Transaction not found on Horizon",
                    },
                });
                return NextResponse.json({ success: true, status: "failed", detail: "not found on Horizon" }, { status: 200 });
            }

            throw horizonError;
        }
    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
