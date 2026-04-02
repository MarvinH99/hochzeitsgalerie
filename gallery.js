const SUPABASE_URL = "https://ajznsupimlikezxsghjp.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem5zdXBpbWxpa2V6eHNnaGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDUyODUsImV4cCI6MjA4NTk4MTI4NX0.yZyWSUxIYOwIVo1ZwdBVqAUewSw-NLZS4l6_C0I6CHo"; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// 🔐 Zugriffsschutz
if (sessionStorage.getItem("authorized") !== "true") {
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "index.html";
}

// 🔹 Galerie State
let galleryItems = [];
let currentIndex = 0;

// 🔹 Lightbox State (GLOBAL für Back-Button etc.)
let currentScale = 1;
let translateX = 0;
let translateY = 0;
let isZoomed = false;

// 🔹 Transform Helper
function updateTransform(element) {
  element.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
}

// 🔹 Reset Zoom
function resetZoom(element) {
  currentScale = 1;
  translateX = 0;
  translateY = 0;
  isZoomed = false;
  updateTransform(element);
}

// 🔹 Lightbox öffnen
function openLightbox(index) {
  history.pushState({ lightbox: true }, "");

  currentIndex = index;

  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";

  Object.assign(lightbox.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    overflow: "hidden"
  });

  function showCurrent() {
    lightbox.innerHTML = "";

    const item = galleryItems[currentIndex];
    let element;

    if (item.type === "image") {
      element = document.createElement("img");
    } else {
      element = document.createElement("video");
      element.controls = true;
      element.autoplay = true;
    }

    element.src = item.url;

    Object.assign(element.style, {
      maxWidth: "90%",
      maxHeight: "90%",
      borderRadius: "12px",
      transformOrigin: "0 0",
      cursor: "default"
    });

    resetZoom(element);

    lightbox.appendChild(element);

    // 🔢 Counter
    const counter = document.createElement("div");
    counter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

    Object.assign(counter.style, {
      position: "absolute",
      bottom: "20px",
      right: "25px",
      color: "white",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px"
    });

    lightbox.appendChild(counter);

    // =========================
    // 🖱️ DESKTOP ZOOM
    // =========================
    element.addEventListener("wheel", (e) => {
      e.preventDefault();

      const rect = element.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const oldScale = currentScale;

      currentScale += e.deltaY < 0 ? 0.15 : -0.15;
      currentScale = Math.min(Math.max(currentScale, 1), 5);

      translateX -= (offsetX / oldScale) * (currentScale - oldScale);
      translateY -= (offsetY / oldScale) * (currentScale - oldScale);

      isZoomed = currentScale > 1;

      updateTransform(element);
    });

    // =========================
    // 📱 TOUCH SUPPORT
    // =========================
    let startX = 0;
    let startY = 0;
    let initialDistance = 0;
    let initialScale = 1;
    let isDragging = false;
    let swipeStartX = 0;
    let swipeStartY = 0;
    

    element.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        swipeStartX = startX;   
        swipeStartY = startY;
        isDragging = false;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;

        initialDistance = Math.hypot(dx, dy);
        initialScale = currentScale;
        isDragging = true;
      }
    });

    element.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;

        const distance = Math.hypot(dx, dy);

        currentScale = Math.min(Math.max(initialScale * (distance / initialDistance), 1), 5);
        isZoomed = currentScale > 1;

        updateTransform(element);
      } else if (e.touches.length === 1 && currentScale > 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        translateX += dx / currentScale;
        translateY += dy / currentScale;

        updateTransform(element);

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        isDragging = true;
      }
    });

    element.addEventListener("touchend", (e) => {
  if (!isDragging) {
    if (currentScale === 1) {
      // Swipe Detection
      const swipeEndX = e.changedTouches[0].clientX;
      const swipeEndY = e.changedTouches[0].clientY;

      const dx = swipeEndX - swipeStartX;
      const dy = swipeEndY - swipeStartY;

      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) prevItem(); // nach rechts swipen
        else nextItem();         // nach links swipen
        return;
      }
    }

    // Tap zum Schließen
    const media = lightbox.querySelector("img, video");
    if (isZoomed) resetZoom(media);
    else closeLightbox();
  }
  });
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) document.body.removeChild(lb);
    history.back();
  }

  function prevItem() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showCurrent();
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    showCurrent();
  }

  // 🔘 Navigation Keys
  document.addEventListener("keydown", function handler(e) {
    if (!document.getElementById("lightbox")) return;

    if (e.key === "ArrowLeft") prevItem();
    if (e.key === "ArrowRight") nextItem();

    if (e.key === "Escape") {
      closeLightbox();
      document.removeEventListener("keydown", handler);
    }
  });

  // 🖱️ Klick Verhalten
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      const media = lightbox.querySelector("img, video");

      if (isZoomed) {
        resetZoom(media);
      } else {
        closeLightbox();
      }
    }
  });

  document.body.appendChild(lightbox);
  showCurrent();
}

// 🔙 Back Button Verhalten
window.addEventListener("popstate", () => {
  const lightbox = document.getElementById("lightbox");

  if (lightbox) {
    const media = lightbox.querySelector("img, video");

    if (isZoomed && media) {
      resetZoom(media);

      // verhindert schließen
      history.pushState({ lightbox: true }, "");
    } else {
      document.body.removeChild(lightbox);
    }
  }
});

// 🔹 Galerie laden
async function loadGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const { data, error } = await supabaseClient
    .storage
    .from("uploads")
    .list("", { recursive: true });

  if (error) {
    gallery.textContent = "Fehler beim Laden 😕";
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    gallery.textContent = "Noch keine Fotos oder Videos hochgeladen!";
    return;
  }

  galleryItems = [];

  data.forEach((file) => {
    if (!file.name || file.name.endsWith("/")) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const url = supabaseClient.storage.from("uploads").getPublicUrl(file.name).data.publicUrl;

    const wrapper = document.createElement("div");

    Object.assign(wrapper.style, {
      display: "inline-block",
      margin: "10px",
      textAlign: "center"
    });

    let element;

    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      element = document.createElement("img");
      galleryItems.push({ type: "image", url });
    } else if (ext === "mp4") {
      element = document.createElement("video");
      element.controls = true;
      galleryItems.push({ type: "video", url });
    }

    if (element) {
      element.src = url;

      Object.assign(element.style, {
        objectFit: "cover",
        borderRadius: "10px",
        display: "block"
      });

      element.loading = "lazy";

      element.addEventListener("click", () =>
        openLightbox(galleryItems.findIndex(i => i.url === url))
      );

      wrapper.appendChild(element);
      gallery.appendChild(wrapper);
    }
  });
}

loadGallery();