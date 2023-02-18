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
- From the [Supabase dashboard](https://app.supabase.com/projects), create a new project in your organization
- Save your Supabase project database password in a safe place

### Clone the repo

- Clone this repository: `git clone https://github.com/sampl/protolang.git`
- Move into the directory: `cd protolang`
- Rename `.env.local.example` to `.env.local` and add your Supabase credentials from the previous step
- Install dependencies from npm: `npm install --legacy-peer-deps` (note legacy deps, we need to get rid of dependencies for React 17)

### Set up the schema

- Create a `.env` file in the root (`/`) directory and add the database connection string like so: `ADMIN_POSTGRES_CONNECTION_STRING=postgresql://postgres:password123@db.abc123.supabase.co:1234/postgres` (use your actual Postgres connection string from Supabase)
- Run the migrations to set up tables: `npm run migrate` (currently works on a new database only)

### Start the web server

Start the local server: `npm run dev`

### Seed the database

Some seed scripts require a valid `created_by` value. For example, seeding Lessons won't work unless each lesson has a valid `created_by` value reference in the `admin.users` table. To set this up, we just need to give your seed scripts a valid UID to use.

- Sign into your Protolang app (not Supabase—the actual app, on `localhost`), then go to your [Supabase users dashboard](https://app.supabase.com/project/_/auth/users) and copy the User UID of your user.
- Go back to your `.env.development` file and add the UID it as `SEED_USER_ID`
- Now run `npm run seed`

You'll also want to seed the dictionary schema with the language files.

The full language dictionaries are generated from the English-language [Wiktionary](https://en.wiktionary.org/) and parsed by [Wiktextract](https://github.com/tatuylonen/wiktextract).

Parsed JSON language files are quite large, so they are not included in git as of yet. However they can be downloaded directly (already parsed from Wiktionary format) at [https://kaikki.org/dictionary/].

- Download the language files you want to use from [https://kaikki.org/dictionary/]
- Move the file into the `/data` directory
- Run `npm run update-dict -- --live`

### Configure Supabase

Back in the Supabase dashboard, you have to expose your dictionaries schema so the API can see it.

- Go to [your project's API settings](https://app.supabase.com/project/_/settings/api)
- Under "Exposed schemas", add `dictionaries`

That's it--you should be good to go!

## Deploy

To deploy to Vercel, push to GitHub and connect a new project in the [Vercel dashboard](https://vercel.com/docs/concepts/git/vercel-for-github). You'll probably want to add your public environment variables to Vercel (**DO NOT** publish your `ADMIN_POSTGRES_CONNECTION_STRING` or other secrets).

To deploy to a different static host, use `npm run build` to create a bundle in `/dist` and follow the directions for your hosting provider. See [Vite docs on building and deploying](https://vitejs.dev/guide/static-deploy.html#building-the-app).

To self-host Protolang on your own server:

- Create a separate Supabase project for production.
- Add all the database connection information to a new `.env.production` file
- Edit the [auth config in Supabase](https://app.supabase.com/project/_/auth/url-configuration) with the URL you wan to host on
- Edit `update-dict.js` and `migrate.js` to temporarily point to your production database (TODO - better way to hand environment switching)
- Run `npm run migrate` and `npm run update-dict -- --live` to set up the database and seed it with the language files on the new db
- You may want to manually copy/paste in some of the files in `/scripts/seed` to seed the database with some initial data (like languages). Be careful to replace instances of `USER_ID` with your production user ID.

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
