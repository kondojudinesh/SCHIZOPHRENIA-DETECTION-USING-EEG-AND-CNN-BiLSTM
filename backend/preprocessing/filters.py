import numpy as np
from scipy.signal import butter, filtfilt, iirnotch, spectrogram

def notch_and_bandpass(x: np.ndarray, fs: int,
                       notch_freq: float = 50.0,
                       band: tuple = (1, 40)) -> np.ndarray:
    b_notch, a_notch = iirnotch(notch_freq, Q=30, fs=fs)
    x_f = filtfilt(b_notch, a_notch, x, axis=1)

    b_band, a_band = butter(4, [band[0] / (fs / 2), band[1] / (fs / 2)], btype="band")
    x_f = filtfilt(b_band, a_band, x_f, axis=1)

    return x_f

def make_windows(x: np.ndarray, fs: int, window_sec: float, overlap: float = 0.5):
    window_size = int(window_sec * fs)
    step = int(window_size * (1 - overlap))

    windows = []
    n_samples = x.shape[1]

    if step <= 0:
        step = window_size

    for start in range(0, n_samples - window_size + 1, step):
        windows.append(x[:, start:start + window_size])

    return np.stack(windows) if windows else np.empty((0, x.shape[0], window_size))

def to_spectrogram(x: np.ndarray, fs: int,
                   n_fft: int = 128, hop_length: int = 64):
    specs = []
    for ch in range(x.shape[0]):
        f, t, Sxx = spectrogram(
            x[ch, :], fs,
            nperseg=n_fft,
            noverlap=n_fft - hop_length
        )
        specs.append(Sxx)
    return np.array(specs)
