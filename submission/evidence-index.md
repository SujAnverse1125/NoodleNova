# Noodle Nova — Green Belt Evidence Index

This index catalogs evidence already present in the repository or supplied by the project owner. It does not create new product evidence and does not modify the deployed environment.

| Evidence category | Existing artifact | Status and handling |
| --- | --- | --- |
| Product UI | [`../public/product-ui.png`](../public/product-ui.png) | Existing repository screenshot; safe to reference in the README. |
| Feedback UI | [`../public/feedback-ui.png`](../public/feedback-ui.png) | Existing repository screenshot; safe to reference in the README. |
| Architecture | [`noodlenova-architecture.png`](noodlenova-architecture.png) and [`architecture.png`](architecture.png) | `noodlenova-architecture.png` is the NoodleNova-specific diagram based on the repository. `architecture.png` is the supplied Cosmic-Capture-style reference visual and is not presented as NoodleNova’s own architecture. |
| User onboarding spreadsheet | [`user-feedback-sheet-updated.png`](user-feedback-sheet-updated.png) and [current shared Google Sheet](https://docs.google.com/spreadsheets/d/1i4tkHd1MR0qPSeLngOxr9hNsqelM31TxBhXPZilFecI/edit?usp=sharing) | Current source contains 80 response rows; the image is a layout snapshot and both artifacts contain sensitive personal fields. |
| Admin-panel user onboarding | [`admin-panel-user-onboarding.png`](admin-panel-user-onboarding.png) | Supplied admin screenshot showing the registered-courier list and transaction log; use as private/sensitive operational evidence. |
| Mobile responsive UI | External GitHub user-attachment image referenced by the README | Existing owner-provided evidence; confirm the link remains accessible before final submission. |
| CI/CD setup | [`../public/cicd-pipeline.png`](../public/cicd-pipeline.png) | Existing repository screenshot; reference only. |
| Test output | [`../public/test-output.png`](../public/test-output.png) | Existing repository screenshot documenting the recorded 3-pass result. |
| Contract deployment | Root README contract table and public Stellar links | Existing project proof; reviewer should re-open the public links because Testnet state can reset. |
| Demo video | [Owner-provided Google Drive link](https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUWn/view?usp=drive_link) | **Pending replacement:** the URL returned a file-not-found page in the read-only access check. |
| Feedback/onboarding | [Current shared Google Sheet](https://docs.google.com/spreadsheets/d/1i4tkHd1MR0qPSeLngOxr9hNsqelM31TxBhXPZilFecI/edit?usp=sharing), spreadsheet snapshot, [`user-onboarding-table.md`](user-onboarding-table.md), and [`feedback-summary.md`](feedback-summary.md) | Current source contains 80 response rows; the public table masks emails and shortens wallet/transaction identifiers. |
| Website interactions | [`admin-panel-user-onboarding.png`](admin-panel-user-onboarding.png), authorized admin panel, and [`interaction-evidence.md`](interaction-evidence.md) | Screenshot shows the registered-user list and transaction log; full hashes and the 10-interaction claim remain pending verification. Do not publish the admin token or private admin URL. |
| Analytics | No public dashboard/configuration artifact found in read-only audit | Mark `Not verified`; do not imply integration is active. |
| Monitoring | No public dashboard/configuration artifact found in read-only audit | Mark `Not verified`; do not imply monitoring is active. |
| CI status | [`ci-status-diagnosis.md`](ci-status-diagnosis.md) | Documents the pre-existing GitHub Actions/test-discovery failure without changing the workflow. |

## Recommended submission order

Reviewers should begin with the live demo and product screenshots, then open the README contract table and public Testnet proof links. The feedback summary and checklist explain the onboarding evidence and its limitations. The interaction register should be used only as a transparent status record until the full private admin records have been reconciled and each candidate transaction has been independently verified.

## Privacy rule

Do not add the original sheet screenshot, unredacted admin screenshot, admin token, full respondent emails, or full wallet-address list to this public repository. Use the sanitized written summaries and provide any sensitive evidence only through the designated private submission channel.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository"
[2]: https://noodle-nova-seven.vercel.app/ "Noodle Nova live deployment"
[3]: https://github.com/AmitabhDey-byte/Cosmic-Capture "Cosmic-Capture reference repository"
