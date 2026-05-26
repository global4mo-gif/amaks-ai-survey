const SPREADSHEET_ID = "1bxfMaZk7o_eKWKcaBwvXx7V9DdDJaAC_cJ23t4_zhj8";
const SHEET_NAME = "Анкеты";

const HEADERS = [
  ["submitted_at", "Дата заполнения"],
  ["fullName", "ФИО"],
  ["department", "Отдел"],
  ["departmentOther", "Отдел: другое"],
  ["role", "Роль"],
  ["aiExperience", "Опыт с ИИ"],
  ["aiServices", "ИИ-сервисы"],
  ["aiServicesOther", "ИИ-сервисы: другое"],
  ["priorityDirections", "Приоритетные направления"],
  ["emailCases", "Почта"],
  ["meetingCases", "Встречи"],
  ["presentationCases", "Презентации"],
  ["knowledgeCases", "База знаний"],
  ["hermesCases", "ИИ-сотрудник Hermes"],
  ["webCases", "Веб-инструменты"],
  ["tenderCases", "Тендеры и пресейл"],
  ["engineeringCases", "Инженерные задачи"],
  ["productionCases", "Производство и аналитика"],
  ["marketingCases", "Маркетинг"],
  ["hrCases", "HR"],
  ["financeCases", "Финансы"],
  ["documentCases", "Документооборот"],
  ["agentCases", "Агентные системы"],
  ["taskToAutomate", "Задача для автоматизации"],
  ["weeklyRoutine", "Главная еженедельная рутина"],
  ["delegateToAi", "Что делегировать ИИ-сотруднику"],
  ["hardRecurringTask", "Тяжёлая повторяющаяся задача"],
  ["seminarExpectations", "Ожидания от семинара"],
  ["mainImportance", "Что важнее всего"],
  ["aiConcerns", "Опасения"],
  ["aiConcernsOther", "Опасения: другое"],
  ["hasLaptop", "Ноутбук на семинаре"],
  ["wantsPractice", "Практический блок"],
];

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const sheet = getSheet();
    ensureHeaders(sheet);

    const record = {
      submitted_at: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
      ...payload,
    };

    const row = HEADERS.map(([key]) => normalizeValue(record[key]));
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: "AMAKS survey collector is running" });
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet) {
  const labels = HEADERS.map(([, label]) => label);
  const current = sheet.getRange(1, 1, 1, labels.length).getValues()[0];
  const isEmpty = current.every((cell) => cell === "");

  if (isEmpty) {
    sheet.getRange(1, 1, 1, labels.length).setValues([labels]);
    sheet.setFrozenRows(1);
  }
}

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.join("\n");
  }
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
