import { AddMoney } from "@/components/AddMoneyCard";
import { BalanceCard } from "@/components/BalanceCard";
import { OnRampTransactions } from "@/components/onRampTransaction";
import { authOptions } from "@/lib/auth";
import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getBalance(userId: number) {
    const balance = await prisma.balance.findFirst({
        where: {
            userId: userId
        }
    });
    return {
        amount: balance?.amount || 0
    }
}

async function getTransactions(userId: number) {
    const onRampTxns = await prisma.onRampTransaction.findMany({
        where: {
            userId: userId
        }
    });

    const sentTransfers = await prisma.p2PTransfers.findMany({
        where: {
            fromUserId: userId
        }
    });

    const receivedTransfers = await prisma.p2PTransfers.findMany({
        where: {
            toUserId: userId
        }
    });

    const formattedOnRamp = onRampTxns.map(t => ({
        id: `on_ramp_${t.id}`,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider,
        type: "on_ramp"
    }));

    const formattedSent = sentTransfers.map(t => ({
        id: `p2p_sent_${t.id}`,
        time: t.timestamp,
        amount: -t.amount, // Negative for sent
        status: "Success",
        provider: "Sent P2P",
        type: "p2p_sent"
    }));

    const formattedReceived = receivedTransfers.map(t => ({
        id: `p2p_received_${t.id}`,
        time: t.timestamp,
        amount: t.amount, // Positive for received
        status: "Success",
        provider: "Received P2P",
        type: "p2p_received"
    }));

    const allTransactions = [...formattedOnRamp, ...formattedSent, ...formattedReceived];

    // Sort by time descending (newest first)
    return allTransactions.sort((a, b) => b.time.getTime() - a.time.getTime());
}

export default async function () {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        redirect("/api/auth/signin");
    }
    const balance = await getBalance(Number(session?.user?.id));
    const transactions = await getTransactions(Number(session?.user?.id));

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}