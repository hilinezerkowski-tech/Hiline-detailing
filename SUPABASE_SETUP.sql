-- ============================================================
-- HILINE CRM — baza klientów w Supabase
-- Wklej całość w Supabase: SQL Editor -> New query -> Run
-- ============================================================

-- Tabela klientów: każdy klient = jeden wiersz, pełne dane w JSON
-- (ten sam format co panel — zero przepisywania logiki, łatwa rozbudowa)
create table if not exists klienci (
  id text primary key,                       -- ID generowane przez panel
  dane jsonb not null,                       -- pełny obiekt klienta (imię, tel, pojazd, historia wizyt...)
  updated_at timestamptz not null default now()
);

-- Indeks po dacie aktualizacji (sortowanie listy)
create index if not exists klienci_updated_at_idx on klienci (updated_at desc);

-- Bezpieczeństwo: włącz Row Level Security i NIE dodawaj żadnych polityk.
-- Efekt: publiczny klucz (anon) nie ma dostępu do danych.
-- Dostęp ma wyłącznie klucz service_role, używany tylko po stronie
-- serwera (Netlify Function) — nigdy w kodzie strony.
alter table klienci enable row level security;
