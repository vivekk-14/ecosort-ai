# ♻️ EcoSort AI — AI-Powered Waste Segregation & Disposal Assistant

> **1M1B AI for Sustainability Virtual Internship Project**  
> **In Collaboration with:** IBM SkillsBuild & AICTE  
> **Student Name:** Vivek Satya Bhushan Munnangi  
> **Institution:** Anil Neerukonda Institute of Technology and Sciences (ANITS)  
> **Submission Deadline:** September 21, 2026  
> **Primary SDG:** SDG 12 — Responsible Consumption and Production  
> **Secondary SDG:** SDG 11 — Sustainable Cities and Communities  

---

## 🌟 Executive Summary

**EcoSort AI** is an intelligent full-stack sustainability application that assists individuals, schools, and communities in making correct, environmentally sound waste-sorting choices. Users can upload a photo of a discarded item or describe it in natural language. The system analyzes the item using multimodal AI heuristics, providing the material breakdown, correct waste stream bin, actionable disposal steps, a sustainability tip to prevent future waste, and prominent local municipality safety advisories.

---

## 🎯 Sustainable Development Goals (SDGs) Alignment

| SDG | Target | How EcoSort AI Contributes |
| :--- | :--- | :--- |
| **SDG 12: Responsible Consumption & Production** | **Target 12.5:** Substantially reduce waste generation through prevention, reduction, recycling, and reuse. | Eliminates recycling contamination at the point of disposal and educates consumers on reusable alternatives. |
| **SDG 11: Sustainable Cities & Communities** | **Target 11.6:** Reduce the adverse per capita environmental impact of cities, including municipal solid waste management. | Assists city residents in segregating organic, recyclable, and hazardous waste properly, easing municipal sorting burdens. |

---

## 🏗️ Architecture & Technology Stack

```text
              ┌───────────────────────────┐
              │           User            │
              └─────────────┬─────────────┘
                            │
                      Image or Text
                            │
                            ▼
              ┌───────────────────────────┐
              │ React 18 + Tailwind CSS   │
              │  Vite Frontend (Port 5173)│
              └─────────────┬─────────────┘
                            │
                      REST API (JSON)
                            │
                            ▼
              ┌───────────────────────────┐
              │      FastAPI Backend      │
              │    Python 3.14 (Port 8000)│
              │  - In-Memory Pillow Check │
              │  - Pydantic v2 Validation │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │  Multimodal AI Provider   │
              │  - Google Gemini API      │
              │  - Smart Offline Heuristic│
              └─────────────┬─────────────┘
                            │
                   Strict Structured JSON
                            │
                            ▼
              ┌───────────────────────────┐
              │ Interactive UI Dashboard  │
              └───────────────────────────┘
```

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons.
- **Backend:** Python 3.14, FastAPI, Uvicorn, Pydantic v2.
- **Image Preprocessing:** Pillow (PIL) for non-persistent, in-memory validation (<5MB, valid formats).
- **AI Integration:** Vendor-neutral adapter pattern (`BaseAIProvider`). Seamlessly works with Google Gemini (`gemini-1.5-flash`) or the built-in offline heuristic fallback.

---

## 📦 Project Directory Structure

```text
ecosort-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI REST endpoints & CORS
│   │   ├── schemas.py           # Pydantic schemas (8 structured fields)
│   │   ├── utils.py             # Pillow image verification
│   │   ├── ai_service.py        # AI Provider Factory
│   │   └── providers/
│   │       ├── __init__.py
│   │       ├── base.py          # BaseAIProvider abstract interface
│   │       ├── gemini_provider.py # Gemini Multimodal API adapter
│   │       └── mock_provider.py   # Heuristic fallback provider
│   ├── test_api.py              # Automated 10-waste-case test suite
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Template for API keys
│   └── .env                     # Local environment settings
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Header & SDG 12/11 modal
│   │   │   ├── WasteInput.jsx   # Drag-and-drop uploader & text fallback
│   │   │   ├── ResultCard.jsx   # Structured result dashboard
│   │   │   └── Disclaimer.jsx   # Responsible AI & oversight notice
│   │   ├── App.jsx              # Main React orchestrator
│   │   ├── index.css            # Tailwind directives & styles
│   │   └── main.jsx             # React DOM root
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── README.md                    # Project documentation
└── .gitignore                   # Ignore .env, node_modules, build artifacts
```

---

## 🚀 Quick Start Guide (Step-by-Step)

### Prerequisites
- Node.js (v18+) & npm
- Python 3.10+ (Tested on Python 3.14)

### 1. Backend Setup & Startup
Open a terminal in `backend/`:
```bash
cd backend
python -m pip install -r requirements.txt
```

*(Optional) Configure Google Gemini API key:*
Copy `.env.example` to `.env` and paste your free API key from [Google AI Studio](https://aistudio.google.com/):
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_key_here
AI_MODEL=gemini-1.5-flash
PORT=8000
```
> *Note: If no key is set, the system automatically uses the built-in heuristic provider so you can test all waste types immediately!*

Start the backend server:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Verify the backend at: `http://127.0.0.1:8000/docs` (Interactive Swagger API documentation) or `http://127.0.0.1:8000/api/health`.

### 2. Frontend Setup & Startup
Open a second terminal in `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173` to interact with EcoSort AI!

---

## 🧪 Evaluation & Test Results (10 Representative Test Cases)

| # | Test Input | AI Result (Detected Item) | Assigned Category | Expected Category | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| 1 | Plastic water bottle | Plastic Water Bottle (PET #1) | Dry / Recyclable | Dry / Recyclable | ✅ PASS |
| 2 | Banana peel | Fruit / Vegetable Scrap | Wet / Organic | Wet / Organic | ✅ PASS |
| 3 | Cardboard box | Corrugated Cardboard Box | Dry / Recyclable | Dry / Recyclable | ✅ PASS |
| 4 | Used tissue | Used Tissue / Paper Towel | General / Non-recyclable | General / Non-recyclable | ✅ PASS |
| 5 | Aluminum can | Aluminum Beverage Can | Dry / Recyclable | Dry / Recyclable | ✅ PASS |
| 6 | Old mobile phone | Mobile Device / Electronics | E-Waste | E-Waste | ✅ PASS |
| 7 | Battery | Battery (Chemical Cell) | Hazardous / Special | Hazardous / Special | ✅ PASS |
| 8 | Greasy pizza box | Greasy / Soiled Food Container | General / Non-recyclable | General / Non-recyclable | ✅ PASS |
| 9 | Glass bottle | Glass Bottle / Jar | Dry / Recyclable | Dry / Recyclable | ✅ PASS |
| 10 | Mixed trash debris | Uncertain / Mixed Debris | Uncertain | Uncertain | ✅ PASS |

To run the automated test suite anytime:
```bash
cd backend
python test_api.py
```

---

## 🛡️ Responsible AI Principles Implemented

1. **Fairness & Diversity:** Evaluated across different waste items, soiled conditions, and partial descriptions.
2. **Transparency:** Every output card displays the detected item, material composition, confidence percentage gauge, and specific scientific rationale.
3. **Zero-Storage Privacy:** Images are verified in-memory using Python Pillow and discarded instantly. No user photos or personal identifiers are saved to disk or databases.
4. **Safety Guardrails:** Hazardous items (batteries, chemical containers, e-waste) trigger high-visibility alerts that strictly prohibit domestic disposal and direct users to authorized drop-offs.
5. **Handling Uncertainty:** Instead of hallucinating when given vague or mixed debris, the AI returns `"Uncertain"` and prompts the user for clearer input or resin identification numbers.
6. **Human & Municipal Oversight:** Prominent banner reminds users: *"AI recommendations are general guidelines. Local municipal regulations always supersede AI advice."*
