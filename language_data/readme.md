# Language files

This folder contain language data for all language courses.

## Folders

All files are grouped into folders by language. Each folder is named for the two-letter [ISO language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for that language (for ex, Italian is `it`, Spanish is `es` etc).

```text
language_data/
  ├─ it/
  | ├─ lessons/
  | └─ ...
  ├─ es/
  └─ ...
```

## Lesson files

**Lesson files**, which include Markdown-formatted lessons with lists of vocabulary words, are contained in this folder.

When writing a lesson file, use a [markdown directives](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444) to embed audio into your lesson.

Here's an example:

`:word{ it="ciao }`

1. Always start with a new line, add two colons and the word "word" so we know you're embedding a word
2. Then add a JSON-style object of text. You can define your word in either the target language (in this case "it" for Italian) or the starting language (for example: `:word{ en="hello" }`).

## Dictionary files

The **full language dictionaries** are generated from the English-language [Wiktionary](https://en.wiktionary.org/) and parsed by [Wiktextract](https://github.com/tatuylonen/wiktextract). Parsed JSON language files are quite large, so they are not included in git as of yet. However they can be downloaded directly (already parsed from Wiktionary format) at [https://kaikki.org/dictionary/].
