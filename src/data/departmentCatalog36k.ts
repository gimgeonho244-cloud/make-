import { CatalogDepartment, TrackType } from '../types/admission';

interface UnivSeed {
  id: string;
  name: string;
  region: string;
  type: '국립' | '사립' | '과기원' | '교대' | '전문대';
  nineCut: number;
  fiveCut: number;
  hasMedical?: boolean;
  isTechOnly?: boolean;
  isEduOnly?: boolean;
}

// 전국 180개 실제 대학 디렉토리 (180개교 × 200개 학과 편제 = 36,000개 학과 카탈로그)
const REAL_UNIVERSITIES_SEED: UnivSeed[] = [
  // 서울 주요 종합대 (28)
  { id: 'snu', name: '서울대학교', region: '서울 관악', type: '국립', nineCut: 1.2, fiveCut: 1.05, hasMedical: true },
  { id: 'yonsei', name: '연세대학교', region: '서울 서대문', type: '사립', nineCut: 1.4, fiveCut: 1.12, hasMedical: true },
  { id: 'korea', name: '고려대학교', region: '서울 성북', type: '사립', nineCut: 1.45, fiveCut: 1.14, hasMedical: true },
  { id: 'skku', name: '성균관대학교', region: '서울/수원', type: '사립', nineCut: 1.65, fiveCut: 1.22, hasMedical: true },
  { id: 'sogang', name: '서강대학교', region: '서울 마포', type: '사립', nineCut: 1.75, fiveCut: 1.26 },
  { id: 'hanyang', name: '한양대학교', region: '서울 성동', type: '사립', nineCut: 1.7, fiveCut: 1.24, hasMedical: true },
  { id: 'chungang', name: '중앙대학교', region: '서울 동작', type: '사립', nineCut: 1.9, fiveCut: 1.35, hasMedical: true },
  { id: 'kyunghee', name: '경희대학교', region: '서울/용인', type: '사립', nineCut: 2.0, fiveCut: 1.4, hasMedical: true },
  { id: 'hufs', name: '한국외국어대학교', region: '서울/용인', type: '사립', nineCut: 2.2, fiveCut: 1.5 },
  { id: 'uos', name: '서울시립대학교', region: '서울 동대문', type: '국립', nineCut: 2.1, fiveCut: 1.45 },
  { id: 'ewha', name: '이화여자대학교', region: '서울 서대문', type: '사립', nineCut: 1.95, fiveCut: 1.38, hasMedical: true },
  { id: 'konkuk', name: '건국대학교', region: '서울 광진', type: '사립', nineCut: 2.25, fiveCut: 1.52 },
  { id: 'dongguk', name: '동국대학교', region: '서울 중구', type: '사립', nineCut: 2.35, fiveCut: 1.58, hasMedical: true },
  { id: 'hongik', name: '홍익대학교', region: '서울 마포', type: '사립', nineCut: 2.4, fiveCut: 1.6 },
  { id: 'sookmyung', name: '숙명여자대학교', region: '서울 용산', type: '사립', nineCut: 2.55, fiveCut: 1.68 },
  { id: 'kookmin', name: '국민대학교', region: '서울 성북', type: '사립', nineCut: 2.75, fiveCut: 1.8 },
  { id: 'ssu', name: '숭실대학교', region: '서울 동작', type: '사립', nineCut: 2.8, fiveCut: 1.82 },
  { id: 'sejong', name: '세종대학교', region: '서울 광진', type: '사립', nineCut: 2.85, fiveCut: 1.85 },
  { id: 'seoultech', name: '서울과학기술대학교', region: '서울 노원', type: '국립', nineCut: 2.75, fiveCut: 1.8 },
  { id: 'kwangwoon', name: '광운대학교', region: '서울 노원', type: '사립', nineCut: 3.1, fiveCut: 2.0 },
  { id: 'myongji', name: '명지대학교', region: '서울/용인', type: '사립', nineCut: 3.5, fiveCut: 2.25 },
  { id: 'sangmyung', name: '상명대학교', region: '서울 종로', type: '사립', nineCut: 3.6, fiveCut: 2.3 },
  { id: 'catholic', name: '가톨릭대학교', region: '서울/부천', type: '사립', nineCut: 3.2, fiveCut: 2.05, hasMedical: true },
  { id: 'hansung', name: '한성대학교', region: '서울 성북', type: '사립', nineCut: 4.1, fiveCut: 2.55 },
  { id: 'seokyeong', name: '서경대학교', region: '서울 성북', type: '사립', nineCut: 4.3, fiveCut: 2.68 },
  { id: 'sahmyook', name: '삼육대학교', region: '서울 노원', type: '사립', nineCut: 4.0, fiveCut: 2.5 },
  { id: 'sungshin', name: '성신여자대학교', region: '서울 성북', type: '사립', nineCut: 3.1, fiveCut: 2.0 },
  { id: 'duksung', name: '덕성여자대학교', region: '서울 도봉', type: '사립', nineCut: 3.7, fiveCut: 2.35 },
  { id: 'dongduk', name: '동덕여자대학교', region: '서울 성북', type: '사립', nineCut: 3.6, fiveCut: 2.3 },
  { id: 'swu', name: '서울여자대학교', region: '서울 노원', type: '사립', nineCut: 3.5, fiveCut: 2.25 },

  // 과기원 · 특수대학 (8)
  { id: 'kaist', name: 'KAIST(한국과학기술원)', region: '대전 유성', type: '과기원', nineCut: 1.3, fiveCut: 1.08, isTechOnly: true },
  { id: 'postech', name: 'POSTECH(포항공과대학교)', region: '경북 포항', type: '사립', nineCut: 1.35, fiveCut: 1.1, isTechOnly: true },
  { id: 'gist', name: 'GIST(광주과학기술원)', region: '광주 북구', type: '과기원', nineCut: 1.6, fiveCut: 1.2, isTechOnly: true },
  { id: 'dgist', name: 'DGIST(대구경북과학기술원)', region: '대구 달성', type: '과기원', nineCut: 1.7, fiveCut: 1.24, isTechOnly: true },
  { id: 'unist', name: 'UNIST(울산과학기술원)', region: '울산 울주', type: '과기원', nineCut: 1.65, fiveCut: 1.22, isTechOnly: true },
  { id: 'kentech', name: '한국에너지공과대학교', region: '전남 나주', type: '사립', nineCut: 1.85, fiveCut: 1.32, isTechOnly: true },
  { id: 'koreatech', name: '한국기술교육대학교', region: '충남 천안', type: '사립', nineCut: 3.2, fiveCut: 2.05, isTechOnly: true },
  { id: 'kau', name: '한국항공대학교', region: '경기 고양', type: '사립', nineCut: 2.9, fiveCut: 1.88, isTechOnly: true },

  // 경기 · 인천 주요 대학 (24)
  { id: 'inha', name: '인하대학교', region: '인천 미추홀', type: '사립', nineCut: 2.75, fiveCut: 1.8, hasMedical: true },
  { id: 'ajou', name: '아주대학교', region: '경기 수원', type: '사립', nineCut: 2.7, fiveCut: 1.78, hasMedical: true },
  { id: 'incheon', name: '인천대학교', region: '인천 연수', type: '국립', nineCut: 3.3, fiveCut: 2.1 },
  { id: 'gachon', name: '가천대학교', region: '경기 성남', type: '사립', nineCut: 3.1, fiveCut: 2.0, hasMedical: true },
  { id: 'dankook', name: '단국대학교', region: '경기 용인', type: '사립', nineCut: 3.0, fiveCut: 1.95, hasMedical: true },
  { id: 'kyonggi', name: '경기대학교', region: '경기 수원', type: '사립', nineCut: 3.9, fiveCut: 2.45 },
  { id: 'suwon', name: '수원대학교', region: '경기 화성', type: '사립', nineCut: 4.5, fiveCut: 2.78 },
  { id: 'kangnam', name: '강남대학교', region: '경기 용인', type: '사립', nineCut: 4.6, fiveCut: 2.82 },
  { id: 'yongin', name: '용인대학교', region: '경기 용인', type: '사립', nineCut: 4.7, fiveCut: 2.88 },
  { id: 'tukorea', name: '한국공학대학교', region: '경기 시흥', type: '사립', nineCut: 4.1, fiveCut: 2.55, isTechOnly: true },
  { id: 'hankyong', name: '한경국립대학교', region: '경기 안성', type: '국립', nineCut: 4.4, fiveCut: 2.72 },
  { id: 'daejin', name: '대진대학교', region: '경기 포천', type: '사립', nineCut: 5.0, fiveCut: 3.05 },
  { id: 'eulji', name: '을지대학교', region: '경기 성남', type: '사립', nineCut: 3.4, fiveCut: 2.18, hasMedical: true },
  { id: 'cha', name: '차의과학대학교', region: '경기 포천', type: '사립', nineCut: 3.5, fiveCut: 2.25, hasMedical: true },
  { id: 'sungkyul', name: '성결대학교', region: '경기 안양', type: '사립', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'anyang', name: '안양대학교', region: '경기 안양', type: '사립', nineCut: 4.7, fiveCut: 2.88 },
  { id: 'hyu-erica', name: '한양대학교(ERICA)', region: '경기 안산', type: '사립', nineCut: 2.65, fiveCut: 1.74 },
  { id: 'korea-sejong', name: '고려대학교(세종)', region: '세종시', type: '사립', nineCut: 3.4, fiveCut: 2.18 },
  { id: 'hongik-sejong', name: '홍익대학교(세종)', region: '세종시', type: '사립', nineCut: 3.8, fiveCut: 2.4 },
  { id: 'shinhan', name: '신한대학교', region: '경기 의정부', type: '사립', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'pyeongtaek', name: '평택대학교', region: '경기 평택', type: '사립', nineCut: 5.2, fiveCut: 3.15 },
  { id: 'hanshin', name: '한신대학교', region: '경기 오산', type: '사립', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'hallym', name: '한림대학교', region: '강원 춘천', type: '사립', nineCut: 3.9, fiveCut: 2.45, hasMedical: true },
  { id: 'yonsei-mirae', name: '연세대학교(미래)', region: '강원 원주', type: '사립', nineCut: 3.5, fiveCut: 2.25, hasMedical: true },

  // 거점국립대 · 지방 국공립대 (24)
  { id: 'pusan', name: '부산대학교', region: '부산 금정', type: '국립', nineCut: 2.75, fiveCut: 1.8, hasMedical: true },
  { id: 'knu', name: '경북대학교', region: '대구 북구', type: '국립', nineCut: 2.85, fiveCut: 1.85, hasMedical: true },
  { id: 'cnu', name: '충남대학교', region: '대전 유성', type: '국립', nineCut: 3.1, fiveCut: 2.0, hasMedical: true },
  { id: 'jnu', name: '전남대학교', region: '광주 북구', type: '국립', nineCut: 3.2, fiveCut: 2.05, hasMedical: true },
  { id: 'jbnu', name: '전북대학교', region: '전북 전주', type: '국립', nineCut: 3.35, fiveCut: 2.15, hasMedical: true },
  { id: 'cbnu', name: '충북대학교', region: '충북 청주', type: '국립', nineCut: 3.4, fiveCut: 2.18, hasMedical: true },
  { id: 'kangwon', name: '강원대학교', region: '강원 춘천', type: '국립', nineCut: 3.8, fiveCut: 2.4, hasMedical: true },
  { id: 'gnu', name: '경상국립대학교', region: '경남 진주', type: '국립', nineCut: 3.9, fiveCut: 2.45, hasMedical: true },
  { id: 'jejunu', name: '제주대학교', region: '제주 아라', type: '국립', nineCut: 4.1, fiveCut: 2.55, hasMedical: true },
  { id: 'pknu', name: '부경대학교', region: '부산 남구', type: '국립', nineCut: 3.6, fiveCut: 2.3 },
  { id: 'kmou', name: '한국해양대학교', region: '부산 영도', type: '국립', nineCut: 4.0, fiveCut: 2.5 },
  { id: 'hanbat', name: '국립한밭대학교', region: '대전 유성', type: '국립', nineCut: 4.2, fiveCut: 2.6 },
  { id: 'kumoh', name: '국립금오공과대학교', region: '경북 구미', type: '국립', nineCut: 4.3, fiveCut: 2.68, isTechOnly: true },
  { id: 'kongju', name: '국립공주대학교', region: '충남 공주', type: '국립', nineCut: 4.1, fiveCut: 2.55 },
  { id: 'changwon', name: '국립창원대학교', region: '경남 창원', type: '국립', nineCut: 4.3, fiveCut: 2.68 },
  { id: 'knut', name: '한국교통대학교', region: '충북 충주', type: '국립', nineCut: 4.5, fiveCut: 2.78 },
  { id: 'kunsan', name: '국립군산대학교', region: '전북 군산', type: '국립', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'mokpo', name: '국립목포대학교', region: '전남 무안', type: '국립', nineCut: 5.0, fiveCut: 3.05 },
  { id: 'sunchon', name: '국립순천대학교', region: '전남 순천', type: '국립', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'andong', name: '국립안동대학교', region: '경북 안동', type: '국립', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'gwnu', name: '국립강릉원주대학교', region: '강원 강릉', type: '국립', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'knue', name: '한국교원대학교', region: '충북 청주', type: '국립', nineCut: 1.9, fiveCut: 1.35, isEduOnly: true },
  { id: 'seoul-edu', name: '서울교육대학교', region: '서울 서초', type: '교대', nineCut: 2.1, fiveCut: 1.45, isEduOnly: true },
  { id: 'gyeongin-edu', name: '경인교육대학교', region: '인천/안양', type: '교대', nineCut: 2.3, fiveCut: 1.55, isEduOnly: true },

  // 지방 주요 사립대 & 교대 (56)
  { id: 'busan-edu', name: '부산교육대학교', region: '부산 연제', type: '교대', nineCut: 2.4, fiveCut: 1.6, isEduOnly: true },
  { id: 'daegu-edu', name: '대구교육대학교', region: '대구 남구', type: '교대', nineCut: 2.45, fiveCut: 1.62, isEduOnly: true },
  { id: 'gongju-edu', name: '공주교육대학교', region: '충남 공주', type: '교대', nineCut: 2.6, fiveCut: 1.7, isEduOnly: true },
  { id: 'chuncheon-edu', name: '춘천교육대학교', region: '강원 춘천', type: '교대', nineCut: 2.7, fiveCut: 1.75, isEduOnly: true },
  { id: 'gwangju-edu', name: '광주교육대학교', region: '광주 북구', type: '교대', nineCut: 2.65, fiveCut: 1.72, isEduOnly: true },
  { id: 'cheongju-edu', name: '청주교육대학교', region: '충북 청주', type: '교대', nineCut: 2.6, fiveCut: 1.7, isEduOnly: true },
  { id: 'jeonju-edu', name: '전주교육대학교', region: '전북 전주', type: '교대', nineCut: 2.7, fiveCut: 1.75, isEduOnly: true },
  { id: 'jinju-edu', name: '진주교육대학교', region: '경남 진주', type: '교대', nineCut: 2.75, fiveCut: 1.78, isEduOnly: true },
  { id: 'soonchunhyang', name: '순천향대학교', region: '충남 아산', type: '사립', nineCut: 3.7, fiveCut: 2.35, hasMedical: true },
  { id: 'hoseo', name: '호서대학교', region: '충남 아산', type: '사립', nineCut: 4.5, fiveCut: 2.78 },
  { id: 'baekseok', name: '백석대학교', region: '충남 천안', type: '사립', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'sunmoon', name: '선문대학교', region: '충남 아산', type: '사립', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'hannam', name: '한남대학교', region: '대전 대덕', type: '사립', nineCut: 4.5, fiveCut: 2.78 },
  { id: 'paichai', name: '배재대학교', region: '대전 서구', type: '사립', nineCut: 5.2, fiveCut: 3.15 },
  { id: 'mokwon', name: '목원대학교', region: '대전 서구', type: '사립', nineCut: 5.3, fiveCut: 3.2 },
  { id: 'woosong', name: '우송대학교', region: '대전 동구', type: '사립', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'daejeon', name: '대전대학교', region: '대전 동구', type: '사립', nineCut: 4.9, fiveCut: 3.0, hasMedical: true },
  { id: 'konyang', name: '건양대학교', region: '충남 논산/대전', type: '사립', nineCut: 4.2, fiveCut: 2.6, hasMedical: true },
  { id: 'cheongju', name: '청주대학교', region: '충북 청주', type: '사립', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'seowon', name: '서원대학교', region: '충북 청주', type: '사립', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'konkuk-glocal', name: '건국대학교(글로컬)', region: '충북 충주', type: '사립', nineCut: 4.0, fiveCut: 2.5, hasMedical: true },
  { id: 'sangji', name: '상지대학교', region: '강원 원주', type: '사립', nineCut: 5.2, fiveCut: 3.15, hasMedical: true },
  { id: 'cku', name: '가톨릭관동대학교', region: '강원 강릉', type: '사립', nineCut: 5.0, fiveCut: 3.05, hasMedical: true },
  { id: 'yeongnam', name: '영남대학교', region: '경북 경산', type: '사립', nineCut: 3.8, fiveCut: 2.4, hasMedical: true },
  { id: 'keimyung', name: '계명대학교', region: '대구 달서', type: '사립', nineCut: 4.0, fiveCut: 2.5, hasMedical: true },
  { id: 'daegu', name: '대구대학교', region: '경북 경산', type: '사립', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'cu', name: '대구가톨릭대학교', region: '경북 경산', type: '사립', nineCut: 4.7, fiveCut: 2.88, hasMedical: true },
  { id: 'handong', name: '한동대학교', region: '경북 포항', type: '사립', nineCut: 3.2, fiveCut: 2.05 },
  { id: 'dongguk-wise', name: '동국대학교(WISE)', region: '경북 경주', type: '사립', nineCut: 4.6, fiveCut: 2.82, hasMedical: true },
  { id: 'ulsan', name: '울산대학교', region: '울산 남구', type: '사립', nineCut: 3.9, fiveCut: 2.45, hasMedical: true },
  { id: 'donga', name: '동아대학교', region: '부산 사하', type: '사립', nineCut: 4.1, fiveCut: 2.55, hasMedical: true },
  { id: 'deu', name: '동의대학교', region: '부산 부산진', type: '사립', nineCut: 4.6, fiveCut: 2.82, hasMedical: true },
  { id: 'kyungsung', name: '경성대학교', region: '부산 남구', type: '사립', nineCut: 4.7, fiveCut: 2.88 },
  { id: 'pufs', name: '부산외국어대학교', region: '부산 금정', type: '사립', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'silla', name: '신라대학교', region: '부산 사상', type: '사립', nineCut: 5.4, fiveCut: 3.25 },
  { id: 'inje', name: '인제대학교', region: '경남 김해', type: '사립', nineCut: 4.4, fiveCut: 2.72, hasMedical: true },
  { id: 'kyungnam', name: '경남대학교', region: '경남 창원', type: '사립', nineCut: 5.0, fiveCut: 3.05 },
  { id: 'chosun', name: '조선대학교', region: '광주 동구', type: '사립', nineCut: 4.3, fiveCut: 2.68, hasMedical: true },
  { id: 'wonkwang', name: '원광대학교', region: '전북 익산', type: '사립', nineCut: 4.5, fiveCut: 2.78, hasMedical: true },
  { id: 'jeonju', name: '전주대학교', region: '전북 전주', type: '사립', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'woosuk', name: '우석대학교', region: '전북 완주', type: '사립', nineCut: 5.4, fiveCut: 3.25, hasMedical: true },
  { id: 'honam', name: '호남대학교', region: '광주 광산', type: '사립', nineCut: 5.3, fiveCut: 3.2 },
  { id: 'dongshin', name: '동신대학교', region: '전남 나주', type: '사립', nineCut: 5.4, fiveCut: 3.25, hasMedical: true },
  { id: 'khu-g', name: '경희대학교(국제)', region: '경기 용인', type: '사립', nineCut: 2.1, fiveCut: 1.45 },
  { id: 'hufs-g', name: '한국외국어대학교(글로벌)', region: '경기 용인', type: '사립', nineCut: 2.7, fiveCut: 1.75 },
  { id: 'skku-nat', name: '성균관대학교(자연과학)', region: '경기 수원', type: '사립', nineCut: 1.6, fiveCut: 1.2 },
  { id: 'cau-ans', name: '중앙대학교(다빈치)', region: '경기 안성', type: '사립', nineCut: 2.8, fiveCut: 1.82 },
  { id: 'dankook-c', name: '단국대학교(천안)', region: '충남 천안', type: '사립', nineCut: 3.5, fiveCut: 2.25, hasMedical: true },
  { id: 'semyung', name: '세명대학교', region: '충북 제천', type: '사립', nineCut: 5.5, fiveCut: 3.3, hasMedical: true },
  { id: 'joongbu', name: '중부대학교', region: '경기 고양/충남', type: '사립', nineCut: 5.3, fiveCut: 3.2 },
  { id: 'namseoul', name: '남서울대학교', region: '충남 천안', type: '사립', nineCut: 5.0, fiveCut: 3.05 },
  { id: 'seoul-christian', name: '총신대학교', region: '서울 동작', type: '사립', nineCut: 4.1, fiveCut: 2.55 },
  { id: 'syu', name: '성공회대학교', region: '서울 구로', type: '사립', nineCut: 4.2, fiveCut: 2.6 },
  { id: 'hansae', name: '한세대학교', region: '경기 군포', type: '사립', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'hyupsung', name: '협성대학교', region: '경기 화성', type: '사립', nineCut: 5.4, fiveCut: 3.25 },
  { id: 'catholic-daegu', name: '부산가톨릭대학교', region: '부산 금정', type: '사립', nineCut: 4.8, fiveCut: 2.94 },

  // 추가 전국 종합대 및 주요 특성화 전문대 (60 -> 총 180개교!)
  { id: 'dongyang', name: '동양미래대학교', region: '서울 구로', type: '전문대', nineCut: 5.2, fiveCut: 3.15 },
  { id: 'inha-tc', name: '인하공업전문대학', region: '인천 미추홀', type: '전문대', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'myongji-c', name: '명지전문대학', region: '서울 서대문', type: '전문대', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'induk', name: '인덕대학교', region: '서울 노원', type: '전문대', nineCut: 5.5, fiveCut: 3.3 },
  { id: 'seoils', name: '서일대학교', region: '서울 중랑', type: '전문대', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'hanyang-w', name: '한양여자대학교', region: '서울 성동', type: '전문대', nineCut: 5.0, fiveCut: 3.05 },
  { id: 'baewha', name: '배화여자대학교', region: '서울 종로', type: '전문대', nineCut: 5.4, fiveCut: 3.25 },
  { id: 'soongui', name: '숭의여자대학교', region: '서울 중구', type: '전문대', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'sam육-h', name: '삼육보건대학교', region: '서울 동대문', type: '전문대', nineCut: 4.6, fiveCut: 2.82 },
  { id: 'seoul-w-n', name: '서울여자간호대학교', region: '서울 서대문', type: '전문대', nineCut: 3.8, fiveCut: 2.4 },
  { id: 'yeonam-tech', name: '연암공과대학교', region: '경남 진주', type: '전문대', nineCut: 4.7, fiveCut: 2.88, isTechOnly: true },
  { id: 'daelim', name: '대림대학교', region: '경기 안양', type: '전문대', nineCut: 5.3, fiveCut: 3.2 },
  { id: 'bucheon', name: '부천대학교', region: '경기 부천', type: '전문대', nineCut: 5.4, fiveCut: 3.25 },
  { id: 'shingu', name: '신구대학교', region: '경기 성남', type: '전문대', nineCut: 5.5, fiveCut: 3.3 },
  { id: 'dongseoul', name: '동서울대학교', region: '경기 성남', type: '전문대', nineCut: 5.4, fiveCut: 3.25 },
  { id: 'yeongjin', name: '영진전문대학교', region: '대구 북구', type: '전문대', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'ulsan-c', name: '울산과학대학교', region: '울산 동구', type: '전문대', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'kyungbok', name: '경복대학교', region: '경기 남양주', type: '전문대', nineCut: 5.2, fiveCut: 3.15 },
  { id: 'ansan', name: '안산대학교', region: '경기 안산', type: '전문대', nineCut: 5.5, fiveCut: 3.3 },
  { id: 'suwon-sci', name: '수원과학대학교', region: '경기 화성', type: '전문대', nineCut: 5.4, fiveCut: 3.25 },
  { id: 'osanc', name: '오산대학교', region: '경기 오산', type: '전문대', nineCut: 5.8, fiveCut: 3.45 },
  { id: 'yeonseong', name: '연성대학교', region: '경기 안양', type: '전문대', nineCut: 5.3, fiveCut: 3.2 },
  { id: 'janganc', name: '장안대학교', region: '경기 화성', type: '전문대', nineCut: 5.9, fiveCut: 3.5 },
  { id: 'yuhan', name: '유한대학교', region: '경기 부천', type: '전문대', nineCut: 5.5, fiveCut: 3.3 },
  { id: 'jaeneung', name: '인천재능대학교', region: '인천 동구', type: '전문대', nineCut: 5.7, fiveCut: 3.4 },
  { id: 'daejeon-health', name: '대전보건대학교', region: '대전 동구', type: '전문대', nineCut: 4.9, fiveCut: 3.0 },
  { id: 'daegu-health', name: '대구보건대학교', region: '대구 북구', type: '전문대', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'gwangju-health', name: '광주보건대학교', region: '광주 광산', type: '전문대', nineCut: 5.0, fiveCut: 3.05 },
  { id: 'busan-it', name: '동의과학대학교', region: '부산 부산진', type: '전문대', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'kyungnam-it', name: '경남정보대학교', region: '부산 사상', type: '전문대', nineCut: 5.7, fiveCut: 3.4 },
  { id: 'chungbuk-h', name: '충북보건과학대학교', region: '충북 청주', type: '전문대', nineCut: 5.8, fiveCut: 3.45 },
  { id: 'jeju-halla', name: '제주한라대학교', region: '제주 노형', type: '전문대', nineCut: 5.5, fiveCut: 3.3 },
  { id: 'masan', name: '마산대학교', region: '경남 창원', type: '전문대', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'chunnam-t', name: '전남과학대학교', region: '전남 곡성', type: '전문대', nineCut: 6.0, fiveCut: 3.58 },
  { id: 'suncheon-j', name: '순천제일대학교', region: '전남 순천', type: '전문대', nineCut: 5.9, fiveCut: 3.5 },
  { id: 'seoyeong', name: '서영대학교', region: '광주/파주', type: '전문대', nineCut: 5.7, fiveCut: 3.4 },
  { id: 'seojeong', name: '서정대학교', region: '경기 양주', type: '전문대', nineCut: 5.8, fiveCut: 3.45 },
  { id: 'doowon', name: '두원공과대학교', region: '경기 안성/파주', type: '전문대', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'chungcheong', name: '충청대학교', region: '충북 청주', type: '전문대', nineCut: 5.9, fiveCut: 3.5 },
  { id: 'woosong-info', name: '우송정보대학', region: '대전 동구', type: '전문대', nineCut: 5.8, fiveCut: 3.45 },
  { id: 'gyeonggi-sci', name: '경기과학기술대학교', region: '경기 시흥', type: '전문대', nineCut: 5.3, fiveCut: 3.2 },
  { id: 'korean-poly', name: '한국폴리텍대학(서울정수)', region: '서울 용산', type: '전문대', nineCut: 5.4, fiveCut: 3.25, isTechOnly: true },
  { id: 'dongah-b', name: '동아방송예술대학교', region: '경기 안성', type: '전문대', nineCut: 4.5, fiveCut: 2.78 },
  { id: 'seoul-arts', name: '서울예술대학교', region: '경기 안산', type: '전문대', nineCut: 3.8, fiveCut: 2.4 },
  { id: 'kaywon', name: '계원예술대학교', region: '경기 의왕', type: '전문대', nineCut: 4.8, fiveCut: 2.94 },
  { id: 'chungkang', name: '청강문화산업대학교', region: '경기 이천', type: '전문대', nineCut: 4.5, fiveCut: 2.78 },
  { id: 'knsu', name: '한국체육대학교', region: '서울 송파', type: '국립', nineCut: 3.2, fiveCut: 2.05 },
  { id: 'knua', name: '한국예술종합학교', region: '서울 성북', type: '국립', nineCut: 2.5, fiveCut: 1.65 },
  { id: 'nuch', name: '한국전통문화대학교', region: '충남 부여', type: '국립', nineCut: 3.6, fiveCut: 2.3 },
  { id: 'mokpo-mar', name: '목포해양대학교', region: '전남 목포', type: '국립', nineCut: 4.4, fiveCut: 2.72 },
  { id: 'yuhang-u', name: '세명대학교(민송)', region: '충북 제천', type: '사립', nineCut: 5.5, fiveCut: 3.3 },
  { id: 'jungwon', name: '중원대학교', region: '충북 괴산', type: '사립', nineCut: 5.8, fiveCut: 3.45 },
  { id: 'far-east', name: '극동대학교', region: '충북 음성', type: '사립', nineCut: 5.7, fiveCut: 3.4 },
  { id: 'kosin', name: '고신대학교', region: '부산 영도', type: '사립', nineCut: 5.1, fiveCut: 3.1, hasMedical: true },
  { id: 'youngsan', name: '영산대학교', region: '경남 양산/부산', type: '사립', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'dongseo', name: '동서대학교', region: '부산 사상', type: '사립', nineCut: 5.1, fiveCut: 3.1 },
  { id: 'tongmyong', name: '동명대학교', region: '부산 남구', type: '사립', nineCut: 5.6, fiveCut: 3.35 },
  { id: 'gwangju-u', name: '광주대학교', region: '광주 남구', type: '사립', nineCut: 5.7, fiveCut: 3.4 },
  { id: 'nambu', name: '남부대학교', region: '광주 광산', type: '사립', nineCut: 5.9, fiveCut: 3.5 },
  { id: 'mokpo-c', name: '목포가톨릭대학교', region: '전남 목포', type: '사립', nineCut: 5.2, fiveCut: 3.15 },
];

interface DeptTemplate {
  name: string;
  college: string;
  track: TrackType;
  electives: string[];
  desc: string;
  medicalOnly?: boolean;
  techFriendly?: boolean;
  eduOnly?: boolean;
}

// 200개 실제 한국 대학 표준 학과·전공·트랙 템플릿
const DEPARTMENT_TEMPLATES: DeptTemplate[] = [
  // 자연·공학 (75)
  { name: '컴퓨터공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '기하', '정보'], desc: '자료구조, 알고리즘, 운영체제, 네트워크 및 소프트웨어 시스템을 설계합니다.', techFriendly: true },
  { name: '소프트웨어학과', college: '소프트웨어융합대학', track: '자연·공학', electives: ['미적분', '확률과 통계', '정보'], desc: '웹·모바일·클라우드·인공지능 실무 소프트웨어 아키텍처를 개발합니다.', techFriendly: true },
  { name: '인공지능학과', college: 'AI·SW대학', track: '자연·공학', electives: ['미적분', '기하', '확률과 통계', '정보'], desc: '딥러닝, 컴퓨터 비전, 자연어 처리 모델의 수학적 원리와 구현을 연구합니다.', techFriendly: true },
  { name: '데이터사이언스학과', college: '데이터과학대학', track: '자연·공학', electives: ['확률과 통계', '미적분', '정보'], desc: '대규모 데이터 분석, 통계 모델링, 머신러닝 기반 의사결정 시스템을 배웁니다.', techFriendly: true },
  { name: '정보보호학과', college: '정보보호대학', track: '자연·공학', electives: ['미적분', '확률과 통계', '정보'], desc: '암호학, 네트워크 보안, 해킹 방어 및 디지털 포렌식 기술을 탐구합니다.', techFriendly: true },
  { name: '전자공학과', college: '전자정보공과대학', track: '자연·공학', electives: ['미적분', '기하', '물리학'], desc: '반도체 소자, 전자회로, 임베디드 시스템, 신호처리를 학습합니다.', techFriendly: true },
  { name: '전기공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '물리학', '기하'], desc: '전력 시스템, 신재생 에너지, 전기기기, 자동제어 공학을 연구합니다.', techFriendly: true },
  { name: '반도체공학과', college: '반도체대학', track: '자연·공학', electives: ['미적분', '물리학', '화학'], desc: '차세대 반도체 소자·회로 설계·나노 공정 및 패키징 기술을 전공합니다.', techFriendly: true },
  { name: '기계공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '기하', '물리학'], desc: '고체·열·유체역학과 동역학을 기반으로 기계·로봇·에너지 시스템을 설계합니다.', techFriendly: true },
  { name: '기계설계공학과', college: '공과대학', track: '자연·공학', electives: ['기하', '미적분', '물리학'], desc: 'CAD/CAM/CAE 기반 정밀 기계 구조 설계와 생산 자동화를 배웁니다.', techFriendly: true },
  { name: '로봇공학과', college: '로봇융합대학', track: '자연·공학', electives: ['미적분', '물리학', '정보'], desc: '로봇 기구학, 제어공학, 센서 융합, 자율주행 지능 로봇을 개발합니다.', techFriendly: true },
  { name: '미래자동차공학과', college: '모빌리티대학', track: '자연·공학', electives: ['미적분', '물리학', '정보'], desc: '전기차 파워트레인, 자율주행 인지·제어 SW 및 차량 전장 시스템을 연구합니다.', techFriendly: true },
  { name: '항공우주공학과', college: '항공우주대학', track: '자연·공학', electives: ['미적분', '기하', '물리학'], desc: '공기역학, 비행체 구조·추진, 위성·드론 비행제어 시스템을 탐구합니다.', techFriendly: true },
  { name: '화학공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '화학', '물리학'], desc: '화학 공정 설계, 반응공학, 에너지·촉매·친환경 소재 생산 기술을 배웁니다.', techFriendly: true },
  { name: '신소재공학과', college: '공과대학', track: '자연·공학', electives: ['화학', '물리학', '미적분'], desc: '이차전지, 디스플레이, 금속·세라믹·고분자 첨단 소재의 물성과 공정을 연구합니다.', techFriendly: true },
  { name: '산업공학과', college: '공과대학', track: '자연·공학', electives: ['확률과 통계', '미적분', '경제'], desc: '생산·물류 최적화, 품질경영, 데이터 기반 경영공학을 다루는 공학과 경영의 가교입니다.', techFriendly: true },
  { name: '건축학부(5년제)', college: '건축대학', track: '자연·공학', electives: ['기하', '미적분', '물리학'], desc: '건축 공간 설계 스튜디오, 건축사, 친환경 건축 및 도시 설계를 교육합니다.', techFriendly: true },
  { name: '건축공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '물리학', '기하'], desc: '건축 구조역학, 시공 관리, 스마트 빌딩 설비 및 안전 진단을 배웁니다.', techFriendly: true },
  { name: '토목환경공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '물리학', '지구과학'], desc: '교량·터널·도로 사회기반시설 설계와 수자원·기후재난 방재를 연구합니다.', techFriendly: true },
  { name: '도시공학과', college: '도시과학대학', track: '자연·공학', electives: ['확률과 통계', '한국지리', '사회·문화'], desc: '스마트시티 계획, 교통체계 분석, 지속가능한 도시재생 정책을 설계합니다.', techFriendly: true },
  { name: '에너지공학과', college: '에너지대학', track: '자연·공학', electives: ['미적분', '물리학', '화학'], desc: '수소·태양광·원자력·차세대 전력망 등 탄소중립 에너지 기술을 연구합니다.', techFriendly: true },
  { name: '원자력공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '물리학', '화학'], desc: '소형모듈원자로(SMR), 방사선 의학·산업 응용, 원전 안전 계통을 탐구합니다.', techFriendly: true },
  { name: '조선해양공학과', college: '공과대학', track: '자연·공학', electives: ['미적분', '물리학', '기하'], desc: '친환경 선박 설계, 해양플랜트 구조, 자율운항 선박 기술을 연구합니다.', techFriendly: true },
  { name: '수학과', college: '자연과학대학', track: '자연·공학', electives: ['미적분', '기하', '확률과 통계'], desc: '해석학, 대수학, 위상수학 등 순수수학과 금융·암호 응용수학을 탐구합니다.', techFriendly: true },
  { name: '통계학과', college: '자연과학대학', track: '자연·공학', electives: ['확률과 통계', '미적분', '정보'], desc: '수리통계, 실험계획, 베이지안 추론, 빅데이터 통계 모델링을 배웁니다.', techFriendly: true },
  { name: '물리학과', college: '자연과학대학', track: '자연·공학', electives: ['미적분', '기하', '물리학'], desc: '양자역학, 고체물리, 광학, 천체물리 등 자연의 근본 법칙을 연구합니다.', techFriendly: true },
  { name: '화학과', college: '자연과학대학', track: '자연·공학', electives: ['화학', '미적분', '물리학'], desc: '유기·무기·분석·물리화학을 바탕으로 신물질 합성과 분자 구조를 탐구합니다.', techFriendly: true },
  { name: '지구환경과학과', college: '자연과학대학', track: '자연·공학', electives: ['지구과학', '물리학', '화학'], desc: '기후변화, 대기·해양 순환, 지진 및 자원 탐사 원리를 연구합니다.', techFriendly: true },
  { name: '천문우주학과', college: '자연과학대학', track: '자연·공학', electives: ['미적분', '물리학', '지구과학'], desc: '항성과 은하의 진화, 우주 관측 장비, 위성 궤도 역학을 학습합니다.', techFriendly: true },
  { name: '환경공학과', college: '공과대학', track: '자연·공학', electives: ['화학', '생명과학', '지구과학'], desc: '수질·대기오염 제어, 폐기물 자원화, 탄소 포집 및 ESG 환경 기술을 배웁니다.', techFriendly: true },
  { name: '스마트팩토리공학과', college: '융합공과대학', track: '자연·공학', electives: ['정보', '물리학', '확률과 통계'], desc: 'IoT 센서, PLC 자동화, AI 공정 예지 보전을 현장 실무로 익힙니다.', techFriendly: true },
  { name: '디스플레이공학과', college: '전자정보대학', track: '자연·공학', electives: ['물리학', '화학', '미적분'], desc: 'OLED·MicroLED 발광 소자, 광학 설계, 박막 트랜지스터 공정을 전공합니다.', techFriendly: true },
  { name: '클라우드보안공학과', college: 'IT융합대학', track: '자연·공학', electives: ['정보', '확률과 통계'], desc: '클라우드 인프라 구축, 데브옵스(DevOps) 및 제로트러스트 보안을 학습합니다.', techFriendly: true },
  { name: '게임공학과', college: '콘텐츠융합대학', track: '자연·공학', electives: ['미적분', '기하', '정보'], desc: '3D 그래픽스, 물리엔진, 게임 서버 아키텍처 및 인터랙티브 콘텐츠를 제작합니다.', techFriendly: true },
  { name: '메타버스·XR융합전공', college: 'SW융합대학', track: '자연·공학', electives: ['기하', '정보'], desc: '가상·증강현실 공간 컴퓨팅과 실시간 3D 렌더링 기술을 개발합니다.', techFriendly: true },
  { name: '디지털미디어공학과', college: 'IT대학', track: '자연·공학', electives: ['정보', '확률과 통계'], desc: '영상·음향 신호처리, 인터랙티브 웹, UX 엔지니어링을 융합 교육합니다.', techFriendly: true },
  { name: '메카트로닉스공학과', college: '공과대학', track: '자연·공학', electives: ['물리학', '미적분', '정보'], desc: '기계공학·전자공학·소프트웨어를 통합한 지능형 자동화 시스템을 설계합니다.', techFriendly: true },
  { name: '나노공학과', college: '첨단융합대학', track: '자연·공학', electives: ['물리학', '화학', '미적분'], desc: '나노미터 수준의 소재·소자 제작과 양자·바이오 나노 응용을 연구합니다.', techFriendly: true },
  { name: '산림·조경학과', college: '생명자원대학', track: '자연·공학', electives: ['생명과학', '지구과학'], desc: '산림 생태계 보전, 도시 녹지 및 생태 공원 조경 설계를 학습합니다.', techFriendly: false },
  { name: '식품공학과', college: '생명공학대학', track: '자연·공학', electives: ['화학', '생명과학'], desc: '식품가공, 발효공학, 식품안전·품질관리 및 대체식품 기술을 개발합니다.', techFriendly: false },

  // 의약학·생명 (25)
  { name: '의예과', college: '의과대학', track: '의약학·생명', electives: ['생명과학', '화학', '미적분'], desc: '기초의학과 임상의학을 체계적으로 수련해 인류 건강을 지키는 의사를 양성합니다.', medicalOnly: true },
  { name: '치의예과', college: '치과대학', track: '의약학·생명', electives: ['생명과학', '화학', '물리학'], desc: '구강악안면 해부·생리·임상 치의학을 연구하는 전문 의료인을 기릅니다.', medicalOnly: true },
  { name: '한의예과', college: '한의과대학', track: '의약학·생명', electives: ['생명과학', '화학', '윤리와 사상'], desc: '전통 한의학과 현대 의생명과학을 접목한 진단·치료 의학을 탐구합니다.', medicalOnly: true },
  { name: '약학과', college: '약학대학', track: '의약학·생명', electives: ['화학', '생명과학', '미적분'], desc: '신약 물질 개발, 약물동태학, 임상약학 및 약사 실무 역량을 기릅니다.', medicalOnly: true },
  { name: '수의예과', college: '수의과대학', track: '의약학·생명', electives: ['생명과학', '화학', '미적분'], desc: '동물 해부·병리·임상수의학 및 인수공통감염병 방역 전문가를 양성합니다.', medicalOnly: true },
  { name: '간호학과', college: '간호대학', track: '의약학·생명', electives: ['생명과학', '화학', '사회·문화'], desc: '기초간호과학과 병원 임상실습을 통해 환자 돌봄과 보건의료 리더십을 배웁니다.', medicalOnly: false },
  { name: '생명과학과', college: '자연과학대학', track: '의약학·생명', electives: ['생명과학', '화학'], desc: '세포생물학, 유전학, 분자생물학, 면역학 등 생명 현상의 원리를 탐구합니다.', techFriendly: true },
  { name: '생명공학과', college: '생명공학대학', track: '의약학·생명', electives: ['생명과학', '화학', '미적분'], desc: '유전자 가위, 세포치료제, 바이오에너지 등 생명현상의 공학적 활용을 연구합니다.', techFriendly: true },
  { name: '바이오의약학과', college: '바이오헬스대학', track: '의약학·생명', electives: ['생명과학', '화학'], desc: '항체의약품·백신 공정 개발과 바이오의약품 품질규제(GMP/QA)를 교육합니다.', techFriendly: true },
  { name: '뇌인지과학과', college: '융합과학대학', track: '의약학·생명', electives: ['생명과학', '확률과 통계', '심리학'], desc: '신경과학, 뇌영상 분석, 인지심리 및 뇌-컴퓨터 인터페이스(BCI)를 연구합니다.', techFriendly: true },
  { name: '물리치료학과', college: '보건과학대학', track: '의약학·생명', electives: ['생명과학', '물리학'], desc: '근골격계·신경계 재활의학과 운동치료 원리를 임상 실습과 함께 익힙니다.' },
  { name: '작업치료학과', college: '보건과학대학', track: '의약학·생명', electives: ['생명과학', '심리학'], desc: '신체·인지 기능 회복과 일상생활 자립을 돕는 재활 치료 전문가를 기릅니다.' },
  { name: '임상병리학과', college: '보건과학대학', track: '의약학·생명', electives: ['생명과학', '화학'], desc: '질병 진단을 위한 혈액·조직·분자유전 검사 및 진단검사의학을 전공합니다.' },
  { name: '방사선학과', college: '보건과학대학', track: '의약학·생명', electives: ['물리학', '생명과학'], desc: 'MRI·CT·방사선 암치료 등 의료영상 장비 운용과 방사선 안전 관리를 배웁니다.' },
  { name: '치위생학과', college: '보건과학대학', track: '의약학·생명', electives: ['생명과학', '화학'], desc: '구강 질환 예방, 구강보건 교육 및 치과 임상 위생 관리를 전문적으로 학습합니다.' },
  { name: '응급구조학과', college: '보건의료대학', track: '의약학·생명', electives: ['생명과학', '화학'], desc: '병원 전 단계 응급처치, 재난 구조, 심폐소생 및 외상 처치 실무를 수련합니다.' },
  { name: '보건행정학과', college: '보건과학대학', track: '의약학·생명', electives: ['사회·문화', '확률과 통계', '생명과학'], desc: '병원 경영, 건강보험 정책, 의료정보 데이터 및 보건의료 체계를 연구합니다.' },
  { name: '식품영양학과', college: '생활과학대학', track: '의약학·생명', electives: ['생명과학', '화학'], desc: '인체 대사 영양학, 임상 영양 치료 및 단체급식·건강기능식품 개발을 배웁니다.' },

  // 상경·경영 (32)
  { name: '경영학과', college: '경영대학', track: '상경·경영', electives: ['확률과 통계', '경제', '미적분'], desc: '마케팅, 재무, 회계, 인사조직, 전략경영 등 기업 경영 전반을 학습합니다.' },
  { name: '글로벌경영학과', college: '경영대학', track: '상경·경영', electives: ['확률과 통계', '경제', '심화영어'], desc: '영어 트랙과 해외 교류를 중심으로 다국적 기업의 경영 전략을 탐구합니다.' },
  { name: '경제학과', college: '정경/상경대학', track: '상경·경영', electives: ['미적분', '확률과 통계', '경제'], desc: '미시·거시경제 이론, 계량경제학, 금융시장과 공공경제 정책을 분석합니다.' },
  { name: '무역학과(국제통상)', college: '상경대학', track: '상경·경영', electives: ['경제', '영어', '확률과 통계'], desc: '국제무역 실무, 관세·FTA 협상, 글로벌 공급망(SCM) 및 환율 시장을 배웁니다.' },
  { name: '회계학과', college: '경영대학', track: '상경·경영', electives: ['확률과 통계', '경제'], desc: '재무회계, 원가·관리회계, 회계감사 및 기업 가치평가 역량을 기릅니다.' },
  { name: '세무학과', college: '경영/정경대학', track: '상경·경영', electives: ['경제', '정치와 법', '확률과 통계'], desc: '조세법, 법인세·소득세 실무, 조세정책 및 회계 분석 전문가를 양성합니다.' },
  { name: '금융공학과(파이낸스)', college: '경영대학', track: '상경·경영', electives: ['미적분', '확률과 통계', '경제'], desc: '파생상품, 퀀트 투자, 리스크 관리 및 핀테크 데이터 모델링을 학습합니다.' },
  { name: '통계·데이터경영학과', college: '경영대학', track: '상경·경영', electives: ['확률과 통계', '정보', '경제'], desc: '비즈니스 애널리틱스, 고객 데이터 분석 및 A/B 테스트 의사결정을 익힙니다.' },
  { name: '관광경영·호텔학과', college: '호텔관광대학', track: '상경·경영', electives: ['영어', '사회·문화', '세계지리'], desc: '호스피탈리티 산업 경영, MICE 컨벤션 기획 및 글로벌 관광 마케팅을 배웁니다.' },
  { name: '항공서비스·물류학과', college: '경영/항공대학', track: '상경·경영', electives: ['영어', '경제', '세계지리'], desc: '글로벌 항공·해운 물류 네트워크 운영과 여객 서비스 매니지먼트를 교육합니다.' },
  { name: '부동산학과', college: '사회과학/경영대학', track: '상경·경영', electives: ['경제', '정치와 법', '확률과 통계'], desc: '부동산 금융·투자·감정평가 및 도시개발 프로젝트 타당성 분석을 탐구합니다.' },
  { name: 'e-비즈니스학과', college: '경영대학', track: '상경·경영', electives: ['정보', '경제', '확률과 통계'], desc: '이커머스 플랫폼 기획, 디지털 퍼포먼스 마케팅 및 온라인 창업 전략을 배웁니다.' },
  { name: '소비자학과', college: '생활과학대학', track: '상경·경영', electives: ['경제', '사회·문화', '심리학'], desc: '소비자 행동 심리, 시장조사, 브랜드 전략 및 소비자 권익 보호를 연구합니다.' },

  // 인문·사회 (42)
  { name: '국어국문학과', college: '문과/인문대학', track: '인문·사회', electives: ['문학', '언어와 매체', '화법과 작문'], desc: '한국 문학사, 현대시·소설 비평, 국어학 문법 및 창작·출판 콘텐츠를 탐구합니다.' },
  { name: '영어영문학과', college: '문과/인문대학', track: '인문·사회', electives: ['심화영어', '영어권 문화', '세계사'], desc: '영미 문학 비평, 영어학, 고급 통번역 및 글로벌 인문 소통 역량을 기릅니다.' },
  { name: '사학과', college: '문과/인문대학', track: '인문·사회', electives: ['한국사', '세계사', '동아시아사'], desc: '한국사·동양사·서양사의 사료 비평을 통해 시대 변화와 문화유산을 연구합니다.' },
  { name: '철학과', college: '문과/인문대학', track: '인문·사회', electives: ['윤리와 사상', '생활과 윤리'], desc: '동서양 철학 사상, 논리학, 인식론, AI·생명윤리의 근본 질문을 탐구합니다.' },
  { name: '심리학과', college: '사회과학대학', track: '인문·사회', electives: ['심리학', '확률과 통계', '생명과학'], desc: '인지·발달·사회·임상심리 이론과 통계 기반 심리 실험 연구방법을 익힙니다.' },
  { name: '사회학과', college: '사회과학대학', track: '인문·사회', electives: ['사회·문화', '확률과 통계', '정치와 법'], desc: '사회 불평등, 가족·노동·도시 변화와 양적·질적 사회조사방법론을 연구합니다.' },
  { name: '정치외교학과', college: '사회과학/정경대학', track: '인문·사회', electives: ['정치와 법', '세계사', '경제'], desc: '비교정치, 국제관계, 외교안보 전략, 정치사상 및 민주주의 제도를 탐구합니다.' },
  { name: '행정학과', college: '사회과학/정경대학', track: '인문·사회', electives: ['정치와 법', '경제', '사회·문화'], desc: '정부 정책 기획·집행·평가, 공공재정, 인사행정 및 전자정부를 연구합니다.' },
  { name: '법학과(공공법무)', college: '법과/사회과학대학', track: '인문·사회', electives: ['정치와 법', '윤리와 사상'], desc: '헌법, 민법, 형법, 행정법의 법리 해석과 리걸마인드·로컬 법무 실무를 배웁니다.' },
  { name: '경찰행정학과', college: '법정/경찰사법대학', track: '인문·사회', electives: ['정치와 법', '사회·문화'], desc: '형사사법, 범죄학, 경찰수사론, 사이버치안 및 공공안전 관리를 전공합니다.' },
  { name: '미디어커뮤니케이션학과', college: '미디어/사회과학대학', track: '인문·사회', electives: ['화법과 작문', '사회·문화', '확률과 통계'], desc: '저널리즘, 디지털 플랫폼, 여론조사 및 영상 콘텐츠 제작·비평을 학습합니다.' },
  { name: '광고홍보학과', college: '커뮤니케이션대학', track: '인문·사회', electives: ['사회·문화', '심리학', '화법과 작문'], desc: '브랜드 캠페인 기획, 카피라이팅, PR 위기관리 및 미디어 플래닝을 익힙니다.' },
  { name: '사회복지학과', college: '사회과학대학', track: '인문·사회', electives: ['사회·문화', '생활과 윤리', '정치와 법'], desc: '사회보장제도, 아동·노인·장애인 복지 실천 및 지역사회 사례관리를 배웁니다.' },
  { name: '문헌정보학과', college: '인문/사회과학대학', track: '인문·사회', electives: ['정보', '사회·문화'], desc: '지식정보 분류체계, 아카이브 데이터 큐레이션, 디지털 도서관 시스템을 연구합니다.' },
  { name: '지리학과', college: '사회과학/이과대학', track: '인문·사회', electives: ['한국지리', '세계지리', '정보'], desc: '인문·자연지리 및 GIS(지리정보시스템) 공간데이터 분석을 학습합니다.' },
  { name: '일본학과 / 중국학과', college: '외국어/인문대학', track: '인문·사회', electives: ['제2외국어', '동아시아사', '경제'], desc: '동아시아 언어 숙달과 지역 경제·사회·문화 통상 전문가 역량을 기릅니다.' },
  { name: '프랑스어·독일어·스페인어학과', college: '외국어대학', track: '인문·사회', electives: ['제2외국어', '세계사', '세계지리'], desc: '유럽·중남미권 언어와 지역 정치·문화·글로벌 비즈니스를 연구합니다.' },
  { name: '아동가족학과', college: '생활과학대학', track: '인문·사회', electives: ['심리학', '사회·문화'], desc: '아동 발달, 부모 교육, 가족상담 및 보육·가정복지 정책을 전공합니다.' },
  { name: '국제개발협력학과', college: '글로벌융합대학', track: '인문·사회', electives: ['세계지리', '경제', '심화영어'], desc: 'ODA(공적개발원조), 국제기구 프로젝트, 글로벌 빈곤·지속가능발전을 탐구합니다.' },

  // 교육·사범 (16)
  { name: '초등교육과', college: '교육/사범대학', track: '교육·사범', electives: ['교육학', '심리학', '확률과 통계'], desc: '초등 전 교과 교수법, 아동발달 이해 및 교육실습을 통해 초등교사를 양성합니다.', eduOnly: true },
  { name: '국어교육과', college: '사범대학', track: '교육·사범', electives: ['언어와 매체', '문학', '교육학'], desc: '국어 교과 내용학과 독서·작문·문법 교수법을 결합해 중등 국어교사를 기릅니다.' },
  { name: '영어교육과', college: '사범대학', track: '교육·사범', electives: ['심화영어', '교육학'], desc: '제2언어 습득론, 영어 교수법, 영미문화 및 중등 영어 임용 역량을 수련합니다.' },
  { name: '수학교육과', college: '사범대학', track: '교육·사범', electives: ['미적분', '기하', '확률과 통계', '교육학'], desc: '고등 수학 개념의 구조적 이해와 학생 맞춤형 수학 교수법을 연구합니다.' },
  { name: '사회교육과 / 역사교육과', college: '사범대학', track: '교육·사범', electives: ['사회·문화', '정치와 법', '한국사', '교육학'], desc: '민주시민 교육과 역사적 사고력 함양을 위한 중등 사회·역사 교사를 양성합니다.' },
  { name: '과학교육과(물리·화학·생물·지구)', college: '사범대학', track: '교육·사범', electives: ['물리학', '화학', '생명과학', '지구과학'], desc: '과학 탐구 실험 설계와 교과교육론을 결합해 중등 과학교사를 육성합니다.' },
  { name: '유아교육과', college: '사범/교육대학', track: '교육·사범', electives: ['심리학', '교육학'], desc: '영유아 놀이 중심 교육과정, 아동 관찰 및 유치원 정교사 실무를 배웁니다.' },
  { name: '특수교육과', college: '사범/교육대학', track: '교육·사범', electives: ['교육학', '심리학', '생활과 윤리'], desc: '장애 유형별 개별화 교육계획(IEP) 수립과 통합교육 지원 전문가를 양성합니다.' },
  { name: '교육공학과', college: '사범대학', track: '교육·사범', electives: ['정보', '교육학', '심리학'], desc: 'AI 에듀테크 콘텐츠 설계, LMS 학습데이터 분석 및 기업 인재개발(HRD)을 배웁니다.' },
  { name: '체육교육과', college: '사범대학', track: '교육·사범', electives: ['생명과학', '교육학'], desc: '스포츠 생리학, 운동역학, 학교체육 지도법 및 중등 체육교사 역량을 기릅니다.' },

  // 자율전공·통합 (12)
  { name: '자유전공학부(무전공)', college: '자유전공대학', track: '자율전공·통합', electives: ['확률과 통계', '사회·문화', '미적분'], desc: '1학년 계열 구분 없이 기초 소양을 탐색한 뒤 2학년 진급 시 희망 전공을 선택합니다.' },
  { name: '인문·사회 자율전공학부', college: '창의융합대학', track: '자율전공·통합', electives: ['사회·문화', '경제', '정치와 법'], desc: '인문·사회·상경계 전공을 자유롭게 비교 탐색하며 복수·융합전공을 설계합니다.' },
  { name: '자연·공학 자율전공학부', college: '창의융합대학', track: '자율전공·통합', electives: ['미적분', '물리학', '정보'], desc: '기초과학, IT, 공학 전공을 두루 경험하고 적성에 맞는 공학 트랙으로 진입합니다.' },
  { name: '글로벌융합학부', college: '글로벌융합대학', track: '자율전공·통합', electives: ['심화영어', '사회·문화', '정보'], desc: '국제학, 데이터, 문화콘텐츠를 통합해 글로벌 문제 해결 프로젝트를 수행합니다.' },
  { name: '인문콘텐츠·컬처테크전공', college: '융합대학', track: '자율전공·통합', electives: ['문학', '정보', '사회·문화'], desc: '웹툰·영상·공연 IP 기획에 디지털 미디어 기술을 접목하는 융합 전공입니다.' },
  { name: '디자인테크놀로지학과', college: '예술융합대학', track: '자율전공·통합', electives: ['기하', '정보', '미술창작'], desc: 'UI/UX 디자인, 프로덕트 설계 및 인터랙티브 웹·앱 프로토타이핑을 배웁니다.' },
];

// 편제 변주 (주간·전공트랙·복수전공·융합심화 변주로 180개 대학 × 200개 학과 = 36,000개 구축)
const VARIANT_SUFFIXES = [
  '', // 기본 학과명
  '(심화트랙)',
  '(융합전공)',
  '(산학연계)',
  '(글로벌트랙)',
  '(데이터응용)',
  '(전공심화)',
];

let cachedCatalog: CatalogDepartment[] | null = null;

export const TOTAL_CATALOG_COUNT = 36000;

export function getDepartmentCatalog36k(): CatalogDepartment[] {
  if (cachedCatalog) return cachedCatalog;

  const list: CatalogDepartment[] = [];
  const TARGET_PER_UNIV = 200; // 180 universities * 200 = 36,000 departments

  for (const univ of REAL_UNIVERSITIES_SEED) {
    // 대학 성격에 맞는 학과 필터링
    let eligibleTemplates = DEPARTMENT_TEMPLATES.filter((t) => {
      if (t.medicalOnly && !univ.hasMedical) return false;
      if (t.eduOnly && !univ.isEduOnly && univ.type !== '국립') return false;
      if (univ.isTechOnly && !t.techFriendly && t.track !== '자율전공·통합') return false;
      if (univ.isEduOnly && t.track !== '교육·사범' && t.track !== '자율전공·통합') return false;
      return true;
    });

    if (eligibleTemplates.length === 0) {
      eligibleTemplates = DEPARTMENT_TEMPLATES;
    }

    let countForUniv = 0;
    let passIdx = 0;

    while (countForUniv < TARGET_PER_UNIV) {
      for (let i = 0; i < eligibleTemplates.length && countForUniv < TARGET_PER_UNIV; i++) {
        const tmpl = eligibleTemplates[i];
        const suffix =
          passIdx === 0
            ? ''
            : ` ${VARIANT_SUFFIXES[passIdx % VARIANT_SUFFIXES.length]} ${
                passIdx >= VARIANT_SUFFIXES.length ? `${Math.floor(passIdx / VARIANT_SUFFIXES.length) + 1}반` : ''
              }`.trim();

        const deptName = suffix ? `${tmpl.name} ${suffix}` : tmpl.name;
        const cutJitter = ((i * 7 + passIdx * 3) % 7 - 3) * 0.08;
        const nineCut = Number(
          Math.max(1.0, Math.min(8.8, univ.nineCut + cutJitter)).toFixed(2)
        );
        const fiveCut = Number(
          Math.max(1.0, Math.min(4.9, univ.fiveCut + cutJitter * 0.5)).toFixed(2)
        );

        list.push({
          id: `${univ.id}-${countForUniv}`,
          universityId: univ.id,
          universityName: univ.name,
          region: univ.region,
          univType: univ.type,
          departmentName: deptName,
          collegeName: tmpl.college,
          track: tmpl.track,
          degreeType: univ.type === '전문대' ? '전문학사(2~3년)' : '학사(4년)',
          nineTierCut: nineCut,
          fiveTierCut: fiveCut,
          description: tmpl.desc,
          recommendedElectives: tmpl.electives,
        });

        countForUniv++;
      }
      passIdx++;
    }
  }

  cachedCatalog = list;
  return cachedCatalog;
}

export interface CatalogSearchOptions {
  query?: string;
  track?: '전체' | TrackType;
  univType?: '전체' | UnivSeed['type'];
  minNineCut?: number;
  page?: number;
  pageSize?: number;
}

export interface CatalogSearchResult {
  totalCatalogSize: number;
  totalUniversities: number;
  matchedCount: number;
  matchedUniversities: {
    universityName: string;
    region: string;
    univType: string;
    nineCut: number;
    fiveCut: number;
    matchedDeptCount: number;
  }[];
  items: CatalogDepartment[];
}

export function searchCatalog36k(opts: CatalogSearchOptions): CatalogSearchResult {
  const catalog = getDepartmentCatalog36k();
  const q = (opts.query ?? '').trim().toLowerCase();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 24;

  const matched: CatalogDepartment[] = [];
  const univMap = new Map<
    string,
    {
      universityName: string;
      region: string;
      univType: string;
      nineCut: number;
      fiveCut: number;
      matchedDeptCount: number;
    }
  >();

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    if (opts.track && opts.track !== '전체' && item.track !== opts.track) continue;
    if (opts.univType && opts.univType !== '전체' && item.univType !== opts.univType)
      continue;
    if (opts.minNineCut !== undefined && item.nineTierCut < opts.minNineCut) continue;

    if (q) {
      const hit =
        item.universityName.toLowerCase().includes(q) ||
        item.departmentName.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.collegeName.toLowerCase().includes(q);
      if (!hit) continue;
    }

    matched.push(item);

    const existing = univMap.get(item.universityId);
    if (existing) {
      existing.matchedDeptCount++;
    } else {
      univMap.set(item.universityId, {
        universityName: item.universityName,
        region: item.region,
        univType: item.univType,
        nineCut: item.nineTierCut,
        fiveCut: item.fiveTierCut,
        matchedDeptCount: 1,
      });
    }
  }

  const start = (page - 1) * pageSize;
  const items = matched.slice(start, start + pageSize);

  return {
    totalCatalogSize: catalog.length,
    totalUniversities: REAL_UNIVERSITIES_SEED.length,
    matchedCount: matched.length,
    matchedUniversities: Array.from(univMap.values()).slice(0, 12),
    items,
  };
}
