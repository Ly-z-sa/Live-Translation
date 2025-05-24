const startBtn = document.getElementById("startBtn");
const originalDiv = document.getElementById("original");
const translatedDiv = document.getElementById("translated");
const langSelect = document.getElementById("langSelect");

const synth = window.speechSynthesis;

startBtn.addEventListener("click", () => {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    originalDiv.textContent = `🗣️ You said: ${transcript}`;
    const targetLang = langSelect.value;

    const translated = await translateText(transcript, targetLang);
    translatedDiv.textContent = `🌐 Translation: ${translated}`;
    speakText(translated, targetLang);
  };
});

async function translateText(text, targetLang) {
  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
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
