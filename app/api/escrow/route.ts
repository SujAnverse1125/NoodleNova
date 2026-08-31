import { NextResponse } from "next/server";
import * as StellarSdk from "@stellar/stellar-sdk";

export const dynamic = "force-dynamic";

const RPC_URL =
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    "https://soroban-testnet.stellar.org";
const CONTRACT_ID =
    process.env.NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID ||
    "CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE";

function xlmToStroops(amount: string) {
    if (!/^\d+(\.\d{1,7})?$/.test(amount)) {
        throw new Error("Invalid amount format");
    }
    const [whole, fractional = ""] = amount.split(".");
    return BigInt(whole) * BigInt(10_000_000) + BigInt((fractional + "0000000").slice(0, 7));
}

// GET: Query on-chain delivery status using get_delivery
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const deliveryId = searchParams.get("deliveryId");
        const accountAddress = searchParams.get("accountAddress") || "GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A";

        if (!deliveryId) {
            return NextResponse.json({ error: "Missing deliveryId parameter" }, { status: 400 });
        }

        const rpc = new StellarSdk.SorobanRpc.Server(RPC_URL);
        const sourceAccount = await rpc.getAccount(accountAddress);
        const contract = new StellarSdk.Contract(CONTRACT_ID);

        const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
                contract.call(
                    "get_delivery",
                    StellarSdk.nativeToScVal(BigInt(deliveryId), { type: "u64" })
                )
            )
            .setTimeout(60)
            .build();

        const simulation = await rpc.simulateTransaction(tx);
        if (!StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulation) || !simulation.result) {
            return NextResponse.json({ error: "Delivery not found on contract" }, { status: 404 });
        }

        const delivery = StellarSdk.scValToNative(simulation.result.retval);
        return NextResponse.json({ success: true, delivery });
    } catch (error) {
        console.error("Escrow query error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Query failed" }, { status: 500 });
    }
}

// POST: Execute create_delivery or complete_delivery with sponsor secret key (backend service)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, deliveryId, courier, amount } = body;

        const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
        if (!sponsorSecret) {
            return NextResponse.json({ error: "Sponsor secret not configured" }, { status: 500 });
        }

        const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);
        const rpc = new StellarSdk.SorobanRpc.Server(RPC_URL);
        const sourceAccount = await rpc.getAccount(sponsorKeypair.publicKey());
        const contract = new StellarSdk.Contract(CONTRACT_ID);

        let txOp;
        if (action === "create_delivery") {
            const nativeTokenContract = StellarSdk.Asset.native().contractId(StellarSdk.Networks.TESTNET);
            txOp = contract.call(
                "create_delivery",
                StellarSdk.nativeToScVal(BigInt(deliveryId), { type: "u64" }),
                StellarSdk.Address.fromString(sponsorKeypair.publicKey()).toScVal(),
                StellarSdk.Address.fromString(courier).toScVal(),
                StellarSdk.Address.fromString(nativeTokenContract).toScVal(),
                StellarSdk.nativeToScVal(xlmToStroops(amount), { type: "i128" })
            );
        } else if (action === "complete_delivery") {
            txOp = contract.call(
                "complete_delivery",
                StellarSdk.nativeToScVal(BigInt(deliveryId), { type: "u64" })
            );
        } else {
            return NextResponse.json({ error: "Invalid action. Supported: create_delivery, complete_delivery" }, { status: 400 });
        }

        let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(txOp)
            .setTimeout(60)
            .build();

        transaction = await rpc.prepareTransaction(transaction);
        transaction.sign(sponsorKeypair);
        const sendResponse = await rpc.sendTransaction(transaction);

        return NextResponse.json({ success: true, result: sendResponse });
    } catch (error) {
        console.error("Escrow transaction error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Transaction failed" }, { status: 500 });
    }
}
