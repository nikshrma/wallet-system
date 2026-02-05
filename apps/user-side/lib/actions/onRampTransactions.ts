"use server";

import { prisma } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export default async function onRampTransactionHandler(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    const token = (Math.random() * 1000).toString();
    const newTransaction = await prisma.onRampTransaction.create({
        data: {
            amount,
            userId: Number(session.user.id),
            token,
            provider,
            status: "Processing",
            startTime: new Date()
        }
    })
    return {
        message: "done"
    }
}