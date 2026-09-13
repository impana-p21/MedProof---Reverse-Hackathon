let state = null;

const $ = id => document.getElementById(id);

async function sha(text) {
  const b = new TextEncoder().encode(text);
  const h = await crypto.subtle.digest('SHA-256', b);

  return [...new Uint8Array(h)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

function id() {
  return (
    'MP-' +
    Date.now().toString(36).toUpperCase() +
    '-' +
    Math.random().toString(36).slice(2, 7).toUpperCase()
  );
}


/* =========================
   LOCAL CRYPTOGRAPHIC DEMO
   ========================= */

async function createLocal() {
  const input = $('input').value;
  const output = $('output').value;
  const model = $('model').value;
  const version = $('version').value;

  const now = new Date().toISOString();
  const salt = crypto.randomUUID();

  const ih = await sha(salt + input);
  const oh = await sha(salt + output);

  return {
    record_id: id(),
    time: now,

    metadata: {
      model,
      version,
      workflow: 'clinical-ai-summary'
    },

    input_hash: ih,
    output_hash: oh,

    salt,

    software: {
      name: 'MedProof',
      version: '1.0.0'
    },

    mode: 'browser cryptographic demo'
  };
}


/* =========================
   RENDER RECEIPT
   ========================= */

function render(r) {

  /*
   * IMPORTANT FIX:
   * CooL SDK responses may store hashes here:
   *
   * record.event.commitments.input
   *
   * instead of:
   *
   * input_hash
   *
   * We normalize both formats so Tamper Lab always works.
   */

  const inputHash =
    r.input_hash ||
    r.record?.event?.commitments?.input ||
    '';

  const outputHash =
    r.output_hash ||
    r.record?.event?.commitments?.output ||
    '';

  state = {
    ...r,

    input_hash: inputHash,
    output_hash: outputHash,

    // Keep the original hash so tampering can always be simulated
    original_input_hash: inputHash
  };

  $('empty').classList.add('hidden');
  $('receipt').classList.remove('hidden');

  $('mode').textContent =
    r.mode || 'CooL SDK';

  $('rmodel').textContent =
    (r.metadata?.model || '—') +
    ' / ' +
    (r.metadata?.version || '—');

  $('rtime').textContent =
    new Date(r.time).toLocaleString();

  $('rid').textContent =
    r.record_id ||
    r.record?.record_id ||
    '—';

  $('ihash').textContent =
    inputHash || '—';

  $('ohash').textContent =
    outputHash || '—';

  // Reset verification state
  $('verifyIcon').textContent = '✓';
  $('verifyIcon').style.background = 'var(--green)';

  $('verifyTitle').textContent =
    'Evidence is valid';

  $('verifyText').textContent =
    'No tampering detected.';

  const badge =
    document.querySelector('.verify-badge');

  if (badge) {
    badge.textContent = 'SECURE';
    badge.style.color = '';
  }
}


/* =========================
   CREATE CRYPTOGRAPHIC PROOF
   ========================= */

$('create').onclick = async () => {

  $('createMsg').textContent =
    'Creating cryptographic evidence…';

  try {

    const resp = await fetch('/api/record', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        metadata: {
          model: $('model').value,
          version: $('version').value,
          workflow: 'clinical-ai-summary'
        },

        input: $('input').value,
        output: $('output').value
      })
    });

    if (resp.ok) {

      const d = await resp.json();

      render({
        ...d.evidence,
        mode: 'CooL SDK — live'
      });

      $('createMsg').textContent =
        'Receipt created with the CooL SDK.';

    } else {

      const r = await createLocal();

      render(r);

      $('createMsg').textContent =
        'Browser cryptographic demo active; install cool-nwc for live SDK mode.';
    }

  } catch (error) {

    const r = await createLocal();

    render(r);

    $('createMsg').textContent =
      'Browser cryptographic demo active; install cool-nwc for live SDK mode.';
  }
};


/* =========================
   TAMPER SIMULATION
   ========================= */

function simulateTampering() {

  // User must create evidence first
  if (!state) {

    alert(
      'Create a cryptographic proof first, then test tampering.'
    );

    return;
  }

  /*
   * Get the ORIGINAL hash.
   * This works for both browser demo and CooL SDK response.
   */

  const original =
    state.original_input_hash ||
    state.input_hash ||
    state.record?.event?.commitments?.input ||
    '';

  if (!original) {

    alert(
      'No cryptographic commitment found. Please create the proof again.'
    );

    return;
  }

  // Save original hash permanently
  state.original_input_hash = original;

  // Flip the last hexadecimal character
  const lastChar =
    original.slice(-1);

  const replacement =
    lastChar.toLowerCase() === '0'
      ? '1'
      : '0';

  const tamperedHash =
    original.slice(0, -1) +
    replacement;

  // Update state
  state.input_hash =
    tamperedHash;

  // Update visible hash
  $('ihash').textContent =
    tamperedHash;

  // Verification failed
  $('verifyIcon').textContent = '×';

  $('verifyIcon').style.background =
    'var(--red)';

  $('verifyTitle').textContent =
    'Verification failed';

  $('verifyText').textContent =
    'Tampering detected: commitment no longer matches the original event.';

  // Change badge if available
  const badge =
    document.querySelector('.verify-badge');

  if (badge) {

    badge.textContent =
      'TAMPERED';

    badge.style.color =
      'var(--red)';
  }

  // Scroll to verification section
  const verification =
    $('verification');

  if (verification) {

    verification.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}


/* =========================
   TAMPER BUTTON
   ========================= */

const tamperButton =
  $('tamper');

if (tamperButton) {

  tamperButton.addEventListener(
    'click',
    function (event) {

      event.preventDefault();

      simulateTampering();
    }
  );
}


/* =========================
   HERO "TEST TAMPERING"
   ========================= */

document.addEventListener(
  'click',
  function (event) {

    const button =
      event.target.closest('.button-danger');

    if (!button) return;

    event.preventDefault();

    simulateTampering();
  }
);


/* =========================
   NAVIGATION "TAMPER LAB"
   ========================= */

document.addEventListener(
  'click',
  function (event) {

    const link =
      event.target.closest(
        '.main-nav a[href="#tamper"]'
      );

    if (!link) return;

    event.preventDefault();

    simulateTampering();
  }
);


/* =========================
   EXTRA EVENT-DELEGATION
   SAFETY FOR TAMPER BUTTON
   ========================= */

document.addEventListener(
  'click',
  function (event) {

    const button =
      event.target.closest('#tamper');

    if (!button) return;

    event.preventDefault();

    simulateTampering();
  }
);


/* =========================
   CHECK COoL SDK STATUS
   ========================= */

(async () => {

  try {

    const s =
      await fetch('/api/status')
        .then(r => r.json());

    $('sdkBadge').textContent =
      s.coolInstalled
        ? '● CooL SDK live'
        : '● Demo mode';

    $('sdkBadge').classList.toggle(
      'live',
      s.coolInstalled
    );

  } catch {

    $('sdkBadge').textContent =
      '● Browser demo';
  }

})();
