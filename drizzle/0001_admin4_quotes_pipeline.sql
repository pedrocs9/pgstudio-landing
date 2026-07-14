ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "lead_id" integer;
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "project_id" integer;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "quote_id" integer;

CREATE UNIQUE INDEX IF NOT EXISTS "quotes_project_id_unique"
  ON "quotes" ("project_id")
  WHERE "project_id" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "projects_quote_id_unique"
  ON "projects" ("quote_id")
  WHERE "quote_id" IS NOT NULL;
