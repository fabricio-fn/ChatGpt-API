const pergunta = document.getElementById("pergunta");
const respostaIa = document.getElementById("respostaIa");

pergunta.addEventListener("keypress", (e) => {
    if (pergunta.value && e.key === "Enter") {
        EnviarPergunta();
    }
});

// Chave da API
const OPENAI_API_KEY = "";

function EnviarPergunta() {
    let enviarP = pergunta.value;

    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPENAI_API_KEY,
        },

        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: enviarP,
            max_tokens: 2048,
            temperature: 0.5,
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            if (respostaIa.value) {
                respostaIa.value += "\n";
            }

            if (json.error?.message) {
                respostaIa.value += `Error: ${json.error.message}`;
            } else if (json.choices?.[0].text) {
                let text = json.choices[0].text || "Sem resposta";

                respostaIa.value += "Chat GPT: " + text;
            }

            respostaIa, scrollTop = respostaIa.scrollHeight;
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
            pergunta.value = "";
            pergunta.disabled = false;
            pergunta.focus();
        });

    if (respostaIa.value) {
        respostaIa.value += "\n\n\n";

        respostaIa.value += `Eu: ${enviarP}\n`;
        pergunta.value = "Aguardando sua resposta...";
        pergunta.disabled = true;

        respostaIa.scrollTop = respostaIa.scrollHeight;
    }
}