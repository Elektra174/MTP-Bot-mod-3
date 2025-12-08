export type MPTStage = 
  | 'start_session'
  | 'collect_context'
  | 'clarify_request'
  | 'explore_strategy'
  | 'find_need'
  | 'bodywork'
  | 'metaphor'
  | 'meta_position'
  | 'integration'
  | 'plan_actions'
  | 'finish';

export const MPT_STAGE_ORDER: MPTStage[] = [
  'start_session',
  'collect_context',
  'clarify_request',
  'explore_strategy',
  'find_need',
  'bodywork',
  'metaphor',
  'meta_position',
  'integration',
  'plan_actions',
  'finish'
];

export interface StageConfig {
  name: string;
  russianName: string;
  goal: string;
  questions: string[];
  minResponses: number;
  transitionCriteria: string[];
}

export const MPT_STAGE_CONFIG: Record<MPTStage, StageConfig> = {
  start_session: {
    name: 'start_session',
    russianName: 'Создание пространства сессии',
    goal: 'Создать терапевтическое пространство и рамку сессии',
    questions: [
      'Привет! Рад тебя видеть. Мы с тобой сейчас в сессии — у нас есть время и пространство для работы. Расскажи, что тебя сейчас беспокоит или над чем хотел бы поработать сегодня?'
    ],
    minResponses: 1,
    transitionCriteria: ['Клиент озвучил запрос или тему для работы']
  },
  collect_context: {
    name: 'collect_context',
    russianName: 'Сбор контекста',
    goal: 'Понять ситуацию, контекст и важность темы для клиента',
    questions: [
      'Расскажи подробнее, что сейчас происходит в этой области?',
      'Как давно это тебя беспокоит?',
      'Как это влияет на твою жизнь?',
      'Что ты уже пробовал делать с этим?',
      'Насколько это важно для тебя по шкале от 1 до 10?'
    ],
    minResponses: 2,
    transitionCriteria: ['Понятен контекст ситуации', 'Ясна важность темы для клиента (оценка 8+)']
  },
  clarify_request: {
    name: 'clarify_request',
    russianName: 'Уточнение запроса (5 критериев)',
    goal: 'ОБЯЗАТЕЛЬНО проверить запрос по 5 критериям: позитивность, авторство, конкретность, реалистичность, мотивация',
    questions: [
      'Чего ты ХОЧЕШЬ в результате нашей работы? Как бы ты сформулировал свой запрос?',
      'А что ты хочешь ВМЕСТО этого? Сформулируй позитивно — чего хочешь, а не чего не хочешь.',
      'Это то, что зависит от ТЕБЯ? Где здесь ТВОЁ действие? Как ты можешь на это повлиять?',
      'Можешь описать это более КОНКРЕТНО? Как ты ПОЙМЁШЬ, что получил это? Что изменится?',
      'Насколько РЕАЛЬНО для тебя достичь этого?',
      'Если представить, что ты это уже получил — как бы ты себя ЧУВСТВОВАЛ? Какие эмоции, ощущения?'
    ],
    minResponses: 3,
    transitionCriteria: ['Запрос сформулирован ПОЗИТИВНО (чего хочу)', 'Есть АВТОРСТВО (зависит от клиента)', 'Запрос КОНКРЕТЕН (понятно как измерить)', 'Запрос РЕАЛИСТИЧЕН', 'Проверена МОТИВАЦИЯ (как будет чувствовать)']
  },
  explore_strategy: {
    name: 'explore_strategy',
    russianName: 'Исследование стратегии',
    goal: 'СЕРДЦЕ МПТ! Выявить ЧТО клиент ДЕЛАЕТ для создания ситуации, намерение и конструктивную цель стратегии',
    questions: [
      'Что ты сейчас ДЕЛАЕШЬ в этой ситуации? Какие действия предпринимаешь?',
      'Что ты делаешь, чтобы СОЗДАВАТЬ эту ситуацию? Как именно это проявляется в твоём поведении?',
      'К какому результату это обычно приводит?',
      'А ЗАЧЕМ ты это делаешь? Какую важную задачу решаешь?',
      'Чему ПОМОГАЕТ эта стратегия? Какой конструктивный смысл она несёт?',
      'Если бы эта стратегия работала ИДЕАЛЬНО — что бы ты получил?'
    ],
    minResponses: 3,
    transitionCriteria: ['Выявлена текущая стратегия (что ДЕЛАЕТ клиент)', 'Понятно НАМЕРЕНИЕ за стратегией', 'Клиент увидел КОНСТРУКТИВНУЮ цель стратегии']
  },
  find_need: {
    name: 'find_need',
    russianName: 'Поиск потребности',
    goal: 'Через циркулярные вопросы (снятие слоёв) найти глубинную потребность — эталонное состояние',
    questions: [
      'Когда ты это получишь — что тебе это ДАСТ?',
      'А что стоит ЗА этим? К чему это тебя приведёт?',
      'И какую ПОТРЕБНОСТЬ ты тогда реализуешь?',
      'Есть ли что-то ещё ГЛУБЖЕ за этой потребностью?',
      'Когда ты это получишь — кем ты себя будешь ОЩУЩАТЬ?',
      'Как бы ты описал это ЭТАЛОННОЕ СОСТОЯНИЕ? "Я хочу ощущать себя..."'
    ],
    minResponses: 3,
    transitionCriteria: ['Найдена глубинная потребность', 'Клиент назвал ЭТАЛОННОЕ СОСТОЯНИЕ ("хочу ощущать себя...")']
  },
  bodywork: {
    name: 'bodywork',
    russianName: 'Телесная работа',
    goal: 'ГЛУБОКОЕ исследование телесного ощущения: локализация + ВСЕ характеристики (размер, форма, плотность, температура, движение)',
    questions: [
      'Где в ТЕЛЕ ты ощущаешь эту потребность? Есть ли какое-то ощущение, связанное с ней?',
      'Опиши это ощущение — где ИМЕННО оно находится? В какой части тела?',
      'Какого РАЗМЕРА это ощущение? Большое, маленькое, среднее?',
      'Какой ФОРМЫ оно? На что похоже по форме?',
      'Какой ПЛОТНОСТИ? Плотное, лёгкое, рыхлое, текучее, газообразное?',
      'Какая у него ТЕМПЕРАТУРА? Тёплое, холодное, горячее, нейтральное?',
      'Есть ли у него ДВИЖЕНИЕ? Если да — куда оно направлено? Пульсирует, расширяется, сжимается?',
      'Есть ли импульс ПОДВИГАТЬСЯ? Какое движение хотелось бы сделать телу?'
    ],
    minResponses: 4,
    transitionCriteria: ['Описана ЛОКАЛИЗАЦИЯ ощущения', 'Описан РАЗМЕР', 'Описана ФОРМА', 'Описана ПЛОТНОСТЬ', 'Описана ТЕМПЕРАТУРА', 'Исследовано ДВИЖЕНИЕ']
  },
  metaphor: {
    name: 'metaphor',
    russianName: 'Создание образа',
    goal: 'Создать образ или метафору из телесного ощущения, описать его качества и стать им',
    questions: [
      'Если бы это ощущение могло стать ОБРАЗОМ — на что бы оно было похоже?',
      'Опиши этот образ подробнее — как он ВЫГЛЯДИТ?',
      'Какой ХАРАКТЕР у этого образа? Какие у него качества?',
      'Сколько в нём ЭНЕРГИИ? Как бы ты это оценил?',
      'Если бы ты мог СТАТЬ этим образом полностью — как бы ты себя ощущал?',
      'Стань сейчас этим образом. Что МЕНЯЕТСЯ в ощущениях?',
      'Какое ДВИЖЕНИЕ хочет родиться, когда ты — этот образ?'
    ],
    minResponses: 3,
    transitionCriteria: ['Создан образ или метафора', 'Образ описан с характеристиками', 'Клиент СТАЛ образом', 'Исследовано движение образа']
  },
  meta_position: {
    name: 'meta_position',
    russianName: 'Метапозиция',
    goal: 'ПОЛНАЯ метапозиция: глазами образа смотрим на клиента, его жизнь, стратегию, даём послание',
    questions: [
      'Теперь, будучи этим образом, посмотри на (имя клиента). Каким ты его ВИДИШЬ?',
      'Глазами этого образа посмотри на ЕГО ЖИЗНЬ. Что ты замечаешь?',
      'Как с этой позиции выглядит ЕГО СИТУАЦИЯ, с которой он пришёл?',
      'Как выглядит ЕГО ПРИВЫЧНАЯ СТРАТЕГИЯ с твоей позиции? Что ты видишь в ней?',
      'Есть ли что-то, чего он НЕ ВИДИТ или не понимает, но что очевидно для тебя?',
      'Что ты хочешь ЕМУ ПЕРЕДАТЬ? Какое послание?',
      'Чему ты УЧИШЬ его сейчас?',
      'Что ты знаешь о нём, чего ОН сам НЕ ЗАМЕЧАЕТ?'
    ],
    minResponses: 3,
    transitionCriteria: ['Клиент посмотрел глазами образа на СЕБЯ', 'Посмотрел на свою ЖИЗНЬ', 'Посмотрел на свою СТРАТЕГИЮ', 'Получено ПОСЛАНИЕ от образа', 'Получен ИНСАЙТ или новое видение']
  },
  integration: {
    name: 'integration',
    russianName: 'Интеграция через тело',
    goal: 'Интегрировать энергию образа с клиентом ЧЕРЕЗ ТЕЛО И ДВИЖЕНИЕ',
    questions: [
      'Если бы этот образ мог проявляться ЧЕРЕЗ ТЕБЯ — как бы это ощущалось?',
      'Что бы изменилось, если бы ты перестал РАЗДЕЛЯТЬ себя и эту силу?',
      'Как бы переживалась ЦЕЛОСТНОСТЬ? Как бы ты себя тогда чувствовал?',
      'Если бы эта энергия проявлялась через ТЕЛО — как бы оно ДВИГАЛОСЬ?',
      'Какое ФИЗИЧЕСКОЕ ДВИЖЕНИЕ могло бы родиться из этого нового ощущения?',
      'Позволь телу подвигаться так, как ему хочется. Что ПРОИСХОДИТ?',
      'Что изменилось в ощущении ГРУДИ? ТЕЛА?',
      'ДОСТАТОЧНО ли этого движения, или хочется ЕЩЁ?'
    ],
    minResponses: 3,
    transitionCriteria: ['Произошла интеграция', 'Клиент описывает НОВОЕ состояние', 'Выполнено ФИЗИЧЕСКОЕ движение', 'Проверена ЗАВЕРШЁННОСТЬ движения']
  },
  plan_actions: {
    name: 'plan_actions',
    russianName: 'Авторские действия (SMART)',
    goal: 'Определить новые способы действий и КОНКРЕТНЫЙ первый шаг в SMART-формате',
    questions: [
      'Теперь, из этого нового состояния, посмотри на свою ситуацию. Как ты можешь действовать ПО-НОВОМУ?',
      'Какой НОВЫЙ способ поведения ты видишь?',
      'Какой ОДИН КОНКРЕТНЫЙ шаг ты готов сделать в ближайшие 24 часа?',
      'ЧТО ИМЕННО это будет? Опиши конкретное действие.',
      'КОГДА ты это сделаешь? В какое время?',
      'КАК ты узнаешь, что сделал этот шаг? Что будет результатом?'
    ],
    minResponses: 2,
    transitionCriteria: ['Есть НОВАЯ стратегия', 'Определён КОНКРЕТНЫЙ первый шаг', 'Шаг сформулирован в SMART-формате (что, когда, как узнаю)']
  },
  finish: {
    name: 'finish',
    russianName: 'Завершение и практики внедрения',
    goal: 'Подвести итоги, закрепить результат и ОБЯЗАТЕЛЬНО дать практику внедрения',
    questions: [
      'Давай подведём итог нашей работы. Что было для тебя САМЫМ ВАЖНЫМ сегодня?',
      'Какой ГЛАВНЫЙ ИНСАЙТ ты уносишь с собой?',
      'Хочешь выбрать ПРАКТИКУ ВНЕДРЕНИЯ для закрепления результата? Могу предложить: 1) Быстрый переключатель — представлять себя образом в течение дня, 2) Утренняя практика — спрашивать "Как бы образ прожил этот день?", 3) Переключатель в моменте — при привычной реакции спрашивать "Как бы действовал образ?", 4) Проверка действием — сделать шаг и наблюдать за ощущениями.',
      'Есть ли что-то, что ты хотел бы ещё сказать или спросить?'
    ],
    minResponses: 1,
    transitionCriteria: ['Подведены ИТОГИ сессии', 'Выбрана ПРАКТИКА ВНЕДРЕНИЯ', 'Сессия завершена']
  }
};

export interface RequestClarification {
  isPositive: boolean | null;
  hasAuthorship: boolean | null;
  isConcrete: boolean | null;
  isRealistic: boolean | null;
  motivationChecked: boolean | null;
  clarifiedRequest: string | null;
}

export interface BodyworkData {
  location: string | null;
  size: string | null;
  shape: string | null;
  density: string | null;
  temperature: string | null;
  movement: string | null;
  impulse: string | null;
}

export interface MetaphorData {
  image: string | null;
  qualities: string | null;
  energyLevel: number | null;
}

export interface MetaPositionData {
  viewOfSelf: string | null;
  viewOfLife: string | null;
  viewOfStrategy: string | null;
  insight: string | null;
  messageFromImage: string | null;
}

export interface IntegrationData {
  newFeeling: string | null;
  movementDone: boolean;
  integratedState: string | null;
}

export interface ResistanceExplorationData {
  detected: boolean;
  type: string | null;
  phrase: string | null;
  explorationStep: number;
  stoppedAndExplored: boolean;
  becameResistingPart: boolean;
  foundProtectedNeed: boolean;
  exploredWhatHappensWithout: boolean;
  foundAlternativeWay: boolean;
  fullyExplored: boolean;
}

export interface AbstractAnswerData {
  detected: boolean;
  abstractWords: string[];
  currentDepthLevel: number;
  maxDepthReached: boolean;
  fromWord: string | null;
  toWord: string | null;
  deepeningHistory: string[];
}

export interface BodyworkSequenceData {
  locationAsked: boolean;
  sizeAsked: boolean;
  shapeAsked: boolean;
  densityAsked: boolean;
  temperatureAsked: boolean;
  movementAsked: boolean;
  impulseAsked: boolean;
  movementDone: boolean;
  movementCompletionChecked: boolean;
  readyForMetaphor: boolean;
}

export interface TherapyContext {
  clientName: string | null;
  currentGoal: string | null;
  originalRequest: string | null;
  clarifiedRequest: string | null;
  currentStrategy: string | null;
  strategyIntention: string | null;
  deepNeed: string | null;
  bodyLocation: string | null;
  metaphor: string | null;
  energyLevel: number | null;
  newActions: string[];
  firstStep: string | null;
  homework: string | null;
  stageData: Record<string, string>;
  requestClarification: RequestClarification;
  bodyworkData: BodyworkData;
  metaphorData: MetaphorData;
  metaPositionData: MetaPositionData;
  integrationData: IntegrationData;
  resistanceData: ResistanceExplorationData;
  abstractAnswerData: AbstractAnswerData;
  bodyworkSequence: BodyworkSequenceData;
}

export interface SessionState {
  currentStage: MPTStage;
  stageResponseCount: number;
  currentQuestionIndex: number;
  stageHistory: MPTStage[];
  context: TherapyContext;
  requestType: RequestType | null;
  importanceRating: number | null;
  lastClientResponse: string;
  clientSaysIDontKnow: boolean;
  movementOffered: boolean;
  integrationComplete: boolean;
  sessionStarted: boolean;
  sessionComplete: boolean;
}

export type RequestType = 
  | 'fear_anxiety'
  | 'procrastination'
  | 'relationships'
  | 'self_worth'
  | 'burnout'
  | 'lost_desires'
  | 'role_conflict'
  | 'resistance'
  | 'trauma'
  | 'identity'
  | 'psychosomatic'
  | 'general';

export const REQUEST_TYPE_KEYWORDS: Record<RequestType, string[]> = {
  fear_anxiety: [
    'страх', 'боюсь', 'тревога', 'паника', 'волнуюсь', 'страшно', 
    'фобия', 'беспокойство', 'навязчивые мысли', 'тревожусь', 'переживаю',
    'ужас', 'опасаюсь', 'боязнь'
  ],
  procrastination: [
    'прокрастинация', 'откладываю', 'не могу начать', 'тяну время',
    'не могу заставить себя', 'всё время откладываю', 'никак не начну',
    'затягиваю', 'медлю'
  ],
  relationships: [
    'отношения', 'партнер', 'муж', 'жена', 'девушка', 'парень', 'брак', 
    'любовь', 'расставание', 'развод', 'ссоры', 'конфликты в паре',
    'не понимаем друг друга', 'разрыв', 'измена', 'ревность'
  ],
  self_worth: [
    'самооценка', 'не уверен в себе', 'неуверенность', 'не достоин',
    'не заслуживаю', 'чувствую себя никчемным', 'самоценность',
    'не ценю себя', 'низкая самооценка', 'комплексы'
  ],
  burnout: [
    'выгорание', 'устал', 'нет сил', 'апатия', 'энергии нет',
    'истощение', 'опустошен', 'выжат', 'burnout', 'перегорел',
    'нет мотивации', 'всё надоело'
  ],
  lost_desires: [
    'не знаю чего хочу', 'потерял желания', 'ничего не хочу',
    'нет целей', 'нет смысла', 'не понимаю что хочу',
    'потерял интерес', 'всё равно'
  ],
  role_conflict: [
    'конфликт ролей', 'не могу выбрать', 'разрываюсь', 'противоречие',
    'две части', 'хочу и не хочу', 'должен но не хочу',
    'внутренний конфликт'
  ],
  resistance: [
    'сопротивление', 'не хочется', 'заставляю себя', 'нет мотивации',
    'саботирую', 'мешаю себе', 'не могу себя заставить'
  ],
  trauma: [
    'травма', 'детство', 'родители', 'обида', 'прошлое', 'воспоминания',
    'больно', 'не отпускает', 'токсичные', 'насилие', 'жестокость'
  ],
  identity: [
    'кто я', 'не знаю себя', 'потерял себя', 'смысл жизни', 'предназначение',
    'идентичность', 'самоопределение', 'кризис', 'не понимаю себя'
  ],
  psychosomatic: [
    'болит', 'тело', 'психосоматика', 'симптом', 'здоровье', 'напряжение',
    'зажим', 'блок', 'спина', 'голова', 'живот', 'грудь', 'горло'
  ],
  general: []
};

export const REQUEST_TYPE_SCRIPTS: Record<RequestType, string> = {
  fear_anxiety: 'Работа со страхом и тревогой через телесные ощущения и образ безопасности',
  procrastination: 'Исследование вторичной выгоды и скрытой потребности за откладыванием',
  relationships: 'Работа с проекциями и потребностями в отношениях',
  self_worth: 'Интеграция светлой тени и восстановление самоценности',
  burnout: 'Поиск глубинной потребности за истощением',
  lost_desires: 'Восстановление контакта с желаниями через тело',
  role_conflict: 'Диалог частей и поиск интегрирующего решения',
  resistance: 'Исследование конструктивной цели сопротивления',
  trauma: 'Бережная работа с травматическим опытом через ресурсный образ',
  identity: 'Исследование идентичности через метапозицию',
  psychosomatic: 'Работа с телесными блокировками и высвобождение энергии',
  general: 'Универсальный скрипт исследования стратегии'
};

export const AUTHORSHIP_TRANSFORMATIONS: Array<{pattern: RegExp, transform: string}> = [
  { pattern: /меня (раздражает|бесит|злит)/i, transform: 'я раздражаюсь на' },
  { pattern: /меня обид(ели|ел|ела)/i, transform: 'я обиделся, когда' },
  { pattern: /он\/она меня (заставляет|вынуждает)/i, transform: 'я чувствую давление, когда' },
  { pattern: /мне не дают/i, transform: 'я не беру' },
  { pattern: /меня не понимают/i, transform: 'я чувствую себя непонятым, когда' },
  { pattern: /меня не слышат/i, transform: 'я чувствую, что меня не слышат, когда' },
  { pattern: /меня не ценят/i, transform: 'я чувствую себя недооценённым, когда' },
  { pattern: /меня игнорируют/i, transform: 'я чувствую себя игнорируемым, когда' },
  { pattern: /меня критикуют/i, transform: 'я воспринимаю как критику, когда' },
  { pattern: /на меня давят/i, transform: 'я чувствую давление, когда' },
  { pattern: /мне мешают/i, transform: 'я встречаю препятствие, когда' },
  { pattern: /он\/она виноват/i, transform: 'я чувствую обиду из-за' },
  { pattern: /из-за него\/неё/i, transform: 'в ситуации с ним/ней я' },
  { pattern: /они заставили меня/i, transform: 'я сделал выбор под влиянием' },
  { pattern: /у меня нет выбора/i, transform: 'мне сложно увидеть альтернативы, когда' },
  { pattern: /я не могу/i, transform: 'мне сложно' },
  { pattern: /это невозможно/i, transform: 'мне пока неясно, как' },
  { pattern: /живу не своей жизнью/i, transform: 'я ДЕЛАЮ так, что живу не своей жизнью' },
  { pattern: /сижу в клетке/i, transform: 'я САЖАЮ себя в клетку' },
  { pattern: /он посадил себя/i, transform: 'я САЖАЮ себя' },
  { pattern: /меня заставили/i, transform: 'я ПОЗВОЛИЛ' },
  { pattern: /меня вынудили/i, transform: 'я ВЫБРАЛ под давлением' },
  { pattern: /он меня бесит/i, transform: 'я ЗЛЮСЬ, когда он' },
  { pattern: /она меня бесит/i, transform: 'я ЗЛЮСЬ, когда она' },
  { pattern: /меня контролируют/i, transform: 'я ПОЗВОЛЯЮ себя контролировать' },
  { pattern: /меня используют/i, transform: 'я ПОЗВОЛЯЮ себя использовать' },
  { pattern: /меня не уважают/i, transform: 'я чувствую неуважение, когда' },
  { pattern: /мне не везёт/i, transform: 'я замечаю неудачи, когда' },
  { pattern: /всё против меня/i, transform: 'я встречаю сопротивление, когда' },
  { pattern: /у меня забрали/i, transform: 'я ОТДАЛ' },
  { pattern: /меня бросили/i, transform: 'я остался один, когда' },
  { pattern: /меня предали/i, transform: 'я чувствую предательство, когда' },
  { pattern: /он\/она виноват(а)?/i, transform: 'я чувствую обиду из-за' },
  { pattern: /это его\/её вина/i, transform: 'в этой ситуации я' },
  { pattern: /мне плохо из-за/i, transform: 'я чувствую себя плохо, когда' },
  { pattern: /он\/она сделал(а)? мне/i, transform: 'в ситуации с ним/ней я чувствую' },
  { pattern: /я жертва/i, transform: 'я нахожусь в сложной ситуации, где' },
  { pattern: /со мной так поступили/i, transform: 'в этой ситуации я' },
  { pattern: /мне навязали/i, transform: 'я ПРИНЯЛ' },
  { pattern: /от меня требуют/i, transform: 'я чувствую требование, когда' },
  { pattern: /меня заставляют/i, transform: 'я чувствую давление' }
];

export function detectRequestType(message: string): RequestType {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(REQUEST_TYPE_KEYWORDS)) {
    if (type === 'general') continue;
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return type as RequestType;
      }
    }
  }
  
  return 'general';
}

export function transformToAuthorship(message: string): string | null {
  for (const {pattern, transform} of AUTHORSHIP_TRANSFORMATIONS) {
    if (pattern.test(message)) {
      return `Я слышу "${message}". В языке авторства это звучало бы как: "${transform}..."`;
    }
  }
  return null;
}

export function detectClientSaysIDontKnow(message: string): boolean {
  const patterns = [
    'не знаю',
    'не понимаю',
    'не чувствую',
    'не могу ответить',
    'затрудняюсь',
    'не уверен',
    'не ощущаю',
    'не вижу',
    'непонятно',
    'сложно сказать',
    'не могу сформулировать'
  ];
  
  const lowerMessage = message.toLowerCase();
  return patterns.some(pattern => lowerMessage.includes(pattern));
}

export function detectResistance(message: string): { detected: boolean; type: string | null; phrase: string | null } {
  const resistancePatterns = [
    { pattern: /саботирую/i, type: 'sabotage' },
    { pattern: /борюсь с собой/i, type: 'internal_fight' },
    { pattern: /заставляю себя/i, type: 'force_self' },
    { pattern: /избегаю/i, type: 'avoidance' },
    { pattern: /не могу себя заставить/i, type: 'cant_force' },
    { pattern: /сопротивляюсь/i, type: 'resistance' },
    { pattern: /мешаю себе/i, type: 'self_sabotage' },
    { pattern: /откладываю/i, type: 'procrastination' },
    { pattern: /убегаю/i, type: 'escape' },
    { pattern: /закрываюсь/i, type: 'closing' },
    { pattern: /прячусь/i, type: 'hiding' },
    { pattern: /не хочу но/i, type: 'reluctance' },
    { pattern: /должен но не/i, type: 'obligation' },
    { pattern: /хочу но не могу/i, type: 'blocked' },
    { pattern: /тяну время/i, type: 'delaying' },
    { pattern: /затягиваю/i, type: 'delaying' },
    { pattern: /медлю/i, type: 'hesitation' },
    { pattern: /не даю себе/i, type: 'self_denial' },
    { pattern: /блокирую себя/i, type: 'self_blocking' },
    { pattern: /останавливаю себя/i, type: 'self_stopping' }
  ];
  
  const lowerMessage = message.toLowerCase();
  
  for (const { pattern, type } of resistancePatterns) {
    const match = message.match(pattern);
    if (match) {
      return { detected: true, type, phrase: match[0] };
    }
  }
  
  return { detected: false, type: null, phrase: null };
}

export function detectAbstractAnswer(message: string): { detected: boolean; abstractWords: string[] } {
  const abstractPatterns = [
    'свобода', 'свободу', 'свободой', 'свободы', 'свободен', 'свободна',
    'радость', 'радости', 'радостью',
    'счастье', 'счастья', 'счастьем', 'счастлив', 'счастлива',
    'хорошо', 'нормально', 'прекрасно', 'отлично', 'замечательно',
    'любовь', 'любви', 'любовью',
    'покой', 'покоя', 'покоем', 'спокойствие', 'спокойствия',
    'гармония', 'гармонии', 'гармонией',
    'баланс', 'баланса', 'балансом',
    'уверенность', 'уверенности', 'уверенностью',
    'сила', 'силы', 'силой',
    'мир', 'мира', 'миром',
    'безопасность', 'безопасности',
    'близость', 'близости',
    'принятие', 'принятия',
    'признание', 'признания',
    'поддержка', 'поддержки',
    'понимание', 'понимания',
    'ценность', 'ценности'
  ];
  
  const concreteIndicators = [
    /когда .{10,}/i,
    /в ситуации/i,
    /например/i,
    /в моменте когда/i,
    /чувствую .{15,}/i,
    /вижу как/i,
    /слышу как/i,
    /ощущаю .{15,}/i
  ];
  
  const lowerMessage = message.toLowerCase();
  const foundAbstract: string[] = [];
  let abstractOccurrences = 0;
  
  const words = lowerMessage.split(/[\s,.!?;:]+/).filter(w => w.length > 0);
  
  for (const word of words) {
    if (abstractPatterns.includes(word)) {
      abstractOccurrences++;
      if (!foundAbstract.includes(word)) {
        foundAbstract.push(word);
      }
    }
  }
  
  if (foundAbstract.length === 0) {
    return { detected: false, abstractWords: [] };
  }
  
  let hasConcreteDetails = false;
  for (const indicator of concreteIndicators) {
    if (indicator.test(message)) {
      hasConcreteDetails = true;
      break;
    }
  }
  
  const wordCount = words.length;
  const abstractRatio = abstractOccurrences / Math.max(wordCount, 1);
  const needsDeepening = foundAbstract.length > 0 && (!hasConcreteDetails || abstractRatio > 0.15 || wordCount <= 10);
  
  return { detected: needsDeepening, abstractWords: foundAbstract };
}

export function detectMovementImpulse(message: string): boolean {
  const movementPatterns = [
    /хочется (двигаться|подвигаться|пошевелиться)/i,
    /хочется (взорваться|расшириться|сжаться|раскрыться)/i,
    /импульс/i,
    /хочется (встать|прыгнуть|побежать|танцевать)/i,
    /тело (хочет|требует|просит)/i,
    /хочется (распрямиться|вытянуться|сжаться)/i,
    /хочется (кричать|орать|выть)/i,
    /энергия (хочет|рвётся|просится)/i
  ];
  
  for (const pattern of movementPatterns) {
    if (pattern.test(message)) {
      return true;
    }
  }
  return false;
}

export function getResistanceExplorationPrompt(resistanceType: string): string {
  const prompts: Record<string, string> = {
    'sabotage': 'СТОП. Это важно. Давай исследуем этот саботаж прямо сейчас. Если бы ты СТАЛ этой частью, которая саботирует — как бы ты себя чувствовал? Что бы она делала и ЗАЧЕМ?',
    'internal_fight': 'СТОП. Ты говоришь о борьбе с собой — это ключевой момент. Если бы ты СТАЛ этой частью, которая борется — какую важную задачу она решает для тебя?',
    'force_self': 'СТОП. Заставлять себя — это сигнал сопротивления. Если бы ты СТАЛ той частью, которая сопротивляется принуждению — что бы она сказала? Что она защищает?',
    'avoidance': 'СТОП. Избегание — это важный сигнал. Если бы ты СТАЛ той частью, которая избегает — какую потребность она защищает? Что случится, если перестать избегать?',
    'cant_force': 'СТОП. "Не могу себя заставить" — это ценная информация. Что защищает эта часть, которая не даёт тебе делать то, что "надо"?',
    'self_sabotage': 'СТОП. Когда ты мешаешь себе — это часть тебя заботится о чём-то важном. Если бы ты СТАЛ этой частью — какую задачу она решает?',
    'default': 'СТОП. Это важно. Давай исследуем это сопротивление прямо сейчас. Если бы ты СТАЛ этой сопротивляющейся частью — как бы ты себя чувствовал? Что она защищает?'
  };
  
  return prompts[resistanceType] || prompts['default'];
}

export const RESISTANCE_EXPLORATION_PROTOCOL = {
  step1_stop: {
    name: 'СТОП и признание',
    prompt: 'СТОП. Это важно. Давай исследуем это сопротивление прямо сейчас — сопротивление это ЗОЛОТО!',
    question: 'Ты говоришь о сопротивлении. Это очень ценная информация. Давай остановимся и исследуем это.'
  },
  step2_become: {
    name: 'Становление сопротивляющейся частью',
    prompt: 'Клиент должен СТАТЬ сопротивляющейся частью',
    questions: [
      'Если бы ты прямо сейчас СТАЛ этой частью, которая {resistance_type} — как бы ты себя чувствовал?',
      'Представь, что ты — это та часть, которая {resistance_type}. Что ты ощущаешь? Какие эмоции?',
      'Если бы ты мог СТАТЬ этой сопротивляющейся частью полностью — как бы это было? Что бы ты делал?'
    ]
  },
  step3_purpose: {
    name: 'Поиск задачи и намерения',
    prompt: 'Найти ЗАЧЕМ эта часть делает то, что делает',
    questions: [
      'Что бы эта часть делала и ЗАЧЕМ? Какую важную задачу она решает для тебя?',
      'Какую цель преследует эта часть? Почему ей важно так себя вести?',
      'Если бы эта часть могла говорить — что бы она сказала о том, зачем она нужна?'
    ]
  },
  step4_protection: {
    name: 'Обнаружение защищаемой потребности',
    prompt: 'Что ЗАЩИЩАЕТ эта часть',
    questions: [
      'Что она защищает? Какую важную потребность?',
      'От чего эта часть тебя оберегает? Что было бы, если бы её не было?',
      'Какую ценность или потребность эта часть охраняет?'
    ]
  },
  step5_consequences: {
    name: 'Исследование последствий',
    prompt: 'Что случится, если перестать сопротивляться',
    questions: [
      'Если бы можно было перестать {resistance_type} — что тогда произойдёт?',
      'Что случится, если эта часть перестанет делать то, что делает?',
      'Чего ты боишься или избегаешь, если эта часть перестанет работать?'
    ]
  },
  step6_alternative: {
    name: 'Поиск альтернативного способа',
    prompt: 'Найти другой способ удовлетворить потребность',
    questions: [
      'Как можно удовлетворить эту потребность ПО-ДРУГОМУ?',
      'Какой другой способ мог бы защитить то, что важно, но без сопротивления?',
      'Если бы эта потребность могла реализоваться иначе — как бы это выглядело?'
    ]
  }
};

export function getFullResistanceExplorationStep(step: number, resistanceType: string): string {
  const steps = RESISTANCE_EXPLORATION_PROTOCOL;
  const typeLabels: Record<string, string> = {
    'sabotage': 'саботирует',
    'internal_fight': 'борется',
    'force_self': 'сопротивляется принуждению',
    'avoidance': 'избегает',
    'cant_force': 'не даёт заставить себя',
    'self_sabotage': 'мешает себе',
    'procrastination': 'откладывает',
    'closing': 'закрывается',
    'hiding': 'прячется',
    'default': 'сопротивляется'
  };
  
  const typeLabel = typeLabels[resistanceType] || typeLabels['default'];
  
  switch (step) {
    case 1:
      return steps.step1_stop.question;
    case 2:
      const q2 = steps.step2_become.questions[0];
      return q2.replace('{resistance_type}', typeLabel);
    case 3:
      return steps.step3_purpose.questions[0];
    case 4:
      return steps.step4_protection.questions[0];
    case 5:
      const q5 = steps.step5_consequences.questions[0];
      return q5.replace('{resistance_type}', typeLabel);
    case 6:
      return steps.step6_alternative.questions[0];
    default:
      return 'Сопротивление исследовано. Теперь давай двинемся дальше.';
  }
}

export function updateResistanceExplorationState(state: SessionState, step: number): SessionState {
  const newResistanceData = { ...state.context.resistanceData };
  
  switch (step) {
    case 1:
      newResistanceData.stoppedAndExplored = true;
      newResistanceData.explorationStep = 1;
      break;
    case 2:
      newResistanceData.becameResistingPart = true;
      newResistanceData.explorationStep = 2;
      break;
    case 3:
    case 4:
      newResistanceData.foundProtectedNeed = true;
      newResistanceData.explorationStep = step;
      break;
    case 5:
      newResistanceData.exploredWhatHappensWithout = true;
      newResistanceData.explorationStep = 5;
      break;
    case 6:
      newResistanceData.foundAlternativeWay = true;
      newResistanceData.explorationStep = 6;
      newResistanceData.fullyExplored = true;
      break;
  }
  
  return {
    ...state,
    context: {
      ...state.context,
      resistanceData: newResistanceData
    }
  };
}

export function isResistanceFullyExplored(state: SessionState): boolean {
  const rd = state.context.resistanceData;
  return rd.stoppedAndExplored && 
         rd.becameResistingPart && 
         rd.foundProtectedNeed && 
         rd.exploredWhatHappensWithout && 
         rd.foundAlternativeWay;
}

export function getDeepeningQuestion(abstractWord: string, level: number): string {
  const deepeningQuestions: Record<number, string[]> = {
    1: [
      `"${abstractWord}" — это абстракция. ${abstractWord.includes('свобод') ? 'Свобода ОТ ЧЕГО? И свобода ДЛЯ ЧЕГО?' : `Что "${abstractWord}" значит КОНКРЕТНО для тебя?`}`,
      `А ЗАЧЕМ тебе это? Что это даст тебе глубже?`
    ],
    2: [
      'А что стоит ЗА этим? К чему это тебя приведёт?',
      'Какую ПОТРЕБНОСТЬ ты тогда реализуешь?'
    ],
    3: [
      'Это твоя САМАЯ важная потребность или есть что-то ещё ВАЖНЕЕ за ней?',
      'Что это позволяет тебе ЧУВСТВОВАТЬ или БЫТЬ?'
    ],
    4: [
      'Кем ты себя будешь ОЩУЩАТЬ, когда эта потребность реализована?',
      'Как бы ты описал это ЭТАЛОННОЕ СОСТОЯНИЕ?'
    ]
  };
  
  const questions = deepeningQuestions[level] || deepeningQuestions[4];
  return questions[Math.floor(Math.random() * questions.length)];
}

export function updateAbstractAnswerState(state: SessionState, abstractWords: string[], level: number): SessionState {
  const newAbstractData = { ...state.context.abstractAnswerData };
  newAbstractData.detected = true;
  newAbstractData.abstractWords = abstractWords;
  newAbstractData.currentDepthLevel = level;
  newAbstractData.deepeningHistory.push(`Level ${level}: ${abstractWords.join(', ')}`);
  if (level >= 4) {
    newAbstractData.maxDepthReached = true;
  }
  
  return {
    ...state,
    context: {
      ...state.context,
      abstractAnswerData: newAbstractData
    }
  };
}

export function needsMoreDeepening(state: SessionState): boolean {
  const ad = state.context.abstractAnswerData;
  return ad.detected && !ad.maxDepthReached && ad.currentDepthLevel < 4;
}

export function getBodyBeforeImagePrompt(): string {
  return 'Не переходи к образу — ПРОЖИВИ это телом сначала! Встань (если можешь) и ПОКАЖИ мне это движение. Позволь телу сделать его. Не думай, просто делай.';
}

export const BODYWORK_SEQUENCE = {
  step1_location: {
    question: 'Где в ТЕЛЕ ты ощущаешь эту потребность? Есть ли какое-то ощущение, связанное с ней?',
    key: 'locationAsked'
  },
  step2_size: {
    question: 'Какого РАЗМЕРА это ощущение? Большое, маленькое, среднее?',
    key: 'sizeAsked'
  },
  step3_shape: {
    question: 'Какой ФОРМЫ оно? На что похоже по форме?',
    key: 'shapeAsked'
  },
  step4_density: {
    question: 'Какой ПЛОТНОСТИ? Плотное, лёгкое, рыхлое, текучее, газообразное?',
    key: 'densityAsked'
  },
  step5_temperature: {
    question: 'Какая у него ТЕМПЕРАТУРА? Тёплое, холодное, горячее, нейтральное?',
    key: 'temperatureAsked'
  },
  step6_movement: {
    question: 'Есть ли у него ДВИЖЕНИЕ? Если да — куда оно направлено? Пульсирует, расширяется, сжимается?',
    key: 'movementAsked'
  },
  step7_impulse: {
    question: 'Есть ли импульс ПОДВИГАТЬСЯ? Какое движение хотелось бы сделать телу?',
    key: 'impulseAsked'
  },
  step8_do_movement: {
    question: 'Позволь телу сделать это движение. Не думай, просто делай. Что происходит?',
    key: 'movementDone'
  },
  step9_completion_check: {
    question: 'ДОСТАТОЧНО ли этого движения, или хочется ЕЩЁ?',
    key: 'movementCompletionChecked'
  }
};

export function getNextBodyworkQuestion(state: SessionState): string | null {
  const bs = state.context.bodyworkSequence;
  
  if (!bs.locationAsked) return BODYWORK_SEQUENCE.step1_location.question;
  if (!bs.sizeAsked) return BODYWORK_SEQUENCE.step2_size.question;
  if (!bs.shapeAsked) return BODYWORK_SEQUENCE.step3_shape.question;
  if (!bs.densityAsked) return BODYWORK_SEQUENCE.step4_density.question;
  if (!bs.temperatureAsked) return BODYWORK_SEQUENCE.step5_temperature.question;
  if (!bs.movementAsked) return BODYWORK_SEQUENCE.step6_movement.question;
  if (!bs.impulseAsked) return BODYWORK_SEQUENCE.step7_impulse.question;
  if (!bs.movementDone) return BODYWORK_SEQUENCE.step8_do_movement.question;
  if (!bs.movementCompletionChecked) return BODYWORK_SEQUENCE.step9_completion_check.question;
  
  return null;
}

export function updateBodyworkSequence(state: SessionState, stepKey: keyof BodyworkSequenceData): SessionState {
  const newBodyworkSequence = { ...state.context.bodyworkSequence };
  (newBodyworkSequence as Record<string, boolean>)[stepKey] = true;
  
  const isReadyForMetaphor = newBodyworkSequence.movementDone && newBodyworkSequence.movementCompletionChecked;
  newBodyworkSequence.readyForMetaphor = isReadyForMetaphor;
  
  return {
    ...state,
    context: {
      ...state.context,
      bodyworkSequence: newBodyworkSequence
    }
  };
}

export function isBodyworkComplete(state: SessionState): boolean {
  const bs = state.context.bodyworkSequence;
  return bs.locationAsked && 
         bs.sizeAsked && 
         bs.shapeAsked && 
         bs.densityAsked && 
         bs.temperatureAsked && 
         bs.movementAsked && 
         bs.impulseAsked && 
         bs.movementDone && 
         bs.movementCompletionChecked;
}

export function canTransitionToMetaphor(state: SessionState): boolean {
  const bs = state.context.bodyworkSequence;
  return bs.movementDone && bs.movementCompletionChecked;
}

export function getHelpingQuestion(stage: MPTStage, originalQuestion: string): string {
  const stageSpecificHelpers: Record<MPTStage, string[]> = {
    start_session: ['А если бы знал, с чего начать — что бы это могло быть?'],
    collect_context: ['А если бы мог описать — как бы это выглядело?'],
    clarify_request: ['А если бы понимал свой запрос — как бы он звучал?'],
    explore_strategy: ['А если бы замечал — что бы ты делал в этой ситуации?'],
    find_need: ['А если бы чувствовал — какая потребность могла бы быть за этим?'],
    bodywork: ['А если бы ощущал — где в теле это могло бы находиться? Позволь себе представить.'],
    metaphor: ['А если бы видел образ — каким бы он мог быть? Пусть придёт первое, что придёт.'],
    meta_position: ['А если бы мог посмотреть глазами образа — что бы ты увидел?'],
    integration: ['А если бы чувствовал эту целостность — как бы это переживалось?'],
    plan_actions: ['А если бы знал следующий шаг — каким бы он мог быть?'],
    finish: ['А если бы мог подвести итог — что бы ты сказал?']
  };
  
  const helpers = stageSpecificHelpers[stage] || [];
  
  if (originalQuestion.includes('чувству') || originalQuestion.includes('ощущ')) {
    return 'А если бы ты чувствовал — каким бы могло быть это ощущение? Позволь себе представить.';
  }
  if (originalQuestion.includes('понима') || originalQuestion.includes('думаешь')) {
    return 'А если бы понимал — каким бы могло быть это понимание? Что первое приходит в голову?';
  }
  if (originalQuestion.includes('вид') || originalQuestion.includes('образ') || originalQuestion.includes('метафор')) {
    return 'А если бы видел — на что бы это могло быть похоже? Какой образ мог бы возникнуть?';
  }
  if (originalQuestion.includes('тел') || originalQuestion.includes('где')) {
    return 'А если бы замечал ощущение — где в теле оно могло бы быть? Может быть в груди, животе, горле?';
  }
  
  return helpers[0] || 'А если бы знал — на что бы это знание могло быть похоже? Что первое приходит на ум?';
}

export function extractClientName(messages: Array<{role: string, content: string}>): string | null {
  const patterns = [
    /меня зовут ([а-яёА-ЯЁa-zA-Z]+)/i,
    /зови меня ([а-яёА-ЯЁa-zA-Z]+)/i,
    /можешь звать меня ([а-яёА-ЯЁa-zA-Z]+)/i,
    /моё? имя ([а-яёА-ЯЁa-zA-Z]+)/i,
    /имя[:\s]+([а-яёА-ЯЁa-zA-Z]+)/i,
    /я — ([а-яёА-ЯЁa-zA-Z]+)/i,
    /привет,?\s+я ([а-яёА-ЯЁa-zA-Z]+)/i
  ];
  
  const stopWords = [
    'я', 'мне', 'меня', 'мой', 'моя', 'моё', 'это', 'что', 'как', 'так',
    'хочу', 'могу', 'буду', 'должен', 'чувствую', 'думаю', 'понимаю',
    'знаю', 'вижу', 'слышу', 'делаю', 'говорю', 'считаю', 'помню',
    'люблю', 'ненавижу', 'боюсь', 'хотел', 'была', 'был', 'есть',
    'тоже', 'очень', 'просто', 'тут', 'там', 'здесь', 'сейчас',
    'всегда', 'никогда', 'иногда', 'часто', 'редко', 'давно',
    'рад', 'рада', 'готов', 'готова', 'согласен', 'согласна'
  ];
  
  for (const msg of messages) {
    if (msg.role === 'user') {
      for (const pattern of patterns) {
        const match = msg.content.match(pattern);
        if (match && match[1].length >= 2 && match[1].length <= 20) {
          const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
          if (!stopWords.includes(name.toLowerCase())) {
            return name;
          }
        }
      }
    }
  }
  return null;
}

export function extractImportanceRating(message: string): number | null {
  const patterns = [
    /(\d{1,2})\s*(из|\/)\s*10/i,
    /на\s*(\d{1,2})/i,
    /оцениваю[^\d]*(\d{1,2})/i,
    /^(\d{1,2})$/
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 1 && num <= 10) {
        return num;
      }
    }
  }
  return null;
}

export function shouldTransitionToNextStage(state: SessionState): boolean {
  const config = MPT_STAGE_CONFIG[state.currentStage];
  
  if (state.stageResponseCount < config.minResponses) {
    return false;
  }
  
  switch (state.currentStage) {
    case 'start_session':
      return state.context.originalRequest !== null;
    case 'collect_context':
      return state.importanceRating !== null || state.stageResponseCount >= 3;
    case 'clarify_request':
      return state.context.clarifiedRequest !== null || state.stageResponseCount >= 4;
    case 'explore_strategy':
      return state.context.currentStrategy !== null || state.stageResponseCount >= 3;
    case 'find_need':
      return state.context.deepNeed !== null || state.stageResponseCount >= 4;
    case 'bodywork':
      return state.context.bodyLocation !== null || state.stageResponseCount >= 4;
    case 'metaphor':
      return state.context.metaphor !== null || state.stageResponseCount >= 3;
    case 'meta_position':
      return state.context.metaPositionData.insight !== null || state.stageResponseCount >= 3;
    case 'integration':
      return state.integrationComplete || state.stageResponseCount >= 3;
    case 'plan_actions':
      return state.context.firstStep !== null || state.stageResponseCount >= 3;
    case 'finish':
      return state.stageResponseCount >= 2;
    default:
      return state.stageResponseCount >= config.minResponses;
  }
}

export function getNextStage(currentStage: MPTStage): MPTStage | null {
  const currentIndex = MPT_STAGE_ORDER.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= MPT_STAGE_ORDER.length - 1) {
    return null;
  }
  return MPT_STAGE_ORDER[currentIndex + 1];
}

export function transitionToNextStage(state: SessionState): SessionState {
  const nextStage = getNextStage(state.currentStage);
  if (!nextStage) {
    return {
      ...state,
      sessionComplete: true
    };
  }
  
  return {
    ...state,
    currentStage: nextStage,
    stageResponseCount: 0,
    currentQuestionIndex: 0,
    stageHistory: [...state.stageHistory, state.currentStage]
  };
}

export function createInitialSessionState(): SessionState {
  return {
    currentStage: 'start_session',
    stageResponseCount: 0,
    currentQuestionIndex: 0,
    stageHistory: [],
    context: {
      clientName: null,
      currentGoal: null,
      originalRequest: null,
      clarifiedRequest: null,
      currentStrategy: null,
      strategyIntention: null,
      deepNeed: null,
      bodyLocation: null,
      metaphor: null,
      energyLevel: null,
      newActions: [],
      firstStep: null,
      homework: null,
      stageData: {},
      requestClarification: {
        isPositive: null,
        hasAuthorship: null,
        isConcrete: null,
        isRealistic: null,
        motivationChecked: null,
        clarifiedRequest: null
      },
      bodyworkData: {
        location: null,
        size: null,
        shape: null,
        density: null,
        temperature: null,
        movement: null,
        impulse: null
      },
      metaphorData: {
        image: null,
        qualities: null,
        energyLevel: null
      },
      metaPositionData: {
        viewOfSelf: null,
        viewOfLife: null,
        viewOfStrategy: null,
        insight: null,
        messageFromImage: null
      },
      integrationData: {
        newFeeling: null,
        movementDone: false,
        integratedState: null
      },
      resistanceData: {
        detected: false,
        type: null,
        phrase: null,
        explorationStep: 0,
        stoppedAndExplored: false,
        becameResistingPart: false,
        foundProtectedNeed: false,
        exploredWhatHappensWithout: false,
        foundAlternativeWay: false,
        fullyExplored: false
      },
      abstractAnswerData: {
        detected: false,
        abstractWords: [],
        currentDepthLevel: 0,
        maxDepthReached: false,
        fromWord: null,
        toWord: null,
        deepeningHistory: []
      },
      bodyworkSequence: {
        locationAsked: false,
        sizeAsked: false,
        shapeAsked: false,
        densityAsked: false,
        temperatureAsked: false,
        movementAsked: false,
        impulseAsked: false,
        movementDone: false,
        movementCompletionChecked: false,
        readyForMetaphor: false
      }
    },
    requestType: null,
    importanceRating: null,
    lastClientResponse: '',
    clientSaysIDontKnow: false,
    movementOffered: false,
    integrationComplete: false,
    sessionStarted: false,
    sessionComplete: false
  };
}

export function generateStagePrompt(state: SessionState): string {
  const config = MPT_STAGE_CONFIG[state.currentStage];
  const requestTypeScript = state.requestType ? REQUEST_TYPE_SCRIPTS[state.requestType] : '';
  
  let prompt = `
## ТЕКУЩИЙ ЭТАП МПТ-СЕССИИ: ${config.russianName}
Цель этапа: ${config.goal}

## СТРОГИЕ ИНСТРУКЦИИ ДЛЯ ЭТОГО ЭТАПА:
`;

  switch (state.currentStage) {
    case 'start_session':
      prompt += `
- Это начало сессии. Создай терапевтическое пространство.
- Тепло поприветствуй клиента и обозначь рамку сессии.
- Спроси, что беспокоит или над чем хотел бы поработать.
- НЕ ЗАДАВАЙ СЛОЖНЫХ ВОПРОСОВ — дай клиенту просто рассказать.
`;
      break;
      
    case 'collect_context':
      prompt += `
- Собери контекст ситуации клиента.
- Узнай, как давно это беспокоит.
- Спроси о важности по шкале от 1 до 10.
- НЕ ПЕРЕХОДИ к работе с телом или образами — это слишком рано!
`;
      break;
      
    case 'clarify_request':
      prompt += `
- КРИТИЧЕСКИ ВАЖНО: Проверь запрос по 5 критериям МПТ:
  1. ПОЗИТИВНОСТЬ: Запрос должен быть "чего хочу", а не "чего не хочу"
  2. АВТОРСТВО: "Что я хочу делать/чувствовать", а не "чтобы он изменился"
  3. КОНКРЕТНОСТЬ: Чёткая формулировка, не абстрактная
  4. РЕАЛИСТИЧНОСТЬ: Достижимо в реальности
  5. МОТИВАЦИЯ: Проверка "как будешь себя чувствовать, когда получишь"
- Помоги переформулировать запрос, если он не соответствует критериям.
${state.requestType ? `- Тип запроса клиента: ${requestTypeScript}` : ''}
`;
      break;
      
    case 'explore_strategy':
      prompt += `
- Исследуй ТЕКУЩУЮ СТРАТЕГИЮ клиента — что он ДЕЛАЕТ сейчас.
- Вопросы:
  - "Что ты делаешь в этой ситуации?"
  - "К какому результату это приводит?"
  - "А какова цель этих действий?"
- ВАЖНО: Найди ПОЗИТИВНОЕ НАМЕРЕНИЕ за стратегией!
- НЕ КРИТИКУЙ стратегию — исследуй её с уважением.
`;
      break;
      
    case 'find_need':
      prompt += `
- Используй ЦИРКУЛЯРНЫЕ ВОПРОСЫ для поиска глубинной потребности:
  - "Когда ты это получишь — что это тебе даст?"
  - "А что стоит за этим?"
  - "И какую потребность ты тогда реализуешь?"
  - "Есть ли что-то глубже?"
- ДВИГАЙСЯ ОТ ЦЕЛИ К СОСТОЯНИЮ/ОЩУЩЕНИЮ.
- Потребность — это не действие, а состояние (безопасность, любовь, свобода, признание и т.д.)
`;
      break;
      
    case 'bodywork':
      prompt += `
- ТЕЛЕСНЫЙ БЛОК — ядро МПТ!
- Задавай вопросы СТРОГО ПО ПОРЯДКУ:
  1. "Где в теле ты ощущаешь эту потребность?"
  2. "Какой размер и форма у этого ощущения?"
  3. "Какая плотность? (плотное, лёгкое, рыхлое)"
  4. "Какая температура? (тёплое, холодное)"
  5. "Есть ли движение? Куда оно направлено?"
  6. "Есть ли импульс подвигаться?"
- НЕ ПРОПУСКАЙ шаги!
- Если клиент "не чувствует" — используй технику "а если бы..."
`;
      break;
      
    case 'metaphor':
      prompt += `
- Создай ОБРАЗ из телесного ощущения:
  - "Если бы это ощущение могло стать образом — на что бы оно было похоже?"
  - "Опиши этот образ подробнее"
  - "Какие качества у этого образа?"
  - "Сколько в нём энергии?"
- НЕ ПОДСКАЗЫВАЙ образы — пусть придут от клиента.
- Образ может быть любым: существо, стихия, предмет, свет...
`;
      break;
      
    case 'meta_position':
      prompt += `
- МЕТАПОЗИЦИЯ — ключевой этап МПТ!
- Переведи клиента В ГЛАЗА ОБРАЗА:
  1. "Представь, что ты — этот образ. Посмотри его глазами на себя."
  2. "Как ты видишь себя с этой позиции?"
  3. "Посмотри глазами образа на свою жизнь. Что замечаешь?"
  4. "Как выглядит твоя привычная стратегия с этой позиции?"
  5. "Что этот образ хотел бы сказать тебе?"
- ЭТО КРИТИЧЕСКИ ВАЖНО — не пропускай этот этап!
`;
      break;
      
    case 'integration':
      prompt += `
- ИНТЕГРАЦИЯ — соединение образа с клиентом:
  - "Если бы этот образ мог проявляться через тебя — как бы это ощущалось?"
  - "Что изменилось бы, если бы ты перестал разделять себя и эту силу?"
  - "Какое движение могло бы родиться из этого нового ощущения?"
- Предложи МИКРО-ДВИЖЕНИЕ (даже в текстовом формате):
  - "Позволь телу немного подвигаться"
  - "Сделай глубокий вдох, впуская эту энергию"
`;
      break;
      
    case 'plan_actions':
      prompt += `
- АВТОРСКИЕ ДЕЙСТВИЯ — переход от состояния к действиям:
  - "Из этого нового состояния — как ты можешь действовать по-новому?"
  - "Какой ОДИН конкретный шаг ты готов сделать в ближайшие 24 часа?"
  - "Что именно это будет? Когда ты это сделаешь?"
- Шаг должен быть КОНКРЕТНЫМ и МАЛЕНЬКИМ.
- Помоги сформулировать шаг так, чтобы было ясно: что, когда, как.
`;
      break;
      
    case 'finish':
      prompt += `
- ЗАВЕРШЕНИЕ И ЗАКРЕПЛЕНИЕ:
  - Подведи краткий итог работы
  - Напомни ключевой инсайт или метафору
  - Предложи практику закрепления (утреннее соединение с образом, телесная проверка и т.д.)
  - Тепло попрощайся
- Можно спросить: "Что было для тебя самым важным сегодня?"
`;
      break;
  }
  
  if (state.clientSaysIDontKnow) {
    const helper = getHelpingQuestion(state.currentStage, '');
    prompt += `\n## КЛИЕНТ ГОВОРИТ "НЕ ЗНАЮ"!\nИспользуй технику "если бы": "${helper}"`;
  }
  
  if (state.context.clientName) {
    prompt += `\n## Имя клиента: ${state.context.clientName}. Используй его в ответах.`;
  }
  
  return prompt;
}

export const IMPLEMENTATION_PRACTICES = [
  {
    id: 'morning-connection',
    name: 'Утреннее соединение с образом',
    description: 'Каждое утро 5 минут вспоминай найденный образ и соединяйся с ним. Позволь ему наполнить тебя энергией на весь день.'
  },
  {
    id: 'anchor-word',
    name: 'Слово-якорь',
    description: 'Выбери одно слово, которое описывает твоё ресурсное состояние. Произноси его про себя каждый раз, когда чувствуешь необходимость в поддержке.'
  },
  {
    id: 'body-check',
    name: 'Телесная проверка',
    description: 'Три раза в день останавливайся и замечай, что происходит в теле. Если есть напряжение — позволь телу немного подвигаться.'
  },
  {
    id: 'evening-review',
    name: 'Вечерний пересмотр',
    description: 'Перед сном вспомни моменты дня, когда ты действовал из нового состояния. Отметь даже маленькие изменения.'
  },
  {
    id: 'new-action',
    name: 'Одно новое действие в день',
    description: 'Каждый день делай хотя бы одно маленькое действие из нового состояния. Фиксируй результаты.'
  },
  {
    id: 'metaphor-journal',
    name: 'Дневник метафоры',
    description: 'Записывай, как твой образ-ресурс проявляется в разных ситуациях. Замечай, когда он рядом.'
  },
  {
    id: 'breath-anchor',
    name: 'Дыхательный якорь',
    description: 'Когда нужна поддержка — сделай три глубоких вдоха, представляя, что вдыхаешь энергию найденного состояния.'
  },
  {
    id: 'trigger-practice',
    name: 'Работа с триггерами',
    description: 'Замечай ситуации, которые вызывают старые реакции. В этот момент вспоминай новое состояние и выбирай новый способ реагирования.'
  }
];

export function selectHomework(context: TherapyContext): typeof IMPLEMENTATION_PRACTICES[0] {
  if (context.metaphor || context.metaphorData.image) {
    return IMPLEMENTATION_PRACTICES.find(p => p.id === 'morning-connection')!;
  }
  if (context.bodyLocation || context.bodyworkData.location) {
    return IMPLEMENTATION_PRACTICES.find(p => p.id === 'body-check')!;
  }
  if (context.newActions.length > 0 || context.firstStep) {
    return IMPLEMENTATION_PRACTICES.find(p => p.id === 'new-action')!;
  }
  return IMPLEMENTATION_PRACTICES.find(p => p.id === 'breath-anchor')!;
}
