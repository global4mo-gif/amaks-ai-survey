const departments = [
  "Руководство / собственники",
  "Маркетинг",
  "Продажи и работа с клиентами",
  "Тендерный отдел / пресейл",
  "Инженерно-технический блок / проектирование",
  "Производство",
  "Снабжение и закупки",
  "Логистика",
  "Сервис и техподдержка",
  "Финансы и аналитика",
  "HR",
  "IT",
  "Документооборот / юридический блок",
  "Другое"
];

const groups = {
  intro: [
    {
      name: "role",
      type: "radio",
      title: "Ваша роль",
      options: [
        "Топ-менеджмент / собственник",
        "Руководитель направления / отдела",
        "Ведущий специалист / инженер",
        "Линейный сотрудник"
      ]
    },
    {
      name: "aiExperience",
      type: "radio",
      title: "Ваш опыт с ИИ",
      options: [
        "Никогда не пользовался",
        "Пробовал пару раз",
        "Использую время от времени",
        "Использую регулярно в работе"
      ]
    },
    {
      name: "aiServices",
      type: "checkbox",
      title: "Какими ИИ-сервисами вы уже пользовались?",
      otherName: "aiServicesOther",
      options: [
        "ChatGPT",
        "Claude",
        "YandexGPT / Алиса",
        "GigaChat (Сбер)",
        "DeepSeek",
        "Midjourney / Kandinsky / другие генераторы изображений",
        "Notion AI",
        "Gamma / Decktopus",
        "Расширения для почты с ИИ",
        "Не пользовался ничем",
        "Другое"
      ]
    }
  ],
  expectations: [
    {
      name: "seminarExpectations",
      type: "checkbox",
      title: "Чего вы ждёте от двух дней обучения?",
      options: [
        "Понять, что вообще умеет ИИ и где его границы",
        "Научиться работать с конкретными инструментами на практике",
        "Получить идеи для своих рабочих задач",
        "Понять, как ИИ изменит мою профессию в ближайшие 1-2 года",
        "Получить чек-листы и инструкции, которые применю сразу",
        "Понять экономику внедрения ИИ-сотрудников",
        "Просто посмотреть на интересные примеры"
      ]
    },
    {
      name: "mainImportance",
      type: "radio",
      title: "Что для вас сейчас важнее всего?",
      options: [
        "Экономия времени на рутине",
        "Рост качества работы",
        "Новые идеи и инсайты",
        "Конкретные деньги - рост выручки или снижение затрат",
        "Конкурентное преимущество на рынке труда",
        "Понимание стратегии внедрения ИИ в компанию"
      ]
    },
    {
      name: "aiConcerns",
      type: "checkbox",
      title: "Есть ли у вас опасения по поводу внедрения ИИ в компании?",
      otherName: "aiConcernsOther",
      options: [
        "Опасаюсь, что ИИ заменит людей",
        "Опасаюсь, что вырастет контроль и нагрузка",
        "Опасаюсь сложности освоения",
        "Опасаюсь утечки данных и безопасности",
        "Опасаюсь ошибок ИИ в инженерных расчётах и документации",
        "Никаких опасений",
        "Другое"
      ]
    }
  ],
  technical: [
    {
      name: "hasLaptop",
      type: "radio",
      title: "Будет ли у вас на семинаре ноутбук для практики?",
      options: ["Да", "Нет", "Не уверен"]
    },
    {
      name: "wantsPractice",
      type: "radio",
      title: "Хотите ли вы практический блок с работой в реальном времени?",
      options: [
        "Да, хочу делать сам под руководством",
        "Достаточно смотреть демонстрации",
        "Хочу разбор моего конкретного кейса"
      ]
    }
  ]
};

const priorityDirections = [
  "Работа с почтой через ИИ - саммари длинных тредов, черновики ответов, сортировка входящих",
  "Транскрибация встреч и переговоров - запись -> структурированный протокол с задачами и решениями",
  "Создание презентаций - из тезисов или ТЗ собрать готовый дек за 15 минут",
  "Корпоративная база знаний - AI-помощник по регламентам, нормативам, проектной документации",
  "ИИ-сотрудник на базе Hermes - цифровой помощник с кастомными скиллами под задачи AMAKS",
  "Разработка веб-инструментов - сайты, лендинги, калькуляторы и формы без программистов",
  "Тендеры и пресейл - мониторинг площадок, анализ ТЗ, подготовка КП",
  "Инженерные и проектные задачи - техдокументация, ГОСТы, расчёты",
  "Производство и предиктивная аналитика - загрузка, ремонт, контроль качества",
  "Маркетинг и контент - кейсы, статьи, рекламные материалы для B2B",
  "HR и подбор - резюме, адаптация инженеров, обучение",
  "Финансы и аналитика - Excel-выгрузки, отчёты, поиск аномалий",
  "Документооборот - договоры, КП, ТЗ, акты, проверка рисков",
  "Агентные системы - связки из нескольких ИИ, автоматизация цепочек задач"
];

const caseGroups = [
  {
    name: "emailCases",
    title: "Почта",
    options: [
      "Саммари длинного треда за 30 секунд",
      "Три варианта ответа в разных тонах",
      "Автоматическая сортировка входящих по приоритетам",
      "Извлечение задач и обязательств из почты",
      "Подготовка к встрече по архиву переписки с клиентом",
      "Шаблоны под повторяющиеся ситуации"
    ]
  },
  {
    name: "meetingCases",
    title: "Встречи и переговоры",
    options: [
      "Запись встречи -> структурированный протокол",
      "Извлечение задач с владельцами и дедлайнами",
      "Протокол в фирменном шаблоне AMAKS",
      "Поиск по архиву встреч",
      "Follow-up письмо участникам сразу после встречи",
      "Анализ переговоров: договорённости, риски, открытые вопросы"
    ]
  },
  {
    name: "presentationCases",
    title: "Презентации",
    options: [
      "ТЗ или тезисы -> структура презентации на 12 слайдов",
      "Технический отчёт -> готовый дек для клиента",
      "Запись переговоров -> презентация для следующего этапа сделки",
      "Адаптация одной презентации под разные аудитории",
      "Генерация визуала и схем под фирменный стиль",
      "Спикерские заметки для защиты проекта"
    ]
  },
  {
    name: "knowledgeCases",
    title: "База знаний компании",
    options: [
      "Сборка AI-помощника по регламентам и ГОСТам за 15 минут",
      "Поиск по архиву проектной документации",
      "AI-наставник для новых инженеров",
      "Сравнение трёх уровней решений",
      "Безопасность данных: что можно загружать в ИИ, что нельзя"
    ]
  },
  {
    name: "hermesCases",
    title: "ИИ-сотрудник Hermes",
    options: [
      "Что такое ИИ-сотрудник и чем отличается от ChatGPT",
      "Сборка ИИ-сотрудника под конкретную роль за один час",
      "Разработка кастомных скиллов под задачи AMAKS",
      "Подключение ИИ-сотрудника к корпоративным данным",
      "Передача задач между несколькими ИИ-сотрудниками",
      "Контроль и обучение ИИ-сотрудника на ошибках",
      "Безопасность и разграничение доступа",
      "Экономика: ИИ-сотрудник vs обычный сотрудник"
    ]
  },
  {
    name: "webCases",
    title: "Веб-инструменты",
    options: [
      "Лендинг под конкретный объект или проект за час",
      "Калькулятор стоимости услуг / оборудования",
      "Форма заявки с автоматической обработкой",
      "Прототип нового сервиса для проверки гипотезы",
      "Чат-бот для сайта с типовыми инженерными вопросами",
      "Обновление контента сайта через ИИ"
    ]
  },
  {
    name: "tenderCases",
    title: "Тендеры и пресейл",
    options: [
      "Автоматический мониторинг тендерных площадок",
      "Анализ ТЗ заказчика: важное, риски, упущения",
      "Сравнение нашего предложения с конкурентами",
      "Подготовка коммерческого предложения за 30 минут",
      "Анализ маржинальности проекта до подачи заявки",
      "Бриф по клиенту перед звонком",
      "Прогноз вероятности победы в тендере"
    ]
  },
  {
    name: "engineeringCases",
    title: "Инженерные и проектные задачи",
    options: [
      "Работа с ГОСТами и нормативами",
      "Анализ технической документации заказчика",
      "Проверка проектных решений на соответствие нормативам",
      "Извлечение ключевой информации из больших технических документов",
      "Перевод иностранной техдокументации с точными терминами",
      "Сравнение спецификаций оборудования",
      "Подбор аналогов оборудования по характеристикам",
      "Составление ТЗ по описанию задачи"
    ]
  },
  {
    name: "productionCases",
    title: "Производство и предиктивная аналитика",
    options: [
      "Прогноз загрузки производственных мощностей",
      "Анализ данных с датчиков оборудования",
      "Поиск паттернов аварий и поломок",
      "Оптимизация графика производства",
      "Контроль качества по фотографиям или измерениям",
      "Анализ причин брака с рекомендациями"
    ]
  },
  {
    name: "marketingCases",
    title: "Маркетинг и B2B-контент",
    options: [
      "Превращение проектов в кейсы для сайта",
      "Технические статьи и экспертный контент",
      "Рекламные материалы для отраслевых выставок",
      "Анализ упоминаний компании и конкурентов",
      "SEO для отраслевых запросов",
      "Презентации для отраслевых конференций"
    ]
  },
  {
    name: "hrCases",
    title: "HR и подбор инженеров",
    options: [
      "Отбор резюме инженеров по специфическим навыкам",
      "Подготовка технических вопросов под кандидата",
      "Описание вакансий с правильными ключевыми словами",
      "Обработка анонимной обратной связи 360",
      "Адаптация новичков через AI-наставника",
      "Анализ причин ухода сотрудников"
    ]
  },
  {
    name: "financeCases",
    title: "Финансы и аналитика",
    options: [
      "Excel-выгрузка из 1С -> отчёт с выводами",
      "Сравнение периодов: что изменилось и почему",
      "Поиск аномалий в расходах по проектам",
      "AI-аналитик в Telegram",
      "Анализ маржинальности проектов и клиентов",
      "Прогноз кассовых разрывов"
    ]
  },
  {
    name: "documentCases",
    title: "Документооборот",
    options: [
      "Подготовка КП под клиента за несколько минут",
      "Проверка договоров на риски",
      "Подготовка актов и закрывающих документов",
      "Перевод и адаптация технических документов",
      "Извлечение ключевой информации из длинных контрактов",
      "Сравнение версий договоров и подсветка изменений"
    ]
  },
  {
    name: "agentCases",
    title: "Агентные системы",
    options: [
      "Новый тендер -> анализ ТЗ -> черновик КП -> задача менеджеру",
      "Еженедельный AI-дайджест по рынку",
      "Воронка лидов с автоподогревом",
      "Связка почта -> задачи -> календарь -> CRM",
      "AI-аналитик, который сам ходит в базу данных",
      "Команда из нескольких ИИ-сотрудников"
    ]
  }
];

const textQuestions = [
  ["taskToAutomate", "Опишите задачу из вашей работы, которую хотели бы автоматизировать или ускорить с помощью ИИ."],
  ["weeklyRoutine", "Какая рутина отнимает больше всего вашего времени каждую неделю?"],
  ["delegateToAi", "Что бы вы делегировали ИИ-сотруднику в первую очередь, если бы могли?"],
  ["hardRecurringTask", "Есть ли тяжёлая задача, которая регулярно повторяется и которую сложно отдать стажёру?"]
];

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbys8nJ4unAahXaRD77ZtVxrX905WHt6GLUy5-acJ7InBtSH-5djrF5pgPesZPZ46mQ/exec";
const isStaticDemo = location.hostname.endsWith("github.io") || location.protocol === "file:";

function choice(name, type, label) {
  const safeId = `${name}-${Math.random().toString(36).slice(2)}`;
  return `
    <label class="choice" for="${safeId}">
      <input id="${safeId}" type="${type}" name="${name}" value="${escapeHtml(label)}">
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderQuestion(group) {
  const otherInput = group.otherName
    ? `<label class="field other-row">Другое
        <input type="text" name="${group.otherName}" placeholder="Укажите свой вариант">
      </label>`
    : "";
  return `
    <div class="question">
      <h3>${escapeHtml(group.title)}</h3>
      <div class="options">${group.options.map((item) => choice(group.name, group.type, item)).join("")}</div>
      ${otherInput}
    </div>
  `;
}

function render() {
  const departmentSelect = document.querySelector("#departmentSelect");
  departmentSelect.innerHTML = `<option value="">Выберите отдел</option>${departments
    .map((department) => `<option value="${escapeHtml(department)}">${escapeHtml(department)}</option>`)
    .join("")}`;

  document.querySelector("#introGroups").innerHTML = groups.intro.map(renderQuestion).join("");
  document.querySelector("#priorityDirections").innerHTML = priorityDirections
    .map((item) => choice("priorityDirections", "checkbox", item))
    .join("");
  document.querySelector("#caseGroups").innerHTML = caseGroups
    .map((group) => `
      <article class="case-card">
        <h3>${escapeHtml(group.title)}</h3>
        <div class="options">${group.options.map((item) => choice(group.name, "checkbox", item)).join("")}</div>
      </article>
    `)
    .join("");
  document.querySelector("#textQuestions").innerHTML = textQuestions
    .map(([name, title]) => `
      <label class="field">${escapeHtml(title)}
        <textarea name="${name}" placeholder="Напишите 1-2 фразы"></textarea>
      </label>
    `)
    .join("");
  document.querySelector("#expectationGroups").innerHTML = groups.expectations.map(renderQuestion).join("");
  document.querySelector("#technicalGroups").innerHTML = groups.technical.map(renderQuestion).join("");
}

function collectForm(form) {
  const data = {};
  const formData = new FormData(form);

  for (const [name, value] of formData.entries()) {
    if (data[name]) {
      data[name] = Array.isArray(data[name]) ? [...data[name], value] : [data[name], value];
    } else {
      data[name] = value;
    }
  }

  for (const groupName of [
    "aiServices",
    "priorityDirections",
    ...caseGroups.map((group) => group.name),
    "seminarExpectations",
    "aiConcerns"
  ]) {
    if (!data[groupName]) {
      data[groupName] = [];
    } else if (!Array.isArray(data[groupName])) {
      data[groupName] = [data[groupName]];
    }
  }

  return data;
}

function setStatus(message, type) {
  const status = document.querySelector("#status");
  status.className = type ? `is-${type}` : "";
  status.textContent = message;
}

function defaultStatusText() {
  if (isStaticDemo && GOOGLE_SCRIPT_URL) {
    return "Онлайн-сбор включён: ответы отправляются в Google Таблицу AMAKS.";
  }
  return isStaticDemo
    ? "Онлайн-версия на GitHub Pages работает как демо. Сбор всех анкет в Excel включается при локальном запуске python3 server.py."
    : "Заполненные анкеты сохраняются в файл data/responses.xlsx.";
}

render();

if (isStaticDemo && !GOOGLE_SCRIPT_URL) {
  document.querySelectorAll(".local-download").forEach((link) => {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.title = "Excel доступен при локальном запуске server.py";
  });
  setStatus(defaultStatusText());
}

document.querySelector("#departmentSelect").addEventListener("change", (event) => {
  document.querySelector("#departmentOtherWrap").classList.toggle("hidden", event.target.value !== "Другое");
});

document.querySelector("#priorityDirections").addEventListener("change", () => {
  const checked = [...document.querySelectorAll('input[name="priorityDirections"]:checked')];
  if (checked.length > 3) {
    checked.at(-1).checked = false;
    setStatus("В приоритетных направлениях можно выбрать максимум 3 пункта.", "error");
  } else {
    setStatus(defaultStatusText());
  }
});

document.querySelector("#survey").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const payload = collectForm(form);

  if (isStaticDemo && GOOGLE_SCRIPT_URL) {
    submitButton.disabled = true;
    setStatus("Отправляю ответ в Google Таблицу...", "");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      form.reset();
      document.querySelector("#departmentOtherWrap").classList.add("hidden");
      setStatus("Спасибо! Анкета отправлена в общую Google Таблицу. Excel можно скачать из неё через Файл -> Скачать -> Microsoft Excel.", "success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("Не удалось отправить ответ в Google Таблицу. Проверьте URL Apps Script.", "error");
    } finally {
      submitButton.disabled = false;
    }
    return;
  }

  if (isStaticDemo) {
    const demoResponses = JSON.parse(localStorage.getItem("amaksSurveyDemoResponses") || "[]");
    demoResponses.push({ submitted_at: new Date().toISOString(), ...payload });
    localStorage.setItem("amaksSurveyDemoResponses", JSON.stringify(demoResponses));
    form.reset();
    document.querySelector("#departmentOtherWrap").classList.add("hidden");
    setStatus(`Демо-ответ сохранён только в этом браузере. Для общего Excel нужен запуск server.py или внешний бэкенд. Демо-ответов: ${demoResponses.length}.`, "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  submitButton.disabled = true;
  setStatus("Сохраняю анкету...", "");

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Не удалось сохранить анкету");
    }
    form.reset();
    document.querySelector("#departmentOtherWrap").classList.add("hidden");
    setStatus(`Спасибо! Анкета сохранена. Всего ответов: ${result.count}.`, "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});
