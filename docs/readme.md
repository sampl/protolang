# Developer guide

This guide will show you how to develop the Protolang web application.

Before participating in our community, please see our [contributing guidelines](contributing.md) and .

## How it works

### Architecture

- Protolang is a frontend-heavy [React](https://reactjs.org/) app with React Router, Radix UI, Remark markdown, and Styled Components
- Built with [Vite](https://vitejs.dev/)
- Hosted on [Vercel](https://vercel.com/dashboard) using the Github integration
- Backend (database, auth) is [Supabase](https://supabase.com/) (Postgres platform as a service)
- Database initialization and migrations are basically raw SQL
- The frontend uses the [Supabase javascript client](https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers) to query the database directly

### Other services and data

- Text-to-speech and speech-to-text via [browser Web Speech APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Dictionaries from [Wiktionary](https://en.wiktionary.org/) via [wiktextract](https://github.com/tatuylonen/wiktextract)
- Translations with [Argos Translate](https://github.com/argosopentech/argos-translate/) via [LibreTranslate](https://libretranslate.com/)

### Data model

The Protolang database uses three Postgres schemas:

- `public` - User data lives here
- `auth` - Auth and login data, managed by Supabase (don't try to mess with it)

Tables:

- A **word** is a small word or phrase in another language. *Example: "mangiare": verb - to eat*
- **Phrases** (coming soon) are written with wildcards that are swapped out to create random new prompts for each user. *Example: "The [person] eats the [food]"*
- An **attempt** is a user trying to interact with the language, used in aggregate to create analytics. *Example: user123 tried to say "benvenuta", but they said "benvenuti" instead*
- A **mnemonic** is a hint to help you memorize a particular word. *Example: "to remember 'caber' means "to fit", imagine a bear fitting inside of a cab ("cab bear")*
- A **list** is a user-defined set of words or phrases that they wants to revisit later. *Example: My favorite words*

## Getting set up

### Install dependencies

- [Node.js](https://nodejs.org/en/download/)
- PostgreSQL - `brew install postgresql` on MacOS. (You may have to install a specific version to match Supabase, ie `brew install postgresql@15`. If so, make sure the homebrew service is running: `brew services list` and restart your computer if you see an error. Also read the notes during the brew install, you may have to update your zsh config to include the path to postgres.)
- Supabase CLI - `npm install -g @supabase/cli` (or with homebrew?)

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

### Running migrations

Set up migrations:

- Create a `.env` file in the root (`/`) directory and add the database connection string like so: `ADMIN_POSTGRES_CONNECTION_STRING=postgresql://postgres:password123@db.abc123.supabase.co:1234/postgres` (use your actual Postgres connection string from Supabase)
- Run the migration to set up tables, seed data etc: `npm run migrate` (currently works on a new database only)

See the [language directory](../languages/) for instructions on seeding and updating language data like dictionaries and lessons

### Start the web server

Start the local server: `npm run dev`

### Development

- Use our [style guide](https://protolang.com/styleguide) to keep your UI consistent with the rest of the app

- Future migrations: TODO

## Deploy

To deploy to Vercel, push to GitHub and connect a new project in the [Vercel dashboard](https://vercel.com/docs/concepts/git/vercel-for-github).

To deploy to a different static host, use `npm run build` to create a bundle in `/dist` and follow the directions for your hosting provider. See [Vite docs on building and deploying](https://vitejs.dev/guide/static-deploy.html#building-the-app).

## Troubleshooting

- Your local Postgres version must match Supabase for running some commands. Check it with `postgres -V` and update with `brew upgrade postgresql`.
- Ensure you have the right version of NPM
- Ensure your [Supabase CLI is up to date](https://supabase.com/docs/guides/cli#updates)

## TODO

- Real migrations (Prisma?)
- Move to [Next.js](https://nextjs.org/) for speed and SEO
- Build the "Coming soon" features on [the homepage](/)
- Migrate to from Javascript to Typescript
- More responsive/mobile support, PWA/mobile app?
