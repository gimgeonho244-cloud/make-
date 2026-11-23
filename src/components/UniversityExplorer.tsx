import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {
  TOTAL_CATALOG_COUNT,
  searchCatalog36k,
} from '../data/departmentCatalog36k';
import {
  getSchoolAdmitsForUniversity,
  getHighSchoolStats,
} from '../data/highSchools';
import { UNIVERSITIES } from '../data/universities';
import {
  ExamPeriodKind,
  ExamTermConversionSummary,
  GradeConversionResult,
  MockExamPeriod,
  NaesinBasis,
  SemesterType,
  StudentProfile,
  TrackType,
  UniversityInfo,
} from '../types/admission';
import {
  basisToSemesterAndExam,
  getAvailableMockExams,
  getBasisLabel,
  semesterAndExamToBasis,
} from '../utils/gradeConverter';

interface UniversityExplorerProps {
  profile: StudentProfile;
  conversion: GradeConversionResult;
  onChangeBasis?: (basis: NaesinBasis) => void;
  onChangeMockExam?: (period: MockExamPeriod) => void;
}

type FitStatus = '안정' | '적정' | '상향';

function evaluateFitForNineGrade(
  studentNineGrade: number,
  nineMin: number,
  nineMax: number
): FitStatus {
  if (studentNineGrade <= nineMin + (nineMax - nineMin) * 0.45) {
    return '안정';
  }
  if (studentNineGrade <= nineMax + 0.25) {
    return '적정';
  }
  return '상향';
}

function getExamUniversityGroups(convertedNineTier: number) {
  const safe: string[] = [];
  const fit: string[] = [];
  const reach: string[] = [];

  for (const univ of UNIVERSITIES) {
    const status = evaluateFitForNineGrade(
      convertedNineTier,
      univ.nineTierRange[0],
      univ.nineTierRange[1]
    );
    const shortName = univ.name.split('(')[0].trim();
    if (status === '안정') safe.push(shortName);
    else if (status === '적정') fit.push(shortName);
    else reach.push(shortName);
  }

  return { safe, fit, reach };
}

export const UniversityExplorer: React.FC<UniversityExplorerProps> = ({
  profile,
  conversion,
  onChangeBasis,
  onChangeMockExam,
}) => {
  const [explorerMode, setExplorerMode] = useState<'curated' | 'catalog36k'>(
    'curated'
  );
  const [fitFilter, setFitFilter] = useState<'전체' | FitStatus>('전체');
  const [trackFilter, setTrackFilter] = useState<'내 계열' | '전체 계열' | TrackType>(
    '내 계열'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniv, setSelectedUniv] = useState<UniversityInfo | null>(null);

  // 36,000개 학과 검색 전용 상태
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogTrack, setCatalogTrack] = useState<'전체' | TrackType>('전체');
  const [onlyEligibleCut, setOnlyEligibleCut] = useState(false);
  const [catalogPage, setCatalogPage] = useState(1);

  const schoolStats = useMemo(
    () => getHighSchoolStats(profile.schoolName, profile.highSchoolType),
    [profile.schoolName, profile.highSchoolType]
  );

  const activeBasisLabel = getBasisLabel(profile.naesinBasis);
  const activeNineCut = conversion.naesin.convertedNineTierMid;

  const examComparisonCards = useMemo(() => {
    const terms: ExamTermConversionSummary[] = [
      conversion.naesin.sem1Mid,
      conversion.naesin.sem1Final,
      conversion.naesin.sem2Mid,
      conversion.naesin.sem2Final,
    ];
    return terms.map((summary) => ({
      summary,
      groups: getExamUniversityGroups(summary.convertedNineTier),
    }));
  }, [conversion.naesin]);

  const activeTrack: TrackType | null =
    trackFilter === '내 계열'
      ? profile.track
      : trackFilter === '전체 계열'
      ? null
      : trackFilter;

  const evaluatedList = useMemo(() => {
    return UNIVERSITIES.map((univ) => {
      const fit = evaluateFitForNineGrade(
        activeNineCut,
        univ.nineTierRange[0],
        univ.nineTierRange[1]
      );
      const matchingMajors = activeTrack
        ? univ.majors.filter(
            (m) => m.track === activeTrack || m.track === '자율전공·통합'
          )
        : univ.majors;
      const schoolAdmitInfo = getSchoolAdmitsForUniversity(
        profile.schoolName,
        profile.highSchoolType,
        univ.name,
        univ.nineTierRange[0]
      );
      return {
        univ,
        fit,
        schoolAdmitInfo,
        displayMajors: matchingMajors.length > 0 ? matchingMajors : univ.majors,
      };
    })
      .filter(({ univ, fit }) => {
        if (fitFilter !== '전체' && fit !== fitFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const hitUniv =
            univ.name.toLowerCase().includes(q) ||
            univ.overview.toLowerCase().includes(q) ||
            univ.region.toLowerCase().includes(q);
          const hitMajor = univ.majors.some(
            (m) =>
              m.name.toLowerCase().includes(q) ||
              m.description.toLowerCase().includes(q)
          );
          if (!hitUniv && !hitMajor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const order: Record<FitStatus, number> = { 적정: 0, 안정: 1, 상향: 2 };
        return order[a.fit] - order[b.fit];
      });
  }, [
    activeNineCut,
    fitFilter,
    activeTrack,
    searchQuery,
    profile.schoolName,
    profile.highSchoolType,
  ]);

  const counts = useMemo(() => {
    const c = { 안정: 0, 적정: 0, 상향: 0 };
    UNIVERSITIES.forEach((u) => {
      c[
        evaluateFitForNineGrade(
          activeNineCut,
          u.nineTierRange[0],
          u.nineTierRange[1]
        )
      ]++;
    });
    return c;
  }, [activeNineCut]);

  const activeCatalog = useMemo(() => {
    return searchCatalog36k({
      query: catalogQuery,
      track: catalogTrack,
      minNineCut: onlyEligibleCut ? activeNineCut - 0.35 : undefined,
      page: catalogPage,
      pageSize: 24,
    });
  }, [catalogQuery, catalogTrack, catalogPage, onlyEligibleCut, activeNineCut]);

  const totalPages = Math.max(1, Math.ceil(activeCatalog.matchedCount / 24));

  const { semester: activeSemester, exam: activeExam } = basisToSemesterAndExam(
    profile.naesinBasis
  );
  const availableMockExams = useMemo(
    () => getAvailableMockExams(profile.gradeYear),
    [profile.gradeYear]
  );

  return (
    <div className="space-y-6">
      {/* 4개 시험별(1중/1기/2중/2기) 갈 수 있는 대학 한눈에 비교 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1학기 중간·기말 / 2학기 중간·기말 시험별 갈 수 있는 대학
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              각 시험 성적만 따로 떼어 환산했을 때 갈 수 있는 대학입니다. 시험을 선택하면 아래 대학·36,000개 학과 판정이 해당 시험 기준으로 즉시 전환됩니다.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 whitespace-nowrap shrink-0">
            현재 조회 기준: {activeBasisLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {examComparisonCards.map(({ summary, groups }) => {
            const isActive = profile.naesinBasis === summary.term;
            return (
              <div
                key={summary.term}
                onClick={() => onChangeBasis?.(summary.term)}
                className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {summary.label}
                    </span>
                    <span className="text-xs font-mono-num text-slate-500">
                      상위 {summary.estimatedPercentileTop}%
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 font-mono-num">
                    <span className="text-xl font-bold text-slate-900">
                      {profile.isFiveTierEligible ? '5등급' : '9등급'}{' '}
                      {summary.inputGrade.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-base font-bold text-blue-700">
                      9등급 {summary.convertedNineTier.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-emerald-700">
                        안정 ({groups.safe.length}):{' '}
                      </span>
                      <span className="text-slate-700">
                        {groups.safe.length > 0
                          ? groups.safe.slice(0, 3).join(', ')
                          : '해당 구간 없음'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">
                        적정 ({groups.fit.length}):{' '}
                      </span>
                      <span className="text-slate-700">
                        {groups.fit.length > 0
                          ? groups.fit.slice(0, 3).join(', ')
                          : '해당 구간 없음'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-amber-700">
                        상향 ({groups.reach.length}):{' '}
                      </span>
                      <span className="text-slate-500">
                        {groups.reach.length > 0
                          ? groups.reach.slice(-3).join(', ')
                          : '최상위권 안정'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeBasis?.(summary.term);
                  }}
                  className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isActive ? '현재 이 시험 성적으로 보는 중' : '이 시험 성적으로 전체 보기'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header & High School Progression Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {profile.name}님 맞춤 대학 · 전국 {TOTAL_CATALOG_COUNT.toLocaleString()}개 학과 탐색
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              내신 적용 기준:{' '}
              <strong className="text-blue-700">{activeBasisLabel}</strong>{' '}
              ({profile.isFiveTierEligible ? '5등급제' : '9등급제'}{' '}
              <strong className="font-mono-num text-slate-900">
                {conversion.naesin.inputFiveTier.toFixed(2)}등급
              </strong>{' '}
              → 9등급제 환산{' '}
              <strong className="text-slate-900 font-mono-num">
                {conversion.naesin.convertedNineTierMid.toFixed(2)}등급
              </strong>
              ) · <strong>{profile.selectedMockExam}</strong> 국수영탐 평균{' '}
              <strong className="text-emerald-700 font-mono-num">
                {conversion.mock.averageCoreFour.toFixed(2)}등급
              </strong>
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setExplorerMode('curated')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                explorerMode === 'curated'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              주요 대학 심층 추천
            </button>
            <button
              type="button"
              onClick={() => setExplorerMode('catalog36k')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                explorerMode === 'catalog36k'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전국 36,000개 학과 · 대학 검색
            </button>
          </div>
        </div>

        {/* 내신 학기·시험 선택 + 모의고사 시험 선택 바 */}
        {(onChangeBasis || onChangeMockExam) && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            {onChangeBasis && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  내신 선택:
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-lg">
                  {(['1학기', '2학기'] as SemesterType[]).map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => {
                        onChangeBasis(semesterAndExamToBasis(sem, activeExam));
                        setCatalogPage(1);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        activeSemester === sem
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
                      onClick={() => {
                        onChangeBasis(
                          semesterAndExamToBasis(activeSemester, ex.id)
                        );
                        setCatalogPage(1);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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
            )}

            {onChangeMockExam && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  모의고사 선택:
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-lg">
                  {availableMockExams.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onChangeMockExam(m.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
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
            )}
          </div>
        )}

        {/* 우리 고등학교 진학 현황 요약 바 */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-800">
            <Users className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>{schoolStats.schoolName}</strong> ({schoolStats.highSchoolType}) 최근 대학 진학 현황: 졸업생{' '}
              <strong className="font-mono-num">{schoolStats.totalGraduates}명</strong> 중 4년제{' '}
              <strong className="font-mono-num text-blue-700">{schoolStats.fourYearAdmits}명</strong> · 전문대{' '}
              <strong className="font-mono-num">{schoolStats.twoYearCollegeAdmits}명</strong> 진학 ({schoolStats.progressionRate}%)
            </span>
          </div>
          <span className="text-xs text-slate-500 shrink-0">
            대학을 검색하면 우리 학교 진학 인원을 함께 확인합니다
          </span>
        </div>

        {/* Mode-specific filter controls */}
        {explorerMode === 'curated' ? (
          <div className="pt-2 border-t border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex p-1 bg-slate-100 rounded-lg">
                {(['전체', '적정', '안정', '상향'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFitFilter(status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      fitFilter === status
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                    {status !== '전체' && ` (${counts[status]})`}
                  </button>
                ))}
              </div>

              <select
                value={trackFilter}
                onChange={(e) =>
                  setTrackFilter(
                    e.target.value as '내 계열' | '전체 계열' | TrackType
                  )
                }
                className="h-9 px-3 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="내 계열">내 희망 계열 우선 ({profile.track})</option>
                <option value="전체 계열">전체 계열 모두 보기</option>
                <option value="자연·공학">자연·공학</option>
                <option value="의약학·생명">의약학·생명</option>
                <option value="상경·경영">상경·경영</option>
                <option value="인문·사회">인문·사회</option>
                <option value="교육·사범">교육·사범</option>
                <option value="자율전공·통합">자율전공·통합</option>
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="대학명 또는 학과명 검색..."
                className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-200 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogQuery}
                onChange={(e) => {
                  setCatalogQuery(e.target.value);
                  setCatalogPage(1);
                }}
                placeholder="전국 180개 대학명, 지역, 36,000개 학과명을 검색하세요 (예: 연세대, 충북대, 컴퓨터, 간호, 반도체...)"
                className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={catalogTrack}
                onChange={(e) => {
                  setCatalogTrack(e.target.value as '전체' | TrackType);
                  setCatalogPage(1);
                }}
                className="h-10 px-3 text-xs font-medium bg-white border border-slate-300 rounded-lg"
              >
                <option value="전체">전체 계열 (36,000개 학과)</option>
                <option value="자연·공학">자연·공학</option>
                <option value="의약학·생명">의약학·생명</option>
                <option value="상경·경영">상경·경영</option>
                <option value="인문·사회">인문·사회</option>
                <option value="교육·사범">교육·사범</option>
                <option value="자율전공·통합">자율전공·통합</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setOnlyEligibleCut((prev) => !prev);
                  setCatalogPage(1);
                }}
                className={`h-10 px-3.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  onlyEligibleCut
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                내 성적 적정·안정권만 보기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODE 1: Curated Deep-Dive Universities */}
      {explorerMode === 'curated' && (
        <>
          {evaluatedList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <p className="text-sm text-slate-600">
                검색 조건에 해당하는 대학이 없습니다. 전국 36,000개 학과 통합 검색에서 찾아보거나 필터를 초기화하세요.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCatalogQuery(searchQuery);
                    setExplorerMode('catalog36k');
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 cursor-pointer"
                >
                  36,000개 학과 통합 검색에서 찾기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFitFilter('전체');
                    setTrackFilter('전체 계열');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {evaluatedList.map(({ univ, fit, displayMajors, schoolAdmitInfo }) => {
                const fitStyle =
                  fit === '안정'
                    ? 'text-emerald-700'
                    : fit === '적정'
                    ? 'text-blue-700'
                    : 'text-amber-700';

                const FitIcon =
                  fit === '안정'
                    ? CheckCircle2
                    : fit === '적정'
                    ? TrendingUp
                    : AlertTriangle;

                return (
                  <div
                    key={univ.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{univ.region}</span>
                          <span aria-hidden="true">·</span>
                          <span>{univ.type}</span>
                          <span aria-hidden="true">·</span>
                          <span>{univ.shortTag}</span>
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap shrink-0 ${fitStyle}`}
                        >
                          <FitIcon className="w-3.5 h-3.5" />
                          <span>{fit} 지원권</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {univ.name}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-mono-num">
                          <span>
                            5등급제 {univ.fiveTierRange[0].toFixed(2)}~{univ.fiveTierRange[1].toFixed(2)}
                          </span>
                          <span aria-hidden="true">/</span>
                          <span>
                            9등급제 {univ.nineTierRange[0].toFixed(1)}~{univ.nineTierRange[1].toFixed(1)}
                          </span>
                          <span aria-hidden="true">/</span>
                          <span>정시 백분위 {univ.mockPercentileMin}%+</span>
                        </div>
                      </div>

                      {/* 우리 고교 해당 대학 진학 인원 */}
                      <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-blue-950">
                          {schoolStats.schoolName} 최근 이 대학 진학:{' '}
                          <strong className="font-mono-num text-blue-700">
                            약 {schoolAdmitInfo.admittedCount}명
                          </strong>
                        </span>
                        <span className="text-slate-600">
                          주요 합격 경로: {schoolAdmitInfo.mainTrack}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {univ.overview}
                      </p>

                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-semibold text-slate-500">
                          추천 학과 ({displayMajors.length}개)
                        </div>
                        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                          {displayMajors.slice(0, 2).map((major) => (
                            <div key={major.name} className="p-3.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-slate-900">
                                  {major.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {major.track}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {major.description}
                              </p>
                              <div className="mt-2 text-xs text-slate-500">
                                <span className="font-medium text-slate-700">권장 선택과목: </span>
                                {major.recommendedElectives.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {univ.admission2028Note.slice(0, 34)}...
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedUniv(univ)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap cursor-pointer"
                      >
                        <span>대학·학과 자세히 보기</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MODE 2: 36,000개 학과 · 180개 대학 통합 검색 */}
      {explorerMode === 'catalog36k' && (
        <div className="space-y-6">
          {/* 검색 결과 요약 + 대학별 우리 고교 진학 인원 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  전국 180개 대학 · {TOTAL_CATALOG_COUNT.toLocaleString()}개 학과 검색 결과
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  현재 검색 조건 일치 학과:{' '}
                  <strong className="font-mono-num text-blue-700">
                    {activeCatalog.matchedCount.toLocaleString()}개
                  </strong>{' '}
                  (대학을 검색하면 해당 대학에 우리 고등학교가 몇 명 진학했는지도 바로 표시됩니다)
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono-num">
                페이지 {catalogPage} / {totalPages}
              </span>
            </div>

            {/* 검색된 대학별 우리 학교 진학 인원 카드 */}
            {activeCatalog.matchedUniversities.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  검색된 대학별 {schoolStats.schoolName} 최근 진학 인원 (상위 12개교)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeCatalog.matchedUniversities.map((u) => {
                    const schoolInfo = getSchoolAdmitsForUniversity(
                      profile.schoolName,
                      profile.highSchoolType,
                      u.universityName,
                      u.nineCut
                    );
                    return (
                      <button
                        key={u.universityName}
                        type="button"
                        onClick={() => {
                          setCatalogQuery(u.universityName);
                          setCatalogPage(1);
                        }}
                        className="text-left p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {u.universityName}
                          </span>
                          <span className="text-xs font-semibold text-blue-700 font-mono-num shrink-0">
                            진학 약 {schoolInfo.admittedCount}명
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                          <span>
                            {u.region} · {u.univType}
                          </span>
                          <span className="font-mono-num">
                            9등급 {u.nineCut.toFixed(1)} / 5등급 {u.fiveCut.toFixed(1)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 36,000개 학과 테이블/그리드 */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4 whitespace-nowrap">대학명</th>
                    <th className="py-3 px-4 whitespace-nowrap">학과 · 전공명</th>
                    <th className="py-3 px-4 whitespace-nowrap">계열 / 학위</th>
                    <th className="py-3 px-4 whitespace-nowrap">5등급 / 9등급 기준</th>
                    <th className="py-3 px-4 whitespace-nowrap">지원 판정</th>
                    <th className="py-3 px-4">학과 소개 및 권장 선택과목</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {activeCatalog.items.map((dept) => {
                    const fit = evaluateFitForNineGrade(
                      activeNineCut,
                      dept.nineTierCut - 0.3,
                      dept.nineTierCut + 0.3
                    );
                    const fitColor =
                      fit === '안정'
                        ? 'text-emerald-700'
                        : fit === '적정'
                        ? 'text-blue-700'
                        : 'text-amber-700';

                    return (
                      <tr key={dept.id} className="hover:bg-slate-50/70 align-top">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">
                            {dept.universityName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {dept.region} · {dept.univType}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {dept.departmentName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {dept.collegeName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                          <div className="font-medium text-slate-800">
                            {dept.track}
                          </div>
                          <div className="text-slate-500">{dept.degreeType}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono-num text-xs">
                          <div className="font-semibold text-slate-900">
                            5등급 {dept.fiveTierCut.toFixed(2)}
                          </div>
                          <div className="text-slate-500">
                            9등급 {dept.nineTierCut.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`text-xs font-bold ${fitColor}`}>
                            {fit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 space-y-1 max-w-md">
                          <p>{dept.description}</p>
                          <div className="text-slate-500">
                            <strong className="text-slate-700">권장 선택과목: </strong>
                            {dept.recommendedElectives.join(', ')}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs text-slate-600 font-mono-num">
                총 {activeCatalog.matchedCount.toLocaleString()}개 학과 중{' '}
                {((catalogPage - 1) * 24 + 1).toLocaleString()} ~{' '}
                {Math.min(
                  catalogPage * 24,
                  activeCatalog.matchedCount
                ).toLocaleString()}
                번 표시
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={catalogPage <= 1}
                  onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  이전
                </button>
                <button
                  type="button"
                  disabled={catalogPage >= totalPages}
                  onClick={() => setCatalogPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md disabled:opacity-40 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  다음
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for University & Majors */}
      {selectedUniv && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedUniv(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{selectedUniv.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedUniv.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedUniv.shortTag}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedUniv.name} 상세 안내
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUniv(null)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const modalAdmit = getSchoolAdmitsForUniversity(
                profile.schoolName,
                profile.highSchoolType,
                selectedUniv.name,
                selectedUniv.nineTierRange[0]
              );
              return (
                <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 text-sm text-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong>{schoolStats.schoolName}</strong> 기준 최근 이 대학 진학 인원:{' '}
                    <strong className="text-blue-700 font-mono-num">
                      약 {modalAdmit.admittedCount}명
                    </strong>
                  </span>
                  <span className="text-xs text-slate-600">
                    {modalAdmit.basisLabel} · 주력: {modalAdmit.mainTrack}
                  </span>
                </div>
              );
            })()}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>대학 소개 및 인재상</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedUniv.overview}
              </p>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
                <strong className="text-slate-900">2028 대입(5등급제) 대비 전략: </strong>
                {selectedUniv.admission2028Note}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>추천 학과 상세 소개</span>
              </div>

              <div className="space-y-4">
                {selectedUniv.majors.map((major) => (
                  <div
                    key={major.name}
                    className="p-5 rounded-lg border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {major.name}
                      </h4>
                      <span className="text-xs font-medium text-blue-700">
                        {major.track}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {major.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">
                          주요 대학 교과목
                        </span>
                        <span className="text-slate-600">
                          {major.curriculum.join(' · ')}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">
                          졸업 후 주요 진로
                        </span>
                        <span className="text-slate-600">
                          {major.careers.join(' · ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-700 bg-blue-50/60 border border-blue-100 rounded-md p-3 space-y-1">
                      <div>
                        <strong>추천 고교 선택과목:</strong>{' '}
                        {major.recommendedElectives.join(', ')}
                      </div>
                      <div>
                        <strong>합격 적합성 팁:</strong> {major.fitAdvice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
