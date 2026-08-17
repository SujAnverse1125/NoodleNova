import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

export async function POST(req: Request) {
    try {
        const { walletAddress, type } = await req.json();

        if (!walletAddress || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
        if (!sponsorSecret) {
            return NextResponse.json({ error: "Sponsor wallet not configured" }, { status: 500 });
        }

        const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);
        const amount = type === "game_win" ? "5.0000000" : "1.0000000";

        // Load sponsor account
        const sponsorAccount = await server.loadAccount(sponsorKeypair.publicKey());

        // Build transaction
        const transaction = new StellarSdk.TransactionBuilder(sponsorAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
                StellarSdk.Operation.payment({
                    destination: walletAddress,
                    asset: StellarSdk.Asset.native(),
                    amount: amount,
                })
            )
            .setTimeout(30)
            .build();

        // Sign and submit
        transaction.sign(sponsorKeypair);
        const response = await server.submitTransaction(transaction);

        // Update database stats
        const user = await prisma.user.findUnique({ where: { walletAddress } });
        if (user) {
            await prisma.user.update({
                where: { walletAddress },
                data: {
                    routesFunded: type === "sponsor_route" ? user.routesFunded + 1 : user.routesFunded,
                    xlmEarned: user.xlmEarned + parseFloat(amount),
                    stampsEarned: type === "game_win" ? user.stampsEarned + 1 : user.stampsEarned,
                },
            });

            // Log transaction
            await prisma.transaction.create({
                data: {
                    hash: response.hash,
                    walletAddress,
                    type,
                },
            });
        }

        return NextResponse.json({ success: true, hash: response.hash }, { status: 200 });
    } catch (error) {
        console.error("Reward error:", error);
        return NextResponse.json({ error: "Failed to send reward" }, { status: 500 });
    }
}
