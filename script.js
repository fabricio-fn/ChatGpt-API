const question = document.getElementById("question");
const responseIA = document.getElementById("response-IA");

question.addEventListener("keypress", (e) => {
    if (question.value && e.key === "Enter") {
        sendQuestion();
    }
});

const OPENAI_API_KEY = ""; // Your API key

function sendQuestion() {
    let sendQ = question.value;

    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY,
        },

        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: sendQ,
            max_tokens: 2048,
            temperature: 0.5,
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            if (responseIA.value) {
                responseIA.value += "\n";
            }

            if (json.error?.message) {
                responseIA.value += `Error: ${json.error.message}`;
            } else if (json.choices?.[0].text) {
                let text = json.choices[0].text || "No reply";

                responseIA.value += "ChatGPT: " + text;
            }

            responseIA, scrollTop = responseIA.scrollHeight;
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
            question.value = "";
            question.disabled = false;
            question.focus();
        });

    if (responseIA.value) {
        responseIA.value += "\n\n\n";

        responseIA.value += `I: ${sendQ}\n`;
        question.value = "Waiting your answer...";
        question.disabled = true;

        responseIA.scrollTop = responseIA.scrollHeight;
    }
}