# 🎓 Student Stress Prediction & Management Platform  
### An Open Innovation Project by Team HACKWAVE  
[🔗 GitHub Repository](https://github.com/HACKWAVE2025/B43/tree/main)

---

## 🌍 Problem Addressed  

University students often face *high stress levels* due to academic pressure, poor sleep habits, and digital overload.  
These factors contribute to burnout, declining performance, and mental fatigue — problems that are usually addressed *only after* negative impacts are visible.  

For *female students*, stress can be further influenced by **hormonal and physical changes** during their menstrual cycle — a dimension that most mental health tools ignore.

---

## 💡 Proposed Solution  

This web-based platform provides *real-time stress prediction* and *personalized mental health insights* using data from wearables, academic inputs, and journaling.  

### 🧠 Dual ML Models
1. **Primary Stress Classifier**  
   Predicts stress levels (*No, Low, Moderate, High*) using academic, lifestyle, and wearable data.  
2. **Period-Aware Regressor**  
   A complementary model that analyzes menstrual cycle patterns for female students to provide accurate stress adjustments.  

### 💬 Personalized Support
- **Gemini API** generates customized, context-aware stress-relief recommendations based on the user’s journal and historical trends.  
- **D3.js dashboard** visualizes stress history, feature importance, and completion rates to help students understand and manage their well-being better.  

---

## ⚙ Tech Stack  

| Layer | Technology Used | Description |
|-------|-----------------|--------------|
| **Frontend** | React.js, Tailwind CSS, D3.js | Interactive dashboard, responsive design, data visualization |
| **Backend** | Node.js (Express) | API server handling data aggregation and ML predictions |
| **Database** | MongoDB | Stores user data, predictions, and journaling inputs |
| **Authentication** | Firebase OAuth + JWT | Secure user authentication and sessions |
| **Machine Learning** | TensorFlow, Random Forest Classifier & Regressor | Predicts stress levels and menstrual stress impacts |
| **AI Integration** | Gemini API | Recommendation generation and suicidality detection |
| **Data Input** | Wearables + Manual/Excel Upload | Collects BPM, sleep duration, steps, SpO₂, etc. |
| **Visualization** | D3.js | Displays stress trends, feature impacts, and progress metrics |

---

## 🧭 System Flow  

```mermaid
flowchart TD
    A[User Authentication via Firebase] --> B[Data Collection]
    B --> C[Wearable Data and Survey Inputs]
    C --> D[ML Prediction Layer: TensorFlow + RF Models]
    D --> E[Stress Classification and Period Regression]
    E --> F[Gemini API for Personalized Insights]
    F --> G[D3.js Dashboard Visualization]
    G --> H[User Feedback and To-Do Recommendations]
🚀 Getting Started
⿡ Prerequisites
Ensure you have installed:

Node.js (v18+)

Python (v3.9+)

npm / yarn

Git

⿢ Installation
🖥️ Clone the Repository
bash
Copy code
git clone https://github.com/HACKWAVE2025/B43.git
cd B43
⚙️ Setup Backend
bash
Copy code
cd server
npm install
npm start
💻 Setup Frontend
bash
Copy code
cd client
npm install
npm run dev
🤖 Setup ML Backend
bash
Copy code
cd ml_backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
🧩 Environment Configuration
Create a .env file in both server/ and ml_backend/ directories:

ini
Copy code
PORT=5000
MONGO_URI=your_database_url
API_KEY=your_api_key_here
🧪 Usage
Once all services are running:

Frontend → http://localhost:3000

Backend API → http://localhost:5000

ML Backend → http://localhost:8000

Example Flow:
User logs in via frontend.

Data from wearables and forms is sent to backend API.

Backend calls ML models for predictions.

Gemini API generates personalized recommendations.

D3.js dashboard updates in real-time with visual insights.

🏆 Core Innovation
Unlike generic wellness apps, this system fuses behavioral data, physiological signals, and female-specific health factors to create adaptive, personalized stress interventions that evolve with the student’s lifestyle.
