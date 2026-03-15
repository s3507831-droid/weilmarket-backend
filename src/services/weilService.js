// weilService.js — uses REST API directly (no browser SDK needed)
const crypto = require('crypto');

const POD_ID      = 'POD_55e6c8adfac049e2bcdb558a470cfeac';
const SENTINEL    = 'https://sentinel.unweil.me/rest';
const MARKETPLACE = 'aaaaaaav2ktqlykyyinyucf63ypztehiaoljurajabm5orlxkpzlqlbe2byy';

// Call blockchain REST API
exports.callBlockchain = async (requestType, params) => {
  try {
    const res = await fetch(SENTINEL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_id:   crypto.randomUUID(),
        category:     'ClusterManagement',
        request_type: requestType,
        params,
      }),
    });
    const data = await res.json();
    return data.status === 'ok' ? data.result : null;
  } catch (e) {
    console.warn('[weilService] blockchain call failed:', e.message);
    return null;
  }
};

// List real on-chain contracts
exports.listContracts = async () => {
  return exports.callBlockchain('ListSmartContracts', { weilpod_name: POD_ID });
};

// Simulate register applet on blockchain
exports.simulateRegisterApplet = async (name, owner) => {
  return {
    onChainId: 'chain_' + Math.random().toString(36).slice(2, 10),
    txHash:    '0x' + Math.random().toString(16).slice(2, 18),
    gasUsed:   Math.floor(Math.random() * 5000) + 1000,
  };
};

// Simulate invoke applet on blockchain
exports.simulateOnChainInvoke = async (onChainId, params, caller) => {
  return {
    result:  JSON.stringify({ status: 'success', output: 'Processed', timestamp: Date.now() }),
    txHash:  '0x' + Math.random().toString(16).slice(2, 18),
    gasUsed: Math.floor(Math.random() * 3000) + 500,
  };
};