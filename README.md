
### Next.js Architecture: Server vs. Client Pages

#### Is it okay for `page.tsx` to be a Client Component?
**Yes, it is allowed**, but it is often considered **less than ideal** for performance and SEO.

#### The "Ideal" Approach: The Leaf Pattern
In professional Next.js applications, we usually try to keep the Page (`page.tsx`) as a **Server Component** and push the "client" logic as far down the tree as possible (to the "leaves").

**Why?**
1.  **Metadata/SEO**: Server components can dynamically generate metadata (`title`, `description`) based on DB data easily.
2.  **Performance**: Server components are not sent as JavaScript to the browser. Keeping `page.tsx` as a Server component keeps the initial bundle smaller.
3.  **Data Fetching**: You can query your database directly in a Server `page.tsx` and pass the *initial data* to your client components.

#### Recommended Refactor
Instead of making the whole page `"use client"`, create a specific component for the interactive part.

1.  `apps/user-side/components/Counter.tsx` -> **"use client"**
    ```tsx
    "use client"
    import { useAtom } from "jotai";
    import { counterAtom } from "@repo/store";
    
    export const Counter = () => {
      const [count] = useAtom(counterAtom);
      return <div>{count}</div>;
    }
    ```

2.  `apps/user-side/app/page.tsx` -> **(Server Component)**
    ```tsx
    // No "use client" here
    import { Counter } from "../components/Counter";
    
    export default function Home() {
      return (
        <div>
           <h1>Welcome to the Wallet</h1>
           <Counter /> {/* The interactivity is isolated here */}
        </div>
      );
    }
    ```
This gives you the best of both worlds: a fast server-rendered shell and rich client-side interactivity where needed.

### Troubleshooting

**Issue: Signup Error with Random Credentials**

When running `npm run dev` in the root, navigating to `localhost:3000`, and signing up with a random password/number/name, the following error occurs:

```
web:dev:  GET /api/auth/signin 200 in 696ms (compile: 678ms, render: 18ms)
web:dev:  POST /api/auth/callback/credentials 302 in 66ms (compile: 7ms, render: 58ms)
web:dev:  GET /api/auth/error?error=%0AInvalid%20%60prisma.user.findFirst()%60%20invocation%3A%0A%0A%0A 200 in 7ms (compile: 1213µs, render: 6ms)
```

This error suggests an issue with the `prisma.user.findFirst()` call during the authentication flow.
