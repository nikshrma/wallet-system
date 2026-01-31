"use client"
import { counterAtom } from '@repo/store'
import { useAtom } from "jotai"
import {Button} from '@repo/ui/button'
export default function Home() {
  const a = counterAtom;
  const render = useAtom(a);
  return <div>
     {JSON.stringify(a)}
    <Button appName='Blah'>
      Deer
    </Button>
  </div>
}
