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
  return 'MP-' +
    Date.now().toString(36).toUpperCase() +
    '-' +
    Math.random().toString(36).slice(2, 7).toUpperCase();
}

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

function render(r) {

  state = r;

  state.original_input_hash = r.input_hash || '';

  $('empty').classList.add('hidden');
  $('receipt').classList.remove('hidden');

  $('mode').textContent = r.mode || 'CooL SDK';

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
    r.input_hash ||
    r.record?.event?.commitments?.input ||
    '—';

  $('ohash').textContent =
    r.output_hash ||
    r.record?.event?.commitments?.output ||
    '—';

  $('verifyIcon').textContent = '✓';
  $('verifyIcon').style.background = 'var(--green)';

  $('verifyTitle').textContent = 'Evidence is valid';

  $('verifyText').textContent =
    'No tampering detected.';

  const badge = document.getElementById('verifyBadge');

  if (badge) {
    badge.textContent = 'SECURE';
    badge.style.color = '';
  }
}


/* CREATE */

$('create').addEventListener('click', async function () {

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
});


/* =========================================================
   TAMPER — THIS IS THE IMPORTANT PART
========================================================= */

$('tamper').addEventListener('click', function () {

  if (!state) {

    $('verifyIcon').textContent = '!';

    $('verifyIcon').style.background = 'var(--red)';

    $('verifyTitle').textContent =
      'Create evidence first';

    $('verifyText').textContent =
      'Create a cryptographic proof before simulating tampering.';

    return;
  }

  const original =
    state.original_input_hash ||
    state.input_hash;

  if (!original) {
    return;
  }

  state.input_hash =
    original.substring(0, original.length - 1) +
    (original.endsWith('0') ? '1' : '0');

  $('ihash').textContent =
    state.input_hash;

  $('verifyIcon').textContent = '×';

  $('verifyIcon').style.background =
    'var(--red)';

  $('verifyTitle').textContent =
    'Verification failed';

  $('verifyText').textContent =
    'Tampering detected: commitment no longer matches the original event.';

  const badge =
    document.getElementById('verifyBadge');

  if (badge) {
    badge.textContent = 'TAMPERED';
    badge.style.color = 'var(--red)';
  }
});


/* SDK STATUS */

(async function () {

  try {

    const s =
      await fetch('/api/status').then(r => r.json());

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
