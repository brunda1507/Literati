import random
import tkinter as tk

# List of preppy & classical poetry prompts
PROMPTS = [
    "Write a poem set in an ivy-covered library during a rainstorm.",
    "Focus on an heirloom passed down through generations—what secret does it keep?",
    "Use the following words: linen, vintage, shadows, espresso.",
    "Write a stanza about an old letter found tucked inside a secondhand book.",
    "Describe autumn arriving at a quiet coastal town.",
    "Write a poem starting with: 'The clock struck midnight on the tennis court...'",
    "Focus entirely on nostalgia, but do not use the word 'nostalgia'.",
    "Write a sonnet about a forgotten promise made in a secret garden.",
]


def generate_prompt():
    prompt = random.choice(PROMPTS)
    prompt_label.config(text=prompt)


# --- UI Setup ---
root = tk.Tk()
root.title("Literati — Poetry Prompt Generator")
root.geometry("520x360")
root.configure(bg="#1B263B")  # Deep Navy Background
root.resizable(False, False)

# Main Card Container (Cream Paper)
card = tk.Frame(root, bg="#FDFBF7", highlightbackground="#C5A059", highlightthickness=3)
card.pack(padx=25, pady=25, fill="both", expand=True)

# Crest / Subtitle Header
crest_label = tk.Label(
    card,
    text="✦  EST. 2026  ✦",
    font=("Georgia", 9, "bold"),
    fg="#C5A059",
    bg="#FDFBF7",
)
crest_label.pack(pady=(20, 2))

title_label = tk.Label(
    card, text="Literati", font=("Georgia", 26, "bold"), fg="#2B2D42", bg="#FDFBF7"
)
title_label.pack()

subtitle_label = tk.Label(
    card,
    text="A Curated Generator for the Poetic Mind",
    font=("Georgia", 10, "italic"),
    fg="#666666",
    bg="#FDFBF7",
)
subtitle_label.pack(pady=(0, 15))

# Prompt Display Box
prompt_box = tk.Frame(
    card, bg="#FFFFFF", highlightbackground="#E2D7C5", highlightthickness=1
)
prompt_box.pack(padx=20, pady=10, fill="x")

prompt_label = tk.Label(
    prompt_box,
    text="Click below to inspire your next piece...",
    font=("Georgia", 11, "italic"),
    fg="#2B2D42",
    bg="#FFFFFF",
    wraplength=380,
    justify="center",
    pady=15,
)
prompt_label.pack()

# Generate Button
btn = tk.Button(
    card,
    text="GENERATE PROMPT",
    font=("Arial", 10, "bold"),
    fg="#FDFBF7",
    bg="#2A4836",  # Forest Green
    activebackground="#C5A059",  # Gold on click
    activeforeground="#1B263B",
    relief="flat",
    cursor="hand2",
    padx=15,
    pady=8,
    command=generate_prompt,
)
btn.pack(pady=(15, 20))

# Start the application
root.mainloop()