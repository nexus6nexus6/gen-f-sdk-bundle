
let { ChainId, GenF, GENF_TOKEN } = require('./node_modules/@flooz/gen-f-sdk/dist/gen-f-sdk.cjs.development.js');
let { formatEther } = require('./node_modules/@ethersproject/units');

let GEN_F;
let CHAIN_ID = ChainId.RINKEBY_TESTNET;
let gen_f_data = {};
let NFT_ADDRESS = GENF_TOKEN[CHAIN_ID];

if (!GEN_F) GEN_F = new GenF(CHAIN_ID);

async function init() {
    
    await fetchData();
    events();
}
init(); 

async function fetchData() {
    gen_f_data.PRICE_ETH = formatEther(await GEN_F.getMintingPrice()); // convert BigNumber to string 
    gen_f_data.ALREADY_MINTED = await GEN_F.getMintCount(); // convert BigNumber to string  
    // gen_f_data.PUBLIC_MINTING = await GEN_F.isPublicMintingOpen();  
    let stats;
    try {
      stats = await GEN_F.getStats();
    } catch(e) {
      console.log('wallet: stats error:', e);    
    } 
    gen_f_data.FLOOR_PRICE_ETH = stats?.floorPrice || 0; 
    gen_f_data.VOLUME_TRADED_ETH = stats?.totalVolume || 0;
    gen_f_data.OWNERS = stats?.owners || 0;
}

async function events() {
    document.getElementById('check_status').onclick = function(e) {
        e && e.preventDefault();
        getWalletStatus();
    };
}

async function getWalletStatus() {
    
    let address = document.getElementById('wallet_address').value;
    if (address+'x'=='x') return;

    let status='';
    try {
      let tmp = await GEN_F.getWhitelistAllocation(address);
      if (tmp > 0) {
        status = 'Sup fam! You are on the whitelist';
        if (tmp > 1) {
          status = 'Sup fam!<br>You are on the whitelist and can mint up to '+tmp+' Gen-F dons';
        }
      } else {
        status = 'Sorry, but we couldn\'t find you on our whitelist';
      }
    } catch(e) {
      status = 'There was an error checking your wallet status';
      console.log('wallet: reading wallet status error',e);      
    }
    console.log('check wallet status:', status);
    
    document.getElementById('wallet_status').innerHTML = status;
    
  }

