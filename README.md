# 🌐 Bharat Translator (LinguaFlow)

A premium, feature-rich language translation web application built with a modern glassmorphism design. Translate, listen, and copy text instantly in over 100+ languages.

## 🚀 Live Server
The application runs on bharat-translator.netlify.app when served.

## ✨ Features
*   **🌐 100+ Languages Support** - Powered by the MyMemory API (free, no API key required).
*   **⚡ Auto-Translate** - Automatically translates your text as you type using an 800ms debounce.
*   **🔁 Swap Languages** - Quickly swap source/target languages and text content.
*   **🔍 Auto-Language Detection** - Detects the language of your source text automatically.
*   **🔊 Text-to-Speech (TTS)** - Listen to both source and translated text via the browser's Web Speech API.
*   **📋 Quick Copy** - One-click buttons to copy text to your clipboard.
*   **🏃 Quick Pills** - Easy shortcuts to frequently used languages (Hindi, Spanish, French, Japanese, etc.).
*   **📜 History** - Remembers your last 8 translations locally (`localStorage`), which can be loaded back with a single click.
*   **🎨 Premium Aesthetics** - Stunning dark mode design with glassmorphism layout, glowing borders, custom select inputs, and a custom particle background canvas.

## 📂 Project Structure
```
├── index.html   # Main layout, icons, and structures
├── style.css    # Colors, layouts, grid system, and styling details
└── app.js       # Core logic, API requests, Speech Synthesis, and UI actions
```

## 🛠️ Run Locally
You can run this project locally by serving the files using any simple HTTP server. For example:

```bash
# Serve using http-server (npm)
npx http-server -p 8080
```
Then visit `http://localhost:8080` in your web browser.
