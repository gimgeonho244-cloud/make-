import React from 'react';
import { MilitaryRankInfo } from '../data/militaryRanks';

interface RankInsigniaProps {
  rank: MilitaryRankInfo;
  size?: 'sm' | 'md' | 'lg';
}

export const RankInsignia: React.FC<RankInsigniaProps> = ({
  rank,
  size = 'md',
}) => {
  const dim =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  const bgByCat =
    rank.category === '장성'
      ? '#1E293B'
      : rank.category === '영관'
      ? '#1E3A8A'
      : rank.category === '위관'
      ? '#1D4ED8'
      : rank.category === '부사관'
      ? '#334155'
      : '#475569';

  const accent =
    rank.category === '장성'
      ? '#FACC15'
      : rank.category === '영관'
      ? '#FDE047'
      : rank.category === '위관'
      ? '#E0F2FE'
      : rank.category === '부사관'
      ? '#FBBF24'
      : '#F8FAFC';

  return (
    <svg
      viewBox="0 0 48 48"
      className={`${dim} shrink-0`}
      role="img"
      aria-label={`${rank.name} 계급장`}
    >
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill={bgByCat}
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* 병 (이병~병장): 가로 막대 1~4줄 */}
      {rank.category === '병' && (
        <g>
          {Array.from({ length: rank.chevronOrStarCount }).map((_, idx) => {
            const total = rank.chevronOrStarCount;
            const spacing = 7;
            const startY = 24 - ((total - 1) * spacing) / 2;
            const y = startY + idx * spacing;
            return (
              <rect
                key={idx}
                x="11"
                y={y - 2}
                width="26"
                height="4"
                rx="1.5"
                fill={accent}
              />
            );
          })}
        </g>
      )}

      {/* 부사관 (하사~원사): V자 갈매기 + 원사는 상단 별 */}
      {rank.category === '부사관' && (
        <g>
          {rank.name === '원사' && (
            <polygon
              points="24,8 25.8,12.2 30.2,12.5 26.8,15.4 27.9,19.8 24,17.4 20.1,19.8 21.2,15.4 17.8,12.5 22.2,12.2"
              fill={accent}
            />
          )}
          {Array.from({
            length: rank.name === '원사' ? 3 : rank.chevronOrStarCount,
          }).map((_, idx) => {
            const offset = (rank.name === '원사' ? 19 : 14) + idx * 7;
            return (
              <polyline
                key={idx}
                points={`11,${offset} 24,${offset + 7} 37,${offset}`}
                fill="none"
                stroke={accent}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      )}

      {/* 위관 (소위~대위): 마름모 1~3개 */}
      {rank.category === '위관' && (
        <g>
          {Array.from({ length: rank.chevronOrStarCount }).map((_, idx) => {
            const total = rank.chevronOrStarCount;
            const cx =
              total === 1
                ? 24
                : total === 2
                ? 17 + idx * 14
                : 12 + idx * 12;
            const cy = 24;
            return (
              <polygon
                key={idx}
                points={`${cx},${cy - 7} ${cx + 5},${cy} ${cx},${cy + 7} ${cx - 5},${cy}`}
                fill={accent}
              />
            );
          })}
        </g>
      )}

      {/* 영관 (소령~대령): 5각 무궁화 꽃형 1~3개 */}
      {rank.category === '영관' && (
        <g>
          {Array.from({ length: rank.chevronOrStarCount }).map((_, idx) => {
            const total = rank.chevronOrStarCount;
            const cx =
              total === 1
                ? 24
                : total === 2
                ? 17 + idx * 14
                : 12 + idx * 12;
            const cy = 24;
            return (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="5.5" fill={accent} />
                <circle cx={cx} cy={cy} r="2.2" fill={bgByCat} />
              </g>
            );
          })}
        </g>
      )}

      {/* 장성 (준장~대장): 별 1~4개 */}
      {rank.category === '장성' && (
        <g>
          {Array.from({ length: rank.chevronOrStarCount }).map((_, idx) => {
            const total = rank.chevronOrStarCount;
            const coords =
              total === 1
                ? [{ x: 24, y: 24 }]
                : total === 2
                ? [
                    { x: 17, y: 24 },
                    { x: 31, y: 24 },
                  ]
                : total === 3
                ? [
                    { x: 24, y: 15 },
                    { x: 15, y: 31 },
                    { x: 33, y: 31 },
                  ]
                : [
                    { x: 16, y: 16 },
                    { x: 32, y: 16 },
                    { x: 16, y: 32 },
                    { x: 32, y: 32 },
                  ];
            const { x, y } = coords[idx];
            const pts = [
              `${x},${y - 6}`,
              `${x + 1.8},${y - 1.8}`,
              `${x + 6},${y - 1.4}`,
              `${x + 2.8},${y + 1.6}`,
              `${x + 3.8},${y + 6}`,
              `${x},${y + 3.5}`,
              `${x - 3.8},${y + 6}`,
              `${x - 2.8},${y + 1.6}`,
              `${x - 6},${y - 1.4}`,
              `${x - 1.8},${y - 1.8}`,
            ].join(' ');
            return <polygon key={idx} points={pts} fill={accent} />;
          })}
        </g>
      )}
    </svg>
  );
};
