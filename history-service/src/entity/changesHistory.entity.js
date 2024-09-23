import { EntitySchema } from "typeorm";

export class History {
  constructor(historyActionName, plu, shop_id, createdAt) {
    this.historyActionName = historyActionName;
    this.plu = plu;
    this.shop_id = shop_id;
    this.createdAt = createdAt;
  }
}

export const ChangesHistory = new EntitySchema({
  name: "ChangesHistory",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    historyActionName: {
      type: String,
    },
    plu: {
      type: String,
    },
    shop_id: {
      type: Number,
    },
    createdAt: {
      type: Date,
    }
  },
});