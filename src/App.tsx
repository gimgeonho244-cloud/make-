import { useMemo, useState } from 'react';
import { EntryGate } from './components/EntryGate';
import { GradeConverterSection } from './components/GradeConverterSection';
import { ActiveTab, Header } from './components/Header';
import { PastExamsSection } from './components/PastExamsSection';
import { SaengibuSection } from './components/SaengibuSection';
import { SubjectsStudySection } from './components/SubjectsStudySection';
import { UniversityExplorer } from './components/UniversityExplorer';
import {
  calculateRanksFromPercentile,
  getSchoolClassRoster,
} from './data/highSchools';
import { MockExamPeriod, StudentProfile } from './types/admission';
import {
  convertFiveToNine,
  getBasisLabel,
  getDefaultGrade1Subjects,
  getDefaultMockExams,
} from './utils/gradeConverter';

const STORAGE_KEY = 'admission_compass_student_profile_v5';

function loadSavedProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentProfile;
    if (
      !parsed.subjectGrades ||
      parsed.subjectGrades.length === 0 ||
      parsed.subjectGrades[0]?.midtermGrade === undefined ||
      parsed.subjectGrades[0]?.finalGrade === undefined ||
      !parsed.mockGrades ||
      parsed.mockGrades.history === undefined ||
      !parsed.selectedMockExam ||
      !parsed.mockExams ||
      !parsed.naesinBasis
    ) {
      return null;
    }
    parsed.subjectGrades = parsed.subjectGrades.map((s) => {
      if (
        !s.examSchedule &&
        (s.id === 'g1-info' ||
          s.id === 'g1-ai' ||
          s.name === '정보' ||
          s.name.includes('인기초'))
      ) {
        return {
          ...s,
          examSchedule: 'finalOnly',
          subLabel: `${parsed.gradeYear}학년 ${s.semester} · 기말만 시행`,
        };
      }
      return s;
    });
    return parsed;
  } catch {
    return null;
  }
}

export default function App() {
  const [savedProfile, setSavedProfile] = useState<StudentProfile | null>(() =>
    loadSavedProfile()
  );
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('converter');

  const handleEnter = (profile: StudentProfile) => {
    const normalized: StudentProfile = {
      ...profile,
      naesinBasis:
        profile.naesinBasis === 'overall' ? 'sem1Mid' : profile.naesinBasis,
      selectedMockExam: profile.selectedMockExam ?? '3모',
      mockExams:
        profile.mockExams ?? getDefaultMockExams(profile.mockGrades),
      subjectGrades:
        profile.subjectGrades.length > 0
          ? profile.subjectGrades
          : getDefaultGrade1Subjects(2),
    };
    setSavedProfile(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // ignore storage errors
    }
    setHasEntered(true);
    setActiveTab('converter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = (patch: Partial<StudentProfile>) => {
    if (!savedProfile) return;
    const updated = { ...savedProfile, ...patch };
    setSavedProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const handleChangeMockExam = (period: MockExamPeriod) => {
    if (!savedProfile) return;
    const nextMock =
      savedProfile.mockExams?.[period] ?? savedProfile.mockGrades;
    handleUpdateProfile({
      selectedMockExam: period,
      mockGrades: { ...nextMock },
    });
  };

  const conversion = useMemo(() => {
    if (!savedProfile) return null;
    const fallback = savedProfile.isFiveTierEligible
      ? savedProfile.fiveTierGrade
      : savedProfile.nineTierDirectGrade;
    return convertFiveToNine(
      savedProfile.subjectGrades,
      savedProfile.naesinBasis ?? 'sem1Mid',
      savedProfile.tierPosition,
      savedProfile.mockGrades,
      savedProfile.isFiveTierEligible,
      fallback
    );
  }, [savedProfile]);

  const rosterAndRanks = useMemo(() => {
    if (!savedProfile || !conversion) return null;
    const roster = getSchoolClassRoster(
      savedProfile.schoolName,
      savedProfile.highSchoolType,
      savedProfile.gradeYear,
      savedProfile.classNum,
      savedProfile.customGradeTotalStudents,
      savedProfile.customClassTotalStudents
    );
    const ranks = calculateRanksFromPercentile(
      conversion.naesin.estimatedPercentileTop,
      roster.gradeTotalStudents,
      roster.selectedClassStudents,
      savedProfile.isFiveTierEligible
    );
    return { roster, ranks };
  }, [savedProfile, conversion]);

  if (!hasEntered || !savedProfile || !conversion || !rosterAndRanks) {
    return <EntryGate initialProfile={savedProfile} onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEditProfile={() => {
          setHasEntered(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Student Identity & Selected Naesin Exam + Selected Mock Exam Summary Strip */}
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-bold text-slate-900">
              {savedProfile.schoolName} ({savedProfile.highSchoolType}){' '}
              {savedProfile.gradeYear}학년 {savedProfile.classNum}반{' '}
              {savedProfile.studentNum}번 {savedProfile.name}
            </span>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <span className="text-slate-600">
              {savedProfile.birthYear}년생 (
              {savedProfile.isFiveTierEligible
                ? '5등급제 적용 대상'
                : '2008년생 고3 · 5등급제 제외, 9등급제'}
              )
            </span>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <span className="font-medium text-blue-700">
              희망 계열: {savedProfile.track}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono-num shrink-0">
            <span className="text-slate-600">
              내신{' '}
              <strong className="text-slate-900">
                {getBasisLabel(savedProfile.naesinBasis)}
              </strong>{' '}
              <strong className="text-blue-700">
                {conversion.naesin.inputFiveTier.toFixed(2)}
              </strong>{' '}
              → 9등급{' '}
              <strong className="text-blue-700">
                {conversion.naesin.convertedNineTierMid.toFixed(2)}
              </strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <span className="text-slate-600">
              전교 약{' '}
              <strong className="text-slate-900">
                {rosterAndRanks.ranks.gradeRank}등
              </strong>
              /{rosterAndRanks.roster.gradeTotalStudents}명 ·{' '}
              {rosterAndRanks.roster.selectedClassNumber}반 약{' '}
              <strong className="text-slate-900">
                {rosterAndRanks.ranks.classRank}등
              </strong>
              /{rosterAndRanks.roster.selectedClassStudents}명
            </span>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <span className="text-slate-600">
              {savedProfile.selectedMockExam}{' '}
              <strong className="text-emerald-700">
                {conversion.mock.averageCoreFour.toFixed(2)}등급
              </strong>
            </span>
          </div>
        </div>

        {/* Active Workspace View */}
        {activeTab === 'converter' && (
          <GradeConverterSection
            profile={savedProfile}
            conversion={conversion}
            onUpdateProfile={handleUpdateProfile}
            onNavigateUniversities={(basis) => {
              if (basis) handleUpdateProfile({ naesinBasis: basis });
              setActiveTab('universities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'universities' && (
          <UniversityExplorer
            profile={savedProfile}
            conversion={conversion}
            onChangeBasis={(naesinBasis) => handleUpdateProfile({ naesinBasis })}
            onChangeMockExam={handleChangeMockExam}
          />
        )}

        {activeTab === 'pastexams' && (
          <PastExamsSection profile={savedProfile} />
        )}

        {activeTab === 'saengibu' && <SaengibuSection profile={savedProfile} />}

        {activeTab === 'study' && (
          <SubjectsStudySection
            profile={savedProfile}
            onUpdateElectives={(electives) => handleUpdateProfile({ electives })}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            고교학점제 5등급제 대입 나침반 · 전국 180개 대학 36,000개 학과 편제 및 2022 개정 교육과정 반영
          </span>
          <span>
            고교 진학 인원 및 입결은 공시·고교 유형 분포 모델 기준이며, 실제 지원 시 각 대학 최신 모집요강을 확인하세요.
          </span>
        </div>
      </footer>
    </div>
  );
}
