# MacroMint

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jennertd-bit/MarcoMint)

A calorie scanner and tracker with OCR, barcode lookup, and account-based profiles.

## Local Development

### 1) Backend (Node + Postgres)

```bash
cd "calorie-io/server"
cp .env.example .env
npm install
```

Edit `server/.env` with your Postgres connection string and secrets.

Create tables:
```bash
psql "$DATABASE_URL" -f "calorie-io/server/schema.sql"
```

Start the backend (runs migrations automatically):
```bash
npm start
```

The server runs on `http://localhost:3000` by default.

### 2) Frontend

Open `calorie-io/index.html` in your browser or run a static server:
```bash
cd "calorie-io"
python3 -m http.server 5173
```

If the backend is running on a different host, update `config.js`:
```js
window.MACROMINT_API = "https://your-backend-url";
```

## Deployment (Free)

### Backend (Render)
1. Click the "Deploy to Render" button above (or create a Web Service pointing to `calorie-io/server`).
2. Render will provision the database and run migrations on start.
3. Configure env vars in Render:
   - `JWT_SECRET`
   - `APP_BASE_URL` (Netlify URL)
   - `CLIENT_ORIGIN` (Netlify URL)
   - `PGSSLMODE=require`
   - Optional: `SMTP_*` for email.
4. Deploy.

### Frontend (Netlify)
1. Set `window.MACROMINT_API` in `config.js` to the Render URL.
2. Drag the `calorie-io` folder into Netlify Drop to deploy.
