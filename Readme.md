# 🧪 ChemViz -- Chemical Equipment Analytics Platform

**Created by Mayank Agrawal**\
Undergraduate \| Software & Web Developer

ChemViz is a comprehensive full-stack analytics platform for chemical
equipment data.\
It provides both a **Web Application** for remote access and a **Desktop
Application** for local analysis.

Users can upload CSV datasets containing **flow rates, pressures, and
temperatures** to receive instant analytics, visualizations, and
historical tracking.

------------------------------------------------------------------------

## 🚀 Live Demo

**Frontend (Vercel):**\
https://chem-viz-tau.vercel.app/

**Backend (Render):**\
https://chemviz-backend-nqg2.onrender.com

### 🔑 Demo Login Credentials

Username: mayank
Password: mayo2250

------------------------------------------------------------------------

## ✨ Features

-   📊 Upload CSV files for instant analysis\
-   📈 Interactive charts and visualizations\
-   🗂 Historical data tracking\
-   🖥 Desktop GUI for offline/local use\
-   🌐 REST API shared by Web & Desktop apps\
-   📄 PDF report generation\
-   🔐 Secure authentication

------------------------------------------------------------------------

## 🛠 Tech Stack

### 🔧 Backend

-   Framework: Django, Django REST Framework\
-   Database: SQLite (Dev), PostgreSQL (Production-ready)\
-   Libraries: Pandas, ReportLab, Gunicorn, Whitenoise

### 🌐 Web Frontend

-   Framework: React (Vite)\
-   Styling: Tailwind CSS\
-   Charts: Chart.js, Recharts\
-   Icons: Lucide React

### 🖥 Desktop App

-   Framework: Python (PyQt5)\
-   Visualization: Matplotlib\
-   Connectivity: REST API (Requests)

------------------------------------------------------------------------

## ⚙️ Local Setup Instructions

### 1️⃣ Prerequisites

-   Python 3.10+\
-   Node.js v16+\
-   Git

------------------------------------------------------------------------

### 2️⃣ Clone the Repository

``` bash
git clone https://github.com/YOUR_USERNAME/ChemViz.git
cd ChemViz
```

------------------------------------------------------------------------

### 3️⃣ Backend Setup (Django)

``` bash
cd backend
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # Optional
python manage.py runserver
```

Backend will run at:\
http://127.0.0.1:8000

------------------------------------------------------------------------

### 4️⃣ Web Frontend Setup (React)

``` bash
cd web-frontend
npm install
npm run dev
```

Frontend will run at:\
http://localhost:5173

------------------------------------------------------------------------

### 5️⃣ Desktop App Setup (PyQt5)

``` bash
cd desktop-app
pip install PyQt5 matplotlib requests pandas
python desktop_app.py
```

Desktop GUI window should appear instantly.

------------------------------------------------------------------------

## 📂 Project Structure

``` plaintext
ChemViz/
├── backend/                # Django Backend (API)
│   ├── chemviz/            # Project settings
│   ├── analytics/          # Main app logic
│   ├── data/               # File storage
│   └── manage.py
│
├── web-frontend/           # React Web Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── api.js          # API connection logic
│   │   └── App.jsx         # Main web layout
│   └── vite.config.js
│
├── desktop-app/            # PyQt5 Desktop Application
│   └── desktop_app.py      # Main GUI entry point
│
└── README.md
```

------------------------------------------------------------------------

## 🛡 License

This project is licensed under the **MIT License**.

------------------------------------------------------------------------

## 👨‍💻 About the Author

**Mayank Agrawal**\
Undergraduate \| Software & Web Developer

**Focus Areas:**\
- Data Structures & Algorithms\
- Full Stack Development\
- Data Analytics

------------------------------------------------------------------------

⭐ If you like this project, consider giving it a star on GitHub!
