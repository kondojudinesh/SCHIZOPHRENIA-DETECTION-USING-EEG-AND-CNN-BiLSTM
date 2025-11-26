def generate_ai_report(label: str, confidence: float,
                       top_channels: list[str], top_bands: list[str]) -> dict:
    ch_str = ", ".join(top_channels) if top_channels else "key EEG channels"
    band_str = ", ".join(top_bands) if top_bands else "dominant frequency bands"

    if label == "At Risk":
        return {
            "severity": (
                f"⚠️ Elevated schizophrenia-risk pattern detected "
                f"(confidence {confidence:.1f}%). "
                f"Prominence in {ch_str}, rhythms in bands."
            ),
            "treatment": [
                "💊 Medication (psychiatrist): Risperidone, Olanzapine, or Aripiprazole.",
                "🧠 Therapy: CBT, family psychoeducation, and follow-ups.",
                "📅 Care plan: medication titration, adherence monitoring.",
                "🏥 Advanced: Clozapine if resistant. Surgery not indicated."
            ],
            "lifestyle": [
                "Sleep hygiene: 7–9 hours nightly, fixed schedule.",
                "Avoid alcohol, smoking, recreational drugs.",
                "Stress reduction: yoga, mindfulness, therapy.",
                "Balanced diet incl. Omega-3s (fish, flaxseed, walnuts).",
                "Light daily activity and structured routines."
            ],
            "prevention": [],
            "notes": [],
            "follow_up": [
                "Psychiatric evaluation (SCID, PANSS, BPRS).",
                "Neurological tests: qEEG, fMRI if needed.",
                "Cognitive monitoring: attention, memory.",
                "Blood tests: rule out metabolic issues.",
                "Visits every 4–6 weeks depending on severity."
            ],
        }

    else:  # Healthy
        return {
            "severity": (
                f"✅ No schizophrenia-risk detected (confidence {confidence:.1f}%). "
                "EEG appears within expected limits."
            ),
            "treatment": [],
            "lifestyle": [
                "Maintain consistent sleep schedule & daylight exposure.",
                "Balanced diet with Omega-3s.",
                "≥150 min/week of physical activity.",
                "Avoid alcohol, excess caffeine, recreational drugs.",
                "Mindfulness, yoga, social connection."
            ],
            "prevention": [
                "Annual EEG if family history present.",
                "Yearly cognitive check-ups.",
                "Preventive visits with physician.",
                "No psychiatric intervention required."
            ],
            "notes": [
                f"Dominant rhythms: {band_str}. Key channels: {ch_str}."
            ],
            "follow_up": [
                "Routine check-up annually."
            ],
        }
