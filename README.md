# Next.js Parallel Server Actions
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Sponsor the author][sponsor-image]][sponsor-url]

Run multiple Next.js server actions in parallel.

## Why?

Because a lot of people are interested in this feature. See:
- [https://github.com/vercel/next.js/discussions/50743](https://github.com/vercel/next.js/discussions/50743)
- [https://github.com/vercel/next.js/issues/69265](https://github.com/vercel/next.js/issues/69265)
- [https://x.com/cramforce/status/1733240566954230063](https://x.com/cramforce/status/1733240566954230063)
- [https://stackoverflow.com/questions/77484983/why-are-server-actions-not-executing-concurrently](https://stackoverflow.com/questions/77484983/why-are-server-actions-not-executing-concurrently)
- [https://stackoverflow.com/questions/78548578/server-actions-in-next-js-seem-to-be-running-in-series](https://stackoverflow.com/questions/78548578/server-actions-in-next-js-seem-to-be-running-in-series)

## TL;DR

Install:

```sh
pnpm i next-server-actions-parallel
```

Define server actions like so:


```ts
// app/page.actions.ts

import { createParallelAction } from 'next-server-actions-parallel';

export const listUsers = createParallelAction(async () => { // 👈 don't forget the `async` keyword!!
  return prisma.user.findMany(); // 👈 let's assume this takes 3 seconds
});

export const listProducts = createParallelAction(async (categoryId: string) => {
  return prisma.product.findMany({ where: { categoryId } }); // 👈 let's assume this takes 3 seconds
});
```

Use them like so:

```ts
// app/page.tsx
'use client';
import { runParallelAction } from 'next-server-actions-parallel';
import { listUsers, listProducts } from './page.actions';

export default async function Page() {
  // this will take slightly more than 3 seconds, not 6.
  const [users, products] = await Promise.all([
    runParallelAction(listUsers()),
    runParallelAction(listProducts('82b2ab20-ec1e-4539-85a2-ea6737555250')),
  ]);

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Show gratitude

If you find [my open-source work](https://github.com/icflorescu) useful, please consider sponsing me on [GitHub Sponsors](https://github.com/sponsors/icflorescu).

## Background story

When Vercel added support for server actions in Next.js, a lot of developers - myself included - were hyper-excited about it and saw it as a boilerplate-free alternative to [tRPC.io](https://trpc.io) to [Telefunc](https://telefunc.com).

Many were however disappointed to find that Next.js server actions were executed in series, contrary to what one would expect when triggering them in parallel with `Promise.all`.  
It probably worked like that because they were intended to be used for mutations, because _"data should be fetched in server components or using REST API endpoints"_.  
Plus, since server actions are implemented with `POST` requests, some are reluctant to the idea of using them for fetching data (though `POST` requests **can** and usually **do** return data).

However, there are many reasons why projects like [tRPC.io](https://trpc.io), [Telefunc](https://telefunc.com) and other *RPCs were built (and have no problem using `POST` requests to fetch data). If you're **building real, data-rich applications** you'd definitely want something like [tRPC.io](https://trpc.io) for type-safety and the fact that you don't have to build and maintain hundreds of API endpoints just to populate dynamic UI components (autocompletes and selects).

[tRPC.io](https://trpc.io) is the "batteries-included" choice (I'm a big fan and former contributor to the ecosystem - see [tRPC-SvelteKit](https://icflorescu.github.io/trpc-sveltekit/)) but I always found the amount of boilerplate to be a bit discouraging for new developers and/or small projects. [Telefunc](https://telefunc.com) looks like a nice alternative, but it doesn't (yet?) have an obvious way of integrating with the Next.js app router.

It would be nice to use server actions for RPC without the current limitation of being unable to call multiple functions in parallel.

Well, that's what [next-server-actions-parallel](https://github.com/icflorescu/next-server-actions-parallel) is for.

## How does it work?

The `createParallelAction` is simply wrapping the promise your server action returns in an array (a single-ellement tuple, to be more precise - see note below) and returning that array instead of the result of the promise.
The `runParallelAction` client-side utility function will simply await the promise and return the array element.

It may be hard to believe, but it's a trick that actually works.

This repository contains a simple Next.js app that demonstrates it in action:
[Check it on StackBlitz ⚡️](https://stackblitz.com/~/github.com/icflorescu/next-server-actions-parallel)

_Note:_ Wrapping the promise in an object would also work, but I've chosen the array for data-transfer efficiency.

## Do I actually need to use this library?

Not necessarily. The two functions that are exported by the library are small enough to be easily copied and pasted into your own project.  
But since this is a common pain point for many developers, I've decided to provide a simple and easy-to-use wrapper. And hope that if you find it useful you won't hesitate to show your eternal gratitude by [throwing a few greenbacks my way ](https://github.com/sponsors/icflorescu), at least for discovering the trick... 😜

## License

The [MIT License](LICENSE).

[npm-url]: https://npmjs.org/package/next-server-actions-parallel
[license-url]: LICENSE
[sponsor-url]: https://github.com/sponsors/icflorescu
[npm-image]: https://img.shields.io/npm/v/next-server-actions-parallel.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/next-server-actions-parallel.svg?style=flat-square
[sponsor-image]: https://img.shields.io/badge/sponsor-violet?style=flat-square
