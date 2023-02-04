# Developer guide

This guide will show you how to develop the Protolang web application.

Before participating in our community, please see our [contributing guidelines](contributing.md) and .

## Architecture

- Protolang is a frontend-heavy [React](https://reactjs.org/) app with React Router, Radix, Remark, and Styled Components
- Built with [Vite](https://vitejs.dev/), hosted on [Vercel](https://vercel.com/dashboard)
- Backend (database, auth) is [Supabase](https://supabase.com/) (Postgres platform as a service)
- Text-to-speech and speech-to-text via [browser Web Speech APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Dictionaries from [Wiktionary](https://en.wiktionary.org/) via [wiktextract](https://github.com/tatuylonen/wiktextract)
- Translations with [Argos Translate](https://github.com/argosopentech/argos-translate/) via [LibreTranslate](https://libretranslate.com/)

## Data model

- A **word** is a small word or phrase in another language. *Example: "mangiare": verb - to eat*
- **Phrases** are written with wildcards that are swapped out to create random new prompts for each user. *Example: "The [person] eats the [food]"*
- An **attempt** is a user trying to interact with the language. An attempt is generated when the user tries a flash card, but also when they type in a chat or pronounce a word during a lesson. *Example: user123 tried to say "benvenuta", but they said "benvenuti" instead*
- A **mnemonic** is a hint to help you memorize a particular word. *Example: "to remember 'caber' means "to fit", imagine a bear fitting inside of a cab ("cab bear")*
- A **list** is a user-defined set of words or phrases that they wants to revisit later. They can be used in practice mode. *Example: My favorite words*

## Getting set up

### Create a database

Protolang is built on [Supabase](https://supabase.com/), a Postgres platform-as-a-service.

- [Sign up for Supabase](https://app.supabase.com/sign-up)
- From the [Supabase dashboard](https://app.supabase.com/projects), create a new project
- Save your Supabase project database credentials, you'll need these in a moment

### Clone the repo

- Clone this repository: `git clone https://github.com/sampl/protolang.git`
- Move into the directory: `cd protolang`
- Rename `.env.local.example` to `.env.local` and add your Supabase credentials from the previous step
- Install dependencies from npm: `npm install`

### Migrations

There are two kinds of scripts:

- **Schema migrations** define tables, columns, views, Postgres functions etc. For example, they create a new table, add a new column, or create a new view. They should be run *once* when the database is first created.
- **Data imports** empty and repopulate tables to keep language data up to data. For example, they update the latest version of a language dictionary, update lessons from markdown files, or update the list of languages. They should be run *often* to keep the database up to date with the repository.

To run migrations

- Create a `.env` file in the `/scripts` directory and add the database connection string like so: `ADMIN_POSTGRES_CONNECTION_STRING=postgresql://postgres:password123@db.abc123.supabase.co:1234/postgres` (use your actual Postgres connection string from Supabase)
- Run schema migrations to prepare the database: `npm run migrate`
- Run data migrations: `npm ??????`

See the [language directory](../languages/) for instructions on seeding and updating language data like dictionaries and lessons.

### Running the app

Start the local server: `npm run dev`

### Development

- Use our [style guide](https://protolang.com/styleguide) to keep your UI consistent with the rest of the app

### Deploy

To deploy to Vercel, push to GitHub and connect a new project in the [Vercel dashboard](https://vercel.com/docs/concepts/git/vercel-for-github).

To deploy to a different static host, use `npm run build` to create a bundle in `/dist` and follow the directions for your hosting provider. See [Vite docs on building and deploying](https://vitejs.dev/guide/static-deploy.html#building-the-app).

## TODO

- Prisma for managing the database schema
- Move to [Next.js](https://nextjs.org/) for speed and SEO
- Migrate to from Javascript to Typescript
- More responsive support
- "Coming soon" features on [the homepage](/)
- PWA support
- Mobile app?
