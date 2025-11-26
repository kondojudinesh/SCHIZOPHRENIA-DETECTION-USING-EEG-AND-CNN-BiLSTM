import torch
import torch.nn as nn
from einops import rearrange

class CNNBiLSTM(nn.Module):
    def __init__(
        self,
        in_channels=1,
        cnn_out=[16, 32, 64],
        lstm_hidden=128,
        lstm_layers=1,
        dropout=0.2,
        num_classes=2,
    ):
        super().__init__()
        c1, c2, c3 = cnn_out

        # CNN feature extractor
        self.feat = nn.Sequential(
            nn.Conv2d(in_channels, c1, kernel_size=3, padding=1),
            nn.BatchNorm2d(c1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(c1, c2, kernel_size=3, padding=1),
            nn.BatchNorm2d(c2),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(c2, c3, kernel_size=3, padding=1),
            nn.BatchNorm2d(c3),
            nn.ReLU(),
        )

        self.dropout = nn.Dropout(dropout)

        # BiLSTM
        self.lstm = nn.LSTM(
            input_size=c3,
            hidden_size=lstm_hidden,
            num_layers=lstm_layers,
            batch_first=True,
            bidirectional=True,
        )

        # Classification head
        self.cls = nn.Sequential(
            nn.Linear(2 * lstm_hidden, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, num_classes),
        )

    def forward(self, x):
        # x: (B, C, F, T)
        f = self.feat(x)  # (B, C3, F', T')
        B, C3, Fp, Tp = f.shape

        # average pool over frequency to keep temporal dynamics
        f = f.mean(dim=2)  # (B, C3, T')
        f = rearrange(f, "b c t -> b t c")

        # BiLSTM
        f, _ = self.lstm(f)  # (B, T', 2*H)

        # temporal average pooling
        f = f.mean(dim=1)

        f = self.dropout(f)
        logits = self.cls(f)
        return logits
