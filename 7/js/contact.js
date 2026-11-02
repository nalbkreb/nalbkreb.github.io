import { db } from "./firebase-config.js";
import { requireAuth } from "./auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const form = document.getElementById("contactForm");
const spinner = document.getElementById("spinner");
const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const sendBtn = document.getElementById("sendBtn");

const user = await requireAuth();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true; statusEl.textContent = "";
  spinner.hidden = false; sendBtn.disabled = true;
  try {
    await addDoc(collection(db, "contactMessages"), {
      email: user.email,
      uid: user.uid,
      message: document.getElementById("message").value.trim(),
      createdAt: serverTimestamp()
    });
    statusEl.textContent = "Thank you! Your message was received and saved.";
    form.reset();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  } finally {
    spinner.hidden = true; sendBtn.disabled = false;
  }
});
