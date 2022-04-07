import Head from 'next/head';
import Image from 'next/image';
import { gql, request } from 'graphql-request';
import styles from '../styles/Home.module.css';

const query = gql`
  query MyQuery(
    $login: String!
    $username: String!
    $github_token: Secret!
    $first: Int = 5
  ) {
    github_user(login: $login, github_token: $github_token) {
      bio
      repositories(first: $first) {
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
      title
      url
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

        <p></p>

        <h2>My DEV.to articles</h2>
        {props?.devto_getArticles && props.devto_getArticles.length > 0 ? (
          <div className={styles.grid}>
            {props.devto_getArticles.map(({ id, title, url }) => (
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

export async function getServerSideProps() {
  const result = await request(
    'https://graphql07.stepzen.net/api/0777b07452dfe5d76ce46a4fecb3918d/__graphql',
    query,
    {
      login: 'royderks',
      username: 'cerchie',
      github_token: '',
    },
  );

  return {
    props: {
      ...result,
    },
  };
}
