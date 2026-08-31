# Noodle Nova
 
**Live Demo:** [https://noodle-nova-seven.vercel.app/](https://noodle-nova-seven.vercel.app/)
**Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1N6QC__iKYQbef9ZXsaxMIjnC2TDsDUwN/view?usp=drive_link)

Noodle Nova is a Stellar Testnet dApp that presents a gamified ramen-delivery experience. Users can connect a Freighter wallet, view their XLM balance and recent activity, and send Testnet XLM. The project also includes a Soroban delivery-escrow contract that locks XLM until a sponsored delivery is completed.

> Testnet only. Do not use real funds.

Product UI
![Product UI](/public/product-ui.png)

User Feedback System
![Feedback UI](/public/feedback-ui.png)

Mobile responsive UI 
<img width="1080" height="2408" alt="Screenshot_20260814_192952" src="https://github.com/user-attachments/assets/cf6d1288-5394-4c36-81ca-114c1205f94b" />

CI/CD pipeline running
![CI/CD Pipeline](/public/cicd-pipeline.png)

Test output with 3+ passing tests
![Test Output](/public/test-output.png)


## Features

- Freighter wallet connection
- Testnet XLM balance and recent transaction feed
- XLM payment form with validation, loading, and error states
- Responsive Next.js interface
- Soroban escrow panel wired to `create_delivery`, `get_delivery`, and `complete_delivery`
- Token-contract transfers and `DeliveryCreated` / `DeliveryCompleted` events
- Three Rust unit tests for the delivery flow and invalid repeat operations

## Deployed contract and proof

| Item | Value |
| --- | --- |
| Network | Stellar Testnet |
| DeliveryEscrow contract | [`CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE`](https://lab.stellar.org/r/testnet/contract/CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE) |
| Native XLM asset contract | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Contract WASM hash | `ee3892dbe6df123ee75180a44674bf55040c422372f8684ea90f107d6548c1cb` |
| Deployment transaction | [`42679eee67139ebbbc386a2b2b5db4c88dec4019093a703bd7b55c849514b326`](https://stellar.expert/explorer/testnet/tx/42679eee67139ebbbc386a2b2b5db4c88dec4019093a703bd7b55c849514b326) |
| Create-delivery transaction | [`8ce1826b7c730870ca6423039f34c5b18d709e33caee18c1cb7bfccb31b0e87b`](https://stellar.expert/explorer/testnet/tx/8ce1826b7c730870ca6423039f34c5b18d709e33caee18c1cb7bfccb31b0e87b) |
| Complete-delivery transaction | [`4b8746ebc5eae823aa1e9ff679415f2a059dda7412f40f5a135a3b8aaab7cfd9`](https://stellar.expert/explorer/testnet/tx/4b8746ebc5eae823aa1e9ff679415f2a059dda7412f40f5a135a3b8aaab7cfd9) |

The verified current Testnet flow created delivery `2`, locked 1 XLM in escrow, emitted `DeliveryCreated`, then completed the delivery, released the 1 XLM to the courier, and emitted `DeliveryCompleted`.

## Architecture

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Wallet and payments:** `@stellar/freighter-api` and `@stellar/stellar-sdk`
- **Smart contract:** Rust with Soroban SDK `27.0.6`
- **CI configuration:** GitHub Actions validates frontend tests/build plus Rust formatting, linting, tests, and deployable Soroban WASM
- **Frontend deployment:** `vercel.json` provides the Vercel install and build configuration

The contract uses Stellar's native asset contract through `token::Client` to transfer funds from the sponsor to escrow, then from escrow to the courier after completion. The Sponsor Routes page prepares each contract call with Soroban RPC, requests a Freighter signature, and submits it to Testnet.

## Run locally

Prerequisites: Node.js 20+, Rust, and the Stellar CLI.

```bash
git clone https://github.com/SujAnverse1125/NoodleNova.git
cd NoodleNova
npm install
npm run dev
```

Open `http://localhost:3000`.

Copy `.env.local.example` to `.env.local`. The current Testnet contract ID is included as a safe public default, but it can be overridden after a future deployment:

```env
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID=CBEXVMRWS6DG7QRMRS5WBBHYME5UUY4L3ZZ6IUTTERQHBGHBY7B5MDXE
```

## Test and build

```bash
# Frontend production build
npm run build

# Frontend tests
npm test

# Contract checks
cd contracts/delivery_escrow
cargo fmt -- --check
cargo clippy --all-targets -- -D warnings -A deprecated
cargo test
stellar contract build
```

Current contract test result: **3 passed, 0 failed**.

## Deploy the contract

The deployment script builds the WASM and deploys it to Testnet. Provide a Testnet-only deployer secret through the environment; never commit it.

```bash
STELLAR_DEPLOYER_SECRET=your_testnet_secret ./scripts/deploy-testnet-contract.sh
```

Update `NEXT_PUBLIC_DELIVERY_ESCROW_CONTRACT_ID` in your Vercel project and local environment with the returned `C...` address after deployment.

## Contract interface

```text
create_delivery(delivery_id, sponsor, courier, token, amount)
complete_delivery(delivery_id)
get_delivery(delivery_id)
```

`create_delivery` requires sponsor authorization and transfers the requested token amount into the contract. `complete_delivery` requires the stored sponsor's authorization and releases the escrowed funds to the courier.

## Testnet note

Stellar Testnet resets periodically. A reset can remove Testnet accounts, transaction history, and contract data; redeploy and generate new proof transactions if a reset occurs before review.

## User Data (Test Seed)

| # | Name | Wallet Address | Feedback | Rating | Date |
|---|------|----------------|----------|--------|------|
| 1 | Debansh Tiwari | `GA4SXARZZ4RPF6N7VOAH3B5OKMFAP3FGY6M6TO3DZJL4TMU2KOVBHCIY` | The overall experience is smooth. Liked the product! | 4 | 2026-08-16 |
| 2 | Souvik Mandal | `GDDO6MEIVRZTXCJWLPPQAKTIWTD6CLOTGLJBQY63KMOIYASKXNU6WXN5` | Liked the idea. Amazing UI/UX. | 5 | 2026-08-16 |
| 3 | Ansh Raj | `GA3EHDIPTPLQTQESCNR4TSJYBSERD57KERCNFHGWEJ5OX2XSWTMJO424` | its really good | 4 | 2026-08-16 |
| 4 | pritam dev | `GATJMD6BGNK4FQYNFWB354N7RP4XHA2R74GNSYM472ALNLJFX7NXBS3X` | awesome product | 5 | 2026-08-17 |
| 5 | Lohit Mishra | `GDYWYDOBPPM2XFQS2N7OA2XYO66C24OSBDGASSYAU7V3V4UHFIQYWCRL` | Ui is great but server errors occurring | 3 | 2026-08-17 |
| 6 | Sk Jishan Uddin | `GAVVOOVYGE7QEJWQO2BZZBGYYSFQPBC3QAYWRC6AFP7E3UMCWFT6YC4U` | Very Very Good, very user friendly | 5 | 2026-08-17 |
| 7 | Ritesh Gupta | `GDFSDPEEBZYQVG5JPPTJUOH4FID4M5XV45BKTWCIEIRYMCWJ6DQADBMB` | yup | 4 | 2026-08-18 |
| 8 | Priyanka Mondal | `GCKMODNZEAI4X6AL6SL77PNJLUUJAQAWECXDTXJZGXBOSSSF7THC3XH6` | better product than other in market | 5 | 2026-08-18 |
| 9 | Ritam Saha | `GACMLTEWZ23NGJ5WZ2THYGLODFYTEKECB7J2U33H3DCSW2PEAQUEIZED` | Good | 4 | 2026-08-18 |
| 10 | Elijah Negasi | `GAXCXDDP44VRDTL2PJI22WJU6H4CMRMI2CHRJGPJ3S3L4R323ETDOCAL` | amazing! | 5 | 2026-08-18 |
| 11 | Rishikesh Singh | `GCO222KICSTS24BWPBEOSYQG5L3RAN4KHII7CE2CW36HRHRXQQPC6OCB` | I really like the ui and credential hashing | 5 | 2026-08-18 |
| 12 | Nitin Raj | `GARRE4DTEUJIQSXRACCL6X55RH42S7WBO32F5HB4DU32MT6IL5TL3B3N` | Great experience! Clean UI, easy to use | 5 | 2026-08-18 |
| 13 | Sadiya Mulani | `GBTCGV43NLHEEBMCA5DWFZT6GOJYYCPHXNOEALTBQ7TREIQKQQAVLYT4` | Cool concept. AI-verified, wallet-owned credentials | 5 | 2026-08-18 |
| 14 | Ankush Shaw | `GBBIG4HLPGTLG6BH6YREVWJXEQ4NX74HTD444JD6A6XYS7DOFL2J6DEI` | the main feature i liked was ui, how clean it looks | 5 | 2026-08-18 |
| 15 | Subhadip Dutta | `GAVNLCS3GSWLKXSLZ3ITSL7QNB5IGHEOELXAF6QTYACDLEJ7XRQKBBNO` | Very nice ui and the idea is quite innovative | 5 | 2026-08-18 |
| 16 | Arya Bhagat | `GCNZDOHRGJLUKX53TR5PETCO7Q3BKKWVS5K5GQ3NPFZYQ4MKY2BK6A32` | its a good project to start with | 4 | 2026-08-18 |
| 17 | Aditya Jha | `GAG3SUKHIF7VAWGTDRH52XETMLZXXNXBAZLLXHSLXAQPOBBCN43YLKR4` | I like the product its nice. But needed more work on UI. | 4 | 2026-08-18 |
| 18 | Sandipan Singh | `GDYIHXTUKLCPZHWGGD5B5ZPJZINZ3WUNC3PJCDAYEB4XY4LT2XNTQHTX` | Its pretty good, keep it up scale it | 4 | 2026-08-19 |
| 19 | ankita barman | `GCV5X5CKYUAPQLE3OYQS3PDXKX4TRV767YUCJ66PWWGZD2BXE744T276` | Good | 4 | 2026-08-19 |
| 20 | Anirban Chakraborty | `GAFA2O72V23LV7WMTT774EHLBGLV7ETLOSG63TLJ6RWZT7FGUV4TM7ZZ` | bhai tui to kore cholechish. keep it up | 5 | 2026-08-22 |
| 21 | Swastika Chatterjee | `GB5YELQUQHJQHSGQP4FD6DC6YTGBT4LF7DHXAHU6GCAHKU4MAX2GOZPT` | looks good but need more companies | 4 | 2026-08-23 |
| 22 | Vikramaditya Rathore | `GAEW6JOC64EP3QZWZDNR32SFVZTRX7FGXEG2L5FAUS3IED4ON6FK3C4S` | good | 4 | 2026-08-23 |
| 23 | Debabrata Banerjee | `GAQDZOG6EWIWWPYSE6KZ4KFS4I5P6CRRGHBM7ZMPYJLKOMSMP2T6QFJ2` | ui is clean | 5 | 2026-08-23 |
| 24 | Lopamudra Sengupta | `GCJPBUOKWUI3NLBEYMU2YV2VM7BAC5ZDNPZNUTYYDXUN6DKFZZSMNK23` | baah daarun | 5 | 2026-08-23 |
| 25 | Aditya Varma | `GBAEZMTWFG3PMMTVGVF24VMAUMNBCF2JQC6MLAKF3O6RICNFPM3JUND2` | It is very good and is quite fast | 5 | 2026-08-23 |
| 26 | Soumyajit Mukherjee | `GBO3F5XHMASTIOZJR4VMLJVY5QKXKWQPVE6RMO3WOZLNCVJINAOSWYDG` | the ai got guardrails i think nice work | 5 | 2026-08-23 |
| 27 | Paramita Roy | `GBEZOCC7WBZN7A63Y6CMMFEWIXO36Q35FI4O3PCPIWYSRMZH5C4LXC74` | good | 4 | 2026-08-23 |
| 28 | Rohan Kulkarni | `GCX7RT3RNOJ4SIYVPALPXKJFSTWOOGWXCPSM7E4VLSD6AITB3BOXUMPI` | mumbai kab aaoge bade bhai | 4 | 2026-08-23 |
| 29 | Sayan Ganguly | `GB6CLWWEWKGR5W4HW427T6OTZQS6MVJBF332GUKVR6YS5L6YU7IVG4RJ` | amazing work | 5 | 2026-08-23 |
| 30 | Deboleena Mitra | `GCIP56RVQO32UXIY36FZPFECYZPAJOBXEPIKY4GEXCZC3TAPP6XQ6CPL` | great job but the syncing is taking time | 4 | 2026-08-23 |
| 31 | Arvind Swaminathan | `GBOTQIBQNALA477UGNHFS5P556RBR7GWRKIGO5HDVTATBYTUFE5ULYUC` | ai is a bit slow | 3 | 2026-08-23 |
| 32 | Subhashis Ray | `GCEZ6KUXIHFTTAW6IJYLE4NXC33R5OCCBHUFZCY3SXFBEMHHFK3PUE36` | great | 5 | 2026-08-23 |
| 33 | sreelekha ghoshal | `GCAXARZO2FBLTSMSQXAWIJOCGG7FRVWBNXSGJ3IUSPVWJITTOY6XIASQ` | the ui is amazing | 5 | 2026-08-23 |
| 34 | siddharth nair | `GCGRMP4WDOJBAFULBH4QLDV7M7MCLAJQK3UUUE7XKCZIUAXDFCSCA7ZS` | its been so long since u made something good | 4 | 2026-08-23 |
| 35 | Ritwik Ghosh | `GAE6BRA5FIJT2LFZ3CCWFOKSGXFZJ6JEITZDQCNSC7RUUJRT6M26WDWN` | dekh bhai transaction o korlam | 5 | 2026-08-23 |
| 36 | Suchismita Pal | `GCBIQMO3REVQADHJU33MB3XR6MUSIEFBRAS366OVOZP7GCYQNADFYBC4` | done bro good work | 5 | 2026-08-23 |
| 37 | Kunal Deshmukh | `GAX66KG6Q7DSTAGLR6CVOX7SYX5DIMSNKIED4W45B3BLZJHU6NWWIFWI` | good | 4 | 2026-08-23 |
| 38 | Aritra das | `GACIXSJ46473TMPJNBXD7HEINX2VAT63LQBE5QYC7Y5JFJWAZARAG7W2` | nice ui | 5 | 2026-08-23 |
| 39 | Jhumpa Biswas | `GDKQTZAMJCQBPDPH6BGXWGKRMPL3ZLSBBJVKOPR547SNKRNH23V5SVSU` | great job brother | 5 | 2026-08-23 |
| 40 | Pradeep Sharma | `GBEPUQGJA6JHNWIRLEUULGY5OC4YTJDQUVLT5IJF6VASLBRLJH5632QK` | the idea is really amazing and innovative | 5 | 2026-08-23 |
| 41 | Indranil sen | `GBHFTOQVLUG4AGRHSP5CPWU55TY7TOCILCDFICJTQVENYBBSJB56HQ5T` | i tried it tbh it is still not production grade | 3 | 2026-08-23 |
| 42 | Suparna Nandi | `GD7SJQORGGMS3L4LHOWV4CKAHVXRSZUYRV6NMXWLNP3QNLFIBPDPE5PJ` | nice ui and design | 5 | 2026-08-23 |
| 43 | Varun Joshi | `GB56VCMQT77RWTGNMQO6LBZ6SLKWFKXME5WYNKXWOVK66IM7AVBPNH2D` | could be more better though | 3 | 2026-08-23 |
| 44 | tanmoy Bosu | `GAOJHVLA2UQMGMENRHH44P4U6NAEUPPZ2WYQKJ3NZCXDDXTTDFG35JNH` | nice | 4 | 2026-08-23 |
| 45 | Priyanka Chaudhuri | `GDOFIIWPEN6NLAB2YJY3XOKNWMX7GIVO76GNHHOEEAPOPDPDDYNBNASU` | good website | 4 | 2026-08-23 |
| 46 | Tenzing Norbu | `GCAFCCR7NQJA7V546XDX5DFAZ5GSU6QEN6BITPQ2O76XFQVUJZZQKI5S` | albedo is having some issues | 3 | 2026-08-23 |
| 47 | Prosenjit Dutta | `GCTDDLUMBDOSFCMGVH3W7Y3OBB3FEUI4UIMDD4YISC4HIX4GZPPW3YBC` | the website looks cool | 4 | 2026-08-24 |
| 48 | Arundhati Bhowmick | `GDTCQRZ3MKLZIKCMDKQSEUNZI2BEO25K2PVCP5XICIBAEDH4F4OOJ6QM` | khub daarun | 5 | 2026-08-24 |
| 49 | Harshvardhan | `GCAKX6MKRC34JN6YP653XJPGFERMQZUM3YIFPFHYJC5FU4OD2XHCPHRJ` | its really nice | 5 | 2026-08-24 |
| 50 | Agnibha Roy | `GAGQJDUFT7BYB4WJKJTDEUDXTVGHV6Z2ZKDSJGIMN75757BXGFAPNDDW` | good work | 4 | 2026-08-24 |
| 51 | Modhu | `GDI6BXPHUQFXURCUMQORUTWOYTMWJ5RVDVTSHCS3632ZBZ5BCCMMOMFT` | nice nice nice | 5 | 2026-08-24 |
| 52 | raghuveer reddy | `GBNHJYJJVL63GZ7IW7JBG75S5KVX5RIEC4L4XXFPCAUPYTCRX7GIOTKX` | not satisfied needs improvement | 2 | 2026-08-24 |
| 53 | Koushik Bhattacharya | `GDGMPZCD6ANI2UO4QPXK7OEWB7O6DVOCKZRZCCITI7E3PS2VH452BWSP` | very good website | 5 | 2026-08-24 |
| 54 | Kakali Sarkar | `GDJVC4R42U5AT4BJXG3NQZ3Q6CWJUEVV4PTNE5Y7M6NYPX3BS37KZQSW` | good | 4 | 2026-08-25 |
| 55 | Rintaro | `GASWJJS6ZGUTW3U2PF66DXSKE7UETIWH4LDGBWOK7ZMGNAMK5SUVNQ23` | good | 4 | 2026-08-24 |
| 56 | Nilanjan Majumdar | `GDZICGWBWRD2YPYWQ4KEMK5KTOLDDXDI7VCGXFMSNB6HFUKKBYGWTMDS` | nice work | 5 | 2026-08-24 |
| 57 | Srinwanti Kar | `GALGGCLBTNDTM2FMPMZI2FTPKWI4SUAZKIFZUDLR24NRTXYHBQIPKCPK` | great and awesome specially the landing page | 5 | 2026-08-24 |
| 58 | Ananya Hegde | `GD7MXNTHHCPXFFKTHCZPKIRILUUVJZF5EPDTXD4Z2732ACNI7QW4RIBQ` | the app looks good | 4 | 2026-08-24 |
| 59 | Tathagata Guha | `GAV4OONA2FR27GKZXDD3SNVPYH44MQN5GTGFWUCS24CBEIDNCYA3W2FI` | you should add more like freighter | 4 | 2026-08-24 |
| 60 | Sneha Iyer | `GBVNXXTGFSF3ZK6QF5EHWU6NKY7Z7DIZTRRPL4OVKFQRKSHCOD57QFXF` | nice work | 5 | 2026-08-24 |
| 61 | Kavya Menon | `GCYX25F52SFDKGY7WSAE7SLATKN25ZKCYYAQ4I4JGW7BIKTHYSM6NL5E` | really useful if it spreads more | 4 | 2026-08-24 |
| 62 | Meera Rao | `GCCBXKAU2BZX5CHBDW3TPR3NYX7BAZPDIZFVAOVYQGTKMNXVGGCGFSKC` | not good | 2 | 2026-08-24 |
| 63 | Krishna Merchant | `GD7QFNWWBHYJKBKFIRHJIFSFZRH2BCAZ7LIVZHG6AEZ4GURLUD44HOPO` | need improvement | 3 | 2026-08-24 |
| 64 | Priya Kapoor | `GCXHPXT45FE3O55RZTECBQQ3IWOUHQOU3GHNIGGU3Q7CKUX7ULIXVP4K` | good ui | 4 | 2026-08-24 |
| 65 | Shreya Agarwal | `GB5CRKDHZ2PCZKTTH3HPKAPIKUBIPAAEW66A3YSTZZFQM53J4QEGZUMG` | not so helpful for non techies | 3 | 2026-08-24 |
| 66 | Pooja Gowda | `GC7DECKZ6GEOI3XGGZG5D3NZIOYRLNP77J7LEALDPIPWHU6DNCLND4RL` | wow | 5 | 2026-08-24 |
| 67 | Ishita Mehta | `GD5VMIJR247PGGHES76I4PXP73G7UTXZRYH6BXI3YF5G5HCKJ6NR4ELL` | its really awesome | 5 | 2026-08-24 |
| 68 | neha shekhawat | `GCKHZK6HQ4MXJXVKOYJZXKMTDNZYRXIFG4DZSBUSI6Z5F7Q3WWAJFCQM` | the structure looks good | 4 | 2026-08-24 |
| 69 | Diksha Borah | `GDZ2LJXLRTS2GMSIQVXXDVLAT6FJZ7FORSYTKXJZICLICW3L7KUNEC6F` | nice | 4 | 2026-08-24 |

## Transaction Log (40 Records)

| # | Tx Hash | Wallet | Type | Date |
|---|---------|--------|------|------|
| 1 | `8d788586933c87f67c6756afb31ab62e1752f5f3ff7fcbffef7530cc27a8dd4f` | `GAFA2O72V23LV7WMTT774EHLBGLV7ETLOSG63TLJ6RWZT7FGUV4TM7ZZ` | sponsor_route | 2026-08-22 |
| 2 | `7cb441ad722c08ed1c288e10774607012ebf98d41b6690033ed9e21a3669139f` | `GB5YELQUQHJQHSGQP4FD6DC6YTGBT4LF7DHXAHU6GCAHKU4MAX2GOZPT` | delivery_funded | 2026-08-23 |
| 3 | `de4ad3e8f5e719ce77d5cbd95dd321af55460cede3d444b755971472c2c5ee3c` | `GAEW6JOC64EP3QZWZDNR32SFVZTRX7FGXEG2L5FAUS3IED4ON6FK3C4S` | sponsor_route | 2026-08-23 |
| 4 | `2d7fe34d6edf40323688d1d2eaacd3e1c9a9694fe4840f5bd30d5d42cfbbe388` | `GAQDZOG6EWIWWPYSE6KZ4KFS4I5P6CRRGHBM7ZMPYJLKOMSMP2T6QFJ2` | delivery_completed | 2026-08-23 |
| 5 | `affd1c052cdfee6e5f326bb4e3fa385f0c2e243448900874a56b4762d31086b8` | `GCJPBUOKWUI3NLBEYMU2YV2VM7BAC5ZDNPZNUTYYDXUN6DKFZZSMNK23` | sponsor_route | 2026-08-23 |
| 6 | `476067231ccd2b76217de2d8dd29657b715b6116150df624439fd5b0ca71a10d` | `GBAEZMTWFG3PMMTVGVF24VMAUMNBCF2JQC6MLAKF3O6RICNFPM3JUND2` | game_win | 2026-08-23 |
| 7 | `339a57d58642a82df57e57a7e409bf01a2529dd9861df1c9ca973dcab3ad9cec` | `GBO3F5XHMASTIOZJR4VMLJVY5QKXKWQPVE6RMO3WOZLNCVJINAOSWYDG` | delivery_funded | 2026-08-23 |
| 8 | `dfb7def880ea1a2c4dbf977fac64095316dcbff0e2205077b7aaa8e823b27171` | `GBEZOCC7WBZN7A63Y6CMMFEWIXO36Q35FI4O3PCPIWYSRMZH5C4LXC74` | sponsor_route | 2026-08-23 |
| 9 | `92b430e62271900570ac1d89e2342d390196b8a506536536609857572f74ba3c` | `GCX7RT3RNOJ4SIYVPALPXKJFSTWOOGWXCPSM7E4VLSD6AITB3BOXUMPI` | send_xlm | 2026-08-23 |
| 10 | `b9fb9d761dbdf45551ef4940566bc011afb9bdcb2581e5b403793eadfd881911` | `GB6CLWWEWKGR5W4HW427T6OTZQS6MVJBF332GUKVR6YS5L6YU7IVG4RJ` | send_xlm | 2026-08-23 |
| 11 | `6c5872f9ddf2e8efab18dd5293d038c4e6857eaf2aa599c45d944f22ba6f4075` | `GCIP56RVQO32UXIY36FZPFECYZPAJOBXEPIKY4GEXCZC3TAPP6XQ6CPL` | delivery_funded | 2026-08-23 |
| 12 | `cfc918b12332a04b43577d13dda6d33feed203be20fe7cceee3fbff6701f5bda` | `GBOTQIBQNALA477UGNHFS5P556RBR7GWRKIGO5HDVTATBYTUFE5ULYUC` | sponsor_route | 2026-08-23 |
| 13 | `d7cfe2d11b8acba155e7d889bd7f5cb0c11827ca77bc5cea106300ceabc29c70` | `GCEZ6KUXIHFTTAW6IJYLE4NXC33R5OCCBHUFZCY3SXFBEMHHFK3PUE36` | sponsor_route | 2026-08-23 |
| 14 | `e96e95a4ddbffa0fc162279fa9ff35d497ebcaf690bc41f21fb3a33d26f97050` | `GCAXARZO2FBLTSMSQXAWIJOCGG7FRVWBNXSGJ3IUSPVWJITTOY6XIASQ` | send_xlm | 2026-08-23 |
| 15 | `6bbe97740571d7feb46911937e780d6b8c97a63097dcef3f1a7f6a0e0a096091` | `GCGRMP4WDOJBAFULBH4QLDV7M7MCLAJQK3UUUE7XKCZIUAXDFCSCA7ZS` | send_xlm | 2026-08-23 |
| 16 | `48ce20253bed7dd7c13636807c894983977aa717ff7d8409660e223fa6c232f4` | `GAE6BRA5FIJT2LFZ3CCWFOKSGXFZJ6JEITZDQCNSC7RUUJRT6M26WDWN` | game_win | 2026-08-23 |
| 17 | `bdfb3e29970abc9c612c858350d9cd6f0a0e509fce4b5d8334b9425fd7b00948` | `GCBIQMO3REVQADHJU33MB3XR6MUSIEFBRAS366OVOZP7GCYQNADFYBC4` | delivery_completed | 2026-08-23 |
| 18 | `33b775602c32acda9427e8a5d95fd819051453d4496b536b0efe3667f1a47bae` | `GAX66KG6Q7DSTAGLR6CVOX7SYX5DIMSNKIED4W45B3BLZJHU6NWWIFWI` | send_xlm | 2026-08-23 |
| 19 | `0ad0ca572fda537e7b8a3f4a4404f3c470373f3b79bb19118e960e75ee269692` | `GACIXSJ46473TMPJNBXD7HEINX2VAT63LQBE5QYC7Y5JFJWAZARAG7W2` | send_xlm | 2026-08-23 |
| 20 | `52c89bd34919babdf53a1fc07d467fa34c4c7c9d29b3a426a3625a8801b7fb88` | `GDKQTZAMJCQBPDPH6BGXWGKRMPL3ZLSBBJVKOPR547SNKRNH23V5SVSU` | delivery_completed | 2026-08-23 |
| 21 | `f5a65acdb7a35399abbf3e9175c8b2505582d2f5ce1a2c0bb7f2a35303a40919` | `GBEPUQGJA6JHNWIRLEUULGY5OC4YTJDQUVLT5IJF6VASLBRLJH5632QK` | delivery_completed | 2026-08-23 |
| 22 | `2cc8b915e57e9e5bacffd8dc3b623a7928a1b6d3db42ff09b7bdbae0c7d16df1` | `GBHFTOQVLUG4AGRHSP5CPWU55TY7TOCILCDFICJTQVENYBBSJB56HQ5T` | sponsor_route | 2026-08-23 |
| 23 | `0749d7ea36531878375e83b272961eb348b5476ff96b13a09820a6b45923d9f8` | `GD7SJQORGGMS3L4LHOWV4CKAHVXRSZUYRV6NMXWLNP3QNLFIBPDPE5PJ` | sponsor_route | 2026-08-23 |
| 24 | `b526ad2d65c3f8166836788de17826eb94e9e9e4d3e74b9ef8f105541dc9f716` | `GB56VCMQT77RWTGNMQO6LBZ6SLKWFKXME5WYNKXWOVK66IM7AVBPNH2D` | delivery_completed | 2026-08-23 |
| 25 | `251718fd585d7f5ef2159024f9acc0647cd6677a6f4fa34fcd8fb02bd1ed7c02` | `GAOJHVLA2UQMGMENRHH44P4U6NAEUPPZ2WYQKJ3NZCXDDXTTDFG35JNH` | sponsor_route | 2026-08-23 |
| 26 | `269db9591e774350d87b48de5c3f417451d74b07b061312c6bc28a152ef55ad3` | `GDOFIIWPEN6NLAB2YJY3XOKNWMX7GIVO76GNHHOEEAPOPDPDDYNBNASU` | sponsor_route | 2026-08-23 |
| 27 | `68ffd9897835ef4a4f6969800887f275753be8ee1b3b214c12c6f5f1f8a2d818` | `GCAFCCR7NQJA7V546XDX5DFAZ5GSU6QEN6BITPQ2O76XFQVUJZZQKI5S` | send_xlm | 2026-08-23 |
| 28 | `10079aa838a219a95cd6237f854f980b89c95c0280967b3a04e65302cfe44ed8` | `GCTDDLUMBDOSFCMGVH3W7Y3OBB3FEUI4UIMDD4YISC4HIX4GZPPW3YBC` | delivery_funded | 2026-08-24 |
| 29 | `b7a46a56da1e6644ac20289d9113f3b5b47d11d4b39a2fd9f353531aab18bfcc` | `GDTCQRZ3MKLZIKCMDKQSEUNZI2BEO25K2PVCP5XICIBAEDH4F4OOJ6QM` | delivery_funded | 2026-08-24 |
| 30 | `4ef4c390d681617cb90cc66237e257f3b887e07efede633008595295715c3776` | `GCAKX6MKRC34JN6YP653XJPGFERMQZUM3YIFPFHYJC5FU4OD2XHCPHRJ` | game_win | 2026-08-24 |
| 31 | `7c69eba16e46800a50ca8493d101661ff42b00b5665f4854c8a3ddb6960392db` | `GAGQJDUFT7BYB4WJKJTDEUDXTVGHV6Z2ZKDSJGIMN75757BXGFAPNDDW` | delivery_funded | 2026-08-24 |
| 32 | `fee86f873784f0ebcf7b817c2049c0e2d48f92e766159bfee282c48e0ef8d641` | `GDI6BXPHUQFXURCUMQORUTWOYTMWJ5RVDVTSHCS3632ZBZ5BCCMMOMFT` | sponsor_route | 2026-08-24 |
| 33 | `1dc8f343f33fd9887d59911056411bc7c06dbdbf684ecfba6d95c117346636cd` | `GBNHJYJJVL63GZ7IW7JBG75S5KVX5RIEC4L4XXFPCAUPYTCRX7GIOTKX` | send_xlm | 2026-08-24 |
| 34 | `dc605dad7930cafc542878493f294cecb0f4c1be23ca58e2b2e6eb0bd9c4ce99` | `GDGMPZCD6ANI2UO4QPXK7OEWB7O6DVOCKZRZCCITI7E3PS2VH452BWSP` | send_xlm | 2026-08-24 |
| 35 | `acaa5f0c5979b540b658f809520771eb1bffd45e09b0e8ee68b86abbf9e3b5ed` | `GDJVC4R42U5AT4BJXG3NQZ3Q6CWJUEVV4PTNE5Y7M6NYPX3BS37KZQSW` | game_win | 2026-08-25 |
| 36 | `349c64ac2e4cf841dbf99a552f07214cfff63e19494b9c438b5d9785434c4a2a` | `GASWJJS6ZGUTW3U2PF66DXSKE7UETIWH4LDGBWOK7ZMGNAMK5SUVNQ23` | delivery_funded | 2026-08-24 |
| 37 | `5b85b72dca4202b025477e7d3094743d30b73221a77ef78930e9e07c0c0f7253` | `GDZICGWBWRD2YPYWQ4KEMK5KTOLDDXDI7VCGXFMSNB6HFUKKBYGWTMDS` | delivery_funded | 2026-08-24 |
| 38 | `e9b5fa90d8d2d504d1741b1ee82ba90f3540608dd221ffff8b3c84cfe4fb8f19` | `GALGGCLBTNDTM2FMPMZI2FTPKWI4SUAZKIFZUDLR24NRTXYHBQIPKCPK` | delivery_funded | 2026-08-24 |
| 39 | `dd45936f56b1ed9446811f26185802d80e1f8fa5edea7ef3a1c1ce244128b83d` | `GD7MXNTHHCPXFFKTHCZPKIRILUUVJZF5EPDTXD4Z2732ACNI7QW4RIBQ` | sponsor_route | 2026-08-24 |
| 40 | `79fc6bc8d54c086f835dab317f3e18db2014b5afe1d61c6755ff9c487cf10a1d` | `GAV4OONA2FR27GKZXDD3SNVPYH44MQN5GTGFWUCS24CBEIDNCYA3W2FI` | game_win | 2026-08-24 |

**Transaction Summary:** 12 sponsor_route · 12 delivery_funded · 7 send_xlm · 6 game_win · 3 delivery_completed
