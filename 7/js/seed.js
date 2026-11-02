import { db } from "./firebase-config.js";
import { requireAuth } from "./auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

await requireAuth();
const out = document.getElementById("out");
const data = await (await fetch(new URL("./twoStepData.json", import.meta.url))).json();

for (const [eraKey, era] of Object.entries(data)) {
  await setDoc(doc(db, "eras", eraKey), era);
  out.textContent += `uploaded ${eraKey}\n`;
}
out.textContent += "Done.";
