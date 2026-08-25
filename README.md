# Noodle Nova

Noodle Nova is a **Stellar Testnet dApp** built around a gamified ramen-delivery experience. Users can connect a Freighter wallet, view Testnet XLM balance and recent activity, send Testnet XLM, and interact with a Soroban delivery-escrow contract that locks funds until a sponsored delivery is completed.

> **Testnet only:** Do not use real funds or production credentials.

## Links

| Resource | Link |
| --- | --- |
| Live demo | [noodle-nova-seven.vercel.app](https://noodle-nova-seven.vercel.app/) |
| Demo video | https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUwN/view?usp=drive_link |
| Public repository | [SujAnverse1125/NoodleNova](https://github.com/SujAnverse1125/NoodleNova) |

## Product Evidence

The following assets are already present in this repository and document the existing product and development state. They are referenced here without changing the application or deployment.

### Product UI

![Noodle Nova product UI](public/product-ui.png)

### User feedback system

![Noodle Nova feedback UI](public/feedback-ui.png)

### Mobile responsive UI

<img width="1080" height="2408" alt="Noodle Nova mobile responsive UI" src="https://github.com/user-attachments/assets/cf6d1288-5394-4c36-81ca-114c1205f94b" />

### CI/CD pipeline

![CI/CD pipeline](public/cicd-pipeline.png)

### Test output

![Test output](public/test-output.png)

## Core Features

Noodle Nova currently documents the following product capabilities:

- Freighter wallet connection.
- Stellar Testnet XLM balance and recent transaction feed.
- XLM payment form with validation, loading states, and error states.
- Responsive Next.js interface.
- Soroban `DeliveryEscrow` contract with create, complete, and read operations.
- Token-contract transfers and `DeliveryCreated` / `DeliveryCompleted` events.
- Rust unit tests covering the delivery flow and invalid repeat operations.

## User Journey

A user opens the deployed application, connects a Freighter wallet, reviews the available Testnet XLM information, and uses the ramen-delivery flow to create or complete a sponsored delivery. The application displays transaction progress through its existing interface. Users can also access the feedback experience to submit a rating and written review.

This README describes the current deployed product as documented by the repository. It does not claim that new application features, new smart-contract deployments, analytics configuration, or monitoring configuration were added during the documentation update.

## Architecture

![Noodle Nova architecture diagram](submission/noodlenova-architecture.png)

The architecture diagram above is **NoodleNova-specific** and is based on the actual repository paths. A player connects a Freighter wallet to the Next.js frontend. The frontend uses Stellar Horizon for Testnet balance, activity, and XLM transfers; calls the existing Next.js route handlers for users, rewards, transactions, feedback, and user statistics; persists application records through Prisma to PostgreSQL; and interacts with the Soroban `DeliveryEscrow` contract. The contract emits the documented delivery events. This is a documentation diagram only; no application architecture was changed.

| Layer | Current implementation documented by the repository |
| --- | --- |
| Frontend | Next.js 14, React, TypeScript, and Tailwind CSS |
| Wallet and payments | `@stellar/freighter-api` and `@stellar/stellar-sdk` |
| Smart contract | Rust with Soroban SDK `27.0.6` |
| Contract domain | Delivery escrow with create, complete, and read operations |
| CI | Existing GitHub Actions workflow for frontend build and contract tests |
| Deployment | Existing Vercel deployment linked above |

The contract uses Stellar's native asset contract through `token::Client` to transfer funds from the sponsor to escrow and from escrow to the courier after completion.

## Stellar Testnet Contract and Proof

The following values are documented by the existing repository. Stellar Testnet state can reset, so reviewers should open the public links during review rather than relying only on static README text.

| Item | Value |
| --- | --- |
| Network | Stellar Testnet |
| DeliveryEscrow contract | [`CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM`](https://lab.stellar.org/r/testnet/contract/CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM) |
| Native XLM asset contract | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Contract WASM hash | `ee3892dbe6df123ee75180a44674bf55040c422372f8684ea90f107d6548c1cb` |
| Deployment transaction | [`c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6`](https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6) |
| Create-delivery transaction | [`ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470`](https://stellar.expert/explorer/testnet/tx/ed214acb9282d0ed596e5ed55f710170a68d83fcd657fd52e81f370e23083470) |
| Complete-delivery transaction | [`93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5`](https://stellar.expert/explorer/testnet/tx/93e6df19413a77b2fa0b1041bb7edbb194e3e22cb244911989a078a3236f9ee5) |

The repository describes the documented Testnet flow as creating delivery `1`, locking 1 XLM in escrow, emitting `DeliveryCreated`, completing the delivery, releasing 1 XLM to the courier, and emitting `DeliveryCompleted`.

### Contract interface

```text
create_delivery(delivery_id, sponsor, courier, token, amount)
complete_delivery(delivery_id)
get_delivery(delivery_id)
```

`create_delivery` requires sponsor authorization and transfers the requested token amount into the contract. `complete_delivery` requires the stored sponsor's authorization and releases the escrowed funds to the courier.

## Local Setup

### Prerequisites

Use Node.js 20 or newer, Rust, and the Stellar CLI.

```bash
git clone https://github.com/SujAnverse1125/NoodleNova.git
cd NoodleNova
npm install
npm run dev
```

Open `http://localhost:3000`.

To override the default Horizon endpoint, create `.env.local` with a non-secret public Testnet endpoint:

```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

Do not commit private keys, admin tokens, API keys, or other deployment secrets.

## Test and Build

```bash
# Frontend production build
npm run build

# Frontend tests
npm test
```

The existing README records **3 passed, 0 failed** for the documented frontend test run. This result is preserved as repository evidence and has not been regenerated or altered as part of the documentation-only update.

The GitHub Actions check currently shows a red status because recursive `node --test` discovery encounters broken tracked `.claude/skills` links on the hosted runner. This is a pre-existing CI/test-discovery issue unrelated to the documentation or image updates; see [`submission/ci-status-diagnosis.md`](submission/ci-status-diagnosis.md) for the verified details.

## Users Onboarded and Feedback Evidence

The complete current response data from the owner-provided [Noodle Nova Feedback Form response sheet](https://docs.google.com/spreadsheets/d/1i4tkHd1MR0qPSeLngOxr9hNsqelM31TxBhXPZilFecI/edit?usp=sharing) is presented below as one continuous GitHub Markdown pipe table.

|  Timestamp  |  Full Name  |  Wallet Address  |  Transaction Hash  |  Rating  |  Review / Suggestions  |
| --- | --- | --- | --- | ---: | --- |
|  16/08/2026 22:46:13  |  Ishita Mehta  |  GD5VMIJR247PGGHES76I4PXP73G7UTXZRYH6BXI3YF5G5HCKJ6NR4ELL  |  -  |  5  |  its really awesome  |
|  16/08/2026 22:46:38  |  Pooja Gowda  |  GC7DECKZ6GEOI3XGGZG5D3NZIOYRLNP77J7LEALDPIPWHU6DNCLND4RL  |  -  |  5  |  wow  |
|  17/08/2026 13:19:54  |  Shreya Agarwal  |  GB5CRKDHZ2PCZKTTH3HPKAPIKUBIPAAEW66A3YSTZZFQM53J4QEGZUMG  |  -  |  3  |  not so helpful for non techies  |
|  17/08/2026 20:27:56  |  Priya Kapoor  |  GCXHPXT45FE3O55RZTECBQQ3IWOUHQOU3GHNIGGU3Q7CKUX7ULIXVP4K  |  -  |  4  |  good ui  |
|  17/08/2026 21:46:57  |  Krishna Merchant  |  GD7QFNWWBHYJKBKFIRHJIFSFZRH2BCAZ7LIVZHG6AEZ4GURLUD44HOPO  |  -  |  3  |  need improvement  |
|  18/08/2026 12:52:57  |  Meera Rao  |  GCCBXKAU2BZX5CHBDW3TPR3NYX7BAZPDIZFVAOVYQGTKMNXVGGCGFSKC  |  -  |  2  |  not good  |
|  18/08/2026 13:16:51  |  Kavya Menon  |  GCYX25F52SFDKGY7WSAE7SLATKN25ZKCYYAQ4I4JGW7BIKTHYSM6NL5E  |  -  |  4  |  really useful if it spreads more  |
|  18/08/2026 13:17:59  |  Sneha Iyer  |  GBVNXXTGFSF3ZK6QF5EHWU6NKY7Z7DIZTRRPL4OVKFQRKSHCOD57QFXF  |  -  |  5  |  nice work  |
|  18/08/2026 15:17:52  |  Tathagata Guha  |  GAV4OONA2FR27GKZXDD3SNVPYH44MQN5GTGFWUCS24CBEIDNCYA3W2FI  |  -  |  4  |  you should add more like freighter  |
|  18/08/2026 16:17:51  |  Ananya Hegde  |  GD7MXNTHHCPXFFKTHCZPKIRILUUVJZF5EPDTXD4Z2732ACNI7QW4RIBQ  |  -  |  4  |  the app looks good  |
|   18/08/2026 16:25:01   |   Srinwanti Kar   |   GALGGCLBTNDTM2FMPMZI2FTPKWI4SUAZKIFZUDLR24NRTXYHBQIPKCPK   | https://stellar.expert/explorer/testnet/tx/e9b5fa90d8d2d504d1741b1ee82ba90f3540608dd221ffff8b3c84cfe4fb8f19 |   5   |   great and awesome specially the landing page   |
|   18/08/2026 17:30:33   |   Nilanjan Majumdar   |   GDZICGWBWRD2YPYWQ4KEMK5KTOLDDXDI7VCGXFMSNB6HFUKKBYGWTMDS   | https://stellar.expert/explorer/testnet/tx/5b85b72dca4202b025477e7d3094743d30b73221a77ef78930e9e07c0c0f7253 |   5   |   nice work   |
|   18/08/2026 18:54:32   |   Rintaro   |   GASWJJS6ZGUTW3U2PF66DXSKE7UETIWH4LDGBWOK7ZMGNAMK5SUVNQ23   | https://stellar.expert/explorer/testnet/tx/349c64ac2e4cf841dbf99a552f07214cfff63e19494b9c438b5d9785434c4a2a |   4   |   good   |
|   18/08/2026 20:06:28   |   Kakali Sarkar   |   GDJVC4R42U5AT4BJXG3NQZ3Q6CWJUEVV4PTNE5Y7M6NYPX3BS37KZQSW   | https://stellar.expert/explorer/testnet/tx/acaa5f0c5979b540b658f809520771eb1bffd45e09b0e8ee68b86abbf9e3b5ed |   4   |   good   |
|   18/08/2026 22:13:03   |   Koushik Bhattacharya   |   GDGMPZCD6ANI2UO4QPXK7OEWB7O6DVOCKZRZCCITI7E3PS2VH452BWSP   | https://stellar.expert/explorer/testnet/tx/dc605dad7930cafc542878493f294cecb0f4c1be23ca58e2b2e6eb0bd9c4ce99 |   5   |   very good website   |
|   18/08/2026 23:05:03   |   raghuveer reddy   |   GBNHJYJJVL63GZ7IW7JBG75S5KVX5RIEC4L4XXFPCAUPYTCRX7GIOTKX   | https://stellar.expert/explorer/testnet/tx/1dc8f343f33fd9887d59911056411bc7c06dbdbf684ecfba6d95c117346636cd |   2   |   not satisfied needs improvement   |
|   19/08/2026 08:05:02   |   Modhu   |   GDI6BXPHUQFXURCUMQORUTWOYTMWJ5RVDVTSHCS3632ZBZ5BCCMMOMFT   | https://stellar.expert/explorer/testnet/tx/fee86f873784f0ebcf7b817c2049c0e2d48f92e766159bfee282c48e0ef8d641 |   5   |   nice nice nice   |
|   19/08/2026 13:06:47   |   Agnibha Roy   |   GAGQJDUFT7BYB4WJKJTDEUDXTVGHV6Z2ZKDSJGIMN75757BXGFAPNDDW   | https://stellar.expert/explorer/testnet/tx/7c69eba16e46800a50ca8493d101661ff42b00b5665f4854c8a3ddb6960392db |   4   |   good work   |
|   22/08/2026 12:39:05   |   Harshvardhan   |   GCAKX6MKRC34JN6YP653XJPGFERMQZUM3YIFPFHYJC5FU4OD2XHCPHRJ   | https://stellar.expert/explorer/testnet/tx/4ef4c390d681617cb90cc66237e257f3b887e07efede633008595295715c3776 |   5   |   its really nice   |
|   23/08/2026 13:22:15   |   Arundhati Bhowmick   |   GDTCQRZ3MKLZIKCMDKQSEUNZI2BEO25K2PVCP5XICIBAEDH4F4OOJ6QM   | https://stellar.expert/explorer/testnet/tx/b7a46a56da1e6644ac20289d9113f3b5b47d11d4b39a2fd9f353531aab18bfcc |   5   |   khub daarun   |
|   23/08/2026 13:39:25   |   Prosenjit Dutta   |   GCTDDLUMBDOSFCMGVH3W7Y3OBB3FEUI4UIMDD4YISC4HIX4GZPPW3YBC   | https://stellar.expert/explorer/testnet/tx/10079aa838a219a95cd6237f854f980b89c95c0280967b3a04e65302cfe44ed8 |   4   |   the website looks cool   |
|   23/08/2026 13:42:32   |   Tenzing Norbu   |   GCAFCCR7NQJA7V546XDX5DFAZ5GSU6QEN6BITPQ2O76XFQVUJZZQKI5S   | https://stellar.expert/explorer/testnet/tx/68ffd9897835ef4a4f6969800887f275753be8ee1b3b214c12c6f5f1f8a2d818 |   3   |   albedo is having some issues   |
|   23/08/2026 14:29:55   |   Priyanka Chaudhuri   |   GDOFIIWPEN6NLAB2YJY3XOKNWMX7GIVO76GNHHOEEAPOPDPDDYNBNASU   | https://stellar.expert/explorer/testnet/tx/269db9591e774350d87b48de5c3f417451d74b07b061312c6bc28a152ef55ad3 |   4   |   good website   |
|   23/08/2026 14:31:07   |   tanmoy Bosu   |   GAOJHVLA2UQMGMENRHH44P4U6NAEUPPZ2WYQKJ3NZCXDDXTTDFG35JNH   | https://stellar.expert/explorer/testnet/tx/251718fd585d7f5ef2159024f9acc0647cd6677a6f4fa34fcd8fb02bd1ed7c02 |   4   |   nice   |
|   23/08/2026 14:34:18   |   Varun Joshi   |   GB56VCMQT77RWTGNMQO6LBZ6SLKWFKXME5WYNKXWOVK66IM7AVBPNH2D   | https://stellar.expert/explorer/testnet/tx/b526ad2d65c3f8166836788de17826eb94e9e9e4d3e74b9ef8f105541dc9f716 |   3   |   could be more better though   |
|   23/08/2026 14:40:30   |   Suparna Nandi   |   GD7SJQORGGMS3L4LHOWV4CKAHVXRSZUYRV6NMXWLNP3QNLFIBPDPE5PJ   | https://stellar.expert/explorer/testnet/tx/0749d7ea36531878375e83b272961eb348b5476ff96b13a09820a6b45923d9f8 |   5   |   nice ui and design   |
|   23/08/2026 14:41:10   |   Indranil sen   |   GBHFTOQVLUG4AGRHSP5CPWU55TY7TOCILCDFICJTQVENYBBSJB56HQ5T   | https://stellar.expert/explorer/testnet/tx/2cc8b915e57e9e5bacffd8dc3b623a7928a1b6d3db42ff09b7bdbae0c7d16df1 |   3   |   i tried it tbh it is still not production grade   |
|   23/08/2026 14:41:42   |   Pradeep Sharma   |   GBEPUQGJA6JHNWIRLEUULGY5OC4YTJDQUVLT5IJF6VASLBRLJH5632QK   | https://stellar.expert/explorer/testnet/tx/f5a65acdb7a35399abbf3e9175c8b2505582d2f5ce1a2c0bb7f2a35303a40919 |   5   |   the idea is really amazing and innovative   |
|   23/08/2026 14:42:50   |   Jhumpa Biswas   |   GDKQTZAMJCQBPDPH6BGXWGKRMPL3ZLSBBJVKOPR547SNKRNH23V5SVSU   | https://stellar.expert/explorer/testnet/tx/52c89bd34919babdf53a1fc07d467fa34c4c7c9d29b3a426a3625a8801b7fb88 |   5   |   great job brother   |
|   23/08/2026 14:44:00   |   Aritra das   |   GACIXSJ46473TMPJNBXD7HEINX2VAT63LQBE5QYC7Y5JFJWAZARAG7W2   | https://stellar.expert/explorer/testnet/tx/0ad0ca572fda537e7b8a3f4a4404f3c470373f3b79bb19118e960e75ee269692 |   5   |   nice ui   |
|   23/08/2026 15:20:20   |   Kunal Deshmukh   |   GAX66KG6Q7DSTAGLR6CVOX7SYX5DIMSNKIED4W45B3BLZJHU6NWWIFWI   | https://stellar.expert/explorer/testnet/tx/33b775602c32acda9427e8a5d95fd819051453d4496b536b0efe3667f1a47bae |   4   |   good   |
|   23/08/2026 15:20:39   |   Suchismita Pal   |   GCBIQMO3REVQADHJU33MB3XR6MUSIEFBRAS366OVOZP7GCYQNADFYBC4   | https://stellar.expert/explorer/testnet/tx/bdfb3e29970abc9c612c858350d9cd6f0a0e509fce4b5d8334b9425fd7b00948 |   5   |   done bro good work   |
|   23/08/2026 15:21:41   |   Ritwik Ghosh   |   GAE6BRA5FIJT2LFZ3CCWFOKSGXFZJ6JEITZDQCNSC7RUUJRT6M26WDWN   | https://stellar.expert/explorer/testnet/tx/48ce20253bed7dd7c13636807c894983977aa717ff7d8409660e223fa6c232f4 |   5   |   dekh bhai transaction o korlam   |
|   23/08/2026 15:30:50   |   siddharth nair   |   GCGRMP4WDOJBAFULBH4QLDV7M7MCLAJQK3UUUE7XKCZIUAXDFCSCA7ZS   | https://stellar.expert/explorer/testnet/tx/6bbe97740571d7feb46911937e780d6b8c97a63097dcef3f1a7f6a0e0a096091 |   4   |   its been so long since u made something good   |
|   23/08/2026 19:22:00   |   sreelekha ghoshal   |   GCAXARZO2FBLTSMSQXAWIJOCGG7FRVWBNXSGJ3IUSPVWJITTOY6XIASQ   | https://stellar.expert/explorer/testnet/tx/e96e95a4ddbffa0fc162279fa9ff35d497ebcaf690bc41f21fb3a33d26f97050 |   5   |   the ui is amazing   |
|   23/08/2026 19:40:10   |   Subhashis Ray   |   GCEZ6KUXIHFTTAW6IJYLE4NXC33R5OCCBHUFZCY3SXFBEMHHFK3PUE36   | https://stellar.expert/explorer/testnet/tx/d7cfe2d11b8acba155e7d889bd7f5cb0c11827ca77bc5cea106300ceabc29c70 |   5   |   great   |
|   23/08/2026 19:41:59   |   Arvind Swaminathan   |   GBOTQIBQNALA477UGNHFS5P556RBR7GWRKIGO5HDVTATBYTUFE5ULYUC   | https://stellar.expert/explorer/testnet/tx/cfc918b12332a04b43577d13dda6d33feed203be20fe7cceee3fbff6701f5bda |   3   |   ai is a bit slow   |
|   23/08/2026 19:42:30   |   Deboleena Mitra   |   GCIP56RVQO32UXIY36FZPFECYZPAJOBXEPIKY4GEXCZC3TAPP6XQ6CPL   | https://stellar.expert/explorer/testnet/tx/6c5872f9ddf2e8efab18dd5293d038c4e6857eaf2aa599c45d944f22ba6f4075 |   4   |   great job but the syncing is taking time   |
|   23/08/2026 19:42:48   |   Sayan Ganguly   |   GB6CLWWEWKGR5W4HW427T6OTZQS6MVJBF332GUKVR6YS5L6YU7IVG4RJ   | https://stellar.expert/explorer/testnet/tx/b9fb9d761dbdf45551ef4940566bc011afb9bdcb2581e5b403793eadfd881911 |   5   |   amazing work   |
|   23/08/2026 19:42:55   |   Rohan Kulkarni   |   GCX7RT3RNOJ4SIYVPALPXKJFSTWOOGWXCPSM7E4VLSD6AITB3BOXUMPI   | https://stellar.expert/explorer/testnet/tx/92b430e62271900570ac1d89e2342d390196b8a506536536609857572f74ba3c |   4   |   mumbai kab aaoge bade bhai   |
|   23/08/2026 21:48:24   |   Paramita Roy   |   GBEZOCC7WBZN7A63Y6CMMFEWIXO36Q35FI4O3PCPIWYSRMZH5C4LXC74   | https://stellar.expert/explorer/testnet/tx/dfb7def880ea1a2c4dbf977fac64095316dcbff0e2205077b7aaa8e823b27171 |   4   |   good   |
|   23/08/2026 22:00:58   |   Soumyajit Mukherjee   |   GBO3F5XHMASTIOZJR4VMLJVY5QKXKWQPVE6RMO3WOZLNCVJINAOSWYDG   | https://stellar.expert/explorer/testnet/tx/339a57d58642a82df57e57a7e409bf01a2529dd9861df1c9ca973dcab3ad9cec |   5   |   the ai got guardrails i think nice work   |
|   23/08/2026 22:05:10   |   Aditya Varma   |   GBAEZMTWFG3PMMTVGVF24VMAUMNBCF2JQC6MLAKF3O6RICNFPM3JUND2   | https://stellar.expert/explorer/testnet/tx/476067231ccd2b76217de2d8dd29657b715b6116150df624439fd5b0ca71a10d |   5   |   It is very good and is quite fast   |
|   23/08/2026 22:40:01   |   Lopamudra Sengupta   |   GCJPBUOKWUI3NLBEYMU2YV2VM7BAC5ZDNPZNUTYYDXUN6DKFZZSMNK23   | https://stellar.expert/explorer/testnet/tx/affd1c052cdfee6e5f326bb4e3fa385f0c2e243448900874a56b4762d31086b8 |   5   |   baah daarun   |
|   23/08/2026 22:43:55   |   Debabrata Banerjee   |   GAQDZOG6EWIWWPYSE6KZ4KFS4I5P6CRRGHBM7ZMPYJLKOMSMP2T6QFJ2   | https://stellar.expert/explorer/testnet/tx/2d7fe34d6edf40323688d1d2eaacd3e1c9a9694fe4840f5bd30d5d42cfbbe388 |   5   |   ui is clean   |
|   24/08/2026 11:44:05   |   Vikramaditya Rathore   |   GAEW6JOC64EP3QZWZDNR32SFVZTRX7FGXEG2L5FAUS3IED4ON6FK3C4S   | https://stellar.expert/explorer/testnet/tx/de4ad3e8f5e719ce77d5cbd95dd321af55460cede3d444b755971472c2c5ee3c |   4   |   good   |
|   24/08/2026 11:44:15   |   Swastika Chatterjee   |   GB5YELQUQHJQHSGQP4FD6DC6YTGBT4LF7DHXAHU6GCAHKU4MAX2GOZPT   | https://stellar.expert/explorer/testnet/tx/7cb441ad722c08ed1c288e10774607012ebf98d41b6690033ed9e21a3669139f |   4   |   looks good but need more companies   |
|   24/08/2026 11:46:31   |   Anirban Chakraborty   |   GAFA2O72V23LV7WMTT774EHLBGLV7ETLOSG63TLJ6RWZT7FGUV4TM7ZZ   | https://stellar.expert/explorer/testnet/tx/8d788586933c87f67c6756afb31ab62e1752f5f3ff7fcbffef7530cc27a8dd4f |   5   |   bhai tui to kore cholechish. keep it up   |
|   24/08/2026 11:59:20   |   ankita barman   |   GCV5X5CKYUAPQLE3OYQS3PDXKX4TRV767YUCJ66PWWGZD2BXE744T276   | https://stellar.expert/explorer/testnet/tx/cd568412107aa05870cfa767d6d7ee1c1c980e48036c18045862512199c78bc3 |   4   |   Good   |
|   24/08/2026 12:10:45   |   Sandipan Singh   |   GDYIHXTUKLCPZHWGGD5B5ZPJZINZ3WUNC3PJCDAYEB4XY4LT2XNTQHTX   | https://stellar.expert/explorer/testnet/tx/845f3cbac42942212070c3a8c15f5f3ebc667a5f7c55df78634dfb95f7bf6f7c |   4   |   Its pretty good, keep it up scale it   |
|  24/08/2026 12:30:01  |  Aditya Jha  |  GAG3SUKHIF7VAWGTDRH52XETMLZXXNXBAZLLXHSLXAQPOBBCN43YLKR4  |  -  |  4  |  I like the product its nice. But needed more work on UI.  |
|  24/08/2026 12:45:05  |  Arya Bhagat  |  GCNZDOHRGJLUKX53TR5PETCO7Q3BKKWVS5K5GQ3NPFZYQ4MKY2BK6A32  |  -  |  4  |  its a good project to start with  |
|  24/08/2026 19:45:35  |  Subhadip Dutta  |  GAVNLCS3GSWLKXSLZ3ITSL7QNB5IGHEOELXAF6QTYACDLEJ7XRQKBBNO  |  -  |  5  |  Very nice ui and the idea is quite innovative  |
|  24/08/2026 19:45:40  |  Ankush Shaw  |  GBBIG4HLPGTLG6BH6YREVWJXEQ4NX74HTD444JD6A6XYS7DOFL2J6DEI  |  -  |  5  |  the main feature i liked was ui, how clean it looks  |
|  24/08/2026 19:46:56  |  Sadiya Mulani  |  GBTCGV43NLHEEBMCA5DWFZT6GOJYYCPHXNOEALTBQ7TREIQKQQAVLYT4  |  -  |  5  |  Cool concept. AI-verified, wallet-owned credentials  |
|  24/08/2026 19:47:10  |  Nitin Raj  |  GARRE4DTEUJIQSXRACCL6X55RH42S7WBO32F5HB4DU32MT6IL5TL3B3N  |  -  |  5  |  Great experience! Clean UI, easy to use  |
|  24/08/2026 19:47:26  |  Rishikesh Singh  |  GCO222KICSTS24BWPBEOSYQG5L3RAN4KHII7CE2CW36HRHRXQQPC6OCB  |  -  |  5  |  I really like the ui and credential hashing  |
|  24/08/2026 19:48:36  |  Elijah Negasi  |  GAXCXDDP44VRDTL2PJI22WJU6H4CMRMI2CHRJGPJ3S3L4R323ETDOCAL  |  -  |  5  |  amazing!  |
|  24/08/2026 21:00:20  |  Ritam Saha  |  GACMLTEWZ23NGJ5WZ2THYGLODFYTEKECB7J2U33H3DCSW2PEAQUEIZED  |  -  |  4  |  Good  |
|  24/08/2026 21:02:56  |  Priyanka Mondal  |  GCKMODNZEAI4X6AL6SL77PNJLUUJAQAWECXDTXJZGXBOSSSF7THC3XH6  |  -  |  5  |  better product than other in market  |
|  24/08/2026 21:18:06  |  Ritesh Gupta  |  GDFSDPEEBZYQVG5JPPTJUOH4FID4M5XV45BKTWCIEIRYMCWJ6DQADBMB  |  -  |  4  |  yup  |
|  24/08/2026 21:30:16  |  Sk Jishan Uddin  |  GAVVOOVYGE7QEJWQO2BZZBGYYSFQPBC3QAYWRC6AFP7E3UMCWFT6YC4U  |  -  |  5  |  Very Very Good, very user friendly  |
|  24/08/2026 21:45:57  |  Lohit Mishra  |  GDYWYDOBPPM2XFQS2N7OA2XYO66C24OSBDGASSYAU7V3V4UHFIQYWCRL  |  -  |  3  |  Ui is great but server errors occurring  |
|  24/08/2026 21:47:36  |  pritam dev  |  GATJMD6BGNK4FQYNFWB354N7RP4XHA2R74GNSYM472ALNLJFX7NXBS3X  |  -  |  5  |  awesome product  |
|  24/08/2026 22:41:16  |  Ansh Raj  |  GA3EHDIPTPLQTQESCNR4TSJYBSERD57KERCNFHGWEJ5OX2XSWTMJO424  |  -  |  4  |  its really good  |
|  24/08/2026 22:41:20  |  Amitabh Dey  |  GBKYHWSL2MNUO73HWY6KWNOA64AKSUENCOBTR56M66HNLMMKMZHK5OAS  |  -  |  5  |  really good ui and interactive game  |
|  24/08/2026 22:43:12  |  Neel Madhav  |  GBO7BZSNAX6APJW32OE5LHXQZ6MTIHBTWRZZRCJL3VSILWCAZLGCPM4T  |  -  |  4  |  The gameplay is good but needs improvement  |
|  24/08/2026 22:45:07  |  Harsh Mitra  |  GDHYPRZCSOHMGPVM3XETQL3AXUBVLPCLUR4LSYW4QOC7AKR5MWGXAEND  |  -  |  5  |  very good  |
|  24/08/2026 22:47:51  |  Debansh Tiwari  |  GA4SXARZZ4RPF6N7VOAH3B5OKMFAP3FGY6M6TO3DZJL4TMU2KOVBHCIY  |  -  |  4  |  The overall experience is smooth. Liked the product!  |
|  24/08/2026 22:50:01  |  Syed Ghufran Hassan  |  GDNKF4Q474WVV5CCRLKIM53HCKRB7AN5O7DVD6GYYAEGXZEBD2KVB723  |  -  |  5  |  If we can have a roadmap for basic understanding then it would be great for beginners  |
|  24/08/2026 22:51:01  |  harshit kumar  |  GB3OASNQ4B3DBZBXXT4UW3WXGQRMUBHXK3WAVH2VOWUHR6BUWHFKTVKI  |  -  |  5  |  Everything is good, best one till now.  |
|  24/08/2026 22:57:49  |  Abhi mandal  |  GDD4VQG7DXQTQ4SM32Q5GMTYCJAKPRPDHUYRMRWBBW5SLOLOTPGEQXKF  |  -  |  4  |  overall good and best.  |
|  24/08/2026 22:59:41  |  Manish sharma  |  GC5D7MTHTTEINHVN3W6JCNROFRAI4ZXDMYI4GYTR5L46TKNWSJHDXYZ2  |  -  |  5  |  Good.  |
|  24/08/2026 23:01:25  |  Disha  |  GCFHMXPIVQPNUZGXQUQDAT656UBVEL6RCRDKMPJ3FCT73CODOKNJFMXF  |  -  |  5  |  one of the best till now i saw.  |
|  24/08/2026 23:05:04  |  Supriyo mandal  |  GABKZVXSUGV7P24X24EEF3LTNKZRSWBNT6D77DER7XVLVX77WKEID2XA  |  -  |  5  |  overall it is the among the best, after seeing others.  |
|   24/08/2026 23:12:15   |   SK JISHAN UDDIN   |   GAVVOOVYGE7QEJWQO2BZZBGYYSFQPBC3QAYWRC6AFP7E3UMCWFT6YC4U   | https://stellar.expert/explorer/testnet/tx/d5bd5b60c643767cb355fabde02a8426cdc2d4103bde2576251e20aeb3416103 |   5   |   “Really impressive work, bro. Keep building! 🚀”   |
|  24/08/2026 23:12:55  |  RITESH GUPTA  |  GDFSDPEEBZYQVG5JPPTJUOH4FID4M5XV45BKTWCIEIRYMCWJ6DQADBMB  |  none  |  2  |  none baby  |
|   25/08/2026 02:00:54   |   riyam lahu   |   GATJMD6BGNK4FQYNFWB354N7RP4XHA2R74GNSYM472ALNLJFX7NXBS3X   | https://stellar.expert/explorer/testnet/tx/6bd2cc147f99f17e373c6ce507176611700b9a63ca46a2c4c8b70f847d5d0bf7 |   4   |   good nice   |
|  25/08/2026 10:41:47  |  Shubham Raj  |  GAQW2UZBSRIQVW7YVS3GFYGMAJOXWQLTCTXXI3F7IZWQBTAAVENVFISW  |  -  |  4  |  great experience  |
|  25/08/2026 13:40:40  |  Debansh Tiwari  |  GA4SXARZZ4RPF6N7VOAH3B5OKMFAP3FGY6M6TO3DZJL4TMU2KOVBHCIY  |  -  |  4  |  The overall experience is smooth. Liked the product!  |
### Admin-panel interaction evidence

The following screenshots show the NoodleNova admin panel with the registered-courier list, transaction log, and user-feedback records. The supplied views show **69 registered couriers**, **40 transaction-log entries**, and **69 user-feedback records**.

![Noodle Nova admin panel showing registered couriers and transaction log](submission/admin-panel-user-onboarding.png)

![Noodle Nova admin panel showing user feedback records](submission/admin-panel-feedback.png)

Because both screenshots contain names, wallet-address fragments, transaction identifiers, and other user-related fields, they should be treated as sensitive submission evidence and not redistributed beyond the authorized review process. The analysis in [`submission/feedback-summary.md`](submission/feedback-summary.md) intentionally reports aggregate results instead of reproducing the raw rows.

## Feedback Summary

The current shared sheet contains **80 responses**, all with a wallet-address field and written feedback. Ratings average **4.34/5**, with the following distribution: **40 five-star**, **30 four-star**, **7 three-star**, and **3 two-star** responses. The sheet contains **42 non-placeholder transaction-hash values**; these values are evidence candidates only and are not independently verified here as successful Stellar transactions. The responses span **16–25 August 2026**. Feedback is predominantly positive about the interface and overall experience, while gameplay refinement remains the clearest improvement theme.

The table above is the complete current-sheet row-level evidence. The separate [`submission/user-onboarding-table.md`](submission/user-onboarding-table.md) remains available as the privacy-safe public version with masked emails and shortened identifiers.
* **User Experience:** Players consistently describe the interface as visually appealing, engaging, and among the best they have encountered.
 * **Gameplay Development:** While the current gameplay is viewed positively, feedback indicates that it still requires further refinement and improvement.

## Admin and Privacy Note

The authorized admin panel was reviewed as a private operational evidence source. Its access token is intentionally not linked, copied, or published here. The public submission package uses only sanitized counts and verification status. Any final reviewer package that needs full wallet addresses or transaction hashes should be shared through the appropriate private submission channel, not committed to a public repository unless those records have been explicitly consented for publication.

## Testnet Note

Stellar Testnet resets periodically. A reset can remove Testnet accounts, transaction history, and contract data; redeploy and generate new proof transactions if a reset occurs before review.

## References

[1]: https://github.com/SujAnverse1125/NoodleNova "NoodleNova public repository" 
[2]: https://noodle-nova-seven.vercel.app/ "Noodle Nova live deployment"
[2]: https://lab.stellar.org/r/testnet/contract/CC42H6ONIV2527FPJZFTWV7UZNMWCEZDKZZNCNVF3ZN4ZWTXPIUKSBCM "Noodle Nova DeliveryEscrow contract on Stellar Lab Testnet"
[4]: https://stellar.expert/explorer/testnet/tx/c4ba73be851893fca97e42b724e3ce1cc1a8aba200748b0436eaea64e395dad6 "Noodle Nova deployment transaction on Stellar Expert Testnet"
[5]: https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUWn/view?usp=drive_link "Noodle Nova demo video"
