import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const $ = (id) => document.getElementById(id);
const spinner = $("spinner"), statusEl = $("status"), errorEl = $("error");

function busy(on) {
  spinner.hidden = !on;
  document.querySelectorAll("button").forEach((b) => (b.disabled = on));
}
function showError(err) {
  statusEl.textContent = "";
  errorEl.textContent = err.message;
  errorEl.hidden = false;
}
async function run(task, successMsg) {
  busy(true); errorEl.hidden = true; statusEl.textContent = "";
  try { await task(); if (successMsg) statusEl.textContent = successMsg; }
  catch (err) { showError(err); }
  finally { busy(false); }
}

$("authForm").addEventListener("submit", (e) => {
  e.preventDefault();
  run(() => signInWithEmailAndPassword(auth, $("email").value, $("password").value), "Logged in!");
});
$("signupBtn").addEventListener("click", () => {
  if (!$("authForm").reportValidity()) return;
  run(() => createUserWithEmailAndPassword(auth, $("email").value, $("password").value), "Account created. You're logged in!");
});
$("logoutBtn").addEventListener("click", () => run(() => signOut(auth), "You have been logged out."));

$("passwordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  run(async () => {
    const user = auth.currentUser;
    const cred = EmailAuthProvider.credential(user.email, $("currentPassword").value);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, $("newPassword").value);
    $("passwordForm").reset();
  }, "Password changed successfully.");
});

onAuthStateChanged(auth, (user) => {
  $("authForms").hidden = !!user;
  $("accountSection").hidden = !user;
  if (user) $("welcome").textContent = `Signed in as ${user.email}. You can now use the Two-Step and Contact pages.`;
});
