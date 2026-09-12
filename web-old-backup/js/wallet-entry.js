/**
 * Shared wallet-connection sheet. Views never touch wallet providers
 * directly — they call walletEntry(root) and let this handle the
 * Nimiq Pay / Nimiq Hub / demo wallet choice and connection flow.
 */
import { refreshMe } from './state.js';
import { ico, toast, sheet } from './ui.js';

/**
 * Show username input sheet after wallet connection
 * @param {Function} onSubmit - Callback with username
 */
async function promptUsername(onSubmit) {
  const s = sheet(`
    <h2 class="h1">Choose your username</h2>
    <p class="sub mt8">This will be your public identity on PROOF. You can't change it later.</p>
    <div class="mt16">
      <input 
        type="text" 
        id="usernameInput" 
        class="input" 
        placeholder="Username" 
        maxlength="20"
        autocomplete="off"
        style="width: 100%; margin-bottom: 8px;"
      />
      <p class="tiny" style="color: var(--text-soft); margin-top: 4px;">
        3-20 characters, letters, numbers, and underscores only
      </p>
      <button class="btn btn-primary btn-block mt16" id="submitUsername">
        ${ico.check} Continue
      </button>
      <button class="btn btn-ghost btn-block mt8" id="skipUsername">
        Skip (generate random)
      </button>
    </div>
  `);
  
  const input = s.el.querySelector('#usernameInput');
  const submitBtn = s.el.querySelector('#submitUsername');
  const skipBtn = s.el.querySelector('#skipUsername');
  
  // Focus input
  setTimeout(() => input?.focus(), 100);
  
  // Handle Enter key
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitBtn?.click();
    }
  });
  
  submitBtn?.addEventListener('click', async () => {
    const username = input.value.trim();
    if (!username) {
      toast('Please enter a username or skip to use a random one', '', 3000);
      return;
    }
    if (username.length < 3) {
      toast('Username must be at least 3 characters', 'bad', 3000);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast('Username can only contain letters, numbers, and underscores', 'bad', 3000);
      return;
    }
    s.close();
    await onSubmit(username);
  });
  
  skipBtn?.addEventListener('click', () => {
    s.close();
    onSubmit(null);
  });
}

export async function walletEntry(root) {
  const { environment, WalletService } = await import('./wallet.js'); const env = environment();
  const payBtn = `<button class="btn ${env.kind === 'nimiqpay' ? 'btn-primary' : 'btn-ghost'} btn-block" id="wNimiq">${ico.wallet} Connect Nimiq Pay</button>`; const hubBtn = `<button class="btn btn-primary btn-block" id="wHub">${ico.link} Connect Nimiq Hub</button>`; const demoBtn = `<button class="btn ${env.kind === 'nimiqpay' ? 'btn-soft' : 'btn-nim'} btn-block" id="wDemo">${ico.flask} Explore with demo wallet</button>`; let options, note;
  if (env.kind === 'nimiqpay') { options = payBtn + demoBtn; note = 'Running inside Nimiq Pay — your keys never leave the wallet. Rewards can be on-chain.'; } else if (env.kind === 'desktop') { options = hubBtn + demoBtn + `<button class="btn btn-ghost btn-block" id="wNimiq" style="opacity:.75">${ico.bolt} Nimiq Pay <span class="tiny">· mobile app only</span></button>`; note = 'Desktop detected → use Nimiq Hub for on-chain rewards, or explore instantly with the demo wallet.'; } else { options = hubBtn + demoBtn + payBtn; note = 'Use Nimiq Hub in this browser, or open PROOF inside Nimiq Pay for native wallet access.'; }
  const s = sheet(`<h2 class="h1">Connect your wallet</h2><p class="sub mt8">Your wallet holds your NIM rewards. Keys never leave it — you approve every action.</p><div class="wallet-options mt16">${options}</div><p class="tiny center mt8 wallet-note">${note}</p>`);
  s.el.querySelector('#wHub')?.addEventListener('click', async e => { 
    const btn = e.currentTarget; 
    btn.disabled = true; 
    btn.classList.add('is-loading'); 
    btn.innerHTML = `${ico.link} Connecting to Nimiq Hub…`; 
    try { 
      s.close(); 
      await promptUsername(async (username) => {
        try {
          await WalletService.connectNimiqHub(username); 
          await refreshMe(); 
          toast('Nimiq Hub connected ✅ On-chain rewards enabled!', 'ok'); 
          location.hash = '#/';
        } catch (err) {
          toast(err?.message || 'Nimiq Hub connection failed. Please retry.', 'bad', 5000);
          walletEntry(root); // Re-show wallet selection
        }
      });
    } catch (err) { 
      btn.disabled = false; 
      btn.classList.remove('is-loading'); 
      btn.innerHTML = `${ico.link} Connect Nimiq Hub`; 
      toast('Nimiq Hub connection failed. Please retry.', 'bad', 5000); 
    } 
  });
  s.el.querySelector('#wNimiq')?.addEventListener('click', async e => { 
    const btn = e.currentTarget; 
    if (env.kind === 'desktop') { 
      toast('Nimiq Pay is mobile-only. On desktop, use Nimiq Hub.', '', 4200); 
      return; 
    } 
    if (!env.inNimiqPay) { 
      toast('Open PROOF inside Nimiq Pay to connect it. Browser users can use Nimiq Hub or demo wallet.', '', 5000); 
      return; 
    } 
    btn.disabled = true; 
    btn.classList.add('is-loading'); 
    btn.innerHTML = `${ico.bolt} Connecting to Nimiq Pay…`; 
    try { 
      s.close();
      await promptUsername(async (username) => {
        try {
          await WalletService.connectNimiqPay(username); 
          await refreshMe(); 
          toast('Nimiq Pay connected ✅ On-chain rewards enabled!', 'ok'); 
          location.hash = '#/';
        } catch (err) {
          toast(err?.message || 'Nimiq Pay connection failed. Please retry.', 'bad', 4500);
          walletEntry(root); // Re-show wallet selection
        }
      });
    } catch (err) { 
      btn.disabled = false; 
      btn.classList.remove('is-loading'); 
      btn.innerHTML = `${ico.bolt} Connect Nimiq Pay`; 
      toast('Nimiq Pay connection failed. Please retry.', 'bad', 4500); 
    } 
  });
  s.el.querySelector('#wDemo').addEventListener('click', async e => { 
    const btn = e.currentTarget; 
    btn.disabled = true; 
    btn.classList.add('is-loading'); 
    btn.textContent = 'Creating demo wallet…'; 
    try { 
      s.close();
      await promptUsername(async (username) => {
        try {
          await WalletService.connectDemo(username); 
          await refreshMe(); 
          toast('Demo wallet ready! Full experience with simulated rewards.', 'ok', 3500); 
          location.hash = '#/';
        } catch (err) {
          toast(err?.message || 'Could not create demo wallet. Please try again.', 'bad', 4000);
          walletEntry(root); // Re-show wallet selection
        }
      });
    } catch (err) { 
      btn.disabled = false; 
      btn.classList.remove('is-loading'); 
      btn.innerHTML = `${ico.flask} Explore with demo wallet`; 
      toast(err?.message || 'Could not create demo wallet. Please try again.', 'bad', 4000); 
    } 
  });
}
