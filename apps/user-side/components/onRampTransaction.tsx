import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        id: number | string, // changed to accept string IDs from normalization if needed, though simpler usually best
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div key={t.id} className="flex justify-between w-full mb-2">
                <div>
                    <div className="text-sm font-semibold">
                        {t.provider}
                    </div>
                    <div className={`text-xs ${t.status === "Success" ? "text-green-600" :
                            t.status === "Processing" ? "text-yellow-600" : "text-red-600"
                        }`}>
                        {t.status}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center font-bold">
                    {t.amount > 0 ? "+" : ""} Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}