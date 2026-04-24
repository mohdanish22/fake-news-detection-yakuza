(() => {
  const $ = (id) => document.getElementById(id);
  let file = null;
  let submitting = false;

  const textarea = $('article');
  const charCount = $('charCount');
  const charHint = $('charHint');
  const submitBtn = $('submitBtn');
  const btnContent = $('btnContent');
  const dropzone = $('dropzone');
  const uploadBtn = $('uploadBtn');
  const fileInput = $('fileInput');
  const fileInfo = $('fileInfo');

  const updateState = () => {
    const len = textarea.value.trim().length;
    charCount.textContent = textarea.value.length;
    if (len > 20) {
      charHint.textContent = 'Looks good';
      charHint.classList.add('accent-text');
      charHint.style.color = 'var(--primary)';
    } else {
      charHint.textContent = 'Add a little more text';
      charHint.style.color = '';
    }
    submitBtn.disabled = !(len > 20 || !!file) || submitting;
  };

  textarea.addEventListener('input', updateState);

  function toast({ title, description, variant }) {
    const el = document.createElement('div');
    el.className = 'toast' + (variant === 'destructive' ? ' destructive' : '');
    el.innerHTML = `<div class="t-title">${title}</div>
      ${description ? `<div class="t-desc">${description}</div>` : ''}`;
    $('toastHost').appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3500);
  }

  function renderFile() {
    if (file) {
      uploadBtn.classList.add('hidden');
      fileInfo.classList.remove('hidden');
      fileInfo.innerHTML = `
        <div class="file">
          <div class="file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="file-meta">
            <p class="file-name">${file.name}</p>
            <p class="file-size">${(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button id="removeFile" type="button" aria-label="Remove file" class="icon-btn focus-ring">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`;
      $('removeFile').addEventListener('click', () => { file = null; renderFile(); updateState(); });
    } else {
      uploadBtn.classList.remove('hidden');
      fileInfo.classList.add('hidden');
      fileInfo.innerHTML = '';
    }
  }

  function handleFiles(files) {
    if (!files || !files[0]) return;
    if (files[0].size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please choose a file under 5 MB.', variant: 'destructive' });
      return;
    }
    file = files[0];
    renderFile();
    updateState();
  }

  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault(); dropzone.classList.remove('drag');
    handleFiles(e.dataTransfer.files);
  });

  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const len = textarea.value.trim().length;
    if (!(len > 20 || !!file)) {
      toast({ title: 'Nothing to check yet', description: 'Paste an article or upload a file.' });
      return;
    }
    submitting = true;
    submitBtn.disabled = true;
    btnContent.innerHTML = `<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Checking…`;
    await new Promise(r => setTimeout(r, 1200));
    submitting = false;
    btnContent.innerHTML = `Check this news <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    updateState();
    toast({ title: 'Analysis started', description: "We'll show your result shortly." });
  });

  updateState();
})();
