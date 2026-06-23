import { Sequelize } from "sequelize";
import { defineSchema } from "./db/schema.ts";

import express from "express";

// Should be changed in production
const PUBLIC_SERVER_URL = "http://localhost:3000"

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
});

const schema = defineSchema(sequelize);

await schema.potions.sync({ force: true });

// Insert some default values

schema.potions.bulkCreate([
    {
        name: "🧪 Poção Blue Sky",
        description: "Essa poção provê um surto de inspiração por 24 horas. Foi utilizada por John Lennon quando escreveu <i>Lucy in the Sky with Diamonds</i>.",
        price: 300 
    },
    {
        name: "🌸 Poção do Perfume Misterioso",
        description: "Essa poção faz com que você fique cheirando lilás e groselha por 24 dias. Essência muito admirada pelos bruxos.",
        image: null,
        price: 200
    },
    {
        name: "🌲 Poção de Pinus",
        description: "Essa poção faz com que você fique 10 cm mais alto! Observação: efeitos colaterais desconhecidos.",
        image: null,
        price: 3000
    },
    {
        name: "💀 Poção da Beleza Eterna",
        description: "Veneno que mata rápido.",
        image: null,
        price: 100
    }
]);

// Route setup for the web service

const app = express();
app.use(express.json({ limit: "10mb" }));

app.get("/api/potions/list", async (req, res) => {
    const potions = await schema.potions.findAll({
        attributes: ["id", "name", "description", "price", "image"]
    });

    res.json(potions.map(x => ({
        id: x.id,
        name: x.name,
        image: x.image != null && x.image.length ? `${PUBLIC_SERVER_URL}/api/potions/${x.id}/image` : null,
        description: x.description,
        price: x.price
    })));
});

app.get("/api/potions/:id/image", async (req, res) => {
    const potion = await schema.potions.findByPk(req.params.id);

    if (!potion || !potion.image) {
        return res.status(404).end();
    }

    const buffer = Buffer.isBuffer(potion.image)
        ? potion.image
        : Buffer.from(potion.image as ArrayBuffer);

    res.type("application/octet-stream").send(buffer);
});

app.post("/api/potions/create", async (req, res) => {
    const { name, description, price, image } = req.body;

    if (!name || price == null) {
        return res.status(400).json({ error: "name and price are required" });
    }

    let imageBuffer: Buffer | null = null;
    if (image) {
        const matches = image.match(/^data:([a-z]+\/[a-z0-9-+.]+);base64,(.+)$/i);
        if (matches) {
            imageBuffer = Buffer.from(matches[2], "base64");
        }
    }

    const potion = await schema.potions.create({
        name,
        description: description ?? null,
        price: Number(price),
        image: imageBuffer,
    });

    res.json({ id: potion.id, name: potion.name, description: potion.description, price: potion.price });
});

app.delete("/api/potions/:id", async (req, res) => {
    const potion = await schema.potions.findByPk(req.params.id);

    if (!potion) {
        return res.status(404).json({ error: "potion not found" });
    }

    await potion.destroy();
    res.json({ ok: true });
});

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});
