import { prisma } from "@repo/db/client";
import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

type PaymentInfo = {
    token: string;
    userId: number;
    amount: string;
}

app.post('/sbiWebhook', async (req: Request, res: Response) => {
    //TODO:Add zod validation here

    const paymentInfo: PaymentInfo = {
        token: req.body.token,
        userId: req.body.id,
        amount: req.body.amount
    }
    try {
        await prisma.$transaction([
            prisma.balance.updateMany({
                where: {
                    userId: paymentInfo.userId
                },
                data: {
                    amount: {
                        increment: Number(paymentInfo.amount)
                    }
                }
            }),
            prisma.onRampTransaction.updateMany({
                where: {
                    token: paymentInfo.token
                },
                data: {
                    amount: {
                        increment: Number(paymentInfo.amount)
                    }
                }
            })
        ])
        return res.status(200).json({
            message: "Captured"
        });
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(process.env.PORT || 3003);
