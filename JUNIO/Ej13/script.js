const btn = document.getElementById("btn");
const joke = document.getElementById("joke");

btn.addEventListener("click", async () => {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?lang=es");
    const data = await response.json();

    if (data.type === "single") {
        joke.textContent = data.joke;
    } else {
        joke.textContent = `${data.setup} - ${data.delivery}`;
    }
});