"use client";

export interface DeliveryRecord {
    amount: string;
    courier: string;
    is_completed: boolean;
    sponsor: string;
    token: string;
}

const RPC_URL =
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    "https://soroban-testnet.stellar.org";
// This is the current Noodle Nova Testnet deployment. Set the public variable
// to replace it after a Testnet reset or a future contract deployment.
const CONTRACT_ID =
    process.env.NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID ||
    "CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE";

function getContractId() {
    if (!/^C[A-Z2-7]{55}$/.test(CONTRACT_ID)) {
        throw new Error(
            "Escrow is not configured. Set NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID to a deployed Testnet contract ID."
        );
    }

    return CONTRACT_ID;
}

function xlmToStroops(amount: string) {
    if (!/^\d+(\.\d{1,7})?$/.test(amount)) {
        throw new Error("Enter an XLM amount with up to 7 decimal places.");
    }

    const [whole, fractional = ""] = amount.split(".");
    const stroops =
        BigInt(whole) * BigInt(10_000_000) + BigInt((fractional + "0000000").slice(0, 7));

    if (stroops <= BigInt(0)) {
        throw new Error("Escrow amount must be greater than zero.");
    }

    return stroops;
}

async function sdk() {
    return import("@stellar/stellar-sdk");
}

async function buildContractTransaction(
    accountAddress: string,
    method: "create_delivery" | "complete_delivery" | "get_delivery",
    args: unknown[]
) {
    const StellarSdk = await sdk();
    const rpc = new StellarSdk.SorobanRpc.Server(RPC_URL);
    const sourceAccount = await rpc.getAccount(accountAddress);
    const contract = new StellarSdk.Contract(getContractId());

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
    })
        .addOperation(contract.call(method, ...(args as Parameters<typeof contract.call>[1][])))
        .setTimeout(60)
        .build();

    return { StellarSdk, rpc, transaction };
}

async function signAndSend(accountAddress: string, transaction: Awaited<ReturnType<typeof buildContractTransaction>>["transaction"]) {
    const StellarSdk = await sdk();
    const rpc = new StellarSdk.SorobanRpc.Server(RPC_URL);
    const preparedTransaction = await rpc.prepareTransaction(transaction);
    const freighter = await import("@stellar/freighter-api");
    const signedXdr = await freighter.signTransaction(preparedTransaction.toXDR(), {
        accountToSign: accountAddress,
        networkPassphrase: StellarSdk.Networks.TESTNET,
    });
    const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        StellarSdk.Networks.TESTNET
    );
    const response = await rpc.sendTransaction(signedTransaction);

    if (response.status === "ERROR") {
        throw new Error("The Stellar network rejected the escrow transaction.");
    }

    return response.hash;
}

export async function createDelivery({
    sponsor,
    courier,
    deliveryId,
    amount,
}: {
    sponsor: string;
    courier: string;
    deliveryId: number;
    amount: string;
}) {
    const StellarSdk = await sdk();
    const nativeTokenContract = StellarSdk.Asset.native().contractId(StellarSdk.Networks.TESTNET);
    const args = [
        StellarSdk.nativeToScVal(BigInt(deliveryId), { type: "u64" }),
        StellarSdk.Address.fromString(sponsor).toScVal(),
        StellarSdk.Address.fromString(courier).toScVal(),
        StellarSdk.Address.fromString(nativeTokenContract).toScVal(),
        StellarSdk.nativeToScVal(xlmToStroops(amount), { type: "i128" }),
    ];
    const { transaction } = await buildContractTransaction(sponsor, "create_delivery", args);

    return signAndSend(sponsor, transaction);
}

export async function completeDelivery({
    sponsor,
    deliveryId,
}: {
    sponsor: string;
    deliveryId: number;
}) {
    const StellarSdk = await sdk();
    const { transaction } = await buildContractTransaction(sponsor, "complete_delivery", [
        StellarSdk.nativeToScVal(BigInt(deliveryId), { type: "u64" }),
    ]);

    return signAndSend(sponsor, transaction);
}

export async function getDelivery({
    accountAddress,
    deliveryId,
}: {
    accountAddress: string;
    deliveryId: number;
}): Promise<DeliveryRecord> {
    const StellarSdk = await sdk();
    const { rpc, transaction } = await buildContractTransaction(accountAddress, "get_delivery", [
        StellarSdk.nativeToScVal(BigInt(deliveryId), { type: "u64" }),
    ]);
    const simulation = await rpc.simulateTransaction(transaction);

    if (!StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulation) || !simulation.result) {
        throw new Error("Delivery was not found on the configured escrow contract.");
    }

    return StellarSdk.scValToNative(simulation.result.retval) as DeliveryRecord;
}

export const escrowConfig = {
    contractId: CONTRACT_ID,
    rpcUrl: RPC_URL,
};
