import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle2, Search } from 'lucide-react';
import {
  ALL_SUBJECT_BLUEPRINT,
  REAL_UNIV_ELECTIVE_MATRIX,
  SENIOR_ADVICES,
  SUBJECT_STUDY_GUIDES,
  findOrGenerateSubjectGuide,
} from '../data/subjectsAndStudy';
import { StudentProfile } from '../types/admission';

interface SubjectsStudySectionProps {
  profile: StudentProfile;
  onUpdateElectives: (electives: string[]) => void;
}

export const SubjectsStudySection: React.FC<SubjectsStudySectionProps> = ({
  profile,
  onUpdateElectives,
}) => {
  const [subjectInput, setSubjectInput] = useState<string>(
    profile.electives[0] ?? '미적분'
  );
  const [activeSubjectQuery, setActiveSubjectQuery] = useState<string>(
    profile.electives[0] ?? '미적분'
  );
  const [univFilter, setUnivFilter] = useState<string>('전체');

  const activeGuide = findOrGenerateSubjectGuide(activeSubjectQuery || '미적분');

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = subjectInput.trim();
    if (!cleaned) return;
    setActiveSubjectQuery(cleaned);
    if (!profile.electives.includes(cleaned)) {
      onUpdateElectives([...profile.electives, cleaned]);
    }
  };

  const handleQuickSelect = (name: string) => {
    setSubjectInput(name);
    setActiveSubjectQuery(name);
  };

  const filteredUnivMatrix =
    univFilter === '전체'
      ? REAL_UNIV_ELECTIVE_MATRIX
      : REAL_UNIV_ELECTIVE_MATRIX.filter((r) => r.track.includes(univFilter));

  return (
    <div className="space-y-8">
      {/* 1. 선택과목 입력창 & 과목별 맞춤 공부법 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            선택과목 입력 및 과목별 집중 공부법 안내
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            공부법을 알고 싶은 선택과목을 직접 입력하거나 아래 과목을 클릭하면, 개념·기출·내신 서술형·수능 대비 전략까지 즉시 안내합니다.
          </p>
        </div>

        <form onSubmit={handleSubjectSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="선택과목명을 입력하세요 (예: 미적분, 확률과 통계, 물리학, 정치와 법, 인공지능 기초...)"
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            과목 공부법 조회 및 추가
          </button>
        </form>

        {/* 내 선택과목 + 전체 과목 빠른 선택 */}
        <div className="space-y-2.5">
          {profile.electives.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-blue-700 mr-1">
                내가 선택한 과목:
              </span>
              {profile.electives.map((el) => (
                <button
                  key={el}
                  type="button"
                  onClick={() => handleQuickSelect(el)}
                  className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                    activeSubjectQuery === el
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  {el}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1">
              주요 교과 선택과목:
            </span>
            {SUBJECT_STUDY_GUIDES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleQuickSelect(g.name)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  activeSubjectQuery === g.name
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Subject Study Guide Card */}
        <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-700">
                  {activeGuide.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeGuide.courseType}</span>
                <span aria-hidden="true">·</span>
                <span>체감 난이도 {activeGuide.difficulty}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {activeGuide.name} 고득점 학습 전략
              </h3>
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">주요 활용 대학: </span>
              {activeGuide.recommendedForUnivs.join(', ')}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {activeGuide.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-blue-700">
                01. 개념 정복 및 이해법
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeGuide.conceptStrategy}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-blue-700">
                02. 기출 · 문제풀이 훈련법
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeGuide.practiceStrategy}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">
                03. 5등급제 내신 서술형 · 수행평가 팁
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeGuide.schoolExamTip}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">
                04. 수능 최저 · 통합수능 대비 포인트
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeGuide.csatTip}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950">
            <strong>학생들이 가장 많이 틀리는 함정: </strong>
            {activeGuide.commonMistake}
          </div>
        </div>
      </section>

      {/* 2. 전과목 공부법 로드맵 */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              전과목 균형 학습법 (국어 · 수학 · 영어 · 탐구 · 한국사/수행)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              특정 과목만 편식하지 않고 전 과목 내신 1~2등급과 수능 최저를 동시에 지키는 매일 루틴입니다.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 whitespace-nowrap">영역</th>
                <th className="py-3 px-4">핵심 본질</th>
                <th className="py-3 px-4">평소 데일리 루틴</th>
                <th className="py-3 px-4">시험 2~3주 전 내신 전략</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {ALL_SUBJECT_BLUEPRINT.map((row) => (
                <tr key={row.subject} className="hover:bg-slate-50/70 align-top">
                  <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.subject}
                  </td>
                  <td className="py-4 px-4 text-slate-700">{row.keyFocus}</td>
                  <td className="py-4 px-4 text-slate-600 leading-relaxed">
                    {row.dailyRoutine}
                  </td>
                  <td className="py-4 px-4 text-slate-600 leading-relaxed">
                    {row.examPeriodStrategy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. 공부 잘한 선배 조언 & 실제 대학 선택과목 추천 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              실제 명문대 합격 선배들의 현실 공부 조언 & 선택과목 추천
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              서울대·연세대·고려대·한양대 합격 선배들이 실제로 실천했던 시간 관리법과 후배들에게 추천하는 선택과목 조합입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {SENIOR_ADVICES.map((senior) => (
            <div
              key={senior.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="text-xs text-slate-500">
                    {senior.university} {senior.major} · {senior.admissionType}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {senior.authorAlias}
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-700 font-mono-num">
                  {senior.gradeSummary}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                "{senior.title}"
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed">
                {senior.adviceBody}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-slate-800">
                  합격 선배의 핵심 공부 습관
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                  {senior.coreHabits.map((habit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-1" />
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900">선배가 추천하는 이 대학·학과 선택과목: </strong>
                {senior.recommendedElectives.join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 실제 대학별 전공연계 권장과목 매트릭스 */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              실제 주요 대학 전공연계 권장과목(선택과목) 추천표
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              서울대·연세대·고려대·성균관대·한양대 등이 공식 입학처 안내에서 강조하는 핵심·일반 권장과목입니다.
            </p>
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-lg self-start">
            {['전체', '자연·공학', '의약학·생명', '상경', '인문'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setUnivFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  univFilter === f
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 whitespace-nowrap">대학명</th>
                <th className="py-3 px-4 whitespace-nowrap">모집단위</th>
                <th className="py-3 px-4 whitespace-nowrap">핵심 권장과목</th>
                <th className="py-3 px-4 whitespace-nowrap">일반 권장과목</th>
                <th className="py-3 px-4">입시 유의사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredUnivMatrix.map((row) => (
                <tr
                  key={`${row.university}-${row.department}`}
                  className="hover:bg-slate-50/70"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.university}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 whitespace-nowrap">
                    {row.department}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-700">
                    {row.coreElectives.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.recommendedElectives.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
