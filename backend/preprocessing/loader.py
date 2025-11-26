# preprocessing/loader.py
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.io import loadmat
import mne
from typing import Tuple, List, Optional

def read_eea_try_text(filepath: str) -> Tuple[np.ndarray, float, List[str]]:
    """Try reading .eea file as text/CSV style."""
    try:
        df = pd.read_csv(filepath)
        arr = df.values.T.astype("float32")
        fs = None
        ch_names = list(df.columns) if df.columns is not None else [f"C{i}" for i in range(arr.shape[0])]
        return arr, fs, ch_names
    except Exception:
        pass

    try:
        df = pd.read_csv(filepath, delim_whitespace=True, header=None)
        arr = df.values.T.astype("float32")
        ch_names = [f"C{i}" for i in range(arr.shape[0])]
        return arr, None, ch_names
    except Exception:
        pass

    raise ValueError(".eea not readable as plain text CSV/TSV")

def _read_any(filepath: str, channels: Optional[List[str]] = None, fs_fallback: int = 256):
    """Read EEG data from .edf / .mat / .csv / .txt / .eea files."""
    p = Path(filepath)
    ext = p.suffix.lower()

    if ext == ".edf":
        raw = mne.io.read_raw_edf(filepath, preload=True, verbose=False)
        x = raw.get_data()
        fs = float(raw.info["sfreq"])
        ch_names = raw.ch_names

    elif ext == ".mat":
        md = loadmat(filepath)
        arr = None
        for v in md.values():
            if isinstance(v, np.ndarray) and v.ndim == 2:
                if arr is None or v.size > arr.size:
                    arr = v
        if arr is None:
            raise ValueError("No 2D array found in .mat file")
        x = arr.astype("float32")
        fs = float(fs_fallback)
        ch_names = [f"C{i}" for i in range(x.shape[0])]

    elif ext in [".csv", ".txt"]:
        df = pd.read_csv(filepath)
        vals = df.values
        x = vals.T.astype("float32")
        fs = float(fs_fallback)
        ch_names = list(df.columns) if df.columns is not None else [f"C{i}" for i in range(x.shape[0])]

    elif ext == ".eea":
        try:
            return read_eea_try_text(filepath)
        except Exception:
            pass
        try:
            data = np.fromfile(filepath, dtype=np.float32)
            x = data.reshape((1, -1)).astype("float32")
            return x, float(fs_fallback), ["C0"]
        except Exception as e:
            raise ValueError("Unable to parse .eea file.") from e

    else:
        raise ValueError(f"Unsupported extension: {ext}")

    # --- ensure channel names ---
    if not ch_names or len(ch_names) != x.shape[0]:
        if x.shape[0] == 19:
            ch_names = DEFAULT_CH_NAMES_19
        else:
            ch_names = [f"Ch{i+1}" for i in range(x.shape[0])]

    # --- apply channel selection if requested ---
    if channels is not None:
        idx = [ch_names.index(c) for c in channels if c in ch_names]
        if len(idx) == 0:
            raise ValueError("No requested channels found in file")
        x = x[idx]
        ch_names = [ch_names[i] for i in idx]

    return x.astype("float32"), float(fs), ch_names

def load_eeg(filepath: str, channels: Optional[List[str]] = None, fs_fallback: int = 256):
    """Public wrapper for EEG loading."""
    return _read_any(filepath, channels=channels, fs_fallback=fs_fallback)
