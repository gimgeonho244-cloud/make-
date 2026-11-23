import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Lightbulb,
  Square,
} from 'lucide-react';
import { InstructorSummaryNote } from '../types/admission';
import { DiagramBoard } from './DiagramBoard';

interface InstructorNotebookProps {
  note: InstructorSummaryNote;
}

export const InstructorNotebook: React.FC<InstructorNotebookProps> = ({
  note,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setCheckedItems({});
  }, [note.id]);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-[#FFFDF7] border border-slate-300 rounded-xl shadow-sm overflow-hidden">
      {/* Notebook Top Binding Strip */}
      <div className="bg-slate-100 border-b border-slate-300 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span className="font-bold text-slate-900">
            {note.schoolName} · {note.subjectName} 요약 노트북
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {note.semester} {note.examKind === 'midterm' ? '중간고사' : '기말고사'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-blue-700">
            {note.source === 'ai' ? 'AI 강사 맞춤 생성 노트' : '단원 핵심 요약 노트'}
          </span>
        </div>

        <div className="text-xs text-slate-600">
          시험 범위:{' '}
          <strong className="text-slate-900">{note.examScope}</strong>
          {note.difficultyFocus !== '전체' && (
            <span className="ml-2 text-blue-700 font-semibold">
              (난이도 {note.difficultyFocus} 집중)
            </span>
          )}
        </div>
      </div>

      {/* Ruled Notebook Canvas */}
      <div className="relative flex">
        {/* Left Margin Strip (Authentic Ruled Notebook Margin) */}
        <div
          aria-hidden="true"
          className="hidden sm:flex w-12 shrink-0 border-r-2 border-rose-200 flex-col items-center py-8 gap-10 bg-[#FAF6EC]"
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <span
              key={idx}
              className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 shadow-inner"
            />
          ))}
        </div>

        {/* Notebook Content Body */}
        <div
          className="flex-1 p-5 sm:p-8 space-y-7"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(148,163,184,0.16) 31px, rgba(148,163,184,0.16) 32px)',
          }}
        >
          {/* Instructor Briefing */}
          <div className="bg-white/95 border border-blue-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
              <Lightbulb className="w-4 h-4 text-blue-700" />
              <span>강사 도입 브리핑 · 이번 시험 범위 핵심 전략</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
              {note.instructorGreeting}
            </p>
          </div>

          {/* Visual Diagram Board */}
          <DiagramBoard diagram={note.diagram} />

          {/* Ruled Note Sections */}
          <div className="space-y-5">
            {note.sections.map((sec, idx) => (
              <div
                key={`${sec.heading}-${idx}`}
                className="bg-white/95 border border-slate-200 rounded-xl p-5 space-y-3"
              >
                <h4 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  {sec.heading}
                </h4>
                <ul className="space-y-2 text-sm text-slate-800 leading-relaxed list-disc pl-5">
                  {sec.bulletPoints.map((pt, bIdx) => (
                    <li key={bIdx}>{pt}</li>
                  ))}
                </ul>

                {sec.keyFormulaOrRule && (
                  <div className="px-4 py-2.5 rounded-lg bg-amber-50/90 border border-amber-200 font-mono-num text-xs sm:text-sm font-semibold text-amber-950">
                    핵심 공식 / 규칙: {sec.keyFormulaOrRule}
                  </div>
                )}

                <div className="px-4 py-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-blue-950">
                  <strong className="text-blue-800">강사 필기 팁: </strong>
                  {sec.instructorHighlight}
                </div>
              </div>
            ))}
          </div>

          {/* Exam Traps & 1-Min Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white/95 border border-amber-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>자주 틀리는 함정 · 감점 주의 포인트</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed list-disc pl-5">
                {note.examTraps.map((trap, idx) => (
                  <li key={idx}>{trap}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/95 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="text-sm font-bold text-slate-900">
                시험 직전 1분 체크리스트 (눌러서 체크)
              </div>
              <div className="space-y-2">
                {note.finalChecklist.map((item, idx) => {
                  const done = !!checkedItems[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCheck(idx)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 transition-colors cursor-pointer ${
                        done
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 line-through'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
