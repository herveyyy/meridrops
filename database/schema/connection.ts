import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const serverConnection = sqliteTable("server_connection", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull(),
    serverCode: text("server_code").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
    serverStatus: text("server_status").default("active"),
});

export const clientConnection = sqliteTable("client_connection", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    serverConnectionId: text("server_connection_id")
        .notNull()
        .references(() => serverConnection.id, { onDelete: "cascade" }),
    username: text("username").notNull(),
    connectionStatus: text("connection_status").default("active"),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

export const sharedFiles = sqliteTable("shared_files", {
    id: text("id").primaryKey(),
    clientConnectionId: text("client_connection_id")
        .notNull()
        .references(() => clientConnection.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    fileSize: integer("file_size").notNull(),
    fileType: text("file_type"),
    status: text("status").notNull().default("queued"),
    progress: integer("progress").default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(unixepoch())`),
});

// Corrected DTOs
export type ServerConnection = typeof serverConnection.$inferSelect;
export type NewServerConnection = typeof serverConnection.$inferInsert;

export type ClientConnection = typeof clientConnection.$inferSelect;
export type NewClientConnection = typeof clientConnection.$inferInsert;

export type SharedFile = typeof sharedFiles.$inferSelect;
export type NewSharedFile = typeof sharedFiles.$inferInsert;
