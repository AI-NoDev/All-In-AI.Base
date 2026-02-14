ALTER TABLE "system_menu" ALTER COLUMN "path" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "system_menu" ADD COLUMN "is_system" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "system_menu" ADD COLUMN "link_url" varchar(500);--> statement-breakpoint
ALTER TABLE "system_menu" ADD COLUMN "link_target" varchar(10) DEFAULT '_self';--> statement-breakpoint
ALTER TABLE "system_menu" DROP COLUMN "component";