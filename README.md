# Glimty

A web gift shop with its own personal assistant. The site and the chat default to Norwegian. English is the second language — switch with NO / EN in the header or in the chat.

## What you can do

- Tell the assistant who the gift is for, or tap a path: find a gift, wrap one, or keep a planner.
- Type a full sentence (`gave til pappa, bursdag, 50 dollar, han liker kaffe`) and skip the questions already answered. The assistant understands Norwegian and English.
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
| POST | `/api/chat` | `{ sessionId?, message?, payload?, locale? }` |

Sessions stay in memory on the server. The browser keeps the session id in `localStorage`.

## Layout

```
lib/assistant.js   conversation, brief, wrapping, planner
lib/i18n.js        Norwegian default, English second language
lib/locales/       product copy in Norwegian
lib/inventory.js   36 You Brands gifts, stock, categories
lib/catalog.js     assistant view of the inventory
lib/pages.js       shop, product, home, and assistant HTML
lib/sessions.js    in-memory sessions
public/            styles and client scripts
server.js          Express app
tests/             assistant and HTTP tests
```
