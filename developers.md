# Developer guide

Before contributing, please read our [contributing guidelines](https://github.com/sampl/protolang/blob/main/contributing.md) and [code of conduct](https://github.com/sampl/protolang/blob/main/conduct.md).

## Getting set up

### Create API accounts

You'll need an [OpenAI account](https://platform.openai.com/signup) and private key to run AI chats.

### Install dependencies

- [Node.js](https://nodejs.org/en/download/)
- [Deno](https://deno.land/) for Edge Functions - `brew install deno` on MacOS
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
- Run the migrations to set up tables: `npm run db:migrate` (currently works on a new database only)

### Start the web server

Start the local server: `npm run dev`

### Set up authentication

Follow the [Supabase auth guide](https://supabase.com/docs/guides/auth/social-login/auth-google) to set up Google authentication.

### Seed the database

Before you can run the app, you'll need to seed the database with some basic data.

Some seed scripts require a valid `created_by` value. For example, seeding Lessons won't work unless each lesson has a valid `created_by` value reference in the `admin.users` table. To set this up, we just need to give your seed scripts a valid UID to use.

- Sign into your Protolang app (not Supabase—the actual app, on `localhost`), then go to your [Supabase users dashboard](https://app.supabase.com/project/_/auth/users) and copy the User UID of your user.
- Go back to your `.env.development` file and add the UID it as `SEED_USER_ID`
- Now run `npm run seed`

You'll probably also want to seed the app with language data collected from other sources or the live version of Protolang.

The full language dictionaries are generated from the English-language [Wiktionary](https://en.wiktionary.org/) and parsed by [Wiktextract](https://github.com/tatuylonen/wiktextract). Parsed JSON language files are quite large, so they are not included in git as of yet. However they can be downloaded directly (already parsed from Wiktionary format) at [https://kaikki.org/dictionary/].

- Download the language files you want to use from [https://kaikki.org/dictionary/]
- Move the file into the `/data` directory
- Run `npm run import:dictionary -- --live`

To seed lessons and phrases:

- [Download lesson and phrase dumps](https://protolang.com/open-source)
- Unzip the files, and place the unzipped folder in the `/data` folder of your repo
- Run `npm run seed:lessons` and `npm run seed:phrases`

The lesson and phrase file formats change occasionally as the app evolves. If you get an error, you may need to update the seed scripts to match the new format.

### Configure Supabase

Back in the Supabase dashboard, you have to expose your dictionaries schema so the API can see it.

- Go to [your project's API settings](https://app.supabase.com/project/_/settings/api)
- Under "Exposed schemas", add `dictionaries`. (This will not work unless you've run the migrations first.)

That's it--you should be good to go!

### Working with functions

Prerequisites:

- [Install the Supabase CLI](https://supabase.com/docs/guides/cli) with `brew install supabase/tap/supabase` on MacOS or NPM or whatever you need.
- Set env vars on servers by updating .env files and running `npm run functions:setSecrets:dev` and/or `npm run functions:setSecrets:prod`

For developing functions locally:

- Install Docker and run it
- `npm run functions:serve`

## Deploy

To deploy to Vercel, push to GitHub and connect a new project in the [Vercel dashboard](https://vercel.com/docs/concepts/git/vercel-for-github). You'll probably want to add your public environment variables to Vercel (**DO NOT** publish your `ADMIN_POSTGRES_CONNECTION_STRING` or other secrets).

Deploy functions to Supabase servers with `npm run functions:deploy:dev` and/or `npm run functions:deploy:prod`

## Self-hosting

These instructions apply only to those hosting a full version of Protolang on their own server. If you just want to contribute to the Protolang project, you can skip this.

To self-host the Protolang backend:

- Create a separate Supabase project for production.
- Add all the database connection information to a new `.env.production` file
- Edit the [auth config in Supabase](https://app.supabase.com/project/_/auth/url-configuration) with the URL you wan to host on
- Edit `import/dictionary.js` and `migrate.js` to temporarily point to your production database (TODO - better way to hand environment switching)
- Run `npm run db:migrate` and `npm run import:dictionary -- --live` to set up the database and seed it with the language files on the new db
- You may want to manually copy/paste in some of the files in `/scripts/seed` to seed the database with some initial data (like languages). Be careful to replace instances of `USER_ID` with your production user ID.

To deploy the frontend, use `npm run build` to create a bundle in `/dist` and follow the directions for your hosting provider. See [Vite docs on building and deploying](https://vitejs.dev/guide/static-deploy.html#building-the-app).

## Troubleshooting

- Your local Postgres version must match Supabase for running some commands. Check it with `postgres -V` and update with `brew upgrade postgresql`.
- Ensure you have the right version of NPM
- Ensure your [Supabase CLI is up to date](https://supabase.com/docs/guides/cli#updates)

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

## TODO

- Migrate to from Javascript to Typescript
- Move to [Next.js](https://nextjs.org/) for speed and SEO
- Real migrations (Prisma?)
- More responsive/mobile support, PWA/mobile app?
