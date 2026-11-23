import {
  BirthYearCohort,
  ExamPeriodKind,
  ExamTerm,
  ExamTermConversionSummary,
  GradeConversionResult,
  MockConversionResult,
  MockExamPeriod,
  MockGrades,
  NaesinBasis,
  NaesinConversionResult,
  SchoolSubjectGrade,
  SemesterConversionSummary,
  SemesterType,
  TierPosition,
  TrackType,
} from '../types/admission';

export const FIVE_TIER_BANDS = [
  { tier: 1, start: 0, end: 10, width: 10, label: '1등급 (상위 10%)' },
  { tier: 2, start: 10, end: 34, width: 24, label: '2등급 (10~34%)' },
  { tier: 3, start: 34, end: 66, width: 32, label: '3등급 (34~66%)' },
  { tier: 4, start: 66, end: 90, width: 24, label: '4등급 (66~90%)' },
  { tier: 5, start: 90, end: 100, width: 10, label: '5등급 (90~100%)' },
];

export const NINE_TIER_BANDS = [
  { tier: 1, start: 0, end: 4, width: 4, label: '1등급 (4%)' },
  { tier: 2, start: 4, end: 11, width: 7, label: '2등급 (11%)' },
  { tier: 3, start: 11, end: 23, width: 12, label: '3등급 (23%)' },
  { tier: 4, start: 23, end: 40, width: 17, label: '4등급 (40%)' },
  { tier: 5, start: 40, end: 60, width: 20, label: '5등급 (60%)' },
  { tier: 6, start: 60, end: 77, width: 17, label: '6등급 (77%)' },
  { tier: 7, start: 77, end: 89, width: 12, label: '7등급 (89%)' },
  { tier: 8, start: 89, end: 96, width: 7, label: '8등급 (96%)' },
  { tier: 9, start: 96, end: 100, width: 4, label: '9등급 (100%)' },
];

export const MOCK_EXAM_PERIODS: {
  id: MockExamPeriod;
  shortLabel: string;
  fullLabel: string;
  grade3Only?: boolean;
}[] = [
  { id: '3모', shortLabel: '3모', fullLabel: '3월 학력평가 (3모)' },
  { id: '6모', shortLabel: '6모', fullLabel: '6월 모의고사 (6모)' },
  { id: '9모', shortLabel: '9모', fullLabel: '9월 모의고사 (9모)' },
  { id: '10모', shortLabel: '10모', fullLabel: '10월 학력평가 (10모)' },
  {
    id: '수능',
    shortLabel: '수능',
    fullLabel: '대학수학능력시험 (수능)',
    grade3Only: true,
  },
];

export function getAvailableMockExams(gradeYear: 1 | 2 | 3) {
  return MOCK_EXAM_PERIODS.filter((m) => !m.grade3Only || gradeYear === 3);
}

export function getMockExamLabel(period: MockExamPeriod): string {
  return (
    MOCK_EXAM_PERIODS.find((m) => m.id === period)?.fullLabel ??
    `${period} 모의고사`
  );
}

export function getDefaultMockExams(
  initial: MockGrades = {
    korean: 2,
    math: 2,
    english: 2,
    social: 2,
    science: 2,
    history: 2,
  }
): Record<MockExamPeriod, MockGrades> {
  return {
    '3모': { ...initial },
    '6모': { ...initial },
    '9모': { ...initial },
    '10모': { ...initial },
    수능: { ...initial },
  };
}

export function semesterAndExamToBasis(
  semester: SemesterType,
  exam: ExamPeriodKind
): NaesinBasis {
  if (semester === '1학기') {
    return exam === 'midterm' ? 'sem1Mid' : 'sem1Final';
  }
  return exam === 'midterm' ? 'sem2Mid' : 'sem2Final';
}

export function basisToSemesterAndExam(basis: NaesinBasis): {
  semester: SemesterType;
  exam: ExamPeriodKind;
} {
  switch (basis) {
    case 'sem1Final':
      return { semester: '1학기', exam: 'final' };
    case 'sem2Mid':
      return { semester: '2학기', exam: 'midterm' };
    case 'sem2Final':
    case 'sem2':
      return { semester: '2학기', exam: 'final' };
    case 'sem1Mid':
    case 'sem1':
    default:
      return { semester: '1학기', exam: 'midterm' };
  }
}

export function isEligibleForFiveTier(birthYear: BirthYearCohort): boolean {
  return birthYear !== '2008';
}

export function getBasisLabel(basis: NaesinBasis): string {
  switch (basis) {
    case 'sem1Mid':
      return '1학기 중간고사';
    case 'sem1Final':
      return '1학기 기말고사';
    case 'sem2Mid':
      return '2학기 중간고사';
    case 'sem2Final':
      return '2학기 기말고사';
    case 'sem1':
      return '1학기 종합';
    case 'sem2':
      return '2학기 종합';
    default:
      return '1·2학기 통합';
  }
}

/**
 * 1학년 기본 내신 과목: 1학기 / 2학기 분리 + 각 과목 중간고사·기말고사 등급 분리
 */
export function getDefaultGrade1Subjects(defaultGrade = 2): SchoolSubjectGrade[] {
  return [
    // 1학기 (정보는 1학기 기말고사만 시행)
    { id: 'g1-kor1', name: '공통국어1', semester: '1학기', subLabel: '1학년 1학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-math1', name: '공통수학1', semester: '1학기', subLabel: '1학년 1학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-eng1', name: '공통영어1', semester: '1학기', subLabel: '1학년 1학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-info', name: '정보', semester: '1학기', subLabel: '1학년 1학기 · 기말만 시행', examSchedule: 'finalOnly', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 3 },
    { id: 'g1-his1', name: '한국사1', semester: '1학기', subLabel: '1학년 1학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 3 },
    { id: 'g1-soc1', name: '통합사회1', semester: '1학기', subLabel: '1학년 1학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-sci1', name: '통합과학1', semester: '1학기', subLabel: '1학년 1학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },

    // 2학기 (인기초는 2학기 기말고사만 시행)
    { id: 'g1-kor2', name: '공통국어2', semester: '2학기', subLabel: '1학년 2학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-math2', name: '공통수학2', semester: '2학기', subLabel: '1학년 2학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-eng2', name: '공통영어2', semester: '2학기', subLabel: '1학년 2학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-ai', name: '인기초(인공지능 기초)', semester: '2학기', subLabel: '1학년 2학기 · 기말만 시행', examSchedule: 'finalOnly', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 3 },
    { id: 'g1-his2', name: '한국사2', semester: '2학기', subLabel: '1학년 2학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 3 },
    { id: 'g1-soc2', name: '통합사회2', semester: '2학기', subLabel: '1학년 2학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'g1-sci2', name: '통합과학2', semester: '2학기', subLabel: '1학년 2학기', examSchedule: 'both', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
  ];
}

/**
 * 2~3학년 기본 과목: 1학기 / 2학기 분리 + 중간/기말 분리
 */
export function getDefaultUpperGradeSubjects(
  track: TrackType,
  defaultGrade = 2
): SchoolSubjectGrade[] {
  const trackElectivesBySemester: Record<
    TrackType,
    { sem1: string[]; sem2: string[] }
  > = {
    '자연·공학': {
      sem1: ['대수', '물리학Ⅰ', '화학Ⅰ'],
      sem2: ['미적분', '기하', '정보'],
    },
    '의약학·생명': {
      sem1: ['대수', '생명과학Ⅰ', '화학Ⅰ'],
      sem2: ['미적분', '확률과 통계', '생명과학Ⅱ'],
    },
    '상경·경영': {
      sem1: ['대수', '확률과 통계', '경제'],
      sem2: ['미적분', '사회·문화', '심화영어'],
    },
    '인문·사회': {
      sem1: ['문학', '언어와 매체', '정치와 법'],
      sem2: ['화법과 작문', '사회·문화', '확률과 통계'],
    },
    '교육·사범': {
      sem1: ['문학', '교육학', '확률과 통계'],
      sem2: ['화법과 작문', '심리학', '사회·문화'],
    },
    '자율전공·통합': {
      sem1: ['대수', '사회·문화', '정보'],
      sem2: ['확률과 통계', '경제', '인공지능 기초'],
    },
  };

  const baseSem1: SchoolSubjectGrade[] = [
    { id: 'u-s1-kor', name: '국어(문학)', semester: '1학기', subLabel: '1학기 공통', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'u-s1-eng', name: '영어Ⅰ', semester: '1학기', subLabel: '1학기 공통', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
  ];

  const baseSem2: SchoolSubjectGrade[] = [
    { id: 'u-s2-kor', name: '국어(독서)', semester: '2학기', subLabel: '2학기 공통', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
    { id: 'u-s2-eng', name: '영어Ⅱ', semester: '2학기', subLabel: '2학기 공통', midtermGrade: defaultGrade, finalGrade: defaultGrade, credits: 4 },
  ];

  const { sem1, sem2 } = trackElectivesBySemester[track];

  const elec1: SchoolSubjectGrade[] = sem1.map((name, idx) => ({
    id: `u-s1-elec-${idx}`,
    name,
    semester: '1학기',
    subLabel: '1학기 선택',
    midtermGrade: defaultGrade,
    finalGrade: defaultGrade,
    credits: 4,
    isElective: true,
  }));

  const elec2: SchoolSubjectGrade[] = sem2.map((name, idx) => ({
    id: `u-s2-elec-${idx}`,
    name,
    semester: '2학기',
    subLabel: '2학기 선택',
    midtermGrade: defaultGrade,
    finalGrade: defaultGrade,
    credits: 4,
    isElective: true,
  }));

  return [...baseSem1, ...elec1, ...baseSem2, ...elec2];
}

export function subjectAppliesToExam(
  subject: SchoolSubjectGrade,
  examKind: 'both' | ExamPeriodKind
): boolean {
  if (examKind === 'midterm') {
    return subject.examSchedule !== 'finalOnly';
  }
  if (examKind === 'final') {
    return subject.examSchedule !== 'midtermOnly';
  }
  return true;
}

export function calculateNaesinAverage(
  subjects: SchoolSubjectGrade[],
  semesterFilter?: SemesterType,
  examKind: 'both' | ExamPeriodKind = 'both'
): number {
  const bySemester = semesterFilter
    ? subjects.filter((s) => s.semester === semesterFilter)
    : subjects;
  const target = bySemester.filter((s) => subjectAppliesToExam(s, examKind));
  if (!target || target.length === 0) return 2.0;

  let totalWeighted = 0;
  let totalCredits = 0;
  for (const s of target) {
    const c = s.credits > 0 ? s.credits : 3;
    let g: number;
    if (examKind === 'midterm') {
      g = s.midtermGrade;
    } else if (examKind === 'final') {
      g = s.finalGrade;
    } else {
      g =
        s.examSchedule === 'finalOnly'
          ? s.finalGrade
          : s.examSchedule === 'midtermOnly'
          ? s.midtermGrade
          : (s.midtermGrade + s.finalGrade) / 2;
    }
    totalWeighted += g * c;
    totalCredits += c;
  }
  if (totalCredits === 0) return 2.0;
  return Number((totalWeighted / totalCredits).toFixed(2));
}

export function fiveTierToPercentile(
  fiveGrade: number,
  position: TierPosition = 'middle'
): { mid: number; range: [number, number] } {
  const clamped = Math.max(1.0, Math.min(5.0, fiveGrade));

  const anchors: [number, number][] = [
    [1.0, 2.5],
    [1.3, 6.5],
    [1.6, 12.5],
    [2.0, 22.0],
    [2.5, 34.0],
    [3.0, 50.0],
    [3.5, 66.0],
    [4.0, 78.0],
    [4.5, 90.0],
    [5.0, 96.0],
  ];

  let basePct = 50;
  for (let i = 0; i < anchors.length - 1; i++) {
    const [g1, p1] = anchors[i];
    const [g2, p2] = anchors[i + 1];
    if (clamped >= g1 && clamped <= g2) {
      const ratio = (clamped - g1) / (g2 - g1);
      basePct = p1 + ratio * (p2 - p1);
      break;
    }
  }

  const posOffset = position === 'upper' ? -3.0 : position === 'lower' ? 3.0 : 0;
  const adjusted = Math.max(0.5, Math.min(99.5, basePct + posOffset));

  const integerTier = Math.min(5, Math.max(1, Math.round(clamped)));
  const band = FIVE_TIER_BANDS[integerTier - 1];
  const spread = Math.max(2.5, band.width * 0.25);
  const minPct = Math.max(0.5, Number((adjusted - spread).toFixed(1)));
  const maxPct = Math.min(99.5, Number((adjusted + spread).toFixed(1)));

  return {
    mid: Number(adjusted.toFixed(1)),
    range: [minPct, maxPct],
  };
}

export function percentileToNineTier(pct: number): number {
  const clamped = Math.max(0.1, Math.min(99.9, pct));

  for (const band of NINE_TIER_BANDS) {
    if (clamped <= band.end) {
      const withinRatio = (clamped - band.start) / band.width;
      const grade = band.tier - 0.4 + withinRatio * 0.85;
      return Number(Math.max(1.0, Math.min(9.0, grade)).toFixed(2));
    }
  }
  return 9.0;
}

export function nineTierToPercentile(nineGrade: number): number {
  const clamped = Math.max(1.0, Math.min(9.0, nineGrade));
  const tierInt = Math.min(9, Math.max(1, Math.round(clamped)));
  const band = NINE_TIER_BANDS[tierInt - 1];
  const offset = clamped - tierInt;
  const posInBand = Math.min(1, Math.max(0, 0.5 + offset));
  return Number((band.start + band.width * posInBand).toFixed(1));
}

export function nineTierToFiveTier(nineGrade: number): number {
  const clamped = Math.max(1.0, Math.min(9.0, nineGrade));
  const anchors: [number, number][] = [
    [1.0, 1.0],
    [1.5, 1.15],
    [2.0, 1.35],
    [2.5, 1.65],
    [3.0, 1.95],
    [3.5, 2.25],
    [4.0, 2.55],
    [5.0, 3.0],
    [6.0, 3.45],
    [7.0, 3.95],
    [8.0, 4.45],
    [9.0, 5.0],
  ];

  for (let i = 0; i < anchors.length - 1; i++) {
    const [g1, f1] = anchors[i];
    const [g2, f2] = anchors[i + 1];
    if (clamped >= g1 && clamped <= g2) {
      const ratio = (clamped - g1) / (g2 - g1);
      return Number((f1 + ratio * (f2 - f1)).toFixed(2));
    }
  }
  return 5.0;
}

function convertSingleGradeValue(
  rawGrade: number,
  position: TierPosition,
  isFiveEligible: boolean
) {
  let effectiveFive = rawGrade;
  let midNine = 1.0;
  let minNine = 1.0;
  let maxNine = 1.5;
  let pctMid = 5;
  let pctRange: [number, number] = [1, 10];

  if (!isFiveEligible) {
    midNine = Number(Math.max(1.0, Math.min(9.0, rawGrade)).toFixed(2));
    minNine = Number(Math.max(1.0, midNine - 0.3).toFixed(2));
    maxNine = Number(Math.min(9.0, midNine + 0.3).toFixed(2));
    effectiveFive = nineTierToFiveTier(midNine);
    const band =
      NINE_TIER_BANDS[Math.min(8, Math.max(0, Math.round(midNine) - 1))];
    pctMid = nineTierToPercentile(midNine);
    pctRange = [band.start, band.end];
  } else {
    const pctResult = fiveTierToPercentile(rawGrade, position);
    pctMid = pctResult.mid;
    pctRange = pctResult.range;
    midNine = percentileToNineTier(pctMid);
    minNine = percentileToNineTier(pctRange[0]);
    maxNine = percentileToNineTier(pctRange[1]);
  }

  return {
    effectiveFive: Number(effectiveFive.toFixed(2)),
    midNine,
    minNine,
    maxNine,
    pctMid,
    pctRange,
  };
}

export function convertNaesinWithSemesters(
  subjects: SchoolSubjectGrade[],
  basis: NaesinBasis,
  position: TierPosition,
  isFiveEligible: boolean,
  fallbackGrade = 2.0
): NaesinConversionResult {
  const sem1Subjects = subjects.filter((s) => s.semester === '1학기');
  const sem2Subjects = subjects.filter((s) => s.semester === '2학기');

  const sem1MidRaw =
    sem1Subjects.length > 0
      ? calculateNaesinAverage(sem1Subjects, undefined, 'midterm')
      : fallbackGrade;
  const sem1FinalRaw =
    sem1Subjects.length > 0
      ? calculateNaesinAverage(sem1Subjects, undefined, 'final')
      : fallbackGrade;
  const sem2MidRaw =
    sem2Subjects.length > 0
      ? calculateNaesinAverage(sem2Subjects, undefined, 'midterm')
      : fallbackGrade;
  const sem2FinalRaw =
    sem2Subjects.length > 0
      ? calculateNaesinAverage(sem2Subjects, undefined, 'final')
      : fallbackGrade;

  const sem1Raw =
    sem1Subjects.length > 0
      ? calculateNaesinAverage(sem1Subjects, undefined, 'both')
      : fallbackGrade;
  const sem2Raw =
    sem2Subjects.length > 0
      ? calculateNaesinAverage(sem2Subjects, undefined, 'both')
      : fallbackGrade;
  const overallRaw =
    subjects.length > 0
      ? calculateNaesinAverage(subjects, undefined, 'both')
      : fallbackGrade;

  const sem1MidConv = convertSingleGradeValue(sem1MidRaw, position, isFiveEligible);
  const sem1FinalConv = convertSingleGradeValue(sem1FinalRaw, position, isFiveEligible);
  const sem2MidConv = convertSingleGradeValue(sem2MidRaw, position, isFiveEligible);
  const sem2FinalConv = convertSingleGradeValue(sem2FinalRaw, position, isFiveEligible);
  const sem1Conv = convertSingleGradeValue(sem1Raw, position, isFiveEligible);
  const sem2Conv = convertSingleGradeValue(sem2Raw, position, isFiveEligible);
  const overallConv = convertSingleGradeValue(overallRaw, position, isFiveEligible);

  const makeExamSummary = (
    term: ExamTerm,
    label: string,
    semester: SemesterType,
    count: number,
    raw: number,
    conv: ReturnType<typeof convertSingleGradeValue>
  ): ExamTermConversionSummary => ({
    term,
    label,
    semester,
    subjectCount: count,
    inputGrade: Number(raw.toFixed(2)),
    convertedNineTier: conv.midNine,
    estimatedPercentileTop: conv.pctMid,
  });

  const sem1MidCount = sem1Subjects.filter((s) =>
    subjectAppliesToExam(s, 'midterm')
  ).length;
  const sem1FinalCount = sem1Subjects.filter((s) =>
    subjectAppliesToExam(s, 'final')
  ).length;
  const sem2MidCount = sem2Subjects.filter((s) =>
    subjectAppliesToExam(s, 'midterm')
  ).length;
  const sem2FinalCount = sem2Subjects.filter((s) =>
    subjectAppliesToExam(s, 'final')
  ).length;

  const sem1Mid = makeExamSummary(
    'sem1Mid',
    '1학기 중간고사',
    '1학기',
    sem1MidCount,
    sem1MidRaw,
    sem1MidConv
  );
  const sem1Final = makeExamSummary(
    'sem1Final',
    '1학기 기말고사',
    '1학기',
    sem1FinalCount,
    sem1FinalRaw,
    sem1FinalConv
  );
  const sem2Mid = makeExamSummary(
    'sem2Mid',
    '2학기 중간고사',
    '2학기',
    sem2MidCount,
    sem2MidRaw,
    sem2MidConv
  );
  const sem2Final = makeExamSummary(
    'sem2Final',
    '2학기 기말고사',
    '2학기',
    sem2FinalCount,
    sem2FinalRaw,
    sem2FinalConv
  );

  const sem1Summary: SemesterConversionSummary = {
    semester: '1학기',
    subjectCount: sem1Subjects.length,
    inputGrade: Number(sem1Raw.toFixed(2)),
    convertedNineTier: sem1Conv.midNine,
    estimatedPercentileTop: sem1Conv.pctMid,
  };

  const sem2Summary: SemesterConversionSummary = {
    semester: '2학기',
    subjectCount: sem2Subjects.length,
    inputGrade: Number(sem2Raw.toFixed(2)),
    convertedNineTier: sem2Conv.midNine,
    estimatedPercentileTop: sem2Conv.pctMid,
  };

  const basisConvMap: Record<NaesinBasis, ReturnType<typeof convertSingleGradeValue>> = {
    overall: overallConv,
    sem1: sem1Conv,
    sem2: sem2Conv,
    sem1Mid: sem1MidConv,
    sem1Final: sem1FinalConv,
    sem2Mid: sem2MidConv,
    sem2Final: sem2FinalConv,
  };

  const activeConv = basisConvMap[basis] ?? overallConv;

  const diff = Number((sem1Raw - sem2Raw).toFixed(2));
  let semesterTrend: NaesinConversionResult['semesterTrend'] = '유지';
  if (diff >= 0.08) semesterTrend = '상승';
  else if (diff <= -0.08) semesterTrend = '하락';

  const tierIntFive = Math.min(
    5,
    Math.max(1, Math.round(activeConv.effectiveFive))
  );
  const tierIntNine = Math.min(9, Math.max(1, Math.round(activeConv.midNine)));

  return {
    inputFiveTier: activeConv.effectiveFive,
    convertedNineTierMid: activeConv.midNine,
    convertedNineTierMin: activeConv.minNine,
    convertedNineTierMax: activeConv.maxNine,
    estimatedPercentileTop: activeConv.pctMid,
    percentileRange: activeConv.pctRange,
    tierLabelFive: `5등급제 ${tierIntFive}등급권`,
    tierLabelNine: `9등급제 약 ${activeConv.midNine.toFixed(2)}등급 (${tierIntNine}등급권)`,
    sem1Mid,
    sem1Final,
    sem2Mid,
    sem2Final,
    sem1: sem1Summary,
    sem2: sem2Summary,
    overallInputGrade: overallConv.effectiveFive,
    overallConvertedNineTier: overallConv.midNine,
    semesterTrend,
    semesterDiff: Math.abs(diff),
  };
}

export function convertMockOnly(mock: MockGrades): MockConversionResult {
  const averageAllSix = Number(
    (
      (mock.korean +
        mock.math +
        mock.english +
        mock.social +
        mock.science +
        mock.history) /
      6
    ).toFixed(2)
  );

  const bestExp = Math.min(mock.social, mock.science);
  const coreFour = [mock.korean, mock.math, mock.english, bestExp];
  const averageCoreFour = Number(
    (coreFour.reduce((a, b) => a + b, 0) / 4).toFixed(2)
  );

  const sortedCore = [...coreFour].sort((a, b) => a - b);
  const bestTwoSum = sortedCore[0] + sortedCore[1];
  const bestThreeSum = sortedCore[0] + sortedCore[1] + sortedCore[2];
  const historyPassed = mock.history <= 4;

  const estimatedPercentileTop = nineTierToPercentile(averageCoreFour);
  const convertedFiveTierEquivalent = nineTierToFiveTier(averageCoreFour);

  let csatMinSummary = '';
  if (!historyPassed) {
    csatMinSummary = `한국사 ${mock.history}등급으로 주요 대학 필수 기준(4등급 이내) 보완이 필요합니다.`;
  } else if (bestThreeSum <= 5) {
    csatMinSummary = `상위 3개 영역 합 ${bestThreeSum}등급(2합 ${bestTwoSum})으로 최상위권(연·고대/의약학 포함) 수능 최저 대부분 충족권입니다.`;
  } else if (bestThreeSum <= 7) {
    csatMinSummary = `상위 3개 영역 합 ${bestThreeSum}등급(2합 ${bestTwoSum})으로 서울 주요대 교과·논술 수능 최저 충족권입니다.`;
  } else if (bestTwoSum <= 6) {
    csatMinSummary = `상위 2개 영역 합 ${bestTwoSum}등급으로 인서울 중위권·거점국립대 수능 최저 충족이 가능합니다.`;
  } else {
    csatMinSummary = `상위 2개 합 ${bestTwoSum}등급입니다. 수능 최저 없는 학종·교과 전형 또는 취약 2과목 집중 끌어올리기를 권장합니다.`;
  }

  return {
    averageAllSix,
    averageCoreFour,
    bestTwoSum,
    bestThreeSum,
    historyPassed,
    estimatedPercentileTop,
    convertedFiveTierEquivalent,
    csatMinSummary,
  };
}

export function convertFiveToNine(
  subjects: SchoolSubjectGrade[],
  basis: NaesinBasis,
  position: TierPosition,
  mockGrades: MockGrades,
  isFiveEligible: boolean,
  fallbackGrade = 2.0
): GradeConversionResult {
  const naesin = convertNaesinWithSemesters(
    subjects,
    basis,
    position,
    isFiveEligible,
    fallbackGrade
  );
  const mock = convertMockOnly(mockGrades);

  const diff = mock.averageCoreFour - naesin.convertedNineTierMid;
  let susiVsJeongsi: GradeConversionResult['susiVsJeongsi'] = '수시·정시 균형형';
  let strategySummary = '';

  if (diff >= 0.7) {
    susiVsJeongsi = '수시 집중형';
    strategySummary =
      '모의고사 대비 내신 환산 경쟁력이 뚜렷하게 높습니다. 학생부교과·종합 전형을 주력으로 삼고, 수능 최저 충족을 위해 취약 1~2과목만 집중 보완하세요.';
  } else if (diff <= -0.7) {
    susiVsJeongsi = '정시·수능최저 유리형';
    strategySummary =
      '내신 환산 등급보다 모의고사 주요 영역 성적이 더 우수합니다. 높은 수능 최저를 요구하는 교과·논술 전형으로 상향 지원하며 정시까지 병행하세요.';
  } else {
    susiVsJeongsi = '수시·정시 균형형';
    strategySummary =
      '내신과 모의고사 성적이 균형을 이루고 있습니다. 5등급제 시대에는 세특의 깊이와 선택과목 이수가 합불을 가르므로 서류와 수능 최저를 함께 챙기세요.';
  }

  return {
    naesin,
    mock,
    inputFiveTier: naesin.inputFiveTier,
    convertedNineTierMid: naesin.convertedNineTierMid,
    convertedNineTierMin: naesin.convertedNineTierMin,
    convertedNineTierMax: naesin.convertedNineTierMax,
    estimatedPercentileTop: naesin.estimatedPercentileTop,
    percentileRange: naesin.percentileRange,
    tierLabelFive: naesin.tierLabelFive,
    tierLabelNine: naesin.tierLabelNine,
    mockAverage: mock.averageCoreFour,
    susiVsJeongsi,
    strategySummary,
  };
}
