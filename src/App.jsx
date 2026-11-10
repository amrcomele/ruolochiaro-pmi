import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  Code2,
  FileText,
  TrendingUp,
  Users,
  ChevronRight,
  ChevronLeft,
  Building2,
  MapPin,
  Layers,
  ShieldCheck,
  RefreshCw,
  Sliders,
  ArrowRight,
  Info,
  Terminal,
  Zap
} from 'lucide-react';

// ============================================================================
// DATA & ECONOMIC ENGINE: MATRICE RUOLI, MANSIONI, SOFTWARE E BENCHMARK
// ============================================================================

const BOTTLENECKS = [
  {
    id: 'controlling',
    title: 'Costi, Margini e File Excel Disallineati',
    subtitle: 'Fatturiamo ma non sappiamo con certezza dove guadagniamo o perdiamo sulle singole commesse/prodotti.',
    naiveTitle: 'Impiegato Amministrativo con buon uso Excel',
    modernRole: 'Junior Controller & Business Process Analyst',
    academicTarget: 'Laurea Magistrale in Economia e Management (LM-77 / LM-56) o Ingegneria Gestionale',
    baseBenchmarkRAL: 28500,
    defaultEfficiencyPct: 1.5,
    kpi6Months: [
      'Riconciliazione mensile tra contabilità generale e contabilità analitica per centro di costo',
      'Automazione dei fogli di calcolo aziendali eliminando gli inserimenti manuali ridondanti',
      'Creazione di un cruscotto mensile sui margini operativi (EBITDA) per linea di business o commessa'
    ]
  },
  {
    id: 'procure_to_pay',
    title: 'Ciclo Passivo, Fatture, Ordini e Pagamenti (PA / Privato)',
    subtitle: 'Perdiamo troppo tempo tra ordini, bolle, fatture bloccate (SDI/NSO), verifiche CIG/DURC e scadenze fornitori.',
    naiveTitle: 'Addetto Fatturazione e Segreteria Contabile',
    modernRole: 'Procure-to-Pay (Ciclo Passivo) & Process Specialist',
    academicTarget: 'Laurea in Economia / Management o Tecnico Superiore Amministrazione e Finanza',
    baseBenchmarkRAL: 27500,
    defaultEfficiencyPct: 1.8,
    kpi6Months: [
      'Presidio end-to-end del flusso ordine-consegna-fattura (3-way matching) e sblocco delle anomalie bloccanti',
      'Allineamento tempestivo tra flussi SDI / NSO, codici CIG/CUP, split payment e regolarità contributiva (DURC)',
      'Riduzione dei tempi medi di liquidazione (DPO) e costruzione di uno scadenzario pagamenti predittivo'
    ]
  },
  {
    id: 'data_bi',
    title: 'Dati Frammentati, Reportistica Lenta e Zero Previsioni',
    subtitle: 'Abbiamo dati sparsi nel gestionale ma nessuno li pulisce o li trasforma in numeri chiari per decidere.',
    naiveTitle: 'Informatico / Esperto Excel per Statistiche',
    modernRole: 'Business & Data Analyst (BI & Quantitative Modeling)',
    academicTarget: 'Laurea Magistrale in Economia e Innovazione, Data Science, Statistica o Ingegneria',
    baseBenchmarkRAL: 30000,
    defaultEfficiencyPct: 2.0,
    kpi6Months: [
      'Progettazione di pipeline automatiche di pulizia e normalizzazione dei dataset estratti dall’ERP aziendale',
      'Sviluppo di dashboard interattive per il monitoraggio in tempo reale dei KPI operativi e finanziari',
      'Impostazione di modelli statistici ed econometrici per la previsione della domanda, dei costi o dei tempi di processo'
    ]
  },
  {
    id: 'operations_erp',
    title: 'Gestionale Sottoutilizzato e Colli di Bottiglia Operativi',
    subtitle: 'Abbiamo comprato il gestionale/ERP ma i reparti lavorano ancora a compartimenti stagni e su carta/file locali.',
    naiveTitle: 'Impiegato Tuttofare Gestione Ordini e Magazzino',
    modernRole: 'Operations & ERP Functional Analyst',
    academicTarget: 'Laurea in Economia e Innovazione, Ingegneria Gestionale o Informatica per il Management',
    baseBenchmarkRAL: 29500,
    defaultEfficiencyPct: 1.7,
    kpi6Months: [
      'Mappatura dei flussi operativi tra acquisti, logistica/produzione e amministrazione (Business Process Reengineering)',
      'Configurazione e messa a regime dei moduli ERP inutilizzati, formando il personale operativo sul corretto inserimento dati',
      'Abbattimento degli errori di allineamento giacenze/ordini e riduzione dei tempi di attraversamento (lead time)'
    ]
  },
  {
    id: 'sales_crm',
    title: 'Preventivi Lenti, Clienti Non Tracciati e Commerciale Caotico',
    subtitle: 'Le trattative sono nella testa dei commerciali, non sappiamo il tasso di conversione né il valore della pipeline.',
    naiveTitle: 'Back-Office Commerciale e Segreteria Vendite',
    modernRole: 'Sales Operations & CRM Analyst',
    academicTarget: 'Laurea in Economia, Management, Marketing Quantitativo o Comunicazione d’Impresa',
    baseBenchmarkRAL: 27500,
    defaultEfficiencyPct: 1.6,
    kpi6Months: [
      'Strutturazione e pulizia del database clienti/lead all’interno del CRM aziendale con tracciamento delle fasi di vendita',
      'Standardizzazione del processo di preventivazione e monitoraggio dei tassi di conversione per canale',
      'Analisi della marginalità per cliente e creazione di report settimanali sulle previsioni di incasso e fatturato'
    ]
  }
];

const TASKS = [
  // Cluster: Finance & Controlling
  { id: 't_margini', label: 'Analisi costi, ricavi e margini per commessa/prodotto', cluster: 'controlling', category: 'Controllo & Finance' },
  { id: 't_budget', label: 'Stesura budget, forecast e analisi degli scostamenti', cluster: 'controlling', category: 'Controllo & Finance' },
  { id: 't_cashflow', label: 'Monitoraggio flussi di cassa, banche e scadenzario', cluster: 'controlling', category: 'Controllo & Finance' },
  // Cluster: Ciclo Passivo & PA
  { id: 't_3way', label: 'Riconciliazione Ordine – DDT – Fattura (3-way matching)', cluster: 'procure_to_pay', category: 'Ciclo Passivo & PA' },
  { id: 't_sdi_nso', label: 'Gestione flussi SDI / NSO e risoluzione scarti e anomalie', cluster: 'procure_to_pay', category: 'Ciclo Passivo & PA' },
  { id: 't_compliance', label: 'Verifica CIG/CUP, DURC, split payment e conformità documentale', cluster: 'procure_to_pay', category: 'Ciclo Passivo & PA' },
  // Cluster: Data & Automation
  { id: 't_cleaning', label: 'Pulizia, incrocio e automazione di file Excel / CSV complessi', cluster: 'data_bi', category: 'Dati & Automazione' },
  { id: 't_dashboard', label: 'Creazione di cruscotti KPI e reportistica direzionale', cluster: 'data_bi', category: 'Dati & Automazione' },
  { id: 't_scripts', label: 'Automazione flussi dati tramite script (R, Python, SQL, Macro)', cluster: 'data_bi', category: 'Dati & Automazione' },
  // Cluster: Operations & ERP
  { id: 't_erp_flow', label: 'Ottimizzazione flussi sul gestionale (ERP) e supporto utenti', cluster: 'operations_erp', category: 'Processi & ERP' },
  { id: 't_fornitori', label: 'Monitoraggio tempi di consegna e performance dei fornitori', cluster: 'operations_erp', category: 'Processi & ERP' },
  // Cluster: Sales & CRM
  { id: 't_crm', label: 'Gestione pipeline CRM, analisi preventivi e conversioni vendita', cluster: 'sales_crm', category: 'Commerciale & CRM' },
  // Distractor / Out-of-scope tasks that trigger the "Tuttofare Alert"
  { id: 't_social', label: 'Gestione pagina Instagram/TikTok, grafica e post social', cluster: 'distractor_mktg', category: 'Attività Fuori Fuoco' },
  { id: 't_centralino', label: 'Accoglienza clienti, centralino, spedizione pacchi e commissioni', cluster: 'distractor_sec', category: 'Attività Fuori Fuoco' }
];

const SOFTWARE_OPTIONS = [
  { id: 'sw_excel', label: 'Excel Avanzato / Google Sheets (Pivot, XLOOKUP, Macro)', level: 'core',ralBonus: 0 },
  { id: 'sw_erp_pmi', label: 'Gestionali PMI (TeamSystem, Zucchetti, Mexal, Danea)', level: 'core', ralBonus: 500 },
  { id: 'sw_erp_ent', label: 'ERP Strutturati (SAP, Oracle NetSuite, MS Dynamics 365)', level: 'advanced', ralBonus: 2000 },
  { id: 'sw_pa', label: 'Portali PA & Sanità (SDI, NSO, MEPA, Piattaforma Crediti)', level: 'spec', ralBonus: 1200 },
  { id: 'sw_bi', label: 'Business Intelligence (Power BI, Tableau, Looker Studio)', level: 'advanced', ralBonus: 1800 },
  { id: 'sw_code', label: 'Analisi Quantitativa & Codice (R / RStudio, Python, SQL)', level: 'quant', ralBonus: 2500 },
  { id: 'sw_crm', label: 'CRM & Automazione (HubSpot, Salesforce, Zapier/Make)', level: 'spec', ralBonus: 1000 }
];

const LOCATIONS = [
  { id: 'roma', label: 'Roma e Provincia', multiplier: 1.04, avgRentMono: 780, cityNote: 'Affitto medio monolocale ~780 €/mese: sotto i 1.600 € netti + buoni pasto il rischio di turnover nel primo anno è altissimo.' },
  { id: 'milano', label: 'Milano e Hinterland', multiplier: 1.12, avgRentMono: 950, cityNote: 'Affitto medio monolocale ~950 €/mese: forte competizione con Big4 e multinazionali sui profili economico-quantitativi.' },
  { id: 'nord', label: 'Nord Italia (Bologna, Torino, Veneto, Emilia)', multiplier: 1.03, avgRentMono: 680, cityNote: 'Tessuto manifatturiero ad alta domanda di controller e analisti; costo dell’abitare medio-alto nei capoluoghi.' },
  { id: 'centrosud', label: 'Centro-Sud e Province', multiplier: 0.93, avgRentMono: 520, cityNote: 'Potere d’acquisto reale più favorevole, ma crescente concorrenza di aziende che assumono da remoto.' }
];

const AUTONOMY_LEVELS = [
  {
    id: 'junior_trained',
    label: 'Junior Qualificato (da affiancare sui processi specifici)',
    desc: 'Ha solide basi accademiche/quantitative (es. neolaureato magistrale o con 6-12 mesi di tirocinio) ma va guidato sul contesto aziendale.',
    multiplier: 0.95,
    expLabel: '0–18 mesi (anche Tirocinio strategico pre-laurea)'
  },
  {
    id: 'mid_autonomous',
    label: 'Operativo Autonomo (pronto all’uso)',
    desc: 'Ha già visto il processo in un’altra azienda o società di consulenza e può lavorare da subito con supervisione minima.',
    multiplier: 1.16,
    expLabel: '2–4 anni di esperienza nel ruolo'
  },
  {
    id: 'senior_lead',
    label: 'Profilo Strutturato / Responsabile (imposta il metodo da zero)',
    desc: 'In azienda non c’è ancora una procedura: serve qualcuno che costruisca il sistema e guidi la transizione.',
    multiplier: 1.38,
    expLabel: '4+ anni di esperienza strutturata'
  }
];

const PRESETS = [
  {
    id: 'preset_pa',
    badge: 'Caso Studio Consigliato',
    name: 'Consulenza PA & Sanità: Ciclo Passivo & Dati',
    companySector: 'Società di Consulenza Direzionale & PA (35 addetti)',
    bottleneckId: 'procure_to_pay',
    selectedTasks: ['t_3way', 't_sdi_nso', 't_compliance', 't_cleaning'],
    selectedSoftware: ['sw_excel', 'sw_pa', 'sw_erp_ent', 'sw_code'],
    autonomyId: 'junior_trained',
    contractType: 'apprendistato',
    locationId: 'roma',
    workMode: 'Ibrido (2 gg/sett Smart Working)',
    buoniPasto: 8,
    costoAzienda: 35500,
    hoursSavedWeek: 12,
    hourlyValueOwner: 45,
    annualSpendVolume: 2500000,
    customNotes: 'Lavoriamo con ASL e Pubblica Amministrazione a Roma. Cerchiamo un laureando/neolaureato magistrale sveglio che non faccia solo data entry sulle fatture, ma usi Excel avanzato, R o Python per tracciare i KPI dei pagamenti e sbloccare i colli di bottiglia tra NSO e SDI.'
  },
  {
    id: 'preset_manifattura',
    badge: 'PMI Manifatturiera',
    name: 'PMI Industriale: Margini Commessa & Caos Excel',
    companySector: 'Azienda Manifatturiera Meccatronica (42 addetti, 6.5M € fatturato)',
    bottleneckId: 'controlling',
    selectedTasks: ['t_margini', 't_budget', 't_cleaning', 't_dashboard'],
    selectedSoftware: ['sw_excel', 'sw_erp_pmi', 'sw_bi'],
    autonomyId: 'junior_trained',
    contractType: 'apprendistato',
    locationId: 'nord',
    workMode: 'In sede con flessibilità oraria',
    buoniPasto: 8,
    costoAzienda: 36500,
    hoursSavedWeek: 14,
    hourlyValueOwner: 55,
    annualSpendVolume: 3200000,
    customNotes: 'Oggi i costi delle commesse sono sparsi su 20 file Excel diversi. Vogliamo una figura giovane ma con testa analitica per mettere ordine nei margini industriali insieme al commercialista.'
  },
  {
    id: 'preset_tuttofare',
    badge: 'Test Alert Errore PMI',
    name: 'L’Errore Classico: "Cerchiamo Impiegato Tuttofare"',
    companySector: 'Azienda Commerciale & Distribuzione (18 addetti)',
    bottleneckId: 'operations_erp',
    selectedTasks: ['t_3way', 't_dashboard', 't_crm', 't_social', 't_centralino'],
    selectedSoftware: ['sw_excel', 'sw_erp_pmi', 'sw_bi', 'sw_code'],
    autonomyId: 'mid_autonomous',
    contractType: 'indeterminato',
    locationId: 'roma',
    workMode: '100% In Sede',
    buoniPasto: 0,
    costoAzienda: 31000,
    hoursSavedWeek: 10,
    hourlyValueOwner: 40,
    annualSpendVolume: 1800000,
    customNotes: 'Cerchiamo una persona dinamica che segua le fatture, sistemi il gestionale, crei le statistiche di vendita e nel tempo libero aggiorni anche i social e risponda al telefono.'
  }
];

// ============================================================================
// FUNZIONI DI CALCOLO FISCALE ITALIANO (COSTO AZIENDA -> RAL -> NETTO 2026)
// ============================================================================

function calculateItalianPayroll(costoAzienda, contractType, buoniPastoDay) {
  // Coefficiente di ricarico datore di lavoro (INPS datore + TFR 7.41% + INAIL/fondi)
  // Apprendistato professionalizzante nelle PMI gode di forte sgravio contributivo datoriale e aliquota INPS dipendente ridotta (5.84% vs 9.19%)
  const employerMultiplier = contractType === 'apprendistato' ? 1.215 : 1.385;
  const ral = Math.round(costoAzienda / employerMultiplier);

  // Contributi previdenziali a carico del lavoratore
  const employeeInpsRate = contractType === 'apprendistato' ? 0.0584 : 0.0919;
  const imponibileFiscale = ral * (1 - employeeInpsRate);

  // Calcolo IRPEF Lorda (Scaglioni 2026: 23% fino a 28k, 33% da 28k a 50k, 43% oltre 50k)
  let irpefLorda = 0;
  if (imponibileFiscale <= 28000) {
    irpefLorda = imponibileFiscale * 0.23;
  } else if (imponibileFiscale <= 50000) {
    irpefLorda = 6440 + (imponibileFiscale - 28000) * 0.33;
  } else {
    irpefLorda = 6440 + 7260 + (imponibileFiscale - 50000) * 0.43;
  }

  // Detrazioni lavoro dipendente + cuneo fiscale / trattamento integrativo (stima realistica 2026)
  let detrazioni = 0;
  if (imponibileFiscale <= 15000) {
    detrazioni = 1955;
  } else if (imponibileFiscale <= 28000) {
    detrazioni = 1910 + 1190 * ((28000 - imponibileFiscale) / 13000) + 950; // include beneficio taglio cuneo
  } else if (imponibileFiscale <= 50000) {
    detrazioni = (1910 + 650) * ((50000 - imponibileFiscale) / 22000);
  }

  // Addizionali regionali e comunali (~2.3% medio)
  const addizionali = imponibileFiscale * 0.023;
  const irpefNetta = Math.max(0, irpefLorda - detrazioni) + addizionali;

  const nettoAnnuo = Math.round(imponibileFiscale - irpefNetta);
  const nettoMensile13 = Math.round(nettoAnnuo / 13);
  const buoniPastoMensili = Math.round(buoniPastoDay * 20); // 20 gg lavorativi medi
  const potereAcquistoTotaleMensile = nettoMensile13 + buoniPastoMensili;

  // Confronto con l'altro contratto a parità di Costo Azienda
  const altMultiplier = contractType === 'apprendistato' ? 1.385 : 1.215;
  const altRalSameBudget = Math.round(costoAzienda / altMultiplier);

  return {
    costoAzienda,
    ral,
    nettoAnnuo,
    nettoMensile13,
    buoniPastoMensili,
    potereAcquistoTotaleMensile,
    employerTaxesAndTfr: costoAzienda - ral,
    employeeTaxesAndInps: ral - nettoAnnuo,
    taxWedgePct: Math.round(((costoAzienda - nettoAnnuo) / costoAzienda) * 100),
    altRalSameBudget
  };
}

// ============================================================================
// MAIN REACT COMPONENT
// ============================================================================

export default function App() {
  // Wizard & Navigation State
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('diagnosi'); // 'diagnosi' | 'annuncio' | 'colloquio' | 'python'

  // Form State (initialized with Preset 1: Consulenza PA & Ciclo Passivo)
  const [companySector, setCompanySector] = useState(PRESETS[0].companySector);
  const [bottleneckId, setBottleneckId] = useState(PRESETS[0].bottleneckId);
  const [selectedTasks, setSelectedTasks] = useState(PRESETS[0].selectedTasks);
  const [selectedSoftware, setSelectedSoftware] = useState(PRESETS[0].selectedSoftware);
  const [autonomyId, setAutonomyId] = useState(PRESETS[0].autonomyId);
  const [contractType, setContractType] = useState(PRESETS[0].contractType);
  const [locationId, setLocationId] = useState(PRESETS[0].locationId);
  const [workMode, setWorkMode] = useState(PRESETS[0].workMode);
  const [buoniPasto, setBuoniPasto] = useState(PRESETS[0].buoniPasto);
  const [costoAzienda, setCostoAzienda] = useState(PRESETS[0].costoAzienda);
  const [hoursSavedWeek, setHoursSavedWeek] = useState(PRESETS[0].hoursSavedWeek);
  const [hourlyValueOwner, setHourlyValueOwner] = useState(PRESETS[0].hourlyValueOwner);
  const [annualSpendVolume, setAnnualSpendVolume] = useState(PRESETS[0].annualSpendVolume);
  const [customNotes, setCustomNotes] = useState(PRESETS[0].customNotes);

  // UI & AI States
  const [copiedId, setCopiedId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCustomOutput, setAiCustomOutput] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Load a Preset Scenario
  const applyPreset = (preset) => {
    setCompanySector(preset.companySector);
    setBottleneckId(preset.bottleneckId);
    setSelectedTasks(preset.selectedTasks);
    setSelectedSoftware(preset.selectedSoftware);
    setAutonomyId(preset.autonomyId);
    setContractType(preset.contractType);
    setLocationId(preset.locationId);
    setWorkMode(preset.workMode);
    setBuoniPasto(preset.buoniPasto);
    setCostoAzienda(preset.costoAzienda);
    setHoursSavedWeek(preset.hoursSavedWeek);
    setHourlyValueOwner(preset.hourlyValueOwner);
    setAnnualSpendVolume(preset.annualSpendVolume);
    setCustomNotes(preset.customNotes);
    setAiCustomOutput(null);
  };

  // Toggle Multi-selects
  const toggleTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleSoftware = (swId) => {
    setSelectedSoftware((prev) =>
      prev.includes(swId) ? prev.filter((id) => id !== swId) : [...prev, swId]
    );
  };

  // Clean up "Tuttofare" tasks automatically with 1 click
  const fixTuttofareRole = () => {
    setSelectedTasks((prev) =>
      prev.filter((id) => {
        const t = TASKS.find((item) => item.id === id);
        return t && !t.cluster.startsWith('distractor');
      }).slice(0, 4)
    );
  };

  // ============================================================================
  // DERIVED ANALYTICS: PAYROLL, BENCHMARK, TUTTOFARE ALERT, ROI & TEMPLATES
  // ============================================================================
  const analysis = useMemo(() => {
    const bottleneck = BOTTLENECKS.find((b) => b.id === bottleneckId) || BOTTLENECKS[0];
    const location = LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];
    const autonomy = AUTONOMY_LEVELS.find((a) => a.id === autonomyId) || AUTONOMY_LEVELS[0];

    // 1. Calcolo Fiscale Costo Azienda -> RAL -> Netto
    const payroll = calculateItalianPayroll(costoAzienda, contractType, buoniPasto);

    // 2. Calcolo Benchmark di Mercato per la combinazione scelta
    const softwareBonus = selectedSoftware.reduce((acc, swId) => {
      const sw = SOFTWARE_OPTIONS.find((s) => s.id === swId);
      return acc + (sw ? sw.ralBonus : 0);
    }, 0);

    const rawBenchmarkRal =
      (bottleneck.baseBenchmarkRAL + softwareBonus * 0.65) *
      location.multiplier *
      autonomy.multiplier;
    const marketBenchmarkRal = Math.round(rawBenchmarkRal / 500) * 500;
    const ralGap = payroll.ral - marketBenchmarkRal;

    let marketStatus = 'aligned'; // 'critical' | 'warning' | 'aligned' | 'competitive'
    if (ralGap < -3500) marketStatus = 'critical';
    else if (ralGap < -1200) marketStatus = 'warning';
    else if (ralGap > 2500) marketStatus = 'competitive';

    // 3. Controllo Coerenza Mansioni ("Alert Tuttofare")
    const taskObjects = selectedTasks.map((id) => TASKS.find((t) => t.id === id)).filter(Boolean);
    const hasDistractors = taskObjects.some((t) => t.cluster.startsWith('distractor'));
    const distinctClusters = new Set(taskObjects.map((t) => t.cluster)).size;
    const isTuttofare = hasDistractors || distinctClusters >= 3 || selectedTasks.length > 5;

    // Affinamento dinamico del titolo del ruolo se include R/Python/BI
    const hasQuantStack = selectedSoftware.includes('sw_code') || selectedSoftware.includes('sw_bi');
    const finalRoleTitle =
      hasQuantStack && !bottleneck.modernRole.includes('Data')
        ? `${bottleneck.modernRole} & Data Reporting`
        : bottleneck.modernRole;

    // 4. Calcolo ROI & Break-Even dell'assunzione
    const annualTimeSavedValue = Math.round(hoursSavedWeek * 46 * hourlyValueOwner);
    // Recupero di efficienza conservativo (es. sblocco pagamenti, riduzione errori contabili, sconti cassa o controllo margini)
    const conservativeEfficiencyRate = 0.008; // 0.8% sul volume gestito
    const annualEfficiencyGain = Math.round(annualSpendVolume * conservativeEfficiencyRate);
    const totalAnnualBenefit = annualTimeSavedValue + annualEfficiencyGain;
    const netAnnualRoiEuro = totalAnnualBenefit - costoAzienda;
    const roiMultiplier = (totalAnnualBenefit / costoAzienda).toFixed(2);
    // Tenendo conto di ~2 mesi di onboarding iniziale prima della piena produttività
    const monthlyBenefit = totalAnnualBenefit / 12;
    const breakEvenMonths = Math.min(24, Math.max(2, Math.round((costoAzienda / monthlyBenefit) * 1.15)));

    // Incidenza affitto sul netto + buoni pasto nella città selezionata
    const rentSharePct = Math.round((location.avgRentMono / payroll.potereAcquistoTotaleMensile) * 100);

    // 5. Generazione Job Description strutturata ad alta conversione
    const ralRangeMin = Math.round((payroll.ral - 1000) / 500) * 500;
    const ralRangeMax = Math.round((payroll.ral + 1500) / 500) * 500;
    const swLabels = selectedSoftware
      .map((id) => SOFTWARE_OPTIONS.find((s) => s.id === id)?.label)
      .filter(Boolean);
    const cleanTasks = taskObjects.filter((t) => !t.cluster.startsWith('distractor'));

    const generatedAd = `POSIZIONE: ${finalRoleTitle}
SEDE: ${location.label} — Modalità: ${workMode}
INQUADRAMENTO: ${contractType === 'apprendistato' ? 'Apprendistato Professionalizzante / Inserimento Strutturato' : 'Tempo Indeterminato'} | RAL: € ${ralRangeMin.toLocaleString('it-IT')} – € ${ralRangeMax.toLocaleString('it-IT')}${buoniPasto > 0 ? ` + Buoni Pasto (€ ${buoniPasto}/gg)` : ''}

CHI SIAMO E QUAL È LA SFIDA OPERATIVA
Siamo una realtà attiva nel settore "${companySector}". Per accompagnare la crescita e strutturare il controllo dei nostri flussi aziendali, non cerchiamo una figura esecutiva di semplice inserimento dati, ma un/una ${finalRoleTitle} capace di unire rigore metodologico, lettura dei numeri e padronanza degli strumenti digitali.

COSA FARAI CONCRETAMENTE (RESPONSABILITÀ SETTIMANALI)
${(cleanTasks.length > 0 ? cleanTasks : TASKS.slice(0, 3)).map((t) => `• ${t.label}`).join('\n')}

OBIETTIVI MISURABILI DEI PRIMI 6 MESI (KPI)
${bottleneck.kpi6Months.map((kpi, idx) => `${idx + 1}. ${kpi}`).join('\n')}

STACK TECNOLOGICO E STRUMENTI CHE USERAI
${swLabels.length > 0 ? swLabels.map((s) => `• ${s}`).join('\n') : '• Excel Avanzato / Google Sheets e Gestionale ERP aziendale'}

IL PROFILO IDEALE CHE CERCHIAMO
• Formazione: ${bottleneck.academicTarget}.
• Livello di autonomia: ${autonomy.label} (${autonomy.expLabel}).
• Approccio pratico ai dati: capacità di leggere un flusso documentale/contabile, individuare dove si blocca il processo e strutturare report chiari senza perdere ore in passaggi manuali.

COSA OFFRIAMO (SENZA SORPRESE)
• Contratto chiaro fin dal primo giorno con RAL compresa tra € ${ralRangeMin.toLocaleString('it-IT')} e € ${ralRangeMax.toLocaleString('it-IT')} (circa € ${payroll.nettoMensile13.toLocaleString('it-IT')} netti/mese su 13 mensilità)${buoniPasto > 0 ? `, oltre a Buoni Pasto da € ${buoniPasto}/giorno (~€ ${payroll.buoniPastoMensili}/mese esentasse)` : ''}.
• Modalità di lavoro: ${workMode}.
• Visibilità diretta sui processi decisionali dell'azienda e percorso di crescita legato a risultati misurabili.`;

    // 6. Kit Colloquio Tecnico in 3 Domande (calibrato sul ruolo)
    const interviewQuestions = [
      {
        q:
          bottleneckId === 'procure_to_pay'
            ? 'Come gestisci il controllo incrociato (3-way matching) quando una fattura elettronica su SDI presenta una discrepanza rispetto all’ordine NSO o al DDT?'
            : bottleneckId === 'data_bi'
            ? 'Se ti consegno un’estrazione sporca dal gestionale con 15.000 righe, codici duplicati e date disallineate, quali passaggi segui per pulirla e renderla aggiornabile ogni mese?'
            : 'Se devi ricostruire la marginalità reale di una commessa o linea di servizio partendo da file Excel separati tra acquisti e fatturazione, da dove inizi?',
        why: 'Verifica subito se il candidato ha metodo logico sui flussi reali o se conosce solo definizioni teoriche.',
        greenFlag:
          'Parla subito di chiavi univoche di riconciliazione (es. CIG/Numero Ordine/ID), pulizia strutturata (PowerQuery, Pivot, R o Python) e separazione tra dati grezzi e report.',
        redFlag:
          'Risponde che "controlla le righe una per una a mano o con la calcolatrice" oppure resta vago senza nominare alcuno strumento di verifica.'
      },
      {
        q: selectedSoftware.includes('sw_code')
          ? 'Raccontami un caso concreto (anche accademico o di tesi) in cui hai usato R, Python o SQL per automatizzare un’analisi o estrarre un indicatore che su Excel era troppo lento.'
          : 'Qual è il file di monitoraggio o report più complesso che hai costruito finora e quali formule o logiche hai usato per evitare errori manuali?',
        why: 'Misura la reale alfabetizzazione tecnica (Data & Code Literacy) e l’autonomia operativa.',
        greenFlag:
          'Descrive il problema di partenza, la struttura dei dati, le funzioni usate (es. XLOOKUP/INDEX-MATCH, script pandas/dplyr) e il tempo risparmiato.',
        redFlag:
          'Dice di avere "ottimo livello di Excel/software" ma non sa citare nemmeno una funzione logica o di incrocio dati oltre alla somma.'
      },
      {
        q: 'Se ti accorgi che un reparto o un fornitore ritarda sistematicamente l’invio dei dati bloccando la tua scadenza, come intervieni?',
        why: 'Valuta la tenuta operativa e la capacità di risolvere colli di bottiglia organizzativi.',
        greenFlag:
          'Propone di mappare il motivo del blocco, standardizzare il formato di raccolta dati e creare un alert preventivo prima della scadenza.',
        redFlag:
          'Scarica passivamente la colpa sugli altri uffici ("aspetto finché non me li mandano") senza proporre un processo.'
      }
    ];

    return {
      bottleneck,
      location,
      autonomy,
      payroll,
      marketBenchmarkRal,
      ralGap,
      marketStatus,
      isTuttofare,
      hasDistractors,
      distinctClusters,
      finalRoleTitle,
      annualTimeSavedValue,
      annualEfficiencyGain,
      totalAnnualBenefit,
      netAnnualRoiEuro,
      roiMultiplier,
      breakEvenMonths,
      rentSharePct,
      generatedAd,
      interviewQuestions
    };
  }, [
    companySector,
    bottleneckId,
    selectedTasks,
    selectedSoftware,
    autonomyId,
    contractType,
    locationId,
    workMode,
    buoniPasto,
    costoAzienda,
    hoursSavedWeek,
    hourlyValueOwner,
    annualSpendVolume
  ]);

  // ============================================================================
  // GEMINI API CALL: RAFFINAMENTO INTELLIGENTE ANNUNCIO E KIT COLLOQUIO
  // ============================================================================
  const handleRefineWithAI = async () => {
    setAiLoading(true);
    setAiError(null);

    const systemPrompt = `Sei un Senior Partner di consulenza organizzativa ed economista del lavoro specializzato nelle PMI italiane.
Il tuo compito è trasformare il fabbisogno grezzo di un imprenditore in un Annuncio di Lavoro ad altissima conversione (zero fuffa HR, metriche chiare, trasparenza retributiva) e in un Caso Pratico di selezione di 20 minuti.
Usa criteri esclusivamente professionali, tecnici e oggettivi (competenze, software, processi, obiettivi a 6 mesi, inquadramento contrattuale e RAL).`;

    const userQuery = `Genera una versione personalizzata e su misura per questa azienda:
- Settore Azienda: ${companySector}
- Ruolo Individuato: ${analysis.finalRoleTitle}
- Collo di bottiglia: ${analysis.bottleneck.title}
- Note specifiche dell'imprenditore: "${customNotes}"
- Sede e modalità: ${analysis.location.label} (${workMode})
- Contratto e Offerta: ${contractType === 'apprendistato' ? 'Apprendistato Professionalizzante' : 'Tempo Indeterminato'}, Costo Azienda €${costoAzienda}, RAL €${analysis.payroll.ral} (Netto ~€${analysis.payroll.nettoMensile13}/mese su 13 mensilità + Buoni Pasto €${buoniPasto}/gg).
- Stack richiesto: ${selectedSoftware.join(', ')}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            customJobAd: { type: 'STRING' },
            practicalTest20Min: { type: 'STRING' },
            strategicAdviceForOwner: { type: 'STRING' }
          },
          propertyOrdering: ['customJobAd', 'practicalTest20Min', 'strategicAdviceForOwner']
        }
      }
    };

    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    let delay = 1000;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Errore nella risposta API');
        const data = await res.json();
        const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          setAiCustomOutput(JSON.parse(rawJson));
          setAiLoading(false);
          return;
        }
      } catch (err) {
        if (attempt === 2) {
          setAiError('Impossibile contattare il motore AI in questo momento. Puoi comunque usare l’annuncio generato dal motore deterministico qui sotto.');
        } else {
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
        }
      }
    }
    setAiLoading(false);
  };

  // Copy helper
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // Python Backend Code String for Portfolio Tab
  const pythonBackendCode = `# ruolochiaro_engine.py
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
    sim = calcola_busta_paga_pmi(${costoAzienda}, "${contractType}", ${buoniPasto})
    print(f"Ruolo Target: ${analysis.finalRoleTitle}")
    print(f"Costo Azienda: €{sim.costo_azienda:,} -> RAL: €{sim.ral_annua:,} -> Netto + BP: €{sim.potere_acquisto_mensile:,}/mese")`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* TOP BAR / EXECUTIVE HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">RuoloChiaro PMI</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Skill-Mismatch Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Traduce i colli di bottiglia dell’imprenditore in Ruolo Strutturato, Calcolo Costo Azienda/RAL, ROI e Annuncio Pronto
              </p>
            </div>
          </div>

          {/* 1-CLICK PRESET SCENARIOS */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 hidden lg:inline">Carica caso studio:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{preset.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* LIVE KPI STRIP (SEMPRE VISIBILE) */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Ruolo Tradotto dal Mercato
            </span>
            <span className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {analysis.finalRoleTitle}
            </span>
            <span className="text-xs text-slate-500 truncate">
              Invece di: <em className="line-through">{analysis.bottleneck.naiveTitle}</em>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Conversione Fiscale ({contractType === 'apprendistato' ? 'Apprendistato' : 'Indeterminato'})
            </span>
            <div className="flex items-baseline gap-2 mt-0.5 font-mono">
              <span className="text-sm font-bold text-indigo-600">
                RAL €{analysis.payroll.ral.toLocaleString('it-IT')}
              </span>
              <span className="text-xs text-slate-400">da €{costoAzienda.toLocaleString('it-IT')} costo</span>
            </div>
            <span className="text-xs text-emerald-700 font-medium">
              Netto: ~€{analysis.payroll.nettoMensile13.toLocaleString('it-IT')}/mese{' '}
              {buoniPasto > 0 ? `+ €${analysis.payroll.buoniPastoMensili} BP` : ''}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Reality Check ({analysis.location.label.split(' ')[0]})
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {analysis.marketStatus === 'critical' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                  <AlertTriangle className="w-3.5 h-3.5" /> Sotto Mercato ({analysis.ralGap.toLocaleString('it-IT')} €)
                </span>
              )}
              {analysis.marketStatus === 'warning' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5" /> Al limite ({analysis.ralGap.toLocaleString('it-IT')} €)
                </span>
              )}
              {(analysis.marketStatus === 'aligned' || analysis.marketStatus === 'competitive') && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Offerta Competitiva (Target €{analysis.marketBenchmarkRal.toLocaleString('it-IT')})
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">
              Affitto medio assorbe il <strong>{analysis.rentSharePct}%</strong> delle entrate
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Break-Even & Coerenza Ruolo
            </span>
            <div className="flex items-center gap-2 mt-0.5 font-mono">
              <span className="text-sm font-bold text-slate-900">
                Pareggio in {analysis.breakEvenMonths} mesi
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                ROI {analysis.roiMultiplier}x
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {analysis.isTuttofare ? (
                <span className="text-amber-600 font-semibold">⚠️ Attenzione: mansioni "Tuttofare"</span>
              ) : (
                <span className="text-emerald-700">✓ Perimetro mansioni focalizzato</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID: LEFT 5-STEP INTERVIEWER | RIGHT LIVE OUTPUT TABS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 5-STEP ENTREPRENEUR INTERVIEW WIZARD (5 cols on lg) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Step Progress Header */}
            <div className="bg-slate-900 text-white px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Intervista Guidata Imprenditore
                </span>
                <span className="text-xs font-mono text-slate-400">Step {currentStep} di 5</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { n: 1, label: 'Problema' },
                  { n: 2, label: 'Mansioni' },
                  { n: 3, label: 'Software' },
                  { n: 4, label: 'Contratto' },
                  { n: 5, label: 'Budget/ROI' }
                ].map((s) => (
                  <button
                    key={s.n}
                    onClick={() => setCurrentStep(s.n)}
                    className={`text-left p-1.5 rounded-lg transition border ${
                      currentStep === s.n
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : currentStep > s.n
                        ? 'bg-slate-800 border-slate-700 text-indigo-300'
                        : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-[10px] font-mono opacity-75">0{s.n}</div>
                    <div className="text-[11px] font-semibold truncate">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wizard Body */}
            <div className="p-5">
              {/* STEP 1: COLLO DI BOTTIGLIA */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      1. Qual è il problema operativo che ti fa perdere più tempo o margine?
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Non pensare al titolo di studio: scegli il collo di bottiglia che questa persona deve risolvere nei primi 6 mesi.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Settore e dimensione della tua azienda
                    </label>
                    <input
                      type="text"
                      value={companySector}
                      onChange={(e) => setCompanySector(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-none"
                      placeholder="Es. PMI Manifatturiera (30 dipendenti) o Consulenza PA"
                    />
                  </div>

                  <div className="space-y-2.5">
                    {BOTTLENECKS.map((b) => {
                      const active = bottleneckId === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setBottleneckId(b.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                            active
                              ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/15'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                              active ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                            }`}
                          >
                            {active && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{b.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{b.subtitle}</div>
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                              <span>Ruolo target: {b.modernRole}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: MANSIONI SETTIMANALI */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        2. Cosa farà concretamente ogni settimana?
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Seleziona <strong>2–4 attività chiave</strong>. Se mescoli reparti incompatibili (es. contabilità + social media + centralino), si attiverà l’Alert Tuttofare.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded-md bg-slate-100 text-slate-700 shrink-0">
                      {selectedTasks.length} scelte
                    </span>
                  </div>

                  {analysis.isTuttofare && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Rilevato profilo "Tuttofare" ({analysis.distinctClusters} aree diverse)</span>
                        </div>
                        <p className="mt-1 text-amber-800">
                          I laureati qualificati scartano gli annunci che mescolano analisi dati/contabilità con segreteria generica o social media.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={fixTuttofareRole}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shrink-0 transition"
                      >
                        Pulisci Ruolo
                      </button>
                    </div>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {TASKS.map((task) => {
                      const checked = selectedTasks.includes(task.id);
                      const isDistractor = task.cluster.startsWith('distractor');
                      return (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                            checked
                              ? isDistractor
                                ? 'border-amber-500 bg-amber-50/70'
                                : 'border-indigo-600 bg-indigo-50/60'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                checked
                                  ? isDistractor
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-indigo-600 text-white'
                                  : 'border border-slate-300'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-slate-800">{task.label}</span>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                              isDistractor
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: STACK SOFTWARE */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      3. Quali software e strumenti userà in azienda?
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seleziona gli strumenti già presenti o che vorresti introdurre grazie a questa figura (impatta sul benchmark RAL e sulle domande del colloquio).
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {SOFTWARE_OPTIONS.map((sw) => {
                      const checked = selectedSoftware.includes(sw.id);
                      return (
                        <button
                          key={sw.id}
                          type="button"
                          onClick={() => toggleSoftware(sw.id)}
                          className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                            checked
                              ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                checked ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800">{sw.label}</span>
                          </div>
                          {sw.ralBonus > 0 && (
                            <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0">
                              +{sw.ralBonus} € valore mercato
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: AUTONOMIA, CONTRATTO E SEDE */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      4. Livello di autonomia, Contratto e Sede di lavoro
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      L’apprendistato professionalizzante riduce il cuneo contributivo e permette di offrire un netto più alto a parità di costo per l’azienda.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Livello di esperienza richiesto
                    </label>
                    {AUTONOMY_LEVELS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAutonomyId(a.id)}
                        className={`w-full text-left p-3 rounded-xl border transition ${
                          autonomyId === a.id
                            ? 'border-indigo-600 bg-indigo-50/60'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{a.label}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{a.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipologia Contrattuale
                      </label>
                      <select
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:outline-none"
                      >
                        <option value="apprendistato">Apprendistato Professionalizzante (Agevolato)</option>
                        <option value="indeterminato">Tempo Indeterminato Ordinario</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Area Geografica Sede
                      </label>
                      <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:outline-none"
                      >
                        {LOCATIONS.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Modalità di Lavoro
                      </label>
                      <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:outline-none"
                      >
                        <option value="Ibrido (2 gg/sett Smart Working)">Ibrido (2 gg/sett Smart Working)</option>
                        <option value="In sede con flessibilità oraria">In sede con flessibilità oraria</option>
                        <option value="100% In Sede">100% In Sede</option>
                        <option value="Full Remote / Lavoro Agile">Full Remote / Lavoro Agile</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Buoni Pasto Giornalieri (Esentasse)
                      </label>
                      <select
                        value={buoniPasto}
                        onChange={(e) => setBuoniPasto(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:outline-none"
                      >
                        <option value={8}>8 € / giorno (~160 €/mese netti)</option>
                        <option value={7}>7 € / giorno (~140 €/mese netti)</option>
                        <option value={0}>Nessun buono pasto (0 €)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: BUDGET COSTO AZIENDA & ROI */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      5. Budget "Costo Azienda" e Ritorno sull’Investimento
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Inserisci il budget annuo totale che l’azienda stanzia (comprensivo di INPS datore e TFR): il motore scorpora automaticamente RAL e Netto.
                    </p>
                  </div>

                  {/* Costo Azienda Slider */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Budget Annuo Costo Azienda</span>
                      <span className="text-base font-bold font-mono text-indigo-600">
                        € {costoAzienda.toLocaleString('it-IT')} / anno
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25000}
                      max={68000}
                      step={500}
                      value={costoAzienda}
                      onChange={(e) => setCostoAzienda(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>€25k</span>
                      <span>Equivale a RAL €{analysis.payroll.ral.toLocaleString('it-IT')}</span>
                      <span>€68k</span>
                    </div>
                  </div>

                  {/* Ore Risparmiate Slider */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Ore/settimana liberate a titolare o senior
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900">
                        {hoursSavedWeek} ore / sett.
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={25}
                      step={1}
                      value={hoursSavedWeek}
                      onChange={(e) => setHoursSavedWeek(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Volume Acquisti/Fatturato gestito */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Volume costi/fatturato presidiato dal ruolo
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900">
                        € {(annualSpendVolume / 1000000).toFixed(1)} Milioni
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={10000000}
                      step={250000}
                      value={annualSpendVolume}
                      onChange={(e) => setAnnualSpendVolume(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Note libere per Gemini AI */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Note specifiche sulla tua azienda (usate anche dall’AI)
                    </label>
                    <textarea
                      rows={3}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-none"
                      placeholder="Descrivi brevemente cosa fate e perché cercate questa figura..."
                    />
                  </div>
                </div>
              )}

              {/* Wizard Footer Navigation */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                  disabled={currentStep === 1}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Indietro
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition"
                  >
                    <span>Continua allo Step {currentStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('annuncio')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition"
                  >
                    <span>Vai all’Annuncio Pronto</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: 4 LIVE OUTPUT TABS (7 cols on lg) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Output Navigation Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'diagnosi', label: '1. Diagnosi & ROI', icon: Calculator },
              { id: 'annuncio', label: '2. Annuncio Pronto', icon: FileText },
              { id: 'colloquio', label: '3. Kit Colloquio', icon: Users },
              { id: 'python', label: '4. Codice Python', icon: Code2 }
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ================================================================
              TAB 1: DIAGNOSI ECONOMICA, NORMALIZZAZIONE RUOLO & ROI
             ================================================================ */}
          {activeTab === 'diagnosi' && (
            <div className="space-y-4">
              {/* Role Translation Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    Traduzione Semantica del Fabbisogno
                  </span>
                  <span className="text-xs text-slate-500">Anti-Mismatch PMI</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200">
                    <div className="text-[11px] font-semibold uppercase text-rose-700">
                      ❌ Come lo chiamano di solito le PMI
                    </div>
                    <div className="text-sm font-bold text-rose-950 mt-1 line-through">
                      "{analysis.bottleneck.naiveTitle}"
                    </div>
                    <p className="text-xs text-rose-800 mt-1">
                      Attira profili generici non qualificati e fa scappare i laureati con competenze quantitative.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="text-[11px] font-semibold uppercase text-emerald-800">
                      ✓ Titolo Standardizzato di Mercato
                    </div>
                    <div className="text-sm font-bold text-emerald-950 mt-1">
                      "{analysis.finalRoleTitle}"
                    </div>
                    <p className="text-xs text-emerald-800 mt-1">
                      Target: {analysis.bottleneck.academicTarget}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scomposizione Fiscale Costo Azienda -> RAL -> Netto */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Dal "Costo Azienda" al Netto in Busta Paga (con Cuneo Fiscale 2026)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Perché l’azienda ha la percezione di spendere tanto mentre il candidato a {analysis.location.label.split(' ')[0]} riceve il giusto per vivere.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                    Cuneo Totale: {analysis.payroll.taxWedgePct}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-900 text-white">
                    <div className="text-[11px] uppercase text-slate-400 font-sans">1. Esborso Impresa</div>
                    <div className="text-lg font-bold mt-1">
                      € {analysis.payroll.costoAzienda.toLocaleString('it-IT')}
                    </div>
                    <div className="text-[11px] text-slate-300 font-sans mt-1">
                      Include € {analysis.payroll.employerTaxesAndTfr.toLocaleString('it-IT')} di INPS datore e TFR
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                    <div className="text-[11px] uppercase text-indigo-700 font-sans font-semibold">
                      2. RAL da Scrivere nell’Annuncio
                    </div>
                    <div className="text-lg font-bold mt-1 text-indigo-700">
                      € {analysis.payroll.ral.toLocaleString('it-IT')}
                    </div>
                    <div className="text-[11px] text-indigo-800 font-sans mt-1">
                      Benchmark per questo ruolo: € {analysis.marketBenchmarkRal.toLocaleString('it-IT')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <div className="text-[11px] uppercase text-emerald-800 font-sans font-semibold">
                      3. Netto Reale Candidato (13 mens.)
                    </div>
                    <div className="text-lg font-bold mt-1 text-emerald-700">
                      € {analysis.payroll.nettoMensile13.toLocaleString('it-IT')} / mese
                    </div>
                    <div className="text-[11px] text-emerald-800 font-sans mt-1">
                      + € {analysis.payroll.buoniPastoMensili}/mese Buoni Pasto ={' '}
                      <strong>€ {analysis.payroll.potereAcquistoTotaleMensile}</strong>
                    </div>
                  </div>
                </div>

                {/* Vantaggio Apprendistato vs Indeterminato */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900">
                      💡 Leva Contrattuale ({contractType === 'apprendistato' ? 'Apprendistato Attivo' : 'Indeterminato Ordinario'}):
                    </span>{' '}
                    <span className="text-slate-600">
                      {contractType === 'apprendistato'
                        ? `Con lo stesso budget di € ${costoAzienda.toLocaleString('it-IT')}, un contratto ordinario permetterebbe di offrire solo € ${analysis.payroll.altRalSameBudget.toLocaleString('it-IT')} di RAL (contro € ${analysis.payroll.ral.toLocaleString('it-IT')} in apprendistato).`
                        : `Passando all’Apprendistato Professionalizzante a parità di costo azienda (€ ${costoAzienda.toLocaleString('it-IT')}), potresti offrire una RAL di € ${analysis.payroll.altRalSameBudget.toLocaleString('it-IT')} attirando candidati molto più preparati.`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setContractType((c) => (c === 'apprendistato' ? 'indeterminato' : 'apprendistato'))
                    }
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-800 shrink-0 transition"
                  >
                    Simula {contractType === 'apprendistato' ? 'Indeterminato' : 'Apprendistato'}
                  </button>
                </div>

                {/* Reality Check Urbano (Affitto vs Stipendio) */}
                <div className="p-3.5 rounded-xl bg-indigo-950 text-white text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Indice Sostenibilità Urbana — {analysis.location.label}</span>
                    <span className="font-mono text-indigo-300">
                      Affitto medio monolocale: ~€{analysis.location.avgRentMono}/mese ({analysis.rentSharePct}% del pacchetto netto)
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{analysis.location.cityNote}</p>
                </div>
              </div>

              {/* Calcolatore ROI & Break-Even per l'Imprenditore */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Simulazione Ritorno sull’Investimento (ROI Assunzione)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Perché un profilo qualificato non è un "costo fisso amministrativo", ma un investimento che si ripaga da solo.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                    Break-Even: {analysis.breakEvenMonths} Mesi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-xs text-slate-500">Valore Tempo Liberato ({hoursSavedWeek}h/sett.)</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      + € {analysis.annualTimeSavedValue.toLocaleString('it-IT')} / anno
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-xs text-slate-500">Recupero Inefficienze & Anomalie (0,8%)</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      + € {analysis.annualEfficiencyGain.toLocaleString('it-IT')} / anno
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50">
                    <div className="text-xs text-emerald-800 font-semibold">Beneficio Netto Annuo Stimato</div>
                    <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                      {analysis.netAnnualRoiEuro >= 0 ? '+' : ''}€ {analysis.netAnnualRoiEuro.toLocaleString('it-IT')} / anno
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 2: ANNUNCIO PRONTO (LINKEDIN / INDEED) + GEMINI AI
             ================================================================ */}
          {activeTab === 'annuncio' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Job Description Strutturata (Pronta per LinkedIn & Indeed)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scritta con KPI misurabili, stack tecnologico reale e fascia RAL trasparente (+65% di candidature in target).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefineWithAI}
                    disabled={aiLoading}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generazione AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Personalizza con Gemini AI</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        aiCustomOutput ? aiCustomOutput.customJobAd : analysis.generatedAd,
                        'job_ad'
                      )
                    }
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition"
                  >
                    {copiedId === 'job_ad' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiato!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copia Annuncio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  {aiError}
                </div>
              )}

              {aiCustomOutput && (
                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-700">
                    <Sparkles className="w-4 h-4" /> Consiglio Strategico AI per l’Imprenditore:
                  </div>
                  <p>{aiCustomOutput.strategicAdviceForOwner}</p>
                </div>
              )}

              <pre className="w-full p-4 rounded-xl bg-slate-900 text-slate-100 text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800">
                {aiCustomOutput ? aiCustomOutput.customJobAd : analysis.generatedAd}
              </pre>
            </div>
          )}

          {/* ================================================================
              TAB 3: KIT COLLOQUIO TECNICO PER L'IMPRENDITORE
             ================================================================ */}
          {activeTab === 'colloquio' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="text-base font-bold text-slate-900">
                  Come valutare il candidato in 20 minuti (anche se non sei un tecnico)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Molti imprenditori assumono basandosi solo sulla simpatia perché non sanno come testare Excel avanzato, R/Python o la gestione del ciclo passivo. Usa queste 3 domande.
                </p>

                <div className="mt-4 space-y-3.5">
                  {analysis.interviewQuestions.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          Domanda Tecnica #{index + 1}
                        </span>
                        <span className="text-[11px] text-slate-500">{item.why}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">“{item.q}”</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                          <strong className="text-emerald-800 block mb-0.5">✓ Green Flag (Candidato Solido):</strong>
                          {item.greenFlag}
                        </div>
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                          <strong className="text-rose-800 block mb-0.5">✗ Red Flag (Candidato solo teorico):</strong>
                          {item.redFlag}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {aiCustomOutput?.practicalTest20Min && (
                  <div className="mt-4 p-4 rounded-xl bg-indigo-950 text-white text-xs space-y-1.5">
                    <div className="font-bold text-indigo-300 uppercase tracking-wider">
                      Prova Pratica Personalizzata (Generata da Gemini AI)
                    </div>
                    <p className="leading-relaxed text-slate-200">{aiCustomOutput.practicalTest20Min}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 4: CODICE PYTHON & ARCHITETTURA (PER IL TUO PORTFOLIO GITHUB)
             ================================================================ */}
          {activeTab === 'python' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Modulo Python & Motore Fiscale (Pronto per il tuo GitHub)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Puoi salvare questo script (`ruolochiaro_engine.py`) nel tuo repository GitHub come dimostrazione pratica di modellazione economica e sviluppo per il tuo CV.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pythonBackendCode, 'python_code')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition"
                >
                  {copiedId === 'python_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Codice Copiato!</span>
                    </>
                  ) : (
                    <>
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Copia Script Python</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="w-full p-4 rounded-xl bg-slate-900 text-emerald-300 text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800">
                {pythonBackendCode}
              </pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}