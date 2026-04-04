-- Video reports
CREATE TABLE video_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES guitarist_videos(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, actioned
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_video ON video_reports(video_id);
CREATE INDEX idx_reports_status ON video_reports(status);

ALTER TABLE video_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a report
CREATE POLICY "Anyone can report a video" ON video_reports
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only admins can read/manage reports
CREATE POLICY "Admins can manage reports" ON video_reports
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add strikes column to guitarists
ALTER TABLE guitarists ADD COLUMN strikes INT NOT NULL DEFAULT 0;
