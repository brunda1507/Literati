// Procedural Prompt Generator Engine
const grammar = {
    "dark-academia": {
        action: ["Write about discovering", "Compose lines describing", "Craft a stanza on", "Detail the story of"],
        object: ["an unread journal bound in faded velvet", "a brass pocket watch that ticks out of order", "a lost letter tucked inside an ancient atlas", "a set of ink-stained notes left in an empty lecture room"],
        setting: ["in a sunlit corner of an forgotten library", "beneath arched stone corridors after midnight", "beside a glowing fireplace as storm clouds gather", "in an overgrown university courtyard at dusk"],
        twist: ["where secrets whisper from the margins", "that holds a truth nobody dared to publish", "written entirely in an unmapped language", "that only reveals its text under moonlight"]
    },
    "nature": {
        action: ["Capture the essence of", "Describe the quiet beauty of", "Write a poem centered on", "Compose a tribute to"],
        object: ["a solitary glowing streetlight overtaken by moss", "wild river stones resting under clear running waters", "autumn frost settling over a wild forest flower", "an abandoned vending machine deep inside an ancient wood"],
        setting: ["under a dense canopy of weeping willows", "in a forgotten glass greenhouse during a downpour", "along a winding mountain path blanketed in fog", "at the edge of a mirror-like lake at dawn"],
        twist: ["where fireflies dance like drifting sparks", "and the forest seems to hum a gentle melody", "where time feels entirely suspended", "while wild ferns slowly reclaim the earth"]
    },
    "melancholy": {
        action: ["Explore the feeling of", "Craft a poem inspired by", "Write lines echoing", "Capture the silence of"],
        object: ["an old melody heard through a distant window", "a single pair of footprints left on a rainy street", "a dried flower preserved between forgotten pages", "a key to a room that no longer exists"],
        setting: ["in an empty coffee shop on a gray afternoon", "watching train windows blur under heavy rain", "standing on a quiet porch just after sunset", "in a dim hall where a clock softly ticks"],
        twist: ["carrying memories from a summer years ago", "that leaves an aching sense of sweet nostalgia", "reminding you of someone you used to know", "softly fading away into the autumn mist"]
    },
    "romantic": {
        action: ["Write a poem about", "Compose a soft piece on", "Craft lines capturing", "Describe the quiet intimacy of"],
        object: ["a shared umbrella held against a heavy storm", "a handwritten note passed across a quiet desk", "a warm glow cast by a paper lantern", "two coffee cups lingering late into the night"],
        setting: ["in a secluded garden corner under blooming jasmine", "along a cobblestone street illuminated by gas lamps", "on a rooftop garden overlooking the quiet city", "inside a cozy attic room surrounded by books"],
        twist: ["where words aren't needed to understand each other", "sparking a quiet light in the deep shadow", "where time slows down just for a moment", "written like an eternal promise in the quiet"]
    }
};

let currentPromptText = "";

// Dynamic Generator Function
window.handleGenerate = function() {
    const categorySelect = document.getElementById("categorySelect");
    const promptDisplay = document.getElementById("promptDisplay");
    
    const category = (categorySelect && categorySelect.value) ? categorySelect.value : "nature";
    const set = grammar[category] || grammar["nature"];
    
    // Pick 1 random element from each bucket to assemble a procedural prompt
    const act = set.action[Math.floor(Math.random() * set.action.length)];
    const obj = set.object[Math.floor(Math.random() * set.object.length)];
    const loc = set.setting[Math.floor(Math.random() * set.setting.length)];
    const tws = set.twist[Math.floor(Math.random() * set.twist.length)];

    currentPromptText = `${act} ${obj} ${loc}, ${tws}.`;

    if (promptDisplay) {
        promptDisplay.textContent = `"${currentPromptText}"`;
        promptDisplay.style.fontStyle = "italic";
    }
};

window.handlePin = function() {
    if (!currentPromptText) return;
    let saved = JSON.parse(localStorage.getItem("literati_jar")) || [];
    if (!saved.includes(currentPromptText)) {
        saved.push(currentPromptText);
        localStorage.setItem("literati_jar", JSON.stringify(saved));
        window.renderJar();
    }
};

window.renderJar = function() {
    const jarList = document.getElementById("jarList");
    if (!jarList) return;

    let saved = JSON.parse(localStorage.getItem("literati_jar")) || [];
    jarList.innerHTML = "";

    if (saved.length === 0) {
        jarList.innerHTML = `<li style="color: var(--text-muted); list-style: none;">Jar is empty</li>`;
        return;
    }

    saved.forEach((prompt, index) => {
        const li = document.createElement("li");
        li.style.marginBottom = "8px";
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.innerHTML = `
            <span>${prompt}</span>
            <button onclick="window.removeJarItem(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold; margin-left:10px;">✕</button>
        `;
        jarList.appendChild(li);
    });
};

window.removeJarItem = function(index) {
    let saved = JSON.parse(localStorage.getItem("literati_jar")) || [];
    saved.splice(index, 1);
    localStorage.setItem("literati_jar", JSON.stringify(saved));
    window.renderJar();
};

window.handleSearch = async function() {
    const dictInput = document.getElementById("dictInput");
    const dictResults = document.getElementById("dictResults");
    if (!dictInput || !dictResults) return;

    const word = dictInput.value.trim().toLowerCase();
    if (!word) return;

    dictResults.innerHTML = "<p style='color: var(--text-muted);'>Searching lexicon...</p>";

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();
        const entry = data[0];

        let chosenDef = null;
        let chosenMeaning = null;
        let collectedSynonyms = [];

        for (const meaning of entry.meanings) {
            if (meaning.synonyms) collectedSynonyms.push(...meaning.synonyms);

            for (const defObj of meaning.definitions) {
                if (defObj.synonyms) collectedSynonyms.push(...defObj.synonyms);

                const defText = defObj.definition.toLowerCase();
                const isObsolete = defText.includes("obsolete") || defText.includes("archaic") || defText.includes("historical");

                if (!chosenDef && !isObsolete) {
                    chosenDef = defObj;
                    chosenMeaning = meaning;
                }
            }
        }

        if (!chosenDef) {
            chosenMeaning = entry.meanings[0];
            chosenDef = chosenMeaning.definitions[0];
        }

        const uniqueSynonyms = [...new Set(collectedSynonyms)];
        const synonymDisplay = uniqueSynonyms.length > 0 
            ? uniqueSynonyms.slice(0, 5).join(", ") 
            : "None found";

        const phonetic = entry.phonetic || (entry.phonetics.find(p => p.text)?.text) || "";

        dictResults.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: bold; color: var(--glow-gold); margin-bottom: 4px;">
                ${entry.word} 
                <span style="font-size: 0.85rem; font-weight: normal; font-style: italic; color: var(--text-muted);">
                    (${chosenMeaning.partOfSpeech}) ${phonetic}
                </span>
            </div>
            <p style="margin: 6px 0;"><strong>Def:</strong> ${chosenDef.definition}</p>
            <p style="margin: 6px 0; color: var(--text-muted);"><strong>Synonyms:</strong> ${synonymDisplay}</p>
        `;
    } catch (err) {
        dictResults.innerHTML = `<p style="color: #e74c3c;">No definitions found for "${word}". Try another word!</p>`;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.renderJar();
    const draftArea = document.getElementById("draftArea");
    if (draftArea) {
        draftArea.value = localStorage.getItem("literati_draft") || "";
        draftArea.oninput = () => {
            localStorage.setItem("literati_draft", draftArea.value);
        };
    }
});