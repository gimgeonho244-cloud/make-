import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY가 설정되어 있지 않습니다. Settings > Secrets 패널에서 API 키를 확인해주세요.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getReadableGeminiError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('GEMINI_API_KEY가 설정')) {
    return { status: 400, message: raw };
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED') || raw.includes('403')) {
    return {
      status: 403,
      message: 'API 키 권한이 유효하지 않습니다. Settings > Secrets 패널에서 GEMINI_API_KEY를 확인해주세요.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
  return {
    status: 500,
    message: `AI 생성 중 오류가 발생했습니다: ${raw}`,
  };
}

interface GenerateExamBody {
  schoolName?: string;
  highSchoolType?: string;
  gradeYear?: number;
  subjectName?: string;
  semester?: string;
  examKind?: string;
  examScope?: string;
  difficulty?: string;
}

interface GenerateNoteBody {
  schoolName?: string;
  highSchoolType?: string;
  gradeYear?: number;
  subjectName?: string;
  semester?: string;
  examKind?: string;
  examScope?: string;
  difficulty?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/study/generate-exam', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as GenerateExamBody;
      const schoolName = (body.schoolName || '재학 고등학교').trim().slice(0, 60);
      const highSchoolType = (body.highSchoolType || '일반고').trim().slice(0, 30);
      const gradeYear = Number(body.gradeYear) || 1;
      const subjectName = (body.subjectName || '공통수학1').trim().slice(0, 50);
      const semester = (body.semester || '1학기').trim().slice(0, 10);
      const examKind = body.examKind === 'midterm' ? '중간고사' : '기말고사';
      const examScope = (body.examScope || '').trim().slice(0, 300);
      const difficulty = (body.difficulty || '중').trim();

      if (!examScope) {
        res.status(400).json({ error: '시험 범위를 먼저 입력해주세요.' });
        return;
      }

      const ai = createGeminiClient();
      const difficultyRule =
        difficulty === '전체'
          ? '난이도 하(1문항), 중(2문항), 상(서술형 또는 고난도 킬러 1문항)을 고르게 섞어 총 4문항을 출제하세요.'
          : `요청된 난이도 "${difficulty}" 수준에 맞춰 총 3문항(객관식 2문항 + 서술형 1문항)을 출제하고, 모든 문항의 difficulty 값을 "${difficulty}"로 설정하세요.`;

      const prompt = [
        `당신은 대한민국 ${highSchoolType} 내신 출제 전문가입니다.`,
        `대상 학교: ${schoolName} ${gradeYear}학년`,
        `과목 및 시험: ${subjectName} (${semester} ${examKind})`,
        `사용자가 입력한 시험 범위: ${examScope}`,
        difficultyRule,
        `규칙:`,
        `1) 반드시 입력된 시험 범위("${examScope}") 안에서만 실제 고등학교 내신 기출 스타일로 출제하세요.`,
        `2) 객관식은 choices에 5지선다("① ...", "② ...", "③ ...", "④ ...", "⑤ ...")를 넣고 correctIndex(0~4)를 정확히 맞추세요.`,
        `3) 서술형은 choices를 빈 배열([])로 두고 correctIndex는 -1로 두며, scoringRubric(부분점수 배점 기준)을 구체적으로 작성하세요.`,
        `4) 수학/과학 수식은 읽기 쉬운 유니코드 기호(², ³, √, ∑, Δ, →)로 명확히 표기하고 계산 오류가 없어야 합니다.`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            '모든 출력은 정확한 한국어 고등학교 내신 문항 JSON으로 반환합니다. 정답과 해설에 계산 오류나 논리 모순이 절대 없어야 합니다.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.INTEGER },
                    questionType: { type: Type.STRING, description: '객관식 또는 서술형' },
                    difficulty: { type: Type.STRING, description: '하, 중, 상 중 하나' },
                    points: { type: Type.INTEGER },
                    unit: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    choices: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    answerText: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    scoringRubric: { type: Type.STRING },
                  },
                  required: [
                    'number',
                    'questionType',
                    'difficulty',
                    'points',
                    'unit',
                    'prompt',
                    'choices',
                    'correctIndex',
                    'answerText',
                    'explanation',
                  ],
                },
              },
            },
            required: ['questions'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as { questions?: Array<Record<string, unknown>> };
      const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];

      const sanitized = rawQuestions.map((q, idx) => {
        const qType = q.questionType === '서술형' ? '서술형' : '객관식';
        const diffRaw = String(q.difficulty || '중');
        const safeDiff = diffRaw === '하' || diffRaw === '상' || diffRaw === '중' ? diffRaw : '중';
        const choicesArr = Array.isArray(q.choices)
          ? q.choices.map((c) => String(c))
          : [];
        return {
          id: `ai-q-${Date.now()}-${idx}`,
          number: Number(q.number) || idx + 1,
          questionType: qType,
          difficulty: safeDiff,
          points: Number(q.points) || (qType === '서술형' ? 8 : 4),
          unit: String(q.unit || examScope),
          prompt: String(q.prompt || ''),
          choices: qType === '객관식' && choicesArr.length > 0 ? choicesArr : undefined,
          correctIndex:
            qType === '객관식' && typeof q.correctIndex === 'number' && q.correctIndex >= 0
              ? Math.min(choicesArr.length - 1, q.correctIndex)
              : undefined,
          answerText: String(q.answerText || ''),
          explanation: String(q.explanation || ''),
          scoringRubric: q.scoringRubric ? String(q.scoringRubric) : undefined,
        };
      });

      res.json({ questions: sanitized });
    } catch (err) {
      const { status, message } = getReadableGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/study/generate-note', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as GenerateNoteBody;
      const schoolName = (body.schoolName || '재학 고등학교').trim().slice(0, 60);
      const highSchoolType = (body.highSchoolType || '일반고').trim().slice(0, 30);
      const gradeYear = Number(body.gradeYear) || 1;
      const subjectName = (body.subjectName || '공통수학1').trim().slice(0, 50);
      const semester = (body.semester || '1학기').trim().slice(0, 10);
      const examKind = body.examKind === 'midterm' ? '중간고사' : '기말고사';
      const examScope = (body.examScope || '').trim().slice(0, 300);
      const difficulty = (body.difficulty || '전체').trim();

      if (!examScope) {
        res.status(400).json({ error: '시험 범위를 먼저 입력해주세요.' });
        return;
      }

      const ai = createGeminiClient();
      const prompt = [
        `당신은 학생 눈높이에서 그림(개념 도해)을 그려주며 핵심을 짚어주는 대한민국 최고 수준의 고교 내신 전문 강사입니다.`,
        `학생 학교/학년: ${schoolName} (${highSchoolType}) ${gradeYear}학년`,
        `과목 및 시험: ${subjectName} (${semester} ${examKind})`,
        `시험 범위: ${examScope}`,
        `목표 난이도 초점: ${difficulty}`,
        `위 시험 범위에 딱 맞는 '강의 노트북 요약 + 판서 도해 그림 데이터'를 작성해주세요.`,
        `diagram 작성 가이드:`,
        `- visualType은 시험 범위 성격에 가장 잘 맞는 하나를 선택하세요: 'conceptMap'(중심 개념-세부 개념 연결), 'processFlow'(단계별 풀이/인과 흐름), 'comparison'(두 개념/사상/알고리즘 대비), 'coordinate'(함수 그래프/좌표/추세 곡선).`,
        `- nodes는 4~6개로 간결하게 구성하고, 각 node의 label(짧은 제목), sublabel(핵심 공식/키워드), detail(학생이 노드를 클릭했을 때 보여줄 강사의 구어체 보충 설명 1~2문장), role('core' | 'primary' | 'secondary' | 'warning')을 지정하세요.`,
        `- visualType이 'coordinate'일 때는 각 node의 x(10~90), y(15~85) 값을 곡선/좌표 의미에 맞게 배치하고 axisLabels도 채우세요.`,
        `- edges는 노드 id(n1, n2 등) 간의 연결(from, to, label)을 3~6개 정의하세요.`,
        `노트 본문 가이드:`,
        `- instructorGreeting: 강사가 학생에게 직접 말 걸듯이 이번 시험 범위 공부 전략 2~3문장.`,
        `- sections: 3개의 체계적인 노트 단원 요약(각 heading, bulletPoints 3~4개, keyFormulaOrRule 1줄, instructorHighlight 강사 팁 1문장).`,
        `- examTraps: ${schoolName} 내신에서 학생이 자주 틀리는 감점/함정 포인트 3가지.`,
        `- finalChecklist: 시험 직전 1분 점검 항목 4가지.`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            '교육용 요약 노트와 시각 도해 구조 데이터를 정확한 JSON으로만 반환하세요. 군더더기 없는 명쾌한 강사 어조를 사용하세요.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              instructorGreeting: { type: Type.STRING },
              diagram: {
                type: Type.OBJECT,
                properties: {
                  visualType: {
                    type: Type.STRING,
                    description: 'conceptMap, processFlow, comparison, coordinate 중 하나',
                  },
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  keyEquation: { type: Type.STRING },
                  axisLabels: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.STRING },
                      y: { type: Type.STRING },
                    },
                  },
                  nodes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        label: { type: Type.STRING },
                        sublabel: { type: Type.STRING },
                        detail: { type: Type.STRING },
                        role: { type: Type.STRING },
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                      },
                      required: ['id', 'label', 'detail'],
                    },
                  },
                  edges: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        from: { type: Type.STRING },
                        to: { type: Type.STRING },
                        label: { type: Type.STRING },
                      },
                      required: ['from', 'to'],
                    },
                  },
                },
                required: ['visualType', 'title', 'caption', 'nodes', 'edges'],
              },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    bulletPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    keyFormulaOrRule: { type: Type.STRING },
                    instructorHighlight: { type: Type.STRING },
                  },
                  required: ['heading', 'bulletPoints', 'instructorHighlight'],
                },
              },
              examTraps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              finalChecklist: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'instructorGreeting',
              'diagram',
              'sections',
              'examTraps',
              'finalChecklist',
            ],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const rawDiagram = (parsed.diagram || {}) as Record<string, unknown>;
      const vType = String(rawDiagram.visualType || 'conceptMap');
      const safeVisualType =
        vType === 'processFlow' || vType === 'comparison' || vType === 'coordinate'
          ? vType
          : 'conceptMap';

      const note = {
        id: `ai-note-${Date.now()}`,
        schoolName,
        subjectName,
        semester: semester === '2학기' ? '2학기' : '1학기',
        examKind: body.examKind === 'midterm' ? 'midterm' : 'final',
        examScope,
        difficultyFocus:
          difficulty === '하' || difficulty === '중' || difficulty === '상'
            ? difficulty
            : '전체',
        source: 'ai',
        instructorGreeting: String(parsed.instructorGreeting || ''),
        diagram: {
          visualType: safeVisualType,
          title: String(rawDiagram.title || `${subjectName} 핵심 판서 도해`),
          caption: String(rawDiagram.caption || examScope),
          keyEquation: rawDiagram.keyEquation ? String(rawDiagram.keyEquation) : undefined,
          axisLabels:
            rawDiagram.axisLabels && typeof rawDiagram.axisLabels === 'object'
              ? {
                  x: String((rawDiagram.axisLabels as Record<string, unknown>).x || 'X'),
                  y: String((rawDiagram.axisLabels as Record<string, unknown>).y || 'Y'),
                }
              : undefined,
          nodes: Array.isArray(rawDiagram.nodes)
            ? rawDiagram.nodes.map((n: Record<string, unknown>, idx: number) => ({
                id: String(n.id || `n${idx + 1}`),
                label: String(n.label || `핵심 ${idx + 1}`),
                sublabel: n.sublabel ? String(n.sublabel) : undefined,
                detail: String(n.detail || ''),
                role:
                  n.role === 'core' ||
                  n.role === 'primary' ||
                  n.role === 'secondary' ||
                  n.role === 'warning'
                    ? n.role
                    : idx === 0
                    ? 'core'
                    : 'primary',
                x: typeof n.x === 'number' ? n.x : undefined,
                y: typeof n.y === 'number' ? n.y : undefined,
              }))
            : [],
          edges: Array.isArray(rawDiagram.edges)
            ? rawDiagram.edges.map((e: Record<string, unknown>) => ({
                from: String(e.from || ''),
                to: String(e.to || ''),
                label: e.label ? String(e.label) : undefined,
              }))
            : [],
        },
        sections: Array.isArray(parsed.sections)
          ? parsed.sections.map((s: Record<string, unknown>) => ({
              heading: String(s.heading || ''),
              bulletPoints: Array.isArray(s.bulletPoints)
                ? s.bulletPoints.map((b) => String(b))
                : [],
              keyFormulaOrRule: s.keyFormulaOrRule ? String(s.keyFormulaOrRule) : undefined,
              instructorHighlight: String(s.instructorHighlight || ''),
            }))
          : [],
        examTraps: Array.isArray(parsed.examTraps)
          ? parsed.examTraps.map((t) => String(t))
          : [],
        finalChecklist: Array.isArray(parsed.finalChecklist)
          ? parsed.finalChecklist.map((c) => String(c))
          : [],
      };

      res.json({ note });
    } catch (err) {
      const { status, message } = getReadableGeminiError(err);
      res.status(status).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
