# Noodle Nova — Level 5 User Growth and Testnet Activity Evidence

> This file is a conservative evidence register. It does not claim that a form response, an admin record, or a transaction hash alone proves a unique active Testnet user.

## Aggregate audit

| Measure | Observed value | Interpretation |
|---|---:|---|
| Feedback-sheet response rows | 80 | Owner-confirmed Noodle Nova response records |
| Populated wallet fields | 80 | Every response row contains a wallet field; four rows repeat a wallet |
| Unique wallet addresses in the sheet | 76 | Candidate onboarding identities before admin/source reconciliation |
| Duplicate wallet rows | 4 | Repeated wallet submissions are not counted as additional users |
| Unique non-placeholder transaction hashes | 42 | Candidate hashes after excluding blank/placeholder values |
| Hashes found on Stellar Testnet | 42 / 42 | Every candidate returned a Horizon record |
| Successful Testnet hashes | 42 / 42 | Every returned candidate reported `successful: true` |
| Sheet wallets appearing as a source in any candidate transaction | 40 / 76 | Cross-row evidence only; not proof of a same-row user-to-hash mapping |
| Same-row wallet-to-transaction source match | 0 / 42 | The sheet transaction row and Horizon source account do not align; this attribution gap must be resolved before claiming user-level activity |
| Admin registered couriers | 69 | Application records; not independently deduplicated against the sheet here |
| Admin transaction-log entries | 40 | Application records; not automatically equivalent to successful on-chain transactions |
| Admin feedback records | 69 | Application records; source count differs from the 80-row sheet |

## Evidence decision

The current evidence demonstrates **76 unique wallet values submitted through the owner-confirmed form**, and **42 unique candidate hashes that currently resolve successfully on Stellar Testnet**. However, the 42 hashes do not match the same-row sheet wallet as the Horizon transaction source account, and only 40 of the 76 sheet wallets appear as a source account somewhere in the candidate set. Therefore, the public submission should not yet state that 50 unique users each completed a corresponding successful transaction. The Level 5 growth/activity gate remains **partial pending private reconciliation of the application records, source wallets, and user/session relationship**.

## Candidate transaction register

| Sheet row | Wallet fragment | Stellar Testnet receipt | Horizon status | Attribution status |
|---:|---|---|---|---|
| 12 | GALGGC…IPKCPK | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/22ef4fe9f86902439fafca21358aba08074ebdcfe1956267e029b0d2dfa6272a) | Successful | Same-row source mismatch; reconcile privately |
| 13 | GDZICG…GWTMDS | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/87d9076148d94c8369bfa42e6121d374972430b0c845b294cfde2d12f6858ec5) | Successful | Same-row source mismatch; reconcile privately |
| 14 | GASWJJ…UVNQ23 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/abfcb3cb798ad605cc50cb09ecc3e65e147685f289fa72f7c0c7ec9b99c94b76) | Successful | Same-row source mismatch; reconcile privately |
| 15 | GDJVC4…7KZQSW | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/21c6163e6fdd998d882cf5088c7e4475cfb6cdd873e88d092877910124c296c9) | Successful | Same-row source mismatch; reconcile privately |
| 16 | GDGMPZ…52BWSP | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/5a64fd0fb51d26c005f67e0c68902cd0ba9745929629129c66d449580115468b) | Successful | Same-row source mismatch; reconcile privately |
| 17 | GBNHJY…GIOTKX | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/d64fc3f999c3d6b7654f1f51aa46f01f793bb1b020d4a3a41c70cb0c4a8d1793) | Successful | Same-row source mismatch; reconcile privately |
| 18 | GDI6BX…MMOMFT | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/b8f345094e6f69db635ab61caf070b30424682f67af710f66c41d3d780f5c5f1) | Successful | Same-row source mismatch; reconcile privately |
| 19 | GAGQJD…APNDDW | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/a0361f765ca2876c3bdd2d98e25ca39a37df7e134cb745c97c0b14fdf5b60c82) | Successful | Same-row source mismatch; reconcile privately |
| 20 | GCAKX6…HCPHRJ | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/662f1f2761edc255b768e9a1f3d60afb041289ae507712f1528609db3f929e1e) | Successful | Same-row source mismatch; reconcile privately |
| 21 | GDTCQR…OOJ6QM | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/8729a3838a013e6b4f97dfab0579d548c3200f467119ddd9fe37be2aa7de33eb) | Successful | Same-row source mismatch; reconcile privately |
| 22 | GCTDDL…PW3YBC | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/6e21a426f22739b10999940ecca7b4cf67661e2fd9255f7e27086fc317e3dc69) | Successful | Same-row source mismatch; reconcile privately |
| 23 | GCAFCC…ZQKI5S | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/737b1905e9e85452503ce838445ce5f08bb11f12657b770b9e4c48d6af59266f) | Successful | Same-row source mismatch; reconcile privately |
| 24 | GDOFII…NBNASU | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/0b967b01e8fdaad84711ac0275ac2aa9a3f5d34fa0265706a5ab5faae391113a) | Successful | Same-row source mismatch; reconcile privately |
| 25 | GAOJHV…G35JNH | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/bfe2c1c899c0fa3f87d10131de2eaf4812f074d7fd37ade11c8c330fe38198ff) | Successful | Same-row source mismatch; reconcile privately |
| 26 | GB56VC…BPNH2D | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/0e0224afa2c02ddf2d95e699c137f73d65df6022843da65c009d1631961383ae) | Successful | Same-row source mismatch; reconcile privately |
| 27 | GD7SJQ…DPE5PJ | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/24e81690cd90e56ca0ae144420a0891ef917952f11bd1b1eecdab14581d01998) | Successful | Same-row source mismatch; reconcile privately |
| 28 | GBHFTO…56HQ5T | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/ce4856e7546990d4e8be5942a98cafe59996e7a77cb6f9fd16ddcbe7825a47e7) | Successful | Same-row source mismatch; reconcile privately |
| 29 | GBEPUQ…5632QK | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/a3edbafe531c7b0e9c76a68af9cd31d6c54f7ef62d87900badfb2c8ba457391c) | Successful | Same-row source mismatch; reconcile privately |
| 30 | GDKQTZ…V5SVSU | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/386b31fb1e765e58fac6c8efbccdb35732b20c94fa6efe53e34ad4a836c2e6aa) | Successful | Same-row source mismatch; reconcile privately |
| 31 | GACIXS…RAG7W2 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/dba307ea46739fdaabe398d2d5ed291a8aaf523e9bc9c386811182ce397d7975) | Successful | Same-row source mismatch; reconcile privately |
| 32 | GAX66K…WWIFWI | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/465197dca6f96078c6f89d4e734fbc8c2bc6a634336c74442310ab520a43f26b) | Successful | Same-row source mismatch; reconcile privately |
| 33 | GCBIQM…DFYBC4 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/25004a78cbe2bac472740548ffe6d54eef82c208a3bfe574c112a81a570374b9) | Successful | Same-row source mismatch; reconcile privately |
| 34 | GAE6BR…26WDWN | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/474e72af216abe3395f232167b312b63ceb4f3fd760fad2f2e9de84481a47301) | Successful | Same-row source mismatch; reconcile privately |
| 35 | GCGRMP…SCA7ZS | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/bd3e32c7f371670eb1d55bcb55c8f7f187a62f82bcdac299a3301eade47966d8) | Successful | Same-row source mismatch; reconcile privately |
| 36 | GCAXAR…6XIASQ | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/f9614cbc1713d70cf9af2d9a6338478751466661d30be60d2c94da9e8c629a0e) | Successful | Same-row source mismatch; reconcile privately |
| 37 | GCEZ6K…3PUE36 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/4e75024e0880fd4d279737a11a36657163c75141a72414eb34930717b4eb5ccc) | Successful | Same-row source mismatch; reconcile privately |
| 38 | GBOTQI…5ULYUC | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/d9c0c22ee1ce1a6abe8188ec551aa3912b4ea66fb5ab330dc417b9e37e3d362e) | Successful | Same-row source mismatch; reconcile privately |
| 39 | GCIP56…XQ6CPL | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/8942bbafc3203a60e4492a85d18702f52a1ae3a00b7a7ef58f75be07ada9288b) | Successful | Same-row source mismatch; reconcile privately |
| 40 | GB6CLW…IVG4RJ | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/187e5b5b1ccfed99388f9335879b5c7a96a22fc064dbdcd3a17fd89afed9b40e) | Successful | Same-row source mismatch; reconcile privately |
| 41 | GCX7RT…OXUMPI | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/d083e3c2f12a2526b1ea71c8b7944dcbe44842c3ea6b444396610316d45b8ea6) | Successful | Same-row source mismatch; reconcile privately |
| 42 | GBEZOC…4LXC74 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/152266186c16e9954a0bbeebc5cca8b62944a72203c06f41312b9be91e0d2a8d) | Successful | Same-row source mismatch; reconcile privately |
| 43 | GBO3F5…OSWYDG | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/c29dd434f97d3236df21031e9ffcfcc626b350125cf469b7826bfe0e22116faa) | Successful | Same-row source mismatch; reconcile privately |
| 44 | GBAEZM…3JUND2 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/1ea1b924c299d928dc0eba289ce3d7689ac3a98e7b6d1a50564a14690973be29) | Successful | Same-row source mismatch; reconcile privately |
| 45 | GCJPBU…SMNK23 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/e52b2b228a774264af7856e0d5721ce76ac87748c3e65a9629d32d9c013a4fb8) | Successful | Same-row source mismatch; reconcile privately |
| 46 | GAQDZO…T6QFJ2 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/7446eb723352f448cda8fa3b660ae2b8b800b2b5001afe58df653c1eeed48fae) | Successful | Same-row source mismatch; reconcile privately |
| 47 | GAEW6J…FK3C4S | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/e3321be37ed98ded62c73b3ee28e8aadbadb08e1d17a2d9325390bb2a35c91d4) | Successful | Same-row source mismatch; reconcile privately |
| 48 | GB5YEL…2GOZPT | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/b243db6beb055bdf5aa6b15d9266290b69bbfa1a4ead782e71270164c0f275a0) | Successful | Same-row source mismatch; reconcile privately |
| 49 | GAFA2O…4TM7ZZ | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/4adf15f098008f07d36bee4190f1cdbaa674efb7c44694c0d764bf48724651d0) | Successful | Same-row source mismatch; reconcile privately |
| 50 | GCV5X5…44T276 | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/cd568412107aa05870cfa767d6d7ee1c1c980e48036c18045862512199c78bc3) | Successful | Same-row source mismatch; reconcile privately |
| 51 | GDYIHX…NTQHTX | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/845f3cbac42942212070c3a8c15f5f3ebc667a5f7c55df78634dfb95f7bf6f7c) | Successful | Same-row source mismatch; reconcile privately |
| 77 | GAVVOO…T6YC4U | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/d5bd5b60c643767cb355fabde02a8426cdc2d4103bde2576251e20aeb3416103) | Successful | Same-row source mismatch; reconcile privately |
| 79 | GATJMD…NXBS3X | [Open in Stellar Expert](https://stellar.expert/explorer/testnet/tx/6bd2cc147f99f17e373c6ce507176611700b9a63ca46a2c4c8b70f847d5d0bf7) | Successful | Same-row source mismatch; reconcile privately |

## Counting rules

A verified Level 5 user count must use deduplicated, consented wallet identities and must not count repeated form rows. A verified transaction count must use unique hashes that resolve on Stellar Testnet and report successful outcomes. Active usage must be a separately defined time-bounded metric supported by analytics, transaction activity, or reconciled application events. Contract deployment/create/complete proofs are project demonstrations and are not counted as user interactions.

## Privacy and Testnet limitations

Full email addresses and raw admin credentials are excluded from this public register. The owner should retain the full reconciliation workbook privately and share it only with authorized reviewers. Stellar Testnet can reset, so all receipt links should be rechecked immediately before submission.
