'use client';

import { useState } from 'react';
import { runParallelAction } from '~/src';
import { echo, nonBlockingEcho } from './page.actions';
import classes from './page.module.css';

export default function Home() {
  const [status, setStatus] = useState<{ isRunning: boolean; results?: string; executionTime?: number }>({
    isRunning: false,
  });

  const onRunClick = async () => {
    const start = Date.now();
    setStatus({ isRunning: true });
    const res = await Promise.all([echo(1), echo(2), echo(3), echo(4), echo(5), echo(6)]);
    setStatus({ isRunning: false, results: JSON.stringify(res), executionTime: Date.now() - start });
  };

  const onRunParallelClick = async () => {
    const start = Date.now();
    setStatus({ isRunning: true });
    const res = await Promise.all([
      runParallelAction(nonBlockingEcho(1)),
      runParallelAction(nonBlockingEcho(2)),
      runParallelAction(nonBlockingEcho(3)),
      runParallelAction(nonBlockingEcho(4)),
      runParallelAction(nonBlockingEcho(5)),
      runParallelAction(nonBlockingEcho(6)),
    ]);
    setStatus({ isRunning: false, results: JSON.stringify(res), executionTime: Date.now() - start });
  };

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <h1>Parallel Next.js Server Actions</h1>
      </header>
      <main className={classes.main}>
        <button data-testid="run-default" className={classes.button} onClick={onRunClick}>
          Run actions
        </button>
        <button data-testid="run-parallel" className={classes.button} onClick={onRunParallelClick}>
          Run actions in parallel
        </button>
        <div className={classes.output}>
          <div className={classes.label}>Results:</div>
          <div data-testid="results" className={classes.results}>
            {status.results}
          </div>
          <div className={classes.label}>
            {status.isRunning ? (
              'Running...'
            ) : status.executionTime ? (
              <>
                Execution took <span data-testid="time">{status.executionTime}</span>ms.
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </main>
      <footer className={classes.footer}>
        Created by{' '}
        <a href="https://github.com/icflorescu" title="Ionuț-Cristian Florescu" target="_blank">
          Ionuț-Cristian Florescu
        </a>
      </footer>
    </div>
  );
}
