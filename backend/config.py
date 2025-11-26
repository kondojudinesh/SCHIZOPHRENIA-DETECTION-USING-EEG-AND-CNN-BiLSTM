import os

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")  # EEG model (after training)

# --- Preprocessing defaults ---
FS_FALLBACK = 256
BANDPASS = (1.0, 45.0)
NOTCH = 50.0
WINDOW_SEC = 2.0
OVERLAP = 0.5
N_FFT = 256
HOP = 64
USE_SPECTROGRAMS = True
MAX_WINDOWS_FOR_INFER = 20  # limit windows processed per-file to speed up

# --- Model defaults (MUST match training) ---
MODEL_CFG = {
    "cnn_out": [16, 32, 64],  # ✅ fixed name to match CNNBiLSTM
    "lstm_hidden": 128,
    "lstm_layers": 1,
    "dropout": 0.2,
}

# --- Ensure directories exist ---
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
