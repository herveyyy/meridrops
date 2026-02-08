import { sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const item = sqliteTable("item", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    icon: text("icon"),
    name: text("name").notNull(),
    description: text("description"),
    status: text({
        enum: ["available", "unavailable", "low_stock", "archived", "draft"],
    }).default("available"),
    stock: integer("stock").notNull().default(0),
    price: integer("price").notNull(),
    itemType: text({ enum: ["product", "service"] }).default("product"),
    serviceItems: blob({ mode: "json" })
        .$type<
            {
                name: string;
                label: string;
                description: string;
                price: string;
                status: "available" | "unavailable";
            }[]
        >()
        .default([]),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    remarks: text("remarks"),
});

export const type = () => {
    const Item = item.$inferInsert;
    return {
        Item,
    };
};
