// --- 1. Instant Local Offline Lexicon (Zero Latency) ---
const localLexicon = {
    "cloud": { pos: "noun", def: "A visible mass of condensed water vapor floating in the atmosphere.", syn: "mist, vapor, haze, overcast, gloom" },
    "lake": { pos: "noun", def: "A large body of water surrounded by land.", syn: "tarn, pond, lagoon, waters, reservoir" },
    "rain": { pos: "noun", def: "Moisture condensed from the atmosphere that falls in drops.", syn: "downpour, drizzle, shower, precipitation, storm" },
    "shadow": { pos: "noun", def: "A dark area or shape produced by a body coming between rays of light and a surface.", syn: "shade, gloom, darkness, silhouette, twilight" },
    "moon": { pos: "noun", def: "The natural satellite of the earth, visible by reflected light from the sun.", syn: "orb, crescent, satellite, night-light" },
    "whisper": { pos: "verb/noun", def: "Speak softly using one's breath rather than throat vocal cords.", syn: "murmur, rustle, breathe, sigh, mutter" },
    "silence": { pos: "noun", def: "Complete absence of sound.", syn: "stillness, quiet, hush, peace, tranquility" },
    "star": { pos: "noun", def: "A luminous point in the night sky that is a large, remote incandescent body.", syn: "spark, beacon, luminary, sun" },
    "forest": { pos: "noun", def: "A large area covered chiefly with trees and undergrowth.", syn: "woods, woodland, grove, canopy, jungle" }
};

// --- 2. Procedural Prompt Generator Engine ---
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

window.handleGenerate = function() {
    const categorySelect = document.getElementById("categorySelect");
    const promptDisplay = document.getElementById("promptDisplay");
    
    const category = (categorySelect && categorySelect.value) ? categorySelect.value : "nature";
    const set = grammar[category] || grammar["nature"];
    
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

// --- 3. Ultra-Fast Hybrid Lookup (Local Instant Fallback + Datamuse API) ---
window.handleSearch = async function() {
    const dictInput = document.getElementById("dictInput");
    const dictResults = document.getElementById("dictResults");
    if (!dictInput || !dictResults) return;

    const word = dictInput.value.trim().toLowerCase();
    if (!word) return;

    // Check offline dictionary first for instant speed
    if (localLexicon[word]) {
        const item = localLexicon[word];
        dictResults.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: bold; color: var(--glow-gold); margin-bottom: 6px;">
                ${word} 
                <span style="font-size: 0.9rem; font-weight: normal; font-style: italic; color: var(--text-muted);">
                    (${item.pos})
                </span>
            </div>
            <p style="margin: 6px 0; color: var(--text-light); line-height: 1.5;">
                <strong style="color: var(--lantern-amber);">Definition:</strong> ${item.def}
            </p>
            <p style="margin: 6px 0; color: var(--text-muted);">
                <strong style="color: var(--lantern-amber);">Synonyms:</strong> ${item.syn}
            </p>
        `;
        return;
    }

    dictResults.innerHTML = `<p style="color: var(--text-muted); font-style: italic;">Fetching definitions for "${word}"...</p>`;

    // Fast API fallback using Datamuse (high speed, no strict rate limits)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s strict timeout limit

        const res = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&md=d&max=5`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("API unreachable");
        const data = await res.json();

        let synonyms = data.map(item => item.word);
        let definition = "Definition not available in quick lookup.";

        if (data.length > 0 && data[0].defs && data[0].defs.length > 0) {
            definition = data[0].defs[0].replace(/^[a-z]+\s+/, '');
        }

        const synDisplay = synonyms.length > 0 ? synonyms.join(", ") : "None found";

        dictResults.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: bold; color: var(--glow-gold); margin-bottom: 6px;">
                ${word}
            </div>
            <p style="margin: 6px 0; color: var(--text-light); line-height: 1.5;">
                <strong style="color: var(--lantern-amber);">Definition:</strong> ${definition}
            </p>
            <p style="margin: 6px 0; color: var(--text-muted);">
                <strong style="color: var(--lantern-amber);">Synonyms:</strong> ${synDisplay}
            </p>
        `;

    } catch (err) {
        dictResults.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--glow-gold); margin-bottom: 4px;">${word}</div>
            <p style="color: #ff8b8b; margin-top: 4px;">Could not connect to external server. Try common words like <em>cloud, rain, shadow, lake, whisper</em> for instant local results!</p>
        `;
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