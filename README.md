# 🛕 TempleGuardianAI & 👵 Senior Travel Multi-Agent System

A powerful multi-agent system built using [Lovable AI](https://lovable.so), designed to assist users with temple visits and senior-friendly travel planning across India.

---

## 🔮 Project Goals

This project helps users:
- Discover famous temples with timing and rituals
- Plan spiritual travel itineraries (1–5 days)
- Ensure senior citizen safety (wheelchair, hospitals, tips)
- Export plans via PDF, WhatsApp, and Google Calendar
- Enable donations/bookings via UPI or autofill links

---

## 🧠 Architecture: Multi-Agent System

Built entirely using **Lovable AI**, with no external automation tools (e.g., n8n). The system includes the following agents:

| Agent | Purpose |
|-------|---------|
| `TempleGuideAgent` | Gives temple info: history, timing, poojas |
| `TripPlannerAgent` | Creates full itinerary |
| `SeniorAdvisorAgent` | Adds medical/safety tips for elders |
| `BookingAgent` | Creates booking autofill & donation links |
| `ShareAgent` | Converts plan to PDF, WhatsApp, and Calendar |

---

## ⚙️ Lovable AI Setup

### Step 1: Create Master Prompt
Go to [VS Code] → Create Project → Paste this as your Master Promt:


You are part of a multi-agent assistant for TempleGuardianAI and Senior Travel & Tourism...
[see full prompt in /prompts/master_prompt.txt]
