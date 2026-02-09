<<<<<<< HEAD
const CORRECT_PASSWORD = "123"; // Passwort kann hier geändert werden

function checkPassword() {
  const input = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (input === CORRECT_PASSWORD) {
    sessionStorage.setItem("authorized", "true");
    window.location.href = "upload.html";
  } else {
    error.textContent = "Falsches Passwort 😕";
  }
}
=======
const CORRECT_PASSWORD = "123"; // Passwort kann hier geändert werden

function checkPassword() {
  const input = document.getElementById("password").value;
  const error = document.getElementById("error");

  if (input === CORRECT_PASSWORD) {
    sessionStorage.setItem("authorized", "true");
    window.location.href = "upload.html";
  } else {
    error.textContent = "Falsches Passwort 😕";
  }
}
>>>>>>> 1a61a6e (Erste Version der Hochzeitsgalerie mit Design und Bildern)
