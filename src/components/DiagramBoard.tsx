import React, { useEffect, useState } from 'react';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { InstructorDiagramNode, InstructorDiagramSpec } from '../types/admission';

interface DiagramBoardProps {
  diagram: InstructorDiagramSpec;
}

const ROLE_STYLES: Record<
  NonNullable<InstructorDiagramNode['role']>,
  { fill: string; stroke: string; text: string; sub: string; tag: string }
> = {
  core: {
    fill: '#EFF6FF',
    stroke: '#1D4ED8',
    text: '#1E3A8A',
    sub: '#1D4ED8',
    tag: '핵심',
  },
  primary: {
    fill: '#F8FAFC',
    stroke: '#334155',
    text: '#0F172A',
    sub: '#475569',
    tag: '원리',
  },
  secondary: {
    fill: '#ECFDF5',
    stroke: '#047857',
    text: '#064E3B',
    sub: '#047857',
    tag: '적용',
  },
  warning: {
    fill: '#FFFBEB',
    stroke: '#B45309',
    text: '#78350F',
    sub: '#B45309',
    tag: '함정주의',
  },
};

function truncateText(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

export const DiagramBoard: React.FC<DiagramBoardProps> = ({ diagram }) => {
  const nodes = diagram.nodes.slice(0, 6);
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id ?? '');

  useEffect(() => {
    setSelectedId(diagram.nodes[0]?.id ?? '');
  }, [diagram]);

  const activeNode =
    nodes.find((n) => n.id === selectedId) ?? nodes[0] ?? null;

  // Compute coordinates in SVG space (800 x 340) based on visualType
  const positioned = nodes.map((node, idx) => {
    const count = Math.max(1, nodes.length);
    let cx = 400;
    let cy = 170;

    if (
      diagram.visualType === 'coordinate' &&
      typeof node.x === 'number' &&
      typeof node.y === 'number'
    ) {
      cx = 90 + (Math.min(95, Math.max(5, node.x)) / 100) * 620;
      cy = 40 + (Math.min(90, Math.max(10, node.y)) / 100) * 240;
    } else if (diagram.visualType === 'processFlow') {
      const margin = 105;
      const span = 800 - margin * 2;
      cx = count === 1 ? 400 : margin + (idx / (count - 1)) * span;
      cy = idx % 2 === 0 ? 128 : 212;
      if (count <= 3) cy = 170;
    } else if (diagram.visualType === 'comparison') {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const totalRows = Math.ceil(count / 2);
      cx = col === 0 ? 215 : 585;
      cy =
        totalRows === 1
          ? 170
          : 92 + (row / Math.max(1, totalRows - 1)) * 156;
    } else {
      // conceptMap
      if (idx === 0) {
        cx = 400;
        cy = 170;
      } else {
        const outerCount = count - 1;
        const angle = ((idx - 1) / Math.max(1, outerCount)) * Math.PI * 2 - Math.PI / 2;
        cx = 400 + Math.cos(angle) * 235;
        cy = 170 + Math.sin(angle) * 105;
      }
    }

    return { node, cx, cy };
  });

  const posMap = new Map(positioned.map((p) => [p.node.id, p]));

  const visualLabel =
    diagram.visualType === 'processFlow'
      ? '단계별 흐름 판서'
      : diagram.visualType === 'comparison'
      ? '핵심 개념 대비표'
      : diagram.visualType === 'coordinate'
      ? '그래프 · 좌표 판서'
      : '중심 개념 연결도';

  return (
    <div className="rounded-xl border border-slate-300 bg-slate-900 text-slate-100 overflow-hidden">
      {/* Chalkboard / Diagram Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-slate-700/80 bg-slate-950/60">
        <div>
          <div className="text-[11px] font-medium text-sky-300">
            강사 판서 그림 · {visualLabel}
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white">
            {diagram.title}
          </h4>
        </div>
        {diagram.keyEquation && (
          <div className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono-num text-amber-300">
            {diagram.keyEquation}
          </div>
        )}
      </div>

      {/* Interactive SVG Canvas */}
      <div className="p-3 sm:p-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 800 340"
            className="w-full min-w-[540px] h-auto select-none"
            role="img"
            aria-label={diagram.title}
          >
            <defs>
              <pattern
                id="chalk-grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="rgba(148,163,184,0.08)"
                  strokeWidth="1"
                />
              </pattern>
              <marker
                id="diag-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
              </marker>
            </defs>

            <rect width="800" height="340" fill="url(#chalk-grid)" rx="8" />

            {/* Coordinate axes or Comparison divider */}
            {diagram.visualType === 'coordinate' && (
              <g>
                <line
                  x1="70"
                  y1="295"
                  x2="745"
                  y2="295"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  markerEnd="url(#diag-arrow)"
                />
                <line
                  x1="70"
                  y1="295"
                  x2="70"
                  y2="28"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  markerEnd="url(#diag-arrow)"
                />
                {diagram.axisLabels && (
                  <>
                    <text
                      x="735"
                      y="318"
                      textAnchor="end"
                      fill="#94A3B8"
                      fontSize="11"
                    >
                      {diagram.axisLabels.x}
                    </text>
                    <text
                      x="82"
                      y="38"
                      textAnchor="start"
                      fill="#94A3B8"
                      fontSize="11"
                    >
                      {diagram.axisLabels.y}
                    </text>
                  </>
                )}
                {positioned.length >= 2 && (
                  <path
                    d={positioned
                      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`)
                      .join(' ')}
                    fill="none"
                    stroke="rgba(56,189,248,0.45)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                )}
              </g>
            )}

            {diagram.visualType === 'comparison' && (
              <line
                x1="400"
                y1="26"
                x2="400"
                y2="314"
                stroke="rgba(148,163,184,0.28)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
            )}

            {/* Edges */}
            {diagram.edges.map((edge, idx) => {
              const fromP = posMap.get(edge.from);
              const toP = posMap.get(edge.to);
              if (!fromP || !toP) return null;

              const dx = toP.cx - fromP.cx;
              const dy = toP.cy - fromP.cy;
              const dist = Math.hypot(dx, dy) || 1;
              const shrink = 64;
              const x1 = fromP.cx + (dx / dist) * Math.min(shrink, dist * 0.28);
              const y1 = fromP.cy + (dy / dist) * Math.min(34, dist * 0.25);
              const x2 = toP.cx - (dx / dist) * Math.min(shrink, dist * 0.28);
              const y2 = toP.cy - (dy / dist) * Math.min(34, dist * 0.25);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={`${edge.from}-${edge.to}-${idx}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#38BDF8"
                    strokeWidth="2"
                    markerEnd="url(#diag-arrow)"
                    opacity="0.78"
                  />
                  {edge.label && (
                    <g>
                      <rect
                        x={midX - Math.min(68, edge.label.length * 5.2 + 12)}
                        y={midY - 11}
                        width={Math.min(136, edge.label.length * 10.4 + 24)}
                        height="20"
                        rx="4"
                        fill="#0F172A"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        textAnchor="middle"
                        fill="#BAE6FD"
                        fontSize="10.5"
                        fontWeight="600"
                      >
                        {truncateText(edge.label, 14)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {positioned.map(({ node, cx, cy }) => {
              const role = node.role ?? 'primary';
              const st = ROLE_STYLES[role] ?? ROLE_STYLES.primary;
              const isSelected = activeNode?.id === node.id;
              const boxW = 166;
              const boxH = node.sublabel ? 66 : 52;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <rect
                      x={cx - boxW / 2 - 4}
                      y={cy - boxH / 2 - 4}
                      width={boxW + 8}
                      height={boxH + 8}
                      rx="12"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                    />
                  )}
                  <rect
                    x={cx - boxW / 2}
                    y={cy - boxH / 2}
                    width={boxW}
                    height={boxH}
                    rx="9"
                    fill={st.fill}
                    stroke={st.stroke}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  <text
                    x={cx - boxW / 2 + 10}
                    y={cy - boxH / 2 + 15}
                    fill={st.sub}
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {st.tag}
                  </text>
                  <text
                    x={cx}
                    y={node.sublabel ? cy + 2 : cy + 7}
                    textAnchor="middle"
                    fill={st.text}
                    fontSize="12.5"
                    fontWeight="700"
                  >
                    {truncateText(node.label, 16)}
                  </text>
                  {node.sublabel && (
                    <text
                      x={cx}
                      y={cy + 20}
                      textAnchor="middle"
                      fill={st.sub}
                      fontSize="10"
                      fontWeight="600"
                    >
                      {truncateText(node.sublabel, 20)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-slate-400">
          <span>{diagram.caption}</span>
          <span className="inline-flex items-center gap-1 text-sky-300">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>그림 속 개념 박스를 누르면 강사 판서 설명이 바뀝니다</span>
          </span>
        </div>
      </div>

      {/* Active Node Explanation Strip */}
      {activeNode && (
        <div className="px-5 py-3.5 bg-slate-800/90 border-t border-slate-700 flex items-start gap-3">
          <ArrowRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs sm:text-sm">
            <div className="font-bold text-white">
              {activeNode.label}
              {activeNode.sublabel && (
                <span className="ml-2 font-normal text-sky-300 font-mono-num text-xs">
                  ({activeNode.sublabel})
                </span>
              )}
            </div>
            <p className="text-slate-200 leading-relaxed">{activeNode.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
};
