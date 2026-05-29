const state = {
  mode: "signup",
  isLoggedIn: Boolean(localStorage.getItem("email")),
  email: localStorage.getItem("email") || "",
  notes: []
};

const els = {
  apiBase: document.querySelector("#apiBase"),
  signupTab: document.querySelector("#signupTab"),
  loginTab: document.querySelector("#loginTab"),
  signupFields: document.querySelector("#signupFields"),
  authForm: document.querySelector("#authForm"),
  authSubmit: document.querySelector("#authSubmit"),
  name: document.querySelector("#name"),
  age: document.querySelector("#age"),
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  sessionCard: document.querySelector("#sessionCard"),
  sessionEmail: document.querySelector("#sessionEmail"),
  logoutBtn: document.querySelector("#logoutBtn"),
  refreshBtn: document.querySelector("#refreshBtn"),
  noteForm: document.querySelector("#noteForm"),
  noteId: document.querySelector("#noteId"),
  title: document.querySelector("#title"),
  description: document.querySelector("#description"),
  saveNoteBtn: document.querySelector("#saveNoteBtn"),
  cancelEditBtn: document.querySelector("#cancelEditBtn"),
  message: document.querySelector("#message"),
  notesList: document.querySelector("#notesList")
};

const savedApiBase = localStorage.getItem("apiBase");
if (savedApiBase) {
  els.apiBase.value = savedApiBase;
}

function apiBase() {
  const value = els.apiBase.value.trim().replace(/\/$/, "");
  localStorage.setItem("apiBase", value);
  return value;
}

function setMessage(text, type = "success") {
  els.message.textContent = text;
  els.message.className = `message ${type}`;
}

function clearMessage() {
  els.message.textContent = "";
  els.message.className = "message hidden";
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });


  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

function setMode(mode) {
  state.mode = mode;
  const isSignup = mode === "signup";

  els.signupTab.classList.toggle("active", isSignup);
  els.loginTab.classList.toggle("active", !isSignup);
  els.signupFields.classList.toggle("hidden", !isSignup);
  els.authSubmit.textContent = isSignup ? "Create account" : "Login";
  els.password.autocomplete = isSignup ? "new-password" : "current-password";
  clearMessage();
}

function saveSession({ email }) {
  state.email = email;
  state.isLoggedIn = true;
  localStorage.setItem("email", email);
  renderSession();
}

function clearSession() {
  state.email = "";
  state.isLoggedIn = false;
  state.notes = [];
  localStorage.removeItem("email");
  renderSession();
  renderNotes();
}

function renderSession() {
  const signedIn = state.isLoggedIn;
  els.sessionCard.classList.toggle("hidden", !signedIn);
  els.sessionEmail.textContent = state.email;
}

function resetNoteForm() {
  els.noteId.value = "";
  els.title.value = "";
  els.description.value = "";
  els.saveNoteBtn.textContent = "Create note";
  els.cancelEditBtn.classList.add("hidden");
}

function renderNotes() {
  if (!state.isLoggedIn) {
    els.notesList.innerHTML = '<div class="empty-state">Login or signup first, then your notes will show here.</div>';
    return;
  }

  if (state.notes.length === 0) {
    els.notesList.innerHTML = '<div class="empty-state">No notes yet.</div>';
    return;
  }

  els.notesList.innerHTML = state.notes
    .map((note) => {
      const safeTitle = escapeHtml(note.title);
      const safeDescription = escapeHtml(note.description);

      return `
        <article class="note-card">
          <header>
            <h3>${safeTitle}</h3>
            <div class="note-actions">
              <button type="button" data-action="edit" data-id="${note._id}">Edit</button>
              <button type="button" data-action="delete" data-id="${note._id}">Delete</button>
            </div>
          </header>
          <p>${safeDescription}</p>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadNotes() {
  if (!state.isLoggedIn) {
    renderNotes();
    return;
  }

  state.notes = await request("/api/notes");
  renderNotes();
}

els.signupTab.addEventListener("click", () => setMode("signup"));
els.loginTab.addEventListener("click", () => setMode("login"));
els.apiBase.addEventListener("change", apiBase);

els.authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const payload = {
    email: els.email.value.trim(),
    password: els.password.value
  };

  if (state.mode === "signup") {
    payload.name = els.name.value.trim();
    payload.age = Number(els.age.value);
  }

  try {
    const data = await request(`/api/user/${state.mode === "signup" ? "signup" : "login"}`, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    saveSession(data);
    setMessage(`${state.mode === "signup" ? "Signup" : "Login"} worked.`);
    await loadNotes();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

els.logoutBtn.addEventListener("click", async () => {
  try {
    await request("/api/user/logout", { method: "POST" });
  } catch (error) {
    console.log(error);
  }

  clearSession();
  resetNoteForm();
  setMessage("Logged out.");
});

els.refreshBtn.addEventListener("click", async () => {
  clearMessage();

  try {
    await loadNotes();
    setMessage("Notes refreshed.");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

els.noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const noteId = els.noteId.value;
  const payload = {
    title: els.title.value.trim(),
    description: els.description.value.trim()
  };

  try {
    await request(noteId ? `/api/notes/${noteId}` : "/api/notes", {
      method: noteId ? "PATCH" : "POST",
      body: JSON.stringify(payload)
    });

    resetNoteForm();
    await loadNotes();
    setMessage(noteId ? "Note updated." : "Note created.");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

els.cancelEditBtn.addEventListener("click", () => {
  resetNoteForm();
  clearMessage();
});

els.notesList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const note = state.notes.find((item) => item._id === button.dataset.id);

  if (!note) {
    return;
  }

  if (button.dataset.action === "edit") {
    els.noteId.value = note._id;
    els.title.value = note.title;
    els.description.value = note.description;
    els.saveNoteBtn.textContent = "Update note";
    els.cancelEditBtn.classList.remove("hidden");
    els.title.focus();
    clearMessage();
    return;
  }

  try {
    await request(`/api/notes/${note._id}`, { method: "DELETE" });
    await loadNotes();
    setMessage("Note deleted.");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

setMode("signup");
renderSession();
loadNotes().catch((error) => setMessage(error.message, "error"));
