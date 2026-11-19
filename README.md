# AgriPrice AI

**AI-assisted market intelligence and price forecasting for chilli and turmeric farmers in Andhra Pradesh, India.**

AgriPrice AI is a web application designed to help farmers explore agricultural market prices, compare nearby markets, understand estimated price trends, and evaluate whether selling now or holding produce may improve their expected returns.

> **Important:** This repository is an academic/demo project. Market prices, historical records, weather information, and some dashboard indicators are seeded or simulated sample data. Forecasts are estimates, not guaranteed prices or financial advice. The application should not be treated as a live government market-data service.

## Live application

- **Frontend:** [AgriPrice AI](https://agri-price-theta.vercel.app/)
- **Source code:** [GitHub repository](https://github.com/jagadeesh102/AgriPrice)
- **Backend API documentation (when the API is running):** `/docs`

## Project goals

Farmers may have difficulty comparing prices across markets and estimating the financial impact of selling immediately versus storing produce. AgriPrice brings selected market information and decision-support tools together in one interface.

The current project focuses on:
- Chilli and turmeric crops.
- Selected agricultural markets in Andhra Pradesh.
- Price trend exploration and forecast estimates.
- Estimated revenue comparison after transport and storage costs.
- An interface available in English and Telugu.

## Features

- **Market dashboard:** Browse selected markets and compare chilli and turmeric prices.
- **Price history:** View historical sample price records and summary statistics.
- **Price forecasting:** Request estimates for 7, 15, 30, 60, or 90 days.
- **Selling guidance:** View a model-generated `WAIT`, `PARTIAL_SELL`, or `SELL_NOW` suggestion with supporting rationale.
- **Revenue calculator:** Compare current and expected future revenue after estimated transport and storage costs.
- **Market insights:** Review market trends and the highest listed prices in the configured dataset.
- **Weather information:** View an agricultural weather summary (currently simulated).
- **Price alerts and notifications:** Create target-price alerts and view notifications.
- **AI chat assistant:** Ask crop and market-related questions; Gemini-backed responses require an API key.
- **Farmer accounts:** Register, log in, and manage a basic user profile.
- **Admin tools:** View dashboard statistics and import price records from a CSV file.
- **Bilingual interface:** Switch between English and Telugu.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router |
| Styling and UI | Tailwind CSS 4, Lucide React |
| Charts | Recharts |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Validation | Pydantic |
| Database | SQLite |
| Data processing | NumPy, Pandas |
| ML/runtime dependencies | scikit-learn, serialized model support |
| Authentication | JWT, Passlib, bcrypt |
| Optional AI integration | Google Gemini API |

## Architecture

```text
AgriPrice/
├── Frontend/                 # React + Vite application
│   └── src/
│       ├── components/       # Shared UI components
│       ├── context/          # Authentication and language state
│       ├── i18n/             # English and Telugu translations
│       ├── pages/            # Application pages
│       └── services/         # Frontend API client and fallbacks
├── Backend/                  # FastAPI application
│   ├── api/                  # API route modules
│   ├── database/             # SQLite connection and initialization
│   ├── ml/                   # Forecasting service and model assets
│   ├── models/               # Pydantic request/response schemas
│   └── main.py               # FastAPI application entry point
├── AI,ML/                    # Dataset and AI/ML project resources
├── agriprice.db              # SQLite database file
└── .python-version           # Python runtime version
```

## Run locally

### Prerequisites

- Python **3.11.11**
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/jagadeesh102/AgriPrice.git
cd AgriPrice
```

### 2. Set up the backend

From the repository root:

**Windows PowerShell**
```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r Backend/requirements.txt
uvicorn Backend.main:app --reload --host 127.0.0.1 --port 8001
```

**macOS / Linux**
```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r Backend/requirements.txt
uvicorn Backend.main:app --reload --host 127.0.0.1 --port 8001
```

The backend initializes the SQLite database when its database module is loaded. The default database path points to `agriprice.db` in the repository root.

- API root: [http://127.0.0.1:8001/](http://127.0.0.1:8001/)
- Interactive API docs: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

### 3. Set up the frontend

Open a second terminal at the repository root:

```bash
cd Frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (the project configuration uses port **5173**).

The Vite development server proxies `/api` requests to `http://localhost:8001`. For a separately hosted backend, set `VITE_API_URL` to the backend API base URL before building the frontend.

### 4. Optional environment configuration

The backend reads these environment variables:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Secret used to sign authentication tokens. Set a long, random value outside source control. |
| `SQLITE_DB_PATH` | Optional path to the SQLite database file. |
| `GEMINI_API_KEY` | Optional key for Gemini-backed chat responses. |
| `GOOGLE_API_KEY` | Alternative key name used as a fallback for the Gemini integration. |
| `WEATHER_API_KEY` | Weather integration configuration; the current weather endpoint returns simulated sample data. |

Do not commit real API keys, passwords, tokens, or production secrets. Configure secrets in your local environment or hosting provider's environment-variable settings.

## API overview

The backend exposes versioned routes under `/api`, including:

| Route | Purpose |
|---|---|
| `GET /api/markets` | List configured markets |
| `GET /api/markets/summary` | Market and highest-price summary |
| `GET /api/prices/current` | Current configured sample price |
| `GET /api/prices` | Historical price records |
| `POST /api/forecast` | Generate a price forecast estimate |
| `POST /api/revenue/calculate` | Calculate estimated revenue |
| `GET /api/weather` | Retrieve the sample weather summary |
| `GET /api/notifications` | List notifications |
| `POST /api/notifications/alert` | Create a target-price alert |
| `POST /api/chat` | Chat assistant endpoint |
| `GET /api/admin/dashboard` | Admin dashboard statistics |
| `GET /api/admin/model/metrics` | Forecast model metrics |
| `POST /api/admin/data/upload` | Import price data from CSV |

See the automatically generated Swagger documentation at `http://127.0.0.1:8001/docs` for request schemas and full endpoint details.

## Data and forecasting notes

- The SQLite database is initialized with sample farmer, market, historical price, and notification records when it is empty.
- The current-price and weather endpoints include demo/sample values; they do not establish a live connection to official market or meteorological feeds.
- The forecasting service can load serialized model and metrics files when present. Its current prediction path also contains a formula-based estimate, so forecast output must be treated as a prototype decision-support estimate rather than a validated guarantee.
- The frontend contains fallback/demo responses for selected API failures. A displayed value may therefore come from the frontend fallback rather than the backend.
- The repository's sample model metrics are experimental project metrics and should not be interpreted as independently verified real-world performance.

## Limitations and future improvements

- Integrate verified, regularly updated market-price and arrivals data sources.
- Connect weather forecasts to a trusted live weather provider.
- Validate and document the training pipeline, model artifact, dataset provenance, and evaluation methodology.
- Add automated backend and frontend tests.
- Strengthen production authentication, secret management, CORS configuration, and deployment database persistence.
- Add monitoring, logging, and data-refresh workflows.

## Disclaimer

AgriPrice AI is intended for learning, demonstration, and preliminary decision support. Actual mandi prices and farmer returns depend on crop quality, grade, arrivals, demand, transport, storage, weather, and other market conditions. Always verify current prices with the relevant market before making a selling decision.

## Author

**Jagadeesh Tippani**

---

If you find this project useful, feel free to explore the source code and share feedback.
