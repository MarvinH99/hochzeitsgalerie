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

// 🔹 Lightbox Variablen
let galleryItems = [];
let currentIndex = 0;

// Lightbox öffnen
function openLightbox(index) {
  currentIndex = index;

  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.style.position = "fixed";
  lightbox.style.top = 0;
  lightbox.style.left = 0;
  lightbox.style.width = "100%";
  lightbox.style.height = "100%";
  lightbox.style.backgroundColor = "rgba(0,0,0,0.9)";
  lightbox.style.display = "flex";
  lightbox.style.alignItems = "center";
  lightbox.style.justifyContent = "center";
  lightbox.style.zIndex = 1000;
  lightbox.style.overflow = "hidden";

  function showCurrent() {
    lightbox.innerHTML = ""; // vorherigen Inhalt entfernen
    const item = galleryItems[currentIndex];
    let element;

    if (item.type === "image") {
      element = document.createElement("img");
      element.src = item.url;
    } else if (item.type === "video") {
      element = document.createElement("video");
      element.src = item.url;
      element.controls = true;
      element.autoplay = true;
    }

    element.style.maxWidth = "90%";
    element.style.maxHeight = "90%";
    element.style.borderRadius = "12px";
    lightbox.appendChild(element);
  }

  showCurrent();

  // Klicken schließt Lightbox
  lightbox.addEventListener("click", () => {
    document.body.removeChild(lightbox);
  });

  // Swipe für Mobilgeräte
  let startX = 0;
  lightbox.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
  lightbox.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prevItem();
    if (startX - endX > 50) nextItem();
  });

  // Pfeiltasten + Escape für Desktop
  document.addEventListener("keydown", function handler(e) {
    if (!document.getElementById("lightbox")) return;
    if (e.key === "ArrowLeft") prevItem();
    if (e.key === "ArrowRight") nextItem();
    if (e.key === "Escape") {
      if (document.getElementById("lightbox")) document.body.removeChild(lightbox);
      document.removeEventListener("keydown", handler);
    }
  });

  function prevItem() { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; showCurrent(); }
  function nextItem() { currentIndex = (currentIndex + 1) % galleryItems.length; showCurrent(); }

  document.body.appendChild(lightbox);
}

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

  galleryItems = []; // reset

  data.forEach((file, index) => {
    if (!file.name || file.name.endsWith("/")) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const url = supabaseClient.storage.from("uploads").getPublicUrl(file.name).data.publicUrl;

    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.margin = "10px";
    wrapper.style.textAlign = "center";

    let element;

    // 🖼️ Bilder
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      element = document.createElement("img");
      element.src = url;
      element.style.width = "150px";
      element.style.display = "block";
      element.loading = "lazy";

      // für Lightbox speichern
      galleryItems.push({ type: "image", url });

      element.addEventListener("click", () => openLightbox(galleryItems.findIndex(i => i.url === url)));
    }

    // 🎥 Videos
    else if (ext === "mp4") {
      element = document.createElement("video");
      element.src = url;
      element.controls = true;
      element.style.width = "150px";
      element.style.display = "block";

      // für Lightbox speichern
      galleryItems.push({ type: "video", url });

      element.addEventListener("click", () => openLightbox(galleryItems.findIndex(i => i.url === url)));
    }

    if (element) {
      wrapper.appendChild(element);

      // ⬇️ Download-Button
      const downloadBtn = document.createElement("a");
      downloadBtn.href = url;
      downloadBtn.download = file.name;
      downloadBtn.textContent = "⬇️ Download";
      downloadBtn.style.display = "inline-block";
      downloadBtn.style.marginTop = "6px";

      wrapper.appendChild(downloadBtn);
      gallery.appendChild(wrapper);
    }
  });
}

loadGallery();
