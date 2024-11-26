'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { runParallelAction } from '~/src';
import classes from './ClientPage.module.css';
import { echo, nonBlockingEcho } from './page.actions';

type ExecutionStatus = {
  isRunning: boolean;
  executionTime?: number;
  results?: string;
};

const defaultStatus: ExecutionStatus = { isRunning: false };

export default function ClientPage({ isTesting }: { isTesting: boolean }) {
  const [invocations, setInvocations] = useState(10);
  const [duration, setDuration] = useState(1000);

  const [apiRoutesStatus, setApiRoutesStatus] = useState<ExecutionStatus>(defaultStatus);
  const [defaultActionsStatus, setDefaultActionsStatus] = useState<ExecutionStatus>(defaultStatus);
  const [parallelActionsStatus, setParallelActionsStatus] = useState<ExecutionStatus>(defaultStatus);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // reset status
    setApiRoutesStatus(defaultStatus);
    setDefaultActionsStatus(defaultStatus);
    setParallelActionsStatus(defaultStatus);
    // prepare the array of invocations data
    const data = Array.from({ length: invocations }, (_, i) => ({ n: i + 1, duration }));

    // benchmark API routes
    setApiRoutesStatus({ isRunning: true });
    let start = Date.now();
    let results = JSON.stringify(
      await Promise.all(
        data.map(({ n, duration }) => fetch(`/api?n=${n}&duration=${duration}`).then((res) => res.json()))
      )
    );
    setApiRoutesStatus({ isRunning: false, executionTime: Date.now() - start, results });

    // benchmark parallel server actions
    setParallelActionsStatus({ isRunning: true });
    start = Date.now();
    results = JSON.stringify(await Promise.all(data.map((payload) => runParallelAction(nonBlockingEcho(payload)))));
    setParallelActionsStatus({ isRunning: false, executionTime: Date.now() - start, results });

    // benchmark default server actions
    setDefaultActionsStatus({ isRunning: true });
    start = Date.now();
    results = JSON.stringify(await Promise.all(data.map((payload) => echo(payload))));
    setDefaultActionsStatus({ isRunning: false, executionTime: Date.now() - start, results });
  };

  const handleTestClick = async () => {
    const data = Array.from({ length: invocations }, (_, i) => ({ n: i + 1, duration }));
    const start = Date.now();
    const results = JSON.stringify(
      await Promise.all(data.map((payload) => runParallelAction(nonBlockingEcho(payload))))
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
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              data-testid="duration"
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
      <div style={{ display: isTesting ? undefined : 'none' }}>
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
