import Head from 'next/head';
import Image from 'next/image';
import { gql } from 'graphql-request';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import client from '../client';
import styles from '../styles/Home.module.css';

const query = gql`
  query MyQuery(
    $login: String!
    $username: String!
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
    devto_getArticles(username: $username) {
      id
      title
      url
    }
  }
`;

async function getResults(first, after) {
  return await client.request(query, {
    login: 'royderks',
    username: 'cerchie',
    github_token: '',
    first,
    after,
  });
}

export default function Home() {
  // This useQuery could just as well happen in some deeper child to
  // the "Posts"-page, data will be available immediately either way
  const { status, data, error, isFetching } = useQuery('results', () => getResults(5, null));

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
        {data?.github_user ? (
          <>
            <p>
              <i>Bio:</i> {data.github_user?.bio}
            </p>
            <div className={styles.grid}>
              {data.github_user?.repositories?.edges &&
                data.github_user.repositories.edges.length > 0 &&
                data.github_user.repositories.edges.map(
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
                      href={`/repository/${owner.login}/${name}`}
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
            {data.github_user?.repositories?.pageInfo?.hasNextPage && (
              <a
                href={`/?first=5&after=${data.github_user.repositories.pageInfo.endCursor}`}
              >
                Next Page &rarr;
              </a>
            )}
          </>
        ) : (
          <i>Error loading your Github information</i>
        )}

        <p></p>

        <h2>My DEV.to articles</h2>
        {data?.devto_getArticles && data.devto_getArticles.length > 0 ? (
          <div className={styles.grid}>
            {data.devto_getArticles.map(({ id, title, url }) => (
              <a key={id} href={url} className={styles.card}>
                <h2>{title} &rarr;</h2>
              </a>
            ))}
          </div>
        ) : (
          <i>Error loading your DEV.to information</i>
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

export async function getServerSideProps({
  query: { first = 5, after = null },
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('results', () => getResults(first, after));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
