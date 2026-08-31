# Noodle Nova — Green Belt Evidence Index

This index catalogs the product baseline, the approved Level 5 iteration, and the evidence supplied by the project owner. It distinguishes directly verified artifacts from partial or externally hosted proof.

| Evidence category | Existing artifact | Status and handling |
| --- | --- | --- |
| Product UI | [`../public/product-ui.png`](../public/product-ui.png) | Existing repository screenshot; safe to reference in the README. |
| Feedback UI | [`../public/feedback-ui.png`](../public/feedback-ui.png) | Existing repository screenshot; safe to reference in the README. |
| Architecture | [`noodlenova-architecture.png`](noodlenova-architecture.png) and [`architecture.png`](architecture.png) | `noodlenova-architecture.png` is the NoodleNova-specific diagram based on the repository. `architecture.png` is the supplied Cosmic-Capture-style reference visual and is not presented as NoodleNova’s own architecture. |
| User onboarding spreadsheet | [`user-feedback-sheet-updated.png`](user-feedback-sheet-updated.png) and [current shared Google Sheet](https://docs.google.com/spreadsheets/d/1i4tkHd1MR0qPSeLngOxr9hNsqelM31TxBhXPZilFecI/edit?usp=sharing) | Current source contains 80 response rows; the image is a layout snapshot and both artifacts contain sensitive personal fields. |
| Admin-panel user onboarding | [`admin-panel-couriers-transactions.webp`](admin-panel-couriers-transactions.webp) and [`admin-panel-feedback.webp`](admin-panel-feedback.webp) | Read-only captures showing 69 registered couriers, 40 transaction-log entries, and 69 feedback records; use as private/sensitive operational evidence. |
| Mobile responsive UI | External GitHub user-attachment image referenced by the README | Existing owner-provided evidence; confirm the link remains accessible before final submission. |
| CI/CD setup | [`../public/cicd-pipeline.png`](../public/cicd-pipeline.png) | Existing repository screenshot; reference only. |
| Test output | [`../public/test-output.png`](../public/test-output.png) | Existing repository screenshot documenting the recorded 3-pass result. |
| Contract deployment | Root README contract table and public Stellar links | Existing project proof; reviewer should re-open the public links because Testnet state can reset. |
| Demo video | [`noodle-nova-level5-walkthrough.mp4`](noodle-nova-level5-walkthrough.mp4) and [`walkthrough-contact-sheet.png`](walkthrough-contact-sheet.png) | Repository preview is ready and public-safe; the old Drive URL was unavailable. A reviewer may still require a longer external recording with a real Freighter/Testnet interaction. |
| Feedback/onboarding | [Current shared Google Sheet](https://docs.google.com/spreadsheets/d/1i4tkHd1MR0qPSeLngOxr9hNsqelM31TxBhXPZilFecI/edit?usp=sharing), [`noodle-nova-feedback-export.xlsx`](noodle-nova-feedback-export.xlsx), [`user-onboarding-table.md`](user-onboarding-table.md), and [`feedback-summary.md`](feedback-summary.md) | Current source contains 80 response rows; the committed Excel export omits email addresses and was checked for zero email-like values. |
| Website interactions | [`level5-activity-summary.png`](level5-activity-summary.png), [`admin-panel-couriers-transactions.webp`](admin-panel-couriers-transactions.webp), [`admin-panel-feedback.webp`](admin-panel-feedback.webp), authorized admin panel, and [`level5-user-activity.md`](level5-user-activity.md) | Public-safe aggregate visual shows 80 responses, 76 unique wallets, 69 admin couriers, and 42 successful candidate hashes with the attribution caveat. Raw admin captures remain sensitive. |
| Analytics | [`analytics-evidence.md`](analytics-evidence.md) and source `lib/analytics.ts` | Event instrumentation is implemented and privacy-safe; provider dashboard screenshot is not independently verified. |
| Monitoring | No public dashboard/configuration artifact found in read-only audit | Mark `Not verified`; do not imply monitoring is active. |
| CI status | [`ci-status-level5.md`](ci-status-level5.md) and [`ci-status-diagnosis.md`](ci-status-diagnosis.md) | Latest workflow run succeeded; the diagnosis file records the earlier failure for historical context. |

| Level 5 checklist | [`level5-checklist.md`](level5-checklist.md) | Current pass/partial/pending matrix. |
| Feedback iteration | [`feedback-to-improvements.md`](feedback-to-improvements.md) | Theme-to-change traceability with Git commit link. |
| Pitch deck | [`level5-pitch-deck.md`](level5-pitch-deck.md) and [`deck-export-status.md`](deck-export-status.md) | Twelve-slide source is complete; reviewer-accessible PPTX upload remains external. |
| Release notes | [`level5-release-notes.md`](level5-release-notes.md) | Final implementation and verification summary. |

## Recommended submission order

Reviewers should begin with the live demo and product screenshots, then open the README contract table and public Testnet proof links. The Level 5 checklist, activity register, feedback traceability, and release notes explain the onboarding evidence and its limitations. The interaction register should be used only as a transparent status record until the full private admin records have been reconciled and each candidate transaction has been independently verified.

## Privacy rule

Do not add the original sheet screenshot, unredacted admin screenshot, admin token, full respondent emails, or full wallet-address list to this public repository. Use the sanitized written summaries and provide any sensitive evidence only through the designated private submission channel.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository"
[2]: https://noodle-nova-seven.vercel.app/ "Noodle Nova live deployment"
[3]: https://github.com/AmitabhDey-byte/Cosmic-Capture "Cosmic-Capture reference repository"
