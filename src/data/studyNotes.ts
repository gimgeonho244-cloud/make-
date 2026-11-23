import {
  ExamPeriodKind,
  InstructorSummaryNote,
  QuestionDifficulty,
  SemesterType,
} from '../types/admission';

function normalizeNoteCategory(subjectName: string): string {
  if (subjectName.includes('언어')) return '언어와 매체';
  if (subjectName.includes('국어') || subjectName.includes('문학') || subjectName.includes('독서')) {
    return '공통국어';
  }
  if (subjectName.includes('미적분')) return '미적분';
  if (subjectName.includes('확률') || subjectName.includes('통계')) return '확률과 통계';
  if (subjectName.includes('기하')) return '기하';
  if (subjectName.includes('수학') || subjectName.includes('대수')) return '수학';
  if (subjectName.includes('영어')) return '영어';
  if (subjectName.includes('인기초') || subjectName.includes('인공지능')) return '인기초';
  if (subjectName.includes('정보')) return '정보';
  if (subjectName.includes('한국사')) return '한국사';
  if (subjectName.includes('통합사회') || subjectName.includes('경제') || subjectName.includes('정치') || subjectName.includes('사회')) {
    return '통합사회';
  }
  if (subjectName.includes('물리')) return '물리학';
  if (subjectName.includes('화학') || subjectName.includes('생명') || subjectName.includes('지구') || subjectName.includes('과학')) {
    return '통합과학';
  }
  return '일반';
}

const BASELINE_NOTES: Record<string, Omit<InstructorSummaryNote, 'id' | 'schoolName' | 'subjectName' | 'semester' | 'examKind' | 'examScope' | 'difficultyFocus' | 'source'>> = {
  공통국어: {
    instructorGreeting:
      '국어 내신은 지문을 단순히 읽는 것이 아니라, 음운 변동 규칙과 화자의 정서 변화를 공식처럼 구조화해 두는 것이 핵심입니다. 아래 도해 그림에서 조건별 적용 순서를 먼저 눈으로 익혀 보세요.',
    diagram: {
      visualType: 'processFlow',
      title: '음운 변동 적용 3단계 판별 흐름도',
      caption: '표준 발음 문제에서 학생들이 가장 많이 헷갈리는 교체·탈락·첨가 순서를 정리했습니다.',
      keyEquation: '음절 끝소리(교체) → ㄴ첨가 → 비음화/유음화(교체)',
      nodes: [
        {
          id: 'n1',
          label: '1단계: 음절 끝소리·자음군 단순화',
          sublabel: 'ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ',
          detail: '받침에 7개 대표음 외의 자음이나 겹받침이 오면 먼저 7개 중 하나로 정리합니다. (예: 꽃 → [꼳])',
          role: 'core',
        },
        {
          id: 'n2',
          label: '2단계: ㄴ첨가 여부 확인',
          sublabel: '자음 받침 + 이/야/여/요/유',
          detail: '합성어·파생어에서 앞말이 자음으로 끝나고 뒷말이 모음 ㅣ나 반모음 j로 시작하면 ㄴ이 첨가됩니다. (예: 꽃잎 → 꼳닙)',
          role: 'primary',
        },
        {
          id: 'n3',
          label: '3단계: 인접 자음 동화(비음·유음화)',
          sublabel: '꼳닙 → [꼰닙] / 물약 → [물략]',
          detail: '첨가된 ㄴ이 앞 받침을 비음으로 바꾸면 비음화([꼰닙]), 앞 받침 ㄹ과 만나면 유음화([물략])가 일어납니다.',
          role: 'secondary',
        },
        {
          id: 'n4',
          label: '함정 체크: 구개음화 vs ㄴ첨가',
          sublabel: '밭이[바치] vs 밭이랑[반니랑]',
          detail: '형식형태소 ‘이’ 앞에서는 구개음화([바치]), 실질형태소 ‘이랑’ 앞에서는 ㄴ첨가 후 비음화([반니랑])가 적용됩니다.',
          role: 'warning',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '합성·파생어 조건' },
        { from: 'n2', to: 'n3', label: '연쇄 변동' },
        { from: 'n3', to: 'n4', label: '빈출 함정' },
      ],
    },
    sections: [
      {
        heading: '1. 음운 변동 4대 유형과 연쇄 적용',
        bulletPoints: [
          '교체: 음절의 끝소리 규칙, 비음화(ㄱ·ㄷ·ㅂ → ㅇ·ㄴ·ㅁ), 유음화(ㄴ+ㄹ → ㄹ+ㄹ), 구개음화(ㄷ·ㅌ + 이 → ㅈ·ㅊ)',
          '탈락: 자음군 단순화(닭→[닥]), ㅎ탈락(좋아→[조아]), ㅡ탈락',
          '축약: 거센소리되기(ㄱ·ㄷ·ㅂ·ㅈ + ㅎ → ㅋ·ㅌ·ㅍ·ㅊ)',
          '첨가: ㄴ첨가(솜+이불→[솜니불]), 반모음 첨가',
        ],
        keyFormulaOrRule: '물약: [물약] → (ㄴ첨가) [물냑] → (유음화) [물략] (총 2회 변동)',
        instructorHighlight:
          '음운 개수가 줄었는지(+0 교체, -1 탈락/축약, +1 첨가) 먼저 세면 유형 문제 절반은 바로 풀립니다.',
      },
      {
        heading: '2. 현대시 화자의 정서·태도 분석 틀',
        bulletPoints: [
          '시적 상황(현실) → 화자의 반응(정서·태도) → 표현 기법(역설·반어·수미상관) 순서로 정리합니다.',
          '윤동주 「서시」「자화상」: 식민지 현실 속 부끄러움(자기 성찰) → 우물을 통한 내면 직시 → 극복 의지',
          '부정적 현실에 대한 비판이 있어도 직접적·공격적 풍자인지 내면적 성찰인지 반드시 구분하세요.',
        ],
        instructorHighlight:
          '선지에서 ‘직접적 공격’, ‘체념적 순응’ 같은 태도 형용사 1단어만 비틀어 오답을 만듭니다.',
      },
    ],
    examTraps: [
      '「밭이랑」을 구개음화로 착각하기 쉬우나 실질형태소 결합이므로 ㄴ첨가+비음화([반니랑])가 정답입니다.',
      '거센소리되기(축약)와 음절 끝소리 규칙(교체)을 같은 변동 횟수로 혼동하지 마세요.',
      '문학 선지에서 작품 전체 분위기에는 맞지만 해당 연(구절)의 근거가 없는 과잉 해석을 걸러내세요.',
    ],
    finalChecklist: [
      '비음화 vs 유음화 조건(ㄴ+ㄹ vs ㄱ·ㄷ·ㅂ+ㄴ·ㅁ) 구별 완료',
      '구개음화가 적용되는 형식형태소 ‘이/히’ 조건 확인',
      '시험 범위 현대시 작품별 핵심 시어(예: 우물, 별, 바람) 상징 정리',
      '서술형 답안 작성 시 지문 인과 관계 2요소 포함 여부 점검',
    ],
  },
  '언어와 매체': {
    instructorGreeting:
      '문법 단원은 암기량이 많아 보이지만 원리 지도 한 장으로 정리하면 예외가 거의 없습니다. 중세 국어와 안은문장 핵심 구분 도해를 먼저 머리에 그리세요.',
    diagram: {
      visualType: 'comparison',
      title: '15세기 중세 국어 주체 높임과 현대 국어 문장 구조 대비',
      caption: '자음/모음 어미 결합 조건과 안긴문장 생략 성분 판별 기준입니다.',
      keyEquation: '자음 어미 앞: -시-  |  모음 어미 앞: -샤-',
      nodes: [
        {
          id: 'n1',
          label: '중세 주체 높임 (-시-)',
          sublabel: '자음으로 시작하는 어미 앞',
          detail: '예: 오시니, 가시고처럼 뒤에 자음(ㄴ, ㄱ 등) 어미가 오면 현대와 같은 형태인 ‘-시-’를 씁니다.',
          role: 'primary',
        },
        {
          id: 'n2',
          label: '중세 주체 높임 (-샤-)',
          sublabel: '모음으로 시작하는 어미 앞',
          detail: '예: 가샤, 하샤대처럼 뒤에 모음 어미(-아/-어 등)가 오면 ‘-시-’가 ‘-샤-’로 교체됩니다.',
          role: 'core',
        },
        {
          id: 'n3',
          label: '관계 관형절 판별',
          sublabel: '수식 받는 체언 = 생략된 성분',
          detail: '“내가 어제 (책을) 산 [책]”처럼 관형절 내부에 수식하는 명사 성분이 빠져 있으면 관계 관형절입니다.',
          role: 'secondary',
        },
        {
          id: 'n4',
          label: '동격 관형절 주의',
          sublabel: '생략 성분 없음 (추상명사 수식)',
          detail: '“그가 합격했다는 소식”처럼 절 안에 빠진 성분이 없으면 관계 관형절이 아니라 동격 관형절입니다.',
          role: 'warning',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '음운 환경 교체' },
        { from: 'n3', to: 'n4', label: '성분 생략 유무' },
      ],
    },
    sections: [
      {
        heading: '1. 15세기 중세 국어 핵심 3대 높임법',
        bulletPoints: [
          '주체 높임: 선어말 어미 ‘-시-’(자음 어미 앞) / ‘-샤-’(모음 어미 앞)',
          '객체 높임: 선어말 어미 ‘-삽-/-잡-/-즛-’ (부사어·목적어가 높임 대상일 때)',
          '상대 높임: 선어말 어미 ‘-이-’(평서형 ‘-다’, 의문형 ‘-가/-고’)',
        ],
        keyFormulaOrRule: '판정 의문문(예/아니오) → -가 / 설명 의문문(의문사 포함) → -고',
        instructorHighlight:
          '객체 높임 선어말 어미가 현대 국어에는 사라지고 어휘(드리다, 뵙다)로만 남았다는 점이 단골 비교 문제입니다.',
      },
      {
        heading: '2. 안은문장의 종류 5가지 빠른 판별법',
        bulletPoints: [
          '명사절: -(으)ㅁ, -기 (문장에서 주어·목적어·부사어 역할)',
          '관형절: -(으)ㄴ, -는, -(으)ㄹ, -던 (체언 수식)',
          '부사절: -이, -게, -도록 (용언 수식)',
          '서술절: 표지 없이 [주어 + [주어 + 서술어]] 구조',
          '인용절: 직접 인용(“~”라고) / 간접 인용(~고)',
        ],
        instructorHighlight:
          '‘-기’가 붙은 명사절이 조사와 결합할 때 부사어인지 목적어인지 문장 전체 서술어를 보고 판별하세요.',
      },
    ],
    examTraps: [
      '중세 국어 객체 높임과 주체 높임의 대상을 거꾸로 연결하는 선지를 주의하세요.',
      '관계 관형절에서 생략된 성분이 주어인지 목적어인지 부사어인지 원문을 복원해 확인하세요.',
    ],
    finalChecklist: [
      '중세 국어 주체/객체/상대 높임 어미 형태 구분',
      '판정 의문문(-가) vs 설명 의문문(-고) 예문 확인',
      '안긴문장 5종의 전성 어미 표지 암기',
    ],
  },
  수학: {
    instructorGreeting:
      '공통수학과 대수는 식을 무작정 전개하기 전에 “차수”, “대칭축”, “등호 조건” 3가지를 그림으로 먼저 잡아야 킬러 문항까지 시간이 남습니다.',
    diagram: {
      visualType: 'coordinate',
      title: '제한된 구간 [0, 3]에서 이차함수 f(x) = x² - 2ax + 4a의 최솟값 경우 나누기',
      caption: '대칭축 x = a의 위치에 따라 최솟값이 결정되는 지점이 3가지로 나뉩니다.',
      keyEquation: '대칭축 x = a  |  구간 [0, 3] 기준 3영역 분할',
      axisLabels: { x: '대칭축 a 위치', y: 'f(x) 함수값' },
      nodes: [
        {
          id: 'n1',
          label: '영역 ① a < 0',
          sublabel: '최솟값 = f(0)',
          detail: '대칭축이 구간 왼쪽에 있으면 [0, 3]에서 증가 함수이므로 왼쪽 끝 x=0에서 최솟값을 가집니다.',
          role: 'secondary',
          x: 20,
          y: 35,
        },
        {
          id: 'n2',
          label: '영역 ② 0 ≤ a ≤ 3',
          sublabel: '최솟값 = f(a) = 꼭짓점',
          detail: '대칭축 x=a가 구간 안에 들어오면 꼭짓점 y좌표 -a² + 4a가 그대로 최솟값이 됩니다.',
          role: 'core',
          x: 50,
          y: 72,
        },
        {
          id: 'n3',
          label: '영역 ③ a > 3',
          sublabel: '최솟값 = f(3)',
          detail: '대칭축이 구간 오른쪽에 있으면 [0, 3]에서 감소 함수이므로 오른쪽 끝 x=3에서 최솟값을 가집니다.',
          role: 'secondary',
          x: 80,
          y: 38,
        },
        {
          id: 'n4',
          label: '검산 필수! 범위 일치 확인',
          sublabel: '구한 a가 해당 영역 안에 있는가?',
          detail: '방정식을 풀어 나온 a 값이 처음 가정한 영역(예: a < 0)에 속하지 않으면 반드시 버려야 합니다.',
          role: 'warning',
          x: 50,
          y: 22,
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: 'a=0 경계' },
        { from: 'n2', to: 'n3', label: 'a=3 경계' },
        { from: 'n2', to: 'n4', label: '모순 제거' },
      ],
    },
    sections: [
      {
        heading: '1. 다항식의 나머지 정리 핵심 공식',
        bulletPoints: [
          '일차식 (x - α)로 나눈 나머지: P(α) (나머지 정리)',
          '이차식 (x - α)(x - β)로 나눈 나머지: R(x) = ax + b 로 두고 연립방정식 풀이',
          '삼차식으로 나눌 때 R(x) = a(x - α)² + bx + c 꼴로 미지수 줄이기가 1등급 핵심입니다.',
        ],
        keyFormulaOrRule: 'P(x) = Q(x)·A(x) + R(x), (차수(R) < 차수(Q))',
        instructorHighlight:
          '삼차식 나눗셈에서 이차식 나눗셈 조건을 결합할 때, R(x)를 그 이차식으로 다시 나눈 나머지를 이용하면 연립이 10초 만에 끝납니다.',
      },
      {
        heading: '2. 산술평균 · 기하평균 절대부등식 서술형 체크',
        bulletPoints: [
          '전제 조건: 두 식 모두 양수(a > 0, b > 0)임을 반드시 먼저 확인하세요.',
          'a + b ≥ 2√(ab) 에서 곱이 일정하거나 역수 꼴 (x + k/x)이 되도록 전개 또는 변형합니다.',
          '등호 성립 조건(a = b)을 답안에 적지 않으면 서술형에서 2~3점 감점됩니다.',
        ],
        keyFormulaOrRule: '(x + 1/y)(y + 4/x) = 5 + xy + 4/(xy) ≥ 5 + 2√4 = 9',
        instructorHighlight:
          '각 괄호마다 따로 산술·기하 평균을 써서 곱하면 등호 조건이 충돌하는 경우가 많으니 반드시 먼저 전개한 뒤 적용하세요.',
      },
    ],
    examTraps: [
      '이차함수 대칭축 미지수 문제에서 가정한 범위(a < 0 등)에 맞지 않는 해를 버리지 않아 오답이 납니다.',
      '산술·기하 평균 문제에서 양수 조건과 등호 성립 조건(xy=2) 누락 시 서술형 부분 감점.',
      '판별식 문제에서 최고차항 계수가 0이 될 수 있는지(이차방정식 vs 방정식 표현) 꼭 확인하세요.',
    ],
    finalChecklist: [
      '나머지 정리 3차식 나누기 변형 유형 1문항 손으로 다시 풀기',
      '이차함수 제한 범위 최대·최소 축 위치 3분할 복습',
      '산술·기하 평균 전개 후 적용 + 등호 조건 적기 습관화',
      '계산 실수 방지를 위해 부호 반전(-2a) 재검산',
    ],
  },
  미적분: {
    instructorGreeting:
      '미적분은 극한 수렴 조건(등비수열 vs 등비급수 차이!)과 도함수·이계도함수의 부호 변화표를 그림으로 그려보면 실수를 90% 막을 수 있습니다.',
    diagram: {
      visualType: 'coordinate',
      title: '함수 f(x) = x·e^(-x) 의 증감 · 극댓값 · 변곡점 개형',
      caption: "f'(x)=0 지점(x=1)이 극대, f''(x)=0 지점(x=2)이 변곡점, x→∞ 점근선은 y=0입니다.",
      keyEquation: "f'(x) = (1-x)e^(-x)  |  f''(x) = (x-2)e^(-x)",
      axisLabels: { x: 'x 값', y: 'f(x)' },
      nodes: [
        {
          id: 'n1',
          label: '원점 통과 (0, 0)',
          sublabel: 'x < 0 일 때 감소(음수)',
          detail: 'x=0에서 함숫값은 0이고, x→-∞일 때 -∞로 발산합니다.',
          role: 'secondary',
          x: 22,
          y: 72,
        },
        {
          id: 'n2',
          label: '극댓점 (1, 1/e)',
          sublabel: "f'(1) = 0, 부호 + → -",
          detail: 'x=1 왼쪽에서는 증가(+), 오른쪽에서는 감소(-)하므로 극댓값 1/e을 가집니다.',
          role: 'core',
          x: 45,
          y: 25,
        },
        {
          id: 'n3',
          label: '변곡점 (2, 2/e²)',
          sublabel: "f''(2) = 0, 위로볼록→아래로볼록",
          detail: 'x=2를 경계로 이계도함수 부호가 -에서 +로 바뀌며 곡선의 볼록성이 전환됩니다.',
          role: 'primary',
          x: 68,
          y: 44,
        },
        {
          id: 'n4',
          label: '수평 점근선 y = 0',
          sublabel: 'x → ∞ 일 때 0⁺ 수렴',
          detail: '지수함수 e^x의 증가 속도가 다항함수 x보다 훨씬 빠르므로 양의 방향에서 0으로 다가갑니다.',
          role: 'warning',
          x: 86,
          y: 62,
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '증가 구간' },
        { from: 'n2', to: 'n3', label: '위로 볼록 감소' },
        { from: 'n3', to: 'n4', label: '아래로 볼록 감소' },
      ],
    },
    sections: [
      {
        heading: '1. 등비수열의 극한 vs 등비급수 수렴 조건',
        bulletPoints: [
          '등비수열 rⁿ 수렴 조건: -1 < r ≤ 1 (r = 1 포함 주의!)',
          '등비급수 ∑arⁿ⁻¹ 수렴 조건: 첫째항 a = 0 이거나 -1 < r < 1 (r = 1 제외!)',
          '수렴할 때 등비급수의 합: S = a / (1 - r)',
        ],
        keyFormulaOrRule: '수열 수렴: -1 < r ≤ 1   vs   급수 수렴: -1 < r < 1 (또는 a=0)',
        instructorHighlight:
          '등비급수 수렴 조건 문제에서 r = 1을 포함시켜 틀리는 경우가 매우 많으니 등호 유무를 무조건 표시하세요.',
      },
      {
        heading: '2. 몫의 미분법 · 합성함수 미분법과 변곡점',
        bulletPoints: [
          '극대·극소: f\'(x) = 0 이고 좌우에서 도함수 부호가 바뀔 때 성립',
          '변곡점: f\'\'(x) = 0 이고 좌우에서 이계도함수 부호가 바뀔 때 성립',
          '점근선: lim(x→∞) 및 분모=0 지점을 반드시 확인해야 그래프 개형이 완성됩니다.',
        ],
        instructorHighlight:
          'e^x 는 항상 양수(>0)이므로 도함수·이계도함수 부호 판별 시 다항식 부분의 부호만 보면 계산이 훨씬 빨라집니다.',
      },
    ],
    examTraps: [
      '등비급수 수렴 조건에서 첫째항이 0이 되는 경우를 빠뜨리거나 r=1을 포함하는 실수.',
      'f\'(a)=0 이지만 좌우 부호 변화가 없는 삼중근 지점을 극값으로 잘못 판정하는 함정.',
    ],
    finalChecklist: [
      '등비수열(-1<r≤1) vs 등비급수(-1<r<1) 경계값 비교 완료',
      'ln x, e^x, 삼각함수 기본 도함수 공식 확인',
      '극대·극소·변곡점 부호 변화 판정 서술 연습',
    ],
  },
  영어: {
    instructorGreeting:
      '영어 내신은 지문을 통째로 외우는 것이 아니라 문장 구조(준동사·관계사·강조구문)와 논리 연결어 흐름을 지도처럼 파악해야 변형 문제에 흔들리지 않습니다.',
    diagram: {
      visualType: 'conceptMap',
      title: '내신 고득점 3대 필수 구문 · 어법 핵심 구조도',
      caption: '어법 밑줄형과 조건부 서술형 영작에서 매년 반복 출제되는 문법 포인트를 연결했습니다.',
      keyEquation: '분사구문(능동 -ing / 수동 p.p.) · 관계사 · It is [강조] that ~',
      nodes: [
        {
          id: 'n1',
          label: '내신 영문 핵심 뼈대',
          sublabel: '주어(S) + 동사(V) 수 일치 먼저 찾기',
          detail: '수식어구(전치사구, 분사구문)를 괄호로 묶어 진짜 주어와 본동사를 먼저 찾아야 문법 함정이 보입니다.',
          role: 'core',
        },
        {
          id: 'n2',
          label: '분사 vs 본동사 함정',
          sublabel: '접속사 개수 = 동사 개수 - 1',
          detail: '문장에 접속사가 없는데 동사가 2개 나오면 하나는 반드시 분사(-ing/p.p.)나 to부정사로 바꿔야 합니다.',
          role: 'primary',
        },
        {
          id: 'n3',
          label: '동명사 목적어 동사',
          sublabel: 'recommend / mind / enjoy / avoid + -ing',
          detail: 'recommend, suggest, enjoy, finish, avoid 뒤에는 to부정사가 아니라 반드시 동명사(-ing)가 옵니다.',
          role: 'warning',
        },
        {
          id: 'n4',
          label: 'It ~ that 강조구문',
          sublabel: 'It is [강조어구] that [나머지 문장]',
          detail: '강조할 명사/부사구를 It is와 that 사이에 넣고, that 뒤 동사의 수 일치는 강조된 주어에 맞춥니다.',
          role: 'secondary',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '문장 성분 분석' },
        { from: 'n1', to: 'n3', label: '목적어 형태' },
        { from: 'n1', to: 'n4', label: '서술형 조건 영작' },
      ],
    },
    sections: [
      {
        heading: '1. 어법성 판단 3초 체크 루틴',
        bulletPoints: [
          '동사 밑줄: 주어와의 수 일치 + 능동/수동 태 + 시제(과거 vs 현재완료)',
          '준동사 밑줄: 본동사가 이미 있는지 확인(접속사 없으면 준동사) + 의미상 주어와의 능/수동',
          '관계대명사 vs 관계부사: 뒷문장이 완전하면 where/when/that(접속사), 불완전하면 which/who/what',
        ],
        keyFormulaOrRule: 'what = 선행사 포함 + 뒷문장 불완전  |  which = 선행사 있음 + 뒷문장 불완전',
        instructorHighlight:
          'which 앞에 콤마(,)가 있을 때는 앞 문장 전체를 선행사로 받아 단수 동사가 오는지 꼭 확인하세요.',
      },
      {
        heading: '2. 빈칸 추론 & 서술형 조건 영작',
        bulletPoints: [
          '빈칸 추론: 빈칸 앞뒤의 역접(Instead, However)과 재진술(In other words) 신호어를 표시하세요.',
          '조건 영작: 조건의 시제(현재/과거), 수 일치(단수 -s), 분사 형태 변형을 마지막에 1번 더 점검하세요.',
        ],
        instructorHighlight:
          '서술형에서 제시어 어형을 그대로 베끼지 말고 문맥에 맞게 단·복수와 -ing/-ed를 반드시 변형하세요.',
      },
    ],
    examTraps: [
      'recommend + to부정사(X) → 동명사(-ing) 또는 recommend that S (should) V.',
      '접속사 없는 분사구문 자리에서 주절 주어가 사물인지 사람인지 확인하지 않고 -ing를 고르는 실수.',
    ],
    finalChecklist: [
      '지문 속 동명사/to부정사 전용 동사 목록 1회 점검',
      'It ~ that 강조구문 vs 가주어-진주어 구별법 확인',
      '시험 범위 내신 지문 핵심 주제문 영문 키워드 암기',
    ],
  },
  정보: {
    instructorGreeting:
      '정보(1학기 기말고사 전용)는 진법 변환 계산 실수만 줄이고 파이썬 반복문 추적 표를 직접 그리면서 풀면 1등급이 가장 안정적인 과목입니다!',
    diagram: {
      visualType: 'comparison',
      title: '순차 탐색 vs 이진 탐색 성능 및 동작 구조 비교',
      caption: '1,024개 데이터 탐색 시 최악 비교 횟수가 1,024회 vs 11회로 극명하게 갈립니다.',
      keyEquation: '순차 탐색: O(N)   vs   이진 탐색: O(log₂N) (정렬 필수)',
      nodes: [
        {
          id: 'n1',
          label: '순차 탐색 (Linear Search)',
          sublabel: '처음부터 끝까지 하나씩 비교',
          detail: '데이터가 정렬되어 있지 않아도 바로 쓸 수 있지만, N=1,024일 때 최악 1,024번 비교합니다.',
          role: 'secondary',
        },
        {
          id: 'n2',
          label: '이진 탐색 (Binary Search)',
          sublabel: '중간값(mid) 기준 절반씩 버림',
          detail: '매 단계마다 탐색 범위가 1/2로 줄어 1,024개에서도 약 10~11회 만에 값을 찾거나 없음을 확인합니다.',
          role: 'core',
        },
        {
          id: 'n3',
          label: '절대 필수 전제: 정렬(Sorting)',
          sublabel: '오름차순 / 내림차순 정렬 선행',
          detail: '중간값보다 크면 오른쪽, 작으면 왼쪽을 버려야 하므로 정렬되지 않은 배열에는 이진 탐색을 쓸 수 없습니다.',
          role: 'warning',
        },
        {
          id: 'n4',
          label: '파이썬 range & continue 추적',
          sublabel: 'range(1, 10, 2) → 1, 3, 5, 7, 9',
          detail: 'continue를 만나면 아래 문장(s += i)을 건너뛰고 다음 반복으로 바로 넘어갑니다. break와 혼동 금지!',
          role: 'primary',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '속도 O(N) → O(log N)' },
        { from: 'n2', to: 'n3', label: '필수 전제 조건' },
        { from: 'n2', to: 'n4', label: '코드 추적 실습' },
      ],
    },
    sections: [
      {
        heading: '1. 진법 변환과 데이터 표현',
        bulletPoints: [
          '10진수 → 2진수: 2의 거듭제곱(64, 32, 16, 8, 4, 2, 1)의 합으로 쪼개면 나눗셈보다 훨씬 빠릅니다.',
          '예: 45 = 32 + 8 + 4 + 1 → 101101₂ → 8비트 표현은 앞을 0으로 채운 00101101',
          '1바이트(Byte) = 8비트(bit), 1비트로 2가지 정보 표현 → n비트로 2ⁿ가지 표현 가능',
        ],
        keyFormulaOrRule: '45 = 2⁵(32) + 2³(8) + 2²(4) + 2⁰(1) → 00101101 (8bit)',
        instructorHighlight:
          '문제에서 “8비트로 표현하시오”라고 했는데 앞자리 00을 빼먹고 101101만 쓰면 오답 처리되니 비트 수를 꼭 확인하세요.',
      },
      {
        heading: '2. 파이썬 제어문 손으로 변수표 그리기',
        bulletPoints: [
          '반복문 문제는 반드시 종이에 변수(i, s) 변화표를 한 줄씩 적어 추적하세요.',
          'continue: 현재 회차의 남은 코드만 건너뛰고 다음 반복 실행 / break: 반복문 즉시 탈출',
          'range(start, stop, step): stop 숫자는 포함하지 않고 직전 값까지만 생성합니다.',
        ],
        instructorHighlight:
          '암산으로 반복문을 풀면 1회차나 마지막 회차에서 거의 틀리니 표 그리기를 습관화하세요.',
      },
    ],
    examTraps: [
      'range(1, 10, 2)에서 마지막 숫자 10이 포함되지 않는다는 점을 놓치는 실수.',
      '이진 탐색 서술형에서 비교 횟수만 적고 “데이터 정렬 전제 조건”을 빠뜨리는 감점.',
    ],
    finalChecklist: [
      '2의 거듭제곱 표(2⁰~2⁸ = 1~256) 정확히 암산 확인',
      'continue vs break 동작 차이 코드 예제로 확인',
      '순차 탐색 vs 이진 탐색 비교 횟수 공식 점검',
    ],
  },
  인기초: {
    instructorGreeting:
      '인공지능 기초(2학기 기말고사 전용)는 머신러닝 3대 유형 구분과 다층 퍼셉트론이 왜 등장했는지 흐름 그림 한 장으로 이해하면 서술형까지 완벽히 대비됩니다.',
    diagram: {
      visualType: 'processFlow',
      title: '퍼셉트론 발전 과정과 과적합(Overfitting) 대응 맵',
      caption: '단층 퍼셉트론의 XOR 한계를 은닉층(MLP)으로 극복하고, 일반화 성능을 높이는 흐름입니다.',
      keyEquation: '단층(선형 분리만 가능) → 다층 퍼셉트론(은닉층 + 비선형 활성화 함수 → XOR 해결)',
      nodes: [
        {
          id: 'n1',
          label: '기계학습 3대 유형',
          sublabel: '지도(분류·회귀) / 비지도(군집) / 강화(보상)',
          detail: '정답 레이블이 있으면 지도학습, 정답 없이 비슷한 것끼리 묶으면 비지도학습(군집화), 시행착오 보상은 강화학습입니다.',
          role: 'primary',
        },
        {
          id: 'n2',
          label: '단층 퍼셉트론의 한계',
          sublabel: 'AND·OR 가능 / XOR 불가',
          detail: '직선 1개로는 (0,1), (1,0)과 (0,0), (1,1)을 나눌 수 없는 선형 분리 불가능 문제(XOR)에 부딪혔습니다.',
          role: 'warning',
        },
        {
          id: 'n3',
          label: '다층 퍼셉트론(MLP) 극복',
          sublabel: '은닉층 + 비선형 활성화 + 오차역전파',
          detail: '은닉층을 추가해 비선형 결정 경계를 만들고 오차역전파로 가중치를 학습해 XOR 문제를 해결했습니다.',
          role: 'core',
        },
        {
          id: 'n4',
          label: '과적합(Overfitting) 방지',
          sublabel: 'Train 99% vs Test 62% 해결책',
          detail: '훈련 데이터만 과도하게 외운 상태를 막기 위해 데이터 증강, 드롭아웃, 교차 검증, 정규화를 적용합니다.',
          role: 'secondary',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '신경망 모델링' },
        { from: 'n2', to: 'n3', label: '은닉층 도입' },
        { from: 'n3', to: 'n4', label: '일반화 성능 관리' },
      ],
    },
    sections: [
      {
        heading: '1. 지도학습 vs 비지도학습 vs 강화학습',
        bulletPoints: [
          '지도학습 - 분류(Classification): 스팸 메일 판별, 질병 양성/음성처럼 범주를 예측',
          '지도학습 - 회귀(Regression): 주택 가격, 내일 기온처럼 연속적인 수치를 예측',
          '비지도학습 - 군집화(Clustering): 정답 없이 고객 소비 패턴 유사 그룹 묶기',
          '강화학습: 환경과 상호작용하며 누적 보상(Reward)을 최대화하는 행동 정책 학습',
        ],
        instructorHighlight:
          '예시에서 “레이블(정답)이 주어졌는가”와 “출력값이 범주인지 연속 수치인지” 두 질문만 던지면 100% 맞힙니다.',
      },
      {
        heading: '2. 인공지능 윤리와 편향성(Bias) 서술 대비',
        bulletPoints: [
          '데이터 편향: 특정 집단 데이터가 과소·왜곡 대표되면 모델 예측도 편향됩니다.',
          '설명 가능한 AI(XAI): 블랙박스 모델의 판단 근거를 사람이 이해할 수 있게 제시하는 기술입니다.',
        ],
        instructorHighlight:
          '과적합 서술형에서는 반드시 “훈련 데이터 성능↑ / 테스트 데이터 성능↓” 대비를 명시하고 해결책 2가지를 구체적으로 적으세요.',
      },
    ],
    examTraps: [
      '분류(범주형 출력)와 군집화(정답 없는 그룹 묶기)를 혼동하는 오답 함정.',
      '단층 퍼셉트론이 해결할 수 없는 게이트는 AND/OR이 아니라 XOR 게이트입니다.',
    ],
    finalChecklist: [
      '지도(분류/회귀)·비지도(군집)·강화학습 예시 1개씩 매칭',
      'XOR 문제 해결 원리(은닉층 + 비선형 활성화 함수) 이해',
      '과적합 정의 및 완화 방법 2가지 서술형 답안 작성 연습',
    ],
  },
  한국사: {
    instructorGreeting:
      '한국사는 사건 이름을 통으로 외우기보다 “개혁의 배경 → 핵심 내용 → 한계/의의” 흐름으로 연대 순서를 묶으면 두 개혁이 절대 섞이지 않습니다.',
    diagram: {
      visualType: 'processFlow',
      title: '근대 개혁 ~ 민족협동전선 연대기 연결도',
      caption: '갑오개혁과 대한제국 광무개혁, 1920년대 신간회의 핵심 키워드 구분입니다.',
      keyEquation: '1894 갑오개혁(신분제 폐지·은본위) → 1899~ 광무개혁(지계 발급) → 1927 신간회',
      nodes: [
        {
          id: 'n1',
          label: '1894 1차 갑오개혁',
          sublabel: '과거제·신분제 폐지, 은본위제',
          detail: '군국기무처 중심의 자주적·근대적 개혁으로 신분 제도와 과거 제도를 철폐하고 조세를 금납화했습니다.',
          role: 'primary',
        },
        {
          id: 'n2',
          label: '1894~95 2차 갑오개혁',
          sublabel: '홍범 14조, 재판소 분리',
          detail: '사법권과 행정권을 분리해 재판소를 설치하고 교육입국조서를 반포했습니다.',
          role: 'secondary',
        },
        {
          id: 'n3',
          label: '1899~ 대한제국 광무개혁',
          sublabel: '구본신참 · 지계(토지 문서) 발급',
          detail: '옛 제도를 본받고 새 것을 참고한다는 구본신참 원칙 아래 양전 사업을 벌여 근대적 토지 소유권 문서인 지계를 발급했습니다.',
          role: 'warning',
        },
        {
          id: 'n4',
          label: '1927 항일 협동전선 신간회',
          sublabel: '비타협 민족주의 + 사회주의 연합',
          detail: '정우회 선언을 계기로 창립되어 기회주의(타협론) 배격, 정치·경제적 각성을 강령으로 삼고 광주학생항일운동을 지원했습니다.',
          role: 'core',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '1·2차 연속 개혁' },
        { from: 'n2', to: 'n3', label: '대한제국 수립 후' },
        { from: 'n3', to: 'n4', label: '일제강점기 민족운동' },
      ],
    },
    sections: [
      {
        heading: '1. 갑오개혁 vs 을미개혁 vs 광무개혁 혼동 방지',
        bulletPoints: [
          '갑오개혁(1894): 신분제 폐지, 과거제 폐지, 조세 금납화, 홍범 14조, 재판소 설치',
          '을미개혁(1895): 태양력 사용, 건양 연호, 단발령, 종두법, 친위대·진위대',
          '광무개혁(1897~): 대한국 국제, 양전 사업과 지계 발급, 원수부 설치, 식산흥업 정책',
        ],
        instructorHighlight:
          '‘지계 발급’은 갑오개혁이 아니라 대한제국 광무개혁! 내신에서 가장 자주 섞어 내는 오답 선지입니다.',
      },
      {
        heading: '2. 1920년대 신간회 창립과 활동',
        bulletPoints: [
          '배경: 일제의 이른바 문화 통치 하에서 타협적 민족주의(자치론) 대두 → 비타협 민족주의와 사회주의의 연대 필요성',
          '3대 강령: 정치적·경제적 각성 촉진, 단결 공고, 기회주의 일체 부인',
          '주요 활동: 순회 강연회, 원산 총파업 지원, 광주학생항일운동 진상조사단 파견',
        ],
        instructorHighlight:
          '신간회의 강령 중 ‘기회주의 배격’은 일제와 타협하려는 자치론자를 비판한 핵심 표현입니다.',
      },
    ],
    examTraps: [
      '갑오개혁 시기에 지계를 발급했다(X) → 대한제국 광무개혁 시기(O).',
      '신간회는 타협적 민족주의 계열이 주도했다(X) → 비타협적 민족주의 계열과 사회주의 계열이 연합(O).',
    ],
    finalChecklist: [
      '갑오·을미·광무개혁 각 3대 핵심 키워드 암기 확인',
      '신간회 창립 배경(정우회 선언)과 3대 강령 확인',
      '주요 사건 연도 순서(1894 → 1897 → 1919 → 1927) 점검',
    ],
  },
  통합사회: {
    instructorGreeting:
      '통합사회는 철학 사상가 비교와 경제 그래프·외부효과 정책 연결이 핵심입니다. 아래 비교 도해를 보며 주체별 입장을 대조해 보세요.',
    diagram: {
      visualType: 'comparison',
      title: '분배적 정의(롤스 vs 노직) 및 외부 불경제 교정 구조',
      caption: '사상가의 핵심 전제와 정부의 시장 실패 개입 수단을 한눈에 비교합니다.',
      keyEquation: '롤스(차등의 원칙·재분배 허용)  vs  노직(소유 권리론·최소국가)',
      nodes: [
        {
          id: 'n1',
          label: '롤스 (자유주의적 평등)',
          sublabel: '무지의 베일 · 차등의 원칙',
          detail: '원초적 입장에서 개인은 자신의 재능·배경을 모르므로 최소 수혜자에게 최대 이익이 되는 분배에 합의합니다.',
          role: 'core',
        },
        {
          id: 'n2',
          label: '노직 (자유지상주의)',
          sublabel: '취득·양도 정의 · 최소국가',
          detail: '개인이 정당하게 취득·양도한 재산에 대해 세금을 거둬 강제 재분배하는 것은 개인 권리 침해라고 봅니다.',
          role: 'primary',
        },
        {
          id: 'n3',
          label: '외부 불경제 (시장 실패)',
          sublabel: '제3자 피해 발생 · 사회적 비용 > 사적 비용',
          detail: '공장 매연처럼 제3자에게 의도치 않은 피해를 주지만 대가를 치르지 않아 사회 적정량보다 과다 생산됩니다.',
          role: 'warning',
        },
        {
          id: 'n4',
          label: '정부 교정 수단',
          sublabel: '피구세(환경세) · 배출권 거래제',
          detail: '오염 비용만큼 세금을 부과하거나 배출권 시장을 만들어 외부 비용을 기업 비용으로 내부화합니다.',
          role: 'secondary',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '재분배·재능 공유 입장 대립' },
        { from: 'n3', to: 'n4', label: '외부비용 내부화' },
      ],
    },
    sections: [
      {
        heading: '1. 롤스 vs 노직 핵심 키워드 대조',
        bulletPoints: [
          '롤스: 무지의 베일, 원초적 입장, 기본적 자유의 원칙(1원칙) > 기회 균등 + 차등의 원칙(2원칙)',
          '노직: 역사적·비정형적 정의 원칙, 취득의 정의, 이전(양도)의 정의, 교정의 정의, 최소국가',
          '공통점: 두 사상가 모두 개인의 자유와 권리를 최우선으로 존중합니다.',
        ],
        instructorHighlight:
          '“롤스는 결과의 무조건적 평등을 주장한다”는 선지는 무조건 오답입니다! 합당한 불평등(차등의 원칙)을 인정합니다.',
      },
      {
        heading: '2. 시장 실패 유형과 정부의 경제적 유인책',
        bulletPoints: [
          '외부 경제(긍정적 외부효과): 양봉업자-과수원, 백신 접종 → 적정량보다 과소 생산 → 보조금 지급',
          '외부 불경제(부정적 외부효과): 환경 오염, 층간 소음 → 적정량보다 과다 생산 → 환경세 부과, 배출권 거래제',
        ],
        instructorHighlight:
          '서술형에서는 ‘과다/과소 생산’ 방향과 ‘외부비용의 내부화’ 표현을 꼭 써주면 점수가 확실합니다.',
      },
    ],
    examTraps: [
      '노직이 천부적 재능의 분포 자체는 도덕적으로 임의적이라는 점을 인정하지만, 그 재능의 소유권까지 부인하지 않는다는 점에 주의하세요.',
      '외부 불경제는 과소 생산이 아니라 사회적 적정 수준보다 과다 생산되는 시장 실패입니다.',
    ],
    finalChecklist: [
      '롤스 1원칙과 2원칙(차등의 원칙) 우선순위 확인',
      '노직의 최소국가와 재분배 반대 근거 확인',
      '외부경제(보조금) vs 외부불경제(조세/배출권) 짝짓기',
    ],
  },
  물리학: {
    instructorGreeting:
      '물리학과 역학은 식을 따로 외우지 말고 물체에 작용하는 힘 화살표(자유물체도)와 에너지 보존 그림을 먼저 그리면 킬러 문제까지 한 줄로 풀립니다.',
    diagram: {
      visualType: 'processFlow',
      title: '도르래 연결 계(A, B) 뉴턴 운동 법칙 3단계 풀이법',
      caption: '전체 계의 가속도를 먼저 구한 뒤 개별 물체의 알짜힘으로 장력 T를 찾는 표준 해법입니다.',
      keyEquation: 'a = F_알짜 / (m_A + m_B)   →   T = m_A · a   →   W = T · s',
      nodes: [
        {
          id: 'n1',
          label: '1단계: 전체 계 가속도 a',
          sublabel: 'm_B·g = (m_A + m_B)·a',
          detail: '수평면 위 A(2kg)와 매달린 B(3kg)가 함께 움직일 때 전체 외력은 B의 중력(30N), 전체 질량은 5kg이므로 a = 6m/s².',
          role: 'core',
        },
        {
          id: 'n2',
          label: '2단계: 실의 장력 T',
          sublabel: 'A에 작용한 알짜힘 = T',
          detail: '수평면 위 A의 알짜힘은 실의 장력 T 하나뿐이므로 T = m_A·a = 2 × 6 = 12N입니다.',
          role: 'primary',
        },
        {
          id: 'n3',
          label: '3단계: 실이 한 일 W',
          sublabel: 'W = T·s = ΔE_k(A)',
          detail: 'B가 2m 내려가면 A도 2m 끌려오므로 실이 A에 한 일 W = 12N × 2m = 24J이며, 이는 A의 운동에너지 증가량과 같습니다.',
          role: 'secondary',
        },
        {
          id: 'n4',
          label: '열역학 제1법칙 주의',
          sublabel: 'Q = ΔU + W (단열: Q=0)',
          detail: '단열 팽창에서는 Q=0이고 부피가 커져 W>0이므로 ΔU = -W < 0이 되어 기체 온도가 하강합니다.',
          role: 'warning',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '개별 물체 적용' },
        { from: 'n2', to: 'n3', label: '일-운동에너지 정리' },
        { from: 'n3', to: 'n4', label: '열역학 에너지 보존' },
      ],
    },
    sections: [
      {
        heading: '1. 뉴턴 운동 법칙과 일-에너지 정리',
        bulletPoints: [
          '알짜힘이 한 일 = 물체의 운동에너지 변화량(W_알짜 = ΔE_k)',
          '실의 장력이 물체 A에 한 일은 A의 역학적 에너지 변화량과 같고, B의 역학적 에너지 감소량과 크기가 같습니다.',
        ],
        keyFormulaOrRule: 'F = ma   |   W = F·s·cosθ   |   I = F·Δt = Δp',
        instructorHighlight:
          '장력 T를 구할 때 중력을 받는 B 쪽 식으로 구하든(30 - T = 18 → T = 12) A 쪽으로 구하든(T = 12) 검산할 수 있습니다.',
      },
      {
        heading: '2. 열역학 제1법칙 (등적 · 등압 · 등온 · 단열)',
        bulletPoints: [
          '등적(ΔV=0): W=0 → Q = ΔU',
          '등온(ΔT=0): ΔU=0 → Q = W',
          '단열(Q=0): 0 = ΔU + W → 팽창(W>0)하면 온도↓ / 압축(W<0)하면 온도↑',
          '등압(P 일정): W = P·ΔV, Q = ΔU + P·ΔV',
        ],
        instructorHighlight:
          '이상기체의 내부에너지 U는 절대온도 T에만 비례한다는 사실을 항상 1순위로 떠올리세요.',
      },
    ],
    examTraps: [
      '도르래 문제에서 실의 장력 T를 매달린 물체 B의 무게(m_B·g)와 같다고 착각하는 실수(정지·등속일 때만 같음!).',
      '단열 압축 시 외부에서 열을 받지 않았는데도 일이 내부에너지로 전환되어 온도가 올라간다는 점을 놓치기 쉽습니다.',
    ],
    finalChecklist: [
      '도르래 연결 계 가속도 및 장력 계산 연습',
      '충격량 I = Δp 그래프 넓이 의미 확인',
      '열역학 4대 과정(등적·등압·등온·단열) Q, ΔU, W 부호 정리',
    ],
  },
  통합과학: {
    instructorGreeting:
      '과학 과목은 결합·반응·전도 원리를 표와 그림으로 연결해 두면 낯선 물질이나 그래프가 나와도 흔들리지 않습니다.',
    diagram: {
      visualType: 'comparison',
      title: '화학 결합(이온·공유) 성질 대비 및 충격량 I = F·Δt 원리',
      caption: '고체/액체 상태 전기 전도성 판별 기준과 안전장치 충격력 감소 원리입니다.',
      keyEquation: 'I = Δp = F · Δt (충격량 동일할 때 Δt↑ ⇒ 평균 충격력 F↓)',
      nodes: [
        {
          id: 'n1',
          label: '이온 결합 (NaCl 등)',
          sublabel: '금속 양이온 + 비금속 음이온',
          detail: '고체에서는 이온이 강하게 묶여 전류가 안 통하지만, 수용액이나 용융액 상태에서는 이온이 이동해 전류가 흐릅니다.',
          role: 'core',
        },
        {
          id: 'n2',
          label: '공유 결합 (설탕, 다이아몬드)',
          sublabel: '비금속 + 비금속 전자쌍 공유',
          detail: '분자 결정(설탕)은 물에 녹아도 이온을 만들지 않으므로 고체·수용액 모두 전기 전도성이 없습니다. (단, 흑연 예외)',
          role: 'primary',
        },
        {
          id: 'n3',
          label: '충격량 I = F · Δt',
          sublabel: '그래프 아랫넓이 = 운동량 변화량',
          detail: '같은 높이에서 떨어져 멈추면 질량과 속도 변화가 같아 충격량(그래프 넓이)은 항상 같습니다.',
          role: 'secondary',
        },
        {
          id: 'n4',
          label: '에어백 · 카펫 원리',
          sublabel: '충돌 시간 Δt 증가 → 충격력 F 감소',
          detail: '서술형 단골! 충격량은 일정한데 충돌 시간이 길어지므로 물체가 받는 평균 힘(충격력)이 반비례해 줄어듭니다.',
          role: 'warning',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '전기 전도성 차이' },
        { from: 'n3', to: 'n4', label: '충격력 분산 공식' },
      ],
    },
    sections: [
      {
        heading: '1. 물질의 결합 유형과 물리적 성질',
        bulletPoints: [
          '이온 결합 물질: 녹는점·끓는점이 대체로 높고, 외부 힘을 가하면 이온층이 밀려 쉽게 부서집니다.',
          '공유 결합 물질: 분자 사이 인력이 약해 대체로 녹는점이 낮으며 전기 전도성이 없습니다.',
          '구리(Cu) 등 금속 결합 물질은 자유 전자가 있어 고체와 액체 상태 모두 전류가 잘 흐릅니다.',
        ],
        instructorHighlight:
          '‘고체 X, 액체 O’ 조건이 나오면 99% 이온 결합 물질입니다!',
      },
      {
        heading: '2. 힘-시간 그래프와 충격량 서술형 핵심',
        bulletPoints: [
          '힘-시간(F-t) 그래프 아래 넓이 = 충격량(I) = 운동량의 변화량(mv - mv₀)',
          '에어백, 범퍼, 푹신한 매트 문제는 ‘충격량 동일 → 충돌 시간(Δt) 길어짐 → 평균 힘(충격력) 감소’ 3단 콤보를 반드시 쓰세요.',
        ],
        instructorHighlight:
          '‘충격량이 줄어들어 안 깨진다’라고 쓰면 오답! 충격량은 같고 충격력(평균 힘)이 줄어드는 것입니다.',
      },
    ],
    examTraps: [
      '에어백·카펫 서술형에서 ‘충격량이 감소한다’고 쓰면 감점(또는 0점) — ‘충격량은 같고 충격력이 감소한다’가 정답.',
      '흑연은 공유 결합 물질이지만 예외적으로 전기가 통한다는 점을 기억하세요.',
    ],
    finalChecklist: [
      '이온/공유/금속 결합의 고체·액체 전기 전도성 표 확인',
      '충격량 vs 충격력 서술형 3단 키워드 점검',
      '화학 반응식 양적 관계 계수비 = 몰수비 = 기체 부피비(온도·압력 일정) 확인',
    ],
  },
};

export function getBaselineSummaryNote(
  schoolName: string,
  subjectName: string,
  semester: SemesterType,
  examKind: ExamPeriodKind,
  examScope: string,
  difficultyFocus: QuestionDifficulty | '전체'
): InstructorSummaryNote {
  const cat = normalizeNoteCategory(subjectName);
  const template = BASELINE_NOTES[cat];
  const cleanScope = examScope.trim() || `${subjectName} ${semester} 핵심 시험 범위`;

  if (template) {
    return {
      id: `curated-${subjectName}-${semester}-${examKind}`,
      schoolName,
      subjectName,
      semester,
      examKind,
      examScope: cleanScope,
      difficultyFocus,
      source: 'curated',
      ...template,
    };
  }

  return {
    id: `curated-generic-${subjectName}-${semester}-${examKind}`,
    schoolName,
    subjectName,
    semester,
    examKind,
    examScope: cleanScope,
    difficultyFocus,
    source: 'curated',
    instructorGreeting: `${schoolName} ${subjectName} (${cleanScope}) 내신 대비 노트입니다. 위 시험 범위를 입력하고 [AI 강사 맞춤 노트 만들기]를 누르면 해당 단원에 딱 맞춘 판서 그림과 핵심 정리를 새로 그려드립니다.`,
    diagram: {
      visualType: 'conceptMap',
      title: `${subjectName} 시험 범위 핵심 개념 연결도`,
      caption: cleanScope,
      keyEquation: '교과 정의 → 자료·조건 대응 → 서술형 인과 정리',
      nodes: [
        {
          id: 'n1',
          label: cleanScope.slice(0, 22),
          sublabel: `${subjectName} 핵심 주제`,
          detail: `${cleanScope} 단원에서 가장 먼저 잡아야 할 중심 개념입니다. 교과서 굵은 글씨 정의를 정확히 숙지하세요.`,
          role: 'core',
        },
        {
          id: 'n2',
          label: '교과 개념 · 원리',
          sublabel: '용어 정의와 성립 조건',
          detail: '개념이 성립하기 위한 단서 조건(예외, 범위, 전제)을 반드시 함께 외워야 함정 선지를 피할 수 있습니다.',
          role: 'primary',
        },
        {
          id: 'n3',
          label: '자료 해석 적용',
          sublabel: '표·그래프·지문 대응',
          detail: '내신 중·상 난이도는 개념 자체보다 새로운 자료와 1:1로 연결해 적용하는 능력을 평가합니다.',
          role: 'secondary',
        },
        {
          id: 'n4',
          label: '서술형 감점 방지',
          sublabel: '핵심 용어 + 조건 명시',
          detail: `${schoolName} 서술형은 답만 맞는다고 만점이 아니라 조건과 근거 용어 포함 여부를 채점합니다.`,
          role: 'warning',
        },
      ],
      edges: [
        { from: 'n1', to: 'n2', label: '정의 정리' },
        { from: 'n1', to: 'n3', label: '문제 적용' },
        { from: 'n1', to: 'n4', label: '서술형 완성' },
      ],
    },
    sections: [
      {
        heading: `1. [${cleanScope}] 핵심 개념 구조화`,
        bulletPoints: [
          '교과서 단원 도입부와 학습 목표에 적힌 핵심 용어 5개를 먼저 노트에 적어봅니다.',
          '각 용어가 어떤 상위 개념에 속하는지, 반대 개념과 무엇이 다른지 표로 비교합니다.',
          '수업 중 선생님이 강조한 프린트 예시와 예외 사례를 옆에 붉은 펜으로 연결하세요.',
        ],
        instructorHighlight:
          '상위 시험 범위 입력창에 실제 단원명이나 소단원 제목을 구체적으로 적고 AI 노트를 생성하면 훨씬 정밀한 도해가 그려집니다.',
      },
    ],
    examTraps: [
      '조건이나 단서(단, ~일 때 / ~을 제외하고)를 끝까지 읽지 않아 생기는 실수.',
      '서술형 답안에서 교과 핵심 키워드를 일상어로 풀어서 감점되는 경우.',
    ],
    finalChecklist: [
      '시험 범위 소단원별 핵심 개념 정의 확인',
      '수업 프린트 및 교과서 예제 1회독 완료',
      '오답 문항에서 틀린 이유(개념 vs 조건 누락) 기록',
    ],
  };
}
