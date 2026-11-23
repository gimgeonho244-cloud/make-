import {
  ExamPeriodKind,
  HighSchoolType,
  PastExamQuestion,
  SchoolSubjectPastExam,
  SemesterType,
} from '../types/admission';

export const PAST_EXAM_PRESET_SCHOOLS: {
  name: string;
  type: HighSchoolType;
  region: string;
}[] = [
  { name: '목포덕인고등학교', type: '일반고', region: '전남 목포' },
  { name: '서라벌고등학교', type: '일반고', region: '서울 노원' },
  { name: '숙명여자고등학교', type: '일반고', region: '서울 강남' },
  { name: '휘문고등학교', type: '자율형사립고', region: '서울 강남' },
  { name: '대원외국어고등학교', type: '외고·국제고', region: '서울 광진' },
  { name: '서울과학고등학교', type: '과학고·영재고', region: '서울 종로' },
];

export const CORE_PAST_EXAM_SUBJECTS: string[] = [
  '공통국어1',
  '공통국어2',
  '공통수학1',
  '공통수학2',
  '공통영어1',
  '공통영어2',
  '통합사회1',
  '통합사회2',
  '통합과학1',
  '통합과학2',
  '한국사1',
  '한국사2',
  '정보',
  '인기초(인공지능 기초)',
  '대수',
  '미적분',
  '확률과 통계',
  '기하',
  '문학',
  '독서',
  '언어와 매체',
  '화법과 작문',
  '물리학Ⅰ',
  '화학Ⅰ',
  '생명과학Ⅰ',
  '지구과학Ⅰ',
  '경제',
  '정치와 법',
  '사회·문화',
];

interface SchoolExamStyleProfile {
  totalQuestionsInfo: string;
  essayRatio: string;
  schoolTrendSummary: string;
  cutScoreEstimate: string;
}

function getSchoolStyle(
  schoolName: string,
  highSchoolType: HighSchoolType
): SchoolExamStyleProfile {
  if (schoolName.includes('덕인고')) {
    return {
      totalQuestionsInfo: '총 22문항 (객관식 18문항 + 서·논술형 4문항)',
      essayRatio: '객관식 75점 · 서술형 25점 (부분점수 엄격 적용)',
      schoolTrendSummary:
        '목포덕인고 기출은 교과서·학교 프린트 기본 개념에서 약 65%를 출제하되, 5등급제 변별을 위해 고1·고2 학평 변형 3~4문항과 서술형 조건 제시 문제를 반드시 배치하는 경향이 뚜렷합니다.',
      cutScoreEstimate: '5등급제 1등급(상위 10%) 91~94점 / 2등급(34%) 78~83점대 추정',
    };
  }
  if (highSchoolType === '자율형사립고') {
    return {
      totalQuestionsInfo: '총 24문항 (객관식 17문항 + 서술형 7문항)',
      essayRatio: '객관식 70점 · 서술형 30점 (풀이 논리 단계별 채점)',
      schoolTrendSummary:
        '자사고 특성상 수능·평가원 4점/고난도 변형 비중이 높고 계산량과 추론 단계가 깁니다. 시간 배분 전략과 서술형 조건 누락 방지가 등급을 좌우합니다.',
      cutScoreEstimate: '1등급컷 84~88점 / 2등급컷 72~76점대 (고난도 변별형)',
    };
  }
  if (highSchoolType === '외고·국제고') {
    return {
      totalQuestionsInfo: '총 25문항 (객관식 19문항 + 서·논술형 6문항)',
      essayRatio: '객관식 68점 · 논술/영작 서술형 32점',
      schoolTrendSummary:
        '어학·인문 심화 지문 및 원문 변형 문항 비중이 매우 높으며, 조건부 영작·비문학 요약 서술형에서 감점 요인이 잦습니다.',
      cutScoreEstimate: '1등급컷 88~92점 / 2등급컷 79~83점대',
    };
  }
  if (highSchoolType === '과학고·영재고') {
    return {
      totalQuestionsInfo: '총 16문항 (단답형 6문항 + 심층 서술·증명형 10문항)',
      essayRatio: '단답형 30점 · 심층 증명·탐구 설계 70점',
      schoolTrendSummary:
        '교과 심화 개념을 대학 기초 이론·실험 데이터 해석과 결합한 논증형 문항이 중심입니다. 수식 유도 과정과 물리적/화학적 근거 명시가 핵심입니다.',
      cutScoreEstimate: '절대평가 A 성취 기준 85~90점 / 상위 10% 82점 내외',
    };
  }
  return {
    totalQuestionsInfo: '총 22문항 (객관식 18문항 + 서술형 4문항)',
    essayRatio: '객관식 75점 · 서술형 25점',
    schoolTrendSummary:
      '수업 프린트·교과서 핵심 문항을 바탕으로 학력평가 변형 2~3문항으로 1등급을 변별합니다. 기본 문항 실수를 줄이고 서술형 핵심 키워드를 정확히 적는 것이 중요합니다.',
    cutScoreEstimate: '5등급제 1등급(상위 10%) 90~94점 / 2등급(34%) 77~83점대',
  };
}

function normalizeSubjectCategory(subjectName: string): string {
  if (subjectName.includes('국어') || subjectName.includes('문학') || subjectName.includes('독서') || subjectName.includes('언어') || subjectName.includes('화법')) {
    if (subjectName.includes('언어')) return '언어와 매체';
    if (subjectName.includes('문학')) return '문학';
    if (subjectName.includes('독서')) return '독서';
    return '공통국어';
  }
  if (subjectName.includes('미적분')) return '미적분';
  if (subjectName.includes('확률') || subjectName.includes('통계')) return '확률과 통계';
  if (subjectName.includes('기하')) return '기하';
  if (subjectName.includes('대수') || subjectName.includes('수학')) return '수학';
  if (subjectName.includes('영어')) return '영어';
  if (subjectName.includes('인기초') || subjectName.includes('인공지능')) return '인기초';
  if (subjectName.includes('정보')) return '정보';
  if (subjectName.includes('한국사')) return '한국사';
  if (subjectName.includes('경제')) return '경제';
  if (subjectName.includes('정치')) return '정치와 법';
  if (subjectName.includes('사회·문화') || subjectName.includes('사회문화')) return '사회·문화';
  if (subjectName.includes('통합사회') || subjectName.includes('사회')) return '통합사회';
  if (subjectName.includes('물리')) return '물리학';
  if (subjectName.includes('화학')) return '화학';
  if (subjectName.includes('생명')) return '생명과학';
  if (subjectName.includes('지구')) return '지구과학';
  if (subjectName.includes('과학')) return '통합과학';
  return '공통융합';
}

const QUESTION_BANKS: Record<string, PastExamQuestion[]> = {
  공통국어: [
    {
      id: 'kor-1',
      number: 1,
      questionType: '객관식',
      difficulty: '하',
      points: 4,
      unit: '음운 변동 및 한글 맞춤법',
      prompt:
        '다음 중 음운 변동의 유형이 나머지 넷과 다른 것은? (단, 표준 발음을 기준으로 판단하시오.)',
      choices: [
        '① 꽃잎 [꼰닙]',
        '② 밭이랑 [반니랑]',
        '③ 솜이불 [솜니불]',
        '④ 한여름 [한녀름]',
        '⑤ 물약 [물략]',
      ],
      correctIndex: 4,
      answerText: '⑤ 물약 [물략]',
      explanation:
        '①~④는 모두 ㄴ첨가가 일어난 뒤 비음화가 일어나는 예이지만, ⑤ 물약 [물략]은 ㄴ첨가 후 앞의 ㄹ에 의해 ㄴ이 ㄹ로 바뀌는 유음화가 일어난 사례입니다.',
    },
    {
      id: 'kor-2',
      number: 2,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '현대시 표현 기법과 화자의 태도',
      prompt:
        '윤동주의 시 「서시」와 「자화상」을 비교 감상한 내용으로 가장 적절하지 않은 것은?',
      choices: [
        '① 두 작품 모두 내면적 성찰을 통해 자아를 탐구하는 태도가 드러난다.',
        '② 「서시」에서는 하늘을 우러러 한 점 부끄럼이 없기를 바라는 윤리적 지향이 나타난다.',
        '③ 「자화상」의 ‘우물’은 화자가 자신의 내면과 현실을 비추어 보는 성찰의 매개체이다.',
        '④ 「자화상」의 화자는 미움과 가엾음, 그리움이 교차하는 복합적 감정을 겪는다.',
        '⑤ 두 작품 모두 외부 세계에 대한 직접적 공격과 풍자를 통해 현실 문제를 해결하고자 한다.',
      ],
      correctIndex: 4,
      answerText: '⑤',
      explanation:
        '윤동주의 시는 외부 세계에 대한 직접적 공격이나 풍자보다는, 식민지 지식인으로서 느끼는 부끄러움과 자기 성찰, 극복 의지가 핵심입니다.',
    },
    {
      id: 'kor-3',
      number: 3,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: '비문학 추론 및 핵심 논지 요약',
      prompt:
        '[서술형] 국어 지문에서 “AI 추천 알고리즘이 필터 버블을 강화하면 확증 편향이 심화된다”고 할 때, 이를 완화하기 위해 제시할 수 있는 사용자 측면과 플랫폼 측면의 해결 방안을 각각 1가지씩 한 문장으로 서술하시오.',
      answerText:
        '사용자는 의도적으로 다양한 관점의 정보원을 탐색하여 비판적 읽기를 실천하고, 플랫폼은 개인화 추천 외에 반대 관점이나 무작위 신규 콘텐츠 노출 비율을 알고리즘에 반영해야 한다.',
      explanation:
        '지문 인과 구조(개인화 필터링 → 편향 강화)를 정확히 뒤집어 양측 주체(사용자·플랫폼)를 모두 포함해야 만점입니다.',
      scoringRubric:
        '사용자 측면 실천 방안(4점) + 플랫폼 알고리즘 개선 방안(4점). 두 주체 중 하나만 서술 시 최대 4점.',
    },
  ],
  수학: [
    {
      id: 'math-1',
      number: 1,
      questionType: '객관식',
      difficulty: '하',
      points: 4,
      unit: '다항식의 나머지 정리',
      prompt:
        '다항식 P(x)를 x - 1로 나눈 나머지가 3이고, x + 2로 나눈 나머지가 -3이다. P(x)를 (x - 1)(x + 2)로 나눈 나머지를 R(x)라 할 때, R(3)의 값은?',
      choices: ['① 5', '② 7', '③ 9', '④ 11', '⑤ 13'],
      correctIndex: 1,
      answerText: '② 7',
      explanation:
        '나머지 R(x) = ax + b라 하면 R(1) = a + b = 3, R(-2) = -2a + b = -3. 두 식을 빼면 3a = 6이므로 a = 2, b = 1. 따라서 R(x) = 2x + 1이고 R(3) = 7입니다.',
    },
    {
      id: 'math-2',
      number: 2,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '이차함수의 최대·최소와 판별식',
      prompt:
        '0 ≤ x ≤ 3에서 이차함수 f(x) = x² - 2ax + 4a의 최솟값이 3일 때, 모든 실수 a의 값의 합은? (단, 조건에 맞는 경우를 모두 찾으시오.)',
      choices: ['① 1', '② 2', '③ 3', '④ 4', '⑤ 5'],
      correctIndex: 3,
      answerText: '④ 4',
      explanation:
        '대칭축 x = a의 위치에 따라 구간을 나눕니다. ① a < 0이면 f(0) = 4a = 3 → a = 3/4 (모순). ② 0 ≤ a ≤ 3이면 f(a) = -a² + 4a = 3 → a² - 4a + 3 = 0 → a = 1 또는 a = 3 (모두 성립). ③ a > 3이면 f(3) = 9 - 2a = 3 → a = 3 (모순). 따라서 a = 1, 3이고 합은 4입니다.',
    },
    {
      id: 'math-3',
      number: 3,
      questionType: '서술형',
      difficulty: '상',
      points: 10,
      unit: '집합과 명제 / 절대부등식 증명',
      prompt:
        '[서술형] 양수 x, y에 대하여 (x + 1/y)(y + 4/x)의 최솟값을 구하고, 그때의 x, y 사이의 관계식을 산술평균과 기하평균의 관계를 이용하여 서술하시오.',
      answerText:
        '최솟값은 9이며, 등호는 xy = 2일 때 성립한다.',
      explanation:
        '전개하면 xy + 4 + 1 + 4/(xy) = 5 + xy + 4/(xy). xy > 0이므로 산술·기하 평균에 의해 xy + 4/(xy) ≥ 2√4 = 4. 따라서 전체 식의 최솟값은 5 + 4 = 9이고, 등호는 xy = 4/(xy) 즉 xy = 2일 때 성립합니다.',
      scoringRubric:
        '식 전개(3점) + 산술·기하 평균 부등식 적용 및 최솟값 9 도출(4점) + 등호 성립 조건 xy = 2 명시(3점).',
    },
  ],
  미적분: [
    {
      id: 'calc-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '수열의 극한과 등비급수',
      prompt:
        '등비급수 ∑(n=1→∞) ((x - 1) / 3)ⁿ 이 수렴하도록 하는 모든 정수 x의 개수는?',
      choices: ['① 3개', '② 4개', '③ 5개', '④ 6개', '⑤ 7개'],
      correctIndex: 2,
      answerText: '③ 5개',
      explanation:
        '공비 r = (x - 1)/3이 -1 < r < 1을 만족해야 하므로 -3 < x - 1 < 3 → -2 < x < 4. 정수 x는 -1, 0, 1, 2, 3으로 총 5개입니다.',
    },
    {
      id: 'calc-2',
      number: 2,
      questionType: '서술형',
      difficulty: '상',
      points: 10,
      unit: '몫의 미분법과 극값',
      prompt:
        '[서술형] 함수 f(x) = x · e^(-x)의 극댓값과 변곡점의 x좌표를 구하는 풀이 과정을 서술하시오.',
      answerText: '극댓값: 1/e (x = 1일 때), 변곡점의 x좌표: x = 2',
      explanation:
        "f'(x) = (1 - x)e^(-x) = 0에서 x = 1 전후 부호가 +에서 -로 바뀌므로 극댓값 f(1) = 1/e. 이계도함수 f''(x) = (x - 2)e^(-x) = 0에서 x = 2 전후 부호가 바뀌므로 변곡점 x = 2입니다.",
      scoringRubric:
        "도함수 f'(x) 계산 및 극댓값 1/e(5점) + 이계도함수 f''(x) 계산 및 변곡점 x=2(5점).",
    },
  ],
  '확률과 통계': [
    {
      id: 'prob-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '중복조합과 부정방정식의 해',
      prompt:
        '방정식 x + y + z = 9를 만족시키는 자연수 x, y, z의 순서쌍 (x, y, z)의 개수는?',
      choices: ['① 21', '② 28', '③ 36', '④ 45', '⑤ 55'],
      correctIndex: 1,
      answerText: '② 28',
      explanation:
        '자연수 조건이므로 각 문자에 1씩 미리 배분하면 x\' + y\' + z\' = 6 (음이 아닌 정수). 따라서 ₃H₆ = ₈C₆ = ₈C₂ = 28입니다.',
    },
    {
      id: 'prob-2',
      number: 2,
      questionType: '서술형',
      difficulty: '중',
      points: 8,
      unit: '조건부확률',
      prompt:
        '[서술형] 어느 고등학교 1학년 학생 중 60%는 통학버스를 이용하고, 버스를 이용하는 학생 중 25%, 이용하지 않는 학생 중 15%가 지각 경험이 있다. 지각한 학생 1명을 임의로 뽑았을 때 그 학생이 통학버스를 이용했을 확률을 분수로 구하시오.',
      answerText: '5/7',
      explanation:
        'P(지각) = 0.6×0.25 + 0.4×0.15 = 0.15 + 0.06 = 0.21. 구하는 확률 P(버스|지각) = 0.15 / 0.21 = 15/21 = 5/7입니다.',
      scoringRubric: '전체 지각 확률 0.21 계산(4점) + 베이즈 조건부확률 5/7 도출(4점).',
    },
  ],
  '언어와 매체': [
    {
      id: 'lang-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '중세 국어 문법과 주체 높임법',
      prompt:
        '15세기 중세 국어에서 주체 높임 선어말 어미 ‘-시-/-샤-’의 사용 양상으로 옳은 것은?',
      choices: [
        '① 모음 어미 앞에서 ‘-시-’가 그대로 유지된다.',
        '② 자음 어미 앞에서 ‘-샤-’로 교체된다.',
        '③ 모음 어미 앞에서는 ‘-샤-’, 자음 어미 앞에서는 ‘-시-’가 쓰인다.',
        '④ 객체를 높일 때만 선어말 어미 ‘-시-’를 사용한다.',
        '⑤ 현대 국어와 달리 선어말 어미를 전혀 쓰지 않았다.',
      ],
      correctIndex: 2,
      answerText: '③',
      explanation:
        '중세 국어 주체 높임 선어말 어미는 자음으로 시작하는 어미 앞에서 ‘-시-’, 모음으로 시작하는 어미 앞에서 ‘-샤-’가 쓰였습니다(예: 가샤, 오시니).',
    },
    {
      id: 'lang-2',
      number: 2,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: '문장 성분과 안은문장 분석',
      prompt:
        '[서술형] “동생이 내가 어제 산 책을 읽었다.”에서 안긴문장의 종류를 밝히고, 안긴문장 안에서 생략된 문장 성분이 무엇인지 서술하시오.',
      answerText:
        '관형절로 안긴문장이며, ‘내가 어제 (책을) 산’에서 목적어 ‘책을’이 생략되어 있다.',
      explanation:
        '관형사형 전성 어미 ‘-ㄴ’이 결합해 ‘책을’을 수식하는 관계 관형절이며, 목적어 ‘책을’이 생략되었습니다.',
      scoringRubric: '관형절 판별(4점) + 생략된 목적어 명시(4점).',
    },
  ],
  기하: [
    {
      id: 'geo-0',
      number: 1,
      questionType: '객관식',
      difficulty: '하',
      points: 4,
      unit: '포물선의 방정식과 준선',
      prompt:
        '포물선 y² = 12x의 초점의 좌표와 준선의 방정식을 바르게 짝지은 것은?',
      choices: [
        '① 초점 (3, 0), 준선 x = -3',
        '② 초점 (0, 3), 준선 y = -3',
        '③ 초점 (6, 0), 준선 x = -6',
        '④ 초점 (12, 0), 준선 x = -12',
        '⑤ 초점 (-3, 0), 준선 x = 3',
      ],
      correctIndex: 0,
      answerText: '① 초점 (3, 0), 준선 x = -3',
      explanation:
        'y² = 4px에서 4p = 12이므로 p = 3입니다. 따라서 초점은 (3, 0), 준선은 x = -3입니다.',
    },
    {
      id: 'geo-1',
      number: 2,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '이차곡선 (타원의 정의)',
      prompt:
        "타원 x²/25 + y²/9 = 1 위의 한 점 P와 두 초점 F, F'에 대하여 삼각형 PFF'의 둘레의 길이는? (단, 점 P는 장축의 양 끝점이 아니다.)",
      choices: ['① 10', '② 12', '③ 14', '④ 16', '⑤ 18'],
      correctIndex: 4,
      answerText: '⑤ 18',
      explanation:
        "장축의 길이 2a = 10이므로 타원의 정의에 의해 PF + PF' = 10입니다. 또한 c = √(25 - 9) = 4이므로 두 초점 사이의 거리 FF' = 2c = 8입니다. 따라서 삼각형 PFF'의 둘레는 10 + 8 = 18입니다.",
    },
    {
      id: 'geo-2',
      number: 3,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: '벡터의 내적과 수직 조건',
      prompt:
        '[서술형] 두 평면벡터 a = (2, k), b = (k - 1, -3)이 서로 수직일 때, 실수 k의 값을 구하는 풀이 과정을 서술하시오.',
      answerText: 'k = -2',
      explanation:
        '두 벡터가 수직이므로 내적 a·b = 2(k - 1) + k(-3) = 2k - 2 - 3k = -k - 2 = 0에서 k = -2입니다.',
      scoringRubric: '수직 조건 a·b = 0 제시(3점) + 내적 성분 계산 및 k = -2 도출(5점).',
    },
  ],
  영어: [
    {
      id: 'eng-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 4,
      unit: '어법성 판단 (관계사 · 분사구문)',
      prompt:
        '다음 글의 밑줄 친 부분 중 어법상 틀린 것은?\n“Many students ①studying late at night believe that ②caffeine helps them retain information, ③which often turns out to be misleading when ④evaluating their actual sleep quality. Therefore, experts recommend ⑤to keep a consistent sleep schedule.”',
      choices: ['① studying', '② caffeine', '③ which', '④ evaluating', '⑤ to keep'],
      correctIndex: 4,
      answerText: '⑤ to keep → keeping',
      explanation:
        '동사 recommend는 목적어로 동명사(-ing)를 취하므로 ⑤ to keep을 keeping으로 고쳐야 어법상 옳습니다.',
    },
    {
      id: 'eng-2',
      number: 2,
      questionType: '객관식',
      difficulty: '상',
      points: 5,
      unit: '빈칸 추론',
      prompt:
        '다음 빈칸에 들어갈 말로 가장 적절한 것은?\n“Creativity rarely emerges from complete isolation. Instead, breakthrough ideas most often happen when individuals ___________, combining insights across unrelated fields.”',
      choices: [
        '① strictly follow traditional guidelines',
        '② cross disciplinary boundaries',
        '③ avoid feedback from peers',
        '④ memorize existing formulas',
        '⑤ eliminate all uncertainty in advance',
      ],
      correctIndex: 1,
      answerText: '② cross disciplinary boundaries',
      explanation:
        '뒤 문장의 “서로 관련 없는 분야의 통찰을 결합할 때(combining insights across unrelated fields)”와 논리적으로 일치하는 표현은 ② cross disciplinary boundaries(학문 간 경계를 넘나들다)입니다.',
    },
    {
      id: 'eng-3',
      number: 3,
      questionType: '서술형',
      difficulty: '중',
      points: 7,
      unit: '조건 영작 (강조 구문 / 분사)',
      prompt:
        '[서술형] 우리말 “학생들이 자신의 약점을 파악하게 만드는 것은 바로 꾸준한 오답 분석이다.”를 <조건>에 맞게 영작하시오.\n<조건> 1) It ~ that 강조구문 사용 2) consistent, error analysis, enable, weaknesses 포함',
      answerText:
        'It is consistent error analysis that enables students to identify their weaknesses.',
      explanation:
        'It is [강조어구] that ~ 구조를 사용해 consistent error analysis를 강조하고, enable + 목적어 + to부정사 어순을 정확히 지켜야 합니다.',
      scoringRubric: 'It~that 강조구문 정확성(3점) + enable O to V 구조 및 조건 어휘(4점).',
    },
  ],
  정보: [
    {
      id: 'info-1',
      number: 1,
      questionType: '객관식',
      difficulty: '하',
      points: 4,
      unit: '이진수·진법 변환 (1학기 기말고사 전용)',
      prompt:
        '십진수 45를 이진수로 변환하고, 이를 8비트 표현으로 나타낸 것으로 옳은 것은?',
      choices: [
        '① 00101101',
        '② 00101011',
        '③ 00110101',
        '④ 00101110',
        '⑤ 00111101',
      ],
      correctIndex: 0,
      answerText: '① 00101101',
      explanation:
        '45 = 32 + 8 + 4 + 1 = 2⁵ + 2³ + 2² + 2⁰ 이므로 이진수 101101이며, 8비트로 채우면 00101101입니다.',
    },
    {
      id: 'info-2',
      number: 2,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '알고리즘과 파이썬 제어문',
      prompt:
        '다음 파이썬 코드 실행 결과로 출력되는 값은?\ns = 0\nfor i in range(1, 10, 2):\n    if i % 3 == 0:\n        continue\n    s += i\nprint(s)',
      choices: ['① 12', '② 13', '③ 16', '④ 22', '⑤ 25'],
      correctIndex: 1,
      answerText: '② 13',
      explanation:
        'range(1, 10, 2)는 1, 3, 5, 7, 9를 생성합니다. 이 중 3의 배수(3, 9)는 continue로 건너뛰므로 s에는 1 + 5 + 7 = 13이 누적됩니다.',
    },
    {
      id: 'info-3',
      number: 3,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: '탐색 알고리즘 비교 (순차 탐색 vs 이진 탐색)',
      prompt:
        '[서술형] 정렬된 1,024개의 데이터에서 특정 값을 찾을 때, 순차 탐색과 이진 탐색의 최악의 경우 비교 횟수를 각각 구하고, 이진 탐색을 적용하기 위한 필수 전제 조건 1가지를 서술하시오.',
      answerText:
        '순차 탐색은 최대 1,024회, 이진 탐색은 최대 11회(또는 log₂1024 + 1 = 11회 / 10~11회) 비교하며, 이진 탐색의 필수 전제 조건은 데이터가 미리 오름차순 또는 내림차순으로 정렬되어 있어야 한다는 것이다.',
      explanation:
        '이진 탐색은 매 비교마다 탐색 범위를 절반으로 줄이므로 O(log₂N) 성능을 보이나 반드시 정렬이 선행되어야 합니다.',
      scoringRubric: '순차 탐색(2점) + 이진 탐색(3점) + 정렬 전제 조건 명시(3점).',
    },
  ],
  인기초: [
    {
      id: 'ai-1',
      number: 1,
      questionType: '객관식',
      difficulty: '하',
      points: 4,
      unit: '기계학습의 유형 구분 (2학기 기말고사 전용)',
      prompt:
        '정답(레이블)이 없는 대량의 고객 구매 데이터를 유사한 소비 패턴끼리 군집화(Clustering)하여 마케팅 그룹을 나누는 데 가장 적합한 학습 방법은?',
      choices: [
        '① 지도학습 - 회귀',
        '② 지도학습 - 분류',
        '③ 비지도학습 - 군집화',
        '④ 강화학습 - Q-learning',
        '⑤ 규칙 기반 전문가 시스템',
      ],
      correctIndex: 2,
      answerText: '③ 비지도학습 - 군집화',
      explanation:
        '레이블(정답)이 주어지지 않은 데이터에서 내재된 구조나 유사성을 찾아 그룹화하는 것은 비지도학습(Unsupervised Learning)의 군집화입니다.',
    },
    {
      id: 'ai-2',
      number: 2,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '퍼셉트론과 활성함수·오차역전파',
      prompt:
        '인공신경망에서 은닉층을 여러 개 쌓는 다층 퍼셉트론(MLP)이 단층 퍼셉트론의 한계를 극복할 수 있게 된 결정적 문제 사례는?',
      choices: [
        '① AND 게이트 선형 분리 문제',
        '② OR 게이트 선형 분리 문제',
        '③ XOR 게이트 비선형 분리 문제',
        '④ NOT 게이트 반전 문제',
        '⑤ 단순 선형 회귀 계수 추정 문제',
      ],
      correctIndex: 2,
      answerText: '③ XOR 게이트 비선형 분리 문제',
      explanation:
        '단층 퍼셉트론은 직선 하나로 데이터를 나누는 선형 분리만 가능해 XOR 문제를 해결하지 못했으나, 은닉층과 비선형 활성화 함수를 도입한 다층 퍼셉트론으로 이를 해결했습니다.',
    },
    {
      id: 'ai-3',
      number: 3,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: '과적합(Overfitting) 및 AI 윤리',
      prompt:
        '[서술형] AI 모델이 학습 데이터(Train)에서는 정확도 99%를 기록하지만 새로운 테스트 데이터(Test)에서는 정확도가 62%로 급락하는 현상의 명칭을 쓰고, 이를 해결하기 위한 데이터·모델 측면의 방법 2가지를 서술하시오.',
      answerText:
        '현상 명칭은 과적합(Overfitting)이며, 해결 방법으로는 학습 데이터 증강(Data Augmentation) 및 교차 검증, 모델 복잡도 축소(드롭아웃·정규화 적용)가 있다.',
      explanation:
        '과적합은 훈련 데이터 노이즈까지 암기해 일반화 성능이 떨어지는 현상입니다.',
      scoringRubric: '과적합 명칭(3점) + 구체적 완화 방법 2가지(각 2.5점, 총 5점).',
    },
  ],
  한국사: [
    {
      id: 'his-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 4,
      unit: '근현대사 주요 조약과 개혁',
      prompt:
        '1894년 갑오개혁(1차·2차) 시기에 시행된 내용으로 옳지 않은 것은?',
      choices: [
        '① 과거제 폐지 및 신분제 철폐',
        '② 은본위제 채택 및 조세 금납화',
        '③ 홍범 14조 반포 (2차 개혁)',
        '④ 지계(토지 소유권 문서) 발급 시행',
        '⑤ 경무청 설치 및 재판소 분리',
      ],
      correctIndex: 3,
      answerText: '④ 지계(토지 소유권 문서) 발급 시행',
      explanation:
        '지계아문을 설치해 근대적 토지 소유권 증명서인 지계를 발급한 것은 1899년 이후 대한제국의 광무개혁(양전 사업) 때입니다.',
    },
    {
      id: 'his-2',
      number: 2,
      questionType: '서술형',
      difficulty: '중',
      points: 7,
      unit: '일제강점기 민족운동 노선',
      prompt:
        '[서술형] 1927년 비타협적 민족주의 계열과 사회주의 계열이 연합해 창립한 최대 규모의 항일 민족협동전선 단체의 이름과 3대 강령 핵심 취지를 서술하시오.',
      answerText:
        '단체명은 신간회이며, 정치적·경제적 각성 촉진, 단결 공고, 일제의 회유·타협론(기회주의) 배격을 핵심 강령으로 삼았다.',
      explanation:
        '신간회는 정우회 선언 이후 1927년 결성되어 광주학생항일운동 진상 조사 등을 지원했습니다.',
      scoringRubric: '신간회 명칭(3점) + 기회주의 배격 등 강령 취지(4점).',
    },
  ],
  통합사회: [
    {
      id: 'soc-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 4,
      unit: '정의관 비교 (롤스 vs 노직)',
      prompt:
        '롤스(J. Rawls)의 정의론에 대한 설명으로 옳은 것은?',
      choices: [
        '① 최소국가가 가장 정의로운 국가라고 본다.',
        '② 취득과 양도 과정이 정당하면 분배 결과의 불평등은 개입할 수 없다.',
        '③ 무지의 베일 속에서 합리적 개인은 최소 수혜자에게 최대 이익이 돌아가는 차등의 원칙에 합의한다.',
        '④ 천부적 재능은 개인의 절대적 소유이므로 그로 인한 이익도 전부 개인에게 귀속되어야 한다.',
        '⑤ 결과의 평등만을 추구하며 기회의 균등을 부정한다.',
      ],
      correctIndex: 2,
      answerText: '③',
      explanation:
        '①②④는 노직의 소유 권리론(자유지상주의) 입장이며, 롤스는 원초적 입장(무지의 베일)에서 차등의 원칙을 도출합니다.',
    },
    {
      id: 'soc-2',
      number: 2,
      questionType: '서술형',
      difficulty: '중',
      points: 7,
      unit: '시장 실패와 정부의 역할',
      prompt:
        '[서술형] 외부 불경제(부정적 외부 효과)의 의미를 쓰고, 기업이 환경오염 물질을 배출할 때 정부가 이를 교정하기 위해 취할 수 있는 경제적 유인책 1가지를 서술하시오.',
      answerText:
        '외부 불경제는 경제 활동이 제3자에게 의도치 않은 피해를 주면서도 대가를 치르지 않는 현상이며, 정부는 환경세(교정적 조세) 부과나 배출권 거래제 시행으로 이를 내부화할 수 있다.',
      explanation:
        '외부효과 개념과 피구세(교정적 조세) 또는 배출권 거래제를 정확히 연결해야 합니다.',
      scoringRubric: '외부 불경제 정의(4점) + 교정적 조세/배출권 거래제 제시(3점).',
    },
  ],
  통합과학: [
    {
      id: 'sci-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 4,
      unit: '화학 결합과 전기 전도성',
      prompt:
        '고체 상태에서는 전기 전도성이 없으나, 액체(용융) 상태나 수용액 상태에서 전기 전도성이 나타나는 물질로 옳은 것은?',
      choices: ['① 다이아몬드(C)', '② 염화 나트륨(NaCl)', '③ 설탕(C₁₂H₂₂O₁₁)', '④ 구리(Cu)', '⑤ 석영(SiO₂)'],
      correctIndex: 1,
      answerText: '② 염화 나트륨(NaCl)',
      explanation:
        '이온 결합 물질인 NaCl은 고체에서 이온이 고정되어 전류가 통하지 않지만, 물에 녹거나 용융되면 양이온과 음이온이 자유롭게 이동해 전류가 통합니다.',
    },
    {
      id: 'sci-2',
      number: 2,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: '충격량과 운동량 보존',
      prompt:
        '[서술형] 같은 높이에서 떨어지는 유리컵이 딱딱한 시멘트 바닥보다 푹신한 카펫 위에서 깨지지 않는 이유를 ‘충격량’, ‘충돌 시간’, ‘충격력’ 세 용어를 모두 사용하여 서술하시오.',
      answerText:
        '유리컵이 멈출 때까지 운동량 변화량(충격량)은 같지만, 카펫 위에서는 충돌 시간이 길어지므로 I = F·Δt 관계에 따라 컵이 받는 평균 힘(충격력)이 작아져 깨지지 않는다.',
      explanation:
        '충격량 I = Δp = F·Δt에서 I가 일정할 때 Δt가 증가하면 F가 반비례하여 감소합니다.',
      scoringRubric: '충격량 동일 명시(3점) + 충돌 시간 증가(2점) + 충격력 감소 인과(3점).',
    },
  ],
  물리학: [
    {
      id: 'phy-1',
      number: 1,
      questionType: '객관식',
      difficulty: '상',
      points: 5,
      unit: '뉴턴 운동 법칙과 역학적 에너지',
      prompt:
        '질량 2kg인 물체 A와 질량 3kg인 물체 B가 도르래를 통해 실로 연결되어 정지 상태에서 출발한다(마찰 무시, g=10m/s²). B가 아래로 2m 내려갔을 때 실이 A에 한 일은?',
      choices: ['① 12J', '② 18J', '③ 24J', '④ 30J', '⑤ 36J'],
      correctIndex: 2,
      answerText: '③ 24J',
      explanation:
        '계 전체 가속도 a = (30) / (2 + 3) = 6m/s². 실의 장력 T = 2 × 6 = 12N. 실이 A를 2m 당겼으므로 한 일 W = 12 × 2 = 24J입니다.',
    },
    {
      id: 'phy-2',
      number: 2,
      questionType: '서술형',
      difficulty: '중',
      points: 8,
      unit: '열역학 제1법칙',
      prompt:
        '[서술형] 이상기체가 단열 팽창할 때 기체의 내부 에너지와 온도는 어떻게 변하는지 열역학 제1법칙(Q = ΔU + W)을 이용해 서술하시오.',
      answerText:
        '단열 과정이므로 Q = 0이고, 기체가 외부에 일을 하므로 W > 0이다. 따라서 ΔU = -W < 0이 되어 내부 에너지가 감소하고 기체의 온도는 내려간다.',
      explanation: '단열(Q=0), 팽창(W>0)을 식에 대입해 ΔU 부호를 판정합니다.',
      scoringRubric: 'Q=0, W>0 조건(4점) + ΔU<0 및 온도 하강 결론(4점).',
    },
  ],
  화학: [
    {
      id: 'chem-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '몰과 화학 반응식 양적 관계',
      prompt:
        '25℃, 1기압에서 기체 1몰의 부피가 24L일 때, 프로페인(C₃H₈) 11g을 완전 연소시키는 데 필요한 산소(O₂)의 부피는? (원자량 C=12, H=1)',
      choices: ['① 12L', '② 24L', '③ 30L', '④ 48L', '⑤ 60L'],
      correctIndex: 2,
      answerText: '③ 30L',
      explanation:
        'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 프로페인 분자량 = 44이므로 11g은 0.25몰. 필요한 산소는 0.25×5 = 1.25몰 = 1.25×24L = 30L입니다.',
    },
  ],
  생명과학: [
    {
      id: 'bio-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '흥분의 전도와 활동 전위',
      prompt:
        '뉴런 축삭 돌기의 탈분극(활동 전위 상승) 구간에서 세포막 이온 통로 상태와 이온 이동 방향을 바르게 짝지은 것은?',
      choices: [
        '① Na⁺ 통로 열림, Na⁺ 세포 안으로 유입',
        '② Na⁺ 통로 열림, Na⁺ 세포 밖으로 유출',
        '③ K⁺ 통로 열림, K⁺ 세포 안으로 유입',
        '④ K⁺ 통로 열림, K⁺ 세포 밖으로 유출',
        '⑤ Na⁺-K⁺ 펌프만 단독 작동',
      ],
      correctIndex: 0,
      answerText: '① Na⁺ 통로 열림, Na⁺ 세포 안으로 유입',
      explanation:
        '역치 이상의 자극이 오면 나트륨 통로가 열려 농도 기울기에 따라 Na⁺이 세포 안으로 급격히 확산 유입되며 막전위가 상승합니다.',
    },
  ],
  지구과학: [
    {
      id: 'earth-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 4,
      unit: '엘니뇨와 라니냐',
      prompt:
        '평상시보다 무역풍이 약화되어 동태평양 적도 해역의 용승이 줄고 표층 수온이 높아지는 엘니뇨 시기에 나타나는 현상으로 옳은 것은?',
      choices: [
        '① 동태평양 해수면 기압이 평년보다 높아진다.',
        '② 서태평양(인도네시아 부근)에 극심한 홍수가 발생한다.',
        '③ 페루 연안 어획량이 크게 증가한다.',
        '④ 동태평양 적도 해역에 강수량이 평년보다 증가한다.',
        '⑤ 서태평양 표층 수온이 평년보다 크게 상승한다.',
      ],
      correctIndex: 3,
      answerText: '④ 동태평양 적도 해역에 강수량이 평년보다 증가한다.',
      explanation:
        '엘니뇨 시에는 따뜻한 해수가 동쪽으로 이동하여 동태평양 해역에서 상승 기류가 발달하고 기압이 낮아지며 강수량이 증가합니다.',
    },
  ],
  경제: [
    {
      id: 'econ-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '수요·공급의 가격 탄력성',
      prompt:
        '어떤 재화의 가격이 10% 상승했을 때 수요량이 4% 감소하였다면, 이 재화의 수요의 가격 탄력성과 기업의 판매 수입 변화로 옳은 것은?',
      choices: [
        '① 0.4(비탄력적), 판매 수입 증가',
        '② 0.4(비탄력적), 판매 수입 감소',
        '③ 2.5(탄력적), 판매 수입 증가',
        '④ 2.5(탄력적), 판매 수입 감소',
        '⑤ 1.0(단위탄력적), 판매 수입 불변',
      ],
      correctIndex: 0,
      answerText: '① 0.4(비탄력적), 판매 수입 증가',
      explanation:
        '수요의 가격 탄력성 = |4% / 10%| = 0.4 < 1(비탄력적). 비탄력적인 재화는 가격 상승률보다 수요량 감소율이 작아 총판매 수입(P×Q)이 증가합니다.',
    },
  ],
  '정치와 법': [
    {
      id: 'law-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: '정부 형태와 헌법 기관',
      prompt:
        '우리나라 헌법상 대통령제 요소에 의원내각제적 요소가 가미된 특징으로 옳지 않은 것은?',
      choices: [
        '① 국무총리 제도 및 국무회의 심의',
        '② 국회의 국무총리·국무위원 해임건의권',
        '③ 행정부의 법률안 제출권',
        '④ 대통령의 국회 해산권 보유',
        '⑤ 국회의원의 국무위원 겸직 허용',
      ],
      correctIndex: 3,
      answerText: '④ 대통령의 국회 해산권 보유',
      explanation:
        '현행 대한민국 헌법은 대통령의 국회 해산권을 인정하지 않습니다.',
    },
  ],
  '사회·문화': [
    {
      id: 'sc-1',
      number: 1,
      questionType: '객관식',
      difficulty: '중',
      points: 4,
      unit: '사회 계층 이동과 표 분석',
      prompt:
        '기능론과 갈등론의 사회 불평등 현상에 대한 설명으로 옳은 것은?',
      choices: [
        '① 갈등론은 직무의 기능적 중요도에 따라 차등 보상이 불가피하다고 본다.',
        '② 기능론은 가정 배경과 권력 세습이 불평등의 주원인이라고 본다.',
        '③ 기능론은 차등 보상이 개인의 성취 동기를 자극해 사회 발전에 기여한다고 본다.',
        '④ 갈등론은 사회 불평등이 구성원 모두의 합의를 통해 자연스럽게 형성된다고 본다.',
        '⑤ 두 이론 모두 불평등 현상을 완전히 제거해야 할 병리적 현상으로만 본다.',
      ],
      correctIndex: 2,
      answerText: '③',
      explanation:
        '기능론은 사회적 희소가치의 차등 분배가 능력 있는 인재를 적재적소에 배치하고 성취 동기를 높이는 기능적 역할을 한다고 봅니다.',
    },
  ],
};

export function getSuggestedScopesForSubject(subjectName: string): string[] {
  const cat = normalizeSubjectCategory(subjectName);
  const map: Record<string, string[]> = {
    공통국어: ['음운 변동과 한글 맞춤법', '현대시(윤동주) 표현 기법과 화자', '비문학 추론 및 핵심 논지 요약'],
    문학: ['현대시 화자와 시적 상황', '고전시가와 자연관', '현대소설 서술상 특징과 갈등'],
    독서: ['인문·철학 지문 논지 비교', '경제·법 제시문 비례 관계 추론', '과학·기술 원리 적용'],
    '언어와 매체': ['15세기 중세 국어 문법', '문장 성분과 안은문장·이어진문장', '매체 언어 특성과 정보 신뢰도'],
    수학: ['다항식의 연산과 나머지 정리', '복소수와 이차함수의 최대·최소', '집합·명제와 산술기하 절대부등식'],
    미적분: ['수열의 극한과 등비급수 수렴 조건', '여러 가지 함수의 미분법(몫·합성)', '도함수 활용(극대·극소와 변곡점)'],
    '확률과 통계': ['중복조합과 부정방정식의 해', '조건부확률과 베이즈 정리', '이산확률변수와 정규분포 표준화'],
    기하: ['포물선·타원·쌍곡선의 정의', '평면벡터의 내적과 수직 조건', '공간도형과 정사영'],
    영어: ['관계대명사·분사구문 어법', '빈칸 추론 및 문단 요약', 'It~that 강조구문 조건 영작'],
    정보: ['이진수·진법 변환과 데이터 압축', '파이썬 제어문과 반복문 추적', '순차 탐색 vs 이진 탐색 알고리즘'],
    인기초: ['지도·비지도·강화학습 유형 구분', '퍼셉트론과 XOR 비선형·오차역전파', '과적합(Overfitting) 완화와 AI 윤리'],
    한국사: ['흥선대원군~갑오개혁 근대화 개혁', '대한제국 광무개혁과 애국계몽운동', '1920년대 민족협동전선(신간회)'],
    통합사회: ['롤스 vs 노직 정의관 비교', '시장 실패(외부효과)와 정부 개입', '세계화와 문화 다양성 보존'],
    통합과학: ['이온 결합·공유 결합과 전기 전도성', '충격량(I=FΔt)과 운동량 보존', '생태계 평형과 지구 환경 변화'],
    물리학: ['뉴턴 운동 제2법칙과 도르래 일·에너지', '열역학 제1법칙(등온·단열 과정)', '파동의 굴절과 전자기 유도'],
    화학: ['몰(mol)과 화학 반응식 양적 관계', '원자의 전자 배치와 주기적 성질', '산·염기 중화 적정'],
    생명과학: ['뉴런 흥분의 전도(탈분극·재분극)', '근수축 원리와 항상성(호르몬)', '유전 가계도와 돌연변이'],
    지구과학: ['판 구조론과 마그마 생성 조건', '엘니뇨·라니냐와 대기 대순환', '별의 진화와 H-R도'],
    경제: ['수요·공급 탄력성과 판매 수입', '국내총생산(GDP)과 인플레이션', '환율 변동과 경상수지'],
    '정치와 법': ['대통령제·의원내각제 정부 형태', '기본권 제한과 헌법재판소', '민법상 계약과 불법행위 손해배상'],
    '사회·문화': ['기능론 vs 갈등론 사회 불평등', '사회 계층 이동 도표 분석', '양적 연구 vs 질적 연구'],
  };
  return (
    map[cat] ?? [
      `${subjectName} 1단원 핵심 개념과 용어 정의`,
      `${subjectName} 자료 해석 및 사례 적용`,
      `${subjectName} 서술형 핵심 원리와 한계`,
    ]
  );
}

function createDynamicQuestionsForSubject(
  schoolName: string,
  subjectName: string,
  semester: SemesterType,
  examKind: ExamPeriodKind
): PastExamQuestion[] {
  const cat = normalizeSubjectCategory(subjectName);
  const bank = QUESTION_BANKS[cat];
  const examTag = `${semester} ${examKind === 'midterm' ? '중간고사' : '기말고사'}`;

  if (bank) {
    return bank.map((q, idx) => ({
      ...q,
      id: `${schoolName}-${subjectName}-${semester}-${examKind}-${idx}`,
    }));
  }

  return [
    {
      id: `${subjectName}-dyn-1`,
      number: 1,
      questionType: '객관식',
      difficulty: '하',
      points: 4,
      unit: `${subjectName} 핵심 개념 이해 (${examTag})`,
      prompt: `[${schoolName} ${subjectName}] 교과 개념을 새로운 자료·사례에 적용할 때 가장 핵심이 되는 분석 절차로 적절한 것은?`,
      choices: [
        '① 문제에서 제시된 핵심 변인·조건을 먼저 표시하고 정의와 연결한다.',
        '② 지문 조건을 읽지 않고 직관적 경험만으로 선지를 고른다.',
        '③ 예외 조항과 단서 조건을 모두 생략하고 일반화한다.',
        '④ 인과 관계의 방향을 반대로 가정하여 역추적만 시도한다.',
        '⑤ 단순 용어 암기만으로 복합 자료 문항을 해결한다.',
      ],
      correctIndex: 0,
      answerText: '①',
      explanation: `${subjectName} 내신 기출에서는 교과 정의와 제시 자료의 조건을 1:1로 대응해 함정 선지를 거르는 훈련이 필수입니다.`,
    },
    {
      id: `${subjectName}-dyn-2`,
      number: 2,
      questionType: '객관식',
      difficulty: '중',
      points: 5,
      unit: `${subjectName} 원리 응용 (${examTag})`,
      prompt: `[${schoolName} ${subjectName}] ${examTag} 기출 유형 중 자료 비교 문항에서 오답 선지가 자주 만들어지는 방식은?`,
      choices: [
        '① 원인과 결과의 방향을 반대로 바꾸거나 단서 조건을 누락한다.',
        '② 모든 선지에 교과서 원문 정의를 그대로 적는다.',
        '③ 그래프의 축 단위와 무관하게 최댓값만 묻는다.',
        '④ 핵심 개념을 전혀 언급하지 않고 출제한다.',
        '⑤ 복수 정답이 가능하도록 조건을 모두 열어둔다.',
      ],
      correctIndex: 0,
      answerText: '①',
      explanation: '선지의 주체·방향(증가/감소, 원인/결과) 반전과 예외 조건 누락을 가장 먼저 점검해야 합니다.',
    },
    {
      id: `${subjectName}-dyn-3`,
      number: 3,
      questionType: '서술형',
      difficulty: '상',
      points: 8,
      unit: `${subjectName} 심화 서술형 대비`,
      prompt: `[서술형] ${subjectName} 수업에서 다룬 핵심 원리 1가지를 선정하고, 일상생활 또는 전공 진로 분야에 적용된 사례와 한계점을 2문장 이내로 서술하시오.`,
      answerText: `${subjectName}의 핵심 원리는 실제 문제 상황에서 변수를 구조화해 예측 가능성을 높여주지만, 전제 조건이 달라질 경우 보정 검증이 필요하다.`,
      explanation:
        '서술형에서는 교과 핵심 용어 + 적용 맥락 + 한계(또는 조건) 세 요소가 들어가야 감점 없이 만점을 받습니다.',
      scoringRubric: '핵심 원리 정확성(4점) + 적용 사례 및 조건/한계 서술(4점).',
    },
  ];
}

export function getSchoolPastExam(
  schoolName: string,
  highSchoolType: HighSchoolType,
  subjectName: string,
  semester: SemesterType,
  examKind: ExamPeriodKind
): SchoolSubjectPastExam {
  const cleanSchool = schoolName.trim() || '재학 고등학교';
  const style = getSchoolStyle(cleanSchool, highSchoolType);

  let effectiveSemester = semester;
  let effectiveExamKind = examKind;

  if (subjectName === '정보') {
    effectiveSemester = '1학기';
    effectiveExamKind = 'final';
  } else if (subjectName.includes('인기초')) {
    effectiveSemester = '2학기';
    effectiveExamKind = 'final';
  }

  return {
    schoolName: cleanSchool,
    highSchoolType,
    subjectName,
    semester: effectiveSemester,
    examKind: effectiveExamKind,
    totalQuestionsInfo: style.totalQuestionsInfo,
    essayRatio: style.essayRatio,
    schoolTrendSummary: style.schoolTrendSummary,
    cutScoreEstimate: style.cutScoreEstimate,
    questions: createDynamicQuestionsForSubject(
      cleanSchool,
      subjectName,
      effectiveSemester,
      effectiveExamKind
    ),
  };
}
