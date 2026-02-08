CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP),
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `category_item` (
	`categoryId` text NOT NULL,
	`itemId` text,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP),
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`remarks` text,
	FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`icon` text,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'available',
	`stock` integer DEFAULT 0 NOT NULL,
	`price` integer NOT NULL,
	`itemType` text DEFAULT 'product',
	`serviceItems` blob DEFAULT '[]',
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP),
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`customerName` text,
	`customerAddress` text,
	`customerContact` text,
	`status` text DEFAULT 'pending',
	`seriesNo` text,
	`totalAmount` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP),
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `order_line` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` text NOT NULL,
	`itemId` text NOT NULL,
	`quantity` text NOT NULL,
	`price` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`remarks` text,
	FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`password` text,
	`roles` text DEFAULT 'cashier',
	`status` text DEFAULT 'inactive',
	`adminId` text,
	`remarks` text,
	`loginDate` text DEFAULT (CURRENT_TIMESTAMP),
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
