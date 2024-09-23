import express from 'express';
import { Request, Response } from 'express';
import { myDataSource } from './app-data-source';
import { ChangesHistory } from './src/entity/changesHistory.entity';
import { Product } from './src/entity/product.entity';
import { Action } from './src/constants/constants';
import { Balance } from './src/entity/balance.entity';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // возможно некоторые эндпоинты должны получать данные из параметров URL

myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })


app.post("/products", async function (req: Request, res: Response) {
    const newProduct = await myDataSource.getRepository(Product).create(req.body)
    const results = await myDataSource.getRepository(Product).save(newProduct)
    const product = await myDataSource.getRepository(Product).findOne({
        where: [
            {
                plu: req.body.plu,
            },
        ],
    })
    if (product) {
        console.log(product)
        const history = await myDataSource.getRepository(ChangesHistory).create({ historyActionName: Action.CREATE, ...product, product })
        await myDataSource.getRepository(ChangesHistory).save(history);
    }

    return res.send(results)
})

app.patch("/balance/increase", async function (req: Request, res: Response) {
    const product = await myDataSource.getRepository(Product).findOne({
        where: [
            {
                plu: req.body.plu,
                shop_id: req.body.shop_id
            },
        ],
    })
    if (product) {
        product.quantity_at_shelve += req.body.shelve
        product.quantity_in_stock += req.body.stock
        await myDataSource.getRepository(Product).save(product)
        await myDataSource.getRepository(Balance).save({ ...req.body, product })
        const history = await myDataSource.getRepository(ChangesHistory).create({ historyActionName: Action.INCREASE, ...product, product })
        await myDataSource.getRepository(ChangesHistory).save(history);
    }
    return res.send(product)
})

app.patch("/balance/decrease", async function (req: Request, res: Response) {
    const product = await myDataSource.getRepository(Product).findOne({
        where: [
            {
                plu: req.body.plu,
                shop_id: req.body.shop_id
            },
        ],
        relations: {
            balance: true,
        }
    })
    if (product) {
        product.quantity_at_shelve -= req.body.shelve
        product.quantity_in_stock -= req.body.stock
        await myDataSource.getRepository(Product).save(product)
        await myDataSource.getRepository(Balance).save({ ...req.body, product })
        const history = await myDataSource.getRepository(ChangesHistory).create({ historyActionName: Action.DECREASE, ...product, product })
        await myDataSource.getRepository(ChangesHistory).save(history);
    }
    return res.send(product)
})

app.get("/filters/balance", async function (req: Request, res: Response) {
    const products = await myDataSource.getRepository(Product).find({
        select: {
            quantity_at_shelve: req.body.shelve,
            quantity_in_stock: req.body.stock,
        },
        where: [
            {
                plu: req.body.plu,
                shop_id: req.body.shopId,
            },
        ],
    })
    const shelves = products.map(element => element.quantity_at_shelve ? element.quantity_at_shelve : 0);
    const initialState = 0;
    const shelvesQuantity = shelves.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialState,
    );
    const stock = products.map(element => element.quantity_in_stock ? element.quantity_in_stock : 0);
    const stockQuantity = stock.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialState,
    );
    const balance = shelvesQuantity + stockQuantity;
    return res.send(`Всего товара:${balance}`)
})

app.get("/filters/product", async function (req: Request, res: Response) {
    const products = await myDataSource.getRepository(Product).find({
        where: [
            {
                plu: req.body.plu,
                product_name: req.body.product_name,
            },
        ],
    })
    return res.send(products)
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

