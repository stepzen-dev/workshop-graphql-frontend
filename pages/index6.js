import Head from 'next/head';
import Image from 'next/image';
import { gql } from 'graphql-request';
import client from '../client';
import styles from '../styles/Home.module.css';

const query = gql`
  query GetGithubUser(
    $login: String!
    $github_token: Secret!
    $first: Int = 5
    $after: String = null
  ) {
    github_user(login: $login, github_token: $github_token) {
      bio
      repositories(first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            owner {
              login
            }
            name
            description
            stargazerCount
            updatedAt
          }
        }
      }
    }
  }
`;

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
                    node: {
                      id,
                      owner,
                      name,
                      description,
                      stargazerCount,
                      updatedAt,
                    },
                  }) => (
                    <a
                      key={id}
                      href={`/${owner.login}/${name}`}
                      className={styles.card}
                    >
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
            {props.github_user?.repositories?.pageInfo?.hasNextPage && (
              <a
                href={`/?first=5&after=${props.github_user.repositories.pageInfo.endCursor}`}
              >
                Next Page &rarr;
              </a>
            )}
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

export async function getServerSideProps({
  query: { first = 5, after = null },
}) {
  const result = await client.request(query, {
    login: 'royderks',
    github_token: '',
    first,
    after,
  });

  return {
    props: {
      ...result,
    },
  };
}
