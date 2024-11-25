'use server';

import { createParallelAction } from '~/src';

export async function echo({ n, duration }: { n: number; duration: number }) {
  console.log(`Running action ${n}...`);
  await new Promise((resolve) => setTimeout(resolve, duration));
  return { n };
}

export const nonBlockingEcho = createParallelAction(echo);
