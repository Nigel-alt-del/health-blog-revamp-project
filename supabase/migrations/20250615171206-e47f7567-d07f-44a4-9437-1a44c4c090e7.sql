
-- 1. Create a table to log each creation/edit attempt of a report
CREATE TABLE IF NOT EXISTS post_save_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT, -- the ID intended for the report
  action TEXT NOT NULL CHECK (action IN ('create', 'edit')),
  title TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('success', 'fail')),
  error TEXT DEFAULT NULL
);

-- (Optional but recommended) Add an index for fast lookups by report ID
CREATE INDEX IF NOT EXISTS idx_post_save_logs_report_id ON post_save_logs(report_id);

-- Make the logs table accessible for admin review (public select, but not insert/update/delete by users unless you wish to restrict); you can refine access later based on your needs.
