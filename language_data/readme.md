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

## File types

**Lesson files**, which include Markdown-formatted lessons with lists of vocabulary words, are contained in this folder.

The **full language dictionaries** are generated from the English-language [Wiktionary](https://en.wiktionary.org/) and parsed by [Wiktextract](https://github.com/tatuylonen/wiktextract). Parsed JSON language files are quite large, so they are not included in git as of yet. However they can be downloaded directly (already parsed from Wiktionary format) at [https://kaikki.org/dictionary/].
