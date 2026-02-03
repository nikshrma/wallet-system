"use client"
import { Appbar } from "@repo/ui/AppBar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AppbarClient() {
    const session = useSession();
    return (
        <div>
            <Appbar onSignin={() => signIn(undefined, { callbackUrl: "/dashboard" })} onSignout={async () => {
                await signOut({ callbackUrl: "/api/auth/signin" });
            }} user={session.data?.user} />
        </div>
    )
}