let imageBase64: string | null = null;

const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const fetchImageAsDataURL = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const updatePreview = (dataUrl: string | null) => {
    const preview = document.getElementById("image-preview") as HTMLImageElement;
    const clearBtn = document.getElementById("clear-image") as HTMLButtonElement;

    if (dataUrl) {
        preview.src = dataUrl;
        preview.hidden = false;
        clearBtn.hidden = false;
    } else {
        preview.src = "";
        preview.hidden = true;
        clearBtn.hidden = true;
    }
};

const showMessage = (text: string, type: "success" | "error") => {
    const msg = document.getElementById("message")!;
    msg.textContent = text;
    msg.className = `message ${type}`;
};

const loadPotions = async () => {
    const response = await fetch("/api/potions/list");
    const potions: Array<{
        id: number;
        name: string;
        image: string | null;
        description: string;
        price: number;
    }> = await response.json();

    const list = document.getElementById("potion-list-admin")!;
    list.innerHTML = "";

    for (const potion of potions) {
        const card = document.createElement("div");
        card.className = "admin-potion-card";
        card.innerHTML = `
            <div class="admin-potion-info">
                <strong>${potion.name}</strong>
                <span>${potion.price} moedas</span>
            </div>
            <button class="delete-btn" data-id="${potion.id}">Remover</button>
        `;
        list.appendChild(card);
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = (btn as HTMLElement).dataset.id!;
            if (!confirm("Tem certeza que deseja remover esta poção?")) return;

            const response = await fetch(`/api/potions/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                showMessage("Poção removida.", "success");
                await loadPotions();
            } else {
                showMessage("Erro ao remover poção.", "error");
            }
        });
    });
};

const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const body: Record<string, unknown> = {
        name: data.get("name"),
        description: data.get("description"),
        price: data.get("price"),
    };

    if (imageBase64) {
        body.image = imageBase64;
    }

    const response = await fetch("/api/potions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        showMessage("Poção cadastrada com sucesso!", "success");
        form.reset();
        imageBase64 = null;
        updatePreview(null);
        await loadPotions();
    } else {
        const err = await response.json();
        showMessage(err.error ?? "Erro ao cadastrar poção.", "error");
    }
};

export const main = async () => {
    document.getElementById("create-form")!.addEventListener("submit", handleSubmit);
    await loadPotions();

    const urlInput = document.getElementById("image-url") as HTMLInputElement;
    const fileInput = document.getElementById("image-file") as HTMLInputElement;
    const clearBtn = document.getElementById("clear-image") as HTMLButtonElement;

    urlInput.addEventListener("input", async () => {
        const url = urlInput.value.trim();
        if (!url) {
            imageBase64 = null;
            updatePreview(null);
            return;
        }

        try {
            const dataUrl = await fetchImageAsDataURL(url);
            imageBase64 = dataUrl;
            updatePreview(dataUrl);
        } catch {
            showMessage("Não foi possível carregar a imagem da URL.", "error");
        }
    });

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        urlInput.value = "";

        const dataUrl = await readFileAsDataURL(file);
        imageBase64 = dataUrl;
        updatePreview(dataUrl);
    });

    clearBtn.addEventListener("click", () => {
        imageBase64 = null;
        urlInput.value = "";
        fileInput.value = "";
        updatePreview(null);
    });
};

if (document.readyState === "complete") {
    await main();
} else {
    document.addEventListener("DOMContentLoaded", main);
}
