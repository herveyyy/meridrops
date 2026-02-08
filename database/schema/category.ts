import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { item } from "./item";
import { create } from "domain";

export const category = sqliteTable("category", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    remarks: text("remarks"),
});
export const category_item = sqliteTable("category_item", {
    categoryId: text("categoryId")
        .notNull()
        .references(() => category.id, { onDelete: "cascade" }),
    itemId: text("itemId").references(() => item.id, { onDelete: "cascade" }),
    updatedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    remarks: text("remarks"),
});
export const type = () => {
    const Category = category.$inferInsert;
    const CategoryItem = category_item.$inferInsert;
    return {
        Category,
        CategoryItem,
    };
};
