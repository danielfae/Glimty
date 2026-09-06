# Glimty

A web gift shop with its own personal assistant. Glimty used to live in Facebook Messenger. It now lives on the site: a marketing page, a catalog, and a conversation that keeps the brief instead of restarting every time someone says hello.

## What you can do

- Tell the assistant who the gift is for, or tap a path: find a gift, wrap one, or keep a planner.
- Type a full sentence (`gift for my dad, birthday, $50, he loves gardening`) and skip the questions already answered.
- Browse the shop: 36 gifts photographed from the You Brands catalog at you.no, grouped by drinkware, travel, bags, home, table, and outdoors.
- Open a product page for stock, colors, and the original catalog description.

## Run it

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). The full assistant is at `/assistant`.

```bash
npm test
```

## API

| Method | URL | Purpose |
| ------ | --- | ------- |
| GET | `/` | Marketing page |
| GET | `/assistant` | Full-page assistant |
| GET | `/shop` | Inventory by category |
| GET | `/gift/:id` | Individual gift page |
| GET | `/api/health` | Liveness |
| GET | `/api/catalog` | Gifts and categories |
| POST | `/api/chat` | `{ sessionId?, message?, payload? }` |

Sessions stay in memory on the server. The browser keeps the session id in `localStorage`.

## Layout

```
lib/assistant.js   conversation, brief, wrapping, planner
lib/inventory.js   36 You Brands gifts, stock, categories
lib/catalog.js     assistant view of the inventory
lib/pages.js       shop and product HTML
lib/sessions.js    in-memory sessions
public/            marketing page, assistant UI, styles
server.js          Express app
tests/             assistant and HTTP tests
```
