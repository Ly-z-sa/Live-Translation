const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const startButton = document.getElementById('startButton');
const spokenTextElement = document.getElementById('spokenText');
const translatedTextElement = document.getElementById('translatedText');

let recognition;

// Check for Web Speech API support
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) { // Standard SpeechRecognition
    recognition = new SpeechRecognition();
} else {
    // Replaced alert() with console.error to prevent blocking the UI
    console.error("Your browser doesn't support the Web Speech API. Please try using Chrome or a modern browser.");
    // Optionally, you could disable the button or show a message on the page
    startButton.disabled = true;
    startButton.textContent = "Browser not supported";
}

if (recognition) {
    recognition.continuous = true; // Keep listening even if there's a pause
    recognition.interimResults = true; // Show interim (partial) results

    // Event listener for the Start button
    startButton.addEventListener('click', () => {
        spokenTextElement.textContent = ''; // Clear previous spoken text
        translatedTextElement.textContent = ''; // Clear previous translated text
        recognition.lang = sourceLangSelect.value; // Set the recognition language
        recognition.start(); // Start speech recognition
        startButton.textContent = 'Listening...'; // Update button text
        startButton.disabled = true; // Disable button while listening
    });

    // Event handler for speech recognition results
    recognition.onresult = async (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        // Loop through results to get final and interim transcripts
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        // Display the recognized text (final or interim)
        spokenTextElement.textContent = finalTranscript || interimTranscript;

        // If a final transcript is available, attempt translation
        if (finalTranscript) {
            const sourceText = finalTranscript;
            // Assuming HTML select values are now directly "EN", "JA", etc.
            const sourceLangCode = sourceLangSelect.value;
            const targetLangCode = targetLangSelect.value;

            console.log("Source Language Code for DeepL:", sourceLangCode);
            console.log("Target Language Code for DeepL:", targetLangCode);

            try {
                // Call the translation function
                const translated = await translateText(sourceText, sourceLangCode, targetLangCode);
                translatedTextElement.textContent = translated;
            } catch (error) {
                console.error("Translation error:", error);
                translatedTextElement.textContent = "Translation failed.";
            }
        }
    };

    // Event handler for speech recognition errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        spokenTextElement.textContent = `Error: ${event.error}`;
        startButton.textContent = 'Start Listening...'; // Reset button text
        startButton.disabled = false; // Re-enable button
    };

    // Event handler when speech recognition ends
    recognition.onend = () => {
        startButton.textContent = 'Start Listening...'; // Reset button text
        startButton.disabled = false; // Re-enable button
    };

    // Function to handle text translation using DeepL API
    async function translateText(text, sourcelang, targetlang) {
        // IMPORTANT: Replace 'YOUR_DEEPL_API_KEY' with your actual DeepL API key.
        // The key you provided `98db5dc9-a4aa-48d1-88e0-17e86c183213:fx` seems to have a suffix.
        // Please ensure you use the exact key provided by DeepL.
        const apiKey = '98db5dc9-a4aa-48d1-88e0-17e86c183213:fx'; 

        // Base URL for the DeepL Free API.
        // If you have a DeepL Pro account, use: 'https://api.deepl.com/v2';
        const baseURL = 'https://api-free.deepl.com/v2';
        const url = `${baseURL}/translate`;

        const params = new URLSearchParams();
        params.append('text', text);
        params.append('target_lang', targetlang);
        // Only append source_lang if it's explicitly provided (DeepL can auto-detect)
        if (sourcelang) {
            params.append('source_lang', sourcelang);
        }
        params.append('auth_key', apiKey);

        console.log("Attempting translation with DeepL API...");
        console.log("Request URL:", url);
        console.log("Request Params:", params.toString());

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok) { // Check if the HTTP status is 2xx (success)
                if (data.translations && data.translations.length > 0) {
                    return data.translations[0].text; // Return the translated text
                } else {
                    throw new Error("No translations found in DeepL response.");
                }
            } else {
                // Log detailed API error if response is not OK
                console.error("DeepL API returned an error status:", response.status, response.statusText, data);
                throw new Error(`DeepL API error: ${data.message || response.statusText}`);
            }
        } catch (error) {
            // Log fetch-related errors (network issues, JSON parsing errors)
            console.error("Fetch or processing error during translation:", error);
            throw new Error("Translation failed due to a network or processing issue.");
        }
    }
}
