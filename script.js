const startBtn = document.getElementById("startBtn");
const originalDiv = document.getElementById("original");
const translatedDiv = document.getElementById("translated");
const inputLang = document.getElementById("inputLang");
const outputLang = document.getElementById("outputLang");

const synth = window.speechSynthesis;

startBtn.addEventListener("click", () => {
  const inputLanguage = inputLang.value;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = inputLanguage;

  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    originalDiv.textContent = `🗣️ You said: ${transcript}`;

    const source = inputLang.value;
    const target = outputLang.value;

    const translated = await translateText(transcript, source, target);
    translatedDiv.textContent = `🌐 Translation: ${translated}`;

    speakText(translated, target);
  };
});

async function translateText(text, sourceLang, targetLang) {
  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    })
  });
  const data = await response.json();
  return data.translatedText;
}

function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  synth.speak(utterance);
}
