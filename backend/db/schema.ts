import { primaryKey } from "drizzle-orm/gel-core";
import { DataTypes, Sequelize } from "sequelize";

export const defineSchema = (sequelize: Sequelize) => ({
    potions: sequelize.define(
                "Potion",
                {
                    id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true
                    },
                    name: {
                        type: DataTypes.STRING,
                        allowNull: false
                    },
                    description: {
                        type: DataTypes.STRING,
                    },
                    price: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                    },
                    image: {
                        type: DataTypes.BLOB
                    },
                }
            )
}) as const;
