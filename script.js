const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const startButton = document.getElementById('startButton');
const spokenTextElement = document.getElementById('spokenText');
const translatedTextElement = document.getElementById('translatedText');

let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('speechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("Your browser doesn't support the Web Speech API. Try using Chrome.");
}

if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;

    startButton.addEventListener('click', () => {
        spokenTextElement.textContent = '';
        translatedTextElement.textContent = '';
        recognition.lang = sourceLangSelect.value;
        recognition.start();
        startButton.textContent = 'Listening...';
        startButton.disabled = true;
    });

    recognition.onresult = async (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        spokenTextElement.textContent = finalTranscript || interimTranscript;

        if (finalTranscript) {
            // Call your translation function here
            const sourceText = finalTranscript;
            const targetLangCode = targetLangSelect.value.split('-')[0]; // Get the base language code

            try {
                const translated = await translateText(sourceText, sourceLangSelect.value.split('-')[0], targetLangCode);
                translatedTextElement.textContent = translated;
            } catch (error) {
                console.error("Translation error:", error);
                translatedTextElement.textContent = "Translation failed.";
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        spokenTextElement.textContent = `Error: ${event.error}`;
        startButton.textContent = 'Start Listening...';
        startButton.disabled = false;
    };

    recognition.onend = () => {
        startButton.textContent = 'Start Listening...';
        startButton.disabled = false;
    };

    async function translateText(text, sourceLang, targetLang) {
        // Replace with your actual translation API call
        // This is a placeholder using a free API (may have limitations)
        const apiKey = 'YOUR_TRANSLATION_API_KEY'; // Replace with your API key if needed
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        } else {
            throw new Error(`Translation API error: ${data.responseDetails}`);
        }
    }
}
