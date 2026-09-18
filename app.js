/*
 * PERSONALIZE HERE — this is the only section you need to edit.
 */
const CONTENT = {
  name: "Irenne",
  age: "28 ✓",
  version: "v28.0",
  date: "A tiny birthday event · 2026",
  signature: "— someone who is very glad you exist 🐮",
  message: [
    "Happy Birthday Bu Iren, karena diriku ini salah membeli kartu NFC dan tidak tau digunakan untuk apa jadi gw buang kesini ya hehe",
    "Dan juga karena saya malas menulis manual jadi saya ketik di keyboard juga untuk wishnya, tapi pas ngetik saya tidak tahu mau ketik apa wkwkwk.",
    "Semoga lancar lancar apapun yang anda lakukan ya Bu. Happy Birthday 💥"
  ],
  patches: [
    ["✨", "Level +1"],
    ["🧠", "Wisdom +0.7% (results may vary)"],
    ["😴", "Sleep resistance −12%"],
    ["🍰", "Cake compatibility +100%"],
    ["💸", "Financial decisions — under investigation"],
    ["🐣", "Species — only her know"]
  ],
  issues: ["Random mood changes", "Requires Manggo a lot", "May become sleepy", "Always low battery"]
};

const scenes = [...document.querySelectorAll(".scene")];
const app = document.getElementById("app");
let currentScene = "discovery";
let annoyCount = 0;
let wakeCount = 0;
let audioEngine = null;

function fillContent() {
  document.querySelectorAll('[data-field="name"]').forEach((el) => {
    el.textContent = el.closest("h1") ? `${CONTENT.name.toUpperCase()}!!` : CONTENT.name;
  });
  document.querySelectorAll('[data-field="age"]').forEach((el) => el.textContent = CONTENT.age);
  document.querySelectorAll('[data-field="version"]').forEach((el) => el.textContent = CONTENT.version);
  document.querySelectorAll('[data-field="date"]').forEach((el) => el.textContent = CONTENT.date);
  document.getElementById("patchList").innerHTML = CONTENT.patches.map(([icon, text]) => `<li><span>${icon}</span><b>${text}</b></li>`).join("");
  document.getElementById("issueList").innerHTML = CONTENT.issues.map((issue) => `• ${issue}`).join("<br>");
  document.getElementById("personalMessage").innerHTML = CONTENT.message.map((text) => `<p>${text}</p>`).join("");
  document.getElementById("letterSign").textContent = CONTENT.signature;
}

function goTo(name) {
  const next = scenes.find((scene) => scene.dataset.scene === name);
  if (!next) return;
  scenes.forEach((scene) => scene.classList.remove("scene--active"));
  next.classList.add("scene--active");
  next.scrollTop = 0;
  currentScene = name;
  try {
    history.replaceState(null, "", `#${name}`);
  } catch (error) {
    // Some in-app browsers restrict history updates for local/static pages.
    console.warn("Scene URL could not be updated:", error);
  }
}

function startProtocol() {
  goTo("protocol");
  const bar = document.getElementById("progressBar");
  const number = document.getElementById("progressNumber");
  const stuck = document.getElementById("stuckArea");
  stuck.hidden = true;
  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(93, progress + Math.ceil(Math.random() * 9));
    bar.style.width = `${progress}%`;
    number.textContent = `${progress}%`;
    if (progress >= 93) {
      clearInterval(timer);
      setTimeout(() => { stuck.hidden = false; }, 500);
    }
  }, 120);
}

function finishProtocol() {
  const bar = document.getElementById("progressBar");
  const number = document.getElementById("progressNumber");
  const loadingText = document.getElementById("loadingText");
  bar.style.width = "100%";
  number.textContent = "100%";
  loadingText.textContent = "BIRTHDAY LOCATED!";
  document.getElementById("stuckArea").hidden = true;
  setTimeout(startWakeGame, 650);
}

function startWakeGame() {
  wakeCount = 0;
  const irenne = document.getElementById("sleepyIrenne");
  irenne.classList.remove("is-awake", "is-poked");
  irenne.disabled = false;
  document.getElementById("wakeInstruction").textContent = "Tap her 6 times before she misses the cake.";
  document.getElementById("wakeDialogue").textContent = "five more minutes...";
  document.querySelectorAll(".wake-progress span").forEach((dot) => dot.classList.remove("is-filled"));
  goTo("wake");
}

function wakeIrenne() {
  const irenne = document.getElementById("sleepyIrenne");
  if (irenne.disabled) return;
  const reactions = ["mmmh...", "five more minutes...", "who is tapping me", "HEY", "I'M AWAKE—", "WAIT, THERE'S CAKE?!"];
  wakeCount++;
  document.querySelectorAll(".wake-progress span").forEach((dot, index) => dot.classList.toggle("is-filled", index < wakeCount));
  document.getElementById("wakeDialogue").textContent = reactions[Math.min(wakeCount - 1, reactions.length - 1)];
  irenne.classList.remove("is-poked");
  void irenne.offsetWidth;
  irenne.classList.add("is-poked");
  if (wakeCount >= 6) {
    irenne.disabled = true;
    irenne.classList.add("is-awake");
    document.getElementById("wakeInstruction").textContent = "Birthday girl successfully activated ✓";
    setTimeout(() => { goTo("reveal"); burstConfetti(); }, 1100);
  }
}

function burstConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const colors = ["#ffe17a", "#bcebdc", "#ffffff", "#b8dff2", "#ff6f9f", "#d7c8f4"];
  const bits = Array.from({length: 100}, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .42,
    vx: (Math.random() - .5) * 13, vy: -5 - Math.random() * 11,
    r: 3 + Math.random() * 5, color: colors[Math.floor(Math.random() * colors.length)], spin: Math.random() * 6
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bits.forEach((bit) => {
      bit.x += bit.vx; bit.y += bit.vy; bit.vy += .28; bit.spin += .16;
      ctx.save(); ctx.translate(bit.x, bit.y); ctx.rotate(bit.spin);
      ctx.fillStyle = bit.color; ctx.fillRect(-bit.r, -bit.r / 2, bit.r * 2, bit.r);
      ctx.restore();
    });
    if (++frame < 180) requestAnimationFrame(draw); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
}

class TinySoundtrack {
  constructor() { this.context = null; this.master = null; this.timer = null; this.step = 0; }
  start() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.context.createGain(); this.master.gain.value = .055; this.master.connect(this.context.destination);
    }
    this.context.resume();
    if (this.timer) return;
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 392];
    const play = () => {
      const osc = this.context.createOscillator(); const gain = this.context.createGain();
      osc.type = "sine"; osc.frequency.value = notes[this.step++ % notes.length];
      gain.gain.setValueAtTime(0, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(1, this.context.currentTime + .025);
      gain.gain.exponentialRampToValueAtTime(.001, this.context.currentTime + .55);
      osc.connect(gain); gain.connect(this.master); osc.start(); osc.stop(this.context.currentTime + .58);
    };
    play(); this.timer = setInterval(play, 430);
  }
  stop() { clearInterval(this.timer); this.timer = null; }
}

function toggleAudio(forceOn = null) {
  const button = document.getElementById("audioToggle");
  const turnOn = forceOn === null ? button.getAttribute("aria-pressed") !== "true" : forceOn;
  try {
    if (turnOn && !(window.AudioContext || window.webkitAudioContext)) throw new Error("Web Audio is unavailable");
    audioEngine ||= new TinySoundtrack();
    if (turnOn) audioEngine.start(); else audioEngine.stop();
    button.setAttribute("aria-pressed", String(turnOn));
    button.setAttribute("aria-label", turnOn ? "Turn music off" : "Turn music on");
    button.querySelector(".audio-label").textContent = turnOn ? "sound on" : "sound off";
  } catch (error) {
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Sound unavailable");
    button.querySelector(".audio-label").textContent = "sound unavailable";
    console.warn("Sound could not start; continuing silently:", error);
  }
}

function annoyMascot() {
  const reactions = {
    1: "hey.",
    2: "stop.",
    3: "Irenne.",
    4: "I'M SERIOUS.",
    5: "(╬ •̀皿•́)",
    10: "WHY ARE YOU LIKE THIS",
    20: "Achievement unlocked:\n✨ Professional Annoyance ✨"
  };
  annoyCount++;
  const reaction = document.getElementById("annoyReaction");
  if (reactions[annoyCount]) reaction.textContent = reactions[annoyCount];
  reaction.classList.toggle("is-achievement", annoyCount >= 20);
  const mascot = document.getElementById("finalMascot");
  mascot.dataset.expression = annoyCount >= 4 ? "serious" : "shock";
  mascot.parentElement.classList.remove("shake"); void mascot.offsetWidth; mascot.parentElement.classList.add("shake");
  if (annoyCount === 20) burstConfetti();
}

const actions = {
  begin: () => {
    // Advance first so audio restrictions can never block the experience.
    goTo("scan");
    toggleAudio(true);
  },
  "scan-complete": () => goTo("warning"),
  protocol: startProtocol,
  unstick: finishProtocol,
  "wake-irenne": wakeIrenne,
  patches: () => goTo("patches"),
  letter: () => goTo("letter"),
  "open-letter": () => goTo("message"),
  feelings: () => goTo("feelings"),
  finale: () => goTo("finale"),
  annoy: annoyMascot,
  restart: () => {
    annoyCount = 0;
    document.getElementById("annoyReaction").textContent = "";
    document.getElementById("annoyReaction").classList.remove("is-achievement");
    document.getElementById("finalMascot").dataset.expression = "happy";
    goTo("discovery");
  }
};

app.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action]");
  if (trigger && actions[trigger.dataset.action]) actions[trigger.dataset.action]();
});
document.getElementById("audioToggle").addEventListener("click", () => toggleAudio());

fillContent();
if (location.hash && scenes.some((scene) => `#${scene.dataset.scene}` === location.hash)) goTo(location.hash.slice(1));
