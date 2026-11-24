import {
  ExamPeriodKind,
  GoalExamTarget,
  GoalMission,
  GradeConversionResult,
  MissionState,
  MockExamPeriod,
  MockGrades,
  SchoolClassRoster,
  SemesterType,
  StudentProfile,
  SubjectGoalTarget,
} from '../types/admission';
import {
  convertMockOnly,
  fiveTierToPercentile,
  getDefaultMockExams,
  nineTierToPercentile,
  subjectAppliesToExam,
} from '../utils/gradeConverter';
import { calculateRanksFromPercentile } from './highSchools';

export type MilitaryCategory = '병' | '부사관' | '위관' | '영관' | '장성';

export interface MilitaryRankInfo {
  index: number;
  name: string;
  englishTitle: string;
  category: MilitaryCategory;
  chevronOrStarCount: number;
  description: string;
}

export const MILITARY_RANKS: MilitaryRankInfo[] = [
  { index: 0, name: '이병', englishTitle: 'Private', category: '병', chevronOrStarCount: 1, description: '첫 성적 목표에 도전하는 훈련병 단계' },
  { index: 1, name: '일병', englishTitle: 'Private First Class', category: '병', chevronOrStarCount: 2, description: '첫 목표를 달성해 기본기를 입증한 단계' },
  { index: 2, name: '상병', englishTitle: 'Corporal', category: '병', chevronOrStarCount: 3, description: '기출 풀이 루틴이 자리 잡은 중견 단계' },
  { index: 3, name: '병장', englishTitle: 'Sergeant', category: '병', chevronOrStarCount: 4, description: '병 계급 최고봉 · 내신 궤도 진입' },
  { index: 4, name: '하사', englishTitle: 'Staff Sergeant', category: '부사관', chevronOrStarCount: 1, description: '간부 도약 · 취약 과목 관리 시작' },
  { index: 5, name: '중사', englishTitle: 'Sergeant First Class', category: '부사관', chevronOrStarCount: 2, description: '꾸준한 등급 상승을 이어가는 실전형' },
  { index: 6, name: '상사', englishTitle: 'Master Sergeant', category: '부사관', chevronOrStarCount: 3, description: '서술형과 변형 문항까지 안정권 도달' },
  { index: 7, name: '원사', englishTitle: 'Command Sergeant Major', category: '부사관', chevronOrStarCount: 4, description: '부사관 최정상 · 흔들리지 않는 학습 습관' },
  { index: 8, name: '소위', englishTitle: 'Second Lieutenant', category: '위관', chevronOrStarCount: 1, description: '위관 장교 임관 · 상위권 진입 목표 실행' },
  { index: 9, name: '중위', englishTitle: 'First Lieutenant', category: '위관', chevronOrStarCount: 2, description: '내신·모의고사 균형 전략 지휘' },
  { index: 10, name: '대위', englishTitle: 'Captain', category: '위관', chevronOrStarCount: 3, description: '주요 대학 안정·적정권 진입 지휘관' },
  { index: 11, name: '소령', englishTitle: 'Major', category: '영관', chevronOrStarCount: 1, description: '영관급 참모 · 심화 세특과 등급 동시 관리' },
  { index: 12, name: '중령', englishTitle: 'Lieutenant Colonel', category: '영관', chevronOrStarCount: 2, description: '상위권 핵심 과목 1등급권 정복' },
  { index: 13, name: '대령', englishTitle: 'Colonel', category: '영관', chevronOrStarCount: 3, description: '장군 진급 직전 · 최상위권 목전 달성' },
  { index: 14, name: '준장', englishTitle: 'Brigadier General', category: '장성', chevronOrStarCount: 1, description: '첫 장성 진급(★) · 최상위권 대학권' },
  { index: 15, name: '소장', englishTitle: 'Major General', category: '장성', chevronOrStarCount: 2, description: '투스타(★★) · 전 과목 1등급대 수렴' },
  { index: 16, name: '중장', englishTitle: 'Lieutenant General', category: '장성', chevronOrStarCount: 3, description: '쓰리스타(★★★) · 전국 최상위권' },
  { index: 17, name: '대장', englishTitle: 'General', category: '장성', chevronOrStarCount: 4, description: '최고 계급 포스타(★★★★) · 대입 완전 정복' },
];

export const GOAL_EXAM_TARGET_OPTIONS: {
  id: GoalExamTarget;
  label: string;
  group: '내신' | '모의고사';
  grade3Only?: boolean;
}[] = [
  { id: 'sem1Mid', label: '내신 1학기 중간고사', group: '내신' },
  { id: 'sem1Final', label: '내신 1학기 기말고사', group: '내신' },
  { id: 'sem2Mid', label: '내신 2학기 중간고사', group: '내신' },
  { id: 'sem2Final', label: '내신 2학기 기말고사', group: '내신' },
  { id: 'mock_3모', label: '3월 모의고사 (3모)', group: '모의고사' },
  { id: 'mock_6모', label: '6월 모의고사 (6모)', group: '모의고사' },
  { id: 'mock_9모', label: '9월 모의고사 (9모)', group: '모의고사' },
  { id: 'mock_10모', label: '10월 모의고사 (10모)', group: '모의고사' },
  { id: 'mock_수능', label: '대학수학능력시험 (수능)', group: '모의고사', grade3Only: true },
];

export function getGoalExamLabel(target: GoalExamTarget): string {
  return (
    GOAL_EXAM_TARGET_OPTIONS.find((o) => o.id === target)?.label ??
    '내신 1학기 중간고사'
  );
}

export function goalTargetToSemesterExam(target: GoalExamTarget): {
  isMock: boolean;
  semester: SemesterType;
  examKind: ExamPeriodKind;
  mockPeriod?: MockExamPeriod;
} {
  if (target.startsWith('mock_')) {
    return {
      isMock: true,
      semester: '1학기',
      examKind: 'midterm',
      mockPeriod: target.replace('mock_', '') as MockExamPeriod,
    };
  }
  switch (target) {
    case 'sem1Final':
      return { isMock: false, semester: '1학기', examKind: 'final' };
    case 'sem2Mid':
      return { isMock: false, semester: '2학기', examKind: 'midterm' };
    case 'sem2Final':
      return { isMock: false, semester: '2학기', examKind: 'final' };
    case 'sem1Mid':
    default:
      return { isMock: false, semester: '1학기', examKind: 'midterm' };
  }
}

export function getActualGradeForTarget(
  target: GoalExamTarget,
  profile: StudentProfile,
  conversion: GradeConversionResult
): {
  actualGrade: number;
  scaleLabel: string;
  estimatedPercentileTop: number;
} {
  if (target.startsWith('mock_')) {
    const period = target.replace('mock_', '') as MockExamPeriod;
    const mockMap = profile.mockExams ?? getDefaultMockExams(profile.mockGrades);
    const grades = mockMap[period] ?? profile.mockGrades;
    const mockRes = convertMockOnly(grades);
    return {
      actualGrade: mockRes.averageCoreFour,
      scaleLabel: '모의고사 9등급제(국·수·영·탐 평균)',
      estimatedPercentileTop: mockRes.estimatedPercentileTop,
    };
  }

  const termMap = {
    sem1Mid: conversion.naesin.sem1Mid,
    sem1Final: conversion.naesin.sem1Final,
    sem2Mid: conversion.naesin.sem2Mid,
    sem2Final: conversion.naesin.sem2Final,
  } as const;

  const summary = termMap[target as keyof typeof termMap];
  const actualGrade = summary?.inputGrade ?? conversion.naesin.inputFiveTier;
  const estimatedPercentileTop =
    summary?.estimatedPercentileTop ?? conversion.naesin.estimatedPercentileTop;

  return {
    actualGrade,
    scaleLabel: profile.isFiveTierEligible ? '내신 5등급제' : '내신 9등급제',
    estimatedPercentileTop,
  };
}

export interface ExamSubjectCandidate {
  subjectId: string;
  subjectName: string;
  actualGrade: number;
  actualRank: number;
  isEstimatedRank: boolean;
  mockKey?: keyof MockGrades;
}

const MOCK_SUBJECT_ITEMS: { key: keyof MockGrades; name: string }[] = [
  { key: 'korean', name: '국어' },
  { key: 'math', name: '수학' },
  { key: 'english', name: '영어' },
  { key: 'social', name: '사회(사탐)' },
  { key: 'science', name: '과학(과탐)' },
  { key: 'history', name: '한국사' },
];

export function getSubjectsForGoalTarget(
  target: GoalExamTarget,
  profile: StudentProfile,
  roster: SchoolClassRoster
): ExamSubjectCandidate[] {
  const meta = goalTargetToSemesterExam(target);

  if (meta.isMock && meta.mockPeriod) {
    const mockMap = profile.mockExams ?? getDefaultMockExams(profile.mockGrades);
    const grades = mockMap[meta.mockPeriod] ?? profile.mockGrades;
    return MOCK_SUBJECT_ITEMS.map((item) => {
      const g = grades[item.key];
      const pct = nineTierToPercentile(g);
      const estRank = Math.max(
        1,
        Math.round((pct / 100) * roster.gradeTotalStudents)
      );
      return {
        subjectId: `mock-${item.key}`,
        subjectName: item.name,
        actualGrade: g,
        actualRank: estRank,
        isEstimatedRank: true,
        mockKey: item.key,
      };
    });
  }

  return profile.subjectGrades
    .filter(
      (s) =>
        s.semester === meta.semester &&
        subjectAppliesToExam(s, meta.examKind)
    )
    .map((s) => {
      const g = meta.examKind === 'midterm' ? s.midtermGrade : s.finalGrade;
      const manualRank =
        meta.examKind === 'midterm' ? s.midtermRank : s.finalRank;
      const pct = profile.isFiveTierEligible
        ? fiveTierToPercentile(g, profile.tierPosition).mid
        : nineTierToPercentile(g);
      const calcRank = calculateRanksFromPercentile(
        pct,
        roster.gradeTotalStudents,
        roster.selectedClassStudents,
        profile.isFiveTierEligible
      ).gradeRank;

      return {
        subjectId: s.id,
        subjectName: s.name,
        actualGrade: g,
        actualRank: manualRank && manualRank >= 1 ? manualRank : calcRank,
        isEstimatedRank: !(manualRank && manualRank >= 1),
      };
    });
}

export interface EvaluatedSubjectCheck {
  subjectId: string;
  subjectName: string;
  targetGrade?: number;
  targetRank?: number;
  actualGrade: number;
  actualRank: number;
  isEstimatedRank: boolean;
  gradeMet: boolean;
  rankMet: boolean;
  passed: boolean;
}

export interface GoalEvaluationResult {
  actualGrade: number;
  scaleLabel: string;
  avgGradeMet: boolean;
  gradeGap: number;
  actualGradeRank: number;
  isManualGradeRank: boolean;
  gradeRankMet: boolean;
  actualClassRank: number;
  isManualClassRank: boolean;
  classRankMet: boolean;
  subjectChecks: EvaluatedSubjectCheck[];
  allSubjectsMet: boolean;
  passedSubjectCount: number;
  totalSubjectGoalCount: number;
  allMet: boolean;
  failedReasons: string[];
}

export function evaluateGoalMission(
  goal: GoalMission,
  profile: StudentProfile,
  conversion: GradeConversionResult,
  roster: SchoolClassRoster
): GoalEvaluationResult {
  const { actualGrade, scaleLabel, estimatedPercentileTop } =
    getActualGradeForTarget(goal.examTarget, profile, conversion);

  const avgGradeMet = actualGrade <= goal.targetGrade;
  const gradeGap = Number((actualGrade - goal.targetGrade).toFixed(2));

  const calcOverallRanks = calculateRanksFromPercentile(
    estimatedPercentileTop,
    roster.gradeTotalStudents,
    roster.selectedClassStudents,
    profile.isFiveTierEligible && !goal.examTarget.startsWith('mock_')
  );

  const isManualGradeRank =
    typeof profile.manualOverallGradeRank === 'number' &&
    profile.manualOverallGradeRank >= 1;
  const actualGradeRank = isManualGradeRank
    ? profile.manualOverallGradeRank!
    : calcOverallRanks.gradeRank;
  const gradeRankMet =
    !goal.targetGradeRank || actualGradeRank <= goal.targetGradeRank;

  const isManualClassRank =
    typeof profile.manualOverallClassRank === 'number' &&
    profile.manualOverallClassRank >= 1;
  const actualClassRank = isManualClassRank
    ? profile.manualOverallClassRank!
    : calcOverallRanks.classRank;
  const classRankMet =
    !goal.targetClassRank || actualClassRank <= goal.targetClassRank;

  const candidates = getSubjectsForGoalTarget(goal.examTarget, profile, roster);
  const candidateMap = new Map(candidates.map((c) => [c.subjectId, c]));

  const activeSubjectGoals: SubjectGoalTarget[] = (goal.subjectGoals ?? []).filter(
    (sg) =>
      sg.enabled &&
      (sg.targetGrade !== undefined || sg.targetRank !== undefined)
  );

  const subjectChecks: EvaluatedSubjectCheck[] = activeSubjectGoals
    .map((sg): EvaluatedSubjectCheck | null => {
      const cand =
        candidateMap.get(sg.subjectId) ??
        candidates.find((c) => c.subjectName === sg.subjectName);
      if (!cand) return null;
      const gradeMet =
        sg.targetGrade === undefined || cand.actualGrade <= sg.targetGrade;
      const rankMet =
        sg.targetRank === undefined || cand.actualRank <= sg.targetRank;
      return {
        subjectId: sg.subjectId,
        subjectName: cand.subjectName,
        targetGrade: sg.targetGrade,
        targetRank: sg.targetRank,
        actualGrade: cand.actualGrade,
        actualRank: cand.actualRank,
        isEstimatedRank: cand.isEstimatedRank,
        gradeMet,
        rankMet,
        passed: gradeMet && rankMet,
      };
    })
    .filter((x): x is EvaluatedSubjectCheck => x !== null);

  const passedSubjectCount = subjectChecks.filter((c) => c.passed).length;
  const totalSubjectGoalCount = subjectChecks.length;
  const allSubjectsMet = subjectChecks.every((c) => c.passed);
  const allMet = avgGradeMet && gradeRankMet && classRankMet && allSubjectsMet;

  const failedReasons: string[] = [];
  if (!avgGradeMet) {
    failedReasons.push(
      `평균 등급 ${actualGrade.toFixed(2)} (목표 ${goal.targetGrade.toFixed(2)} 이하 대비 +${gradeGap.toFixed(2)} 부족)`
    );
  }
  if (goal.targetGradeRank && !gradeRankMet) {
    failedReasons.push(
      `전체 석차 ${actualGradeRank}등 (목표 ${goal.targetGradeRank}등 이내)`
    );
  }
  if (goal.targetClassRank && !classRankMet) {
    failedReasons.push(
      `학급 석차 ${actualClassRank}등 (목표 ${goal.targetClassRank}등 이내)`
    );
  }
  const missedSubjects = subjectChecks.filter((c) => !c.passed);
  if (missedSubjects.length > 0) {
    failedReasons.push(
      `과목 목표 미달 ${missedSubjects.length}개 (${missedSubjects.map((m) => m.subjectName).join(', ')})`
    );
  }

  return {
    actualGrade,
    scaleLabel,
    avgGradeMet,
    gradeGap,
    actualGradeRank,
    isManualGradeRank,
    gradeRankMet,
    actualClassRank,
    isManualClassRank,
    classRankMet,
    subjectChecks,
    allSubjectsMet,
    passedSubjectCount,
    totalSubjectGoalCount,
    allMet,
    failedReasons,
  };
}

export function createInitialMissionState(
  profile: StudentProfile,
  conversion: GradeConversionResult
): MissionState {
  const defaultTarget: GoalExamTarget =
    profile.naesinBasis === 'sem1Final'
      ? 'sem1Final'
      : profile.naesinBasis === 'sem2Mid'
      ? 'sem2Mid'
      : profile.naesinBasis === 'sem2Final'
      ? 'sem2Final'
      : 'sem1Mid';

  const { actualGrade } = getActualGradeForTarget(
    defaultTarget,
    profile,
    conversion
  );

  const suggestedGoal = Number(
    Math.max(1.0, Math.min(profile.isFiveTierEligible ? 5.0 : 9.0, actualGrade - 0.2)).toFixed(2)
  );

  const currentGoal: GoalMission = {
    id: `goal-${Date.now()}`,
    examTarget: defaultTarget,
    examLabel: getGoalExamLabel(defaultTarget),
    targetGrade: suggestedGoal,
    targetGradeRank: undefined,
    targetClassRank: undefined,
    subjectGoals: [],
    memo: '취약 과목 오답 노트 정리 및 기출 반복 풀기',
    createdAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    attemptNumber: 1,
  };

  return {
    rankIndex: 0, // 이병 시작
    tokens: 0, // 목표 도달 시 +2개 지급
    totalEarnedTokens: 0,
    totalSolvedQuestions: 0,
    unlockedQuestionIds: [],
    totalSuccessCount: 0,
    totalFailCount: 0,
    legendaryClearCount: 0,
    lastOutcome: 'idle',
    lastOutcomeMessage: '',
    currentGoal,
    history: [],
  };
}
