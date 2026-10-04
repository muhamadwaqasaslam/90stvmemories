import { fmtDay } from "../../lib/dates";

interface Pt {
  key: string;
  imp: number;
  click: number;
  view: number;
}

const W = 800;
const H = 280;
const PAD = { l: 44, r: 12, t: 12, b: 28 };

function niceMax(v: number) {
  if (v <= 5) return 5;
  const p = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / p) * p;
}

export function DailyChart({ data }: { data: Pt[] }) {
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.imp, d.view, d.click))));
  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.t + ih - (v / max) * ih;
  const line = (f: (d: Pt) => number) => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(f(d)).toFixed(1)}`).join(" ");
  const area = `${line((d) => d.imp)} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const step = Math.ceil(data.length / 7);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Daily impressions, clicks and views">
      <defs>
        <linearGradient id="impFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f43f7a" stopOpacity=".55" />
          <stop offset="1" stopColor="#f43f7a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(max * t)} y2={y(max * t)} stroke="#1c2033" strokeOpacity=".12" />
          <text x={PAD.l - 8} y={y(max * t) + 4} textAnchor="end" fontSize="12" fill="#1c2033" fillOpacity=".6">
            {Math.round(max * t)}
          </text>
        </g>
      ))}
      <path d={area} fill="url(#impFill)" />
      <path d={line((d) => d.imp)} fill="none" stroke="#f43f7a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={line((d) => d.view)} fill="none" stroke="#2ec4e6" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={line((d) => d.click)} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.key}>
          {i % step === 0 && (
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="12" fill="#1c2033" fillOpacity=".6">
              {fmtDay(d.key)}
            </text>
          )}
          {/* wide invisible hit area for native hover tooltips */}
          <rect x={x(i) - iw / data.length / 2} y={PAD.t} width={iw / data.length} height={ih} fill="transparent">
            <title>{`${fmtDay(d.key)}\nImpressions: ${d.imp}\nClicks: ${d.click}\nViews: ${d.view}`}</title>
          </rect>
          {data.length <= 31 && <circle cx={x(i)} cy={y(d.imp)} r="3" fill="#f43f7a" />}
        </g>
      ))}
    </svg>
  );
}

export function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold text-ink/75">
      <li><i className="mr-2 inline-block h-3 w-3 rounded-full bg-pink" />Impressions</li>
      <li><i className="mr-2 inline-block h-3 w-3 rounded-full bg-amber-500" />Clicks</li>
      <li><i className="mr-2 inline-block h-3 w-3 rounded-full bg-cyan" />Article views</li>
    </ul>
  );
}
