<<<<<<< HEAD
const SUPABASE_URL = "https://ajznsupimlikezxsghjp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem5zdXBpbWxpa2V6eHNnaGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDUyODUsImV4cCI6MjA4NTk4MTI4NX0.yZyWSUxIYOwIVo1ZwdBVqAUewSw-NLZS4l6_C0I6CHo";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 🔐 Zugriffsschutz
if (sessionStorage.getItem("authorized") !== "true") {
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "index.html";
}


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

  data.forEach(file => {
    if (!file.name || file.name.endsWith("/")) return;

    const ext = file.name.split(".").pop().toLowerCase();

    const url = supabaseClient
      .storage
      .from("uploads")
      .getPublicUrl(file.name).data.publicUrl;

    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.margin = "10px";
    wrapper.style.textAlign = "center";

    let element;

    // 🖼️ Bilder
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      element = document.createElement("img");
      element.src = url;
      element.style.width = "100px";
      element.style.display = "block";
      element.loading = "lazy";
    }

    // 🎥 Videos
    if (ext === "mp4") {
      element = document.createElement("video");
      element.src = url;
      element.controls = true;
      element.style.width = "100px";
      element.style.display = "block";
    }

    if (element) {
      wrapper.appendChild(element);

      // ⬇️ Download-Button (für Bilder & Videos)
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
=======
const SUPABASE_URL = "https://ajznsupimlikezxsghjp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem5zdXBpbWxpa2V6eHNnaGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDUyODUsImV4cCI6MjA4NTk4MTI4NX0.yZyWSUxIYOwIVo1ZwdBVqAUewSw-NLZS4l6_C0I6CHo";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 🔐 Zugriffsschutz
if (sessionStorage.getItem("authorized") !== "true") {
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "index.html";
}


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

  data.forEach(file => {
    if (!file.name || file.name.endsWith("/")) return;

    const ext = file.name.split(".").pop().toLowerCase();

    const url = supabaseClient
      .storage
      .from("uploads")
      .getPublicUrl(file.name).data.publicUrl;

    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.margin = "10px";
    wrapper.style.textAlign = "center";

    let element;

    // 🖼️ Bilder
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      element = document.createElement("img");
      element.src = url;
      element.style.width = "100px";
      element.style.display = "block";
      element.loading = "lazy";
    }

    // 🎥 Videos
    if (ext === "mp4") {
      element = document.createElement("video");
      element.src = url;
      element.controls = true;
      element.style.width = "100px";
      element.style.display = "block";
    }

    if (element) {
      wrapper.appendChild(element);

      // ⬇️ Download-Button (für Bilder & Videos)
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
>>>>>>> 1a61a6e (Erste Version der Hochzeitsgalerie mit Design und Bildern)
