-- Migration 001 — Add Phase 2 columns to transactions and messages
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to re-run (uses ADD COLUMN IF NOT EXISTS)

-- ─── transactions: recurring bookings + tool condition docs ───────────────────
alter table public.transactions
  add column if not exists pickup_photos       text[],
  add column if not exists return_photos       text[],
  add column if not exists condition_notes     text,
  add column if not exists is_recurring        boolean not null default false,
  add column if not exists recurrence_interval text check (recurrence_interval in ('weekly','biweekly','monthly')),
  add column if not exists recurrence_end_date date,
  add column if not exists parent_transaction_id uuid references public.transactions(id);

-- ─── messages: auto-translation support ───────────────────────────────────────
alter table public.messages
  add column if not exists body_original     text,
  add column if not exists body_translated   text,
  add column if not exists original_language text check (original_language in ('en','es'));
