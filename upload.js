// 🔑 Supabase Daten
const SUPABASE_URL = "https://ajznsupimlikezxsghjp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqem5zdXBpbWxpa2V6eHNnaGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDUyODUsImV4cCI6MjA4NTk4MTI4NX0.yZyWSUxIYOwIVo1ZwdBVqAUewSw-NLZS4l6_C0I6CHo";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔒 Passwort-Schutz prüfen
if (sessionStorage.getItem("authorized") !== "true") {
  window.location.href = "index.html";
}

function goBack() {
  window.location.href = "index.html";
}

// 📐 Bild per Canvas verkleinern & komprimieren (spart Storage + Bandbreite auf dem Free-Plan)
function resizeImage(file, maxDimension, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob fehlgeschlagen"));
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Bild konnte nicht geladen werden"));
    };

    img.src = objectUrl;
  });
}

// Ein Jahr Cache, da Dateinamen einmalig (Timestamp-Präfix) und Inhalte unveränderlich sind
const CACHE_CONTROL = "31536000";

// Upload-Funktion
async function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (files.length === 0) {
    status.textContent = "Bitte mindestens eine Datei auswählen.";
    return;
  }

  let current = 0;
  const total = files.length;

  for (let file of files) {
    current++;
    status.textContent = `Upload läuft... ⏳ (${current}/${total})`;

    const isImage = file.type.startsWith("image/") &&
      ["jpg", "jpeg", "png", "gif"].includes(file.name.split(".").pop().toLowerCase());
    const fileName = `${Date.now()}_${file.name}`;

    if (isImage && file.type !== "image/gif") {
      // Bild verkleinern (max. 1920px, Qualität 85%) statt Original 1:1 hochzuladen
      let webBlob;
      try {
        webBlob = await resizeImage(file, 1920, 0.85);
      } catch (e) {
        console.error("Komprimierung fehlgeschlagen, lade Original hoch:", e);
        webBlob = file;
      }

      const { error: mainError } = await supabaseClient
        .storage
        .from("uploads")
        .upload(fileName, webBlob, { cacheControl: CACHE_CONTROL, contentType: "image/jpeg" });

      if (mainError) {
        console.error(mainError);
        status.textContent = "Fehler beim Upload 😕";
        return;
      }

      // Zusätzlich ein kleines Thumbnail fürs Galerie-Grid erzeugen
      try {
        const thumbBlob = await resizeImage(file, 400, 0.6);
        const { error: thumbError } = await supabaseClient
          .storage
          .from("uploads")
          .upload(`thumb_${fileName}`, thumbBlob, { cacheControl: CACHE_CONTROL, contentType: "image/jpeg" });

        if (thumbError) console.error("Thumbnail-Upload fehlgeschlagen:", thumbError);
      } catch (e) {
        console.error("Thumbnail-Erstellung fehlgeschlagen:", e);
      }
    } else {
      // Videos (und GIFs) unverändert hochladen
      const { error } = await supabaseClient
        .storage
        .from("uploads")
        .upload(fileName, file, { cacheControl: CACHE_CONTROL });

      if (error) {
        console.error(error);
        status.textContent = "Fehler beim Upload 😕";
        return;
      }
    }
  }

  status.textContent = "Upload erfolgreich 🎉 Danke!";
}
