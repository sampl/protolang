# Learning new languages should be easy and free

[Protolang](https://protolang.com/about) is an online language-learning website focused supporting multiple learning styles.

Do you speak multiple languages, and/or do you have experience teaching languages? [Help us develop our courses](contributing.md)

{% warning %}
  ⚠️⚠️⚠️ **Warning:** extremely early alpha software ⚠️⚠️⚠️
  *Very unstable and incomplete*, use at your own risk
{% endwarning %}

## Features


- **🧑‍🏫 Lessons** - complete courses in vocabulary, pronunciation, grammar, tenses, common phrases, and culture
- **☝️ Flashcards** - Duolingo-style audio flashcards for practicing and retaining what you learned
- **💡 Memorization hints** - user-contributed tips to help you speed up rote vocabulary memorization
- **📖 Dictionaries** - searchable list of 40k+ words with definitions, conjugations, etc
- **📺 Media** - watch and listen: videos, podcasts, radio and more
- **📈 Analytics** - track your progress toward fluency, with vocabulary, days practiced, and more
- **💬 Chat** - (coming soon) realistic AI-powered conversations in your target language
- **🏰 Stories &amp; prompts** - (coming soon) read and write about realistic scenarios matched to your skill level
- **👨‍👩‍👧‍👦 Community** - (coming soon) practice with other language learners from around the world
- **🌍 Resource library** - (coming soon) other apps to round out your knowledge, ranked by our community

## Under the hood

- Protolang is a frontend-heavy [React](https://reactjs.org/) app with React Router, Radix, Remark, and Styled Components
- Text-to-speech and speech-to-text via [browser Web Speech APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Built with [Vite](https://vitejs.dev/), hosted on [Vercel](https://vercel.com/dashboard)
- Backend (database, auth) is [Supabase](https://supabase.com/) (Postgres platform as a service)
- Dictionaries and pronunciation guides from [Wiktionary](https://en.wiktionary.org/) via [wiktextract](https://github.com/tatuylonen/wiktextract)
- Translations with [Argos Translate](https://github.com/argosopentech/argos-translate/) via [LibreTranslate](https://libretranslate.com/)

## 💻 Docs

[Development documentation](docs/readme.md)

## 👨‍👩‍👧‍👦 Community

- 💡 [Github discussions](https://github.com/sampl/protolang/discussions) (coming soon) - For feature requests
- ⚠️ [Github issues](https://github.com/sampl/protolang/issues) (coming soon) - Reporting bugs
- ✉️ [Email](mailto:sam@directedworks.com) - Issues with patron billing, press contact, etc

## 🙌 Contribute

Help wanted! [Learn how you can contribute](contributing.md) or [sponsor](https://protolang.com/sponsor).

## ⚖️ License

- Web app is [GPL](license.txt)
- Lesson content is [Creative Commons](language/license.txt)
