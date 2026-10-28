CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"cover" text,
	"link" text,
	"read_date" text,
	"rating" integer,
	"status" text DEFAULT 'finished' NOT NULL,
	"description" text,
	"content" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "books_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "books_status_idx" ON "books" USING btree ("status");--> statement-breakpoint
CREATE INDEX "books_read_date_idx" ON "books" USING btree ("read_date");