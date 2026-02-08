import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { item } from "./item";

export const order = sqliteTable("order", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull(),
    customerName: text("customerName"),
    customerAddress: text("customerAddress"),
    customerContact: text("customerContact"),
    status: text({ enum: ["pending", "completed", "canceled"] }).default(
        "pending",
    ),
    seriesNo: text("seriesNo"),
    totalAmount: text("totalAmount").notNull(),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    remarks: text("remarks"),
});

export const orderLine = sqliteTable("order_line", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    orderId: text("orderId")
        .references(() => order.id, {
            onDelete: "cascade",
        })
        .notNull(),
    itemId: text("itemId")
        .references(() => item.id, { onDelete: "cascade" })
        .notNull(),
    quantity: text("quantity").notNull(),
    sumPrice: text("price").notNull(),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    remarks: text("remarks"),
});
export const type = () => {
    const Order = order.$inferInsert;
    const OrderLine = orderLine.$inferInsert;
    return {
        OrderLine,
        Order,
    };
};
