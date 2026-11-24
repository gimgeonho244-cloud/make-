import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import {
  calculateRanksFromPercentile,
  getHighSchoolStats,
  getSchoolClassRoster,
} from '../data/highSchools';
import { UNIVERSITIES } from '../data/universities';
import {
  ExamPeriodKind,
  ExamTermConversionSummary,
  GradeConversionResult,
  MissionState,
  MockExamPeriod,
  MockGrades,
  NaesinBasis,
  SchoolSubjectGrade,
  SemesterType,
  StudentProfile,
  TierPosition,
} from '../types/admission';
import {
  FIVE_TIER_BANDS,
  NINE_TIER_BANDS,
  basisToSemesterAndExam,
  calculateNaesinAverage,
  getAvailableMockExams,
  getBasisLabel,
  getMockExamLabel,
  semesterAndExamToBasis,
  subjectAppliesToExam,
} from '../utils/gradeConverter';
import { GradeMissionPanel } from './GradeMissionPanel';

interface GradeConverterSectionProps {
  profile: StudentProfile;
  conversion: GradeConversionResult;
  mission: MissionState;
  onUpdateMission: (nextMission: MissionState) => void;
  onUpdateProfile: (patch: Partial<StudentProfile>) => void;
  onNavigatePastExams: () => void;
  onNavigateUniversities: (basis?: NaesinBasis) => void;
}

function getEligibleUniversityPreview(convertedNine: number): {
  fitList: string[];
  safeList: string[];
} {
  const fit: string[] = [];
  const safe: string[] = [];
  for (const u of UNIVERSITIES) {
    const [minCut, maxCut] = u.nineTierRange;
    if (convertedNine <= minCut + (maxCut - minCut) * 0.45) {
      safe.push(u.name.split('(')[0].trim());
    } else if (convertedNine <= maxCut + 0.25) {
      fit.push(u.name.split('(')[0].trim());
    }
  }
  return {
    fitList: fit.slice(0, 3),
    safeList: safe.slice(0, 3),
  };
}

const CONVERSION_TABLE = [
  {
    five: '1등급',
    fivePct: '상위 0 ~ 10%',
    nineRange: '1등급 ~ 2등급 (약 1.0 ~ 2.2)',
    ninePct: '1등급(4%) + 2등급(4~11% 중 대부분)',
    note: '상위권 대학 학종·교과 경쟁권. 세특·권장과목·수능최저가 변별 핵심',
  },
  {
    five: '2등급',
    fivePct: '상위 10 ~ 34%',
    nineRange: '2등급 말 ~ 4등급 중반 (약 2.3 ~ 4.2)',
    ninePct: '2등급 끝(10~11%) + 3등급(11~23%) + 4등급(23~34%)',
    note: '스펙트럼이 넓어 구간 내 상·중·하 원점수 및 모의고사 보완이 중요',
  },
  {
    five: '3등급',
    fivePct: '상위 34 ~ 66%',
    nineRange: '4등급 중반 ~ 6등급 초반 (약 4.3 ~ 6.1)',
    ninePct: '4등급(34~40%) + 5등급(40~60%) + 6등급(60~66%)',
    note: '수도권 중위권·지역국립대·논술·수능 중심 전형 전략 병행 권장',
  },
  {
    five: '4등급',
    fivePct: '상위 66 ~ 90%',
    nineRange: '6등급 초반 ~ 8등급 초반 (약 6.2 ~ 8.1)',
    ninePct: '6등급(66~77%) + 7등급(77~89%) + 8등급(89~90%)',
    note: '주요 반영 과목(상위 3~5과목) 중심 전형 및 면접·실용 특성화 트랙 공략',
  },
  {
    five: '5등급',
    fivePct: '상위 90 ~ 100%',
    nineRange: '8등급 초반 ~ 9등급 (약 8.2 ~ 9.0)',
    ninePct: '8등급(90~96%) + 9등급(96~100%)',
    note: '성실한 출결과 기초 학업 회복, 취업특성화/전문학사/정시 집중 전환 추천',
  },
];

export const GradeConverterSection: React.FC<GradeConverterSectionProps> = ({
  profile,
  conversion,
  mission,
  onUpdateMission,
  onUpdateProfile,
  onNavigatePastExams,
  onNavigateUniversities,
}) => {
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjGrade, setNewSubjGrade] = useState(2);
  const [newSubjSchedule, setNewSubjSchedule] = useState<'both' | 'finalOnly'>('both');

  const manualGradeRankInput =
    profile.manualOverallGradeRank !== undefined
      ? String(profile.manualOverallGradeRank)
      : '';
  const manualClassRankInput =
    profile.manualOverallClassRank !== undefined
      ? String(profile.manualOverallClassRank)
      : '';

  const { semester: activeSemester, exam: activeExam } = basisToSemesterAndExam(
    profile.naesinBasis
  );
  const activeBasis = semesterAndExamToBasis(activeSemester, activeExam);
  const activeBasisLabel = getBasisLabel(activeBasis);

  const markerLeftPct = Math.min(
    98.5,
    Math.max(1.5, conversion.naesin.estimatedPercentileTop)
  );
  const maxScale = profile.isFiveTierEligible ? 5 : 9;
  const schoolStats = getHighSchoolStats(
    profile.schoolName,
    profile.highSchoolType
  );
  const roster = getSchoolClassRoster(
    profile.schoolName,
    profile.highSchoolType,
    profile.gradeYear,
    profile.classNum,
    profile.customGradeTotalStudents,
    profile.customClassTotalStudents
  );
  const rankInfo = calculateRanksFromPercentile(
    conversion.naesin.estimatedPercentileTop,
    roster.gradeTotalStudents,
    roster.selectedClassStudents,
    profile.isFiveTierEligible
  );

  const activeSubjects = profile.subjectGrades.filter(
    (s) =>
      s.semester === activeSemester &&
      subjectAppliesToExam(s, activeExam)
  );
  const hiddenFinalOnlyNames =
    activeExam === 'midterm'
      ? profile.subjectGrades
          .filter(
            (s) => s.semester === activeSemester && s.examSchedule === 'finalOnly'
          )
          .map((s) => s.name)
      : [];
  const activeExamPreview = getEligibleUniversityPreview(
    conversion.naesin.convertedNineTierMid
  );

  const examCards: ExamTermConversionSummary[] = [
    conversion.naesin.sem1Mid,
    conversion.naesin.sem1Final,
    conversion.naesin.sem2Mid,
    conversion.naesin.sem2Final,
  ];

  const availableMockExams = getAvailableMockExams(profile.gradeYear);
  const activeMockGrades =
    profile.mockExams?.[profile.selectedMockExam] ?? profile.mockGrades;

  const handleSelectSemester = (sem: SemesterType) => {
    onUpdateProfile({ naesinBasis: semesterAndExamToBasis(sem, activeExam) });
  };

  const handleSelectExam = (ex: ExamPeriodKind) => {
    onUpdateProfile({ naesinBasis: semesterAndExamToBasis(activeSemester, ex) });
  };

  const handleActiveSubjectGradeChange = (id: string, grade: number) => {
    const field = activeExam === 'midterm' ? 'midtermGrade' : 'finalGrade';
    const nextSubjects = profile.subjectGrades.map((s) =>
      s.id === id ? { ...s, [field]: grade } : s
    );
    const nextAvg = calculateNaesinAverage(
      nextSubjects,
      activeSemester,
      activeExam
    );
    onUpdateProfile({
      subjectGrades: nextSubjects,
      fiveTierGrade: profile.isFiveTierEligible ? nextAvg : profile.fiveTierGrade,
      nineTierDirectGrade: !profile.isFiveTierEligible
        ? nextAvg
        : profile.nineTierDirectGrade,
    });
  };

  const handleActiveSubjectRankChange = (id: string, rankVal?: number) => {
    const rankField = activeExam === 'midterm' ? 'midtermRank' : 'finalRank';
    const nextSubjects = profile.subjectGrades.map((s) =>
      s.id === id ? { ...s, [rankField]: rankVal } : s
    );
    onUpdateProfile({ subjectGrades: nextSubjects });
  };

  const handleAddElectiveSubject = () => {
    const cleaned = newSubjName.trim();
    if (!cleaned) return;
    const clamped = Math.min(maxScale, Math.max(1, newSubjGrade));
    const schedule =
      cleaned === '정보' || cleaned.includes('인기초') || newSubjSchedule === 'finalOnly'
        ? 'finalOnly'
        : 'both';
    const newRow: SchoolSubjectGrade = {
      id: `added-${Date.now()}`,
      name: cleaned,
      semester: activeSemester,
      subLabel:
        schedule === 'finalOnly'
          ? `${profile.gradeYear}학년 ${activeSemester} · 기말만 시행`
          : `${profile.gradeYear}학년 ${activeSemester} 선택`,
      examSchedule: schedule,
      midtermGrade: clamped,
      finalGrade: clamped,
      credits: 4,
      isElective: true,
    };
    const nextSubjects = [...profile.subjectGrades, newRow];
    const nextAvg = calculateNaesinAverage(
      nextSubjects,
      activeSemester,
      activeExam
    );
    onUpdateProfile({
      subjectGrades: nextSubjects,
      fiveTierGrade: profile.isFiveTierEligible ? nextAvg : profile.fiveTierGrade,
      nineTierDirectGrade: !profile.isFiveTierEligible
        ? nextAvg
        : profile.nineTierDirectGrade,
    });
    setNewSubjName('');
  };

  const handleRemoveSubject = (id: string) => {
    if (activeSubjects.length <= 2) return;
    const nextSubjects = profile.subjectGrades.filter((s) => s.id !== id);
    const nextAvg = calculateNaesinAverage(
      nextSubjects,
      activeSemester,
      activeExam
    );
    onUpdateProfile({
      subjectGrades: nextSubjects,
      fiveTierGrade: profile.isFiveTierEligible ? nextAvg : profile.fiveTierGrade,
      nineTierDirectGrade: !profile.isFiveTierEligible
        ? nextAvg
        : profile.nineTierDirectGrade,
    });
  };

  const handleSelectMockExam = (period: MockExamPeriod) => {
    const targetGrades =
      profile.mockExams?.[period] ?? profile.mockGrades;
    onUpdateProfile({
      selectedMockExam: period,
      mockGrades: { ...targetGrades },
    });
  };

  const handleUpdateMockSubject = (key: keyof MockGrades, value: number) => {
    const updatedExamGrades: MockGrades = {
      ...activeMockGrades,
      [key]: value,
    };
    onUpdateProfile({
      mockGrades: updatedExamGrades,
      mockExams: {
        ...profile.mockExams,
        [profile.selectedMockExam]: updatedExamGrades,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 2008 vs 2009 정책 배너 */}
      {!profile.isFiveTierEligible ? (
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-950">
              2008년생(현 고3)은 5등급제 적용 제외 · 기존 9등급제 유지 대상입니다
            </h3>
            <p className="text-sm text-amber-900 mt-1">
              내신은 학기(1·2학기)와 시험(중간·기말)을 선택해 확인하고, 모의고사는 3·6·9·10모 및 <strong>수능</strong>까지 선택해 확인할 수 있습니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {profile.birthYear}년생 ({profile.gradeYear}학년) · 내신 시험(학기+중간/기말) & 모의고사(3·6·9·10모) 개별 환산
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              아래에서 확인하고 싶은 <strong>학기·시험</strong>과 <strong>응시한 모의고사</strong>를 각각 하나씩 고르면 그 성적으로 9등급제 환산 및 갈 수 있는 대학을 바로 확인합니다.
            </p>
          </div>
        </div>
      )}

      {/* 성적 목표 미션 · 군대 계급 & 기출 토큰 */}
      <GradeMissionPanel
        profile={profile}
        conversion={conversion}
        roster={roster}
        mission={mission}
        onUpdateMission={onUpdateMission}
        onUpdateProfile={onUpdateProfile}
        onNavigatePastExams={onNavigatePastExams}
        onScrollToGradeEditor={() => {
          document
            .getElementById('naesin-grade-editor')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* PART 1: 내신 학기(1·2학기) + 시험(중간·기말) 선택 및 환산 */}
      <section
        id="naesin-grade-editor"
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-semibold text-blue-700">
              PART 1 · 내신 시험 선택 및 등급 환산
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              학기·시험별 내신 9등급제 환산 ({activeBasisLabel})
            </h2>
          </div>

          {/* 학기 1개 선택 + 시험 1개 선택 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {(['1학기', '2학기'] as SemesterType[]).map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => handleSelectSemester(sem)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeSemester === sem
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {(
                [
                  { id: 'midterm', label: '중간고사' },
                  { id: 'final', label: '기말고사' },
                ] as { id: ExamPeriodKind; label: string }[]
              ).map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExam(ex.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeExam === ex.id
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 현재 선택한 시험의 핵심 환산 결과 & 갈 수 있는 대학 미리보기 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 p-5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-700">
                  현재 선택한 시험: {activeBasisLabel}
                </span>
                <span className="font-mono-num text-slate-600">
                  상위 {conversion.naesin.estimatedPercentileTop}%
                </span>
              </div>

              <div className="flex items-baseline gap-3 font-mono-num pt-1">
                <div>
                  <span className="text-xs text-slate-500 block">
                    {profile.isFiveTierEligible ? '5등급제 평균' : '9등급제 평균'}
                  </span>
                  <span className="text-3xl font-bold text-slate-900">
                    {conversion.naesin.inputFiveTier.toFixed(2)}
                  </span>
                </div>
                <span className="text-lg text-slate-400">→</span>
                <div>
                  <span className="text-xs text-slate-500 block">9등급제 환산</span>
                  <span className="text-3xl font-bold text-blue-700">
                    {conversion.naesin.convertedNineTierMid.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200/70 space-y-1.5 text-xs">
              <div>
                <span className="font-semibold text-blue-800">적정 지원권: </span>
                <span className="text-slate-800">
                  {activeExamPreview.fitList.length > 0
                    ? activeExamPreview.fitList.join(', ')
                    : '상향·안정권 참고'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-emerald-700">안정 지원권: </span>
                <span className="text-slate-700">
                  {activeExamPreview.safeList.length > 0
                    ? activeExamPreview.safeList.join(', ')
                    : '하위 지원권 참고'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateUniversities(activeBasis)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{activeBasisLabel} 성적으로 갈 수 있는 대학 전체 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 선택한 학기/시험 과목별 등급 입력 */}
          <div className="lg:col-span-7 p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div>
                  <span className="text-sm font-bold text-slate-900">
                    {activeBasisLabel} 과목별 등급 ({activeSubjects.length}과목)
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    선택한 시험 성적만 바로 수정·반영됩니다
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {activeSubjects.map((subj) => {
                  const val =
                    activeExam === 'midterm'
                      ? subj.midtermGrade
                      : subj.finalGrade;
                  const rankVal =
                    activeExam === 'midterm'
                      ? subj.midtermRank
                      : subj.finalRank;
                  return (
                    <div
                      key={subj.id}
                      className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {subj.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {subj.subLabel ?? subj.semester}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <select
                          value={val}
                          onChange={(e) =>
                            handleActiveSubjectGradeChange(
                              subj.id,
                              Number(e.target.value)
                            )
                          }
                          className="h-8 px-2 text-xs font-semibold font-mono-num bg-slate-50 border border-slate-300 rounded-md"
                        >
                          {Array.from({ length: maxScale }, (_, i) => i + 1).map(
                            (g) => (
                              <option key={g} value={g}>
                                {g}등급
                              </option>
                            )
                          )}
                        </select>
                        <input
                          type="number"
                          min={1}
                          max={roster.gradeTotalStudents}
                          value={rankVal ?? ''}
                          onChange={(e) => {
                            const r = parseInt(e.target.value, 10);
                            handleActiveSubjectRankChange(
                              subj.id,
                              Number.isFinite(r) && r >= 1 ? r : undefined
                            );
                          }}
                          title={`${subj.name} 실제 전교 석차 (선택 입력)`}
                          placeholder="석차"
                          className="w-14 h-8 px-1.5 text-xs font-mono-num bg-slate-50 border border-slate-300 rounded-md text-center"
                        />
                        {subj.isElective && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(subj.id)}
                            className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="과목 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {hiddenFinalOnlyNames.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
                  <strong>{hiddenFinalOnlyNames.join(', ')}</strong> 과목은{' '}
                  <strong>{activeSemester} 기말고사만 시행</strong>하므로 중간고사에서 제외되며, 기말고사를 선택하면 표시·반영됩니다.
                </div>
              )}
            </div>

            {/* 선택 학기에 과목 추가 */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200">
              <input
                type="text"
                value={newSubjName}
                onChange={(e) => setNewSubjName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddElectiveSubject();
                  }
                }}
                placeholder={`${activeSemester}에 추가할 선택과목명 입력 (예: 미적분, 물리학)`}
                className="flex-1 h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={newSubjSchedule}
                onChange={(e) =>
                  setNewSubjSchedule(e.target.value as 'both' | 'finalOnly')
                }
                className="h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-lg"
              >
                <option value="both">중간·기말 모두</option>
                <option value="finalOnly">기말고사만 시행</option>
              </select>
              <select
                value={newSubjGrade}
                onChange={(e) => setNewSubjGrade(Number(e.target.value))}
                className="h-9 px-2.5 text-xs font-mono-num bg-white border border-slate-300 rounded-lg"
              >
                {Array.from({ length: maxScale }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    {g}등급
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddElectiveSubject}
                className="h-9 px-4 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {activeSemester} 과목 추가
              </button>
            </div>
          </div>
        </div>

        {/* 4개 시험 빠른 비교 전환 바 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {examCards.map((card) => {
            const isSelected = activeBasis === card.term;
            return (
              <button
                key={card.term}
                type="button"
                onClick={() => onUpdateProfile({ naesinBasis: card.term })}
                className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{card.label}</span>
                  <span className="font-mono-num text-slate-500">
                    상위 {card.estimatedPercentileTop}%
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2 font-mono-num">
                  <span className="text-lg font-bold text-slate-900">
                    {card.inputGrade.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">→</span>
                  <span className="text-sm font-bold text-blue-700">
                    9등급 {card.convertedNineTier.toFixed(2)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 백분위 정렬 시각화 + 석차 위치 조절 */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>상위 0%</span>
              <span className="font-semibold text-blue-700 font-mono-num">
                {activeBasisLabel}: 5등급 {conversion.naesin.inputFiveTier.toFixed(2)} → 9등급 {conversion.naesin.convertedNineTierMid.toFixed(2)} (상위 {conversion.naesin.estimatedPercentileTop}%)
              </span>
              <span>100%</span>
            </div>

            <div className="relative pt-5 pb-1">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-150"
                style={{ left: `${markerLeftPct}%` }}
              >
                <div className="px-2 py-0.5 text-[11px] font-semibold text-white bg-blue-700 rounded font-mono-num whitespace-nowrap">
                  {activeBasisLabel} {conversion.naesin.estimatedPercentileTop}%
                </div>
                <div className="w-0.5 h-20 bg-blue-700" />
              </div>

              <div className="h-8 w-full flex rounded-md overflow-hidden border border-slate-200">
                {FIVE_TIER_BANDS.map((band, idx) => {
                  const bgColors = [
                    'bg-blue-600 text-white',
                    'bg-blue-400 text-white',
                    'bg-slate-200 text-slate-800',
                    'bg-slate-300 text-slate-800',
                    'bg-slate-400 text-white',
                  ];
                  return (
                    <div
                      key={band.tier}
                      style={{ width: `${band.width}%` }}
                      className={`h-full flex items-center justify-center text-[11px] font-semibold border-r border-white/40 last:border-r-0 ${bgColors[idx]}`}
                    >
                      5등급제 {band.tier}
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 h-8 w-full flex rounded-md overflow-hidden border border-slate-200">
                {NINE_TIER_BANDS.map((band, idx) => {
                  const bgColors = [
                    'bg-emerald-700 text-white',
                    'bg-emerald-600 text-white',
                    'bg-emerald-500 text-white',
                    'bg-slate-200 text-slate-800',
                    'bg-slate-300 text-slate-800',
                    'bg-slate-300 text-slate-800',
                    'bg-slate-400 text-white',
                    'bg-slate-500 text-white',
                    'bg-slate-600 text-white',
                  ];
                  return (
                    <div
                      key={band.tier}
                      style={{ width: `${band.width}%` }}
                      className={`h-full flex items-center justify-center text-[11px] font-semibold border-r border-white/40 last:border-r-0 ${bgColors[idx]}`}
                    >
                      {band.width >= 7 ? `${band.tier}` : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {profile.isFiveTierEligible && (
            <div className="lg:col-span-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-medium text-slate-700">
                동일 5등급 구간 내 석차 위치
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'upper', label: '상위권 (-3%)' },
                    { id: 'middle', label: '중위권 (표준)' },
                    { id: 'lower', label: '하위권 (+3%)' },
                  ] as { id: TierPosition; label: string }[]
                ).map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onUpdateProfile({ tierPosition: pos.id })}
                    className={`py-2 px-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      profile.tierPosition === pos.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PART 2: 모의고사 시험 선택 (3모 / 6모 / 9모 / 10모 / 고3 수능) 및 6과목 환산 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-semibold text-emerald-700">
              PART 2 · 모의고사 / 수능 시험 선택 및 환산 (내신과 분리)
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {getMockExamLabel(profile.selectedMockExam)} 성적 환산 및 수능 최저 진단
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start lg:self-auto">
            {availableMockExams.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMockExam(m.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  profile.selectedMockExam === m.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5">
          <div className="text-xs sm:text-sm text-slate-700">
            선택된 시험:{' '}
            <strong className="text-emerald-800">
              {getMockExamLabel(profile.selectedMockExam)}
            </strong>
            {profile.gradeYear !== 3 && (
              <span className="text-xs text-slate-500 ml-2">
                (수능은 고3 선택 시 표시됩니다)
              </span>
            )}
          </div>
          <div className="flex items-center gap-5 shrink-0 font-mono-num">
            <div>
              <span className="text-xs text-slate-500 block">국수영탐 평균</span>
              <span className="text-lg font-bold text-slate-900">
                {conversion.mock.averageCoreFour.toFixed(2)}등급
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">전영역(6과목)</span>
              <span className="text-lg font-bold text-slate-700">
                {conversion.mock.averageAllSix.toFixed(2)}등급
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">5등급제 환산시</span>
              <span className="text-lg font-bold text-emerald-700">
                {conversion.mock.convertedFiveTierEquivalent.toFixed(2)}등급
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                { key: 'korean', label: '국어' },
                { key: 'math', label: '수학' },
                { key: 'english', label: '영어' },
                { key: 'social', label: '사회 (사탐)' },
                { key: 'science', label: '과학 (과탐)' },
                { key: 'history', label: '한국사' },
              ] as const
            ).map((subj) => (
              <div
                key={subj.key}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {subj.label}
                  </span>
                  <span className="font-bold text-slate-900 font-mono-num">
                    {activeMockGrades[subj.key]}등급
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={activeMockGrades[subj.key]}
                  onChange={(e) =>
                    handleUpdateMockSubject(subj.key, Number(e.target.value))
                  }
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-xs text-slate-500">모의 상위 추정</div>
                <div className="text-lg font-bold text-slate-900 font-mono-num mt-0.5">
                  {conversion.mock.estimatedPercentileTop}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">2개 영역 합</div>
                <div className="text-lg font-bold text-slate-900 font-mono-num mt-0.5">
                  2합 {conversion.mock.bestTwoSum}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">3개 영역 합</div>
                <div className="text-lg font-bold text-slate-900 font-mono-num mt-0.5">
                  3합 {conversion.mock.bestThreeSum}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">한국사 기준</div>
                <div
                  className={`text-sm font-bold mt-1 ${
                    conversion.mock.historyPassed
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}
                >
                  {conversion.mock.historyPassed ? '충족 (4 이내)' : '보완 필요'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="text-xs font-semibold text-emerald-700">
                {profile.selectedMockExam} 기준 수능 최저학력기준 진단
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {conversion.mock.csatMinSummary}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <Compass className="w-4 h-4 text-blue-700" />
                  <span>
                    {activeBasisLabel} vs {profile.selectedMockExam}: {conversion.susiVsJeongsi}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {conversion.strategySummary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateUniversities(activeBasis)}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>선택 성적으로 대학 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PART 3: 우리 학교 학년 석차 · 반 등수 및 학급별 커트라인 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-blue-700">
                PART 3 · {roster.schoolName} {roster.gradeYear}학년 학년 석차 및 반 등수
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {roster.schoolName} {roster.gradeYear}학년 ({roster.gradeTotalStudents}명) ·{' '}
                {roster.selectedClassNumber}반 ({roster.selectedClassStudents}명) 기준 예상 석차
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="inline-flex items-center gap-1.5 text-slate-600">
              <span>학년 전체</span>
              <input
                type="number"
                min={20}
                max={900}
                value={profile.customGradeTotalStudents ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onUpdateProfile({
                    customGradeTotalStudents:
                      Number.isFinite(val) && val >= 20 ? val : undefined,
                  });
                }}
                placeholder={String(roster.gradeTotalStudents)}
                className="w-20 h-8 px-2 bg-white border border-slate-300 rounded font-mono-num font-semibold text-slate-900"
              />
              <span>명</span>
            </label>
            <label className="inline-flex items-center gap-1.5 text-slate-600">
              <span>{roster.selectedClassNumber}반 인원</span>
              <input
                type="number"
                min={5}
                max={60}
                value={profile.customClassTotalStudents ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onUpdateProfile({
                    customClassTotalStudents:
                      Number.isFinite(val) && val >= 5 ? val : undefined,
                  });
                }}
                placeholder={String(roster.selectedClassStudents)}
                className="w-16 h-8 px-2 bg-white border border-slate-300 rounded font-mono-num font-semibold text-slate-900"
              />
              <span>명</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* 예상 학년 석차 & 반 등수 + 역산기 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                <div className="text-xs text-slate-600">
                  {activeBasisLabel} 예상 학년 석차
                </div>
                <div className="text-2xl font-bold text-blue-700 font-mono-num mt-1">
                  {rankInfo.gradeRank}등{' '}
                  <span className="text-sm font-medium text-slate-500">
                    / {roster.gradeTotalStudents}명
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono-num">
                  상위 {conversion.naesin.estimatedPercentileTop}% 기준
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="text-xs text-slate-600">
                  {roster.selectedClassNumber}반 예상 반 등수
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono-num mt-1">
                  {rankInfo.classRank}등{' '}
                  <span className="text-sm font-medium text-slate-500">
                    / {roster.selectedClassStudents}명
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 font-mono-num">
                  {roster.selectedClassNumber}반 정원 {roster.selectedClassStudents}명
                </div>
              </div>
            </div>

            {/* 실제 등수 입력 시 등급·백분위 역산 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="text-xs font-semibold text-slate-800">
                실제 내 등수로 {profile.isFiveTierEligible ? '5등급제' : '9등급제'} 위치 바로 확인
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <label className="space-y-1">
                  <span className="text-slate-500 block">전교 석차 입력 (등)</span>
                  <input
                    type="number"
                    min={1}
                    max={roster.gradeTotalStudents}
                    value={manualGradeRankInput}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onUpdateProfile({
                        manualOverallGradeRank:
                          Number.isFinite(val) && val >= 1 ? val : undefined,
                      });
                    }}
                    placeholder={`예: ${rankInfo.gradeRank}`}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-md font-mono-num"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-500 block">{roster.selectedClassNumber}반 등수 입력 (등)</span>
                  <input
                    type="number"
                    min={1}
                    max={roster.selectedClassStudents}
                    value={manualClassRankInput}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onUpdateProfile({
                        manualOverallClassRank:
                          Number.isFinite(val) && val >= 1 ? val : undefined,
                      });
                    }}
                    placeholder={`예: ${rankInfo.classRank}`}
                    className="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-md font-mono-num"
                  />
                </label>
              </div>
              {(manualGradeRankInput || manualClassRankInput) && (() => {
                const gRank = parseInt(manualGradeRankInput, 10);
                const cRank = parseInt(manualClassRankInput, 10);
                const gPct =
                  Number.isFinite(gRank) && gRank >= 1
                    ? Number(
                        Math.min(
                          100,
                          (gRank / roster.gradeTotalStudents) * 100
                        ).toFixed(1)
                      )
                    : null;
                const cPct =
                  Number.isFinite(cRank) && cRank >= 1
                    ? Number(
                        Math.min(
                          100,
                          (cRank / roster.selectedClassStudents) * 100
                        ).toFixed(1)
                      )
                    : null;
                const pctForTier = gPct ?? cPct ?? 50;
                const tierEst = profile.isFiveTierEligible
                  ? pctForTier <= 10
                    ? '1등급'
                    : pctForTier <= 34
                    ? '2등급'
                    : pctForTier <= 66
                    ? '3등급'
                    : pctForTier <= 90
                    ? '4등급'
                    : '5등급'
                  : pctForTier <= 4
                  ? '1등급'
                  : pctForTier <= 11
                  ? '2등급'
                  : pctForTier <= 23
                  ? '3등급'
                  : pctForTier <= 40
                  ? '4등급'
                  : pctForTier <= 60
                  ? '5등급'
                  : pctForTier <= 77
                  ? '6등급'
                  : pctForTier <= 89
                  ? '7등급'
                  : pctForTier <= 96
                  ? '8등급'
                  : '9등급';

                const gOver =
                  Number.isFinite(gRank) && gRank > roster.gradeTotalStudents;
                const cOver =
                  Number.isFinite(cRank) && cRank > roster.selectedClassStudents;

                return (
                  <div className="p-2.5 rounded-lg bg-white border border-blue-200 text-xs text-slate-700 font-mono-num space-y-0.5">
                    {gPct !== null && (
                      <div>
                        전교 {gRank}등 → 상위 <strong>{gPct}%</strong> ({tierEst})
                        {gOver && (
                          <span className="ml-1.5 text-amber-700">
                            (학년 정원 {roster.gradeTotalStudents}명 초과)
                          </span>
                        )}
                      </div>
                    )}
                    {cPct !== null && (
                      <div>
                        {roster.selectedClassNumber}반 {cRank}등 → 반 상위{' '}
                        <strong>{cPct}%</strong>
                        {cOver && (
                          <span className="ml-1.5 text-amber-700">
                            (반 정원 {roster.selectedClassStudents}명 초과)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 반별 인원 편제 */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                {roster.schoolName} {roster.gradeYear}학년 전체 반별 인원 ({roster.classSizes.length}개 반 · 총 {roster.gradeTotalStudents}명)
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-2 text-xs font-mono-num">
                {roster.classSizes.map((sz, idx) => {
                  const clsNo = idx + 1;
                  const isMine = clsNo === roster.selectedClassNumber;
                  return (
                    <div
                      key={clsNo}
                      className={`p-2 rounded-md border text-center ${
                        isMine
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>{clsNo}반</div>
                      <div>{sz}명</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 등급별 학년·반 석차 컷표 */}
          <div className="lg:col-span-7 border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                {roster.schoolName} {roster.gradeYear}학년 등급별 전교·반 석차 컷 ({profile.isFiveTierEligible ? '5등급제' : '9등급제'})
              </span>
              <span className="text-slate-500 font-mono-num">
                전교 {roster.gradeTotalStudents}명 / {roster.selectedClassNumber}반 {roster.selectedClassStudents}명 기준
              </span>
            </div>
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 bg-white">
                  <th className="py-2.5 px-4">등급</th>
                  <th className="py-2.5 px-4">누적 비율</th>
                  <th className="py-2.5 px-4">전교 학년 석차 컷</th>
                  <th className="py-2.5 px-4">{roster.selectedClassNumber}반 예상 반 등수 컷</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono-num">
                {rankInfo.tierCutoffs.map((row) => (
                  <tr key={row.tierLabel} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      {row.tierLabel}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{row.pctRange}</td>
                    <td className="py-2.5 px-4 font-semibold text-blue-700">
                      {row.gradeRankRange}
                    </td>
                    <td className="py-2.5 px-4 text-slate-800">
                      {row.classRankRange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PART 4: 다니는 고등학교 현재 대학 진학 인원 현황 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {schoolStats.schoolName} 최근 대학 진학 현황
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {schoolStats.highSchoolType} 기준 ·{' '}
                {schoolStats.isExactMatch
                  ? '학교 진학 통계 데이터 반영'
                  : '고교 유형 공시 분포 모델 기반 산출'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 font-mono-num text-sm">
            <div>
              <span className="text-xs text-slate-500 block">졸업생</span>
              <strong className="text-slate-900">{schoolStats.totalGraduates}명</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">4년제 진학</span>
              <strong className="text-blue-700">{schoolStats.fourYearAdmits}명</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">전문대 진학</span>
              <strong className="text-slate-900">{schoolStats.twoYearCollegeAdmits}명</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">총 진학률</span>
              <strong className="text-emerald-700">{schoolStats.progressionRate}%</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schoolStats.topUnivBreakdown.map((item) => (
            <div
              key={item.groupName}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1"
            >
              <div className="text-xs font-medium text-slate-600">
                {item.groupName}
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono-num">
                {item.count}명
              </div>
              <div className="text-[11px] text-slate-500">{item.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reference Conversion Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">
            5등급제 ↔ 9등급제 공식 구간 비교표 (2009년생부터 적용)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            2008년생(고3)은 기존 9등급제가 적용되며, 2009년생부터 아래 5등급제 누적 비율이 적용됩니다.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 whitespace-nowrap">5등급제</th>
                <th className="py-3 px-4 whitespace-nowrap">누적 백분위</th>
                <th className="py-3 px-4 whitespace-nowrap">9등급제 환산 구간</th>
                <th className="py-3 px-4">겹치는 9등급제 분포</th>
                <th className="py-3 px-4">대입 전략 포인트</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {CONVERSION_TABLE.map((row) => (
                <tr key={row.five} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.five}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono-num whitespace-nowrap">
                    {row.fivePct}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-700 font-mono-num whitespace-nowrap">
                    {row.nineRange}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs sm:text-sm">
                    {row.ninePct}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs sm:text-sm">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
