# ruolochiaro_engine.py
# Motore Economico & FastAPI Backend per la normalizzazione dei ruoli nelle PMI italiane
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class PayrollSimulation:
    costo_azienda: int
    contratto: str
    ral_annua: int
    netto_mensile_13: int
    buoni_pasto_mensili: int
    potere_acquisto_mensile: int
    cuneo_fiscale_pct: float

def calcola_busta_paga_pmi(costo_azienda: int, contratto: str = "apprendistato", buoni_pasto_gg: int = 8) -> PayrollSimulation:
    """
    Converte il Budget Costo Azienda dell'imprenditore in RAL e Stipendio Netto (Scaglioni IRPEF 2026).
    Confronta Apprendistato Professionalizzante (sgravio contributivo PMI) vs Tempo Indeterminato.
    """
    coeff_datore = 1.215 if contratto == "apprendistato" else 1.385
    ral = round(costo_azienda / coeff_datore)

    aliquota_inps_lav = 0.0584 if contratto == "apprendistato" else 0.0919
    imponibile = ral * (1 - aliquota_inps_lav)

    # IRPEF 2026 (23% fino a 28k, 33% 28k-50k, 43% oltre 50k)
    if imponibile <= 28000:
        irpef_lorda = imponibile * 0.23
    elif imponibile <= 50000:
        irpef_lorda = 6440 + (imponibile - 28000) * 0.33
    else:
        irpef_lorda = 13700 + (imponibile - 50000) * 0.43

    # Detrazioni lavoro dipendente + beneficio taglio cuneo
    if imponibile <= 28000:
        detrazioni = 1910 + 1190 * ((28000 - imponibile) / 13000) + 950
    elif imponibile <= 50000:
        detrazioni = 2560 * ((50000 - imponibile) / 22000)
    else:
        detrazioni = 0

    addizionali = imponibile * 0.023
    irpef_netta = max(0, irpef_lorda - detrazioni) + addizionali

    netto_annuo = round(imponibile - irpef_netta)
    netto_13 = round(netto_annuo / 13)
    bp_mensili = buoni_pasto_gg * 20
    cuneo = round(((costo_azienda - netto_annuo) / costo_azienda) * 100, 1)

    return PayrollSimulation(
        costo_azienda=costo_azienda,
        contratto=contratto,
        ral_annua=ral,
        netto_mensile_13=netto_13,
        buoni_pasto_mensili=bp_mensili,
        potere_acquisto_mensile=netto_13 + bp_mensili,
        cuneo_fiscale_pct=cuneo
    )

# Esempio di esecuzione con i parametri attuali dell'utente:
if __name__ == "__main__":
    sim = calcola_busta_paga_pmi(35500, "apprendistato", 8)
    print(f"Ruolo Target: Procure-to-Pay (Ciclo Passivo) & Process Specialist & Data Reporting")
    print(f"Costo Azienda: €{sim.costo_azienda:,} -> RAL: €{sim.ral_annua:,} -> Netto + BP: €{sim.potere_acquisto_mensile:,}/mese")