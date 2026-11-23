import React, { useEffect, useState } from 'react';
import { Check, CheckSquare, FileText, Lightbulb, Square } from 'lucide-react';
import {
  GRADE_ROADMAPS,
  SAENGIBU_AREA_GUIDES,
  SETEUK_EXAMPLES_BY_TRACK,
} from '../data/saengibuGuides';
import { StudentProfile, TrackType } from '../types/admission';

interface SaengibuSectionProps {
  profile: StudentProfile;
}

const TRACK_FILTERS: ('전체' | TrackType)[] = [
  '전체',
  '자연·공학',
  '의약학·생명',
  '상경·경영',
  '인문·사회',
  '교육·사범',
  '자율전공·통합',
];

export const SaengibuSection: React.FC<SaengibuSectionProps> = ({ profile }) => {
  const [selectedGrade, setSelectedGrade] = useState<1 | 2 | 3>(profile.gradeYear);
  const [topicTrackFilter, setTopicTrackFilter] = useState<'전체' | TrackType>(
    profile.track
  );
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('admission_compass_checked_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setSelectedGrade(profile.gradeYear);
    setTopicTrackFilter(profile.track);
  }, [profile.gradeYear, profile.track]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem('admission_compass_checked_tasks', JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  };

  const currentTasks = GRADE_ROADMAPS[selectedGrade];
  const completedCount = currentTasks.filter((t) => checkedIds.includes(t.id)).length;

  const filteredTopics =
    topicTrackFilter === '전체'
      ? SETEUK_EXAMPLES_BY_TRACK
      : SETEUK_EXAMPLES_BY_TRACK.filter((ex) => ex.track === topicTrackFilter);

  return (
    <div className="space-y-8">
      {/* 1. 현재 학년 수준에서 할 수 있는 일 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              현재 학년({selectedGrade}학년) 수준에서 지금 바로 할 일
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {profile.birthYear === '2008'
                ? '2008년생 고3(9등급제) 기준 마무리 및 원서 전략 점검 로드맵입니다.'
                : `${profile.birthYear}년생(5등급제 적용) 기준 내신·선택과목·생기부 핵심 실행 체크리스트입니다.`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {([1, 2, 3] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  고{g} 할 일
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-blue-700 font-mono-num whitespace-nowrap">
              완료 {completedCount}/{currentTasks.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
          {currentTasks.map((task) => {
            const done = checkedIds.includes(task.id);
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleCheck(task.id)}
                className={`w-full text-left p-4 sm:p-5 flex items-start gap-3.5 transition-colors cursor-pointer ${
                  done ? 'bg-slate-50/80' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5 text-blue-700 shrink-0">
                  {done ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">{task.phase}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        task.priority === '필수'
                          ? 'font-semibold text-slate-900'
                          : 'text-slate-500'
                      }
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div
                    className={`text-sm sm:text-base font-semibold ${
                      done ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {task.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 생기부·세특·창체·행특 상세 가이드 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            생기부(학교생활기록부) · 세특 · 학생부 항목별 상세 공략
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            5등급제에서는 상위 10%가 모두 1등급을 받기 때문에, 대학 서류평가에서 세특과 창체의 구체적인 탐구 깊이가 사실상 당락을 결정합니다.
          </p>
        </div>

        <div className="space-y-5">
          {SAENGIBU_AREA_GUIDES.map((guide) => (
            <div
              key={guide.area}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-700 shrink-0" />
                  <h3 className="text-lg font-bold text-slate-900">{guide.area}</h3>
                </div>
                <span className="text-xs font-semibold text-blue-700">
                  {guide.weight}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {guide.summary}
              </p>

              <ul className="space-y-2 text-sm text-slate-700">
                {guide.keyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <div className="text-xs font-bold text-emerald-800">
                    좋은 학생부 기록 예시 (탐구 과정과 후속 확장 포함)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {guide.goodExample}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-600">
                    아쉬운 학생부 기록 예시 (단순 나열 · 추상적 칭찬)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {guide.weakExample}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 계열별 세특 탐구 주제 아카이브 */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              계열별 고득점 세특 탐구 주제 설계 예시
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              교과서 개념을 실제 사회·과학 문제로 확장하는 탐구 설계 흐름을 참고해 나만의 주제로 변형해 보세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TRACK_FILTERS.map((tr) => (
              <button
                key={tr}
                type="button"
                onClick={() => setTopicTrackFilter(tr)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                  topicTrackFilter === tr
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((item) => (
            <div
              key={item.topic}
              className="p-5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-700">{item.track}</span>
                <span aria-hidden="true">·</span>
                <span>{item.subject}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.topic}
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-slate-900">탐구 흐름: </strong>
                {item.flow}
              </div>
              <div className="p-3 rounded-md bg-white border border-slate-200 flex items-start gap-2 text-xs text-slate-700">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">세특 어필 팁: </strong>
                  {item.teacherAppealTip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
