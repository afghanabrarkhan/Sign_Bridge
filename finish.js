// SignBridge finishing touches. Loaded after app.js and only adds to it.
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Emoji memory aids (NOT signs): one picture word per letter
  const ABC = {
    A: ["🍎", "Apple"], B: ["🍌", "Banana"], C: ["🐱", "Cat"], D: ["🐶", "Dog"], E: ["🐘", "Elephant"],
    F: ["🐟", "Fish"], G: ["🍇", "Grapes"], H: ["🏠", "House"], I: ["🍦", "Ice cream"], J: ["🧃", "Juice"],
    K: ["🪁", "Kite"], L: ["🦁", "Lion"], M: ["🥭", "Mango"], N: ["📰", "Newspaper"], O: ["🍊", "Orange"],
    P: ["🦜", "Parrot"], Q: ["👑", "Queen"], R: ["🌈", "Rainbow"], S: ["☀️", "Sun"], T: ["🌳", "Tree"],
    U: ["☂️", "Umbrella"], V: ["🎻", "Violin"], W: ["🍉", "Watermelon"], X: ["❌", "X mark"], Y: ["🟡", "Yellow"],
    Z: ["🦓", "Zebra"]
  };

  // More words for Communicate mode (extends the sampleSigns object from app.js)
  const MORE = {
    goodbye: ["👋", "Greetings"], please: ["🙏", "Greetings"], sorry: ["😔", "Greetings"],
    yes: ["👍", "Greetings"], no: ["👎", "Greetings"], love: ["❤️", "Feelings"],
    happy: ["😊", "Feelings"], sad: ["😢", "Feelings"], angry: ["😠", "Feelings"], tired: ["😴", "Feelings"],
    hungry: ["🍽️", "Everyday words"], eat: ["🍴", "Everyday words"], drink: ["🥤", "Everyday words"],
    home: ["🏠", "Everyday words"], school: ["🏫", "Everyday words"], bus: ["🚌", "Everyday words"],
    father: ["👨", "People & family"], friend: ["🤝", "People & family"], baby: ["👶", "People & family"],
    doctor: ["🧑‍⚕️", "Healthcare"], hospital: ["🏥", "Healthcare"], medicine: ["💊", "Healthcare"], emergency: ["🚨", "Healthcare"],
    three: ["3️⃣", "Numbers"], four: ["4️⃣", "Numbers"], five: ["5️⃣", "Numbers"], six: ["6️⃣", "Numbers"],
    seven: ["7️⃣", "Numbers"], eight: ["8️⃣", "Numbers"], nine: ["9️⃣", "Numbers"], ten: ["🔟", "Numbers"]
  };
  if (typeof sampleSigns !== "undefined") {
    Object.entries(MORE).forEach(([w, [emoji, category]]) => { if (!sampleSigns[w]) sampleSigns[w] = { emoji, category }; });
    if (typeof showSigns === "function") showSigns();
  }

  function say(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    speechSynthesis.speak(u);
  }

  // Alphabet strip and everyday word cards, placed below the A-Z chart
  const details = $("alphabetDetails"), search = $("alphabetSearch"), media = $("alphabetSignMedia");
  if (details && search && media) {
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<h3 class="sb-sub">Picture words for every letter</h3>' +
      '<p class="sb-hint">Emoji memory aids to help you remember each letter. They are not signs.</p>' +
      '<div class="sb-abc" id="sbAbc"></div>' +
      '<h3 class="sb-sub">Everyday words with emojis</h3>' +
      '<p class="sb-hint">Tap a word to try it in Communicate mode.</p>' +
      '<div class="sb-words" id="sbWords"></div>';
    details.insertAdjacentElement("afterend", wrap);

    Object.entries(ABC).forEach(([l, [e, w]]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "sb-chip";
      b.setAttribute("aria-label", `Letter ${l}, ${w}`);
      b.innerHTML = `<span class="sb-l">${l}</span><span class="sb-e">${e}</span><small>${w}</small>`;
      b.addEventListener("click", () => {
        search.value = l;
        search.dispatchEvent(new Event("input", { bubbles: true }));
        details.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
      });
      $("sbAbc").appendChild(b);
    });

    const wordList = typeof sampleSigns !== "undefined" ? Object.keys(sampleSigns).filter((w) => !["hi", "thanks", "thankyou", "mom"].includes(w)) : [];
    wordList.forEach((w) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "sb-chip";
      b.innerHTML = `<span class="sb-e">${sampleSigns[w].emoji}</span><small>${w}</small>`;
      b.addEventListener("click", () => {
        $("messageInput").value = w;
        if (typeof showSigns === "function") showSigns();
        $("communicate").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      });
      $("sbWords").appendChild(b);
    });

    // When a letter is chosen, show its emoji aid. app.js sets #selectedLetter to "Letter X".
    const heading = $("selectedLetter");
    new MutationObserver(() => {
      const l = (heading.textContent.match(/Letter ([A-Z])/) || [])[1];
      if (!l || !ABC[l]) return;
      const [e, w] = ABC[l];
      const aid = document.createElement("div");
      aid.className = "sb-aid";
      aid.innerHTML = `<div class="sb-big" aria-hidden="true">${e}</div><strong>${l} is for ${w}</strong>`;
      const btn = document.createElement("button");
      btn.type = "button"; btn.textContent = "🔊 Say it";
      btn.addEventListener("click", () => say(`${l} for ${w}`));
      const img = new Image();
      img.alt = `Fingerspelling reference for ${l}`;
      img.onload = () => aid.prepend(img); // shows only if you add assets/isl/<LETTER>.png
      img.src = `assets/isl/${l}.png`;
      const note = document.createElement("p");
      note.className = "sb-note";
      note.textContent = "The emoji is a memory aid, not a sign. Confirm the handshape with the ISL resources below.";
      aid.append(btn, note);
      media.appendChild(aid);
    }).observe(heading, { childList: true });
  }

  // Emoji on vocabulary cards
  const vGrid = $("vocabularyGrid");
  function decorateVocab() {
    if (!vGrid || typeof sampleSigns === "undefined") return;
    vGrid.querySelectorAll(".vocabulary-card h3").forEach((h) => {
      if (h.dataset.sb) return;
      const hit = sampleSigns[h.textContent.toLowerCase().replace(/[^a-z]/g, "")];
      h.dataset.sb = "1";
      if (hit) h.insertAdjacentHTML("afterbegin", `<span class="sb-emoji" aria-hidden="true">${hit.emoji}</span>`);
    });
  }
  if (vGrid) { new MutationObserver(decorateVocab).observe(vGrid, { childList: true }); decorateVocab(); }

  // Reveal on scroll
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("sb-in"); io.unobserve(en.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll(".section, .bottom-banner, .isl-resources").forEach((el) => { el.classList.add("sb-reveal"); io.observe(el); });
  }

  // Back to top
  const top = document.createElement("button");
  top.type = "button"; top.className = "sb-top"; top.textContent = "↑"; top.setAttribute("aria-label", "Back to top");
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.body.appendChild(top);
  window.addEventListener("scroll", () => top.classList.toggle("sb-show", window.scrollY > 600), { passive: true });

  // Celebrate a perfect quiz score
  const result = $("quizResult");
  if (result) new MutationObserver(() => {
    if (result.hidden || !/100%/.test(result.textContent) || reduce) return;
    for (let i = 0; i < 26; i++) {
      const c = document.createElement("span");
      c.className = "sb-confetti"; c.textContent = ["🎉", "⭐", "🤟", "👏"][i % 4];
      c.style.left = Math.random() * 100 + "vw"; c.style.animationDelay = Math.random() * 0.8 + "s";
      document.body.appendChild(c); setTimeout(() => c.remove(), 3500);
    }
  }).observe(result, { attributes: true, childList: true, characterData: true, subtree: true });
})();
