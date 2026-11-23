import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Info, Plus, Trash2, X } from 'lucide-react';
import {
  getHighSchoolStats,
  getSchoolClassRoster,
  inferHighSchoolType,
} from '../data/highSchools';
import {
  BirthYearCohort,
  ExamPeriodKind,
  HighSchoolType,
  MockExamPeriod,
  MockGrades,
  SchoolSubjectGrade,
  SemesterType,
  StudentProfile,
  TierPosition,
  TrackType,
} from '../types/admission';
import {
  basisToSemesterAndExam,
  calculateNaesinAverage,
  getAvailableMockExams,
  getBasisLabel,
  getDefaultGrade1Subjects,
  getDefaultMockExams,
  getDefaultUpperGradeSubjects,
  getMockExamLabel,
  isEligibleForFiveTier,
  semesterAndExamToBasis,
  subjectAppliesToExam,
} from '../utils/gradeConverter';

interface EntryGateProps {
  initialProfile?: StudentProfile | null;
  onEnter: (profile: StudentProfile) => void;
}

const TRACKS: TrackType[] = [
  '자연·공학',
  '의약학·생명',
  '상경·경영',
  '인문·사회',
  '교육·사범',
  '자율전공·통합',
];

const SCHOOL_TYPES: HighSchoolType[] = [
  '일반고',
  '자율형사립고',
  '외고·국제고',
  '과학고·영재고',
  '특성화고',
];

const QUICK_ELECTIVES = [
  '미적분',
  '확률과 통계',
  '기하',
  '물리학',
  '화학',
  '생명과학',
  '지구과학',
  '경제',
  '정치와 법',
  '사회·문화',
  '언어와 매체',
  '화법과 작문',
  '정보',
];

export const EntryGate: React.FC<EntryGateProps> = ({ initialProfile, onEnter }) => {
  const initialBasisPair = basisToSemesterAndExam(
    initialProfile?.naesinBasis ?? 'sem1Mid'
  );

  const [schoolName, setSchoolName] = useState(initialProfile?.schoolName ?? '');
  const [highSchoolType, setHighSchoolType] = useState<HighSchoolType>(
    initialProfile?.highSchoolType ?? '일반고'
  );
  const [gradeYear, setGradeYear] = useState<1 | 2 | 3>(initialProfile?.gradeYear ?? 1);
  const [classNum, setClassNum] = useState(initialProfile?.classNum ?? '');
  const [studentNum, setStudentNum] = useState(initialProfile?.studentNum ?? '');
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [birthYear, setBirthYear] = useState<BirthYearCohort>(
    initialProfile?.birthYear ?? '2010'
  );
  const [track, setTrack] = useState<TrackType>(
    initialProfile?.track ?? '자연·공학'
  );

  const [subjectGrades, setSubjectGrades] = useState<SchoolSubjectGrade[]>(
    initialProfile?.subjectGrades && initialProfile.subjectGrades.length > 0
      ? initialProfile.subjectGrades
      : getDefaultGrade1Subjects(2)
  );
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>(
    initialBasisPair.semester
  );
  const [selectedExam, setSelectedExam] = useState<ExamPeriodKind>(
    initialBasisPair.exam
  );

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectGrade, setNewSubjectGrade] = useState(2);
  const [newSubjectSchedule, setNewSubjectSchedule] = useState<'both' | 'finalOnly'>('both');

  const [tierPosition, setTierPosition] = useState<TierPosition>(
    initialProfile?.tierPosition ?? 'middle'
  );

  const [selectedMockExam, setSelectedMockExam] = useState<MockExamPeriod>(
    initialProfile?.selectedMockExam ?? '3모'
  );
  const [mockExams, setMockExams] = useState<Record<MockExamPeriod, MockGrades>>(
    initialProfile?.mockExams ??
      getDefaultMockExams(initialProfile?.mockGrades)
  );

  const [electives, setElectives] = useState<string[]>(
    initialProfile?.electives ?? ['미적분', '물리학']
  );
  const [customElective, setCustomElective] = useState('');
  const [customGradeTotal, setCustomGradeTotal] = useState<string>(
    initialProfile?.customGradeTotalStudents
      ? String(initialProfile.customGradeTotalStudents)
      : ''
  );
  const [customClassTotal, setCustomClassTotal] = useState<string>(
    initialProfile?.customClassTotalStudents
      ? String(initialProfile.customClassTotalStudents)
      : ''
  );
  const [errorMsg, setErrorMsg] = useState('');

  const fiveTierEligible = isEligibleForFiveTier(birthYear);
  const maxGradeScale = fiveTierEligible ? 5 : 9;
  const activeBasis = semesterAndExamToBasis(selectedSemester, selectedExam);

  const availableMockExams = useMemo(
    () => getAvailableMockExams(gradeYear),
    [gradeYear]
  );

  const activeMockGrades = mockExams[selectedMockExam];

  const activeSubjects = useMemo(
    () =>
      subjectGrades.filter(
        (s) =>
          s.semester === selectedSemester &&
          subjectAppliesToExam(s, selectedExam)
      ),
    [subjectGrades, selectedSemester, selectedExam]
  );

  const hiddenFinalOnlyNames = useMemo(
    () =>
      selectedExam === 'midterm'
        ? subjectGrades
            .filter(
              (s) =>
                s.semester === selectedSemester &&
                s.examSchedule === 'finalOnly'
            )
            .map((s) => s.name)
        : [],
    [subjectGrades, selectedSemester, selectedExam]
  );

  const activeNaesinAvg = useMemo(
    () => calculateNaesinAverage(subjectGrades, selectedSemester, selectedExam),
    [subjectGrades, selectedSemester, selectedExam]
  );

  const activeMockCoreAvg = useMemo(() => {
    const bestExp = Math.min(activeMockGrades.social, activeMockGrades.science);
    return Number(
      (
        (activeMockGrades.korean +
          activeMockGrades.math +
          activeMockGrades.english +
          bestExp) /
        4
      ).toFixed(2)
    );
  }, [activeMockGrades]);

  const schoolStatsPreview = useMemo(
    () => getHighSchoolStats(schoolName || '한국고등학교', highSchoolType),
    [schoolName, highSchoolType]
  );

  const parsedCustomGradeTotal =
    parseInt(customGradeTotal, 10) >= 20
      ? parseInt(customGradeTotal, 10)
      : undefined;
  const parsedCustomClassTotal =
    parseInt(customClassTotal, 10) >= 5
      ? parseInt(customClassTotal, 10)
      : undefined;

  const rosterPreview = useMemo(
    () =>
      getSchoolClassRoster(
        schoolName || '한국고등학교',
        highSchoolType,
        gradeYear,
        classNum || '1',
        parsedCustomGradeTotal,
        parsedCustomClassTotal
      ),
    [
      schoolName,
      highSchoolType,
      gradeYear,
      classNum,
      parsedCustomGradeTotal,
      parsedCustomClassTotal,
    ]
  );

  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val);
    setHighSchoolType((prev) => inferHighSchoolType(val, prev));
    setCustomGradeTotal('');
    setCustomClassTotal('');
  };

  const handleGradeYearChange = (newGrade: 1 | 2 | 3) => {
    setGradeYear(newGrade);
    if (newGrade !== 3 && selectedMockExam === '수능') {
      setSelectedMockExam('10모');
    }
    if (newGrade === 1) {
      setSubjectGrades(getDefaultGrade1Subjects(2));
      setBirthYear('2010');
    } else if (newGrade === 2) {
      setSubjectGrades(getDefaultUpperGradeSubjects(track, 2));
      setBirthYear('2009');
    } else {
      setSubjectGrades(getDefaultUpperGradeSubjects(track, 2));
      setBirthYear('2008');
    }
  };

  const handleBirthYearChange = (cohort: BirthYearCohort) => {
    setBirthYear(cohort);
    if (cohort === '2008') {
      setGradeYear(3);
      setSubjectGrades(getDefaultUpperGradeSubjects(track, 2));
    } else if (cohort === '2009') {
      setGradeYear(2);
      if (selectedMockExam === '수능') setSelectedMockExam('10모');
      setSubjectGrades(getDefaultUpperGradeSubjects(track, 2));
    } else if (cohort === '2010') {
      setGradeYear(1);
      if (selectedMockExam === '수능') setSelectedMockExam('10모');
      setSubjectGrades(getDefaultGrade1Subjects(2));
    }
  };

  const updateActiveSubjectGrade = (id: string, grade: number) => {
    const field = selectedExam === 'midterm' ? 'midtermGrade' : 'finalGrade';
    setSubjectGrades((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: grade } : s))
    );
  };

  const addSubjectRow = () => {
    const cleaned = newSubjectName.trim();
    if (!cleaned) return;
    const clamped = Math.min(maxGradeScale, Math.max(1, newSubjectGrade));
    const schedule =
      cleaned === '정보' || cleaned.includes('인기초') || newSubjectSchedule === 'finalOnly'
        ? 'finalOnly'
        : 'both';
    setSubjectGrades((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: cleaned,
        semester: selectedSemester,
        subLabel:
          schedule === 'finalOnly'
            ? `${gradeYear}학년 ${selectedSemester} · 기말만 시행`
            : `${gradeYear}학년 ${selectedSemester} 선택`,
        examSchedule: schedule,
        midtermGrade: clamped,
        finalGrade: clamped,
        credits: 4,
        isElective: true,
      },
    ]);
    if (!electives.includes(cleaned)) {
      setElectives((prev) => [...prev, cleaned]);
    }
    setNewSubjectName('');
  };

  const removeSubjectRow = (id: string) => {
    if (activeSubjects.length <= 2) return;
    setSubjectGrades((prev) => prev.filter((s) => s.id !== id));
  };

  const updateActiveMockSubject = (key: keyof MockGrades, value: number) => {
    setMockExams((prev) => ({
      ...prev,
      [selectedMockExam]: {
        ...prev[selectedMockExam],
        [key]: value,
      },
    }));
  };

  const applySample2010Grade1 = () => {
    setSchoolName('서라벌고등학교');
    setHighSchoolType('일반고');
    setBirthYear('2010');
    setGradeYear(1);
    setClassNum('3');
    setStudentNum('12');
    setName('박지훈');
    setTrack('자연·공학');
    setSelectedSemester('1학기');
    setSelectedExam('midterm');
    const g1 = getDefaultGrade1Subjects(2).map((s, idx) => ({
      ...s,
      midtermGrade: s.name.includes('수학') || s.name === '정보' ? 1 : idx % 2 === 0 ? 2 : 2,
      finalGrade: s.name.includes('수학') || s.name.includes('과학') ? 1 : 2,
    }));
    setSubjectGrades(g1);
    setTierPosition('upper');
    setSelectedMockExam('6모');
    setMockExams(
      getDefaultMockExams({
        korean: 2,
        math: 1,
        english: 2,
        social: 3,
        science: 1,
        history: 2,
      })
    );
    setElectives(['미적분', '물리학', '정보']);
    setErrorMsg('');
  };

  const applySample2009Grade2 = () => {
    setSchoolName('휘문고등학교');
    setHighSchoolType('자율형사립고');
    setBirthYear('2009');
    setGradeYear(2);
    setClassNum('5');
    setStudentNum('09');
    setName('김서준');
    setTrack('자연·공학');
    setSelectedSemester('1학기');
    setSelectedExam('final');
    const g2 = getDefaultUpperGradeSubjects('자연·공학', 2).map((s) => ({
      ...s,
      midtermGrade: 2,
      finalGrade: s.isElective ? 1 : 2,
    }));
    setSubjectGrades(g2);
    setTierPosition('middle');
    setSelectedMockExam('9모');
    setMockExams(
      getDefaultMockExams({
        korean: 2,
        math: 1,
        english: 2,
        social: 2,
        science: 1,
        history: 1,
      })
    );
    setElectives(['미적분', '기하', '물리학', '정보']);
    setErrorMsg('');
  };

  const applySample2008Grade3 = () => {
    setSchoolName('숙명여자고등학교');
    setHighSchoolType('일반고');
    setBirthYear('2008');
    setGradeYear(3);
    setClassNum('2');
    setStudentNum('08');
    setName('이하은');
    setTrack('상경·경영');
    setSelectedSemester('2학기');
    setSelectedExam('midterm');
    const g3 = getDefaultUpperGradeSubjects('상경·경영', 2).map((s) => ({
      ...s,
      midtermGrade: 2,
      finalGrade: 2,
    }));
    setSubjectGrades(g3);
    setSelectedMockExam('수능');
    setMockExams(
      getDefaultMockExams({
        korean: 2,
        math: 2,
        english: 1,
        social: 2,
        science: 3,
        history: 1,
      })
    );
    setElectives(['확률과 통계', '경제', '사회·문화']);
    setErrorMsg('');
  };

  const addElective = (subject: string) => {
    const trimmed = subject.trim();
    if (!trimmed) return;
    if (!electives.includes(trimmed)) {
      setElectives((prev) => [...prev, trimmed]);
    }
    setCustomElective('');
  };

  const toggleQuickElective = (subject: string) => {
    if (electives.includes(subject)) {
      setElectives((prev) => prev.filter((item) => item !== subject));
    } else {
      setElectives((prev) => [...prev, subject]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !name.trim() || !classNum.trim() || !studentNum.trim()) {
      setErrorMsg('학교명, 학년·반·번호, 이름을 모두 입력해 주세요.');
      return;
    }

    setErrorMsg('');
    onEnter({
      schoolName: schoolName.trim(),
      highSchoolType,
      gradeYear,
      classNum: classNum.trim(),
      studentNum: studentNum.trim(),
      name: name.trim(),
      birthYear,
      isFiveTierEligible: fiveTierEligible,
      subjectGrades,
      naesinBasis: activeBasis,
      fiveTierGrade: fiveTierEligible ? activeNaesinAvg : 2.0,
      nineTierDirectGrade: !fiveTierEligible ? activeNaesinAvg : 2.0,
      tierPosition,
      selectedMockExam,
      mockExams,
      mockGrades: { ...activeMockGrades },
      track,
      electives,
      customGradeTotalStudents: parsedCustomGradeTotal,
      customClassTotalStudents: parsedCustomClassTotal,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-2">
              2028 대입 개편안 · 학기/시험 선택 내신 환산 & 3·6·9·10모/수능 모의고사 분석
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              고교학점제 5등급제 대입 나침반
            </h1>
            <p className="mt-2 text-slate-600 text-base max-w-2xl">
              내신은 1·2학기 중 하나와 중간·기말고사 중 하나를, 모의고사는 응시한 시험(3모·6모·9모·10모·고3 수능)을 선택해 성적을 입력하고 갈 수 있는 대학을 확인하세요.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={applySample2010Grade1}
              className="px-3 py-2 text-xs font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              고1(1학기 중간 · 6모) 예시
            </button>
            <button
              type="button"
              onClick={applySample2009Grade2}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
            >
              고2(1학기 기말 · 9모) 예시
            </button>
            <button
              type="button"
              onClick={applySample2008Grade3}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
            >
              고3(2학기 중간 · 수능) 예시
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8"
        >
          {/* 1. 학생 기본 인적사항 */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                01. 학생 정보 및 재학 고등학교 입력
              </h2>
              <span className="text-xs text-slate-500">
                입력한 학교 기준으로 대학 진학 인원 현황도 함께 분석합니다
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  학교명
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => handleSchoolNameChange(e.target.value)}
                  placeholder="예: 서라벌고등학교"
                  className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  고교 유형
                </label>
                <select
                  value={highSchoolType}
                  onChange={(e) => setHighSchoolType(e.target.value as HighSchoolType)}
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {SCHOOL_TYPES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  학년
                </label>
                <select
                  value={gradeYear}
                  onChange={(e) => handleGradeYearChange(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={1}>1학년 (공통과목)</option>
                  <option value={2}>2학년 (선택과목 추가)</option>
                  <option value={3}>3학년 (수능 선택 가능)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    반
                  </label>
                  <input
                    type="text"
                    value={classNum}
                    onChange={(e) => setClassNum(e.target.value)}
                    placeholder="3"
                    className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    번호
                  </label>
                  <input
                    type="text"
                    value={studentNum}
                    onChange={(e) => setStudentNum(e.target.value)}
                    placeholder="12"
                    className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="김지민"
                  className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500">빠른 학교 선택:</span>
              {[
                { name: '목포덕인고등학교', type: '일반고' as HighSchoolType },
                { name: '서라벌고등학교', type: '일반고' as HighSchoolType },
                { name: '휘문고등학교', type: '자율형사립고' as HighSchoolType },
                { name: '숙명여자고등학교', type: '일반고' as HighSchoolType },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setSchoolName(preset.name);
                    setHighSchoolType(preset.type);
                    setCustomGradeTotal('');
                    setCustomClassTotal('');
                  }}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {schoolName.trim() && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong className="text-slate-900">{schoolName.trim()}</strong> ({schoolStatsPreview.highSchoolType}) {gradeYear}학년:{' '}
                    <strong className="font-mono-num text-blue-700">
                      총 {rosterPreview.gradeTotalStudents}명
                    </strong>{' '}
                    · {rosterPreview.selectedClassNumber}반{' '}
                    <strong className="font-mono-num text-slate-900">
                      {rosterPreview.selectedClassStudents}명
                    </strong>{' '}
                    | 졸업생 {schoolStatsPreview.totalGraduates}명 중 4년제{' '}
                    <strong className="font-mono-num text-blue-700">{schoolStatsPreview.fourYearAdmits}명</strong> 진학 ({schoolStatsPreview.progressionRate}%)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 font-mono-num">
                  <span className="text-slate-500 mr-1">반별 인원:</span>
                  {rosterPreview.classSizes.map((sz, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded border ${
                        idx + 1 === rosterPreview.selectedClassNumber
                          ? 'bg-blue-50 border-blue-400 text-blue-800 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}반 {sz}명
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-200">
                  <span className="text-slate-500">우리 학교 실제 인원이 다르면 직접 수정:</span>
                  <label className="inline-flex items-center gap-1.5">
                    <span>학년 전체</span>
                    <input
                      type="number"
                      min={20}
                      max={900}
                      value={customGradeTotal}
                      onChange={(e) => setCustomGradeTotal(e.target.value)}
                      placeholder={String(rosterPreview.gradeTotalStudents)}
                      className="w-20 h-7 px-2 bg-white border border-slate-300 rounded font-mono-num text-xs"
                    />
                    <span>명</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5">
                    <span>{rosterPreview.selectedClassNumber}반</span>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={customClassTotal}
                      onChange={(e) => setCustomClassTotal(e.target.value)}
                      placeholder={String(rosterPreview.selectedClassStudents)}
                      className="w-16 h-7 px-2 bg-white border border-slate-300 rounded font-mono-num text-xs"
                    />
                    <span>명</span>
                  </label>
                </div>
              </div>
            )}
          </section>

          <hr className="border-slate-200" />

          {/* 2. 출생연도 구분 */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                02. 출생연도 및 5등급제 적용 여부 선택
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                2008년생(고3)은 5등급제에서 제외되어 기존 9등급제가 적용되며, 2009년생부터 5등급제가 시작됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { id: '2008' as BirthYearCohort, title: '2008년생 (고3)', sub: '5등급제 제외 · 기존 9등급제 · 수능 가능' },
                { id: '2009' as BirthYearCohort, title: '2009년생 (고2)', sub: '5등급제 첫 적용 · 2028 대입' },
                { id: '2010' as BirthYearCohort, title: '2010년생 (고1)', sub: '5등급제 전면 적용 · 2029 대입' },
                { id: '2011+' as BirthYearCohort, title: '2011년생 이후', sub: '5등급제 적용 예정' },
              ].map((opt) => {
                const active = birthYear === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleBirthYearChange(opt.id)}
                    className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-600 bg-blue-50/70 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-semibold">{opt.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.sub}</div>
                  </button>
                );
              })}
            </div>

            {!fiveTierEligible ? (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-sm text-amber-950">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>2008년생 고3은 5등급제 제외 대상</strong>입니다. 내신은 9등급제(1~9등급)를 입력하며, 모의고사 항목에서 <strong>수능</strong>까지 선택할 수 있습니다.
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 flex items-start gap-2.5 text-sm text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>{birthYear}년생 5등급제 적용 대상</strong>입니다. 아래에서 확인할 학기와 시험을 하나씩 골라 성적을 입력하세요.
                </span>
              </div>
            )}
          </section>

          <hr className="border-slate-200" />

          {/* 3-A. 내신: 1학기/2학기 하나 고르고 + 중간고사/기말고사 하나 골라서 입력 */}
          <section className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  03-A. 내신 시험 선택 및 성적 입력 ({gradeYear}학년)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  먼저 <strong>1학기 / 2학기</strong> 중 하나를 고르고, <strong>중간고사 / 기말고사</strong> 중 하나를 고른 뒤 그 시험의 과목별 등급을 입력하세요.
                </p>
              </div>

              <div className="bg-white border border-blue-200 rounded-lg px-4 py-2 text-xs font-mono-num shrink-0">
                <span className="text-slate-600">{getBasisLabel(activeBasis)} 평균 </span>
                <strong className="text-base text-blue-700">
                  {activeNaesinAvg.toFixed(2)}등급
                </strong>
              </div>
            </div>

            {/* 2-step selector: 학기 1개 선택 + 시험 1개 선택 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-xl p-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  1) 학기 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['1학기', '2학기'] as SemesterType[]).map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSelectedSemester(sem)}
                      className={`py-2.5 px-3 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selectedSemester === sem
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  2) 시험 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'midterm', label: '중간고사' },
                      { id: 'final', label: '기말고사' },
                    ] as { id: ExamPeriodKind; label: string }[]
                  ).map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => setSelectedExam(ex.id)}
                      className={`py-2.5 px-3 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selectedExam === ex.id
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 선택된 (학기 + 시험) 과목 목록 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-sm font-bold text-slate-900">
                  {getBasisLabel(activeBasis)} 과목별 등급 입력 ({activeSubjects.length}과목)
                </span>
                <span className="text-xs text-slate-500">
                  {fiveTierEligible ? '5등급제 (1~5등급)' : '9등급제 (1~9등급)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {activeSubjects.map((subj) => {
                  const val =
                    selectedExam === 'midterm'
                      ? subj.midtermGrade
                      : subj.finalGrade;
                  return (
                    <div
                      key={subj.id}
                      className="flex items-center justify-between gap-2 bg-slate-50/70 border border-slate-200 rounded-lg px-3 py-2"
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
                            updateActiveSubjectGrade(
                              subj.id,
                              Number(e.target.value)
                            )
                          }
                          className="h-8 px-2 text-xs font-semibold font-mono-num bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          {Array.from(
                            { length: maxGradeScale },
                            (_, i) => i + 1
                          ).map((g) => (
                            <option key={g} value={g}>
                              {g}등급
                            </option>
                          ))}
                        </select>
                        {subj.isElective && (
                          <button
                            type="button"
                            onClick={() => removeSubjectRow(subj.id)}
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
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong>{hiddenFinalOnlyNames.join(', ')}</strong> 과목은{' '}
                  <strong>{selectedSemester} 기말고사만 시행</strong>하므로 중간고사 목록에서 제외되며, 기말고사를 선택하면 입력·반영됩니다.
                </div>
              )}

              {/* 현재 선택한 학기에 선택과목 추가 */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubjectRow();
                    }
                  }}
                  placeholder={`${selectedSemester}에 추가할 선택과목명 입력 (예: 미적분, 물리학, 경제)`}
                  className="flex-1 h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={newSubjectSchedule}
                  onChange={(e) =>
                    setNewSubjectSchedule(e.target.value as 'both' | 'finalOnly')
                  }
                  className="h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-lg"
                >
                  <option value="both">중간·기말 모두</option>
                  <option value="finalOnly">기말고사만 시행</option>
                </select>
                <select
                  value={newSubjectGrade}
                  onChange={(e) => setNewSubjectGrade(Number(e.target.value))}
                  className="h-9 px-2.5 text-xs font-mono-num bg-white border border-slate-300 rounded-lg"
                >
                  {Array.from({ length: maxGradeScale }, (_, i) => i + 1).map(
                    (g) => (
                      <option key={g} value={g}>
                        {g}등급
                      </option>
                    )
                  )}
                </select>
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="h-9 px-4 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 whitespace-nowrap cursor-pointer"
                >
                  {selectedSemester} 과목 추가
                </button>
              </div>
            </div>

            {fiveTierEligible && (
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                <span className="font-medium text-slate-600">동일 등급 내 석차 위치:</span>
                {(
                  [
                    { id: 'upper', label: '상위권' },
                    { id: 'middle', label: '중위권' },
                    { id: 'lower', label: '하위권' },
                  ] as { id: TierPosition; label: string }[]
                ).map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setTierPosition(pos.id)}
                    className={`px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer ${
                      tierPosition === pos.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 3-B. 모의고사 / 수능 시험 선택 및 성적 입력 */}
          <section className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  03-B. 모의고사 시험 선택 및 등급 입력 ({gradeYear === 3 ? '3·6·9·10모 + 수능' : '3·6·9·10모'})
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  본 시험 중 하나를 선택한 뒤 국어·수학·영어·사회·과학·한국사 등급을 입력하세요.
                  {gradeYear !== 3 && ' (수능은 고3 선택 시 활성화됩니다)'}
                </p>
              </div>
              <div className="text-xs text-slate-600 font-mono-num shrink-0">
                {selectedMockExam} 국수영탐 평균{' '}
                <strong className="text-emerald-700 text-sm">
                  {activeMockCoreAvg.toFixed(2)}등급
                </strong>
              </div>
            </div>

            {/* 모의고사 시험 선택 버튼 */}
            <div className="flex flex-wrap gap-2">
              {availableMockExams.map((m) => {
                const active = selectedMockExam === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMockExam(m.id)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m.fullLabel}
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-xs font-semibold text-emerald-800">
                선택한 시험: {getMockExamLabel(selectedMockExam)}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {(
                  [
                    { key: 'korean', label: '국어' },
                    { key: 'math', label: '수학' },
                    { key: 'english', label: '영어' },
                    { key: 'social', label: '사회 (탐구)' },
                    { key: 'science', label: '과학 (탐구)' },
                    { key: 'history', label: '한국사' },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="bg-slate-50/70 border border-slate-200 rounded-lg p-3"
                  >
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      {item.label}
                    </label>
                    <select
                      value={activeMockGrades[item.key]}
                      onChange={(e) =>
                        updateActiveMockSubject(item.key, Number(e.target.value))
                      }
                      className="w-full h-9 px-2 text-sm font-semibold font-mono-num bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                        <option key={g} value={g}>
                          {g}등급
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. 희망 계열 & 관심 선택과목 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              04. 희망 계열 및 공부법 조회할 선택과목
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {TRACKS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrack(t)}
                  className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    track === t
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customElective}
                  onChange={(e) => setCustomElective(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addElective(customElective);
                    }
                  }}
                  placeholder="공부법이나 세특을 보고 싶은 선택과목을 입력하세요 (예: 미적분, 정치와 법)"
                  className="w-full h-10 pl-10 pr-3.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={() => addElective(customElective)}
                className="px-4 h-10 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                과목 추가
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_ELECTIVES.map((subj) => {
                const selected = electives.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleQuickElective(subj)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

            {electives.length > 0 && (
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-700">선택됨:</span>
                {electives.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleQuickElective(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer"
                  >
                    <span>{item}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">
              선택한 <strong>{getBasisLabel(activeBasis)}</strong> 및{' '}
              <strong>{getMockExamLabel(selectedMockExam)}</strong> 기준으로 환산 결과와 대학 추천을 바로 확인합니다.
            </p>
            <button
              type="submit"
              className="h-12 px-7 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>선택한 성적으로 환산 및 대학 확인</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
