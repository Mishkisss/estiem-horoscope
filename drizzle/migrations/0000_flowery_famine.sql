CREATE TABLE "horoscopes" (
	"id" text PRIMARY KEY NOT NULL,
	"sign" text NOT NULL,
	"date" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"overview" text DEFAULT '' NOT NULL,
	"work" text DEFAULT '' NOT NULL,
	"love" text DEFAULT '' NOT NULL,
	"mood" text DEFAULT '' NOT NULL,
	"advice" text DEFAULT '' NOT NULL,
	"closing" text DEFAULT '' NOT NULL,
	"lead_event" text DEFAULT '' NOT NULL,
	"lucky_number" integer,
	"lucky_color" text,
	"compatibility" text,
	"relevance_score" integer,
	"source" text DEFAULT 'cosmyday' NOT NULL,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "horoscopes_sign_date_idx" ON "horoscopes" USING btree ("sign","date");