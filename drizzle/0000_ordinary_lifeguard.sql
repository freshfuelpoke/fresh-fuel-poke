CREATE TABLE `hero_slides` (
	`id` integer PRIMARY KEY NOT NULL,
	`src` text NOT NULL,
	`alt` text NOT NULL,
	`label` text,
	`title_line1` text NOT NULL,
	`title_line2` text,
	`accent` text,
	`description` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `hours` (
	`id` integer PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`note` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_dine_in` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`price` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `menu_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `restaurant_info` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`short_tagline` text NOT NULL,
	`location` text NOT NULL,
	`address_line` text NOT NULL,
	`cta_primary` text NOT NULL,
	`cta_secondary` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY NOT NULL,
	`quote` text NOT NULL,
	`name` text NOT NULL,
	`context` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);