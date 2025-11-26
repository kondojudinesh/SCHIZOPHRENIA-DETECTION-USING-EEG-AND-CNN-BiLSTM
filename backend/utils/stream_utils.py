# utils/stream_utils.py
import numpy as np
import asyncio
from preprocessing.loader import load_eeg

async def eeg_data_generator(fs: int = 256, duration: int = 10):
    """Simulated EEG generator (fallback)."""
    n_channels = 16
    chunk_size = int(fs / 2)  

    for _ in range(int(duration * 2)):
        t = np.linspace(0, 0.5, chunk_size, endpoint=False)
        signals = []
        for ch in range(n_channels):
            freq = np.random.choice([6, 10, 18])
            sig = np.sin(2 * np.pi * freq * t) + 0.1 * np.random.randn(chunk_size)
            signals.append(sig.tolist())
        yield signals
        await asyncio.sleep(0.5)

async def eeg_file_stream(file_path: str, fs: int = 256, duration: int = 10):
    """Stream EEG data from an uploaded file chunk by chunk."""
    try:
        x, fs_loaded, _ = load_eeg(file_path, fs_fallback=fs)
        if fs_loaded:
            fs = fs_loaded
    except Exception as e:
        print("⚠️ Could not load EEG file for streaming:", e)
        return

    n_channels, n_samples = x.shape
    chunk_size = int(fs / 2)

    for start in range(0, n_samples, chunk_size):
        end = start + chunk_size
        if end > n_samples:
            break
        chunk = x[:, start:end].tolist()
        yield chunk
        await asyncio.sleep(0.5)   # mimic real-time pace

