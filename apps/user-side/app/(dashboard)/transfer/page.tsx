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
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions(userId: number) {
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: userId
        }
    });
    return txns.map(t => ({
        id:t.id,
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function () {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        redirect("/api/auth/signin");
    }
    const balance = await getBalance(Number(session?.user?.id));
    const transactions = await getOnRampTransactions(Number(session?.user?.id));

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}