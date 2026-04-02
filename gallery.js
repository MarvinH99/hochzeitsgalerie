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
// 🔹 Lightbox öffnen
// Lightbox öffnen
function openLightbox(index) {
  history.pushState({ lightbox: true }, "");

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

  let currentScale = 1;
  let translateX = 0;
  let translateY = 0;

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
  element.style.transformOrigin = "0 0"; // wichtig für Maus-Zoom
  element.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
  element.style.cursor = "default";

  lightbox.appendChild(element);

  // Positionsanzeige
  const counter = document.createElement("div");
  counter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  counter.style.position = "absolute";
  counter.style.bottom = "20px";
  counter.style.right = "25px";
  counter.style.color = "white";
  counter.style.backgroundColor = "rgba(0,0,0,0.5)";
  counter.style.padding = "6px 12px";
  counter.style.borderRadius = "20px";
  counter.style.fontSize = "14px";
  lightbox.appendChild(counter);

  // 🔹 Mausrad-Zoom für Desktop (wird jedes Mal aufs neue Bild gesetzt)
  element.addEventListener("wheel", e => {
    e.preventDefault();
    const rect = element.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const oldScale = currentScale;

    currentScale += e.deltaY < 0 ? 0.1 : -0.1;
    currentScale = Math.min(Math.max(currentScale, 1), 5);

    translateX -= (offsetX / oldScale) * (currentScale - oldScale);
    translateY -= (offsetY / oldScale) * (currentScale - oldScale);

    element.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
  });
}

  showCurrent();

  const element = lightbox.querySelector("img, video");

  // Maus-Zoom unter Cursor
  element.addEventListener("wheel", e => {
    e.preventDefault();
    const rect = element.getBoundingClientRect();

    // Mausposition relativ zum Bild
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Alte Scale merken
    const oldScale = currentScale;

    // Scale ändern
    currentScale += e.deltaY < 0 ? 0.1 : -0.1;
    currentScale = Math.min(Math.max(currentScale, 1), 5);

    // Translate so anpassen, dass der Punkt unter dem Cursor fix bleibt
    translateX -= (offsetX / oldScale) * (currentScale - oldScale);
    translateY -= (offsetY / oldScale) * (currentScale - oldScale);

    element.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
  });

  // Touch für Mobile: Swipe + Pinch
  let touchStartX = 0;
  let touchStartY = 0;
  let startTouchesDist = 0;

  lightbox.addEventListener("touchstart", e => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      startTouchesDist = Math.hypot(dx, dy);
    }
  });

  lightbox.addEventListener("touchmove", e => {
    if (e.touches.length === 1 && currentScale === 1) {
      // Swipe für Navigation
      const endX = e.touches[0].clientX;
      if (endX - touchStartX > 50) prevItem();
      if (touchStartX - endX > 50) nextItem();
    } else if (e.touches.length === 2) {
      // Pinch Zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scaleChange = dist / startTouchesDist;
      currentScale = Math.min(Math.max(scaleChange, 1), 5);
      element.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
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

  // Klicken schließt Lightbox
  lightbox.addEventListener("click", () => {
    document.body.removeChild(lightbox);
    history.back();
  });

  function prevItem() { 
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; 
    currentScale = 1; translateX = 0; translateY = 0;
    showCurrent(); 
  }
  function nextItem() { 
    currentIndex = (currentIndex + 1) % galleryItems.length; 
    currentScale = 1; translateX = 0; translateY = 0;
    showCurrent(); 
  }

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
        

        let element;

        // 🖼️ Bilder
        if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
            element = document.createElement("img");
            element.src = url;
            element.style.objectFit = "cover";
            element.style.borderRadius = "10px";
            element.style.display = "block";
            element.loading = "lazy";

            galleryItems.push({ type: "image", url });
            element.addEventListener("click", () => openLightbox(galleryItems.findIndex(i => i.url === url)));
        }
        // 🎥 Videos
        else if (ext === "mp4") {
            element = document.createElement("video");
            element.src = url;
            element.controls = true;
            element.style.objectFit = "cover";
            element.style.borderRadius = "10px";
            element.style.display = "block";

            galleryItems.push({ type: "video", url });
            element.addEventListener("click", () => openLightbox(galleryItems.findIndex(i => i.url === url)));
        }

        if (element) {
            wrapper.appendChild(element);
            gallery.appendChild(wrapper);
        }
    });
}

// Popstate für Lightbox schließen
window.addEventListener("popstate", function () {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        document.body.removeChild(lightbox);
    }
});

loadGallery();