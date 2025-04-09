# Translate the i18n

## Steps

### List the available languages

In `src/i18n`, you will find files associated with each language (except `index.ts`). Extract them into a list of strings.

Example: `['ar', 'bg', 'de', 'ro', ...]`

### Translate each language

For each language, create a new chat (or thread), as it's better to focus on a single, specific task.

In each task, you'll receive the object from `en.ts` and translate each value (not the keys—you must keep the object structure unchanged). Afterward, update the file associated with the corresponding language.

For example, if you're translating the `ro` language, you will update `ro.ts` with:
```ts
// ...imports 

export const ro: CustomTranslationsObject = {
    totpPlugin: {
        authApp: 'Aplicație de autentificare',
        // ... rest of the object
    },
}; 
```

