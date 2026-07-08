-- Traccia la lingua dell'iscritto, per far puntare i redirect (confirm/unsubscribe/preferences)
-- e i link "gestisci preferenze" alla pagina /bulletin/* nella lingua giusta.
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'it';
