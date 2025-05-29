ALTER TABLE "posts" DROP CONSTRAINT "posts_authorId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "author_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image_src" varchar(255);--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "authorId";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "imageSrc";