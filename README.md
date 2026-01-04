# 🧠 Early Detection of Schizophrenia Using EEG Signals and CNN–BiLSTM

## 📌 Project Overview
This project implements an end-to-end deep learning–based system for early detection of schizophrenia using EEG signals.  
A hybrid CNN–BiLSTM architecture is used to extract spatial, spectral, and temporal patterns from EEG data.  
Explainable AI (Grad-CAM) is integrated to visualize the EEG regions influencing predictions, improving clinical trust.  
The system follows a full-stack architecture with a Python backend and a React frontend.

---

## 🧩 Problem Statement
Schizophrenia diagnosis often relies on subjective clinical evaluation, which may lead to delayed or inaccurate detection.  
Although EEG signals contain valuable information about brain activity, manual analysis is complex and time-consuming.  
This project aims to develop an automated, accurate, and explainable EEG-based diagnostic support system.

---

## 🏗️ Project Architecture
```

Schizophrenia-Detection-Using-EEG-CNN-BiLSTM/
│
├── backend/          # Model, preprocessing, API
│   ├── models/       # Trained CNN–BiLSTM models
│   ├── scripts/      # Preprocessing and inference scripts
│   ├── utils/        # Helper functions
│   ├── app.py        # Backend API server
│   └── requirements.txt
│
├── client/           # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

```

---

## 🔧 Tech Stack & Implementation Details
This project is developed using a full-stack architecture that combines deep learning for EEG analysis with a modern web interface.  
The application is divided into two main components: Backend and Client (Frontend).

---

## 🧠 Backend (Folder: `backend`)
The backend is responsible for EEG data processing, model execution, explainability, and prediction logic.

### Backend Responsibilities
- EEG signal preprocessing
- CNN–BiLSTM model inference
- Grad-CAM visualization generation
- API communication with frontend

### Backend Technologies Used
- Python – Core programming language
- TensorFlow / Keras – CNN–BiLSTM model development and inference
- NumPy – Numerical operations on EEG signals
- Pandas – Handling structured EEG and metadata
- SciPy – Signal filtering (bandpass and notch)
- Matplotlib – Spectrogram and Grad-CAM visualization
- Flask / FastAPI – REST API development

### How Backend Libraries Are Used
SciPy is used to remove noise and artifacts from EEG signals.  
NumPy handles EEG signal arrays and transformations.  
TensorFlow/Keras loads the trained CNN–BiLSTM model and performs predictions.  
Grad-CAM highlights important EEG regions to provide explainability.  
Flask/FastAPI manages communication between the backend and frontend.

---

## 🎨 Frontend (Folder: `client`)
The frontend provides an interactive user interface for EEG data upload and result visualization.

### Frontend Responsibilities
- Upload EEG data
- Send data to backend API
- Display classification results
- Show Grad-CAM heatmaps

### Frontend Technologies Used
- React.js – Component-based frontend development
- JavaScript (ES6) – Application logic and API calls
- HTML & CSS – UI structure and styling
- Axios / Fetch API – Backend communication

---

## 🔗 Full Stack Used
| Layer | Technology |
|------|-----------|
| Frontend | React.js |
| Backend | Python (Flask / FastAPI) |
| Deep Learning | CNN–BiLSTM |
| Explainability | Grad-CAM |
| Data Processing | NumPy, Pandas, SciPy |
| Visualization | Matplotlib |

---

## ⚙️ Methodology
- EEG preprocessing using bandpass and notch filters
- Signal segmentation and spectrogram generation
- CNN for spatial and frequency feature extraction
- BiLSTM for temporal sequence learning
- Grad-CAM for explainable visualization

---

## 🔄 System Flow
```

EEG Input → Preprocessing → Spectrogram → CNN → BiLSTM → Classification → Grad-CAM → Output

````

---

## 📊 Dataset
The dataset used in this project was obtained from Kaggle and contains EEG recordings collected from hospital patients.  
The data was carefully preprocessed and split to avoid data leakage.

---

## 📈 Results
- High classification accuracy using CNN–BiLSTM
- Better performance compared to traditional machine learning models
- Grad-CAM improves transparency and clinical trust

![Picture1](https://github.com/user-attachments/assets/2f077a90-180f-4ff2-b340-0a3f7d3c57b3)


![IMG-20251103-WA0000](https://github.com/user-attachments/assets/67dcc123-fde9-4ae9-8155-c19d9760c9f4)


![IMG-20251103-WA0003](https://github.com/user-attachments/assets/fa962241-cf54-4848-aadd-8fee642ae0ff)


![IMG-20251103-WA0001](https://github.com/user-attachments/assets/25a1aef8-cc9e-4355-b39c-d5ebe388f803)

---

## 🏥 Applications
- Early schizophrenia screening in hospitals
- Mental health diagnostic support systems
- EEG-based psychiatric research

---

## 🚀 Future Enhancements
- Real-time EEG device integration
- Cloud deployment
- Mobile application support
- Multimodal data integration (MRI / fMRI)

---

## ▶️ How to Run the Project

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
````

### Frontend

```bash
cd client
npm install
npm start
```

---

## 📌 Author

Kondoju Dinesh
B.Tech – Electronics and Communication Engineering

---

## 📄 License

This project is developed for academic and research purposes.
