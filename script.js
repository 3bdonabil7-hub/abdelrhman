// Telegram token and chat id (you provided)
const TG_BOT_TOKEN = "6567875241:AAHT8_XhZO8p2dHro4fotrFNLI0ORhffuWI";
const TG_CHAT_ID   = "5648582314";

// Translations
const translations = {
  en: {
    badge: "Student — Faculty of Agricultural Engineering",
    title: "<strong>Abdelrhman Nabil</strong>",
    about: "A student interested in agriculture and modern agricultural technologies.",
    downloadCv: "Download CV",
    locationLabel: "Location:",
    locationValue: "(Ashmoun)",
    skillsTitle: "Skills",
    skillsValue: "Nothing",
    contactTitle: "Write your message",
    contactMuted: "Type a message and it will be sent to Abderlhman Nabil .",
    senderLabel: "Sender name (optional)",
    messageLabel: "Message",
    sendBtn: "Send",
    emailLabel: "EMAIL:",
    phoneLabel: "Phone:",
    footerName: "Abdelrhman Nabil"
  },
  ar: {
    badge: "طالب — كلية الهندسة الزراعية",
    title: "<strong>عبد الرحمن نبيل</strong>",
    about: "طالب مهتم بالزراعة والتقنيات الحديثة في المجال الزراعي.",
    downloadCv: "تحميل السيرة الذاتية",
    locationLabel: "الموقع:",
    locationValue: "(اشمون)",
    skillsTitle: "المهارات",
    skillsValue: "لا يوجد",
    contactTitle: "اكتب رسالتك",
    contactMuted: "اكتب رسالة وسيتم إرسالها إلى عبد الرحمن نبيل.",
    senderLabel: "اسم المرسل (اختياري)",
    messageLabel: "الرسالة",
    sendBtn: "إرسال",
    emailLabel: "البريد الإلكتروني:",
    phoneLabel: "الهاتف:",
    footerName: "Abdelrhman Nabil"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // set year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // language handling
  const langToggle = document.getElementById("langToggle");
  const savedLang = localStorage.getItem("siteLang") || "en";
  applyLanguage(savedLang);

  langToggle.addEventListener("click", () => {
    const current = document.documentElement.lang || "en";
    const next = current === "en" ? "ar" : "en";
    applyLanguage(next);
    localStorage.setItem("siteLang", next);
  });

  // theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
  const updateIcon = () => themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  updateIcon();
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateIcon();
  });

  // entrance animation stagger: apply animation-delay from data-delay attributes
  document.querySelectorAll(".animate").forEach(el => {
    const d = el.getAttribute("data-delay") || "0";
    el.style.animationDelay = d + "s";
  });

  // download CV (example)
  document.getElementById("downloadCv")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.open("resume.pdf", "_blank");
  });

  // form -> send to telegram
  const form = document.getElementById("tgForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = translations[document.documentElement.lang || "en"].sending || "Sending...";
    const sender = document.getElementById("senderName").value.trim();
    const message = document.getElementById("messageText").value.trim();
    if (!message) { status.textContent = translations[document.documentElement.lang || "en"].pleaseMessage || "Please type a message."; return; }

    const text = `Portfolio message\nName: ${sender || "Not provided"}\nMessage:\n${message}`;

    try {
      const resp = await fetch(`https://api.telegram.org/bot${encodeURIComponent(TG_BOT_TOKEN)}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text })
      });
      const j = await resp.json();
      if (j && j.ok) {
        status.textContent = (document.documentElement.lang === "ar") ? "تم الإرسال بنجاح ✅" : "Sent successfully ✅";
        form.reset();
      } else {
        console.warn("telegram:", j);
        status.textContent = (document.documentElement.lang === "ar") ? "فشل الإرسال (تحقق من التوكن أو CORS)." : "Failed to send (check token or CORS).";
      }
    } catch (err) {
      console.error(err);
      status.textContent = (document.documentElement.lang === "ar") ? "خطأ أثناء الإرسال (غالباً CORS)." : "Error sending message (likely CORS).";
    }
  });
});

// applyLanguage: update UI texts and direction
function applyLanguage(lang) {
  const t = translations[lang] || translations.en;

  // set html lang and dir
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

  // flip text alignment for some containers via body class (optional)
  if (lang === "ar") document.body.classList.add("rtl");
  else document.body.classList.remove("rtl");

  // update elements by data-i18n keys
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const value = t[key];
    if (value !== undefined) {
      // if element is input placeholder or textarea placeholder
      if (el.tagName.toLowerCase() === "input" || el.tagName.toLowerCase() === "textarea") {
        el.placeholder = value;
      } else {
        el.innerHTML = value;
      }
    }
  });

  // placeholders and button text that are not data-i18n attributes:
  document.getElementById("senderName").placeholder = (lang === "ar") ? "اسمك (اختياري)" : "Your name (optional)";
  document.getElementById("messageText").placeholder = (lang === "ar") ? "اكتب رسالتك هنا..." : "Type your message...";

  // send button text:
  document.querySelectorAll("[data-i18n='sendBtn']").forEach(el => el.textContent = t.sendBtn);

  // status reset
  const status = document.getElementById("status");
  if (status) status.textContent = "";

  // update any other specific labels
  document.querySelectorAll("[data-i18n='emailLabel']").forEach(el => el.textContent = t.emailLabel);
  document.querySelectorAll("[data-i18n='phoneLabel']").forEach(el => el.textContent = t.phoneLabel);
  document.querySelectorAll("[data-i18n='footerName']").forEach(el => el.textContent = t.footerName);

  // update lang toggle text
  const langToggle = document.getElementById("langToggle");
  if (langToggle) langToggle.textContent = (lang === "ar") ? "AR | EN" : "EN | AR";
}
