// Categorized Prompt Library
const promptLibrary = {
    darkAcademia: [
        "Write a poem set in an ivy-covered library during a storm.",
        "Focus on a forgotten manuscript found hidden behind an oil painting.",
        "Use the words: *velvet, shadows, ink, midnight*.",
        "Write from the perspective of an antique pocket watch."
    ],
    romanticism: [
        "Describe autumn arriving at a quiet coastal cliffside.",
        "Write a stanza honoring the moon's quiet glow over open fields.",
        "Focus on the feeling of returning home after years away.",
        "Use the words: *petrichor, golden, moss, solitude*."
    ],
    modern: [
        "Write about finding poetry in a busy subway station at 2 AM.",
        "Describe a relationship purely through forgotten items left in an apartment.",
        "Write a poem styled after a receipt or text message exchange.",
        "Focus on the sound of rainfall on a skylight window."
    ],
    forms: [
        "Write a 14-line Shakespearean Sonnet about a broken promise.",
        "Draft a Haiku triplet capturing the change of seasons.",
        "Write a poem where every line begins with the same letter.",
        "Write a 6-line stanza using an AABBCC rhyme scheme."
    ]
};

// Application State Elements
const categorySelect = document.getElementById("category");
const promptDisplay = document.getElementById("prompt-display");
const generateBtn = document.getElementById("generate-btn");
const savePromptBtn = document.getElementById("save-prompt-btn");
const promptJar = document.getElementById("prompt-jar");

const draftInput = document.getElementById("draft-input");
const saveDraftBtn = document.getElementById("save-draft-btn");
const draftStatus = document.getElementById("draft-status");

const dictInput = document.getElementById("dict-input");
const dictBtn = document.getElementById("dict-btn");
const dictResults = document.getElementById("dict-results");

let currentPrompt = "";
let savedPrompts = JSON.parse(localStorage.getItem("literati_jar")) || [];

// --- Prompt Generation ---
function generatePrompt() {
    const selectedCategory = categorySelect.value;
    const prompts = promptLibrary[selectedCategory];
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptDisplay.innerHTML = currentPrompt;
}

// --- Prompt Jar (Favorites) ---
function renderJar() {
    promptJar.innerHTML = "";
    if (savedPrompts.length === 0) {
        promptJar.innerHTML = '<li style="justify-content:center; color:#888;">Jar is empty</li>';
        return;
    }
    savedPrompts.forEach((prompt, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${prompt}</span> <button onclick="removeFromJar(${index})">✕</button>`;
        promptJar.appendChild(li);
    });
}

function addToJar() {
    if (!currentPrompt || savedPrompts.includes(currentPrompt)) return;
    savedPrompts.push(currentPrompt);
    localStorage.setItem("literati_jar", JSON.stringify(savedPrompts));
    renderJar();
}

function removeFromJar(index) {
    savedPrompts.splice(index, 1);
    localStorage.setItem("literati_jar", JSON.stringify(savedPrompts));
    renderJar();
}

// --- Drafts & Scratchpad ---
function loadDraft() {
    const savedDraft = localStorage.getItem("literati_draft");
    if (savedDraft) draftInput.value = savedDraft;
}

function saveDraft() {
    localStorage.setItem("literati_draft", draftInput.value);
    draftStatus.textContent = "Draft saved at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- Dictionary API Lookup ---
async function lookupWord() {
    const word = dictInput.value.trim();
    if (!word) return;

    dictResults.innerHTML = "Searching...";

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error("Word not found");
        
        const data = await response.json();
        const entry = data[0];
        const meaning = entry.meanings[0];
        const definition = meaning.definitions[0].definition;
        const synonyms = meaning.synonyms.length > 0 ? meaning.synonyms.slice(0, 3).join(", ") : "None found";

        dictResults.innerHTML = `
            <div class="word">${entry.word} <span class="part">(${meaning.partOfSpeech})</span></div>
            <p><strong>Def:</strong> ${definition}</p>
            <p><strong>Synonyms:</strong> ${synonyms}</p>
        `;
    } catch (err) {
        dictResults.innerHTML = `<p style="color: #C94A4A;">Word not found. Try another search!</p>`;
    }
}

// Event Listeners
generateBtn.addEventListener("click", generatePrompt);
savePromptBtn.addEventListener("click", addToJar);
saveDraftBtn.addEventListener("click", saveDraft);
dictBtn.addEventListener("click", lookupWord);

// Initial Loads
renderJar();
loadDraft();