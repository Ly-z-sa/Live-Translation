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
    const apiKey = '98db5dc9-a4aa-48d1-88e0-17e86c183213:fx'; // Replace with your DeepL API key
    const baseURL = 'https://api-free.deepl.com/v2/translate'; // For the free API
    // If you have a Pro account, use: 'https://api.deepl.com/v2';
    const url = `${baseURL}/translate`;

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', targetLang);
    if (sourceLang) {
        params.append('source_lang', sourceLang);
    }
    params.append('auth_key', apiKey);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        const data = await response.json();

        if (response.ok) {
            return data.translations[0].text;
        } else {
            console.error("DeepL API error:", data);
            throw new Error(`DeepL API error: ${data.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Translation failed due to a network error.");
    }
}
}
