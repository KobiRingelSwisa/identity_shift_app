# Analytics event catalog

Payloads are typed in [`src/analytics/events.ts`](../src/analytics/events.ts). Non-critical events respect Settings → analytics consent; critical events (session lifecycle, purchase/restore outcomes) may still be sent per store policy.

| Event | Payload (summary) | Trigger |
|-------|-------------------|---------|
| onboarding_started | — | Onboarding mount |
| onboarding_completed | commitment_days, programId | Onboarding done |
| reminder_prompt_viewed | — | Reminder screen mount |
| reminder_enabled / reminder_denied | — | User actions |
| session_started | day, programId, sessionRunId? | Start session / replay |
| step_viewed | step_id, step_type, day, index, programId, sessionRunId | Step shown |
| choice_selected | step_id, day, value, programId, sessionRunId | Choice tap |
| session_completed | day, programId, sessionRunId | Session finished |
| session_abandoned | day, last_step_index, programId, sessionRunId | Leave mid-session |
| day_completed | day, programId | Day marked complete |
| streak_updated | streak, programId | Streak change |
| growth_upgrade_cta_clicked | surface (post_session \| track_complete), programId | Soft upgrade link (growth baseline) |
| paywall_viewed | reason, programId | Paywall shown |
| paywall_cta_clicked | plan, programId | Primary CTA |
| purchase_* / restore_* | plan or reason, programId | Billing flows |

Correlation fields: `programId`, `sessionRunId` (per session run), `step_id` (step_viewed / choice).
