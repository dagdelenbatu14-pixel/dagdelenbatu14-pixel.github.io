// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Sticky header shadow
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// Contact form (progressive enhancement over Formspree)
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
if (form) {
  form.addEventListener("submit", async (e) => {
    const action = form.getAttribute("action") || "";
    // If Formspree endpoint not configured, fall back to default submit.
    if (action.includes("your-form-id")) return;

    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Gönderiliyor...";
    status.textContent = "";
    status.className = "form-status";

    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        status.textContent = "Mesajınız alındı. En kısa sürede dönüş yapacağım.";
        status.classList.add("ok");
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      status.textContent =
        "Bir hata oluştu. Lütfen e-posta veya WhatsApp üzerinden ulaşın.";
      status.classList.add("err");
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}
