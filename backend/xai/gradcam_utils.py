# xai/gradcam_utils.py
import numpy as np
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

def find_last_conv(model: torch.nn.Module):
    """Find the last Conv1d/Conv2d layer in the model."""
    convs = [m for m in model.modules() if isinstance(m, (nn.Conv1d, nn.Conv2d))]
    if not convs:
        raise RuntimeError("No Conv layer found for Grad-CAM target")
    return convs[-1]

def generate_gradcam(model, device, input_tensor, target_class, out_path, ch_names=None, fs=256):
    """
    Generate Grad-CAM heatmap for one or multiple windows.
    If multiple windows are passed, it averages them for stability.
    """
    explanation = "No explanation available."
    heatmap_path = None

    try:
        model.eval()
        target_layer = find_last_conv(model)

        # Handle single window case
        if input_tensor.ndim == 5:  
            input_tensor = input_tensor.unsqueeze(0)  # (1, C, F, T)

        heatmaps = []
        for i in range(input_tensor.shape[0]):
            cam = GradCAM(model=model, target_layers=[target_layer])
            targets = [ClassifierOutputTarget(target_class)]
            grayscale_cam = cam(input_tensor=input_tensor[i:i+1], targets=targets)[0]

            # Normalize CAM (0–1)
            grayscale_cam = (grayscale_cam - np.min(grayscale_cam)) / (
                np.max(grayscale_cam) - np.min(grayscale_cam) + 5e-6
            )
            heatmaps.append(grayscale_cam)

        # Average across windows
        avg_cam = np.mean(heatmaps, axis=0)

        # Background (spectrogram for plotting)
        spec = input_tensor[0].cpu().numpy()
        if spec.ndim == 3:
            base_img = np.mean(spec, axis=0)
        else:
            base_img = spec

        # Plot heatmap
        plt.figure(figsize=(10, 4))
        time_axis = np.linspace(0, base_img.shape[-1] / fs, base_img.shape[-1])
        freq_axis = np.arange(base_img.shape[0])

        im = plt.imshow(
            avg_cam,
            aspect="auto",
            cmap="turbo",
            origin="lower",
            extent=[time_axis.min(), time_axis.max(), freq_axis.min(), freq_axis.max()]
        )
        plt.colorbar(im, label="Activation Intensity")
        plt.xlabel("Time (s)")
        if ch_names is not None and len(ch_names) == avg_cam.shape[0]:
            plt.yticks(range(len(ch_names)), ch_names)
            plt.ylabel("Channels")
        else:
            plt.ylabel("Frequency / Channels")

        plt.title("EEG Grad-CAM (averaged across windows)")
        plt.tight_layout()
        plt.savefig(out_path, dpi=150, bbox_inches="tight")
        plt.close()
        heatmap_path = out_path

        explanation = "EEG Grad-CAM averaged across windows for more stable visualization."

    except Exception as e:
        print("⚠️ Grad-CAM failed:", e)
        explanation = "(Fallback) EEG analysis performed."

    return heatmap_path, explanation
