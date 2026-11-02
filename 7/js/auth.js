import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const inPages = location.pathname.includes("/pages/");
const loginUrl = inPages ? "login.html" : "pages/login.html";
const homeUrl = inPages ? "../index.html" : "index.html";

// called by login protected pages
export function requireAuth() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) resolve(user);
      else location.replace(loginUrl);
    });
  });
}

// change nav link text for signed in user
const loginLink = document.querySelector('nav a[href$="login.html"]');
const loginHtml = loginLink ? loginLink.innerHTML : "";

onAuthStateChanged(auth, (user) => {
  if (!loginLink) return;
  if (user) {
    loginLink.innerHTML = "Log<br>Out";
    loginLink.onclick = async (e) => {
      e.preventDefault();
      await signOut(auth);
      location.href = homeUrl;
    };
  } else {
    loginLink.innerHTML = loginHtml;
    loginLink.onclick = null;
  }
});
