import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import OpenAI from "openai";
import { chatRequestSchema, scenarios, type ChatResponse, type Message, type Session } from "@shared/schema";
import { randomUUID } from "crypto";
import { selectBestScript, generateScriptGuidance, getScriptById, type MPTScript } from "./mpt-scripts";
import { 
  createInitialSessionState, 
  detectRequestType, 
  detectClientSaysIDontKnow, 
  getHelpingQuestion,
  extractClientName,
  extractImportanceRating,
  selectHomework,
  generateStagePrompt,
  shouldTransitionToNextStage,
  transitionToNextStage,
  transformToAuthorship,
  IMPLEMENTATION_PRACTICES,
  MPT_STAGE_CONFIG,
  REQUEST_TYPE_SCRIPTS,
  type SessionState,
  type TherapyContext,
  type MPTStage
} from "./session-state";

const cerebrasClient = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

// Algion API as fallback when Cerebras rate limits are hit
const algionClient = process.env.ALGION_API_KEY ? new OpenAI({
  apiKey: process.env.ALGION_API_KEY,
  baseURL: "https://api.algion.dev/v1",
}) : null;

// Per-session fallback tracking with timestamp for periodic retry
const sessionFallbackState = new Map<string, { useFallback: boolean; fallbackTime: number }>();
const FALLBACK_RETRY_INTERVAL = 5 * 60 * 1000; // Retry Cerebras every 5 minutes

const sessions = new Map<string, Session>();
const sessionStates = new Map<string, SessionState>();

const BASE_MPT_PRINCIPLES = `ВАЖНО: Отвечай сразу, без размышлений. НЕ используй теги <think>, </think> или любые блоки размышлений. Сразу пиши ответ клиенту.

Ты — опытный МПТ-терапевт (Мета-Персональная Терапия) мужского пола по методу Александра Волынского, ведущий психологическую сессию. Всегда используй мужской род в своих ответах (например, "я рад", "я понял", а не "я рада", "я поняла"). ВСЕГДА обращайся к клиенту на "ты" (неформально), НИКОГДА не используй "вы" или "Вы". При приветствии говори "Здравствуй", а не "Привет". 

## ТВОЯ ГЛАВНАЯ ЗАДАЧА:
Ты НЕ просто интервьюируешь клиента! Ты ВЕДЁШЬ его по полному структурированному скрипту МПТ. Ты не даёшь советов, не анализируешь, не интерпретируешь — ты ведёшь клиента к обнаружению его СОБСТВЕННЫХ ресурсов и новой идентичности через вопросы.

## СТРУКТУРА МПТ-СЕССИИ (11 ЭТАПОВ — ПОЛНЫЙ АЛГОРИТМ):
Эти этапы НЕ зависят от темы (деньги, отношения, страх) — они зависят от СТРУКТУРЫ запроса.

1. **КОНТЕКСТ** — Понять ситуацию, что происходит. "Расскажи, что сейчас происходит?" Оценить важность (1-10). Если <8 — найти более значимый контекст.

2. **УТОЧНЕНИЕ ЗАПРОСА (5 КРИТЕРИЕВ!)** — ОБЯЗАТЕЛЬНАЯ ВАЛИДАЦИЯ:
   - **Позитивность**: "Чего ты ХОЧЕШЬ?" (не "чего не хочешь")
   - **Авторство**: "Это зависит от тебя? Где твоё действие?"
   - **Конкретность**: "Как ты поймёшь, что получил это? Что изменится?"
   - **Реалистичность**: "Насколько это реально для тебя?"
   - **Мотивация**: "Как ты будешь себя ЧУВСТВОВАТЬ, когда это получишь?"
   НЕ ПЕРЕХОДИ ДАЛЬШЕ, пока запрос не проверен по всем 5 критериям!

3. **ИССЛЕДОВАНИЕ СТРАТЕГИИ** — СЕРДЦЕ МПТ! Задай вопросы:
   - "Что ты ДЕЛАЕШЬ для создания этой ситуации?"
   - "Какие действия ты предпринимаешь?"
   - "К какому результату это обычно приводит?"
   - "ЗАЧЕМ ты это делаешь? Какую важную задачу решаешь?"
   - "Чему ПОМОГАЕТ эта стратегия? Какой в ней конструктивный смысл?"
   Клиент должен увидеть, что ОН автор своей стратегии!

4. **ПОИСК ПОТРЕБНОСТИ** — Циркулярные вопросы (снятие слоёв):
   - "Когда ты это получишь — что тебе это даст?"
   - "А что стоит ЗА этим? К чему это приведёт?"
   - "И какую потребность ты тогда реализуешь?"
   - "Есть ли что-то ещё ГЛУБЖЕ?"
   - "Кем ты себя будешь ОЩУЩАТЬ?"
   Повторяй, пока не выйдешь на формулировку "Я хочу ощущать себя..."

5. **ТЕЛЕСНАЯ РАБОТА** — ГЛУБОКОЕ ИССЛЕДОВАНИЕ ОЩУЩЕНИЯ:
   - "Где в теле ты ощущаешь эту потребность?"
   После ответа ОБЯЗАТЕЛЬНО спроси ВСЕ характеристики:
   - "Какого РАЗМЕРА это ощущение?"
   - "Какой ФОРМЫ оно?"
   - "Какой ПЛОТНОСТИ? Плотное, лёгкое, рыхлое, текучее?"
   - "Какая ТЕМПЕРАТУРА? Тёплое, холодное, нейтральное?"
   - "Есть ли ДВИЖЕНИЕ? Куда оно направлено?"
   - "Есть ли импульс подвигаться? Какое движение хочется сделать?"
   ТОЛЬКО после полного описания ощущения переходи к образу!

6. **СОЗДАНИЕ ОБРАЗА** — Из телесного ощущения создать метафору:
   - "Если бы это ощущение могло стать ОБРАЗОМ — на что бы оно было похоже?"
   - "Опиши этот образ — как он выглядит?"
   - "Какой у него характер? Какие качества?"
   - "Сколько в нём ЭНЕРГИИ?"
   - "Если бы ты мог СТАТЬ этим образом полностью — как бы ты себя ощущал?"

7. **СТАНОВЛЕНИЕ ОБРАЗОМ + ДВИЖЕНИЕ**:
   - "Представь, что ты сейчас — этот образ. Стань им полностью."
   - "Что меняется в ощущениях?"
   - "Какое ДВИЖЕНИЕ хочет родиться из этого?"
   После движения ОБЯЗАТЕЛЬНО спроси:
   - "Что изменилось в ощущениях?"
   - "Достаточно ли этого движения, или хочется ещё?"

8. **МЕТАПОЗИЦИЯ** — Глазами образа смотрим на клиента:
   - "Теперь, будучи этим образом, посмотри на (имя клиента). Каким ты его видишь?"
   - "Как ты смотришь на ЕГО ЖИЗНЬ? Что замечаешь?"
   - "Как выглядит ЕГО ПРИВЫЧНАЯ СТРАТЕГИЯ с твоей позиции?"
   - "Есть ли что-то, чего он НЕ ВИДИТ, но что очевидно для тебя?"
   - "Что ты хочешь ЕМУ ПЕРЕДАТЬ? Какое послание?"
   - "Чему ты УЧИШЬ его сейчас?"
   - "Что ты знаешь о нём, чего ОН НЕ ЗАМЕЧАЕТ?"

9. **ИНТЕГРАЦИЯ ЧЕРЕЗ ТЕЛО**:
   - "Если бы эта энергия свободно проявлялась через тебя — как бы это ощущалось?"
   - "Что изменится, если ты перестанешь разделять себя и эту силу?"
   - "Если бы эта энергия проявлялась через ТЕЛО — как бы оно ДВИГАЛОСЬ?"
   - "Позволь телу подвигаться так, как ему хочется."
   - "Что изменилось в ощущении груди? Тела?"
   Предложи ФИЗИЧЕСКОЕ ДВИЖЕНИЕ для интеграции!

10. **НОВЫЕ ДЕЙСТВИЯ (SMART-формат)**:
    - "Из этого нового состояния — как ты можешь действовать по-новому?"
    - "Какой ОДИН КОНКРЕТНЫЙ ШАГ ты готов сделать в ближайшие 24 часа?"
    - "ЧТО ИМЕННО это будет?" (конкретное действие)
    - "КОГДА ты это сделаешь?" (время)
    - "КАК ты узнаешь, что сделал этот шаг?" (измеримость)

11. **ПРАКТИКИ ВНЕДРЕНИЯ** — ОБЯЗАТЕЛЬНЫЙ финал! Предложи выбор:
    1. Быстрый переключатель — "Если бы ты был [образом] — как бы это ощущалось?"
    2. Утренняя практика — "Каждое утро: Как бы [образ] прожил этот день?"
    3. Переключатель в моменте — "Когда замечу привычную реакцию — как бы действовал [образ]?"
    4. Проверка действием — конкретный шаг + наблюдение за ощущениями

## 7 БАЗОВЫХ ПРИНЦИПОВ МПТ (ОБЯЗАТЕЛЬНЫЕ УСЛОВИЯ ПОВЕДЕНИЯ):

1. **ЦЕЛОСТНОСТЬ** — Всё, о чём говорит клиент — это карта его внутренней реальности. При работе с раздражением, страхом, восхищением — переводи клиента на «это — ты»: "Кто в тебе проявляет это качество?" Если клиент говорит о другом человеке — активируй работу с проекцией.

2. **ТОЧКА РЕШЕНИЯ** — При любом запросе СНАЧАЛА уточни, как будет выглядеть состояние после решения: "Как ты себя почувствуешь, когда это будет реализовано?" Клиент уже приходит с решением — нужно найти это состояние.

3. **ПОЗИТИВНАЯ ЦЕЛЬ** — Любая стратегия служит реализации позитивной цели. Исследуй: "Зачем ты это делаешь? Какую важную задачу решаешь? Чему это помогает?" Не существует "проблемных" частей психики — есть конструктивное намерение.

4. **НОВАЯ ИДЕНТИЧНОСТЬ** — Создавай образ-якорь через: телесное ощущение → метафора → "стать этим" → физическое движение. За границами привычного "Я" могут быть обнаружены ресурсы и способности.

5. **ВОЗВРАЩЕНИЕ АВТОРСТВА** — НЕМЕДЛЕННО переформулируй проекции в реальном времени:
   - "Меня заставили" → "Я ПОЗВОЛИЛ..."
   - "На меня давит" → "Я ДАВЛЮ на себя..."
   - "Меня обидели" → "Я ОБИДЕЛСЯ, когда..."
   - "Он меня бесит" → "Я ЗЛЮСЬ, когда он..."
   - "Живу не своей жизнью" → "Я ДЕЛАЮ так, что живу не своей жизнью"
   - "Сижу в клетке" → "Я САЖАЮ себя в клетку"
   - "Он посадил себя" → "Я САЖАЮ себя"
   - "Мне мешают" → "Я ВСТРЕЧАЮ препятствие, когда..."
   ВСЕГДА возвращай клиенту авторство! Клиент — автор, а не жертва.

6. **ПРЕКРАЩЕНИЕ КОНФЛИКТА** — При телесных ощущениях (напряжение, блок, боль) НЕ устраняй, а ИССЛЕДУЙ: "Если бы ты позволил этому ощущению быть — как бы оно проявилось?" Энергию невозможно отключить — только направить конструктивно.

7. **НЕМЕДЛЕННОЕ ВНЕДРЕНИЕ** — ВСЕГДА завершай сессию конкретным SMART-действием: "Что именно ты сделаешь? Когда? Как узнаешь, что сделал?" + практика внедрения. Без конкретного шага сессия НЕ завершена!

## ЕСЛИ КЛИЕНТ ГОВОРИТ "НЕ ЗНАЮ / НЕ ЧУВСТВУЮ / НЕ ПОНИМАЮ":
Это нормально! ВСЕГДА используй технику "если бы" — она обходит сознательные защиты:
- "А если бы знал — на что бы это знание могло быть похоже?"
- "А если бы понимал — каким бы могло быть это понимание?"
- "А если бы чувствовал — каким бы могло быть это ощущение?"
- "А если бы видел образ — каким бы он мог быть?"
- "Просто позволь себе пофантазировать — если бы..."
Никогда не принимай "не знаю" как финальный ответ — мягко продолжай исследование через "если бы".

## РАБОТА С ТЕЛОМ И ДВИЖЕНИЕМ (ДАЖЕ В ТЕКСТЕ):
Даже в текстовом формате можно работать с телом. Предлагай микро-движения:
- "Опиши, как бы двигалось это состояние"
- "Позволь телу представить это движение"
- "Если бы ты как энергия мог реализоваться через движение — каким бы оно было?"
- "Что изменилось после того, как ты представил это движение?"
- "Достаточно ли этого движения, или хочется ещё?"
ВСЕГДА проверяй завершённость движения!

## КРИТИЧЕСКИ ВАЖНО — СТРОГАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ ЭТАПОВ:
**НЕЛЬЗЯ ПЕРЕСКАКИВАТЬ ЭТАПЫ!** Ты ОБЯЗАН проходить этапы СТРОГО ПО ПОРЯДКУ.

**ЗАПРЕЩЕНО:**
- Давать советы, интерпретации, диагнозы — ТОЛЬКО вопросы!
- Задавать вопросы про образы и метафоры ДО полного описания телесного ощущения
- Переходить к метапозиции ДО полного прохождения предыдущих этапов
- Смешивать вопросы из разных этапов
- Интерпретировать ответы клиента вместо следования структуре
- Переходить к следующему этапу без завершения текущего
- Использовать термины "проблема", "травма", "патология" — используй нейтральные слова
- Продолжать сессию при некорректном запросе (сначала помоги сформулировать по 5 критериям!)
- Завершать сессию БЕЗ конкретного SMART-действия и практики внедрения
- Пропускать характеристики телесного ощущения (размер, форма, плотность, температура, движение)
- Пропускать вопросы метапозиции (взгляд на жизнь, стратегию, послание образа)

**ТЫ ОБЯЗАН:**
- ЗАПИСЫВАТЬ в памяти сессии: формулировку цели, найденную потребность, образ-якорь, конкретный шаг
- НЕМЕДЛЕННО трансформировать проекции в авторство ("меня заставили" → "я позволил")
- При выходе клиента за рамки — аккуратно возвращать в структуру: "Я слышу тебя. Давай вернёмся к вопросу..."
- Работать с проекциями, если клиент говорит о другом человеке
- Задавать ВСЕ вопросы про телесные характеристики (размер, форма, плотность, температура, движение)
- Задавать ВСЕ вопросы метапозиции (взгляд на жизнь, стратегию, послание)
- Проверять завершённость движения ("Достаточно? Хочется ещё?")
- ВСЕГДА завершать сессию конкретным SMART-действием + практикой внедрения

## СЦЕНАРИИ РАБОТЫ (темы клиентских запросов):

1. "День сурка" (burnout) — выгорание, апатия, нет энергии
2. "Тревожный звоночек" (anxiety) — паника, тревога, навязчивые мысли  
3. "Островок" (loneliness) — одиночество, проблемы в отношениях
4. "Перекресток" (crossroads) — кризис самоопределения, поиск смысла
5. "Груз прошлого" (trauma) — детские травмы, токсичная семья
6. "После бури" (loss) — утрата, развод, горе
7. "Тело взывает о помощи" (psychosomatic) — психосоматика
8. "Внутренний критик" (inner-critic) — самооценка, перфекционизм
9. "На взводе" (anger) — гнев, раздражительность
10. "Без якоря" (boundaries) — границы, неумение говорить "нет"
11. "Выбор без выбора" (decisions) — паралич принятия решений
12. "Родительский квест" (parenting) — детско-родительские отношения
13. "В тени социума" (social) — социальная тревожность
14. "Эмоциональные качели" (mood-swings) — нестабильность настроения
15. "Просто жизнь" (growth) — личностный рост

## ТВОЙ СТИЛЬ:
- Веди себя как тёплый, принимающий, но профессиональный терапевт.
- **КРИТИЧЕСКИ ВАЖНО: ЗАДАВАЙ МАКСИМУМ 1 ВОПРОС ЗА ОТВЕТ!** Один глубокий вопрос лучше нескольких поверхностных. Не перегружай клиента.
- Не переходи к следующему этапу, пока клиент не дал чёткий ответ на текущий вопрос.
- Отражай чувства клиента, проявляй эмпатию.
- Двигайся по этапам последовательно и медленно — по одному вопросу за раз.
- Не торопи клиента, дай время осмыслить каждый вопрос.
- НЕ ПРИДУМЫВАЙ ИМЕНА! Используй имя клиента ТОЛЬКО если он сам его назвал. До этого обращайся без имени.
- **ПИШИ ГРАМОТНО НА РУССКОМ ЯЗЫКЕ**: Соблюдай правила русской грамматики.
- Твой ответ: краткое отражение (1-2 предложения) + 1 вопрос. Не пиши длинные монологи.

## КРИТЕРИИ КАЧЕСТВА МПТ-СЕССИИ:
Сессия считается успешной, если ты:
✅ Вёл клиента по полной структуре скрипта (все 11 этапов)
✅ Проверил запрос по 5 критериям (позитивность, авторство, конкретность, реалистичность, мотивация)
✅ Исследовал стратегию клиента (что он ДЕЛАЕТ, зачем, какая конструктивная цель)
✅ Использовал циркулярные вопросы до нахождения эталонного состояния
✅ Полностью описал телесное ощущение (размер, форма, плотность, температура, движение)
✅ Провёл полную метапозицию (взгляд на жизнь, стратегию, послание образа)
✅ Работал с телом, образом и движением, проверил завершённость
✅ Трансформировал проекции в авторство в реальном времени
✅ Применял все 7 базовых принципов МПТ
✅ Завершил конкретным SMART-действием + практикой внедрения
✅ НЕ давал советов — раскрывал внутренние ресурсы клиента через вопросы

## ФИНАЛ СЕССИИ (ОБЯЗАТЕЛЬНЫЙ ФОРМАТ):
Когда сессия завершена, скажи:
"Спасибо за доверие. Сегодня ты:
— нашёл глубинную потребность: [...]
— соединился с энергией/образом: [...]
— увидел новое через метапозицию: [...]
— сформулировал первый шаг: [что, когда, как узнаешь]
Хочешь выбрать практику внедрения для закрепления результата?"

## ОБЯЗАТЕЛЬНАЯ МЕТОДИЧЕСКАЯ РАЗМЕТКА:
**В КАЖДОМ своём ответе** в самом начале указывай в квадратных скобках:
1. Название текущего сценария (если определён)
2. Текущий этап МПТ-сессии

Формат: **[Сценарий: название | Этап: название этапа]**

Примеры:
- [Сценарий: Тревожный звоночек | Этап: Телесная работа]
- [Сценарий: День сурка | Этап: Исследование стратегии]
- [Сценарий: не определён | Этап: Уточнение запроса]

После разметки продолжай обычный терапевтический ответ.

## ОБРАБОТКА НЕПОНЯТНЫХ СООБЩЕНИЙ:
Если клиент пишет бессмыслицу, набор букв, непонятный текст или что-то неразборчивое — не пытайся это интерпретировать или придумывать смысл. Вежливо попроси уточнить: "Извини, я не совсем понял. Можешь переформулировать или написать подробнее, что ты имеешь в виду?"`;

function detectScenario(message: string): { id: string; name: string } | null {
  const lowerMessage = message.toLowerCase();
  
  for (const scenario of scenarios) {
    for (const keyword of scenario.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return { id: scenario.id, name: scenario.name };
      }
    }
  }
  
  return null;
}

function getPhaseFromStage(stage: MPTStage): string {
  const config = MPT_STAGE_CONFIG[stage];
  return config?.russianName || "Исследование запроса";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/chat", async (req, res) => {
    try {
      const parseResult = chatRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parseResult.error.errors 
        });
      }
      
      const { message, sessionId, scenarioId } = parseResult.data;
      
      let session: Session;
      let isNewSession = false;
      
      if (sessionId && sessions.has(sessionId)) {
        session = sessions.get(sessionId)!;
      } else {
        isNewSession = true;
        const detectedScenario = scenarioId 
          ? scenarios.find(s => s.id === scenarioId) 
          : detectScenario(message);
        
        const requestType = detectRequestType(message);
        const selectedScript = selectBestScript(message, detectedScenario?.id || null);
        
        const initialState = createInitialSessionState();
        initialState.requestType = requestType;
        initialState.context.originalRequest = message;
        initialState.sessionStarted = true;
        
        session = {
          id: randomUUID(),
          scenarioId: detectedScenario?.id || null,
          scenarioName: detectedScenario?.name || null,
          scriptId: selectedScript.id,
          scriptName: selectedScript.name,
          messages: [],
          phase: getPhaseFromStage(initialState.currentStage),
          createdAt: new Date().toISOString(),
          state: {
            currentStage: initialState.currentStage,
            currentQuestionIndex: initialState.currentQuestionIndex,
            stageHistory: initialState.stageHistory,
            context: initialState.context,
            requestType: initialState.requestType || null,
            importanceRating: initialState.importanceRating,
            lastClientResponse: initialState.lastClientResponse,
            clientSaysIDontKnow: initialState.clientSaysIDontKnow,
            movementOffered: initialState.movementOffered,
            integrationComplete: initialState.integrationComplete
          }
        };
        sessions.set(session.id, session);
        sessionStates.set(session.id, initialState);
      }
      
      const userMessage: Message = {
        id: randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      session.messages.push(userMessage);
      
      if (!session.scenarioId) {
        const detectedScenario = detectScenario(message);
        if (detectedScenario) {
          session.scenarioId = detectedScenario.id;
          session.scenarioName = detectedScenario.name;
        }
      }
      
      if (!session.scriptId) {
        const selectedScript = selectBestScript(message, session.scenarioId);
        session.scriptId = selectedScript.id;
        session.scriptName = selectedScript.name;
      }
      
      const conversationHistory = session.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      
      let sessionState = sessionStates.get(session.id);
      if (!sessionState) {
        sessionState = createInitialSessionState();
        sessionState.context.originalRequest = message;
        sessionStates.set(session.id, sessionState);
      }
      
      sessionState.lastClientResponse = message;
      sessionState.clientSaysIDontKnow = detectClientSaysIDontKnow(message);
      sessionState.stageResponseCount++;
      
      const clientName = extractClientName(session.messages.map(m => ({ role: m.role, content: m.content })));
      if (clientName) {
        sessionState.context.clientName = clientName;
      }
      
      const importanceRating = extractImportanceRating(message);
      if (importanceRating !== null) {
        sessionState.importanceRating = importanceRating;
      }
      
      const authorshipTransform = transformToAuthorship(message);
      
      if (shouldTransitionToNextStage(sessionState)) {
        const newState = transitionToNextStage(sessionState);
        Object.assign(sessionState, newState);
        sessionStates.set(session.id, sessionState);
      }
      
      let contextualPrompt = BASE_MPT_PRINCIPLES;
      
      const stagePrompt = generateStagePrompt(sessionState);
      contextualPrompt += stagePrompt;
      
      if (authorshipTransform) {
        contextualPrompt += `\n\n## ТРАНСФОРМАЦИЯ В АВТОРСТВО:\n${authorshipTransform}`;
      }
      
      if (sessionState.context.clientName) {
        contextualPrompt += `\n\n## КОНТЕКСТ КЛИЕНТА:\nИмя клиента: ${sessionState.context.clientName}. Используй имя в своих ответах.`;
      }
      
      if (sessionState.importanceRating !== null) {
        contextualPrompt += `\nОценка важности запроса: ${sessionState.importanceRating}/10.`;
        if (sessionState.importanceRating < 8) {
          contextualPrompt += ` Оценка ниже 8 — это сигнал, что можно поискать более глубокий контекст или более значимую цель.`;
        }
      }
      
      if (sessionState.clientSaysIDontKnow) {
        const helpingQ = getHelpingQuestion(sessionState.currentStage, '');
        contextualPrompt += `\n\n## ВНИМАНИЕ: Клиент говорит "не знаю"!\nИспользуй технику "если бы". Например: "${helpingQ}"`;
      }
      
      if (session.scenarioId && session.scenarioName) {
        const scenario = scenarios.find(s => s.id === session.scenarioId);
        if (scenario) {
          contextualPrompt += `\n\n## ТЕКУЩИЙ СЦЕНАРИЙ: "${scenario.name}"\n${scenario.description}\nТипичные ключевые слова: ${scenario.keywords.join(", ")}`;
        }
      }
      
      if (sessionState.requestType && sessionState.requestType !== 'general') {
        contextualPrompt += `\n\n## ТИП ЗАПРОСА КЛИЕНТА: ${sessionState.requestType}\nРекомендуемый подход: ${REQUEST_TYPE_SCRIPTS[sessionState.requestType]}`;
      }
      
      if (sessionState.currentStage === 'finish') {
        const homework = selectHomework(sessionState.context);
        contextualPrompt += `\n\n## ПРАКТИКА ВНЕДРЕНИЯ:\nПредложи клиенту практику: "${homework.name}" — ${homework.description}`;
      }
      
      contextualPrompt += `\n\n## ПРОГРЕСС СЕССИИ:
- Текущий этап: ${MPT_STAGE_CONFIG[sessionState.currentStage].russianName} (${sessionState.stageResponseCount} ответов на этапе)
- Пройденные этапы: ${sessionState.stageHistory.map(s => MPT_STAGE_CONFIG[s].russianName).join(' → ') || 'начало сессии'}
- Собранный контекст:
  ${sessionState.context.originalRequest ? `- Изначальный запрос: "${sessionState.context.originalRequest}"` : ''}
  ${sessionState.context.clarifiedRequest ? `- Уточнённый запрос: "${sessionState.context.clarifiedRequest}"` : ''}
  ${sessionState.context.currentStrategy ? `- Текущая стратегия: "${sessionState.context.currentStrategy}"` : ''}
  ${sessionState.context.deepNeed ? `- Глубинная потребность: "${sessionState.context.deepNeed}"` : ''}
  ${sessionState.context.bodyLocation ? `- Телесное ощущение: "${sessionState.context.bodyLocation}"` : ''}
  ${sessionState.context.metaphor ? `- Образ/метафора: "${sessionState.context.metaphor}"` : ''}

/no_think`;
      
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      
      // Determine fallback state for this session
      const fallbackState = sessionFallbackState.get(session.id);
      const now = Date.now();
      let useFallbackForThisRequest = false;
      
      if (fallbackState?.useFallback && algionClient) {
        // Check if we should retry Cerebras
        if (now - fallbackState.fallbackTime > FALLBACK_RETRY_INTERVAL) {
          useFallbackForThisRequest = false; // Try Cerebras again
          console.log(`Session ${session.id}: Retrying Cerebras after fallback period`);
        } else {
          useFallbackForThisRequest = true;
        }
      } else if (fallbackState?.useFallback && !algionClient) {
        // Algion fallback not available, clear state and try Cerebras
        sessionFallbackState.delete(session.id);
        useFallbackForThisRequest = false;
        console.log(`Session ${session.id}: Algion fallback not available, clearing fallback state`);
      }
      
      let currentProvider = useFallbackForThisRequest ? "algion" : "cerebras";
      
      res.write(`data: ${JSON.stringify({ 
        type: "meta", 
        sessionId: session.id, 
        scenarioId: session.scenarioId, 
        scenarioName: session.scenarioName,
        scriptId: session.scriptId,
        scriptName: session.scriptName,
        currentStage: sessionState.currentStage,
        stageName: MPT_STAGE_CONFIG[sessionState.currentStage].russianName,
        provider: currentProvider
      })}\n\n`);
      
      let fullContent = "";
      let rawContent = "";
      let insideThinkBlock = false;
      
      const filterThinkTags = (content: string): string => {
        let result = "";
        let i = 0;
        while (i < content.length) {
          if (!insideThinkBlock) {
            if (content.slice(i).startsWith("<think>")) {
              insideThinkBlock = true;
              i += 7;
            } else {
              result += content[i];
              i++;
            }
          } else {
            if (content.slice(i).startsWith("</think>")) {
              insideThinkBlock = false;
              i += 8;
            } else {
              i++;
            }
          }
        }
        return result;
      };
      
      const apiMessages = [
        { role: "system" as const, content: contextualPrompt },
        ...conversationHistory,
      ];
      
      const streamWithCerebras = async () => {
        const stream = await cerebrasClient.chat.completions.create({
          model: "qwen-3-32b",
          messages: apiMessages,
          max_completion_tokens: 4096,
          temperature: 0.4,
          top_p: 0.8,
          stream: true,
        });
        
        for await (const chunk of stream) {
          const chunkData = chunk as { choices: Array<{ delta?: { content?: string } }> };
          const content = chunkData.choices[0]?.delta?.content || "";
          if (content) {
            rawContent += content;
            const filtered = filterThinkTags(content);
            if (filtered) {
              fullContent += filtered;
              res.write(`data: ${JSON.stringify({ type: "chunk", content: filtered })}\n\n`);
            }
          }
        }
      };
      
      const streamWithAlgion = async () => {
        if (!algionClient) {
          throw new Error("Algion API key not configured");
        }
        const stream = await algionClient.chat.completions.create({
          model: "gpt-4o",
          messages: apiMessages,
          max_tokens: 4096,
          temperature: 0.4,
          top_p: 0.8,
          stream: true,
        });
        
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            rawContent += content;
            const filtered = filterThinkTags(content);
            if (filtered) {
              fullContent += filtered;
              res.write(`data: ${JSON.stringify({ type: "chunk", content: filtered })}\n\n`);
            }
          }
        }
      };
      
      try {
        if (useFallbackForThisRequest) {
          console.log(`Session ${session.id}: Using Algion fallback (fallback mode active)`);
          await streamWithAlgion();
        } else {
          await streamWithCerebras();
          // Cerebras succeeded - clear fallback state if it was set
          if (fallbackState?.useFallback) {
            sessionFallbackState.delete(session.id);
            console.log(`Session ${session.id}: Cerebras recovered, clearing fallback state`);
          }
        }
      } catch (apiError: any) {
        const errorMessage = apiError?.message || String(apiError);
        const isRateLimitError = errorMessage.includes("429") || 
                                  errorMessage.toLowerCase().includes("rate limit") ||
                                  errorMessage.toLowerCase().includes("tokens per day limit");
        
        if (isRateLimitError && !useFallbackForThisRequest && algionClient) {
          console.log(`Session ${session.id}: Cerebras rate limit hit, switching to Algion fallback`);
          sessionFallbackState.set(session.id, { useFallback: true, fallbackTime: Date.now() });
          currentProvider = "algion";
          
          // Notify client about provider switch with updated metadata
          res.write(`data: ${JSON.stringify({ type: "info", message: "Переключаюсь на резервный AI провайдер..." })}\n\n`);
          res.write(`data: ${JSON.stringify({ type: "provider_switch", provider: "algion" })}\n\n`);
          
          try {
            await streamWithAlgion();
          } catch (algionError) {
            throw algionError;
          }
        } else if (isRateLimitError && !algionClient) {
          console.log(`Session ${session.id}: Cerebras rate limit hit, but Algion is not configured`);
          res.write(`data: ${JSON.stringify({ type: "error", message: "AI сервис временно перегружен. Пожалуйста, попробуйте позже." })}\n\n`);
          throw new Error("Cerebras rate limit hit and Algion fallback not available");
        } else {
          throw apiError;
        }
      }
      
      const assistantMessage: Message = {
        id: randomUUID(),
        role: "assistant",
        content: fullContent || "Произошла ошибка. Пожалуйста, попробуй ещё раз.",
        timestamp: new Date().toISOString(),
      };
      session.messages.push(assistantMessage);
      
      session.phase = getPhaseFromStage(sessionState.currentStage);
      
      res.write(`data: ${JSON.stringify({ 
        type: "done", 
        phase: session.phase,
        currentStage: sessionState.currentStage,
        stageName: MPT_STAGE_CONFIG[sessionState.currentStage].russianName
      })}\n\n`);
      
      res.end();
      
    } catch (error) {
      console.error("Chat error:", error);
      if (!res.headersSent) {
        return res.status(500).json({ 
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error"
        });
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "Unknown error" })}\n\n`);
        res.end();
      }
    }
  });
  
  app.post("/api/sessions/new", (req, res) => {
    const { scenarioId } = req.body;
    
    const scenario = scenarioId 
      ? scenarios.find(s => s.id === scenarioId) 
      : null;
    
    const selectedScript = selectBestScript("", scenario?.id || null);
    
    const initialState = createInitialSessionState();
    
    const session: Session = {
      id: randomUUID(),
      scenarioId: scenario?.id || null,
      scenarioName: scenario?.name || null,
      scriptId: selectedScript.id,
      scriptName: selectedScript.name,
      messages: [],
      phase: getPhaseFromStage(initialState.currentStage),
      createdAt: new Date().toISOString(),
      state: {
        currentStage: initialState.currentStage,
        currentQuestionIndex: initialState.currentQuestionIndex,
        stageHistory: initialState.stageHistory,
        context: initialState.context,
        requestType: initialState.requestType || null,
        importanceRating: initialState.importanceRating,
        lastClientResponse: initialState.lastClientResponse,
        clientSaysIDontKnow: initialState.clientSaysIDontKnow,
        movementOffered: initialState.movementOffered,
        integrationComplete: initialState.integrationComplete
      }
    };
    
    sessions.set(session.id, session);
    sessionStates.set(session.id, initialState);
    
    return res.json({
      sessionId: session.id,
      scenarioId: session.scenarioId,
      scenarioName: session.scenarioName,
      scriptId: session.scriptId,
      scriptName: session.scriptName,
      phase: session.phase,
      currentStage: initialState.currentStage,
      stageName: MPT_STAGE_CONFIG[initialState.currentStage].russianName
    });
  });
  
  app.get("/api/scenarios", (req, res) => {
    return res.json(scenarios);
  });
  
  app.get("/api/stages", (req, res) => {
    return res.json(MPT_STAGE_CONFIG);
  });

  return httpServer;
}
