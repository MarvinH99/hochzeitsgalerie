<<<<<<< HEAD
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


// Upload-Funktion
async function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (files.length === 0) {
    status.textContent = "Bitte mindestens eine Datei auswählen.";
    return;
  }

  status.textContent = "Upload läuft... ⏳";

  for (let file of files) {
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabaseClient
      .storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      status.textContent = "Fehler beim Upload 😕";
      return;
    }
  }

  status.textContent = "Upload erfolgreich 🎉 Danke!";
}
=======
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


// Upload-Funktion
async function uploadFiles() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (files.length === 0) {
    status.textContent = "Bitte mindestens eine Datei auswählen.";
    return;
  }

  status.textContent = "Upload läuft... ⏳";

  for (let file of files) {
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabaseClient
      .storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      status.textContent = "Fehler beim Upload 😕";
      return;
    }
  }

  status.textContent = "Upload erfolgreich 🎉 Danke!";
}
>>>>>>> 1a61a6e (Erste Version der Hochzeitsgalerie mit Design und Bildern)
