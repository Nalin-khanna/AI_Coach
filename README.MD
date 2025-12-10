# AI Instructional Coach Prototype

A prototype that analyzes audio using Google Gemini Flash and provides feedback.

**Tech Stack:** React (Vite) | Python (FastAPI) + Google Gen AI SDK

---

## Prerequisites

* **Python 3.9+**
* **Node.js 18+**
* **Google Gemini API Key** (Get one [here](https://aistudio.google.com/app/apikey))

---

##  Setup Instructions

### 1. Backend (Python/FastAPI)

Open a terminal and navigate to the `server` folder:

```bash
cd server

# Setup Virtual Environment

# Mac/Linux
python3 -m venv .venv
source ./.venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate

#Install dependencies
pip install -r requirements.txt
```

Configure Environment: Create a file named .env inside the server/ folder and add your key:

```bash
GEMINI_API_KEY=AIzaSy...YourKeyHere
```

Start the Server:
```bash
python3 main.py
```
Open a new terminal and navigate to the client folder:

```bash
cd client
```
Install Dependencies:
```bash
npm install

npm run dev
```
