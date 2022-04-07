## Getting Started

Clone this repository (or fork it) and install all dependencies by running:

```bash
npm i
# or
yarn
```

After the installation is completed, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Mocked data from and DEV.to is being pulled into the application using GraphQL and StepZen.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Exercises

### Excercise 1

This application is using a mocked GraphQL API for Github and DEV.to, you can explore it in [StepZen GraphQL Studio](https://graphql.stepzen.com/devto,github) or using GraphiQL. From StepZen GraphQL Studio you can find the GraphQL API endpoint that leads to GraphiQL in the top-right of your screen (or [here](https://graphql39.stepzen.net/api/39ecd3e09001763c963ca2053649ad85/__graphql)).

Run the following query that will combine information from a (mocked) Github user and its repositories, and articles from DEV.to:

```graphql
{
  github_user(login: "githubteacher") {
    bio
    repositories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
  devto_getArticles(username: "cerchie") {
    title
    url
  }
}
```

Can you alter the query so it will also get the `description`, `stargazerCount` (number of stars) and the `updatedAt` fields from Github? This query needs to be added to the function that fetches the data from the GraphQL API in `pages.index.js`.

<details>
<summary>Show solution</summary>
<p>
The new query becomes:

```graphql
{
  github_user(login: "githubteacher") {
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
  devto_getArticles(username: "cerchie") {
    title
    url
  }
}
```

This must be added to the `fetch` function on line 81. Save your code and return to the application on [http://localhost:3000](http://localhost:3000) to see more information being displayed for the (mocked) repositories.

</p>
</details>

### Excercise 2

The query you've used in the previous exercise has a query parameter, which can be better handled from a named query. Next to helping you to handle query variables, mamed queries are important for your GraphQL API and Client later, as they are often used for caching purposes.

Go to StepZen GraphQL Studio or GraphiQL and change the query to a named one that takes the `login` query parameter. Also, use this named query in the `fetch` function in `pages/index.js`. How would you handle the variable for the query paramater?

Hint: It doesn't matter how you name your query.

<details>
<summary>Show solution</summary>
<p>

The named query must be added to the `fetch` function around line 81. The query and the variable for the query parameter are added as follows:

// Add url to git commit

</p>
</details>

### Excercise 3

So far we've been using mocked data to get the Github and DEV.to information, but let's use some real data. More importantly, your own Github data (and DEV.to if you have an account)! From StepZen GraphQL Studio you can select to use mocked data, or actual data for which you need to have a Github Personal Access Token. Create a Github personal access token [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

After creating a Github Personal Access Token go to StepZen GraphQL Studio and deselect the "mocked" toggle. The GraphQL schema for this endpoint will change and a new endpoint will be generated. You can find the new endpoint in the top-right of the screen (or [here](https://graphql07.stepzen.net/api/0777b07452dfe5d76ce46a4fecb3918d/__graphql)).

Try getting your own Github repositories by adding your Personal Access Token for the `github_token` query parameter in GraphiQL, and replace the GraphQL API endpoint and query in `pages/index.js` with new ones.

<details>
<summary>Show solution</summary>
<p>

The GraphQL API endpoint needs to be replaced with the new one, which has a different GraphQL schema that is requesting the data from the actual Github API. Also, it takes a value for `github_token` to get your data from Github.
// Add url to git commit

</p>
</details>

### Excercise 4

Let's start using a JavaScript / GraphQL fetching library to get our data now, which you need to install from npm:

```bash
npm i graphql graphql-request
# or
yarn add graphql graphql-request
```

After installing these, you can replace the `fetch` method with the `request` method. This should look something like this:

```js
import { request, gql } from 'graphql-request';

const query = gql`
  {
    Movie(title: "Inception") {
      releaseDate
      actors {
        name
      }
    }
  }
`;
request('YOUR_GRAPHQL_ENDPOINT', query, {
  /* variables */
}).then((data) => console.log(data));
```

Replace the GraphQL API endpoint, query and variables with the correct values!

<details>
<summary>Show solution</summary>
<p>

// Add url to git commit

</p>
</details>

### Excercise 5

Suppose you want to do multiple queries from your application, like to get a specific repository when you click a link. You don't want to duplicate the configuration for your GraphQL request in every method. Instead, you can create a `client` instance, that can be used for every query you want to run. Create a new file called `client.js` in which you define this instance https://github.com/prisma-labs/graphql-request#usage.

Refactor the `request` method in `pages/index.js` to use the client instance. Also, open the file `repository/[...params].js`. Import the client and use a `request` method to get the data for this page. The page should display a specific repository based on the params in the URL, e.g. `http:localhost:3000/repository/stepzen-dev/examples` should show the repository from (https://github.com/stepzen-dev/examples)[https://github.com/stepzen-dev/examples].

Hint: The `a` element to visit a repository detail page should look like `<a key={id} href={`/${owner.login}/${name}`} className={styles.card}>`. Where would you get this information from?

<details>
<summary>Show solution</summary>
<p>

In `client.js` you should have the following. Include an `Authentication` header with your StepZen API Key if you're not using the StepZen GraphQL Studio endpoint, but have deployed the schema on your own account.

// Add url to git commit

In `pages/index.js` you need to import `client` from the file `client.js`, and use the `request` method from this client instance to query the GraphQL API:

// Add url to git commit

Also, change the `query` so it will get the `owner` field:

// Add url to git commit

Finally, in `repository/[...params].js` you should import the client instance so the repository data will be requested from the GraphQL API.

// Add url to git commit

</p>
</details>

### Excercise 5 - BONUS

when you're reusing fields in GraphQL queries, you can make use of a Fragment. The queries used in `pages/index.js` and `pages/repository/[...param].js` both need fields from a Github repository. How would you write this fragment?

<details>
<summary>Show solution</summary>
<p>

```js
const query = gql`
  fragment RepositoryFields on Github_Repository {
    id
    name
    description
    stargazerCount
    updatedAt
  }

  query GetGithubRepository(
    $name: String!
    $owner: String!
    $github_token: Secret!
  ) {
    github_repository(name: $name, owner: $owner, github_token: $github_token) {
      ...RepositoryFields
    }
  }
`;
```

</p>
</details>

### Excercise 6

Our GraphQL API supports cursor-based pagination, which we can make use of in the application. If you'd look at the following query:

```graphql
query MyQuery(
  $login: String!
  $username: String!
  $github_token: Secret!
  $first: Int!
  $after: String!
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
```

The query parameters for `first` and `after` are used for pagination. With `first` you define the amount of results, while `after` is the cursor of the last result on the previous page. Think of `cursor` as `offset` which you might know from other pagination methods. To dynamicall get the value for `after` you should use the value from the `endCursor` field in `pageInfo`. Also, `hasNextPage` lets you know if there is a next page based on the values for `first` and `endCursor`.

Implement pagination for the repositories in `pages/index.js`. Use a small value for `first` if you don't have many repositories linked to your Github account.

<details>
<summary>Show solution</summary>
<p>

// Add url to git commit

</p>
</details>

### Excercise 7

Let's convert our files to TypeScript, so we can autogenerate the code to do our requests to the GraphQL API. First, install GraphQL Codegen and it's dependencies:

```bash
npm i @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-graphql-request
# or
yarn add @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-graphql-request
```

Create a new file called `codegen.yml` with the following contents:

```yaml
overwrite: true
schema: 'https://graphql07.stepzen.net/api/0777b07452dfe5d76ce46a4fecb3918d/__graphql'
documents: '**/*.graphql'
generates:
  graphql.ts:
    plugins:
      - 'typescript'
      - 'typescript-graphql-request'
```

Then create a file called `queries.graphql` and add all the queries from `pages/index.js` and `pages/repository/[...param].js` into it.

Finally, add the `generate` script to your `package.json` file:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate": "graphql-codegen --config codegen.yml"
  }
```

You can run `npm run generate` or `yarn generate` and a new file called `graphql.ts` is generated. This has types for your GraphQL schema from the URL from StepZen GraphQL Studio (or your own GraphQL API endpoint) and for the queries as defined in `queries.graphql`. Use the generate code for GraphQL Request in the application!

<details>
<summary>Show solution</summary>
<p>

// Add url to git commit

</p>
</details>

### Excercise 8 - BONUS

You can use React Query to add caching, prefetching, refetching and tons of other features to your GraphQL application. See [here](https://react-query.tanstack.com/examples/basic-graphql-request) for more information on React Query for GraphQL, as we're doing Server-side requests in this application make sure to follow [these docs](https://react-query.tanstack.com/guides/ssr) while setting up.

<details>
<summary>Show solution</summary>
<p>

Install `react-query` from npm:

```bash
npm i react-query
# or
yarn add react-query
```

And make the following changes

// Add url to git commit

</p>
</details>

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Getting Started with StepZen](https://stepzen.com/getting-started) - quickstarts for StepZen.

You can check out [the StepZen GitHub repository](https://github.com/stepzen-dev/examples/) - your feedback and contributions are welcome!
