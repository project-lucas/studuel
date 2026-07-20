// Valeurs autorisées pour l'objectif quotidien (minutes) — MIROIR du CHECK SQL
// `profiles_daily_goal_minutes_chk` (migration 048 : IN (3,10,15,30)). Toute
// autre valeur ferait échouer l'UPDATE en silence (permission/CHECK).
//
// Isolé ici (et non dans app/reviser/actions.ts) : un fichier « use server » ne
// peut exporter que des fonctions async — y exporter cette constante casse le
// build Next 16 (« A 'use server' file can only export async functions »).
export const DAILY_GOAL_OPTIONS = [3, 10, 15, 30] as const

export type DailyGoalMinutes = (typeof DAILY_GOAL_OPTIONS)[number]
