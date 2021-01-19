import Head from 'next/head';
import { useQuery } from '@apollo/client';

import { ALL_JOBS_QUERY } from 'graphql/queries';

import styles from '../styles/Home.module.css';

export default function Home() {
  const { loading, error, data } = useQuery(ALL_JOBS_QUERY);

  if (error) {
    return <div>Error loading jobs</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  const { jobs: allJobs } = data;

  console.log('ALL JOBS => ', allJobs);
  return (
    <div className={styles.container}>
      <Head>
        <title>Post Jobs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <code>Jobs Post</code>
        </h1>
      </main>
    </div>
  );
}
