# Learning new languages should be easy and free

Protolang is an online language-learning website focused supporting multiple learning styles.

Do you speak multiple languages, and/or do you have experience teaching languages? [Help us develop our courses](contributing.md)

## ⚠️⚠️⚠️ Warning: extremely early alpha software ⚠️⚠️⚠️

*Very unstable and incomplete*, use at your own risk

## Features

- 🧑‍🏫 **Lessons** - Complete lessons on phrases, vocabulary, verb tenses, writing, pronunciation, history etc. Supports embedded audio and video.
- 🃏 **Practice** - Duolingo-style flashcards with spaced repetition for retaining what you learned. Generates audio and listens to you practice with browser speech APIs.
- ☝️ **Memorization hints** - User-contributed mnemonics to speed up rote vocabulary memorization
- 📖 **Dictionary** - Complete searchable list of 40k+ words with definitions, conjugations, etc
- 📊 **Analytics** - Dashboard to track your progress toward fluency, with Github-style activity heatmap, vocabulary scores, etc
- 🌏 **Resource library** - Ratings of other products and links that might be useful when learning a new language

## Philosophy

We believe in:

1. Audio-first learning
2. Offering different tools for different learning styles
3. Free and open source software

See our [blog post](TODO) on the teaching philosophy

## Under the hood

- Protolang is a frontend-heavy [React](https://reactjs.org/) app with React Router, Radix, Remark, and Styled Components
- Built with [Vite](https://vitejs.dev/), hosted on [Vercel](https://vercel.com/dashboard)
- Backend (database, auth) is [Supabase](https://supabase.com/) (Postgres platform as a service)
- Text-to-speech and speech-to-text via [browser Web Speech APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Dictionaries from [Wiktionary](https://en.wiktionary.org/) via [wiktextract](https://github.com/tatuylonen/wiktextract)
- Translations with [Argos Translate](https://github.com/argosopentech/argos-translate/) via [LibreTranslate](https://libretranslate.com/)

### Core concepts

- A **word** is a small word or phrase in another language. *Example: "mangiare": verb - to eat*
- **Phrases** are written with wildcards that are swapped out to create random new prompts for each user. *Example: "The [person] eats the [food]"*
- An **attempt** is a user trying to interact with the language. An attempt is generated when the user tries a flash card, but also when they type in a chat or pronounce a word during a lesson. *Example: user123 tried to say "benvenuta, but they said "benvenuti" instead*
- A **mnemonic** is a hint to help you memorize a particular word. *Example: "to remember 'caber' means "to fit", imagine a bear fitting inside of a cab (cab-bear)*
- A **list** is a user-defined set of words or phrases that they wants to revisit later. They can be used in practice mode. *Example: My favorite words*

## Development

For developers who want to contribute to Protolang, or those who want to host their own version of the site. See also our[contributor guidelines](contributing.md).

### Create a database

Protolang is built on Supabase, a Postgres platform as a service.

- Create a [Supabase](https://supabase.com/) project
- Copy your Supabase project database credentials

### Clone the repo

- Go to your command line
- Clone this repository: `git clone https://github.com/sampl/protolang.git`
- Move into the directory: `cd protolang`
- Rename `.env.local.example` to `.env.local` and add your Supabase credentials from the previous step
- Install dependencies from npm: `npm install`

### Migrations

There are two kinds of scripts:

- **Schema migrations** define tables, columns, views, Postgres functions etc. They are written using [library](TODO) which makes sure each migrations run *once (and only once)* per environment.
- **Data imports** empty and repopulate tables to keep language data up to data. For example, they update the latest version of a language dictionary, update lessons from markdown files, or update the list of languages. They should be run *often* to keep the database up to date with the repository.

To run migrations

- Create a `.env` file in the `/scripts` directory and add the database connection string like so: `ADMIN_POSTGRES_CONNECTION_STRING=postgresql://postgres:password123@db.abc123.supabase.co:1234/postgres` (use your actual Postgres connection string from Supabase)
- Run schema migrations to prepare the database: `npm run migrate`
- Run data migrations: `npm ??????`

### Running the app

Start the local server: `npm run dev`

### Deploy

To deploy to Vercel, push to GitHub and connect a new project in the [Vercel dashboard](https://vercel.com/docs/concepts/git/vercel-for-github).

To deploy to a different static host, use `npm run build` to create a bundle in `/dist` and follow the directions for your hosting provider. See [Vite docs on building and deploying](https://vitejs.dev/guide/static-deploy.html#building-the-app).

## Roadmap

A *very incomplete list* of things we may (or may not) build in the future. [Learn how you can help](contributing.md)

New languages

- More language courses
- Translate the app to more languages so non-English speakers can learn new languages too

Features

- Chat bot?
- Writing prompts/free writing/morning pages?
- Cognates between languages
- More analytics

Tech improvements

- Move to [Next.js](https://nextjs.org/) for speed and SEO
- Migrate to Typescript from JS
- PWA (Progressive Web App) support
- Mobile app?

## Community

- [Github discussions](TODO) - For feature requests
- [Github issues](TODO) - Reporting bugs
- [Discord](TODO) - Language practice rooms, hanging out
- [Email](mailto:sam@directedworks.com) - Issues with patron billing, press contact, etc

## Contribute

Help wanted! See our [Contributors guidelines](contributing.md)

## License

- Web app is [GPL](license.txt)
- Lesson content is [Creative Commons](language/license.txt)
