'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { runParallelAction } from '~/src';
import { echo, nonBlockingEcho } from './page.actions';
import classes from './page.module.css';

type ExecutionStatus = {
  isRunning: boolean;
  executionTime?: number;
  results?: string;
};

const initialStatus: ExecutionStatus = { isRunning: false };

export default function Home() {
  const [invocations, setInvocations] = useState(10);
  const [invocationDuration, setInvocationDuration] = useState(1000);
  const [apiRoutesStatus, setApiRoutesStatus] = useState<ExecutionStatus>(initialStatus);
  const [defaultActionsStatus, setDefaultActionsStatus] = useState<ExecutionStatus>(initialStatus);
  const [parallelActionsStatus, setParallelActionsStatus] = useState<ExecutionStatus>(initialStatus);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Array.from({ length: invocations }, (_, i) => i + 1);
    setApiRoutesStatus(initialStatus);
    setDefaultActionsStatus(initialStatus);
    setParallelActionsStatus(initialStatus);

    setApiRoutesStatus({ isRunning: true });
    let start = Date.now();
    let results = JSON.stringify(
      await Promise.all(data.map((n) => fetch(`/api?n=${n}&duration=${invocationDuration}`).then((res) => res.json())))
    );
    setApiRoutesStatus({ isRunning: false, executionTime: Date.now() - start, results });

    setParallelActionsStatus({ isRunning: true });
    start = Date.now();
    results = JSON.stringify(
      await Promise.all(data.map((n) => runParallelAction(nonBlockingEcho({ n, duration: invocationDuration }))))
    );
    setParallelActionsStatus({ isRunning: false, executionTime: Date.now() - start, results });

    setDefaultActionsStatus({ isRunning: true });
    start = Date.now();
    results = JSON.stringify(await Promise.all(data.map((n) => echo({ n, duration: invocationDuration }))));
    setDefaultActionsStatus({ isRunning: false, executionTime: Date.now() - start, results });
  };

  const sp = useSearchParams();
  const testMode = sp.get('test-mode') === 'true';

  const handleTestClick = async () => {
    const data = Array.from({ length: 3 }, (_, i) => i + 1);
    const start = Date.now();
    const results = JSON.stringify(
      await Promise.all(data.map((n) => runParallelAction(nonBlockingEcho({ n, duration: invocationDuration }))))
    );
    setParallelActionsStatus({ isRunning: false, executionTime: Date.now() - start, results });
  };

  const isRunning = apiRoutesStatus.isRunning || defaultActionsStatus.isRunning || parallelActionsStatus.isRunning;

  return (
    <main className={clsx('container', classes.main)}>
      <header>
        <h1>Parallel Next.js Server Actions</h1>
        <p>
          A simple Next.js project to benchmark Next.js{' '}
          <a href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">API requests</a> vs.{' '}
          <a href="https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations">
            server actions
          </a>{' '}
          vs.{' '}
          <a href="https://github.com/icflorescu/next-server-actions-parallel" target="_blank">
            parallel server actions
          </a>
          .
        </p>
      </header>
      <section className={classes.content}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <label className={classes.input}>
            Invocations
            <input
              disabled={isRunning}
              type="number"
              required
              placeholder="Number of invocations"
              value={invocations}
              onChange={(e) => setInvocations(Number(e.target.value))}
              data-testid="invocations"
            />
          </label>
          <label className={classes.input}>
            Duration
            <input
              disabled={isRunning}
              type="number"
              required
              placeholder="Duration of invocation (ms)"
              value={invocationDuration}
              onChange={(e) => setInvocationDuration(Number(e.target.value))}
              data-testid="invocation-duration"
            />
          </label>
          <button className={classes.run} aria-busy={isRunning} data-testid="run">
            Run
          </button>
        </form>
        <progress value={isRunning ? undefined : 0} />
        <table className={classes.results}>
          <thead>
            <tr>
              <th colSpan={2}>Execution time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Simple API Routes</td>
              <td>
                <span aria-busy={apiRoutesStatus.isRunning}>
                  {apiRoutesStatus.executionTime && `${apiRoutesStatus.executionTime} ms`}
                </span>
              </td>
            </tr>
            <tr>
              <td>Parallel server actions</td>
              <td>
                <span aria-busy={parallelActionsStatus.isRunning}>
                  {parallelActionsStatus.executionTime && `${parallelActionsStatus.executionTime} ms`}
                </span>
              </td>
            </tr>
            <tr>
              <td>Default server actions</td>
              <td>
                <span aria-busy={defaultActionsStatus.isRunning}>
                  {defaultActionsStatus.executionTime && `${defaultActionsStatus.executionTime} ms`}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <blockquote className={classes.small}>
          💡 All API fetches and server actions are invoked with <code>Promise.all</code>.
        </blockquote>
      </section>
      <footer className={classes.small}>
        Created by{' '}
        <a href="https://github.com/icflorescu" title="Ionuț-Cristian Florescu" target="_blank">
          Ionuț-Cristian Florescu
        </a>
      </footer>
      <div style={{ display: testMode ? undefined : 'none' }}>
        <button data-testid="test" onClick={handleTestClick} />
        {parallelActionsStatus.results && (
          <>
            <div data-testid="results-content">{parallelActionsStatus.results}</div>
            <div data-testid="results-execution-time">{parallelActionsStatus.executionTime}</div>
          </>
        )}
      </div>
    </main>
  );
}
