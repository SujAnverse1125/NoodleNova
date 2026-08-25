const StellarSdk = require("@stellar/stellar-sdk");

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const sponsorSecret = "SCECB4AKTKUU4FSPBWY2LVXZR57LVNS6VDCOGVXQAZHJZFGEHXRXO4N6";
const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);

const recipients = [
  { wallet: "GAFA2O72V23LV7WMTT774EHLBGLV7ETLOSG63TLJ6RWZT7FGUV4TM7ZZ", type: "sponsor_route" },
  { wallet: "GB5YELQUQHJQHSGQP4FD6DC6YTGBT4LF7DHXAHU6GCAHKU4MAX2GOZPT", type: "delivery_funded" },
  { wallet: "GAEW6JOC64EP3QZWZDNR32SFVZTRX7FGXEG2L5FAUS3IED4ON6FK3C4S", type: "sponsor_route" },
  { wallet: "GAQDZOG6EWIWWPYSE6KZ4KFS4I5P6CRRGHBM7ZMPYJLKOMSMP2T6QFJ2", type: "delivery_completed" },
  { wallet: "GCJPBUOKWUI3NLBEYMU2YV2VM7BAC5ZDNPZNUTYYDXUN6DKFZZSMNK23", type: "sponsor_route" },
  { wallet: "GBAEZMTWFG3PMMTVGVF24VMAUMNBCF2JQC6MLAKF3O6RICNFPM3JUND2", type: "game_win" },
  { wallet: "GBO3F5XHMASTIOZJR4VMLJVY5QKXKWQPVE6RMO3WOZLNCVJINAOSWYDG", type: "delivery_funded" },
  { wallet: "GBEZOCC7WBZN7A63Y6CMMFEWIXO36Q35FI4O3PCPIWYSRMZH5C4LXC74", type: "sponsor_route" },
  { wallet: "GCX7RT3RNOJ4SIYVPALPXKJFSTWOOGWXCPSM7E4VLSD6AITB3BOXUMPI", type: "send_xlm" },
  { wallet: "GB6CLWWEWKGR5W4HW427T6OTZQS6MVJBF332GUKVR6YS5L6YU7IVG4RJ", type: "send_xlm" },
  { wallet: "GCIP56RVQO32UXIY36FZPFECYZPAJOBXEPIKY4GEXCZC3TAPP6XQ6CPL", type: "delivery_funded" },
  { wallet: "GBOTQIBQNALA477UGNHFS5P556RBR7GWRKIGO5HDVTATBYTUFE5ULYUC", type: "sponsor_route" },
  { wallet: "GCEZ6KUXIHFTTAW6IJYLE4NXC33R5OCCBHUFZCY3SXFBEMHHFK3PUE36", type: "sponsor_route" },
  { wallet: "GCAXARZO2FBLTSMSQXAWIJOCGG7FRVWBNXSGJ3IUSPVWJITTOY6XIASQ", type: "send_xlm" },
  { wallet: "GCGRMP4WDOJBAFULBH4QLDV7M7MCLAJQK3UUUE7XKCZIUAXDFCSCA7ZS", type: "send_xlm" },
  { wallet: "GAE6BRA5FIJT2LFZ3CCWFOKSGXFZJ6JEITZDQCNSC7RUUJRT6M26WDWN", type: "game_win" },
  { wallet: "GCBIQMO3REVQADHJU33MB3XR6MUSIEFBRAS366OVOZP7GCYQNADFYBC4", type: "delivery_completed" },
  { wallet: "GAX66KG6Q7DSTAGLR6CVOX7SYX5DIMSNKIED4W45B3BLZJHU6NWWIFWI", type: "send_xlm" },
  { wallet: "GACIXSJ46473TMPJNBXD7HEINX2VAT63LQBE5QYC7Y5JFJWAZARAG7W2", type: "send_xlm" },
  { wallet: "GDKQTZAMJCQBPDPH6BGXWGKRMPL3ZLSBBJVKOPR547SNKRNH23V5SVSU", type: "delivery_completed" },
  { wallet: "GBEPUQGJA6JHNWIRLEUULGY5OC4YTJDQUVLT5IJF6VASLBRLJH5632QK", type: "delivery_completed" },
  { wallet: "GBHFTOQVLUG4AGRHSP5CPWU55TY7TOCILCDFICJTQVENYBBSJB56HQ5T", type: "sponsor_route" },
  { wallet: "GD7SJQORGGMS3L4LHOWV4CKAHVXRSZUYRV6NMXWLNP3QNLFIBPDPE5PJ", type: "sponsor_route" },
  { wallet: "GB56VCMQT77RWTGNMQO6LBZ6SLKWFKXME5WYNKXWOVK66IM7AVBPNH2D", type: "delivery_completed" },
  { wallet: "GAOJHVLA2UQMGMENRHH44P4U6NAEUPPZ2WYQKJ3NZCXDDXTTDFG35JNH", type: "sponsor_route" },
  { wallet: "GDOFIIWPEN6NLAB2YJY3XOKNWMX7GIVO76GNHHOEEAPOPDPDDYNBNASU", type: "sponsor_route" },
  { wallet: "GCAFCCR7NQJA7V546XDX5DFAZ5GSU6QEN6BITPQ2O76XFQVUJZZQKI5S", type: "send_xlm" },
  { wallet: "GCTDDLUMBDOSFCMGVH3W7Y3OBB3FEUI4UIMDD4YISC4HIX4GZPPW3YBC", type: "delivery_funded" },
  { wallet: "GDTCQRZ3MKLZIKCMDKQSEUNZI2BEO25K2PVCP5XICIBAEDH4F4OOJ6QM", type: "delivery_funded" },
  { wallet: "GCAKX6MKRC34JN6YP653XJPGFERMQZUM3YIFPFHYJC5FU4OD2XHCPHRJ", type: "game_win" },
  { wallet: "GAGQJDUFT7BYB4WJKJTDEUDXTVGHV6Z2ZKDSJGIMN75757BXGFAPNDDW", type: "delivery_funded" },
  { wallet: "GDI6BXPHUQFXURCUMQORUTWOYTMWJ5RVDVTSHCS3632ZBZ5BCCMMOMFT", type: "sponsor_route" },
  { wallet: "GBNHJYJJVL63GZ7IW7JBG75S5KVX5RIEC4L4XXFPCAUPYTCRX7GIOTKX", type: "send_xlm" },
  { wallet: "GDGMPZCD6ANI2UO4QPXK7OEWB7O6DVOCKZRZCCITI7E3PS2VH452BWSP", type: "send_xlm" },
  { wallet: "GDJVC4R42U5AT4BJXG3NQZ3Q6CWJUEVV4PTNE5Y7M6NYPX3BS37KZQSW", type: "game_win" },
  { wallet: "GASWJJS6ZGUTW3U2PF66DXSKE7UETIWH4LDGBWOK7ZMGNAMK5SUVNQ23", type: "delivery_funded" },
  { wallet: "GDZICGWBWRD2YPYWQ4KEMK5KTOLDDXDI7VCGXFMSNB6HFUKKBYGWTMDS", type: "delivery_funded" },
  { wallet: "GALGGCLBTNDTM2FMPMZI2FTPKWI4SUAZKIFZUDLR24NRTXYHBQIPKCPK", type: "delivery_funded" },
  { wallet: "GD7MXNTHHCPXFFKTHCZPKIRILUUVJZF5EPDTXD4Z2732ACNI7QW4RIBQ", type: "sponsor_route" },
  { wallet: "GAV4OONA2FR27GKZXDD3SNVPYH44MQN5GTGFWUCS24CBEIDNCYA3W2FI", type: "game_win" },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const results = [];
  const sponsorAccount = await server.loadAccount(sponsorKeypair.publicKey());

  for (let i = 0; i < recipients.length; i++) {
    const { wallet, type } = recipients[i];
    const amount = type === "game_win" ? "5.0000000" : "1.0000000";

    try {
      const tx = new StellarSdk.TransactionBuilder(sponsorAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: wallet,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .addMemo(StellarSdk.Memo.text("Noodle Nova"))
        .setTimeout(30)
        .build();

      tx.sign(sponsorKeypair);
      const response = await server.submitTransaction(tx);

      results.push({ index: i + 1, wallet, type, hash: response.hash });
      console.log(`[${i + 1}/40] OK ${response.hash}`);

      // Reload account for next transaction (sequence number changes)
      if (i < recipients.length - 1) {
        const freshAccount = await server.loadAccount(sponsorKeypair.publicKey());
        sponsorAccount = freshAccount;
      }
    } catch (err) {
      console.error(`[${i + 1}/40] FAIL ${wallet}: ${err.message}`);
      results.push({ index: i + 1, wallet, type, hash: "FAILED", error: err.message });
    }

    // Wait 1 second between transactions to avoid rate limits
    await sleep(1000);
  }

  console.log("\n=== RESULTS ===");
  console.log(JSON.stringify(results, null, 2));

  // Save to file
  const fs = require("fs");
  fs.writeFileSync("noodle-nova-tx-results.json", JSON.stringify(results, null, 2));
  console.log("\nSaved to noodle-nova-tx-results.json");
}

main().catch(console.error);
