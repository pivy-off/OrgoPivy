# OrgoPivy API

## AI setup (DeepSeek — recommended, free credits)

1. Create an account at [platform.deepseek.com](https://platform.deepseek.com) (no credit card required for the new-user API grant).
2. Copy your API key from the dashboard.
3. Create `api/.env` from the example:

```bash
cp .env.example .env
```

4. Set:

```env
DEEPSEEK_API_KEY=your_key_here
AI_PROVIDER=auto
```

5. Start the API:

```bash
cd api
uvicorn app.main:app --reload --port 8000
```

OrgoPivy uses **DeepSeek first** when `DEEPSEEK_API_KEY` is set, otherwise **Gemini** if `GEMINI_API_KEY` is set.

### Endpoints

| Route | Purpose |
|-------|---------|
| `GET /ai/status` | Which provider is active |
| `POST /ai/ask` | Topic tutor chat |
| `POST /ai/study-guide` | Markdown study guide |
| `POST /ai/audio-brief` | Podcast-style transcript |
| `POST /ai/fresh-questions` | Generate MCQs |
| `POST /ai/explain-mistake` | Wrong-answer explanation |

Legacy `/gemini/*` routes mirror `/ai/*` for older clients.

### Cost note

DeepSeek’s **web chat** is free; the **API** includes a **free token grant for new accounts**, then very low pay-as-you-go pricing (`deepseek-chat`). There is no unlimited free API tier—configure your own key so usage stays on your grant/balance.
