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

app.get("/api/potions/list", async (req, res) => {
    const potions = await schema.potions.findAll({
        attributes: ["id", "name", "description", "price"]
    });

    res.json(potions.map(x => ({
        name: x.name,
        image: `${PUBLIC_SERVER_URL}/api/potions/${x.id}/image`,
        description: x.description,
        price: x.price
    })));
});

app.listen(8080, () => {
    console.log("Listening on port 8080...");
})
