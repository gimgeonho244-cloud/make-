import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Coins,
  RotateCcw,
  Shield,
  Target,
  XCircle,
} from 'lucide-react';
import {
  GOAL_EXAM_TARGET_OPTIONS,
  MILITARY_RANKS,
  evaluateGoalMission,
  getActualGradeForTarget,
  getGoalExamLabel,
  getSubjectsForGoalTarget,
  goalTargetToSemesterExam,
} from '../data/militaryRanks';
import {
  GoalExamTarget,
  GradeConversionResult,
  MissionHistoryEntry,
  MissionState,
  SchoolClassRoster,
  StudentProfile,
  SubjectGoalTarget,
} from '../types/admission';
import { RankInsignia } from './RankInsignia';

interface GradeMissionPanelProps {
  profile: StudentProfile;
  conversion: GradeConversionResult;
  roster: SchoolClassRoster;
  mission: MissionState;
  onUpdateMission: (nextMission: MissionState) => void;
  onUpdateProfile: (patch: Partial<StudentProfile>) => void;
  onNavigatePastExams: () => void;
  onScrollToGradeEditor?: () => void;
}

export const GradeMissionPanel: React.FC<GradeMissionPanelProps> = ({
  profile,
  conversion,
  roster,
  mission,
  onUpdateMission,
  onUpdateProfile,
  onNavigatePastExams,
  onScrollToGradeEditor,
}) => {
  const [draftTarget, setDraftTarget] = useState<GoalExamTarget>(
    mission.currentGoal.examTarget
  );
  const [draftGrade, setDraftGrade] = useState<string>(
    mission.currentGoal.targetGrade.toFixed(2)
  );
  const [draftGradeRank, setDraftGradeRank] = useState<string>(
    mission.currentGoal.targetGradeRank ? String(mission.currentGoal.targetGradeRank) : ''
  );
  const [draftClassRank, setDraftClassRank] = useState<string>(
    mission.currentGoal.targetClassRank ? String(mission.currentGoal.targetClassRank) : ''
  );
  const [draftSubjectGoals, setDraftSubjectGoals] = useState<
    Record<string, { enabled: boolean; targetGrade?: number; targetRank?: number }>
  >(() => {
    const map: Record<string, { enabled: boolean; targetGrade?: number; targetRank?: number }> = {};
    for (const sg of mission.currentGoal.subjectGoals ?? []) {
      map[sg.subjectId] = {
        enabled: sg.enabled,
        targetGrade: sg.targetGrade,
        targetRank: sg.targetRank,
      };
    }
    return map;
  });
  const [draftMemo, setDraftMemo] = useState<string>(mission.currentGoal.memo);
  const [showRankLadder, setShowRankLadder] = useState<boolean>(false);
  const [savedGoalFlash, setSavedGoalFlash] = useState<boolean>(false);
  const [showQuickActualEditor, setShowQuickActualEditor] = useState<boolean>(false);

  useEffect(() => {
    setDraftTarget(mission.currentGoal.examTarget);
    setDraftGrade(mission.currentGoal.targetGrade.toFixed(2));
    setDraftGradeRank(
      mission.currentGoal.targetGradeRank ? String(mission.currentGoal.targetGradeRank) : ''
    );
    setDraftClassRank(
      mission.currentGoal.targetClassRank ? String(mission.currentGoal.targetClassRank) : ''
    );
    const map: Record<string, { enabled: boolean; targetGrade?: number; targetRank?: number }> = {};
    for (const sg of mission.currentGoal.subjectGoals ?? []) {
      map[sg.subjectId] = {
        enabled: sg.enabled,
        targetGrade: sg.targetGrade,
        targetRank: sg.targetRank,
      };
    }
    setDraftSubjectGoals(map);
    setDraftMemo(mission.currentGoal.memo);
  }, [mission.currentGoal.id]);

  const currentRank =
    MILITARY_RANKS[Math.min(MILITARY_RANKS.length - 1, Math.max(0, mission.rankIndex))];
  const nextRank =
    mission.rankIndex < MILITARY_RANKS.length - 1
      ? MILITARY_RANKS[mission.rankIndex + 1]
      : null;

  const isDraftMock = draftTarget.startsWith('mock_');
  const maxAllowedGrade = isDraftMock || !profile.isFiveTierEligible ? 9.0 : 5.0;

  const draftSubjectCandidates = useMemo(
    () => getSubjectsForGoalTarget(draftTarget, profile, roster),
    [draftTarget, profile, roster]
  );

  const evaluation = useMemo(
    () => evaluateGoalMission(mission.currentGoal, profile, conversion, roster),
    [mission.currentGoal, profile, conversion, roster]
  );

  const currentMissionSubjectCandidates = useMemo(
    () => getSubjectsForGoalTarget(mission.currentGoal.examTarget, profile, roster),
    [mission.currentGoal.examTarget, profile, roster]
  );

  const currentMissionMeta = useMemo(
    () => goalTargetToSemesterExam(mission.currentGoal.examTarget),
    [mission.currentGoal.examTarget]
  );

  const availableTargets = GOAL_EXAM_TARGET_OPTIONS.filter(
    (opt) => !opt.grade3Only || profile.gradeYear === 3
  );

  const handleChangeDraftSubjectGoal = (
    subjectId: string,
    patch: { enabled?: boolean; targetGrade?: number; targetRank?: number }
  ) => {
    setDraftSubjectGoals((prev) => {
      const existing = prev[subjectId] ?? { enabled: false };
      const merged = { ...existing, ...patch };
      const autoEnable =
        patch.enabled !== undefined
          ? patch.enabled
          : merged.targetGrade !== undefined || merged.targetRank !== undefined;
      return {
        ...prev,
        [subjectId]: {
          ...merged,
          enabled: autoEnable,
        },
      };
    });
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(draftGrade);
    const validGrade = Number.isFinite(parsed)
      ? Number(Math.max(1.0, Math.min(maxAllowedGrade, parsed)).toFixed(2))
      : mission.currentGoal.targetGrade;

    const parsedGradeRank = parseInt(draftGradeRank, 10);
    const validGradeRank =
      Number.isFinite(parsedGradeRank) && parsedGradeRank >= 1
        ? Math.min(roster.gradeTotalStudents, parsedGradeRank)
        : undefined;

    const parsedClassRank = parseInt(draftClassRank, 10);
    const validClassRank =
      Number.isFinite(parsedClassRank) && parsedClassRank >= 1
        ? Math.min(roster.selectedClassStudents, parsedClassRank)
        : undefined;

    const subjectGoalsList: SubjectGoalTarget[] = draftSubjectCandidates
      .map((cand): SubjectGoalTarget | null => {
        const entry = draftSubjectGoals[cand.subjectId];
        if (!entry || !entry.enabled) return null;
        if (entry.targetGrade === undefined && entry.targetRank === undefined) {
          return null;
        }
        return {
          subjectId: cand.subjectId,
          subjectName: cand.subjectName,
          enabled: true,
          targetGrade: entry.targetGrade,
          targetRank: isDraftMock ? undefined : entry.targetRank,
        };
      })
      .filter((item): item is SubjectGoalTarget => item !== null);

    onUpdateMission({
      ...mission,
      lastOutcome: 'idle',
      lastOutcomeMessage: '',
      currentGoal: {
        id: `goal-${Date.now()}`,
        examTarget: draftTarget,
        examLabel: getGoalExamLabel(draftTarget),
        targetGrade: validGrade,
        targetGradeRank: validGradeRank,
        targetClassRank: validClassRank,
        subjectGoals: subjectGoalsList,
        memo: draftMemo.trim() || '목표 달성까지 기출·오답 반복',
        createdAt: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        attemptNumber: mission.currentGoal.attemptNumber,
      },
    });
    setDraftGrade(validGrade.toFixed(2));
    setDraftGradeRank(validGradeRank ? String(validGradeRank) : '');
    setDraftClassRank(validClassRank ? String(validClassRank) : '');
    setSavedGoalFlash(true);
    setTimeout(() => setSavedGoalFlash(false), 1800);
  };

  const handleJudgeMission = () => {
    const nowTime = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const subjectSummaryStr =
      evaluation.totalSubjectGoalCount > 0
        ? `과목 목표 ${evaluation.passedSubjectCount}/${evaluation.totalSubjectGoalCount} 달성`
        : undefined;

    if (evaluation.allMet) {
      const nextIndex = Math.min(MILITARY_RANKS.length - 1, mission.rankIndex + 1);
      const promotedRank = MILITARY_RANKS[nextIndex];
      const alreadyGeneral = mission.rankIndex >= MILITARY_RANKS.length - 1;
      const newLegendaryCount = alreadyGeneral
        ? mission.legendaryClearCount + 1
        : mission.legendaryClearCount;

      const historyEntry: MissionHistoryEntry = {
        id: `hist-${Date.now()}`,
        examLabel: mission.currentGoal.examLabel,
        targetGrade: mission.currentGoal.targetGrade,
        actualGrade: evaluation.actualGrade,
        targetGradeRank: mission.currentGoal.targetGradeRank,
        actualGradeRank: evaluation.actualGradeRank,
        targetClassRank: mission.currentGoal.targetClassRank,
        actualClassRank: evaluation.actualClassRank,
        subjectGoalsSummary: subjectSummaryStr,
        succeeded: true,
        rankBefore: currentRank.name,
        rankAfter: promotedRank.name,
        tokensAwarded: 2,
        timestamp: nowTime,
      };

      const nextSuggestedTarget = Number(
        Math.max(1.0, mission.currentGoal.targetGrade - 0.15).toFixed(2)
      );

      const nextGoalId = `goal-${Date.now() + 1}`;
      onUpdateMission({
        ...mission,
        rankIndex: nextIndex,
        tokens: mission.tokens + 2,
        totalEarnedTokens: mission.totalEarnedTokens + 2,
        totalSuccessCount: mission.totalSuccessCount + 1,
        legendaryClearCount: newLegendaryCount,
        lastOutcome: 'achieved',
        lastOutcomeMessage: alreadyGeneral
          ? `최고 계급 대장 유지(명예 ${newLegendaryCount}회) · 설정한 성적·석차·과목 목표를 모두 달성했습니다! 기출 풀이 토큰 +2개를 받았습니다.`
          : `축하합니다! ${currentRank.name} → ${promotedRank.name} 진급 완료! 기출 풀이 토큰 +2개를 획득했습니다. 이제 다음 목표를 정해 계속 도전하세요.`,
        currentGoal: {
          ...mission.currentGoal,
          id: nextGoalId,
          targetGrade: nextSuggestedTarget,
          targetGradeRank: mission.currentGoal.targetGradeRank
            ? Math.max(1, mission.currentGoal.targetGradeRank - 2)
            : undefined,
          targetClassRank: mission.currentGoal.targetClassRank
            ? Math.max(1, mission.currentGoal.targetClassRank - 1)
            : undefined,
          attemptNumber: 1,
          createdAt: nowTime,
        },
        history: [historyEntry, ...mission.history].slice(0, 15),
      });
    } else {
      const historyEntry: MissionHistoryEntry = {
        id: `hist-${Date.now()}`,
        examLabel: mission.currentGoal.examLabel,
        targetGrade: mission.currentGoal.targetGrade,
        actualGrade: evaluation.actualGrade,
        targetGradeRank: mission.currentGoal.targetGradeRank,
        actualGradeRank: evaluation.actualGradeRank,
        targetClassRank: mission.currentGoal.targetClassRank,
        actualClassRank: evaluation.actualClassRank,
        subjectGoalsSummary: subjectSummaryStr,
        succeeded: false,
        rankBefore: currentRank.name,
        rankAfter: currentRank.name,
        tokensAwarded: 0,
        timestamp: nowTime,
      };

      onUpdateMission({
        ...mission,
        totalFailCount: mission.totalFailCount + 1,
        lastOutcome: 'failed',
        lastOutcomeMessage: `미션 실패 (${evaluation.failedReasons.join(' · ')}). 다시 다음 목표를 정해 도달할 때까지 도전하세요!`,
        currentGoal: {
          ...mission.currentGoal,
          id: `goal-${Date.now() + 1}`,
          attemptNumber: mission.currentGoal.attemptNumber + 1,
          createdAt: nowTime,
        },
        history: [historyEntry, ...mission.history].slice(0, 15),
      });
    }
  };

  const handleQuickUpdateSubjectRank = (subjectId: string, rankVal?: number) => {
    if (currentMissionMeta.isMock) return;
    const field = currentMissionMeta.examKind === 'midterm' ? 'midtermRank' : 'finalRank';
    const nextSubjects = profile.subjectGrades.map((s) =>
      s.id === subjectId ? { ...s, [field]: rankVal } : s
    );
    onUpdateProfile({ subjectGrades: nextSubjects });
  };

  const handleQuickUpdateSubjectGrade = (subjectId: string, gradeVal: number) => {
    if (currentMissionMeta.isMock && currentMissionMeta.mockPeriod) {
      const period = currentMissionMeta.mockPeriod;
      const key = subjectId.replace('mock-', '') as keyof typeof profile.mockGrades;
      const base = profile.mockExams?.[period] ?? profile.mockGrades;
      const updated = { ...base, [key]: gradeVal };
      onUpdateProfile({
        mockExams: {
          ...profile.mockExams,
          [period]: updated,
        },
        ...(profile.selectedMockExam === period ? { mockGrades: updated } : {}),
      });
      return;
    }
    const field = currentMissionMeta.examKind === 'midterm' ? 'midtermGrade' : 'finalGrade';
    const nextSubjects = profile.subjectGrades.map((s) =>
      s.id === subjectId ? { ...s, [field]: gradeVal } : s
    );
    onUpdateProfile({ subjectGrades: nextSubjects });
  };

  return (
    <section
      id="mission-rank-section"
      className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
    >
      {/* Header: Current Military Rank + Past Exam Tokens */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-start sm:items-center gap-4">
          <RankInsignia rank={currentRank} size="lg" />
          <div>
            <div className="text-xs font-semibold text-blue-700">
              성적 목표 미션 · 군대 계급 성장 & 기출 토큰 시스템 (이병 ~ 대장)
            </div>
            <div className="flex flex-wrap items-baseline gap-2.5 mt-0.5">
              <h2 className="text-xl font-bold text-slate-900">
                현재 계급: {currentRank.name} ({currentRank.category})
              </h2>
              <span className="text-xs font-mono-num text-slate-500">
                {currentRank.index + 1} / {MILITARY_RANKS.length}단계
                {mission.legendaryClearCount > 0 &&
                  ` · 대장 명예 달성 ${mission.legendaryClearCount}회`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {currentRank.description}{' '}
              {nextRank
                ? `→ 목표(평균·전체석차·반석차·과목별) 도달 시 [${nextRank.name}] 진급 + 기출 토큰 2개 지급`
                : '→ 최고 계급(대장) 도달 완료! 추가 목표 달성 시에도 계속 토큰 2개가 지급됩니다.'}
            </p>
          </div>
        </div>

        {/* Token Counter & Quick Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center gap-3">
            <Coins className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <div className="text-[11px] font-medium text-slate-600">
                남은 기출 문제 풀이 토큰
              </div>
              <div className="text-lg font-bold text-blue-800 font-mono-num">
                {mission.tokens}개{' '}
                <span className="text-xs font-normal text-slate-600">
                  ({mission.tokens}문제 풀이 가능)
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigatePastExams}
            className="px-4 py-3 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>기출 풀러 가기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Outcome Banner (Success or Retry Loop Notice) */}
      {mission.lastOutcome !== 'idle' && mission.lastOutcomeMessage && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${
            mission.lastOutcome === 'achieved'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {mission.lastOutcome === 'achieved' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">
                {mission.lastOutcome === 'achieved'
                  ? '성적 목표 도달 성공! 계급 진급 및 토큰 2개 지급'
                  : '미션 실패 · 다음 목표를 다시 정해 재도전하세요'}
              </div>
              <p className="mt-0.5">{mission.lastOutcomeMessage}</p>
            </div>
          </div>

          {mission.lastOutcome === 'achieved' && mission.tokens > 0 && (
            <button
              type="button"
              onClick={onNavigatePastExams}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              받은 토큰으로 기출 {mission.tokens}문제 풀기
            </button>
          )}
        </div>
      )}

      {/* Main 2-Column Mission Workflow: Left = Detailed Goal Form, Right = Live Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 1. 상세 성적·석차·과목별 목표 설정 폼 */}
        <form
          onSubmit={handleSaveGoal}
          className="lg:col-span-6 border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {mission.lastOutcome === 'failed'
                    ? '재도전: 다음 성적·석차·과목 목표 정하기'
                    : mission.lastOutcome === 'achieved'
                    ? '다음 진급을 위한 새 목표 정하기'
                    : '성적 · 석차 · 과목별 목표 설정'}
                </h3>
              </div>
              <span className="text-xs font-mono-num text-slate-500">
                도전 {mission.currentGoal.attemptNumber}회차
              </span>
            </div>

            {/* 시험 & 목표 평균 등급 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700 block">
                  목표 대상 시험
                </span>
                <select
                  value={draftTarget}
                  onChange={(e) => {
                    const nextT = e.target.value as GoalExamTarget;
                    setDraftTarget(nextT);
                    const { actualGrade: refActual } = getActualGradeForTarget(
                      nextT,
                      profile,
                      conversion
                    );
                    setDraftGrade(Math.max(1.0, refActual - 0.2).toFixed(2));
                  }}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-medium"
                >
                  {availableTargets.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700 block">
                  목표 평균 등급 ({isDraftMock || !profile.isFiveTierEligible ? '1.00~9.00' : '1.00~5.00'} 이하)
                </span>
                <input
                  type="number"
                  step="0.05"
                  min={1.0}
                  max={maxAllowedGrade}
                  value={draftGrade}
                  onChange={(e) => setDraftGrade(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-mono-num font-bold text-blue-700"
                />
              </label>
            </div>

            {/* 전체 석차 목표 & 전체 학급 석차 목표 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700 block">
                  전체 석차 목표 (전교 {roster.gradeTotalStudents}명 중)
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={roster.gradeTotalStudents}
                    value={draftGradeRank}
                    onChange={(e) => setDraftGradeRank(e.target.value)}
                    placeholder="예: 20 (미입력 시 제외)"
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono-num font-semibold text-slate-900"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                    등 이내
                  </span>
                </div>
              </label>

              <label className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700 block">
                  전체 학급 석차 목표 ({roster.selectedClassNumber}반 {roster.selectedClassStudents}명 중)
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={roster.selectedClassStudents}
                    value={draftClassRank}
                    onChange={(e) => setDraftClassRank(e.target.value)}
                    placeholder="예: 3 (미입력 시 제외)"
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono-num font-semibold text-slate-900"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                    등 이내
                  </span>
                </div>
              </label>
            </div>

            {/* 빠른 평균 등급 버튼 */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 mr-1">빠른 평균 목표:</span>
              {[1.0, 1.5, 2.0, 2.5, 3.0]
                .filter((g) => g <= maxAllowedGrade)
                .map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setDraftGrade(g.toFixed(2))}
                    className={`px-2.5 py-1 rounded-md border font-mono-num cursor-pointer ${
                      Number(draftGrade) === g
                        ? 'bg-blue-700 text-white border-blue-700 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g.toFixed(1)}등급
                  </button>
                ))}
            </div>

            {/* 각 과목별 등급 또는 석차 목표 */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  각 과목별 등급 · 석차 목표 ({draftSubjectCandidates.length}과목)
                </span>
                <span className="text-[11px] text-slate-500">
                  체크한 과목만 미션 판정에 포함됩니다
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {draftSubjectCandidates.map((cand) => {
                  const row = draftSubjectGoals[cand.subjectId] ?? {
                    enabled: false,
                  };
                  const maxSubjScale =
                    isDraftMock || !profile.isFiveTierEligible ? 9 : 5;
                  return (
                    <div
                      key={cand.subjectId}
                      className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                        row.enabled
                          ? 'bg-white border-blue-300'
                          : 'bg-white/70 border-slate-200'
                      }`}
                    >
                      <label className="flex items-center gap-2 min-w-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleChangeDraftSubjectGoal(cand.subjectId, {
                              enabled: checked,
                              targetGrade:
                                checked && row.targetGrade === undefined
                                  ? Math.max(1, cand.actualGrade)
                                  : row.targetGrade,
                            });
                          }}
                          className="accent-blue-700 w-3.5 h-3.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 truncate block">
                            {cand.subjectName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono-num">
                            현재 {cand.actualGrade}등급
                            {!isDraftMock && ` · ${cand.actualRank}등`}
                          </span>
                        </div>
                      </label>

                      <div className="flex items-center gap-1.5 shrink-0 font-mono-num">
                        <select
                          aria-label={`${cand.subjectName} 목표 등급`}
                          value={row.targetGrade ?? ''}
                          onChange={(e) => {
                            const v = e.target.value ? Number(e.target.value) : undefined;
                            handleChangeDraftSubjectGoal(cand.subjectId, {
                              targetGrade: v,
                            });
                          }}
                          className="h-8 px-2 bg-slate-50 border border-slate-300 rounded text-xs"
                        >
                          <option value="">등급 무관</option>
                          {Array.from({ length: maxSubjScale }, (_, i) => i + 1).map(
                            (g) => (
                              <option key={g} value={g}>
                                {g}등급 이하
                              </option>
                            )
                          )}
                        </select>

                        {!isDraftMock && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={1}
                              max={roster.gradeTotalStudents}
                              aria-label={`${cand.subjectName} 목표 석차`}
                              value={row.targetRank ?? ''}
                              onChange={(e) => {
                                const parsedRank = parseInt(e.target.value, 10);
                                handleChangeDraftSubjectGoal(cand.subjectId, {
                                  targetRank:
                                    Number.isFinite(parsedRank) && parsedRank >= 1
                                      ? parsedRank
                                      : undefined,
                                });
                              }}
                              placeholder="석차"
                              className="w-16 h-8 px-2 bg-slate-50 border border-slate-300 rounded text-xs"
                            />
                            <span className="text-[11px] text-slate-500">등</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <label className="space-y-1 text-xs block">
              <span className="font-semibold text-slate-700 block">
                목표 달성 다짐 · 공부 계획
              </span>
              <input
                type="text"
                value={draftMemo}
                onChange={(e) => setDraftMemo(e.target.value)}
                placeholder="예: 기말고사 수학 오답노트 2회독 및 영어 서술형 암기"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              {savedGoalFlash
                ? '목표(평균·석차·과목별)가 저장되었습니다.'
                : '목표 확정 후 성적·석차를 비교해 판정하세요.'}
            </span>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {mission.lastOutcome === 'failed'
                ? '다음 목표 확정 (재도전)'
                : '성적·석차 목표 저장'}
            </button>
          </div>
        </form>

        {/* 2. 현재 진행 중인 목표 달성 판정 카드 */}
        <div className="lg:col-span-6 border border-slate-200 rounded-xl p-5 bg-white space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  진행 중인 미션: {mission.currentGoal.examLabel}
                </h3>
              </div>
              <span className="text-xs text-slate-500">{evaluation.scaleLabel}</span>
            </div>

            {/* 3대 전체 지표 (평균 등급 / 전체 석차 / 전체 학급 석차) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* 평균 등급 */}
              <div
                className={`p-3.5 rounded-xl border ${
                  evaluation.avgGradeMet
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="text-[11px] text-slate-600">목표 평균 등급</div>
                <div className="text-base font-bold text-slate-900 font-mono-num mt-0.5">
                  {mission.currentGoal.targetGrade.toFixed(2)} 이하
                </div>
                <div
                  className={`text-xs font-mono-num font-bold mt-1 ${
                    evaluation.avgGradeMet ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  현재 {evaluation.actualGrade.toFixed(2)}등급{' '}
                  ({evaluation.avgGradeMet ? '달성' : '미달'})
                </div>
              </div>

              {/* 전체 석차 */}
              <div
                className={`p-3.5 rounded-xl border ${
                  !mission.currentGoal.targetGradeRank
                    ? 'bg-slate-50 border-slate-200'
                    : evaluation.gradeRankMet
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="text-[11px] text-slate-600">전체 석차 목표</div>
                <div className="text-base font-bold text-slate-900 font-mono-num mt-0.5">
                  {mission.currentGoal.targetGradeRank
                    ? `${mission.currentGoal.targetGradeRank}등 이내`
                    : '목표 미설정'}
                </div>
                <div
                  className={`text-xs font-mono-num font-bold mt-1 ${
                    !mission.currentGoal.targetGradeRank
                      ? 'text-slate-600'
                      : evaluation.gradeRankMet
                      ? 'text-emerald-700'
                      : 'text-amber-800'
                  }`}
                >
                  현재 {evaluation.actualGradeRank}등/{roster.gradeTotalStudents}명{' '}
                  {mission.currentGoal.targetGradeRank
                    ? evaluation.gradeRankMet
                      ? '(달성)'
                      : '(미달)'
                    : evaluation.isManualGradeRank
                    ? '(직접입력)'
                    : '(추정)'}
                </div>
              </div>

              {/* 학급 석차 */}
              <div
                className={`p-3.5 rounded-xl border ${
                  !mission.currentGoal.targetClassRank
                    ? 'bg-slate-50 border-slate-200'
                    : evaluation.classRankMet
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="text-[11px] text-slate-600">
                  {roster.selectedClassNumber}반 학급 석차 목표
                </div>
                <div className="text-base font-bold text-slate-900 font-mono-num mt-0.5">
                  {mission.currentGoal.targetClassRank
                    ? `${mission.currentGoal.targetClassRank}등 이내`
                    : '목표 미설정'}
                </div>
                <div
                  className={`text-xs font-mono-num font-bold mt-1 ${
                    !mission.currentGoal.targetClassRank
                      ? 'text-slate-600'
                      : evaluation.classRankMet
                      ? 'text-emerald-700'
                      : 'text-amber-800'
                  }`}
                >
                  현재 {evaluation.actualClassRank}등/{roster.selectedClassStudents}명{' '}
                  {mission.currentGoal.targetClassRank
                    ? evaluation.classRankMet
                      ? '(달성)'
                      : '(미달)'
                    : evaluation.isManualClassRank
                    ? '(직접입력)'
                    : '(추정)'}
                </div>
              </div>
            </div>

            {/* 과목별 목표 판정 목록 */}
            {evaluation.subjectChecks.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    과목별 등급·석차 목표 달성 현황
                  </span>
                  <span
                    className={`font-mono-num font-bold ${
                      evaluation.allSubjectsMet ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {evaluation.passedSubjectCount} / {evaluation.totalSubjectGoalCount}과목 달성
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {evaluation.subjectChecks.map((chk) => (
                    <div
                      key={chk.subjectId}
                      className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                        chk.passed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-white border-amber-300 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{chk.subjectName}</div>
                        <div className="text-[11px] text-slate-600 font-mono-num">
                          목표:{' '}
                          {chk.targetGrade ? `${chk.targetGrade}등급` : ''}
                          {chk.targetGrade && chk.targetRank ? ' / ' : ''}
                          {chk.targetRank ? `${chk.targetRank}등` : ''}
                        </div>
                      </div>
                      <div className="text-right font-mono-num shrink-0">
                        <div
                          className={`font-bold ${
                            chk.passed ? 'text-emerald-700' : 'text-amber-800'
                          }`}
                        >
                          {chk.actualGrade}등급
                          {!currentMissionMeta.isMock && ` · ${chk.actualRank}등`}
                        </div>
                        <div className="text-[10px]">
                          {chk.passed ? '달성' : '미달'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 실제 성적/석차 바로 입력 토글 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowQuickActualEditor((v) => !v)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>실제 받은 전체 석차 · 반 등수 · 과목별 등급/석차 바로 입력하기</span>
                <span className="text-blue-700">
                  {showQuickActualEditor ? '접기' : '열기'}
                </span>
              </button>

              {showQuickActualEditor && (
                <div className="p-3.5 bg-white border-t border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="space-y-1">
                      <span className="text-slate-600 block">
                        실제 전체 석차 (빈칸=자동추정)
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={roster.gradeTotalStudents}
                        value={profile.manualOverallGradeRank ?? ''}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          onUpdateProfile({
                            manualOverallGradeRank:
                              Number.isFinite(v) && v >= 1 ? v : undefined,
                          });
                        }}
                        placeholder={`추정 ${evaluation.actualGradeRank}등`}
                        className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono-num"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-slate-600 block">
                        실제 {roster.selectedClassNumber}반 등수 (빈칸=자동추정)
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={roster.selectedClassStudents}
                        value={profile.manualOverallClassRank ?? ''}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          onUpdateProfile({
                            manualOverallClassRank:
                              Number.isFinite(v) && v >= 1 ? v : undefined,
                          });
                        }}
                        placeholder={`추정 ${evaluation.actualClassRank}등`}
                        className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded font-mono-num"
                      />
                    </label>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {currentMissionSubjectCandidates.map((cand) => {
                      const maxS =
                        currentMissionMeta.isMock || !profile.isFiveTierEligible
                          ? 9
                          : 5;
                      return (
                        <div
                          key={cand.subjectId}
                          className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 last:border-b-0"
                        >
                          <span className="font-medium text-slate-800 truncate">
                            {cand.subjectName}
                          </span>
                          <div className="flex items-center gap-1.5 font-mono-num shrink-0">
                            <select
                              value={cand.actualGrade}
                              onChange={(e) =>
                                handleQuickUpdateSubjectGrade(
                                  cand.subjectId,
                                  Number(e.target.value)
                                )
                              }
                              className="h-7 px-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                            >
                              {Array.from({ length: maxS }, (_, i) => i + 1).map(
                                (g) => (
                                  <option key={g} value={g}>
                                    {g}등급
                                  </option>
                                )
                              )}
                            </select>

                            {!currentMissionMeta.isMock && (
                              <input
                                type="number"
                                min={1}
                                max={roster.gradeTotalStudents}
                                value={cand.isEstimatedRank ? '' : cand.actualRank}
                                onChange={(e) => {
                                  const r = parseInt(e.target.value, 10);
                                  handleQuickUpdateSubjectRank(
                                    cand.subjectId,
                                    Number.isFinite(r) && r >= 1 ? r : undefined
                                  );
                                }}
                                placeholder={`추정 ${cand.actualRank}등`}
                                className="w-20 h-7 px-2 bg-slate-50 border border-slate-300 rounded text-xs"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
              <div>
                <strong className="text-slate-900">현재 판정 예측: </strong>
                {evaluation.allMet ? (
                  <span className="text-emerald-700 font-semibold">
                    설정한 모든 목표(평균·석차·과목별) 도달 완료! 판정 시{' '}
                    {nextRank ? `[${nextRank.name}] 진급` : '대장 명예 누적'} + 기출 토큰 2개가 즉시 지급됩니다.
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold">
                    미달 항목: {evaluation.failedReasons.join(' / ')}
                  </span>
                )}
              </div>
              {mission.currentGoal.memo && (
                <div className="text-slate-500">
                  다짐: {mission.currentGoal.memo}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            {onScrollToGradeEditor && (
              <button
                type="button"
                onClick={onScrollToGradeEditor}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                PART 1 성적표로 이동
              </button>
            )}

            <button
              type="button"
              onClick={handleJudgeMission}
              className={`px-4 py-2.5 text-xs font-bold rounded-lg text-white flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                evaluation.allMet
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-amber-700 hover:bg-amber-800'
              }`}
            >
              {evaluation.allMet ? (
                <>
                  <Award className="w-4 h-4" />
                  <span>목표 도달 완료 · 계급 진급 + 토큰 2개 받기</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>미션 결과 판정 (실패 기록 후 다음 목표 도전)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Military Rank Roadmap Toggle & History */}
      <div className="pt-2 border-t border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-mono-num">
            <span>
              누적 성공 <strong className="text-emerald-700">{mission.totalSuccessCount}회</strong>
            </span>
            <span>
              재도전(실패) <strong className="text-amber-700">{mission.totalFailCount}회</strong>
            </span>
            <span>
              누적 획득 토큰 <strong className="text-blue-700">{mission.totalEarnedTokens}개</strong>
            </span>
            <span>
              기출 풀이 완료 <strong className="text-slate-900">{mission.totalSolvedQuestions}문제</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowRankLadder((v) => !v)}
            className="px-3 py-1.5 font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            {showRankLadder
              ? '전체 군대 계급표 접기 (이병~대장)'
              : '전체 군대 계급표 보기 (이병~대장 18계급)'}
          </button>
        </div>

        {showRankLadder && (
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
            {MILITARY_RANKS.map((r) => {
              const achieved = r.index < mission.rankIndex;
              const isCurrent = r.index === mission.rankIndex;
              return (
                <div
                  key={r.name}
                  className={`p-2.5 rounded-lg border flex flex-col items-center text-center gap-1.5 ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                      : achieved
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}
                >
                  <RankInsignia rank={r} size="sm" />
                  <div className="text-xs font-bold text-slate-900">
                    {r.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{r.category}</div>
                </div>
              );
            })}
          </div>
        )}

        {mission.history.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
              최근 성적 목표 도전 기록
            </div>
            <div className="divide-y divide-slate-200 text-xs">
              {mission.history.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-bold ${
                        h.succeeded ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {h.succeeded ? '도달 성공' : '미션 실패'}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {h.examLabel}
                    </span>
                    <span className="text-slate-500 font-mono-num">
                      (평균 {h.targetGrade.toFixed(2)}/{h.actualGrade.toFixed(2)}
                      {h.targetGradeRank
                        ? ` · 전교 ${h.targetGradeRank}등/${h.actualGradeRank ?? '-'}등`
                        : ''}
                      {h.targetClassRank
                        ? ` · 반 ${h.targetClassRank}등/${h.actualClassRank ?? '-'}등`
                        : ''}
                      {h.subjectGoalsSummary ? ` · ${h.subjectGoalsSummary}` : ''}
                      )
                    </span>
                  </div>
                  <div className="font-mono-num text-slate-700">
                    {h.succeeded
                      ? `${h.rankBefore} → ${h.rankAfter} · 토큰 +${h.tokensAwarded}개`
                      : `계급 유지(${h.rankAfter}) · 다음 목표 재설정`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
