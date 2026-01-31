"use client"
import { Appbar } from '@repo/ui/AppBar'
import { signIn, signOut, useSession } from 'next-auth/react'
export default function Home() {
  const user = useSession();
  return <div>
    {JSON.stringify(user)}
  <Appbar onSignin={()=>signIn()} onSignout={()=>signOut()} user={user.data?.user}></Appbar>
  </div>
}
