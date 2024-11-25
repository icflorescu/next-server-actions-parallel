import type { Metadata } from 'next';
import { PropsWithChildren, Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Parallel Next.js Server Actions',
  description: 'Simple Next.js project to test running Next.js server actions concurrently',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
      </head>
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
