# Noodle Nova — Green Belt Evidence Index

This index catalogs evidence already present in the repository or supplied by the project owner. It does not create new product evidence and does not modify the deployed environment.

| Evidence category | Existing artifact | Status and handling |
| --- | --- | --- |
| Product UI | [`../public/product-ui.png`](../public/product-ui.png) | Existing repository screenshot; safe to reference in the README. |
| Feedback UI | [`../public/feedback-ui.png`](../public/feedback-ui.png) | Existing repository screenshot; safe to reference in the README. |
| Architecture | [`architecture.png`](architecture.png) | Supplied architecture diagram showing wallet → React client → FastAPI/observability/result-verifier → Soroban flow. |
| User onboarding spreadsheet | [`user-feedback-sheet.png`](user-feedback-sheet.png) | Supplied Excel/Sheets-style evidence image showing 12 visible response rows; contains sensitive personal fields and should not be redistributed beyond authorized review. |
| Mobile responsive UI | External GitHub user-attachment image referenced by the README | Existing owner-provided evidence; confirm the link remains accessible before final submission. |
| CI/CD setup | [`../public/cicd-pipeline.png`](../public/cicd-pipeline.png) | Existing repository screenshot; reference only. |
| Test output | [`../public/test-output.png`](../public/test-output.png) | Existing repository screenshot documenting the recorded 3-pass result. |
| Contract deployment | Root README contract table and public Stellar links | Existing project proof; reviewer should re-open the public links because Testnet state can reset. |
| Demo video | [Owner-provided Google Drive link](https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUWn/view?usp=drive_link) | **Pending replacement:** the URL returned a file-not-found page in the read-only access check. |
| Feedback/onboarding | Shared feedback-sheet screenshot and [`feedback-summary.md`](feedback-summary.md) | Summary is sanitized; original screenshot should not be published without redaction and consent. |
| Website interactions | Authorized admin panel and [`interaction-evidence.md`](interaction-evidence.md) | Read-only evidence source; full hashes and 10-interaction claim remain pending verification. Do not publish the admin token or private admin URL. |
| Analytics | No public dashboard/configuration artifact found in read-only audit | Mark `Not verified`; do not imply integration is active. |
| Monitoring | No public dashboard/configuration artifact found in read-only audit | Mark `Not verified`; do not imply monitoring is active. |

## Recommended submission order

Reviewers should begin with the live demo and product screenshots, then open the README contract table and public Testnet proof links. The feedback summary and checklist explain the onboarding evidence and its limitations. The interaction register should be used only as a transparent status record until the full private admin records have been reconciled and each candidate transaction has been independently verified.

## Privacy rule

Do not add the original sheet screenshot, unredacted admin screenshot, admin token, full respondent emails, or full wallet-address list to this public repository. Use the sanitized written summaries and provide any sensitive evidence only through the designated private submission channel.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository"
[2]: https://noodle-nova-seven.vercel.app/ "Noodle Nova live deployment"
[3]: https://github.com/AmitabhDey-byte/Cosmic-Capture "Cosmic-Capture reference repository"
