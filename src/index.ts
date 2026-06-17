export const main = async () => {
    await fetch("/api/potions/list");
};

if (document.readyState === "complete") {
    await main();
} else {
    document.addEventListener("DOMContentLoaded", main);
}
