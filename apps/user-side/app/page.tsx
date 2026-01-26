
import { PrismaClient } from '@repo/db/client'
import {Button} from '@repo/ui/button'

const prisma = new PrismaClient()
export default function Home() {
  return <div>
    <Button appName='Blah'>
      Deer
    </Button>
  </div>
}
