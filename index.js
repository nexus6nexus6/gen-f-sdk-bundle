
let { ChainId, GenF, GENF_TOKEN } = require('./node_modules/@flooz/gen-f-sdk/dist/gen-f-sdk.cjs.development.js');
let { formatEther } = require('./node_modules/@ethersproject/units');

let GEN_F;
let CHAIN_ID = ChainId.RINKEBY_TESTNET;
let gen_f_data = {};
let NFT_ADDRESS = GENF_TOKEN[CHAIN_ID];

async function init() {
    if (!GEN_F) GEN_F = new GenF(CHAIN_ID);
    await fetchData();
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

    console.log(gen_f_data);

    // bind the values to the stats elements
    document.querySelector('.min-owners').innerHTML = gen_f_data.OWNERS;
    document.querySelector('.min-floor-price').innerHTML = toFixedIfNecessary(gen_f_data.FLOOR_PRICE_ETH,3);
    document.querySelector('.min-volume-traded').innerHTML = toFixedIfNecessary(gen_f_data.VOLUME_TRADED_ETH,3);
    
}

function toFixedIfNecessary( value, dp ){
  return +parseFloat(value).toFixed( dp );
}

