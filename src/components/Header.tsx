import React from 'react';

export type ActiveTab = 'converter' | 'universities' | 'pastexams' | 'saengibu' | 'study';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onEditProfile: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'converter', label: '등급 환산·석차' },
  { id: 'universities', label: '대학·학과 추천' },
  { id: 'pastexams', label: '기출·요약노트' },
  { id: 'saengibu', label: '생기부·세특' },
  { id: 'study', label: '선택과목·공부법' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onEditProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onSelectTab('converter')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          대입 나침반
        </button>

        <nav className="flex items-center gap-4 sm:gap-7 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`py-2 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onEditProfile}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            학생 정보 수정
          </button>
        </div>
      </div>
    </header>
  );
};
