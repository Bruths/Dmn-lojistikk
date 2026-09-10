document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  const form = document.getElementById("quote-form");
  const mobileMenu = document.querySelector(".mobile-menu");
  const galleryGrid = document.querySelector(".gallery-grid");
  const galleryFilters = document.querySelectorAll("[data-gallery-filter]");
  const galleryItems = document.querySelectorAll("[data-gallery-item]");
  const galleryDialog = document.getElementById("gallery-dialog");
  const galleryDialogImage = galleryDialog?.querySelector("img");
  const galleryDialogTitle = galleryDialog?.querySelector("h2");
  const galleryDialogClose = galleryDialog?.querySelector(".gallery-dialog-close");
  const videoCards = document.querySelectorAll(".video-card");

  if (year) year.textContent = String(new Date().getFullYear());

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.removeAttribute("open"));
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      "Merhaba DMN Lojistik, fiyat teklifi almak istiyorum.",
      `Ad Soyad: ${data.get("name") || "-"}`,
      `Telefon: ${data.get("phone") || "-"}`,
      `Hizmet: ${data.get("service") || "-"}`,
      `Nereden: ${data.get("from") || "-"}`,
      `Nereye: ${data.get("to") || "-"}`,
      `Planlanan tarih: ${data.get("date") || "-"}`,
      `Not: ${data.get("note") || "-"}`,
    ].join("\n");

    window.open(
      `https://wa.me/905348494401?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  });

  galleryFilters.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));

    button.addEventListener("click", () => {
      const filter = button.dataset.galleryFilter;

      galleryFilters.forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.classList.toggle("is-active", isSelected);
        filterButton.setAttribute("aria-pressed", String(isSelected));
      });

      galleryGrid?.classList.toggle("is-filtered", filter !== "all");
      galleryItems.forEach((item) => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
    });
  });

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!(galleryDialog instanceof HTMLDialogElement)) return;

      if (galleryDialogImage) {
        galleryDialogImage.src = item.dataset.image || "";
        galleryDialogImage.alt = item.querySelector("img")?.alt || "";
      }

      if (galleryDialogTitle) {
        galleryDialogTitle.textContent = item.dataset.title || "Operasyon görseli";
      }

      galleryDialog.showModal();
    });
  });

  galleryDialogClose?.addEventListener("click", () => galleryDialog?.close());
  galleryDialog?.addEventListener("click", (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });

  videoCards.forEach((card) => {
    const video = card.querySelector("video");
    const playButton = card.querySelector("[data-video-play]");
    const durationLabel = card.querySelector("[data-video-duration]");

    if (!video) return;

    playButton?.addEventListener("click", () => {
      video.play().catch(() => undefined);
    });

    video.addEventListener("loadedmetadata", () => {
      if (!durationLabel || !Number.isFinite(video.duration)) return;
      const minutes = Math.floor(video.duration / 60);
      const seconds = Math.floor(video.duration % 60);
      durationLabel.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    });

    video.addEventListener("play", () => {
      videoCards.forEach((otherCard) => {
        const otherVideo = otherCard.querySelector("video");
        if (otherVideo && otherVideo !== video) otherVideo.pause();
      });
      card.classList.add("is-playing");
    });

    const showPlayButton = () => card.classList.remove("is-playing");
    video.addEventListener("pause", showPlayButton);
    video.addEventListener("ended", showPlayButton);
  });
});
