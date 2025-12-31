// WCAG 2.1 AA compliant Accessibility Widget

(function () {
  // 1) Inject HTML (semantic + ARIA)
  const accHTML = `
    <div id="accLiveRegion" class="acc-sr-only" aria-live="polite" aria-atomic="true"></div>

    <button class="acc-trigger" id="accTrigger" type="button"
      aria-label="פתח תפריט נגישות"
      aria-controls="accPanel"
      aria-expanded="false">
      <i data-lucide="person-standing"></i>
    </button>

    <div class="acc-panel" id="accPanel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accTitle"
      aria-hidden="true">
      
      <div class="acc-header">
        <h3 id="accTitle">כלי נגישות</h3>
        <button class="acc-close" id="accClose" type="button" aria-label="סגור תפריט נגישות">
          <i data-lucide="x"></i>
        </button>
      </div>

      <div class="acc-body">
        <div class="acc-grid">
          <button class="acc-btn" type="button" data-action="contrast" aria-pressed="false" data-msg="מצב ניגודיות גבוהה הופעל">
            <i data-lucide="contrast"></i><span>ניגודיות גבוהה</span>
          </button>
          <button class="acc-btn" type="button" data-action="invert" aria-pressed="false" data-msg="מצב היפוך צבעים הופעל">
            <i data-lucide="moon"></i><span>היפוך צבעים</span>
          </button>
          <button class="acc-btn" type="button" data-action="grayscale" aria-pressed="false" data-msg="מצב גווני אפור הופעל">
            <i data-lucide="droplet"></i><span>גווני אפור</span>
          </button>
          <button class="acc-btn" type="button" data-action="links" aria-pressed="false" data-msg="הדגשת קישורים הופעלה">
            <i data-lucide="link"></i><span>הדגשת קישורים</span>
          </button>
          <button class="acc-btn" type="button" data-action="font" aria-pressed="false" data-msg="גופן קריא הופעל">
            <i data-lucide="type"></i><span>גופן קריא</span>
          </button>
          <button class="acc-btn" type="button" data-action="hide-images" aria-pressed="false" data-msg="תמונות הוסתרו">
            <i data-lucide="image-off"></i><span>הסתרת תמונות</span>
          </button>
          <button class="acc-btn" type="button" data-action="cursor-big" aria-pressed="false" data-msg="סמן גדול הופעל">
            <i data-lucide="mouse-pointer-2"></i><span>סמן גדול</span>
          </button>
          <button class="acc-btn" type="button" data-action="reduce-motion" aria-pressed="false" data-msg="אנימציות בוטלו">
            <i data-lucide="activity"></i><span>ביטול אנימציות</span>
          </button>
        </div>

        <div class="acc-controls">
          <span class="acc-controls-label">גודל טקסט</span>
          <div class="acc-resize-group" role="group" aria-label="שינוי גודל טקסט">
            <button id="textMinus" type="button" aria-label="הקטן טקסט">-</button>
            <span id="textSizeDisplay">100%</span>
            <button id="textPlus" type="button" aria-label="הגדל טקסט">+</button>
          </div>
        </div>

        <div class="acc-footer">
          <a href="accessibility.html" class="acc-accessibility-link">הצהרת נגישות</a>
          <button id="resetAcc" class="acc-reset" type="button">איפוס הגדרות</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", accHTML);

  // Init icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2) Elements
  const trigger = document.getElementById("accTrigger");
  const panel = document.getElementById("accPanel");
  const closeBtn = document.getElementById("accClose");
  const btns = Array.from(document.querySelectorAll(".acc-btn"));
  const resetBtn = document.getElementById("resetAcc");
  const textMinus = document.getElementById("textMinus");
  const textPlus = document.getElementById("textPlus");
  const textSizeDisplay = document.getElementById("textSizeDisplay");
  const liveRegion = document.getElementById("accLiveRegion");

  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  let lastFocusedElement = null;
  let currentScale = 100;

  function announce(msg) {
    liveRegion.textContent = msg;
    setTimeout(() => { liveRegion.textContent = ''; }, 1000);
  }

  function isPanelOpen() {
    return panel.classList.contains("active");
  }

  function getFocusableInPanel() {
    return Array.from(panel.querySelectorAll(focusableSelector)).filter((el) => {
      const disabled = el.hasAttribute("disabled");
      const hidden = el.offsetParent === null;
      return !disabled && !hidden;
    });
  }

  function openPanel() {
    if (isPanelOpen()) return;
    lastFocusedElement = document.activeElement;
    panel.classList.add("active");
    panel.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    const focusables = getFocusableInPanel();
    (focusables[0] || closeBtn).focus();
  }

  function closePanel() {
    if (!isPanelOpen()) return;
    panel.classList.remove("active");
    panel.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    } else {
      trigger.focus();
    }
  }

  function trapFocus(e) {
    if (!isPanelOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = getFocusableInPanel();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // 3) Events
  trigger.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("click", (e) => {
    if (!isPanelOpen()) return;
    if (!panel.contains(e.target) && !trigger.contains(e.target)) {
      closePanel();
    }
  });
  document.addEventListener("keydown", trapFocus);

  // 4) Toggle modes
  const mutuallyExclusive = ["contrast", "invert", "grayscale"];

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const isActive = btn.classList.toggle("active");

      if (isActive && mutuallyExclusive.includes(action)) {
        btns.forEach((otherBtn) => {
          const otherAction = otherBtn.dataset.action;
          if (otherAction !== action && mutuallyExclusive.includes(otherAction)) {
            otherBtn.classList.remove("active");
            otherBtn.setAttribute("aria-pressed", "false");
            document.documentElement.classList.remove(`acc-mode-${otherAction}`);
          }
        });
      }

      btn.setAttribute("aria-pressed", String(isActive));
      document.documentElement.classList.toggle(`acc-mode-${action}`, isActive);

      if (isActive && btn.dataset.msg) {
        announce(btn.dataset.msg);
      }
    });
  });

  // 5) Text size
  function applyTextSize() {
    textSizeDisplay.textContent = `${currentScale}%`;
    document.body.style.fontSize = `${currentScale}%`;
  }

  function updateTextSize(direction) {
    currentScale += direction * 10;
    if (currentScale < 80) currentScale = 80;
    if (currentScale > 150) currentScale = 150;
    applyTextSize();
  }

  textMinus.addEventListener("click", () => updateTextSize(-1));
  textPlus.addEventListener("click", () => updateTextSize(1));

  // 6) Safe reset
  resetBtn.addEventListener("click", () => {
    const htmlClasses = Array.from(document.documentElement.classList);
    htmlClasses.forEach((cls) => {
      if (cls.startsWith("acc-mode-")) {
        document.documentElement.classList.remove(cls);
      }
    });

    document.body.style.fontSize = '';

    btns.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });

    currentScale = 100;
    applyTextSize();
    announce("הגדרות הנגישות אופסו");
  });

  applyTextSize();
})();
