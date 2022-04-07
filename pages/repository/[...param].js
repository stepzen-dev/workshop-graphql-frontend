import Head from 'next/head';
import Image from 'next/image';
import { gql } from 'graphql-request';
// import client from '../../client';
import styles from '../../styles/Home.module.css';

const query = gql`
  query GetGithubRepository(
    $name: String!
    $owner: String!
    $github_token: Secret!
  ) {
    github_repository(name: $name, owner: $owner, github_token: $github_token) {
      id
      name
      description
      stargazerCount
      updatedAt
    }
  }
`;

export default function Repository(props) {
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

        <h2>My Github repository</h2>
        {props.github_repository ? (
          <a key={props.github_repository.id} href='#' className={styles.card}>
            <h2>{props.github_repository.name} &rarr;</h2>
            <p>{props.github_repository.description}</p>
            <ul>
              <li>Stars: {props.github_repository.stargazerCount}</li>
              <li>Last updated: {props.github_repository.updatedAt}</li>
            </ul>
          </a>
        ) : (
          <i>Error loading your Github information</i>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href='https://stepzen.com/getting-started?utm_source=stepzen-examples&utm_medium=default-template&utm_campaign=stepzen-examples'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image
              src='/stepzen.svg'
              alt='StepZen Logo'
              width={100}
              height={25}
            />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const [owner, name] = await params.param;

  const result = {};

  return {
    props: {
      ...result,
    },
  };
}
