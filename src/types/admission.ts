export type TrackType =
  | '자연·공학'
  | '의약학·생명'
  | '인문·사회'
  | '상경·경영'
  | '교육·사범'
  | '자율전공·통합';

export type BirthYearCohort = '2008' | '2009' | '2010' | '2011+';

export type HighSchoolType =
  | '일반고'
  | '자율형사립고'
  | '외고·국제고'
  | '과학고·영재고'
  | '특성화고';

export type TierPosition = 'upper' | 'middle' | 'lower';

export type SemesterType = '1학기' | '2학기';

export type ExamPeriodKind = 'midterm' | 'final';

export type ExamTerm = 'sem1Mid' | 'sem1Final' | 'sem2Mid' | 'sem2Final';

export type MockExamPeriod = '3모' | '6모' | '9모' | '10모' | '수능';

export type NaesinBasis =
  | 'overall'
  | 'sem1'
  | 'sem2'
  | 'sem1Mid'
  | 'sem1Final'
  | 'sem2Mid'
  | 'sem2Final';

export interface SchoolSubjectGrade {
  id: string;
  name: string;
  semester: SemesterType;
  subLabel?: string;
  examSchedule?: 'both' | 'midtermOnly' | 'finalOnly';
  midtermGrade: number;
  finalGrade: number;
  midtermRank?: number;
  finalRank?: number;
  credits: number;
  isElective?: boolean;
}

export interface MockGrades {
  korean: number;
  math: number;
  english: number;
  social: number;
  science: number;
  history: number;
}

export interface StudentProfile {
  schoolName: string;
  highSchoolType: HighSchoolType;
  gradeYear: 1 | 2 | 3;
  classNum: string;
  studentNum: string;
  name: string;
  birthYear: BirthYearCohort;
  isFiveTierEligible: boolean;
  subjectGrades: SchoolSubjectGrade[];
  naesinBasis: NaesinBasis;
  fiveTierGrade: number;
  nineTierDirectGrade: number;
  tierPosition: TierPosition;
  selectedMockExam: MockExamPeriod;
  mockExams: Record<MockExamPeriod, MockGrades>;
  mockGrades: MockGrades;
  track: TrackType;
  electives: string[];
  customGradeTotalStudents?: number;
  customClassTotalStudents?: number;
  manualOverallGradeRank?: number;
  manualOverallClassRank?: number;
  missionState?: MissionState;
}

export interface ExamTermConversionSummary {
  term: ExamTerm;
  label: string;
  semester: SemesterType;
  subjectCount: number;
  inputGrade: number;
  convertedNineTier: number;
  estimatedPercentileTop: number;
}

export interface SemesterConversionSummary {
  semester: SemesterType;
  subjectCount: number;
  inputGrade: number;
  convertedNineTier: number;
  estimatedPercentileTop: number;
}

export interface NaesinConversionResult {
  inputFiveTier: number;
  convertedNineTierMid: number;
  convertedNineTierMin: number;
  convertedNineTierMax: number;
  estimatedPercentileTop: number;
  percentileRange: [number, number];
  tierLabelFive: string;
  tierLabelNine: string;
  sem1Mid: ExamTermConversionSummary;
  sem1Final: ExamTermConversionSummary;
  sem2Mid: ExamTermConversionSummary;
  sem2Final: ExamTermConversionSummary;
  sem1: SemesterConversionSummary;
  sem2: SemesterConversionSummary;
  overallInputGrade: number;
  overallConvertedNineTier: number;
  semesterTrend: '상승' | '유지' | '하락';
  semesterDiff: number;
}

export interface MockConversionResult {
  averageAllSix: number; // 국·수·영·사·과·한 전체 평균
  averageCoreFour: number; // 국·수·영·탐(사/과 우수) 평균
  bestTwoSum: number; // 국·수·영·탐 중 상위 2개 합
  bestThreeSum: number; // 국·수·영·탐 중 상위 3개 합
  historyPassed: boolean; // 한국사 4등급 이내 여부
  estimatedPercentileTop: number; // 상위 %
  convertedFiveTierEquivalent: number; // 모의고사를 5등급제로 환산한 참고 등급
  csatMinSummary: string;
}

export interface GradeConversionResult {
  // 내신 환산 (별도)
  naesin: NaesinConversionResult;
  // 모의고사 환산 (별도)
  mock: MockConversionResult;
  // 하위 호환 및 비교 요약
  inputFiveTier: number;
  convertedNineTierMid: number;
  convertedNineTierMin: number;
  convertedNineTierMax: number;
  estimatedPercentileTop: number;
  percentileRange: [number, number];
  tierLabelFive: string;
  tierLabelNine: string;
  mockAverage: number;
  susiVsJeongsi: '수시 집중형' | '수시·정시 균형형' | '정시·수능최저 유리형';
  strategySummary: string;
}

export interface MajorDetail {
  name: string;
  track: TrackType;
  description: string;
  curriculum: string[];
  careers: string[];
  recommendedElectives: string[];
  fitAdvice: string;
}

export interface UniversityInfo {
  id: string;
  name: string;
  shortTag: string;
  region: string;
  type: '국립' | '사립' | '과기원';
  overview: string;
  admission2028Note: string;
  nineTierRange: [number, number];
  fiveTierRange: [number, number];
  mockPercentileMin: number;
  mockAvgGradeMax: number;
  majors: MajorDetail[];
  officialElectivesSummary: {
    track: TrackType;
    core: string[];
    recommended: string[];
  }[];
}

export interface CatalogDepartment {
  id: string;
  universityId: string;
  universityName: string;
  region: string;
  univType: '국립' | '사립' | '과기원' | '교대' | '전문대';
  departmentName: string;
  collegeName: string;
  track: TrackType;
  degreeType: '학사(4년)' | '전문학사(2~3년)';
  nineTierCut: number;
  fiveTierCut: number;
  description: string;
  recommendedElectives: string[];
}

export interface HighSchoolStats {
  schoolName: string;
  highSchoolType: HighSchoolType;
  isExactMatch: boolean;
  totalGraduates: number;
  fourYearAdmits: number;
  twoYearCollegeAdmits: number;
  progressionRate: number;
  topUnivBreakdown: {
    groupName: string;
    count: number;
    note: string;
  }[];
}

export interface SubjectStudyGuide {
  id: string;
  name: string;
  category: '국어' | '수학' | '영어' | '사회탐구' | '과학탐구' | '정보·교양';
  courseType: '공통과목' | '일반선택' | '진로선택' | '융합선택';
  difficulty: '높음' | '중상' | '보통';
  summary: string;
  conceptStrategy: string;
  practiceStrategy: string;
  schoolExamTip: string;
  csatTip: string;
  commonMistake: string;
  recommendedForUnivs: string[];
}

export interface SeniorAdvice {
  id: string;
  university: string;
  major: string;
  admissionType: string;
  authorAlias: string;
  gradeSummary: string;
  title: string;
  coreHabits: string[];
  adviceBody: string;
  recommendedElectives: string[];
}

export interface SchoolClassRoster {
  schoolName: string;
  highSchoolType: HighSchoolType;
  gradeYear: 1 | 2 | 3;
  gradeTotalStudents: number;
  classSizes: number[];
  selectedClassNumber: number;
  selectedClassStudents: number;
  isExactRoster: boolean;
}

export type QuestionDifficulty = '하' | '중' | '상';

export interface PastExamQuestion {
  id: string;
  number: number;
  questionType: '객관식' | '서술형';
  difficulty: QuestionDifficulty;
  points: number;
  unit: string;
  prompt: string;
  choices?: string[];
  correctIndex?: number;
  answerText: string;
  explanation: string;
  scoringRubric?: string;
}

export interface SchoolSubjectPastExam {
  schoolName: string;
  highSchoolType: HighSchoolType;
  subjectName: string;
  publisher?: string;
  semester: SemesterType;
  examKind: ExamPeriodKind;
  totalQuestionsInfo: string;
  essayRatio: string;
  schoolTrendSummary: string;
  cutScoreEstimate: string;
  questions: PastExamQuestion[];
}

export type DiagramVisualType =
  | 'conceptMap'
  | 'processFlow'
  | 'comparison'
  | 'coordinate';

export interface InstructorDiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  detail: string;
  role?: 'core' | 'primary' | 'secondary' | 'warning';
  x?: number;
  y?: number;
}

export interface InstructorDiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface InstructorDiagramSpec {
  visualType: DiagramVisualType;
  title: string;
  caption: string;
  nodes: InstructorDiagramNode[];
  edges: InstructorDiagramEdge[];
  axisLabels?: { x: string; y: string };
  keyEquation?: string;
}

export interface NotebookSectionBlock {
  heading: string;
  bulletPoints: string[];
  keyFormulaOrRule?: string;
  instructorHighlight: string;
}

export interface InstructorSummaryNote {
  id: string;
  schoolName: string;
  subjectName: string;
  publisher?: string;
  semester: SemesterType;
  examKind: ExamPeriodKind;
  examScope: string;
  difficultyFocus: QuestionDifficulty | '전체';
  source: 'curated' | 'ai';
  instructorGreeting: string;
  diagram: InstructorDiagramSpec;
  sections: NotebookSectionBlock[];
  examTraps: string[];
  finalChecklist: string[];
}

export type GoalExamTarget =
  | 'sem1Mid'
  | 'sem1Final'
  | 'sem2Mid'
  | 'sem2Final'
  | 'mock_3모'
  | 'mock_6모'
  | 'mock_9모'
  | 'mock_10모'
  | 'mock_수능';

export interface SubjectGoalTarget {
  subjectId: string;
  subjectName: string;
  enabled: boolean;
  targetGrade?: number;
  targetRank?: number;
}

export interface GoalMission {
  id: string;
  examTarget: GoalExamTarget;
  examLabel: string;
  targetGrade: number;
  targetGradeRank?: number;
  targetClassRank?: number;
  subjectGoals?: SubjectGoalTarget[];
  memo: string;
  createdAt: string;
  attemptNumber: number;
}

export interface MissionHistoryEntry {
  id: string;
  examLabel: string;
  targetGrade: number;
  actualGrade: number;
  targetGradeRank?: number;
  actualGradeRank?: number;
  targetClassRank?: number;
  actualClassRank?: number;
  subjectGoalsSummary?: string;
  succeeded: boolean;
  rankBefore: string;
  rankAfter: string;
  tokensAwarded: number;
  timestamp: string;
}

export interface MissionState {
  rankIndex: number; // 0 (이병) ~ 17 (대장)
  tokens: number; // 남은 기출 문제 풀이 토큰
  totalEarnedTokens: number;
  totalSolvedQuestions: number;
  unlockedQuestionIds: string[];
  totalSuccessCount: number;
  totalFailCount: number;
  legendaryClearCount: number; // 대장 도달 후 추가 달성 횟수
  lastOutcome: 'idle' | 'achieved' | 'failed';
  lastOutcomeMessage: string;
  currentGoal: GoalMission;
  history: MissionHistoryEntry[];
}

