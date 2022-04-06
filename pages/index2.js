import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js + GraphQL App</title>
        <meta name='description' content='Next.js + GraphQL App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span>GraphQL</span>
        </h1>

        <p className={styles.description}>
          This application renders information from Github using GraphQL.
          <br />
          Built with <a href='https://nextjs.org'>Next.js</a>,{' '}
          <a href='https://stepzen.com/getting-started'>StepZen</a> and GraphQL
        </p>

        <h2>My Github repositories</h2>
        {props.github_user ? (
          <>
            <p>
              <i>Bio:</i> {props.github_user?.bio}
            </p>
            <div className={styles.grid}>
              {props.github_user?.repositories?.edges &&
                props.github_user.repositories.edges.length > 0 &&
                props.github_user.repositories.edges.map(
                  ({
                    node: { id, name, description, stargazerCount, updatedAt },
                  }) => (
                    <a key={id} href='#' className={styles.card}>
                      <h2>{name} &rarr;</h2>
                      <p>{description}</p>
                      <ul>
                        <li>Stars: {stargazerCount}</li>
                        <li>Last updated: {updatedAt}</li>
                      </ul>
                    </a>
                  ),
                )}
            </div>
          </>
        ) : (
          <i>Error loading your Github information</i>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const result = await fetch(
    'https://graphql69.stepzen.net/api/690af4e7ebf2cdcbd4fb6200eb503c4f/__graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query GetGithubUser($login: String!) {
          github_user(login: $login) {
            bio
            repositories {
              edges {
                node {
                  id
                  name
                  description
                  stargazerCount
                  updatedAt
                }
              }
            }
          }
        }`,
        variables: {
          login: 'githubteacher',
        },
      }),
    },
  ).then((res) => res.json());

  return {
    props: {
      ...result?.data,
    },
  };
}
