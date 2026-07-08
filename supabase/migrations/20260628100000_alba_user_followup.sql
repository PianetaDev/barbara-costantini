-- Aggiunge tracking del re-engagement follow-up post 48h.
-- Se l'utente ha lasciato email ma non ha fissato call entro 48h,
-- il cron alba-reengagement notifica Max su Slack e setta followup_sent_at
-- per evitare ri-notifiche.

ALTER TABLE alba_users
  ADD COLUMN IF NOT EXISTS followup_sent_at TIMESTAMPTZ;

-- Index per accelerare lo scan del cron: cerca email NOT NULL senza follow-up
CREATE INDEX IF NOT EXISTS idx_alba_users_followup_pending
  ON alba_users (first_seen_at)
  WHERE email IS NOT NULL AND followup_sent_at IS NULL;
