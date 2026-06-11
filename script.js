const birthday = {
  brotherName: "RISHAV KUMAR",
  birthDate: "2002-06-13",
  dateLabel: "13 June 2002",
  sender: "SHEKHAR"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const particleColors = ["#c9a66b", "#f2d39a", "#8f6d3e", "#eee6d8"];
const partySymbols = ["\u2605", "\u2726", "\u2666", "\u2661", "\ud83c\udf81", "\ud83c\udf82"];

function createAmbientParticles() {
  const field = $("#partyParticles");
  const particleCount = window.innerWidth < 700 ? 18 : 34;
  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("i");
    const roll = Math.random();
    const type = roll < .28 ? "balloon" : roll < .74 ? "confetti" : "symbol";
    particle.className = `party-particle ${type}`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--size", `${type === "balloon" ? 25 + Math.random() * 35 : 10 + Math.random() * 10}px`);
    particle.style.setProperty("--duration", `${13 + Math.random() * 16}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 28}s`);
    particle.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    particle.style.setProperty("--drift-back", `${-30 + Math.random() * 60}px`);
    particle.style.setProperty("--rotate", `${-15 + Math.random() * 30}deg`);
    particle.style.setProperty("--opacity", `${.16 + Math.random() * .25}`);
    particle.style.setProperty("--particle-color", particleColors[index % particleColors.length]);
    if (type === "symbol") particle.textContent = partySymbols[index % partySymbols.length];
    field.appendChild(particle);
  }
}

function launchCelebration(amount = 70) {
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("i");
    const angle = Math.random() * Math.PI * 2;
    const distance = 180 + Math.random() * 440;
    piece.className = "celebration-piece";
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    piece.style.setProperty("--spin", `${-900 + Math.random() * 1800}deg`);
    piece.style.setProperty("--particle-color", particleColors[index % particleColors.length]);
    piece.style.animationDelay = `${Math.random() * .25}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2300);
  }
}

createAmbientParticles();

$("#brotherName").textContent = `${birthday.brotherName}.`;
$("#letterName").textContent = birthday.brotherName;
$(".signature strong").textContent = birthday.sender;
$(".nav p").textContent = `${birthday.dateLabel} · A birthday story`;
$("#footerYear").textContent = new Date().getFullYear();

const fallbackPhoto = "assets/cinematic-birthday-hero.png";
$$(".hero-image, .gallery-item img").forEach((image) => {
  image.addEventListener("error", () => {
    if (!image.src.endsWith("cinematic-birthday-hero.png")) image.src = fallbackPhoto;
  });
});

const galleryPhotos = [...$$(".gallery-item")];
const lightbox = $("#lightbox");
let activePhoto = 0;

function showPhoto(index) {
  activePhoto = (index + galleryPhotos.length) % galleryPhotos.length;
  const item = galleryPhotos[activePhoto];
  const image = item.querySelector("img");
  $("#lightboxImage").src = image.src;
  $("#lightboxImage").alt = image.alt;
  $("#lightboxCaption").textContent = item.querySelector("figcaption").textContent.trim();
}

galleryPhotos.forEach((item, index) => {
  item.addEventListener("click", () => {
    showPhoto(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightboxPrevious").addEventListener("click", () => showPhoto(activePhoto - 1));
$("#lightboxNext").addEventListener("click", () => showPhoto(activePhoto + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});

document.body.classList.add("locked");

$("#enterBtn").addEventListener("click", () => {
  $("#intro").classList.add("is-gone");
  $("#experience").classList.remove("is-hidden");
  document.body.classList.remove("locked");
  launchCelebration(46);
  setTimeout(() => {
    $$(".hero .reveal").forEach((el, index) => {
      setTimeout(() => el.classList.add("visible"), index * 220);
    });
  }, 350);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

$$(".reveal:not(.hero .reveal)").forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.8 });

$$("[data-count]").forEach((el) => countObserver.observe(el));

document.addEventListener("pointermove", (event) => {
  $(".cursor-glow").style.left = `${event.clientX}px`;
  $(".cursor-glow").style.top = `${event.clientY}px`;
});

const audio = $("#ambientAudio");
const soundButton = $("#soundToggle");
soundButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      audio.volume = 0.22;
      await audio.play();
      soundButton.classList.add("playing");
      $(".sound-label").textContent = "Sound on";
    } catch {
      $(".sound-label").textContent = "Sound unavailable";
    }
  } else {
    audio.pause();
    soundButton.classList.remove("playing");
    $(".sound-label").textContent = "Sound off";
  }
});

$("#wishBtn").addEventListener("click", () => {
  const flame = $("#flame");
  if (flame.classList.contains("out")) return;
  flame.classList.add("out");
  $("#wishResult").classList.add("visible");
  $("#wishBtn").textContent = "Wish made";
  launchCelebration(100);

  const scene = $("#candleScene");
  for (let i = 0; i < 36; i += 1) {
    const spark = document.createElement("i");
    spark.className = "spark";
    spark.style.left = "108px";
    spark.style.top = "74px";
    spark.style.setProperty("--x", `${(Math.random() - .5) * 360}px`);
    spark.style.setProperty("--y", `${(Math.random() - .65) * 260}px`);
    spark.style.animationDelay = `${Math.random() * .25}s`;
    scene.appendChild(spark);
    setTimeout(() => spark.remove(), 1800);
  }
});
