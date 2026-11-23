import { UniversityInfo } from '../types/admission';

export const UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'seoul-national',
    name: '서울대학교',
    shortTag: '최상위 종합 · 연구중심',
    region: '서울 관악',
    type: '국립',
    overview:
      '대한민국을 대표하는 국가거점 연구중심 국립대학으로, 학문적 기초 역량과 자기주도적 탐구 깊이를 가장 중시합니다. 수시 지역균형·일반전형 모두 교과 이수 충실도와 세특의 지적 호기심을 정성적으로 면밀히 평가합니다.',
    admission2028Note:
      '5등급제 도입 이후 내신 1등급(상위 10%) 지원자가 급증함에 따라, 단순 등급 수치보다 모집단위별 핵심 권장과목 이수 여부와 심층 구술·면접, 교과 정성평가가 결정적 변수가 됩니다.',
    nineTierRange: [1.0, 1.5],
    fiveTierRange: [1.0, 1.15],
    mockPercentileMin: 98,
    mockAvgGradeMax: 1.25,
    majors: [
      {
        name: '컴퓨터공학부',
        track: '자연·공학',
        description:
          '알고리즘, 시스템 소프트웨어, 인공지능, 컴퓨터 구조 등 전산학의 이론과 공학적 구현을 깊이 탐구하는 학부입니다.',
        curriculum: ['이산수학', '자료구조와 알고리즘', '운영체제', '기계학습 기초'],
        careers: ['AI 연구원', '시스템 아키텍트', '테크 스타트업 창업', '대학원 진학'],
        recommendedElectives: ['미적분', '기하', '확률과 통계', '물리학', '정보'],
        fitAdvice: '수학적 증명력과 코딩/알고리즘 프로젝트를 세특에 연결한 학생에게 적합합니다.',
      },
      {
        name: '경제학부',
        track: '상경·경영',
        description:
          '미시·거시경제 이론과 계량경제학적 데이터 분석을 결합하여 시장과 정책의 작동 원리를 탐구합니다.',
        curriculum: ['미시경제이론', '거시경제이론', '계량경제학', '금융경제학'],
        careers: ['한국은행·금융공기업', '경제연구소 애널리스트', '행정고시(재경)', '투자은행'],
        recommendedElectives: ['미적분', '확률과 통계', '경제', '사회·문화'],
        fitAdvice: '인문·상경 계열이지만 수학(미적분·확통) 기반 정량 분석 역량이 매우 중요합니다.',
      },
      {
        name: '의예과',
        track: '의약학·생명',
        description:
          '기초의학부터 임상의학까지 인간의 생명과 질병을 탐구하며 윤리적·과학적 역량을 갖춘 의료인을 양성합니다.',
        curriculum: ['인체해부학', '생화학', '병리학', '임상실습 및 의학연구'],
        careers: ['임상의사', '의과학자(MD-PhD)', '보건의료 정책 전문가'],
        recommendedElectives: ['미적분', '생명과학', '화학', '생명과학 실험'],
        fitAdvice: '최상위권 내신·수능과 더불어 생명윤리 및 과학 탐구 진정성이 핵심입니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '기하', '물리학'], recommended: ['확률과 통계', '화학', '정보'] },
      { track: '상경·경영', core: ['미적분', '확률과 통계'], recommended: ['경제', '사회·문화'] },
      { track: '의약학·생명', core: ['생명과학', '화학'], recommended: ['미적분', '물리학'] },
    ],
  },
  {
    id: 'kaist',
    name: 'KAIST (한국과학기술원)',
    shortTag: '이공계 특성화 · 과기원',
    region: '대전 유성',
    type: '과기원',
    overview:
      '수시 지원 6회 제한에 포함되지 않는 특별법 설립 이공계 특성화 대학입니다. 무학과(자율전공) 입학 후 1학년 말 전공을 자유롭게 선택하며, 영어 강의 및 학부생 연구(URP) 프로그램이 강력합니다.',
    admission2028Note:
      '5등급제에서도 수학·과학 심화과목(진로선택·전문교과) 이수 수준과 과학적 문제 해결 과정, 면접(수학·과학 구술)의 비중이 절대적입니다.',
    nineTierRange: [1.0, 1.7],
    fiveTierRange: [1.0, 1.25],
    mockPercentileMin: 97,
    mockAvgGradeMax: 1.4,
    majors: [
      {
        name: '무학과 입학 (전산학부·전기및전자공학부 등 선택)',
        track: '자연·공학',
        description:
          '입학 시 전공을 정하지 않고 기초과학과 SW를 폭넓게 탐색한 뒤, 반도체·AI·로보틱스·항공우주 등으로 진출합니다.',
        curriculum: ['미적분학', '일반물리학', '프로그래밍 기초', 'URP 학부연구'],
        careers: ['글로벌 빅테크 R&D', '반도체·배터리 핵심 연구원', '딥테크 창업'],
        recommendedElectives: ['미적분', '기하', '물리학', '화학', '정보'],
        fitAdvice: '내신 숫자 하나보다 수학·과학 탐구보고서와 실패 후 개선 과정이 돋보여야 합니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '기하', '물리학', '화학'], recommended: ['정보', '인공지능 기초'] },
    ],
  },
  {
    id: 'yonsei',
    name: '연세대학교',
    shortTag: '신촌 · 글로벌·융합 강점',
    region: '서울 서대문',
    type: '사립',
    overview:
      '자유로운 학풍과 국제화 인프라, 송도 국제캠퍼스 RC 교육이 특징인 명문 사립대입니다. 경영·상경, 생명시스템, 반도체·인공지능 첨단학과 및 언더우드국제대학(UIC) 등 폭넓은 선택지를 제공합니다.',
    admission2028Note:
      '추천형(교과)은 내신 5등급제 1등급 초반대와 수능 최저 또는 면접을 요구하며, 활동우수형(학종)은 계열 적합성 및 교과 성취도의 추이를 중점 평가합니다.',
    nineTierRange: [1.1, 1.8],
    fiveTierRange: [1.0, 1.3],
    mockPercentileMin: 95,
    mockAvgGradeMax: 1.5,
    majors: [
      {
        name: '경영학과',
        track: '상경·경영',
        description:
          '재무, 마케팅, 회계, 경영전략, 데이터 애널리틱스 등 기업 경영의 전 영역을 글로벌 사례 중심으로 학습합니다.',
        curriculum: ['재무관리', '마케팅원론', '경영통계학', '전략경영'],
        careers: ['전략컨설팅', '금융권·PEF', '대기업 기획·마케팅', '공인회계사(CPA)'],
        recommendedElectives: ['확률과 통계', '미적분', '경제', '영어권 문화'],
        fitAdvice: '비즈니스 사례를 사회·경제 데이터와 연결해 분석한 세특이 좋은 평가를 받습니다.',
      },
      {
        name: '시스템반도체공학과',
        track: '자연·공학',
        description:
          '삼성전자 채용연계형 계약학과로, 차세대 반도체 소자·설계·공정을 집중 교육하며 산학 장학 혜택을 제공합니다.',
        curriculum: ['반도체물리', '전자회로', '디지털시스템설계', '반도체공정실습'],
        careers: ['삼성전자 반도체 R&D', '팹리스 설계 엔지니어'],
        recommendedElectives: ['미적분', '기하', '물리학', '화학'],
        fitAdvice: '물리학 전자기·반도체 단원과 수학 미적분을 깊이 탐구한 이력이 핵심입니다.',
      },
      {
        name: '심리학과',
        track: '인문·사회',
        description:
          '인지심리, 신경과학, 사회심리, 임상심리를 아우르며 인간 행동과 마음을 과학적·통계적으로 탐구합니다.',
        curriculum: ['인지심리학', '심리통계', '신경심리학', '실험심리연구'],
        careers: ['UX 리서처', '데이터 분석가', '임상·상담심리사', '인사(HR) 전문가'],
        recommendedElectives: ['확률과 통계', '사회·문화', '생명과학', '심리학'],
        fitAdvice: '설문·실험 설계 및 통계 해석 경험을 사회탐구·수학 세특에 담으면 돋보입니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '화학', '확률과 통계'] },
      { track: '상경·경영', core: ['확률과 통계'], recommended: ['미적분', '경제', '사회·문화'] },
      { track: '인문·사회', core: ['사회·문화'], recommended: ['확률과 통계', '윤리와 사상', '세계사'] },
    ],
  },
  {
    id: 'korea',
    name: '고려대학교',
    shortTag: '안암 · 탄탄한 기초·수능최저',
    region: '서울 성북',
    type: '사립',
    overview:
      '학교추천전형과 학업우수전형 등 다양한 수시 전형을 운영하며, 탄탄한 법학·인문사회 전통과 더불어 차세대통신·스마트모빌리티 등 첨단 공학 분야를 적극 육성하고 있습니다.',
    admission2028Note:
      '교과 및 학업우수형에서 수능 최저학력기준의 영향력이 큰 편입니다. 5등급제에서는 1등급대 내신 확보와 동시에 모의고사 국·수·영·탐 합산 등급 관리가 필수입니다.',
    nineTierRange: [1.1, 1.9],
    fiveTierRange: [1.0, 1.35],
    mockPercentileMin: 95,
    mockAvgGradeMax: 1.55,
    majors: [
      {
        name: '자유전공학부',
        track: '자율전공·통합',
        description:
          '인문·사회·데이터·법학 등 다양한 학문을 탐색한 뒤 2학년 진급 시 법·정경·경영·컴퓨터 등 희망 전공을 선택합니다.',
        curriculum: ['기초법학', '데이터사이언스 입문', '공공정책론'],
        careers: ['법조계(로스쿨)', '공공기관·행정', '데이터 기반 컨설팅'],
        recommendedElectives: ['확률과 통계', '미적분', '정치와 법', '경제'],
        fitAdvice: '인문사회와 수리·데이터 역량을 융합한 탐구 이력이 강점이 됩니다.',
      },
      {
        name: '전기전자공학부',
        track: '자연·공학',
        description:
          '회로이론, 신호처리, 통신, 제어공학, 반도체 소자까지 ICT 산업의 근간이 되는 기술을 폭넓게 다룹니다.',
        curriculum: ['전자기학', '신호 및 시스템', '마이크로프로세서', '집적회로'],
        careers: ['반도체·통신 대기업', '자율주행·로봇 엔지니어', '변리사'],
        recommendedElectives: ['미적분', '기하', '물리학', '정보'],
        fitAdvice: '수학적 모델링과 물리학 전자기 현상 탐구 기록이 잘 어울립니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '화학', '정보'] },
      { track: '인문·사회', core: ['정치와 법', '사회·문화'], recommended: ['확률과 통계', '경제'] },
    ],
  },
  {
    id: 'skku',
    name: '성균관대학교',
    shortTag: '수원/명륜 · 대계열·첨단융합',
    region: '서울 종로 / 경기 수원',
    type: '사립',
    overview:
      '인문과학캠퍼스(서울)와 자연과학캠퍼스(수원)로 이원화되어 있으며, 글로벌경영·반도체시스템·소프트웨어·약학 등 취업 및 연구 경쟁력이 매우 높은 대학입니다.',
    admission2028Note:
      '융합형·탐구형으로 학종 전형을 세분화하여, 학생부의 전반적 우수성(융합형) 또는 특정 전공 분야의 깊은 탐구력(탐구형)에 맞춰 지원 전략을 세울 수 있습니다.',
    nineTierRange: [1.3, 2.2],
    fiveTierRange: [1.05, 1.5],
    mockPercentileMin: 93,
    mockAvgGradeMax: 1.75,
    majors: [
      {
        name: '소프트웨어학과',
        track: '자연·공학',
        description:
          'SW 중심대학 선도 학과로 인공지능, 클라우드, 보안, 빅데이터 분야의 실무와 이론 프로젝트를 집중 수행합니다.',
        curriculum: ['컴퓨터프로그래밍', '데이터베이스', '인공지능', '소프트웨어공학'],
        careers: ['백엔드·AI 엔지니어', '플랫폼 기업 개발자', '정보보안 전문가'],
        recommendedElectives: ['미적분', '확률과 통계', '정보', '인공지능 수학'],
        fitAdvice: '단순 코딩 체험보다 알고리즘 효율성 분석이나 수학 모델링 결합 탐구가 유리합니다.',
      },
      {
        name: '글로벌경제학과',
        track: '상경·경영',
        description:
          '영어 전용 트랙과 수리·계량 중심 커리큘럼을 바탕으로 글로벌 금융·경제 전문가를 양성합니다.',
        curriculum: ['수리경제학', '국제금융론', '계량분석', '게임이론'],
        careers: ['글로벌 투자은행', '경제정책기관', '자산운용사'],
        recommendedElectives: ['미적분', '확률과 통계', '경제', '심화영어'],
        fitAdvice: '영어 원서·해외 리포트 기반의 경제 현상 탐구 기록이 강력한 무기가 됩니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '화학', '정보'] },
      { track: '상경·경영', core: ['확률과 통계', '경제'], recommended: ['미적분', '사회·문화'] },
    ],
  },
  {
    id: 'sogang',
    name: '서강대학교',
    shortTag: '신촌 · 다전공·소수정예',
    region: '서울 마포',
    type: '사립',
    overview:
      '학점 관리와 학업 엄격성, 그리고 전공 진입 장벽 없는 다전공(복수전공) 제도가 최대 강점입니다. 인문 계열로 입학해도 경영학·컴퓨터공학 복수전공이 자유롭습니다.',
    admission2028Note:
      '면접 없이 학생부 100%로 평가하는 학종 비율이 높아 세특의 문장 완결성과 자기주도적 학업 역량이 매우 중요합니다.',
    nineTierRange: [1.4, 2.3],
    fiveTierRange: [1.1, 1.55],
    mockPercentileMin: 92,
    mockAvgGradeMax: 1.85,
    majors: [
      {
        name: '지식융합미디어학부',
        track: '인문·사회',
        description:
          '신문방송, 미디어엔터테인먼트, 아트&테크놀로지를 아우르며 콘텐츠 기획과 디지털 기술을 융합합니다.',
        curriculum: ['디지털스토리텔링', '미디어데이터분석', '크리에이티브프로그래밍'],
        careers: ['콘텐츠 PD·기획자', 'UX/UI 디렉터', '미디어 테크 기업'],
        recommendedElectives: ['화법과 작문', '사회·문화', '정보', '확률과 통계'],
        fitAdvice: '인문학적 기획력에 디지털 도구·데이터를 접목해 본 활동이 잘 맞습니다.',
      },
      {
        name: '화공생명공학과',
        track: '자연·공학',
        description:
          '화학공학과 생명공학의 융합을 통해 친환경 에너지, 바이오의약품, 나노소재 공정을 연구합니다.',
        curriculum: ['유기화학', '열역학', '생물공학', '반응공학'],
        careers: ['배터리·소재 대기업', '바이오 제약 연구원', '정유·화학 플랜트'],
        recommendedElectives: ['미적분', '화학', '생명과학', '물리학'],
        fitAdvice: '화학 반응 메커니즘과 생명공학 응용 사례를 연결한 탐구가 효과적입니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '화학'], recommended: ['물리학', '생명과학', '기하'] },
      { track: '인문·사회', core: ['사회·문화'], recommended: ['확률과 통계', '경제'] },
    ],
  },
  {
    id: 'hanyang',
    name: '한양대학교',
    shortTag: '왕십리 · 실용학풍·산학연계',
    region: '서울 성동',
    type: '사립',
    overview:
      '대한민국 공학·산학협력의 산실로, 다이아몬드7 특성화 학과(융합전자, 미래자동차, 데이터사이언스, 파이낸스경영 등)의 전폭적인 장학·연구 지원이 돋보입니다.',
    admission2028Note:
      '수능 최저 없는 교과(추천형)와 학종(서류형/면접형)을 병행하며, 5등급제 환경에서는 성적 변동 추이와 전공 관련 교과 이수 학점이 중요해집니다.',
    nineTierRange: [1.3, 2.3],
    fiveTierRange: [1.08, 1.55],
    mockPercentileMin: 92,
    mockAvgGradeMax: 1.85,
    majors: [
      {
        name: '미래자동차공학과',
        track: '자연·공학',
        description:
          '자율주행, 전기차 파워트레인, 차량 제어 SW, 센서 융합 등 모빌리티 산업 핵심 기술을 교육합니다.',
        curriculum: ['동역학', '제어공학', '임베디드SW', '전기자동차시스템'],
        careers: ['완성차·전장 연구원', '자율주행 스타트업', '배터리 시스템 엔지니어'],
        recommendedElectives: ['미적분', '기하', '물리학', '정보'],
        fitAdvice: '물리학 역학·전자기 개념을 제어 프로그래밍과 연결해 탐구한 학생에게 추천합니다.',
      },
      {
        name: '파이낸스경영학과',
        track: '상경·경영',
        description:
          '전통 경영학에 재무공학·퀀트·핀테크 역량을 결합하여 금융 전문가를 집중 양성합니다.',
        curriculum: ['파생상품론', '기업재무', '파이썬금융분석', '투자론'],
        careers: ['자산운용·증권 애널리스트', '핀테크 PM', 'CPA'],
        recommendedElectives: ['미적분', '확률과 통계', '경제'],
        fitAdvice: '금융 지표 변동성을 수학·통계 함수로 모델링해 본 세특이 매우 유리합니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '화학', '정보'] },
      { track: '상경·경영', core: ['확률과 통계', '미적분'], recommended: ['경제'] },
    ],
  },
  {
    id: 'chungang',
    name: '중앙대학교',
    shortTag: '흑석 · CAU 융합·미디어·약학',
    region: '서울 동작',
    type: '사립',
    overview:
      '경영경제, 미디어커뮤니케이션, AI·소프트웨어, 약학·간호 등 전 계열에 걸쳐 균형 잡힌 높은 선호도를 유지하는 주요 사립대입니다.',
    admission2028Note:
      'CAU융합형인재(활동 폭넓음)와 CAU탐구형인재(전공 깊이 중시)로 전형이 명확히 나뉘어 있어 본인의 생기부 스타일에 맞춰 전략 선택이 가능합니다.',
    nineTierRange: [1.5, 2.5],
    fiveTierRange: [1.15, 1.65],
    mockPercentileMin: 90,
    mockAvgGradeMax: 2.0,
    majors: [
      {
        name: '미디어커뮤니케이션학부',
        track: '인문·사회',
        description:
          '언론, 광고홍보, 디지털 플랫폼 콘텐츠의 기획부터 수용자 데이터 분석까지 폭넓게 탐구합니다.',
        curriculum: ['저널리즘이론', '디지털광고전략', '미디어리서치', '영상제작실습'],
        careers: ['방송국·언론사', '대기업 브랜드 마케터', 'PR 컨설턴트'],
        recommendedElectives: ['화법과 작문', '사회·문화', '확률과 통계'],
        fitAdvice: '사회 이슈를 미디어 프레임과 여론 데이터로 비교 분석한 활동이 잘 어울립니다.',
      },
      {
        name: 'AI학과',
        track: '자연·공학',
        description:
          '딥러닝, 컴퓨터 비전, 자연어 처리 등 최신 인공지능 원리와 산업 적용 모델을 실습 중심으로 배웁니다.',
        curriculum: ['선형대수학', '딥러닝원론', '자연어처리', '컴퓨터비전'],
        careers: ['AI 모델 엔지니어', '데이터 사이언티스트', 'IT 서비스 연구개발'],
        recommendedElectives: ['미적분', '기하', '확률과 통계', '인공지능 기초'],
        fitAdvice: '행렬·벡터·확률 개념이 인공지능 손실함수나 분류기에 어떻게 쓰이는지 탐구하세요.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['확률과 통계', '기하', '정보'] },
      { track: '인문·사회', core: ['사회·문화'], recommended: ['확률과 통계', '정치와 법'] },
    ],
  },
  {
    id: 'kyunghee',
    name: '경희대학교',
    shortTag: '회기/국제 · 의치한약·호텔·공학',
    region: '서울 동대문 / 경기 용인',
    type: '사립',
    overview:
      '서울캠퍼스(인문·사회·의약학·호텔관광)와 국제캠퍼스(공학·전자정보·생명·소프트웨어)가 각각의 특화 영역에서 높은 학문적 위상을 갖고 있습니다.',
    admission2028Note:
      '네오르네상스전형(학종)은 교과 성적과 함께 공동체 역량 및 탐구 주제의 일관성을 중시합니다. 5등급제 적용 시 권장과목 이수 여부를 서류 평가에 적극 반영합니다.',
    nineTierRange: [1.6, 2.7],
    fiveTierRange: [1.2, 1.75],
    mockPercentileMin: 89,
    mockAvgGradeMax: 2.1,
    majors: [
      {
        name: '한의예과 / 약학과',
        track: '의약학·생명',
        description:
          '전통 의학의 현대적 과학화와 신약 개발·임상약학 연구를 통해 국민 보건에 기여하는 전문가를 양성합니다.',
        curriculum: ['생리학', '본초학/약제학', '임상진단', '유기화학'],
        careers: ['한의사', '약사·병원약사', '제약회사 신약 R&D'],
        recommendedElectives: ['화학', '생명과학', '미적분', '확률과 통계'],
        fitAdvice: '화학과 생명과학을 연계한 약물 기전·천연물 추출 탐구 보고서가 효과적입니다.',
      },
      {
        name: '호텔경영학과',
        track: '상경·경영',
        description:
          '글로벌 호스피탈리티 산업의 재무, 마케팅, 관광 서비스 전략을 실무 프로젝트와 함께 배웁니다.',
        curriculum: ['서비스마케팅', '호텔재무관리', '관광빅데이터', '컨벤션기획'],
        careers: ['글로벌 호텔 체인 매니저', '항공·여행 플랫폼', '서비스 컨설팅'],
        recommendedElectives: ['확률과 통계', '경제', '영어권 문화', '세계지리'],
        fitAdvice: '관광 소비 트렌드 통계 분석과 외국어 소통 역량을 결합한 활동이 좋습니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '의약학·생명', core: ['화학', '생명과학'], recommended: ['미적분', '확률과 통계'] },
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '화학', '정보'] },
    ],
  },
  {
    id: 'hufs',
    name: '한국외국어대학교',
    shortTag: '이문/글로벌 · 외국어·통번역·AI융합',
    region: '서울 동대문 / 경기 용인',
    type: '사립',
    overview:
      '세계 45개 언어 교육 인프라를 바탕으로 국제지역학, 통번역, Language & AI 융합학부 등 언어와 사회과학·IT를 결합한 독보적 전공을 운영합니다.',
    admission2028Note:
      '외국어·사회교과 성취도와 더불어 다문화·글로벌 이슈에 대한 꾸준한 탐구 흐름이 서류평가에서 높은 가점을 받습니다.',
    nineTierRange: [1.8, 3.0],
    fiveTierRange: [1.3, 1.95],
    mockPercentileMin: 87,
    mockAvgGradeMax: 2.3,
    majors: [
      {
        name: 'LD학부 (Language & Diplomacy)',
        track: '인문·사회',
        description:
          '외교관·국제기구 진출을 목표로 고급 외국어와 국제정치, 국제법, 통상 협상을 집중 교육합니다.',
        curriculum: ['국제정치경제', '국제법', '외교실무영어', '협상론'],
        careers: ['외교관(국립외교원)', '국제기구(UN 등)', '글로벌 기업 대외협력'],
        recommendedElectives: ['정치와 법', '세계사', '심화영어', '제2외국어'],
        fitAdvice: '국제 분쟁이나 통상 협정 이슈를 원문 기사와 함께 분석한 세특이 좋습니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '인문·사회', core: ['심화영어', '정치와 법'], recommended: ['세계사', '제2외국어'] },
    ],
  },
  {
    id: 'uos',
    name: '서울시립대학교',
    shortTag: '전농 · 공립·도시과학·높은 가성비',
    region: '서울 동대문',
    type: '국립',
    overview:
      '서울특별시가 운영하는 공립 종합대학으로, 반값 등록금 혜택과 함께 세무·도시행정·건축·토목·환경·컴퓨터과학 분야에서 탄탄한 경쟁력을 자랑합니다.',
    admission2028Note:
      '지역균형(교과)은 수능 최저 충족 여부가, 학생부종합전형(면접형)은 전공 분야에 대한 실제적인 문제의식과 논리적 답변력이 합불을 가릅니다.',
    nineTierRange: [1.7, 2.8],
    fiveTierRange: [1.25, 1.85],
    mockPercentileMin: 88,
    mockAvgGradeMax: 2.2,
    majors: [
      {
        name: '도시행정학과 / 세무학과',
        track: '인문·사회',
        description:
          '대도시의 정책·교통·주거 문제 또는 조세·회계 제도를 법학·경제학 기반으로 깊이 연구합니다.',
        curriculum: ['도시정책론', '조세법', '지방재정론', '행정계량분석'],
        careers: ['5·7급 공무원', '세무사·회계사', '국토·도시연구원'],
        recommendedElectives: ['정치와 법', '경제', '확률과 통계', '한국지리'],
        fitAdvice: '거주 지역의 실제 도시·교통·재정 문제를 데이터로 진단해 본 경험이 큰 강점입니다.',
      },
      {
        name: '건축학부',
        track: '자연·공학',
        description:
          '지속 가능한 도시 공간 설계와 친환경 건축 구조를 스튜디오 실기 및 공학 이론으로 학습합니다.',
        curriculum: ['건축설계스튜디오', '건축구조역학', '도시재생론', 'BIM설계'],
        careers: ['건축사(설계사무소)', '건설·부동산 디벨로퍼', '공간기획자'],
        recommendedElectives: ['기하', '미적분', '물리학', '미술/공학일반'],
        fitAdvice: '공간 기하학과 구조 역학, 사회적 포용성을 아우르는 건축 탐구 기록이 좋습니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '지구과학'] },
      { track: '인문·사회', core: ['경제', '정치와 법'], recommended: ['확률과 통계', '한국지리'] },
    ],
  },
  {
    id: 'ewha',
    name: '이화여자대학교',
    shortTag: '신촌 · 여성리더십·약학·교육',
    region: '서울 서대문',
    type: '사립',
    overview:
      '사범대학, 약학대학, 스크랜튼학부, 인공지능·데이터사이언스 등 폭넓은 학문 스펙트럼과 체계적인 진로 네트워크를 갖춘 종합대학입니다.',
    admission2028Note:
      '고교추천전형은 면접 비중이 있고 미래인재전형은 수능 최저가 적용되어, 내신과 수능 학습을 조화롭게 가져가는 전략이 유리합니다.',
    nineTierRange: [1.6, 2.7],
    fiveTierRange: [1.2, 1.75],
    mockPercentileMin: 89,
    mockAvgGradeMax: 2.1,
    majors: [
      {
        name: '초등교육과 / 수학교육과',
        track: '교육·사범',
        description:
          '교과 전문성과 에듀테크 교수법, 학생 상담 역량을 겸비한 미래형 교원을 양성합니다.',
        curriculum: ['교육심리학', '교과교재연구', '교육공학', '학교현장실습'],
        careers: ['초·중등 교사(임용)', '에듀테크 콘텐츠 기획자', '교육부·교육청 연구직'],
        recommendedElectives: ['확률과 통계', '교육학', '심리학', '사회·문화'],
        fitAdvice: '멘토링 경험 속에서 학습자 어려움을 어떻게 분석하고 교수법을 개선했는지 기록하세요.',
      },
    ],
    officialElectivesSummary: [
      { track: '교육·사범', core: ['교육학', '확률과 통계'], recommended: ['심리학', '사회·문화'] },
    ],
  },
  {
    id: 'konkuk',
    name: '건국대학교',
    shortTag: '광진 · KU자기추천·수의·바이오·IT',
    region: '서울 광진',
    type: '사립',
    overview:
      '넓은 도심 캠퍼스와 더불어 수의과대학, 바이오·생명공학, 스마트운행체, 부동산학과 등 특성화 학과가 강하며 최근 입결 상승세가 뚜렷한 대학입니다.',
    admission2028Note:
      'KU자기추천(학종)은 수능 최저 없이 1단계 서류, 2단계 면접으로 선발해 생기부 탐구 역량이 뛰어난 학생에게 인기가 높습니다.',
    nineTierRange: [1.9, 3.1],
    fiveTierRange: [1.35, 2.0],
    mockPercentileMin: 85,
    mockAvgGradeMax: 2.45,
    majors: [
      {
        name: '줄기세포재생공학과 / 생명공학',
        track: '의약학·생명',
        description:
          '세포치료제, 유전자 편집, 바이오 신소재 등 차세대 바이오 헬스케어 핵심 기술을 연구합니다.',
        curriculum: ['분자생물학', '세포생물학', '유전공학', '면역학'],
        careers: ['바이오의약품 R&D', '유전체 분석 기업', '국책 생명연구소'],
        recommendedElectives: ['생명과학', '화학', '미적분', '생명과학 실험'],
        fitAdvice: '생명과학 유전자 발현이나 세포 분화 메커니즘을 실험·논문으로 심화한 기록이 좋습니다.',
      },
      {
        name: '컴퓨터공학부',
        track: '자연·공학',
        description:
          '시스템 SW, 인공지능, 그래픽스, 정보보안 등 소프트웨어 산업 전반의 실전 개발 역량을 기릅니다.',
        curriculum: ['자료구조', '운영체제', '컴퓨터네트워크', '캡스톤디자인'],
        careers: ['SW 엔지니어', '게임·그래픽스 개발자', '클라우드 아키텍트'],
        recommendedElectives: ['미적분', '확률과 통계', '정보', '기하'],
        fitAdvice: '교과 수업에서 다룬 문제를 코드나 시뮬레이션으로 직접 구현해 본 경험이 빛납니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '의약학·생명', core: ['생명과학', '화학'], recommended: ['미적분'] },
      { track: '자연·공학', core: ['미적분', '정보'], recommended: ['물리학', '확률과 통계'] },
    ],
  },
  {
    id: 'dongguk',
    name: '동국대학교',
    shortTag: '남산 · 경찰행정·미디어·AI',
    region: '서울 중구',
    type: '사립',
    overview:
      '경찰행정학부, 영화영상학과, AI소프트웨어융합학부 등 차별화된 대표 학과를 보유하고 있으며, Do Dream 전형을 통해 활동 중심 인재를 적극 선발합니다.',
    admission2028Note:
      '고교 내신 5등급제에서도 전공에 대한 적극적인 탐색 과정과 교과 간 융합 탐구 기록이 있으면 내신 구간을 극복하고 합격하는 사례가 많습니다.',
    nineTierRange: [2.0, 3.2],
    fiveTierRange: [1.4, 2.05],
    mockPercentileMin: 84,
    mockAvgGradeMax: 2.55,
    majors: [
      {
        name: '경찰행정학부',
        track: '인문·사회',
        description:
          '형사법, 범죄학, 경찰조직론, 사이버수사 등을 연구하며 치안·사법·공공안전 리더를 양성합니다.',
        curriculum: ['형법총론', '범죄학', '경찰수사론', '행정법'],
        careers: ['경찰간부후보생', '국가정보원·검찰직', '기업 보안·법무팀'],
        recommendedElectives: ['정치와 법', '사회·문화', '윤리와 사상', '정보'],
        fitAdvice: '법과 사회 규범의 딜레마나 범죄 예방 데이터를 분석한 활동이 잘 어울립니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '인문·사회', core: ['정치와 법', '사회·문화'], recommended: ['윤리와 사상'] },
    ],
  },
  {
    id: 'hongik',
    name: '홍익대학교',
    shortTag: '홍대 · 디자인·건축·자율전공',
    region: '서울 마포',
    type: '사립',
    overview:
      '세계적 수준의 미술·디자인 계열뿐만 아니라 건축학부, 경영학부, 컴퓨터공학과, 캠퍼스자율전공(인문/자연)의 선호도가 높습니다.',
    admission2028Note:
      '학교생활우수자 전형(학종) 및 교과전형 모두 수능 최저학력기준이 높은 편이므로 내신과 수능 균형이 매우 중요합니다.',
    nineTierRange: [2.0, 3.3],
    fiveTierRange: [1.4, 2.1],
    mockPercentileMin: 84,
    mockAvgGradeMax: 2.5,
    majors: [
      {
        name: '캠퍼스자율전공 (자연·예능 / 인문·예능)',
        track: '자율전공·통합',
        description:
          '입학 후 계열 구분 없이 디자인, 공학, 경영 등 다양한 전공을 자유롭게 선택하고 융합할 수 있습니다.',
        curriculum: ['기초전공탐색', '디자인사고', '데이터기초', '전공심화트랙'],
        careers: ['프로덕트 디자이너', '서비스 기획자(PM)', 'IT·건축 융합 전문가'],
        recommendedElectives: ['확률과 통계', '미적분', '사회·문화', '미술창작'],
        fitAdvice: '다방면의 호기심을 하나의 프로젝트로 엮어낸 경험이 강점이 됩니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자율전공·통합', core: ['확률과 통계'], recommended: ['미적분', '사회·문화'] },
    ],
  },
  {
    id: 'pusan-knu',
    name: '부산대학교 / 경북대학교',
    shortTag: '영남 거점국립대 · 공학·사범·지역인재',
    region: '부산 / 대구',
    type: '국립',
    overview:
      '대한민국을 대표하는 지방거점국립대학으로 등록금이 매우 합리적이며, 공과대학(기계·전기·반도체), 사범대학, 공공기관 지역인재 채용 비율(30% 이상 의무화)에서 압도적 이점을 가집니다.',
    admission2028Note:
      '교과전형의 수능 최저학력기준 충족 여부가 핵심입니다. 내신 5등급제 1.8~2.5등급대 학생에게 국립대 장학·취업 가성비가 최고 수준입니다.',
    nineTierRange: [2.3, 3.8],
    fiveTierRange: [1.55, 2.45],
    mockPercentileMin: 78,
    mockAvgGradeMax: 3.0,
    majors: [
      {
        name: '기계공학부',
        track: '자연·공학',
        description:
          '열역학, 유체역학, 고체역학, 제어 및 로봇 설계를 바탕으로 조선·항공·자동차·에너지 산업 인재를 양성합니다.',
        curriculum: ['정역학·동역학', '유체역학', 'CAD/CAE설계', '메카트로닉스'],
        careers: ['방산·중공업·자동차 대기업', '한국전력 등 에너지 공기업'],
        recommendedElectives: ['미적분', '기하', '물리학'],
        fitAdvice: '물리학의 힘과 운동·열역학 개념을 실생활 기계 구조에 적용해 탐구하세요.',
      },
      {
        name: '영어교육과 / 국어교육과',
        track: '교육·사범',
        description:
          '국립대 사범대학의 체계적인 임용시험 대비 커리큘럼과 교육실습 인프라를 갖추고 있습니다.',
        curriculum: ['교과교육론', '언어학개론', '교수법세미나', '교육평가'],
        careers: ['국공립 중·고등학교 교사', '교육전문직(장학사)', '교육출판 기획'],
        recommendedElectives: ['언어와 매체', '심화영어', '교육학'],
        fitAdvice: '또래 튜터링이나 교과 학습자료 제작 경험을 진로활동과 세특에 담으세요.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '화학'] },
      { track: '교육·사범', core: ['언어와 매체', '교육학'], recommended: ['심화영어'] },
    ],
  },
  {
    id: 'kookmin-ssu-sejong',
    name: '국민대 · 숭실대 · 세종대',
    shortTag: '인서울 중상위 · SW·자동차·AI특화',
    region: '서울 성북/동작/광진',
    type: '사립',
    overview:
      '국민대(자동차·디자인·경영), 숭실대(컴퓨터·IT·금융), 세종대(소프트웨어·호텔·우주항공) 등 대학별로 확실한 시그니처 특성화 학과를 보유한 인서울 핵심 대학군입니다.',
    admission2028Note:
      '학종과 교과(수능최저 완화/폐지 추세)의 입결 스펙트럼이 넓어 5등급제 1.7~2.5등급대 학생이 소신·적정 카드로 적극 공략하기 좋습니다.',
    nineTierRange: [2.4, 3.6],
    fiveTierRange: [1.6, 2.3],
    mockPercentileMin: 79,
    mockAvgGradeMax: 2.9,
    majors: [
      {
        name: '컴퓨터학부 / 지능기전공학부',
        track: '자연·공학',
        description:
          '소프트웨어 개발부터 임베디드 시스템, 스마트 디바이스, 자율주행 SW까지 실무 중심 교육이 강점입니다.',
        curriculum: ['자료구조', '임베디드시스템', '머신러닝', 'SW산학프로젝트'],
        careers: ['IT 서비스 개발자', '모빌리티 SW 엔지니어', '보안 전문가'],
        recommendedElectives: ['미적분', '확률과 통계', '정보', '물리학'],
        fitAdvice: '실제 문제 해결을 위해 작은 웹/앱이나 데이터 분석 코드를 구현해 본 경험이 효과적입니다.',
      },
      {
        name: '경영학부 / 글로벌미디어학부',
        track: '상경·경영',
        description:
          '기업 경영 이론에 디지털 마케팅과 미디어 테크놀로지를 결합한 실용 중심 학부입니다.',
        curriculum: ['디지털마케팅', '재무회계', '데이터시각화', '브랜드매니지먼트'],
        careers: ['퍼포먼스 마케터', '이커머스 기획자', '일반기업 경영지원'],
        recommendedElectives: ['확률과 통계', '경제', '사회·문화'],
        fitAdvice: '소비자 트렌드나 마케팅 캠페인 성과를 데이터로 정리한 활동이 좋습니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '정보'], recommended: ['물리학', '확률과 통계'] },
      { track: '상경·경영', core: ['확률과 통계'], recommended: ['경제', '사회·문화'] },
    ],
  },
  {
    id: 'inha-ajou',
    name: '인하대학교 / 아주대학교',
    shortTag: '수도권 공학명문 · 항공·반도체·SW',
    region: '인천 / 경기 수원',
    type: '사립',
    overview:
      '수도권에 위치한 전통의 공학·의약학 강호로, 산학협력과 대기업 취업률이 매우 높고 항공우주·물류·국방디지털·의생명 분야가 특화되어 있습니다.',
    admission2028Note:
      '교과전형과 학종(미래인재/ACE)의 균형이 잘 잡혀 있으며, 내신 성적 추이가 우상향인 학생에게 유리한 평가를 제공합니다.',
    nineTierRange: [2.5, 3.8],
    fiveTierRange: [1.65, 2.45],
    mockPercentileMin: 77,
    mockAvgGradeMax: 3.1,
    majors: [
      {
        name: '항공우주공학과 / 소프트웨어학과',
        track: '자연·공학',
        description:
          '비행체 설계·공기역학·추진시스템 및 대규모 소프트웨어 아키텍처를 실습 중심으로 학습합니다.',
        curriculum: ['공기역학', '비행제어', '알고리즘', '클라우드컴퓨팅'],
        careers: ['항공우주·방산 기업(KAI, 한화에어로스페이스)', 'IT 대기업 개발자'],
        recommendedElectives: ['미적분', '기하', '물리학', '정보'],
        fitAdvice: '물리학 유체역학·운동법칙이나 코딩 프로젝트를 꾸준히 이어간 흐름이 중요합니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['기하', '정보'] },
    ],
  },
  {
    id: 'dankook-kwangwoon-gachon',
    name: '단국대 · 광운대 · 가천대',
    shortTag: '수도권 주요 · 반도체·전자·바이오',
    region: '경기 용인 / 서울 노원 / 경기 성남',
    type: '사립',
    overview:
      '전자정보·로봇(광운대), 반도체·IT·의생명(단국대), 바이오나노·배터리·AI(가천대) 등 산업 수요에 맞춘 실전형 전공 개편이 가장 빠른 대학들입니다.',
    admission2028Note:
      '가천대 논술(약술형 논술) 등 내신 중위권 학생이 교과·논술로 역전할 수 있는 전형 선택지도 다양합니다.',
    nineTierRange: [2.9, 4.4],
    fiveTierRange: [1.9, 2.75],
    mockPercentileMin: 70,
    mockAvgGradeMax: 3.6,
    majors: [
      {
        name: '반도체공학과 / 전자공학과',
        track: '자연·공학',
        description:
          '클린룸 실습과 회로 설계 툴을 활용해 현장 즉시 투입 가능한 반도체·전자 엔지니어를 기릅니다.',
        curriculum: ['반도체소자', '디지털논리회로', '마이크로컨트롤러', '공정실습'],
        careers: ['반도체 소자·장비 기업', '전자제품 R&D', '임베디드 개발자'],
        recommendedElectives: ['미적분', '물리학', '화학'],
        fitAdvice: '교과 내신 관리와 함께 물리·화학 기초 개념을 정확히 이해한 세특이 좋습니다.',
      },
      {
        name: '바이오로직스학과 / 간호학과',
        track: '의약학·생명',
        description:
          '송도·판교 바이오클러스터와 연계한 바이오의약품 생산·품질관리 및 임상간호 교육을 제공합니다.',
        curriculum: ['생화학', '바이오공정', '임상간호실습', '미생물학'],
        careers: ['삼성바이오로직스·셀트리온', '대학병원 간호사', '제약 QC/QA'],
        recommendedElectives: ['생명과학', '화학', '확률과 통계'],
        fitAdvice: '생명과학 실험 태도와 보건·바이오 산업에 대한 꾸준한 관심을 드러내세요.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['미적분', '물리학'], recommended: ['화학', '정보'] },
      { track: '의약학·생명', core: ['생명과학', '화학'], recommended: ['확률과 통계'] },
    ],
  },
  {
    id: 'chungnam-jeonnam-incheon',
    name: '충남대 · 전남대 · 인천대',
    shortTag: '거점/인천 국립대 · 안정·공기업·연구',
    region: '대전 / 광주 / 인천',
    type: '국립',
    overview:
      '대전 대덕연구단지(충남대), 광주 AI·에너지 밸리(전남대), 송도 바이오·무역특구(인천대) 등 지역 핵심 산업과 직결된 국립대학군입니다.',
    admission2028Note:
      '내신 5등급제 2~3등급대(9등급제 3~4등급대) 학생들이 장학금과 안정적인 취업 경쟁력을 동시에 확보하기에 가장 좋은 선택지입니다.',
    nineTierRange: [3.3, 4.9],
    fiveTierRange: [2.1, 3.0],
    mockPercentileMin: 64,
    mockAvgGradeMax: 4.1,
    majors: [
      {
        name: '무역학부 / 행정학과',
        track: '상경·경영',
        description:
          '국제통상, 물류, 관세 실무 및 공공행정 정책을 배우며 공기업·무역상사 진출에 유리합니다.',
        curriculum: ['국제무역론', '관세법', '물류관리', '공기업론'],
        careers: ['무역·물류 대기업', '지역인재 공기업', '관세사'],
        recommendedElectives: ['경제', '정치와 법', '확률과 통계', '영어'],
        fitAdvice: '한국 무역 구조나 지역 산업 통계를 조사한 발표 기록이 효과적입니다.',
      },
      {
        name: '신소재공학과 / 응용화학공학과',
        track: '자연·공학',
        description:
          '이차전지, 디스플레이, 친환경 고분자 소재의 합성과 물성 평가를 교육합니다.',
        curriculum: ['재료열역학', '고분자공학', '결정학', '기기분석'],
        careers: ['이차전지·화학 소재 기업', '국책연구소 연구원'],
        recommendedElectives: ['화학', '물리학', '미적분'],
        fitAdvice: '화학과 물리 개념이 신소재 성능에 어떻게 결합되는지 탐구해 보세요.',
      },
    ],
    officialElectivesSummary: [
      { track: '상경·경영', core: ['경제', '확률과 통계'], recommended: ['정치와 법'] },
      { track: '자연·공학', core: ['화학', '미적분'], recommended: ['물리학'] },
    ],
  },
  {
    id: 'myongji-sangmyung-hansung',
    name: '명지대 · 상명대 · 한성대 · 경기대',
    shortTag: '수도권 실용 · 융합전공·적정안정',
    region: '서울 / 경기 용인·수원',
    type: '사립',
    overview:
      '수도권 통학이 가능하며 융합보안, 콘텐츠디자인, 데이터사이언스, 자유전공 등 실무 취업 중심의 교육과정을 운영하는 대학군입니다.',
    admission2028Note:
      '내신 5등급제 2등급 후반~3등급대 학생들이 교과전형·학종을 통해 안정적으로 서울·수도권 진학을 설계할 수 있습니다.',
    nineTierRange: [3.8, 5.6],
    fiveTierRange: [2.4, 3.35],
    mockPercentileMin: 52,
    mockAvgGradeMax: 4.8,
    majors: [
      {
        name: '데이터사이언스학과 / 스마트보안',
        track: '자연·공학',
        description:
          '파이썬·SQL 기반 빅데이터 처리, 웹 서비스 구현 및 정보보안 실무를 프로젝트 중심으로 배웁니다.',
        curriculum: ['파이썬데이터분석', '데이터베이스설계', '네트워크보안', '웹프로그래밍'],
        careers: ['데이터 분석가', '웹·앱 개발자', '정보보안 관제 엔지니어'],
        recommendedElectives: ['확률과 통계', '정보', '인공지능 기초'],
        fitAdvice: '공공데이터포털 데이터를 직접 정리·시각화해 본 세특 경험이 아주 좋습니다.',
      },
      {
        name: '글로벌비즈니스 / 휴먼서비스',
        track: '인문·사회',
        description:
          '실무 비즈니스 영어, 마케팅, 복지·상담 등 현장 적응력이 높은 사회과학 인재를 기릅니다.',
        curriculum: ['비즈니스커뮤니케이션', '사회조사방법론', '소비자심리', '마케팅실습'],
        careers: ['일반기업 영업·마케팅', '사회복지사·상담사', '유통·서비스 관리'],
        recommendedElectives: ['사회·문화', '확률과 통계', '심리학'],
        fitAdvice: '일상 속 사회 현상이나 소비 트렌드에 대해 설문·인터뷰를 진행한 활동이 강점입니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['정보', '확률과 통계'], recommended: ['미적분'] },
      { track: '인문·사회', core: ['사회·문화'], recommended: ['심리학', '경제'] },
    ],
  },
  {
    id: 'tukorea-hanbat-kangwon',
    name: '한국공학대 · 한밭대 · 강원대',
    shortTag: '산학특화/지역국립 · 실무취업',
    region: '경기 시흥 / 대전 / 강원 춘천',
    type: '국립',
    overview:
      '한국공학대(기업 밀착형 공학), 한밭대(대전 산학협력 국립대), 강원대(거점국립대·반도체/바이오) 등 내실 있는 교육과 높은 현장 취업률을 자랑합니다.',
    admission2028Note:
      '5등급제 3등급 중반~4등급 초반(9등급제 4.5~6.5등급)에서도 전형별 적성·교과 반영 과목 조합(상위 과목 반영 등)을 활용하면 충분히 합격권에 진입할 수 있습니다.',
    nineTierRange: [4.5, 6.8],
    fiveTierRange: [2.75, 4.0],
    mockPercentileMin: 38,
    mockAvgGradeMax: 5.8,
    majors: [
      {
        name: '기계설계공학과 / 메카트로닉스',
        track: '자연·공학',
        description:
          '3D CAD 설계, 자동화 장비 제어, 스마트팩토리 공정 기술을 현장 실습 위주로 습득합니다.',
        curriculum: ['기계설계실습', 'PLC제어', '스마트팩토리', '현장실습학기제'],
        careers: ['자동화 설비 엔지니어', '중견·강소 제조기업 R&D', '품질관리(QM)'],
        recommendedElectives: ['기하', '물리학', '공학일반'],
        fitAdvice: '동아리 제작 활동이나 공학 설계에서 시행착오를 고쳐 나간 과정이 핵심입니다.',
      },
      {
        name: '자율전공학부 / 경영·회계',
        track: '자율전공·통합',
        description:
          '전공 탐색 기간을 거쳐 실무 회계·세무·마케팅 또는 IT 융합 전공을 선택해 취업 역량을 쌓습니다.',
        curriculum: ['회계원리', '전산회계실무', '오피스데이터분석', '진로설계'],
        careers: ['회계·세무 실무자', '공공기관 행정직', '기업 총무·기획'],
        recommendedElectives: ['경제', '사회·문화', '확률과 통계'],
        fitAdvice: '학교 수업에 성실히 참여하고 조별 프로젝트에서 맡은 역할을 완수한 기록이 중요합니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['물리학', '기하'], recommended: ['정보'] },
      { track: '자율전공·통합', core: ['사회·문화'], recommended: ['경제'] },
    ],
  },
  {
    id: 'specialized-college',
    name: '동양미래대 · 인하공전 · 연암공대 등 특성화 전문대',
    shortTag: '고숙련 실무 · 대기업 산학·조기취업',
    region: '서울 / 인천 / 경남 진주',
    type: '사립',
    overview:
      '항공운항·기계·반도체장비·간호보건·디지털콘텐츠 등 특정 직무에 특화되어 대기업 현장직·기술직 취업률이 매우 높은 실용 고등교육 기관입니다.',
    admission2028Note:
      '내신 일부 학기 또는 최우수 몇 개 과목만 반영하는 경우가 많으므로, 5등급제 4~5등급대 학생이라도 포기하지 않고 주요 과목 성적과 면접을 준비하면 최상위 취업 트랙으로 진학할 수 있습니다.',
    nineTierRange: [5.5, 9.0],
    fiveTierRange: [3.2, 5.0],
    mockPercentileMin: 10,
    mockAvgGradeMax: 8.5,
    majors: [
      {
        name: '반도체전자과 / 스마트팩토리과',
        track: '자연·공학',
        description:
          '반도체 공정 장비 유지보수, 자동화 설비 제어, 전기기사·산업기사 자격증 취득을 집중 지원합니다.',
        curriculum: ['반도체장비실습', '전기기기', 'PLC자동화', '산학협력인턴십'],
        careers: ['삼성전자·SK하이닉스 설비엔지니어', '대기업 생산·기술직'],
        recommendedElectives: ['물리학', '화학', '정보'],
        fitAdvice: '성실한 출결과 실습·기술 분야에 대한 뚜렷한 목표 의식이 면접에서 큰 강점이 됩니다.',
      },
      {
        name: '간호학과 / 보건의료행정',
        track: '의약학·생명',
        description:
          '4년제 학사학위 과정의 간호학과 및 병원 행정·의료정보 관리 전문 인력을 양성합니다.',
        curriculum: ['해부생리학', '기본간호학', '병원임상실습', '의무기록관리'],
        careers: ['종합병원 간호사', '보건직 공무원', '의료기관 원무·심사팀'],
        recommendedElectives: ['생명과학', '보건', '사회·문화'],
        fitAdvice: '봉사활동과 보건·생명 분야의 책임감을 생기부에 꾸준히 남기는 것이 중요합니다.',
      },
    ],
    officialElectivesSummary: [
      { track: '자연·공학', core: ['물리학'], recommended: ['정보', '화학'] },
      { track: '의약학·생명', core: ['생명과학'], recommended: ['사회·문화'] },
    ],
  },
];
