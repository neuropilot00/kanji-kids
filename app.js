const gradeData = window.KYOIKU_KANJI || {};
const allKanji = Object.values(gradeData).flat();
const gradePlans = [
  { title: "1年", text: "形がやさしい漢字から始め、数・自然・学校のことばを読めるようにします。" },
  { title: "2年", text: "生活のことばを広げ、音読みと訓読みをくらべながら短い文で使います。" },
  { title: "3年", text: "社会・理科で出る漢字を増やし、読み分けと熟語の形に慣れます。" },
  { title: "4年", text: "抽象的なことばを扱い、文の中で意味を選ぶ練習を増やします。" },
  { title: "5年", text: "ニュースや説明文に出る漢字を学び、似た形の漢字を整理します。" },
  { title: "6年", text: "小学校の総仕上げとして、文章で自然に読める状態を目指します。" }
];

const uiYomi = {
  学年別漢字配当表: "がくねんべつかんじはいとうひょう",
  学年別: "がくねんべつ",
  年生: "ねんせい",
  配当順: "はいとうじゅん",
  配当表: "はいとうひょう",
  学年: "がくねん",
  小学: "しょうがく",
  漢字: "かんじ",
  毎日: "まいにち",
  今日: "きょう",
  復習: "ふくしゅう",
  学習量: "がくしゅうりょう",
  学習者: "がくしゅうしゃ",
  学習: "がくしゅう",
  先生: "せんせい",
  一覧: "いちらん",
  内容: "ないよう",
  設計: "せっけい",
  年間: "ねんかん",
  家庭: "かてい",
  追加: "ついか",
  開発済: "かいはつず",
  画面: "がめん",
  未習: "みしゅう",
  短: "みじか",
  時間: "じかん",
  確認: "かくにん",
  手本: "てほん",
  記録: "きろく",
  検索: "けんさく",
  練習: "れんしゅう",
  達成率: "たっせいりつ",
  設定: "せってい",
  表示: "ひょうじ",
  保存: "ほぞん",
  意味: "いみ",
  全部: "ぜんぶ",
  形: "かたち",
  数: "かず",
  自然: "しぜん",
  学校: "がっこう",
  生活: "せいかつ",
  音読: "おんどく",
  訓読: "くんよ",
  短文: "たんぶん",
  社会: "しゃかい",
  理科: "りか",
  増: "ふ",
  分: "わ",
  熟語: "じゅくご",
  慣: "な",
  抽象: "ちゅうしょう",
  文: "ぶん",
  中: "なか",
  ニュース: "にゅーす",
  説明文: "せつめいぶん",
  似: "に",
  整理: "せいり",
  総仕上: "そうしあ",
  文章: "ぶんしょう",
  自然: "しぜん",
  状態: "じょうたい",
  目指: "めざ",
  順: "じゅん",
  森: "もり",
  見: "み",
  読: "よ",
  書: "か",
  答: "こた",
  使: "つか",
  化: "か",
  向: "む",
  始: "はじ",
  覚: "おぼ",
  薄: "うす",
  上: "うえ",
  指: "ゆび",
  移: "うつ",
  次: "つぎ",
  選: "えら",
  声: "こえ",
  出: "だ",
  年: "ねん",
  字: "じ",
  分: "ぷん",
  問: "もん",
  番: "ばん",
  小: "しょう"
};

const uiYomiKeys = Object.keys(uiYomi).sort((a, b) => b.length - a.length);

const elements = {
  glyph: document.querySelector("#kanjiGlyph"),
  grade: document.querySelector("#gradeBadge"),
  strokes: document.querySelector("#strokeBadge"),
  meaning: document.querySelector("#kanjiMeaning"),
  reading: document.querySelector("#kanjiReading"),
  sentence: document.querySelector("#exampleSentence"),
  ghost: document.querySelector("#traceGhost"),
  mastered: document.querySelector("#masteredCount"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizOptions: document.querySelector("#quizOptions"),
  nextQuiz: document.querySelector("#nextQuiz"),
  kanjiQuizMode: document.querySelector("#kanjiQuizMode"),
  yomiQuizMode: document.querySelector("#yomiQuizMode"),
  quizScore: document.querySelector("#quizScore"),
  gradeGrid: document.querySelector("#gradeGrid"),
  gradeSummary: document.querySelector("#gradeSummary"),
  kanjiList: document.querySelector("#kanjiList"),
  listSummary: document.querySelector("#listSummary"),
  search: document.querySelector("#kanjiSearch"),
  currentNumber: document.querySelector("#currentNumber"),
  totalNumber: document.querySelector("#totalNumber"),
  canvas: document.querySelector("#traceCanvas"),
  strokeGuideGlyph: document.querySelector("#strokeGuideGlyph"),
  strokeGuideImage: document.querySelector("#strokeGuideImage"),
  strokeGuideStatus: document.querySelector("#strokeGuideStatus"),
  menuButton: document.querySelector("#menuButton"),
  profileButton: document.querySelector("#profileButton"),
  drawer: document.querySelector("#drawer"),
  overlay: document.querySelector("#overlay"),
  closeMenu: document.querySelector("#closeMenu"),
  profileDialog: document.querySelector("#profileDialog"),
  studentName: document.querySelector("#studentName"),
  praiseToggle: document.querySelector("#praiseToggle"),
  saveProfile: document.querySelector("#saveProfile"),
  toast: document.querySelector("#toast"),
  bookGradeGrid: document.querySelector("#bookGradeGrid"),
  bookGrid: document.querySelector("#bookGrid"),
  bookSearch: document.querySelector("#bookSearch"),
  bookCount: document.querySelector("#bookCount"),
  planGrid: document.querySelector("#planGrid"),
  recordGrid: document.querySelector("#recordGrid"),
  recordTotal: document.querySelector("#recordTotal"),
  resetProgress: document.querySelector("#resetProgress")
};

let currentGrade = 1;
let bookGrade = 1;
let visibleKanji = [...gradeData[currentGrade]];
let bookVisible = [...gradeData[bookGrade]];
let currentIndex = 0;
let quizQueue = [];
let quizMode = "kanji";
let quizCorrect = 0;
let quizAnswered = 0;
let mastered = new Set(JSON.parse(localStorage.getItem("kanji-mastered") || "[]"));
let drawing = false;
let toastTimer = 0;
let profile = JSON.parse(localStorage.getItem("kanji-profile") || '{"name":"ゆい","praise":true}');

function currentKanji() {
  return visibleKanji[currentIndex] || allKanji[0];
}

function readingText(item) {
  return item.readings.join("・");
}

function primaryYomi(item) {
  const yomi = item.readings.find((reading) => /[ぁ-ん]/.test(reading)) || item.readings[0] || item.glyph;
  return toHiragana(yomi).replace(/[（）]/g, "");
}

function rubyForText(text) {
  const fragment = document.createDocumentFragment();
  let index = 0;

  while (index < text.length) {
    const key = uiYomiKeys.find((word) => text.startsWith(word, index));
    if (!key) {
      fragment.append(document.createTextNode(text[index]));
      index += 1;
      continue;
    }

    const ruby = document.createElement("ruby");
    ruby.append(document.createTextNode(key));
    const rt = document.createElement("rt");
    rt.textContent = uiYomi[key];
    ruby.append(rt);
    fragment.append(ruby);
    index += key.length;
  }

  return fragment;
}

function annotateUiKanji(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["RUBY", "RT", "SCRIPT", "STYLE", "INPUT", "TEXTAREA", "CANVAS"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return uiYomiKeys.some((word) => node.nodeValue.includes(word))
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => node.replaceWith(rubyForText(node.nodeValue)));
}

function toHiragana(text) {
  return text.replace(/[ァ-ン]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
}

function appendRuby(parent, item) {
  const ruby = document.createElement("ruby");
  ruby.append(document.createTextNode(item.glyph));
  const rt = document.createElement("rt");
  rt.textContent = primaryYomi(item);
  ruby.append(rt);
  parent.append(ruby);
}

function kanjiSvgUrl(glyph) {
  const code = glyph.codePointAt(0).toString(16).padStart(5, "0");
  return `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${code}.svg`;
}

function showToast(message) {
  if (!profile.praise && message.includes("でき")) return;
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  annotateUiKanji(elements.toast);
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

function renderKanji() {
  const item = currentKanji();
  const globalIndex = allKanji.findIndex((kanji) => kanji.glyph === item.glyph) + 1;
  elements.glyph.innerHTML = "";
  appendRuby(elements.glyph, item);
  elements.grade.textContent = `小${item.grade}`;
  elements.strokes.textContent = `${item.order}番`;
  elements.meaning.textContent = item.readings[0] || item.glyph;
  elements.reading.textContent = readingText(item);
  elements.sentence.textContent = makeStudyLine(item);
  elements.ghost.innerHTML = "";
  appendRuby(elements.ghost, item);
  renderStrokeGuide(item);
  elements.mastered.textContent = mastered.size;
  elements.currentNumber.textContent = globalIndex;
  elements.totalNumber.textContent = `/${allKanji.length}`;
  renderQuiz();
  renderKanjiList();
  renderRecords();
  annotateUiKanji();
  clearCanvas();
}

function makeStudyLine(item) {
  return `読み: ${readingText(item)}　例: 「${item.glyph}」を声に出して読んでみよう。`;
}

function renderStrokeGuide(item) {
  elements.strokeGuideGlyph.textContent = item.glyph;
  elements.strokeGuideImage.src = kanjiSvgUrl(item.glyph);
  elements.strokeGuideImage.hidden = false;
  elements.strokeGuideStatus.textContent = "お手本を見てから、なぞろう。";
  annotateUiKanji(elements.strokeGuideStatus);
}

function renderQuiz() {
  const answer = currentKanji();
  elements.quizScore.textContent = `${quizCorrect}/${quizAnswered}`;
  elements.kanjiQuizMode.classList.toggle("active", quizMode === "kanji");
  elements.yomiQuizMode.classList.toggle("active", quizMode === "yomi");
  elements.quizOptions.innerHTML = "";
  elements.nextQuiz.classList.remove("active");

  if (quizMode === "kanji") {
    const pool = allKanji.filter((item) => item.glyph !== answer.glyph);
    const options = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    options.push(answer);
    options.sort(() => Math.random() - 0.5);
    elements.quizQuestion.textContent = `「${answer.readings[0]}」の漢字はどれ？`;

    options.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.answer = item.glyph;
      appendRuby(button, item);
      button.addEventListener("click", () => answerQuiz(button, item.glyph === answer.glyph, answer.glyph));
      elements.quizOptions.append(button);
    });
    return;
  }

  const correctYomi = primaryYomi(answer);
  const yomiOptions = allKanji
    .filter((item) => item.glyph !== answer.glyph)
    .map((item) => primaryYomi(item))
    .filter((reading) => reading !== correctYomi)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  yomiOptions.push(correctYomi);
  yomiOptions.sort(() => Math.random() - 0.5);
  elements.quizQuestion.innerHTML = "";
  elements.quizQuestion.append("この");
  appendRuby(elements.quizQuestion, answer);
  elements.quizQuestion.append("の読みはどれ？");
  annotateUiKanji(elements.quizQuestion);

  yomiOptions.forEach((reading) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "yomi-option";
    button.dataset.answer = reading;
    button.textContent = reading;
    button.addEventListener("click", () => answerQuiz(button, reading === correctYomi, correctYomi));
    elements.quizOptions.append(button);
  });
}

function answerQuiz(button, isCorrect, correctAnswer) {
  [...elements.quizOptions.children].forEach((option) => {
    option.disabled = true;
    if (option.dataset.answer === correctAnswer) option.classList.add("correct");
  });
  button.classList.add(isCorrect ? "correct" : "wrong");
  quizAnswered += 1;
  if (isCorrect) {
    quizCorrect += 1;
    markMastered(false);
    showToast("できた！つぎの漢字へ進もう");
  } else {
    showToast("もう一度あとで復習しよう");
  }
  elements.quizScore.textContent = `${quizCorrect}/${quizAnswered}`;
  elements.nextQuiz.classList.add("active");
}

function changeKanji(direction) {
  currentIndex = (currentIndex + direction + visibleKanji.length) % visibleKanji.length;
  renderKanji();
}

function markMastered(withToast = true) {
  mastered.add(currentKanji().glyph);
  localStorage.setItem("kanji-mastered", JSON.stringify([...mastered]));
  elements.mastered.textContent = mastered.size;
  renderKanjiList();
  renderBook();
  renderRecords();
  if (withToast) showToast("おぼえた漢字に入れたよ");
}

function renderGrades() {
  elements.gradeGrid.innerHTML = "";
  for (let grade = 1; grade <= 6; grade += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${grade}年`;
    button.classList.toggle("active", grade === currentGrade);
    button.addEventListener("click", () => setPracticeGrade(grade));
    elements.gradeGrid.append(button);
  }
}

function setPracticeGrade(grade) {
  currentGrade = grade;
  elements.search.value = "";
  visibleKanji = [...gradeData[currentGrade]];
  currentIndex = 0;
  quizQueue = [];
  renderGrades();
  renderKanji();
}

function renderKanjiList() {
  const item = currentKanji();
  elements.kanjiList.innerHTML = "";
  elements.gradeSummary.textContent = `${currentGrade}年 ${gradeData[currentGrade].length}字`;
  elements.listSummary.textContent = `${visibleKanji.length}字`;

  visibleKanji.forEach((kanji, index) => {
    const button = document.createElement("button");
    button.type = "button";
    appendRuby(button, kanji);
    button.classList.toggle("active", kanji.glyph === item.glyph);
    button.classList.toggle("mastered", mastered.has(kanji.glyph));
    button.addEventListener("click", () => {
      currentIndex = index;
      renderKanji();
    });
    elements.kanjiList.append(button);
  });
}

function filterKanji() {
  const query = elements.search.value.trim();
  const gradeItems = gradeData[currentGrade];
  visibleKanji = query ? searchKanji(query) : [...gradeItems];
  currentIndex = 0;
  if (visibleKanji.length === 0) {
    visibleKanji = [...gradeItems];
    showToast("見つからなかったので学年一覧に戻したよ");
  }
  renderKanji();
}

function searchKanji(query) {
  return allKanji.filter((item) => {
    return item.glyph.includes(query) || item.readings.some((reading) => reading.includes(query));
  });
}

function switchMode(mode) {
  document.querySelectorAll(".mode-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });
  document.querySelectorAll(".mode-view").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#${mode}View`).classList.add("active");
}

function switchScreen(screen) {
  document.querySelectorAll(".screen").forEach((view) => view.classList.remove("active"));
  document.querySelector(`#${screen}Screen`).classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screen);
  });
  closeDrawer();
  if (screen === "book") renderBook();
  if (screen === "record") renderRecords();
}

function startDailyQuiz() {
  const notMastered = gradeData[currentGrade].filter((item) => !mastered.has(item.glyph));
  quizQueue = (notMastered.length ? notMastered : gradeData[currentGrade]).slice(0, 10);
  visibleKanji = [...quizQueue];
  currentIndex = 0;
  switchScreen("practice");
  switchMode("quiz");
  renderKanji();
  showToast("今日の10問を始めよう");
}

function startReview() {
  const reviewItems = allKanji.filter((item) => !mastered.has(item.glyph));
  visibleKanji = reviewItems.length ? reviewItems.slice(0, 60) : [...gradeData[currentGrade]];
  currentIndex = 0;
  switchScreen("practice");
  switchMode("quiz");
  renderKanji();
  showToast(reviewItems.length ? "まだの漢字を集めたよ" : "全部できているので学年練習に戻したよ");
}

function jumpRandom() {
  visibleKanji = [...allKanji];
  currentIndex = Math.floor(Math.random() * visibleKanji.length);
  switchScreen("practice");
  renderKanji();
  showToast("ランダム漢字を出したよ");
}

function nextQuizItem() {
  if (quizQueue.length) {
    currentIndex = (currentIndex + 1) % quizQueue.length;
  } else {
    changeKanji(1);
    return;
  }
  renderKanji();
}

function renderBookGrades() {
  elements.bookGradeGrid.innerHTML = "";
  for (let grade = 1; grade <= 6; grade += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${grade}年`;
    button.classList.toggle("active", grade === bookGrade);
    button.addEventListener("click", () => {
      bookGrade = grade;
      elements.bookSearch.value = "";
      bookVisible = [...gradeData[bookGrade]];
      renderBookGrades();
      renderBook();
    });
    elements.bookGradeGrid.append(button);
  }
}

function renderBook() {
  const query = elements.bookSearch.value.trim();
  bookVisible = query ? searchKanji(query) : [...gradeData[bookGrade]];
  elements.bookCount.textContent = query ? `${bookVisible.length}字` : `${bookGrade}年 ${bookVisible.length}字`;
  elements.bookGrid.innerHTML = "";

  bookVisible.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("mastered", mastered.has(item.glyph));
    const strong = document.createElement("strong");
    appendRuby(strong, item);
    const small = document.createElement("small");
    small.textContent = `小${item.grade} ${primaryYomi(item)}`;
    button.append(strong, small);
    button.addEventListener("click", () => openKanjiFromBook(item));
    elements.bookGrid.append(button);
  });
  annotateUiKanji(elements.bookGrid);
  annotateUiKanji(elements.bookCount);
}

function openKanjiFromBook(item) {
  currentGrade = item.grade;
  visibleKanji = [...gradeData[currentGrade]];
  currentIndex = visibleKanji.findIndex((kanji) => kanji.glyph === item.glyph);
  elements.search.value = "";
  renderGrades();
  switchScreen("practice");
  switchMode("learn");
  renderKanji();
}

function renderPlans() {
  elements.planGrid.innerHTML = "";
  gradePlans.forEach((plan, index) => {
    const count = gradeData[index + 1].length;
    const article = document.createElement("article");
    article.innerHTML = `<strong>${plan.title}・${count}字</strong><p>${plan.text}</p>`;
    elements.planGrid.append(article);
  });
  annotateUiKanji(elements.planGrid);
}

function renderRecords() {
  elements.recordTotal.textContent = `${mastered.size}/${allKanji.length}`;
  elements.recordGrid.innerHTML = "";

  for (let grade = 1; grade <= 6; grade += 1) {
    const total = gradeData[grade].length;
    const done = gradeData[grade].filter((item) => mastered.has(item.glyph)).length;
    const percent = Math.round((done / total) * 100);
    const card = document.createElement("article");
    card.className = "record-card";
    card.innerHTML = `
      <strong>${grade}年 ${done}/${total}</strong>
      <div class="record-meter"><span style="width: ${percent}%"></span></div>
      <button type="button">${grade}年を練習</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      setPracticeGrade(grade);
      switchScreen("practice");
    });
    elements.recordGrid.append(card);
  }
  annotateUiKanji(elements.recordGrid);
  annotateUiKanji(elements.recordTotal);
}

function openDrawer() {
  elements.overlay.hidden = false;
  elements.drawer.classList.add("open");
  elements.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  elements.drawer.classList.remove("open");
  elements.drawer.setAttribute("aria-hidden", "true");
  elements.overlay.hidden = true;
}

function openProfile() {
  elements.studentName.value = profile.name;
  elements.praiseToggle.checked = profile.praise;
  elements.profileDialog.showModal();
}

function saveProfile() {
  profile = {
    name: elements.studentName.value.trim() || "ゆい",
    praise: elements.praiseToggle.checked
  };
  localStorage.setItem("kanji-profile", JSON.stringify(profile));
  elements.profileButton.textContent = profile.name.slice(0, 1);
  showToast("プロフィールを保存したよ");
}

function resetProgress() {
  const ok = window.confirm("おぼえた記録をすべて消しますか？");
  if (!ok) return;
  mastered = new Set();
  localStorage.setItem("kanji-mastered", "[]");
  renderKanji();
  renderBook();
  renderRecords();
  showToast("記録をリセットしたよ");
}

function canvasPoint(event) {
  const rect = elements.canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: ((point.clientX - rect.left) / rect.width) * elements.canvas.width,
    y: ((point.clientY - rect.top) / rect.height) * elements.canvas.height
  };
}

function context() {
  const ctx = elements.canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#22312f";
  return ctx;
}

function startDrawing(event) {
  drawing = true;
  const point = canvasPoint(event);
  const ctx = context();
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
}

function draw(event) {
  if (!drawing) return;
  event.preventDefault();
  const point = canvasPoint(event);
  const ctx = context();
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
}

function clearCanvas() {
  const ctx = elements.canvas.getContext("2d");
  ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

document.querySelector("#prevKanji").addEventListener("click", () => changeKanji(-1));
document.querySelector("#nextKanji").addEventListener("click", () => changeKanji(1));
document.querySelector("#knowButton").addEventListener("click", () => markMastered(true));
document.querySelector("#finishTrace").addEventListener("click", () => markMastered(true));
document.querySelector("#clearCanvas").addEventListener("click", clearCanvas);
document.querySelector("#dailyButton").addEventListener("click", startDailyQuiz);
document.querySelector("#reviewButton").addEventListener("click", startReview);
document.querySelector("#randomButton").addEventListener("click", jumpRandom);
elements.nextQuiz.addEventListener("click", nextQuizItem);
elements.kanjiQuizMode.addEventListener("click", () => {
  quizMode = "kanji";
  renderQuiz();
});
elements.yomiQuizMode.addEventListener("click", () => {
  quizMode = "yomi";
  renderQuiz();
});
elements.search.addEventListener("input", filterKanji);
elements.bookSearch.addEventListener("input", renderBook);
elements.menuButton.addEventListener("click", openDrawer);
elements.closeMenu.addEventListener("click", closeDrawer);
elements.overlay.addEventListener("click", closeDrawer);
elements.profileButton.addEventListener("click", openProfile);
elements.saveProfile.addEventListener("click", saveProfile);
elements.resetProgress.addEventListener("click", resetProgress);

document.querySelectorAll(".drawer-action").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "daily") startDailyQuiz();
    if (action === "review") startReview();
    if (action === "book") switchScreen("book");
    if (action === "record") switchScreen("record");
  });
});

document.querySelectorAll(".bottom-nav button").forEach((button) => {
  button.addEventListener("click", () => switchScreen(button.dataset.screen));
});

document.querySelectorAll(".mode-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchMode(tab.dataset.mode));
});

elements.canvas.addEventListener("mousedown", startDrawing);
elements.canvas.addEventListener("mousemove", draw);
window.addEventListener("mouseup", stopDrawing);
elements.canvas.addEventListener("touchstart", startDrawing, { passive: false });
elements.canvas.addEventListener("touchmove", draw, { passive: false });
window.addEventListener("touchend", stopDrawing);
elements.strokeGuideImage.addEventListener("error", () => {
  elements.strokeGuideImage.hidden = true;
  elements.strokeGuideStatus.textContent = "お手本がないので、きほんの書き順でなぞろう。";
  annotateUiKanji(elements.strokeGuideStatus);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

elements.profileButton.textContent = profile.name.slice(0, 1);
renderGrades();
renderBookGrades();
renderPlans();
renderKanji();
renderBook();
renderRecords();
