import os
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from tqdm import tqdm
from preprocessing.loader import load_eeg
from preprocessing.filters import notch_and_bandpass, make_windows, to_spectrogram
from models.cnn_bilstm import CNNBiLSTM

# =============================
# Config
# =============================
FS_FALLBACK = 256
NOTCH = 50
BANDPASS = (0.5, 40)
WINDOW_SEC = 5
OVERLAP = 0.5
N_FFT = 128
HOP = 64
USE_SPECTROGRAMS = True
BATCH_SIZE = 16
EPOCHS = 60
LR = 5e-3
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

DATASET_DIR = "dataset"
MODEL_OUT = "models/best.pt"

# =============================
# Dataset Class
# =============================
class EEGDataset(Dataset):
    def __init__(self, root_dir):
        self.samples = []
        self.labels = []
        self.classes = sorted(os.listdir(root_dir))
        self.class_to_idx = {c: i for i, c in enumerate(self.classes)}

        for cls in self.classes:
            cls_dir = os.path.join(root_dir, cls)
            for fname in os.listdir(cls_dir):
                self.samples.append(os.path.join(cls_dir, fname))
                self.labels.append(self.class_to_idx[cls])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        file_path = self.samples[idx]
        label = self.labels[idx]

        # load EEG
        x, fs, _ = load_eeg(file_path, fs_fallback=FS_FALLBACK)
        if fs is None:
            fs = FS_FALLBACK

        # preprocess
        x = notch_and_bandpass(x, fs, NOTCH, BANDPASS)
        wins = make_windows(x, fs, WINDOW_SEC, OVERLAP)
        if wins.shape[0] == 0:
            wins = np.zeros((1, x.shape[0], int(WINDOW_SEC * fs)))

        # pick first window (simplest)
        w = wins[0]

        if USE_SPECTROGRAMS:
            S = to_spectrogram(w, fs, n_fft=N_FFT, hop_length=HOP)  # (ch, F, T)
            S = (S - S.mean()) / (S.std() + 1e-6)
            tensor = torch.tensor(S, dtype=torch.float32)
        else:
            w_norm = (w - w.mean(axis=1, keepdims=True)) / (w.std(axis=1, keepdims=True) + 1e-6)
            tensor = torch.tensor(w_norm[:, None, :], dtype=torch.float32)  # (ch, 1, T)

        return tensor, label

# =============================
# Training
# =============================
def train_one_epoch(model, loader, criterion, optimizer):
    model.train()
    total_loss, correct, total = 0, 0, 0
    for X, y in tqdm(loader, desc="Train"):
        X, y = X.to(DEVICE), y.to(DEVICE)
        if X.ndim == 3:  # (C, F, T) → add batch
            X = X.unsqueeze(0)
        optimizer.zero_grad()
        out = model(X)
        loss = criterion(out, y)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * X.size(0)
        pred = out.argmax(dim=1)
        correct += (pred == y).sum().item()
        total += y.size(0)
    return total_loss / total, correct / total

def evaluate(model, loader, criterion):
    model.eval()
    total_loss, correct, total = 0, 0, 0
    with torch.no_grad():
        for X, y in tqdm(loader, desc="Val"):
            X, y = X.to(DEVICE), y.to(DEVICE)
            if X.ndim == 3:
                X = X.unsqueeze(0)
            out = model(X)
            loss = criterion(out, y)
            total_loss += loss.item() * X.size(0)
            pred = out.argmax(dim=1)
            correct += (pred == y).sum().item()
            total += y.size(0)
    return total_loss / total, correct / total

# =============================
# Main
# =============================
def main():
    train_ds = EEGDataset(os.path.join(DATASET_DIR, "train"))
    val_ds = EEGDataset(os.path.join(DATASET_DIR, "val"))

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

    # infer in_channels dynamically
    sample, _ = train_ds[0]
    in_channels = sample.shape[0]

    model = CNNBiLSTM(in_channels=in_channels, num_classes=len(train_ds.classes)).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    best_acc = 0.0
    for epoch in range(EPOCHS):
        print(f"\nEpoch {epoch+1}/{EPOCHS}")
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer)
        val_loss, val_acc = evaluate(model, val_loader, criterion)

        print(f"Train loss={train_loss:.4f} acc={train_acc:.4f} | Val loss={val_loss:.4f} acc={val_acc:.4f}")

        if val_acc > best_acc:
            best_acc = val_acc
            os.makedirs("models", exist_ok=True)
            torch.save(model.state_dict(), MODEL_OUT)
            print(f"✅ Saved best model to {MODEL_OUT} (val_acc={val_acc:.3f})")

if __name__ == "__main__":
    main()


