# Shorvan: A Fast Link Shortener 🚀

Welcome to **Shorvan**! This is a super-fast link shortener app designed to showcase real-time functionalities using WebSockets, the power of local storage, and the simplicity and speed of Astro. Shorvan is a project I created as a learning journey, exploring technologies I've never used before. I've incorporated Astro with Vanilla JavaScript/TypeScript for the frontend, and for the backend, I've spun up a separate project utilizing Bun, Elysia, and Turso.

- Backend Project: [Shorvan Backend](enlace)

## Features 🌟

- **Link Shortening:** Quickly shorten your long URLs.
- **Real-Time Updates:** Watch the number of shortened links update in real-time with WebSockets.
- **Persistence:** Your shortened links are saved locally using localStorage, so they're always at hand.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
