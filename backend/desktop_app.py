import sys
import requests
import matplotlib
from PyQt5.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel, QVBoxLayout,
    QFileDialog, QTextEdit, QLineEdit, QFrame, QHBoxLayout
)
from PyQt5.QtCore import Qt

# Import Matplotlib for PyQt5
matplotlib.use('Qt5Agg')
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure

# --- Backend Config w
BASE_URL = "http://127.0.0.1:8000/api"
TOKEN_URL = "http://127.0.0.1:8000/api/token/"

# --- Styling (Same as before) ---
STYLESHEET = """
    QWidget { background-color: #242424; color: rgba(255, 255, 255, 0.87); font-family: "Segoe UI", sans-serif; font-size: 14px; }
    QLabel { font-weight: bold; font-size: 16px; margin-top: 10px; color: #ffffff; }
    QLineEdit { background-color: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 8px; padding: 10px; color: white; }
    QTextEdit { background-color: #1a1a1a; border: 1px solid #3a3a3a; border-radius: 8px; padding: 10px; color: #cccccc; font-family: "Consolas", monospace; }
    QPushButton { background-color: #1a1a1a; border: 1px solid transparent; border-radius: 8px; padding: 10px 20px; font-weight: 600; color: #ffffff; }
    QPushButton:hover { border-color: #646cff; color: #646cff; background-color: #2a2a2a; }
"""

# --- Custom Matplotlib Canvas ---
class MplCanvas(FigureCanvas):
    def __init__(self, parent=None, width=5, height=4, dpi=100):
        # Dark theme figure
        self.fig = Figure(figsize=(width, height), dpi=dpi, facecolor='#242424')
        self.axes = self.fig.add_subplot(111)
        self.axes.set_facecolor('#242424')
        super(MplCanvas, self).__init__(self.fig)

class App(QWidget):
    def __init__(self):
        super().__init__()
        self.token = None
        self.initUI()

    def initUI(self):
        self.setWindowTitle("ChemViz Analytics Dashboard")
        self.setGeometry(100, 100, 900, 700) # Made wider for the chart

        # Main Layout (Horizontal: Controls on Left, Chart/Logs on Right)
        main_layout = QHBoxLayout()

        # --- LEFT PANEL: Controls ---
        left_panel = QVBoxLayout()
        left_panel.setSpacing(15)
        
        # Auth Section
        left_panel.addWidget(QLabel("Authentication"))
        self.username = QLineEdit()
        self.username.setPlaceholderText("Username")
        self.password = QLineEdit()
        self.password.setPlaceholderText("Password")
        self.password.setEchoMode(QLineEdit.Password)
        
        self.login_btn = QPushButton("Login")
        self.login_btn.setStyleSheet("background-color: #646cff; color: white;")
        self.login_btn.clicked.connect(self.login)

        left_panel.addWidget(self.username)
        left_panel.addWidget(self.password)
        left_panel.addWidget(self.login_btn)

        # Actions Section
        line = QFrame()
        line.setFrameShape(QFrame.HLine)
        line.setStyleSheet("border: 1px solid #444;")
        left_panel.addWidget(line)

        left_panel.addWidget(QLabel("Data Operations"))
        self.upload_btn = QPushButton("📂 Upload CSV & Analyze")
        self.upload_btn.clicked.connect(self.upload_csv)

        self.history_btn = QPushButton("📜 Get History")
        self.history_btn.clicked.connect(self.get_history)

        self.report_btn = QPushButton("⬇️ Download PDF")
        self.report_btn.clicked.connect(self.download_report)

        left_panel.addWidget(self.upload_btn)
        left_panel.addWidget(self.history_btn)
        left_panel.addWidget(self.report_btn)
        left_panel.addStretch() # Push everything up

        # --- RIGHT PANEL: Visualization & Logs ---
        right_panel = QVBoxLayout()
        
        # 1. Matplotlib Chart Area
        right_panel.addWidget(QLabel("Equipment Distribution"))
        self.canvas = MplCanvas(self, width=5, height=4, dpi=100)
        right_panel.addWidget(self.canvas)

        # 2. Logs
        right_panel.addWidget(QLabel("System Logs"))
        self.output = QTextEdit()
        self.output.setReadOnly(True)
        self.output.setMaximumHeight(150)
        right_panel.addWidget(self.output)

        # Add panels to main layout
        main_layout.addLayout(left_panel, 30) # 30% width
        main_layout.addLayout(right_panel, 70) # 70% width

        self.setLayout(main_layout)

    def log(self, message):
        self.output.append(message)

    # --- Logic ---

    def login(self):
        data = {"username": self.username.text(), "password": self.password.text()}
        try:
            res = requests.post(TOKEN_URL, json=data)
            if res.status_code == 200:
                self.token = res.json()["access"]
                self.log("✅ Login successful!")
            else:
                self.log(f"❌ Login failed: {res.text}")
        except Exception as e:
            self.log(f"❌ Error: {e}")

    def upload_csv(self):
        if not self.token:
            self.log("❌ Login first")
            return

        file_path, _ = QFileDialog.getOpenFileName(self, "Select CSV", "", "CSV Files (*.csv)")
        if not file_path:
            return

        headers = {"Authorization": f"Bearer {self.token}"}
        try:
            with open(file_path, "rb") as f:
                files = {"file": f}
                self.log(f"🔄 Uploading {file_path}...")
                res = requests.post(f"{BASE_URL}/upload/", files=files, headers=headers)
            
            if res.status_code == 200:
                data = res.json()
                self.log("✅ Data Processed!")
                self.log(f"Avg Flow: {data['avg_flowrate']} | Avg Pres: {data['avg_pressure']}")
                
                # UPDATE CHART
                dist = data.get("equipment_distribution", {})
                self.update_chart(dist)
            else:
                self.log(f"❌ Upload Failed: {res.text}")

        except Exception as e:
            self.log(f"❌ Error: {e}")

    def update_chart(self, distribution):
        self.canvas.axes.clear()
        
        if not distribution:
            self.canvas.axes.text(0.5, 0.5, "No Equipment Data", 
                                  ha='center', va='center', color='white')
        else:
            labels = list(distribution.keys())
            values = list(distribution.values())
            
            # Create Pie Chart
            wedges, texts, autotexts = self.canvas.axes.pie(
                values, labels=labels, autopct='%1.1f%%',
                textprops={'color': "white"},
                colors=['#646cff', '#535bf2', '#747bff', '#9999ff', '#4444aa']
            )
            self.canvas.axes.set_title("Equipment Types", color='white')

        self.canvas.draw()

    def get_history(self):
        if not self.token: return
        headers = {"Authorization": f"Bearer {self.token}"}
        try:
            res = requests.get(f"{BASE_URL}/history/", headers=headers)
            self.log(f"HISTORY: {res.text}")
        except Exception as e:
            self.log(f"Error: {e}")

    def download_report(self):
        if not self.token: return
        headers = {"Authorization": f"Bearer {self.token}"}
        try:
            res = requests.get(f"{BASE_URL}/report/", headers=headers)
            if res.status_code == 200:
                with open("report.pdf", "wb") as f: f.write(res.content)
                self.log("✅ report.pdf saved")
        except Exception as e:
            self.log(f"Error: {e}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setStyleSheet(STYLESHEET)
    window = App()
    window.show()
    sys.exit(app.exec_())