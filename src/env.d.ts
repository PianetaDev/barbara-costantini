/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Popolato da src/middleware.ts per le rotte /admin/* protette (assente altrove). */
    user?: import('@supabase/supabase-js').User;
  }
}
