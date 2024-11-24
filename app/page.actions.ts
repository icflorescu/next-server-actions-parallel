'use server';

import { createParallelAction } from '~/src';

export async function echo(n: number) {
  console.log(`Running action ${n}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return n;
}

export const nonBlockingEcho = createParallelAction(echo);
