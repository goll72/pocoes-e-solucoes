export const main = async () => {
    const response = await fetch("/api/potions/list");
    const potions: Array<{
        name: string;
        image: string;
        description: string;
        price: number;
    }> = await response.json();

    const list = document.getElementById("potion-list");
    if (!list) return;

    for (const potion of potions) {
        const card = document.createElement("div");
        card.className = "potion-card";
        card.innerHTML = `
            ${potion.image ? `<img class="potion-image" src="${potion.image}" alt="${potion.name}">` : ""}
            <h2>${potion.name}</h2>
            <p>${potion.description}</p>
            <p class="price">${potion.price} moedas de ouro</p>
        `;
        list.appendChild(card);
    }
};

if (document.readyState === "complete") {
    await main();
} else {
    document.addEventListener("DOMContentLoaded", main);
}
