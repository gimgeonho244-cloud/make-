import React, { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  Coins,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Loader2,
  Lock,
  PenTool,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import {
  getSchoolClassRoster,
  inferHighSchoolType,
} from '../data/highSchools';
import { MILITARY_RANKS } from '../data/militaryRanks';
import {
  CORE_PAST_EXAM_SUBJECTS,
  PAST_EXAM_PRESET_SCHOOLS,
  getPublisherCurriculumHint,
  getPublishersForSubject,
  getSchoolPastExam,
  getSuggestedScopesForSubject,
} from '../data/pastExams';
import { getBaselineSummaryNote } from '../data/studyNotes';
import {
  ExamPeriodKind,
  HighSchoolType,
  InstructorSummaryNote,
  MissionState,
  PastExamQuestion,
  QuestionDifficulty,
  SemesterType,
  StudentProfile,
} from '../types/admission';
import { basisToSemesterAndExam } from '../utils/gradeConverter';
import { InstructorNotebook } from './InstructorNotebook';
import { RankInsignia } from './RankInsignia';

interface PastExamsSectionProps {
  profile: StudentProfile;
  mission: MissionState;
  onConsumeToken: (questionId: string) => boolean;
  onNavigateMission: () => void;
}

type StudyWorkspaceMode = 'questions' | 'notebook';
type DifficultyFilter = '전체' | QuestionDifficulty;

export const PastExamsSection: React.FC<PastExamsSectionProps> = ({
  profile,
  mission,
  onConsumeToken,
  onNavigateMission,
}) => {
  const initialExamPair = basisToSemesterAndExam(profile.naesinBasis);

  const [selectedSchoolName, setSelectedSchoolName] = useState<string>(
    profile.schoolName
  );
  const [selectedSchoolType, setSelectedSchoolType] = useState<HighSchoolType>(
    profile.highSchoolType
  );
  const [semester, setSemester] = useState<SemesterType>(
    initialExamPair.semester
  );
  const [examKind, setExamKind] = useState<ExamPeriodKind>(
    initialExamPair.exam
  );

  const uniqueSubjects = useMemo(() => {
    const profileNames = profile.subjectGrades.map((s) => s.name);
    const merged = [...profileNames, ...CORE_PAST_EXAM_SUBJECTS];
    return Array.from(new Set(merged));
  }, [profile.subjectGrades]);

  const initialSubject = uniqueSubjects[0] ?? '공통국어1';
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [selectedPublisher, setSelectedPublisher] =
    useState<string>('출판사 전체(공통)');
  const [customPublisherInput, setCustomPublisherInput] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>('전체');
  const [examScope, setExamScope] = useState<string>(
    getSuggestedScopesForSubject(initialSubject)[0] ?? ''
  );
  const [workspaceMode, setWorkspaceMode] =
    useState<StudyWorkspaceMode>('questions');

  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<string, boolean>
  >({});

  // AI-generated custom exam questions & AI-generated illustrated notebook state
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<
    PastExamQuestion[] | null
  >(null);
  const [aiExamLoading, setAiExamLoading] = useState(false);
  const [aiExamError, setAiExamError] = useState<string | null>(null);

  const [aiGeneratedNote, setAiGeneratedNote] =
    useState<InstructorSummaryNote | null>(null);
  const [aiNoteLoading, setAiNoteLoading] = useState(false);
  const [aiNoteError, setAiNoteError] = useState<string | null>(null);

  const scopeInputRef = useRef<HTMLInputElement>(null);

  const suggestedScopes = useMemo(
    () => getSuggestedScopesForSubject(selectedSubject),
    [selectedSubject]
  );

  const subjectPublishers = useMemo(
    () => getPublishersForSubject(selectedSubject),
    [selectedSubject]
  );

  const activePublisher =
    customPublisherInput.trim() || selectedPublisher || '출판사 전체(공통)';

  const handleSelectSubject = (subjName: string) => {
    setSelectedSubject(subjName);
    const nextScopes = getSuggestedScopesForSubject(subjName);
    setExamScope(nextScopes[0] ?? '');
    const nextPubs = getPublishersForSubject(subjName);
    if (!customPublisherInput.trim() && !nextPubs.includes(selectedPublisher)) {
      setSelectedPublisher('출판사 전체(공통)');
    }
    setAiGeneratedQuestions(null);
    setAiGeneratedNote(null);
    setAiExamError(null);
    setAiNoteError(null);
    if (subjName === '정보') {
      setSemester('1학기');
      setExamKind('final');
    } else if (subjName.includes('인기초')) {
      setSemester('2학기');
      setExamKind('final');
    }
  };

  const handleSelectSchoolPreset = (name: string, type: HighSchoolType) => {
    setSelectedSchoolName(name);
    setSelectedSchoolType(type);
    setAiGeneratedQuestions(null);
    setAiGeneratedNote(null);
  };

  const roster = useMemo(
    () =>
      getSchoolClassRoster(
        selectedSchoolName,
        selectedSchoolType,
        profile.gradeYear,
        profile.classNum,
        selectedSchoolName === profile.schoolName
          ? profile.customGradeTotalStudents
          : undefined,
        selectedSchoolName === profile.schoolName
          ? profile.customClassTotalStudents
          : undefined
      ),
    [
      selectedSchoolName,
      selectedSchoolType,
      profile.gradeYear,
      profile.classNum,
      profile.customGradeTotalStudents,
      profile.customClassTotalStudents,
      profile.schoolName,
    ]
  );

  const pastExam = useMemo(
    () =>
      getSchoolPastExam(
        selectedSchoolName,
        selectedSchoolType,
        selectedSubject,
        semester,
        examKind,
        activePublisher
      ),
    [
      selectedSchoolName,
      selectedSchoolType,
      selectedSubject,
      semester,
      examKind,
      activePublisher,
    ]
  );

  const activeQuestionsSource = aiGeneratedQuestions ?? pastExam.questions;

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === '전체') return activeQuestionsSource;
    const matched = activeQuestionsSource.filter(
      (q) => q.difficulty === difficultyFilter
    );
    return matched;
  }, [activeQuestionsSource, difficultyFilter]);

  const baselineNote = useMemo(
    () =>
      getBaselineSummaryNote(
        pastExam.schoolName,
        pastExam.subjectName,
        pastExam.semester,
        pastExam.examKind,
        examScope,
        difficultyFilter,
        activePublisher
      ),
    [
      pastExam.schoolName,
      pastExam.subjectName,
      pastExam.semester,
      pastExam.examKind,
      examScope,
      difficultyFilter,
      activePublisher,
    ]
  );

  const activeNote = aiGeneratedNote ?? baselineNote;

  const isFinalOnlyRestricted =
    selectedSubject === '정보' || selectedSubject.includes('인기초');

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateAiQuestions = async () => {
    if (!examScope.trim()) {
      setAiExamError('시험 범위를 먼저 입력해주세요.');
      scopeInputRef.current?.focus();
      return;
    }
    setWorkspaceMode('questions');
    setAiExamLoading(true);
    setAiExamError(null);

    try {
      const res = await fetch('/api/study/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: pastExam.schoolName,
          highSchoolType: selectedSchoolType,
          gradeYear: profile.gradeYear,
          subjectName: pastExam.subjectName,
          publisher: activePublisher,
          semester: pastExam.semester,
          examKind: pastExam.examKind,
          examScope: examScope.trim(),
          difficulty: difficultyFilter,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '기출문제 생성에 실패했습니다.');
      }
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('생성된 문항이 비어 있습니다. 시험 범위를 조금 더 구체적으로 적어주세요.');
      }
      setAiGeneratedQuestions(data.questions as PastExamQuestion[]);
      setUserAnswers({});
      setRevealedAnswers({});
    } catch (err) {
      setAiExamError(
        err instanceof Error ? err.message : '요청 처리 중 오류가 발생했습니다.'
      );
    } finally {
      setAiExamLoading(false);
    }
  };

  const handleGenerateAiNote = async () => {
    if (!examScope.trim()) {
      setAiNoteError('시험 범위를 먼저 입력해주세요.');
      scopeInputRef.current?.focus();
      return;
    }
    setWorkspaceMode('notebook');
    setAiNoteLoading(true);
    setAiNoteError(null);

    try {
      const res = await fetch('/api/study/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: pastExam.schoolName,
          highSchoolType: selectedSchoolType,
          gradeYear: profile.gradeYear,
          subjectName: pastExam.subjectName,
          publisher: activePublisher,
          semester: pastExam.semester,
          examKind: pastExam.examKind,
          examScope: examScope.trim(),
          difficulty: difficultyFilter,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '요약 노트 생성에 실패했습니다.');
      }
      if (!data.note) {
        throw new Error('생성된 요약 노트 데이터가 없습니다.');
      }
      setAiGeneratedNote(data.note as InstructorSummaryNote);
    } catch (err) {
      setAiNoteError(
        err instanceof Error ? err.message : '요약 노트 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setAiNoteLoading(false);
    }
  };

  const currentRank =
    MILITARY_RANKS[
      Math.min(MILITARY_RANKS.length - 1, Math.max(0, mission.rankIndex))
    ];

  const attemptQuestionAction = (
    q: PastExamQuestion,
    action: () => void
  ) => {
    const alreadyUnlocked = mission.unlockedQuestionIds.includes(q.id);
    if (alreadyUnlocked) {
      action();
      return;
    }
    const ok = onConsumeToken(q.id);
    if (ok) {
      action();
    }
  };

  return (
    <div className="space-y-6">
      {/* Rank & Token Status Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <RankInsignia rank={currentRank} size="md" />
          <div>
            <div className="text-xs font-semibold text-blue-700">
              기출 문제 풀이 토큰권 · 현재 계급 {currentRank.name}
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 font-mono-num">
              보유 기출 토큰 {mission.tokens}개{' '}
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                (1문제당 토큰 1개 차감 · 누적 {mission.totalSolvedQuestions}문제 풀이 완료)
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {mission.tokens > 0
                ? `현재 ${mission.tokens}문제를 새로 풀어 채점·해설까지 확인할 수 있습니다. (요약 노트북은 토큰 없이 무료 열람 가능)`
                : '남은 기출 풀이 토큰이 0개입니다. 성적 목표에 도달하면 계급 진급과 함께 토큰 2개가 지급됩니다.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateMission}
          className={`px-4 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
            mission.tokens === 0
              ? 'bg-blue-700 text-white hover:bg-blue-800'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>
            {mission.tokens === 0
              ? '성적 목표 도달해서 토큰 2개 받기'
              : '성적 목표 · 계급 미션 보기'}
          </span>
        </button>
      </section>

      {/* Header, School/Subject Filter, Exam Scope & Difficulty Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-semibold text-blue-700">
              학교별 기출 난이도 선택 · 시험 범위 맞춤 AI 강사 그림 요약 노트
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              학교별 기출문제 (상·중·하) 및 시험 범위 요약 노트북
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              학교·과목·난이도(상/중/하)와 이번 시험 범위를 입력하면, 맞춤 기출 연습과 AI 강사의 판서 그림 요약 노트를 바로 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex bg-slate-100 p-1 rounded-lg">
              {(['1학기', '2학기'] as SemesterType[]).map((sem) => (
                <button
                  key={sem}
                  type="button"
                  disabled={isFinalOnlyRestricted}
                  onClick={() => {
                    setSemester(sem);
                    setAiGeneratedQuestions(null);
                    setAiGeneratedNote(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
                    pastExam.semester === sem
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>

            <div className="inline-flex bg-slate-100 p-1 rounded-lg">
              {(
                [
                  { id: 'midterm', label: '중간고사' },
                  { id: 'final', label: '기말고사' },
                ] as { id: ExamPeriodKind; label: string }[]
              ).map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  disabled={isFinalOnlyRestricted}
                  onClick={() => {
                    setExamKind(ex.id);
                    setAiGeneratedQuestions(null);
                    setAiGeneratedNote(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
                    pastExam.examKind === ex.id
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

        {/* School Selector */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <input
              type="text"
              value={selectedSchoolName}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedSchoolName(v);
                setSelectedSchoolType((prev) => inferHighSchoolType(v, prev));
                setAiGeneratedQuestions(null);
                setAiGeneratedNote(null);
                setAiExamError(null);
                setAiNoteError(null);
              }}
              placeholder="학교명을 직접 입력하세요 (예: 목포덕인고등학교)"
              className="flex-1 h-10 px-3.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select
              value={selectedSchoolType}
              onChange={(e) =>
                setSelectedSchoolType(e.target.value as HighSchoolType)
              }
              className="h-10 px-3 text-xs font-medium bg-white border border-slate-300 rounded-lg"
            >
              <option value="일반고">일반고</option>
              <option value="자율형사립고">자율형사립고</option>
              <option value="외고·국제고">외고·국제고</option>
              <option value="과학고·영재고">과학고·영재고</option>
              <option value="특성화고">특성화고</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleSelectSchoolPreset(
                  profile.schoolName,
                  profile.highSchoolType
                )
              }
              className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSchoolName === profile.schoolName
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              내 학교 ({profile.schoolName})
            </button>
            {PAST_EXAM_PRESET_SCHOOLS.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => handleSelectSchoolPreset(s.name, s.type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSchoolName === s.name
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s.name} ({s.region})
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              과목 선택 ({uniqueSubjects.length}개 과목)
            </span>
            {isFinalOnlyRestricted && (
              <span className="text-blue-700 font-medium">
                {selectedSubject}는 {pastExam.semester} 기말고사만 시행되는 과목입니다
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {uniqueSubjects.map((subj) => {
              const active = selectedSubject === subj;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleSelectSubject(subj)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {subj}
                </button>
              );
            })}
          </div>
        </div>

        {/* Textbook Publisher Selection */}
        <div className="pt-4 border-t border-slate-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-800">
              교과서 출판사 선택 ({selectedSubject} 기준 · 기출 및 요약 노트 공통 적용)
            </span>
            <span className="text-blue-700 font-medium">
              현재 선택: {activePublisher}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {subjectPublishers.map((pub) => {
              const isSelected =
                !customPublisherInput.trim() && selectedPublisher === pub;
              return (
                <button
                  key={pub}
                  type="button"
                  onClick={() => {
                    setSelectedPublisher(pub);
                    setCustomPublisherInput('');
                    setAiGeneratedQuestions(null);
                    setAiGeneratedNote(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pub}
                </button>
              );
            })}

            <input
              type="text"
              value={customPublisherInput}
              onChange={(e) => {
                setCustomPublisherInput(e.target.value);
                setAiGeneratedQuestions(null);
                setAiGeneratedNote(null);
              }}
              placeholder="기타 출판사·교재명 직접 입력 (예: EBS 올림포스)"
              className="h-8 px-3 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[210px] flex-1 sm:flex-initial"
            />
          </div>

          <p className="text-xs text-slate-600">
            {getPublisherCurriculumHint(selectedSubject, activePublisher)}
          </p>
        </div>

        {/* Exam Scope Input + Difficulty (상·중·하) + AI Generation Controls */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* 시험 범위 입력 */}
            <div className="lg:col-span-7 space-y-2">
              <label
                htmlFor="exam-scope-input"
                className="block text-xs font-bold text-slate-800"
              >
                이번 시험 범위 입력 (단원명 · 페이지 · 핵심 개념 직접 입력)
              </label>
              <input
                ref={scopeInputRef}
                id="exam-scope-input"
                type="text"
                value={examScope}
                onChange={(e) => setExamScope(e.target.value)}
                placeholder={`예: ${suggestedScopes[0] ?? `${selectedSubject} 핵심 단원`}`}
                className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500">추천 범위 빠른 입력:</span>
                {suggestedScopes.map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setExamScope(sc)}
                    className={`px-2.5 py-1 rounded-md border text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      examScope === sc
                        ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

            {/* 난이도 상·중·하 선택 */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                기출 난이도 선택 (상 · 중 · 하)
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg">
                {(
                  [
                    { id: '전체', label: '전체' },
                    { id: '하', label: '난이도 하' },
                    { id: '중', label: '난이도 중' },
                    { id: '상', label: '난이도 상' },
                  ] as { id: DifficultyFilter; label: string }[]
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficultyFilter(d.id)}
                    className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      difficultyFilter === d.id
                        ? d.id === '상'
                          ? 'bg-amber-700 text-white shadow-sm'
                          : d.id === '중'
                          ? 'bg-blue-700 text-white shadow-sm'
                          : 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                하(교과서 기본) · 중(핵심 변형) · 상(고난도·서술형 킬러)을 골라 집중 연습할 수 있습니다.
              </p>
            </div>
          </div>

          {/* Workspace Switch & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="inline-flex bg-slate-100 p-1 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setWorkspaceMode('questions')}
                className={`px-4 py-2 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  workspaceMode === 'questions'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpenCheck className="w-4 h-4" />
                <span>학교별 기출문제 ({filteredQuestions.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceMode('notebook')}
                className={`px-4 py-2 text-xs font-bold rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  workspaceMode === 'notebook'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>AI 강사 그림 · 요약 노트북</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={aiExamLoading}
                onClick={handleGenerateAiQuestions}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {aiExamLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <PenTool className="w-3.5 h-3.5 text-slate-700" />
                )}
                <span>
                  {aiExamLoading
                    ? '시험 범위 기출 출제 중...'
                    : `시험 범위 맞춤 기출 출제 (${difficultyFilter})`}
                </span>
              </button>

              <button
                type="button"
                disabled={aiNoteLoading}
                onClick={handleGenerateAiNote}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {aiNoteLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <BookOpen className="w-3.5 h-3.5" />
                )}
                <span>
                  {aiNoteLoading
                    ? '강사 그림·노트 작성 중...'
                    : 'AI 강사 그림 · 요약 노트 만들기'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* School Exam Trend + Roster Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900">
              {pastExam.schoolName} · {pastExam.subjectName} ({pastExam.semester}{' '}
              {pastExam.examKind === 'midterm' ? '중간고사' : '기말고사'}) 출제 경향
            </h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {pastExam.schoolTrendSummary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-500">문항 구성 및 배점</div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {pastExam.totalQuestionsInfo}
              </div>
              <div className="text-slate-600 mt-0.5">{pastExam.essayRatio}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-500">예상 등급컷 기준</div>
              <div className="font-semibold text-blue-700 mt-0.5">
                {pastExam.cutScoreEstimate}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {roster.schoolName} {roster.gradeYear}학년 학급 인원 기준
            </h3>
            <span className="text-xs font-mono-num font-semibold text-blue-700">
              총 {roster.gradeTotalStudents}명 ({roster.classSizes.length}학급)
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {roster.isExactRoster
              ? '학교 학년·학급 편제 기준이 반영되어 5등급/9등급 석차 분포를 산출합니다.'
              : '해당 고교 유형의 학년·학급 평균 편제 모델이 적용됩니다.'}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-2 text-xs font-mono-num">
            {roster.classSizes.map((cnt, idx) => {
              const clsNo = idx + 1;
              const isMine =
                selectedSchoolName === profile.schoolName &&
                clsNo === roster.selectedClassNumber;
              return (
                <div
                  key={clsNo}
                  className={`px-2.5 py-2 rounded-md border text-center ${
                    isMine
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div>{clsNo}반</div>
                  <div className="font-semibold">{cnt}명</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Workspace Area: Questions OR AI Instructor Notebook */}
      {workspaceMode === 'notebook' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <h3 className="text-lg font-bold text-slate-900">
                {pastExam.subjectName} 강사 그림 판서 & 요약 노트북
              </h3>
            </div>
            {aiGeneratedNote && (
              <button
                type="button"
                onClick={() => setAiGeneratedNote(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>기본 단원 요약 노트로 돌아가기</span>
              </button>
            )}
          </div>

          {aiNoteError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">AI 요약 노트 생성 오류</div>
                <p className="mt-0.5">{aiNoteError}</p>
              </div>
            </div>
          )}

          {aiNoteLoading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-blue-700 mx-auto" />
              <div className="text-sm font-bold text-slate-900">
                강사가 「{examScope}」 범위에 맞춰 개념 그림과 노트를 정리하고 있습니다...
              </div>
              <p className="text-xs text-slate-500">
                핵심 도해 구조도, 단원별 공식, 시험 함정 포인트를 생성 중입니다.
              </p>
            </div>
          ) : (
            <InstructorNotebook note={activeNote} />
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-blue-700" />
              <h3 className="text-lg font-bold text-slate-900">
                {pastExam.schoolName} {pastExam.subjectName}
                {activePublisher !== '출판사 전체(공통)' && ` (${activePublisher})`} 기출 문항
                {difficultyFilter !== '전체' && ` · 난이도 ${difficultyFilter}`} (
                {filteredQuestions.length}문항)
              </h3>
            </div>

            {aiGeneratedQuestions && (
              <button
                type="button"
                onClick={() => {
                  setAiGeneratedQuestions(null);
                  setUserAnswers({});
                  setRevealedAnswers({});
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>기본 학교 기출 문항 보기</span>
              </button>
            )}
          </div>

          {aiExamError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">시험 범위 맞춤 기출 출제 오류</div>
                <p className="mt-0.5">{aiExamError}</p>
              </div>
            </div>
          )}

          {aiExamLoading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-blue-700 mx-auto" />
              <div className="text-sm font-bold text-slate-900">
                「{examScope}」 범위 · 난이도 {difficultyFilter} 기출 문항을 출제하고 있습니다...
              </div>
              <p className="text-xs text-slate-500">
                {pastExam.schoolName} 내신 스타일과 채점 기준을 반영해 문항을 구성합니다.
              </p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                기본 문항에는 난이도 「{difficultyFilter}」 문항이 등록되어 있지 않습니다.
              </p>
              <p className="text-xs text-slate-600">
                전체 난이도로 보거나 위 버튼을 눌러 입력한 시험 범위({examScope || selectedSubject})로 난이도 {difficultyFilter} 맞춤 기출을 바로 출제해 보세요.
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDifficultyFilter('전체')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  전체 난이도 보기
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAiQuestions}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                >
                  난이도 {difficultyFilter} 기출 바로 출제
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const isUnlocked = mission.unlockedQuestionIds.includes(q.id);
                const canSpendToken = mission.tokens > 0;
                const isLockedOut = !isUnlocked && !canSpendToken;

                const chosen = userAnswers[q.id];
                const isRevealed = isUnlocked && !!revealedAnswers[q.id];
                const hasAnsweredChoice = isUnlocked && chosen !== undefined;
                const isCorrect =
                  hasAnsweredChoice && q.correctIndex === chosen;

                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-xl p-6 space-y-4 ${
                      isLockedOut
                        ? 'border-slate-200 bg-slate-50/40'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900 font-mono-num">
                          문항 {q.number}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span
                          className={`font-semibold ${
                            q.questionType === '서술형'
                              ? 'text-blue-700'
                              : 'text-slate-700'
                          }`}
                        >
                          {q.questionType}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-600">{q.unit}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono-num">
                        <span
                          className={`font-semibold ${
                            isUnlocked
                              ? 'text-emerald-700'
                              : canSpendToken
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {isUnlocked
                            ? '풀이 해금됨'
                            : canSpendToken
                            ? '풀이 시 토큰 1개 차감'
                            : '토큰 0개 · 잠금'}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span
                          className={`font-bold ${
                            q.difficulty === '상'
                              ? 'text-amber-700'
                              : q.difficulty === '중'
                              ? 'text-blue-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          난이도 {q.difficulty}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {q.points}점
                        </span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-slate-900 whitespace-pre-line leading-relaxed font-medium">
                      {q.prompt}
                    </p>

                    {q.choices && q.choices.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {q.choices.map((choice, cIdx) => {
                          const selected = isUnlocked && chosen === cIdx;
                          const showResult = isRevealed || hasAnsweredChoice;
                          const isThisCorrect = q.correctIndex === cIdx;

                          let btnClass = isLockedOut
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-slate-100 cursor-pointer';
                          if (selected && showResult) {
                            btnClass = isThisCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold cursor-pointer'
                              : 'bg-red-50 border-red-400 text-red-900 font-semibold cursor-pointer';
                          } else if (isRevealed && isThisCorrect) {
                            btnClass =
                              'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold cursor-pointer';
                          }

                          return (
                            <button
                              key={`${q.id}-${cIdx}`}
                              type="button"
                              disabled={isLockedOut}
                              onClick={() => {
                                attemptQuestionAction(q, () => {
                                  setUserAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: cIdx,
                                  }));
                                  setRevealedAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: true,
                                  }));
                                });
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm rounded-lg border transition-colors flex items-center justify-between gap-2 ${btnClass}`}
                            >
                              <span>{choice}</span>
                              {selected && showResult &&
                                (isThisCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                ))}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {isLockedOut ? (
                      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-amber-950">
                          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>
                            보유 토큰이 부족하여 이 문항을 풀 수 없습니다. 성적 목표를 달성하면 계급 상승과 함께 2문제 풀이 토큰이 지급됩니다.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={onNavigateMission}
                          className="px-3.5 py-2 font-semibold rounded-lg bg-blue-700 text-white hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          목표 달성하러 가기
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        {hasAnsweredChoice && q.questionType === '객관식' ? (
                          <span
                            className={`text-xs font-semibold ${
                              isCorrect ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {isCorrect
                              ? '정답입니다.'
                              : `오답입니다. 정답은 ${q.answerText}입니다.`}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            {isUnlocked ? (
                              <HelpCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Coins className="w-3.5 h-3.5 text-blue-700" />
                            )}
                            {isUnlocked
                              ? q.questionType === '객관식'
                                ? '이미 해금된 문항입니다. 선지를 고르면 바로 채점됩니다.'
                                : '이미 해금된 서술형 문항입니다. 모범 답안과 채점 기준을 확인하세요.'
                              : q.questionType === '객관식'
                              ? '선지를 선택하면 토큰 1개가 차감되며 즉시 채점됩니다.'
                              : '토큰 1개를 사용하여 서술형 풀이와 채점 기준을 확인할 수 있습니다.'}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            attemptQuestionAction(q, () => toggleReveal(q.id));
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>정답 · 해설 접기</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>
                                {isUnlocked
                                  ? '정답 · 해설 보기'
                                  : '토큰 1개 사용 · 정답/해설 보기'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {isRevealed && (
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                        <div>
                          <span className="font-bold text-emerald-800">
                            모범 정답:{' '}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {q.answerText}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          <strong className="text-slate-900">해설: </strong>
                          {q.explanation}
                        </p>
                        {q.scoringRubric && (
                          <p className="text-blue-800 bg-blue-50/70 border border-blue-100 rounded-md p-2.5 text-xs">
                            <strong>서술형 채점 기준: </strong>
                            {q.scoringRubric}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
