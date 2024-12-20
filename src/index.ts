/**
 * Utility function to create a non-blocking server action that can be invoked with {@link runParallelAction}.
 * Learn more at https://github.com/icflorescu/next-server-actions-parallel.
 *
 * @example
 * const listUsers = createParallelAction(async () => { // 👈 don't forget the `async` keyword
 *   return await prisma.user.findMany();
 * });
 *
 * const listProducts = createParallelAction(async () => {
 *   return await prisma.product.findMany();
 })
 */
export function createParallelAction<T, U extends unknown[]>(action: (...args: U) => Promise<T>) {
  return async (...args: U) => [action(...args)] as const;
}

/**
 * Utility function to invoke a non-blocking server action created with {@link createParallelAction}.
 * Learn more at https://github.com/icflorescu/next-server-actions-parallel.
 *
 * @example
 * await Promise.all([
 *   runParallelAction(listUsers()),
 *   runParallelAction(listProducts())
 * ]);
 */
export async function runParallelAction<T>(result: Promise<readonly [Promise<T>]>) {
  return (await result)[0];
}
