import torch
import torch.nn.functional as F
from .cnn_bilstm import CNNBiLSTM


def load_model(model_path: str, cfg: dict, device=None):
    """
    Load a CNN-BiLSTM model from a checkpoint.
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = CNNBiLSTM(**cfg)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    return model, device


def predict_windows(model, device, windows: torch.Tensor, class_names=["Healthy", "Risky"]):
    """
    Run inference on EEG windows and return predictions with confidence.
    """
    model.eval()
    with torch.no_grad():
        windows = windows.to(device)
        logits = model(windows)
        probs = F.softmax(logits, dim=1)

        pred_class = probs.argmax(dim=1).cpu().numpy()       # predicted class index
        pred_conf = probs.max(dim=1).values.cpu().numpy()    # confidence score

        results = []
        for cls, conf in zip(pred_class, pred_conf):
            results.append({
                "label": class_names[cls],
                "confidence": float(conf)  
            })

        return results
