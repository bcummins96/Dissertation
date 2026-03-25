import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell, ResponsiveContainer, ReferenceLine, Label,
  ComposedChart, Line, Area
} from "recharts";

const COLORS = {
  tryp: "#3b82f6",
  pea: "#f97316",
  trypLight: "#93c5fd",
  peaLight: "#fdba74",
  calcium: "#10b981",
  arrestin: "#8b5cf6",
  bg: "#0f172a",
  card: "#1e293b",
  cardHover: "#334155",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#334155",
  accent: "#06b6d4",
  red: "#ef4444",
  green: "#22c55e",
  gold: "#eab308",
  ref: "#f43f5e",
};

const compounds = [
  { name: "Serotonin", type: "Ref", ext: "5-OH", extLen: 1,
    ca_wt: 8.505, ca_mut: 6.543, ca_wt_emax: 100, ca_mut_emax: 100,
    arr_wt: 7.457, arr_mut: 5.998, arr_wt_emax: 100, arr_mut_emax: 100 },
  { name: "2C-B", type: "PEA", ext: "-OCH₃", extLen: 1,
    ca_wt: 8.8275, ca_mut: 7.891, ca_wt_emax: 69.165, ca_mut_emax: 47.095,
    arr_wt: 8.142, arr_mut: 7.605, arr_wt_emax: 66.96, arr_mut_emax: 59.58 },
  { name: "DOB(-)", type: "PEA", ext: "-OCH₃", extLen: 1,
    ca_wt: 8.9245, ca_mut: 8.2215, ca_wt_emax: 83.845, ca_mut_emax: 81.21,
    arr_wt: 8.4015, arr_mut: 7.781, arr_wt_emax: 87.68, arr_mut_emax: 93.17 },
  { name: "1040", type: "PEA", ext: "-C(=O)NH₂", extLen: 0,
    ca_wt: 6.9325, ca_mut: 6.5985, ca_wt_emax: 39.775, ca_mut_emax: 35.355,
    arr_wt: 7.059, arr_mut: 5.6965, arr_wt_emax: 31.65, arr_mut_emax: 35.47 },
  { name: "1009", type: "PEA", ext: "-CH₂C(=O)NH₂", extLen: 0,
    ca_wt: 6.605, ca_mut: 6.4455, ca_wt_emax: 52.43, ca_mut_emax: 37.05,
    arr_wt: 5.549, arr_mut: 5.73, arr_wt_emax: 31.45, arr_mut_emax: 31.8 },
  { name: "1003", type: "PEA", ext: "-OCH₂-", extLen: 2,
    ca_wt: 7.5875, ca_mut: 7.775, ca_wt_emax: 49.375, ca_mut_emax: 46.865,
    arr_wt: 6.9965, arr_mut: 7.8085, arr_wt_emax: 26.69, arr_mut_emax: 37.8 },
  { name: "79", type: "PEA", ext: "-OCH₂CH₂-", extLen: 3,
    ca_wt: 7.5585, ca_mut: 8.028, ca_wt_emax: 50.915, ca_mut_emax: 48.785,
    arr_wt: 6.9675, arr_mut: 7.9345, arr_wt_emax: 26.815, arr_mut_emax: 46.935 },
  { name: "80", type: "PEA", ext: "-CH₂CH₂OCH₃", extLen: 4,
    ca_wt: 7.975, ca_mut: 8.346, ca_wt_emax: 73.645, ca_mut_emax: 80.68,
    arr_wt: 6.569, arr_mut: 7.983, arr_wt_emax: 41.39, arr_mut_emax: 77.47 },
  { name: "DiPT", type: "Tryp", ext: "none", extLen: 0,
    ca_wt: 7.01, ca_mut: 6.5175, ca_wt_emax: 71.66, ca_mut_emax: 51.945,
    arr_wt: 6.3245, arr_mut: 6.356, arr_wt_emax: 71.04, arr_mut_emax: 56.05 },
  { name: "4-HO-DiPT", type: "Tryp", ext: "4-OH", extLen: 1,
    ca_wt: 7.3035, ca_mut: 6.1435, ca_wt_emax: 76.61, ca_mut_emax: 58.33,
    arr_wt: 6.519, arr_mut: 5.6915, arr_wt_emax: 91.655, arr_mut_emax: 88.9 },
  { name: "78", type: "Tryp", ext: "4-CH₂CH₂OH", extLen: 3,
    ca_wt: 6.069, ca_mut: 5.6245, ca_wt_emax: 47.585, ca_mut_emax: 29.1,
    arr_wt: 5.627, arr_mut: 5.9835, arr_wt_emax: 49.275, arr_mut_emax: 20.675 },
  { name: "DMT", type: "Tryp", ext: "none", extLen: 0,
    ca_wt: 7.3135, ca_mut: 7.174, ca_wt_emax: 39.61, ca_mut_emax: 17.52,
    arr_wt: 6.6175, arr_mut: 6.627, arr_wt_emax: 49.635, arr_mut_emax: 31.61 },
  { name: "Psilocin", type: "Tryp", ext: "4-OH", extLen: 1,
    ca_wt: 7.9875, ca_mut: 7.657, ca_wt_emax: 50.835, ca_mut_emax: 32.225,
    arr_wt: 7.371, arr_mut: 7.2505, arr_wt_emax: 46.41, arr_mut_emax: 53.74 },
];

const enriched = compounds.map(c => {
  const dpCa = c.ca_wt - c.ca_mut;
  const dpArr = c.arr_wt - c.arr_mut;
  const tcCaWt = Math.log10(c.ca_wt_emax) + c.ca_wt;
  const tcCaMut = Math.log10(c.ca_mut_emax) + c.ca_mut;
  const tcArrWt = Math.log10(c.arr_wt_emax) + c.arr_wt;
  const tcArrMut = Math.log10(c.arr_mut_emax) + c.arr_mut;
  const biasWt = tcArrWt - tcCaWt;
  const biasMut = tcArrMut - tcCaMut;
  return {
    ...c, dpCa, dpArr, ddp: dpCa - dpArr,
    tcCaWt, tcCaMut, tcArrWt, tcArrMut,
    dlogR_Ca: tcCaWt - tcCaMut,
    dlogR_Arr: tcArrWt - tcArrMut,
    biasWt, biasMut,
    deltaBias: biasMut - biasWt,
    foldCa: Math.pow(10, dpCa),
    foldArr: Math.pow(10, dpArr),
    demax_ca: c.ca_mut_emax - c.ca_wt_emax,
    demax_arr: c.arr_mut_emax - c.arr_wt_emax,
  };
});

const tabs = [
  { id: "scatter", label: "Pathway Dependence" },
  { id: "bias", label: "Bias Factors" },
  { id: "gradient", label: "Extension Gradient" },
  { id: "pairs", label: "Tryptamine Pairs" },
  { id: "emax", label: "Emax Shifts" },
  { id: "rank", label: "Rank Changes" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: COLORS.text, maxWidth: 260 }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: d.type === "Tryp" ? COLORS.tryp : d.type === "Ref" ? COLORS.ref : COLORS.pea }}>
        {d.name} <span style={{ fontWeight: 400, color: COLORS.muted }}>({d.type})</span>
      </div>
      {d.dpCa !== undefined && <div>ΔpEC50 Ca: <b>{d.dpCa.toFixed(3)}</b> ({d.foldCa.toFixed(1)}×)</div>}
      {d.dpArr !== undefined && <div>ΔpEC50 Arr: <b>{d.dpArr.toFixed(3)}</b> ({d.foldArr.toFixed(1)}×)</div>}
      {d.deltaBias !== undefined && <div>ΔBias: <b>{d.deltaBias.toFixed(3)}</b></div>}
      {d.ext && <div style={{ color: COLORS.muted, marginTop: 4 }}>5/4-pos: {d.ext}</div>}
    </div>
  );
};

function ScatterPlot() {
  const data = enriched.map(c => ({ ...c, x: c.dpCa, y: c.dpArr }));
  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
        Each compound is plotted by how much potency it loses (positive) or gains (negative) at the N343A mutant.
        The diagonal represents equal pathway sensitivity — deviations reveal <b style={{color: COLORS.accent}}>conformational bias</b>.
        A pure affinity effect would cluster all points on the line.
      </p>
      <ResponsiveContainer width="100%" height={460}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis type="number" dataKey="x" domain={[-1.6, 2.2]} tick={{ fill: COLORS.muted, fontSize: 11 }}
            label={{ value: "ΔpEC50 Calcium (WT − Mut)", position: "bottom", offset: 30, fill: COLORS.calcium, fontSize: 13, fontWeight: 600 }} />
          <YAxis type="number" dataKey="y" domain={[-1.6, 1.8]} tick={{ fill: COLORS.muted, fontSize: 11 }}
            label={{ value: "ΔpEC50 Arrestin (WT − Mut)", angle: -90, position: "left", offset: 30, fill: COLORS.arrestin, fontSize: 13, fontWeight: 600 }} />
          <ReferenceLine y={0} stroke={COLORS.muted} strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine x={0} stroke={COLORS.muted} strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine segment={[{x:-2, y:-2}, {x:2.5, y:2.5}]} stroke={COLORS.gold} strokeDasharray="6 3" strokeWidth={1.5} strokeOpacity={0.6} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data.filter(d => d.type === "Ref")} fill={COLORS.ref} name="Serotonin (Ref)" strokeWidth={2.5} stroke={COLORS.ref}>
            {data.filter(d => d.type === "Ref").map((d, i) => <Cell key={i} r={9} />)}
          </Scatter>
          <Scatter data={data.filter(d => d.type === "Tryp")} fill={COLORS.tryp} name="Tryptamines" strokeWidth={2} stroke={COLORS.tryp}>
            {data.filter(d => d.type === "Tryp").map((d, i) => <Cell key={i} r={7} />)}
          </Scatter>
          <Scatter data={data.filter(d => d.type === "PEA")} fill={COLORS.pea} name="Phenethylamines" strokeWidth={2} stroke={COLORS.pea}>
            {data.filter(d => d.type === "PEA").map((d, i) => <Cell key={i} r={7} />)}
          </Scatter>
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 10 }} />
          {data.map((d, i) => (
            <Scatter key={`label-${i}`} data={[d]} fill="transparent" strokeWidth={0}>
              <Cell r={0} />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        {data.map(d => (
          <span key={d.name} style={{ fontSize: 11, color: d.type === "Tryp" ? COLORS.trypLight : d.type === "Ref" ? COLORS.ref : COLORS.peaLight, background: COLORS.card, padding: "2px 8px", borderRadius: 4 }}>
            {d.name}: ({d.x.toFixed(2)}, {d.y.toFixed(2)})
          </span>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.gold}` }}>
        <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, marginBottom: 4 }}>Key Insight</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          <b style={{color: COLORS.ref}}>Serotonin</b> (5-OH) sits far upper-right — the most N343-dependent compound for both pathways (92× Ca loss, 29× Arr loss) — yet is NOT anti-inflammatory.
          Points above the diagonal (e.g., 4-HO-DiPT, DiPT) show calcium more dependent on N343 than arrestin.
          Points below (e.g., 1040, 80) show arrestin more affected. The scatter off the 1:1 line confirms N343 acts as a
          <b style={{color: COLORS.text}}> pathway-selective conformational switch</b>. Serotonin's strong N343 dependence without anti-inflammatory activity proves engagement strength alone is insufficient — <em>position</em> (4-OH vs 5-OH) determines outcome.
        </div>
      </div>
    </div>
  );
}

function BiasPlot() {
  const data = [...enriched].sort((a, b) => a.deltaBias - b.deltaBias);
  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
        ΔBias = Bias<sub>Mut</sub> − Bias<sub>WT</sub>, where Bias = log(τ/K<sub>A</sub>)<sub>Arr</sub> − log(τ/K<sub>A</sub>)<sub>Ca</sub>.
        This metric is <b style={{color: COLORS.accent}}>independent of serotonin reference</b> — it captures how the N343A mutation
        redistributes signaling between pathways for each ligand.
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, bottom: 20, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
          <XAxis type="number" domain={[-1.2, 1.5]} tick={{ fill: COLORS.muted, fontSize: 11 }}
            label={{ value: "ΔBias (Mut − WT)", position: "bottom", offset: 5, fill: COLORS.text, fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: COLORS.text, fontSize: 12 }} width={75} />
          <ReferenceLine x={0} stroke={COLORS.muted} strokeWidth={1.5} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="deltaBias" radius={[0, 4, 4, 0]} barSize={22}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.deltaBias < 0 ? COLORS.calcium : COLORS.arrestin} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8, fontSize: 12 }}>
        <span style={{ color: COLORS.calcium }}>◀ Mutation shifts toward <b>Gq/Calcium</b></span>
        <span style={{ color: COLORS.arrestin }}><b>Arrestin</b> shift ▶</span>
      </div>
      <div style={{ marginTop: 16, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.red}` }}>
        <div style={{ fontSize: 12, color: COLORS.red, fontWeight: 700, marginBottom: 4 }}>Standout: Compound 1040</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          Only compound with a strong negative ΔBias (−0.93). The carbamido group appears to specifically require N343 for arrestin
          coupling — removing it devastates arrestin (23× loss) while barely affecting calcium (2.2×). This is the panel's sharpest
          evidence for pathway-specific N343 gating.
        </div>
      </div>
      <div style={{ marginTop: 10, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.arrestin}` }}>
        <div style={{ fontSize: 12, color: COLORS.arrestin, fontWeight: 700, marginBottom: 4 }}>Standout: Compound 80</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          Largest positive ΔBias (+1.28). The extended ethoxyethyl chain is sterically constrained by N343 — removing it
          unleashes arrestin coupling (26× potency gain, +36 Emax points). N343 normally <em>suppresses</em> this compound's arrestin activity.
        </div>
      </div>
    </div>
  );
}

function GradientPlot() {
  const peaGradient = ["2C-B", "DOB(-)", "1003", "79", "80"].map(n => enriched.find(c => c.name === n));
  const carbamido = ["1040", "1009"].map(n => enriched.find(c => c.name === n));

  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
        Tracking how progressive 5-position chain extension in phenethylamines alters N343 dependence.
        As chains grow longer, compounds shift from <b style={{color: COLORS.green}}>losing</b> potency at the mutant
        to <b style={{color: COLORS.accent}}>gaining</b> it — especially in the arrestin pathway.
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={peaGradient} margin={{ top: 20, right: 30, bottom: 50, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="name" tick={{ fill: COLORS.text, fontSize: 12 }}
            label={{ value: "Progressive 5-position extension →", position: "bottom", offset: 30, fill: COLORS.pea, fontSize: 12 }} />
          <YAxis domain={[-1.8, 1.2]} tick={{ fill: COLORS.muted, fontSize: 11 }}
            label={{ value: "ΔpEC50 (WT − Mut)", angle: -90, position: "left", offset: 30, fill: COLORS.text, fontSize: 12 }} />
          <ReferenceLine y={0} stroke={COLORS.gold} strokeDasharray="6 3" strokeWidth={1.5}>
            <Label value="No change" position="right" fill={COLORS.gold} fontSize={10} />
          </ReferenceLine>
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="dpCa" name="ΔpEC50 Calcium" fill={COLORS.calcium} fillOpacity={0.7} barSize={30} radius={[4,4,0,0]} />
          <Bar dataKey="dpArr" name="ΔpEC50 Arrestin" fill={COLORS.arrestin} fillOpacity={0.7} barSize={30} radius={[4,4,0,0]} />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "center" }}>
        {peaGradient.map(c => (
          <div key={c.name} style={{ background: COLORS.card, padding: "6px 10px", borderRadius: 6, fontSize: 11, color: COLORS.peaLight, textAlign: "center", flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{c.name}</div>
            <div style={{ color: COLORS.muted, fontSize: 10 }}>{c.ext}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.pea}` }}>
        <div style={{ fontSize: 12, color: COLORS.pea, fontWeight: 700, marginBottom: 4 }}>The Steric Relief Gradient</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          2C-B and DOB (short -OCH₃) lose potency at the mutant — they <em>need</em> N343. As the chain extends (1003→79→80),
          compounds progressively <em>gain</em> potency, especially for arrestin. This inversion indicates the longer chains
          sterically clash with asparagine's bulkier side chain; the smaller alanine provides relief. The arrestin pathway
          is disproportionately affected, suggesting N343 constrains TM6 conformations needed for β-arrestin recruitment.
        </div>
      </div>
    </div>
  );
}

function PairsPlot() {
  const pairs = [
    { pair: "DMT → Psilocin", sub: "Add 4-OH", base: "DMT", mod: "Psilocin" },
    { pair: "DiPT → 4-HO-DiPT", sub: "Add 4-OH", base: "DiPT", mod: "4-HO-DiPT" },
    { pair: "DiPT → 78", sub: "Add 4-CH₂CH₂OH", base: "DiPT", mod: "78" },
  ];
  const data = pairs.map(p => {
    const b = enriched.find(c => c.name === p.base);
    const m = enriched.find(c => c.name === p.mod);
    return {
      ...p,
      base_dlogR_Ca: b.dlogR_Ca, mod_dlogR_Ca: m.dlogR_Ca,
      base_dlogR_Arr: b.dlogR_Arr, mod_dlogR_Arr: m.dlogR_Arr,
      increase_Ca: m.dlogR_Ca - b.dlogR_Ca,
      increase_Arr: m.dlogR_Arr - b.dlogR_Arr,
    };
  });

  const barData = data.map(d => ({
    name: d.pair,
    "ΔlogR Ca (base)": d.base_dlogR_Ca,
    "ΔlogR Ca (modified)": d.mod_dlogR_Ca,
    "ΔlogR Arr (base)": d.base_dlogR_Arr,
    "ΔlogR Arr (modified)": d.mod_dlogR_Arr,
  }));

  const comparisonData = data.map(d => ({
    name: d.pair.split(" → ")[1],
    sub: d.sub,
    ca_increase: d.increase_Ca,
    arr_increase: d.increase_Arr,
  }));

  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
        Matched tryptamine pairs: how does adding a 4-position substituent change N343 dependence?
        ΔlogR = log(τ/K<sub>A</sub>)<sub>WT</sub> − log(τ/K<sub>A</sub>)<sub>Mut</sub> measures the total transduction lost (or gained) upon mutation.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={comparisonData} margin={{ top: 20, right: 30, bottom: 40, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="name" tick={{ fill: COLORS.text, fontSize: 12 }}
            label={{ value: "Modified compound", position: "bottom", offset: 20, fill: COLORS.text, fontSize: 12 }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11 }}
            label={{ value: "Change in ΔlogR vs base", angle: -90, position: "left", offset: 30, fill: COLORS.text, fontSize: 12 }} />
          <ReferenceLine y={0} stroke={COLORS.muted} strokeWidth={1} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.text }}>
                <div style={{ fontWeight: 700 }}>{d.name} ({d.sub})</div>
                <div style={{ color: COLORS.calcium }}>Ca ΔlogR increase: {d.ca_increase.toFixed(3)}</div>
                <div style={{ color: COLORS.arrestin }}>Arr ΔlogR increase: {d.arr_increase.toFixed(3)}</div>
              </div>
            );
          }} />
          <Bar dataKey="ca_increase" name="Calcium ΔlogR change" fill={COLORS.calcium} fillOpacity={0.8} barSize={35} radius={[4,4,0,0]} />
          <Bar dataKey="arr_increase" name="Arrestin ΔlogR change" fill={COLORS.arrestin} fillOpacity={0.8} barSize={35} radius={[4,4,0,0]} />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12 }} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 16, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.tryp}` }}>
        <div style={{ fontSize: 12, color: COLORS.tryp, fontWeight: 700, marginBottom: 4 }}>The DiPT Amplification Paradox</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          Adding 4-OH to DMT (→ Psilocin) barely changes N343 dependence. But adding 4-OH to DiPT (→ 4-HO-DiPT)
          <b style={{color: COLORS.text}}> more than doubles</b> calcium dependence and creates massive arrestin dependence from near-zero.
          The bulkier diisopropyl amines act as a <em>lever</em>, driving the 4-OH deeper into the N343 pocket.
        </div>
      </div>
      <div style={{ marginTop: 10, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.gold}` }}>
        <div style={{ fontSize: 12, color: COLORS.gold, fontWeight: 700, marginBottom: 4 }}>Compound 78: Why Longer Isn't Better</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          Extending DiPT's 4-position by two carbons + OH (→ 78) produces <em>no additional N343 dependence</em>.
          The linker is likely too long/flexible on the tryptamine scaffold, overshooting the N343 pocket. Contrast with
          phenethylamines where the same extension strategy works progressively better.
        </div>
      </div>
    </div>
  );
}

function EmaxPlot() {
  const data = [...enriched].sort((a, b) => a.demax_arr - b.demax_arr);
  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
        Change in maximum efficacy (Emax) at the N343A mutant compared to wild type.
        Negative = reduced efficacy at mutant. Positive = <b style={{color: COLORS.accent}}>enhanced efficacy</b> when N343 is removed.
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, bottom: 20, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
          <XAxis type="number" domain={[-35, 40]} tick={{ fill: COLORS.muted, fontSize: 11 }}
            label={{ value: "ΔEmax (Mut − WT)", position: "bottom", offset: 5, fill: COLORS.text, fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: COLORS.text, fontSize: 12 }} width={75} />
          <ReferenceLine x={0} stroke={COLORS.muted} strokeWidth={1.5} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.text }}>
                <div style={{ fontWeight: 700, color: d.type === "Tryp" ? COLORS.tryp : COLORS.pea }}>{d.name}</div>
                <div>Ca Emax: {d.ca_wt_emax.toFixed(1)} → {d.ca_mut_emax.toFixed(1)} (<span style={{color: d.demax_ca >= 0 ? COLORS.green : COLORS.red}}>{d.demax_ca >= 0 ? '+' : ''}{d.demax_ca.toFixed(1)}</span>)</div>
                <div>Arr Emax: {d.arr_wt_emax.toFixed(1)} → {d.arr_mut_emax.toFixed(1)} (<span style={{color: d.demax_arr >= 0 ? COLORS.green : COLORS.red}}>{d.demax_arr >= 0 ? '+' : ''}{d.demax_arr.toFixed(1)}</span>)</div>
              </div>
            );
          }} />
          <Bar dataKey="demax_ca" name="ΔEmax Calcium" fill={COLORS.calcium} fillOpacity={0.7} barSize={12} />
          <Bar dataKey="demax_arr" name="ΔEmax Arrestin" fill={COLORS.arrestin} fillOpacity={0.7} barSize={12} />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12 }} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 16, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.green}` }}>
        <div style={{ fontSize: 12, color: COLORS.green, fontWeight: 700, marginBottom: 4 }}>Tryptamine vs PEA Pattern</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          Tryptamines uniformly <em>lose</em> calcium Emax at the mutant (−18 to −22 points). Extended phenethylamines (79, 80, 1003)
          show the opposite: they gain arrestin Emax substantially, with compound 80's +36 point arrestin gain being the largest
          in the panel. This asymmetry is consistent with N343 enabling Gq coupling for tryptamines while constraining
          β-arrestin coupling for extended PEAs.
        </div>
      </div>
    </div>
  );
}

function RankPlot() {
  const getRanks = (key) => {
    const vals = enriched.map(c => ({ name: c.name, type: c.type, val: c[key] }));
    const sorted = [...vals].sort((a, b) => b.val - a.val);
    return sorted.map((v, i) => ({ ...v, rank: i + 1 }));
  };

  const caWtRanks = getRanks("tcCaWt");
  const caMutRanks = getRanks("tcCaMut");
  const arrWtRanks = getRanks("tcArrWt");
  const arrMutRanks = getRanks("tcArrMut");

  const [pathway, setPathway] = useState("ca");
  const wtRanks = pathway === "ca" ? caWtRanks : arrWtRanks;
  const mutRanks = pathway === "ca" ? caMutRanks : arrMutRanks;

  const lineHeight = 34;
  const colWidth = 180;
  const midGap = 220;
  const svgH = enriched.length * lineHeight + 40;

  return (
    <div>
      <p style={{ color: COLORS.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
        Ranking of compounds by transduction coefficient log(E<sub>max</sub>/EC<sub>50</sub>) at WT vs N343A mutant.
        Lines connect the same compound across both rankings — crossings and large jumps indicate
        compounds whose relative signaling capacity is disproportionately affected by N343.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{id: "ca", label: "Calcium"}, {id: "arr", label: "Arrestin"}].map(p => (
          <button key={p.id} onClick={() => setPathway(p.id)}
            style={{
              background: pathway === p.id ? (p.id === "ca" ? COLORS.calcium : COLORS.arrestin) : COLORS.card,
              color: COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 16px",
              cursor: "pointer", fontSize: 13, fontWeight: pathway === p.id ? 700 : 400,
              transition: "all 0.2s"
            }}>
            {p.label}
          </button>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${colWidth * 2 + midGap + 40} ${svgH}`} style={{ maxHeight: 480 }}>
        <text x={colWidth / 2 + 20} y={18} textAnchor="middle" fill={COLORS.text} fontSize={13} fontWeight={700}>Wild Type</text>
        <text x={colWidth + midGap + colWidth / 2 + 20} y={18} textAnchor="middle" fill={COLORS.text} fontSize={13} fontWeight={700}>N343A Mutant</text>
        {wtRanks.map((w, i) => {
          const mutIdx = mutRanks.findIndex(m => m.name === w.name);
          const yStart = 32 + i * lineHeight;
          const yEnd = 32 + mutIdx * lineHeight;
          const col = w.type === "Tryp" ? COLORS.tryp : COLORS.pea;
          const shift = mutIdx - i;
          const thick = Math.abs(shift) >= 3;
          return (
            <g key={w.name}>
              <line
                x1={colWidth + 20} y1={yStart + 4}
                x2={colWidth + midGap + 20} y2={yEnd + 4}
                stroke={col} strokeWidth={thick ? 2.5 : 1.2} strokeOpacity={thick ? 0.9 : 0.35}
              />
              <text x={colWidth + 14} y={yStart + 8} textAnchor="end" fill={col} fontSize={12} fontWeight={thick ? 700 : 400}>
                {w.rank}. {w.name}
              </text>
              <text x={colWidth + midGap + 26} y={yEnd + 8} textAnchor="start"
                fill={col} fontSize={12} fontWeight={thick ? 700 : 400}>
                {mutRanks[mutIdx].rank}. {mutRanks[mutIdx].name}
              </text>
              <text x={colWidth + 14} y={yStart + 8} textAnchor="end" fill={col} fontSize={12} fontWeight={thick ? 700 : 400}>
                {w.rank}. {w.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ marginTop: 16, padding: 14, background: "#0c1222", borderRadius: 8, borderLeft: `3px solid ${COLORS.accent}` }}>
        <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, marginBottom: 4 }}>Notable Rank Shifts</div>
        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
          In arrestin: Compound 80 jumps from #9 → #1 (the largest gain), while 1040 drops #4 → #11 (largest loss).
          4-HO-DiPT falls from #5 → #9, confirming its strong N343 dependence.
          In calcium: 80 rises #3 → #1, while 4-HO-DiPT drops #7 → #11.
          These rank changes capture which compounds' therapeutic potential is most tied to N343.
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("scatter");

  const panels = {
    scatter: <ScatterPlot />,
    bias: <BiasPlot />,
    gradient: <GradientPlot />,
    pairs: <PairsPlot />,
    emax: <EmaxPlot />,
    rank: <RankPlot />,
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.3 }}>
            5-HT<sub>2A</sub> Receptor Signaling Analysis
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: "6px 0 0" }}>
            N343A mutation effects on calcium and β-arrestin pathway coupling across 12 ligands
          </p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap", background: COLORS.card, borderRadius: 10, padding: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? COLORS.accent : "transparent",
                color: activeTab === t.id ? COLORS.bg : COLORS.muted,
                border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                fontSize: 12, fontWeight: activeTab === t.id ? 700 : 500,
                transition: "all 0.15s", whiteSpace: "nowrap",
                flex: "1 1 auto", textAlign: "center",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: COLORS.card, borderRadius: 12, padding: 24, border: `1px solid ${COLORS.border}` }}>
          {panels[activeTab]}
        </div>

        <div style={{ marginTop: 20, padding: 16, background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, marginBottom: 8 }}>Quick Reference</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11, color: COLORS.muted }}>
            <div><span style={{ color: COLORS.ref }}>●</span> Serotonin: endogenous reference (5-OH, NOT anti-inflammatory)</div>
            <div><span style={{ color: COLORS.tryp }}>●</span> Tryptamines: DMT, Psilocin, DiPT, 4-HO-DiPT, 78</div>
            <div><span style={{ color: COLORS.pea }}>●</span> Phenethylamines: 2C-B, DOB(-), 1003, 79, 80, 1009, 1040</div>
            <div><span style={{ color: COLORS.calcium }}>●</span> Calcium = Gq pathway readout</div>
            <div><span style={{ color: COLORS.arrestin }}>●</span> Arrestin = β-arrestin-2 recruitment</div>
            <div>ΔpEC50 = pEC50<sub>WT</sub> − pEC50<sub>Mut</sub> (positive = lost potency)</div>
            <div>ΔlogR = log(τ/K<sub>A</sub>)<sub>WT</sub> − log(τ/K<sub>A</sub>)<sub>Mut</sub></div>
          </div>
        </div>
      </div>
    </div>
  );
}
