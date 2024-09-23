import { DataSource } from "typeorm";
import 'dotenv/config';

export const myDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(String(process.env.DB_PORT)),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
})
