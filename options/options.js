// Header studio: position and zoom an uploaded photo inside a header-shaped frame,
// then save exactly what the frame shows as a 2400x200 JPEG.
(function () {
  const OUT_W = 2400;
  const OUT_H = 200;
  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');

  let image = null;
  let zoom = 1;
  // Centre of the frame, in image pixels.
  let cx = 0;
  let cy = 0;

  // Scale at which the image just covers the frame; zoom multiplies on top of it.
  function coverScale() {
    return Math.max(OUT_W / image.width, OUT_H / image.height);
  }

  // Keep the image covering the whole frame.
  function clamp() {
    const s = coverScale() * zoom;
    const halfW = OUT_W / s / 2;
    const halfH = OUT_H / s / 2;
    cx = Math.min(image.width - halfW, Math.max(halfW, cx));
    cy = Math.min(image.height - halfH, Math.max(halfH, cy));
  }

  function draw(target, width, height) {
    const s = (coverScale() * zoom * width) / OUT_W;
    const c = target.getContext('2d');
    c.imageSmoothingQuality = 'high';
    c.drawImage(image, width / 2 - cx * s, height / 2 - cy * s, image.width * s, image.height * s);
  }

  function render() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    draw(canvas, canvas.width, canvas.height);
  }

  function open(src, label) {
    const img = new Image();
    img.onload = () => {
      image = img;
      zoom = 1;
      $('zoom').value = '1';
      cx = img.width / 2;
      cy = img.height / 2;
      $('editor').hidden = false;
      $('drop-text').textContent = label;
      $('status').textContent = '';
      render();
    };
    img.src = src;
  }

  function load(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => open(reader.result, `${file.name} — choose a different image`);
    reader.readAsDataURL(file);
  }

  function bindDrag() {
    const frame = $('frame');
    let last = null;
    frame.addEventListener('pointerdown', (event) => {
      if (!image) return;
      last = { x: event.clientX, y: event.clientY };
      frame.setPointerCapture(event.pointerId);
      frame.classList.add('dragging');
    });
    frame.addEventListener('pointermove', (event) => {
      if (!last) return;
      // Convert screen pixels to image pixels.
      const s = (coverScale() * zoom * frame.clientWidth) / OUT_W;
      cx -= (event.clientX - last.x) / s;
      cy -= (event.clientY - last.y) / s;
      last = { x: event.clientX, y: event.clientY };
      clamp();
      render();
    });
    const end = () => {
      last = null;
      frame.classList.remove('dragging');
    };
    frame.addEventListener('pointerup', end);
    frame.addEventListener('pointercancel', end);
  }

  function bindDrop() {
    const drop = $('drop');
    ['dragenter', 'dragover'].forEach((type) => drop.addEventListener(type, (event) => {
      event.preventDefault();
      drop.classList.add('over');
    }));
    ['dragleave', 'drop'].forEach((type) => drop.addEventListener(type, () => drop.classList.remove('over')));
    drop.addEventListener('drop', (event) => {
      event.preventDefault();
      load(event.dataTransfer.files[0]);
    });
    $('file').addEventListener('change', (event) => load(event.target.files[0]));
  }

  async function save() {
    const out = document.createElement('canvas');
    out.width = OUT_W;
    out.height = OUT_H;
    draw(out, OUT_W, OUT_H);
    await window.MinervaStorage.saveHeaderImage(out.toDataURL('image/jpeg', 0.85));
    const prefs = await window.MinervaStorage.loadPrefs();
    await window.MinervaStorage.savePrefs(Object.assign(prefs, { header: 'custom' }));
    $('remove').hidden = false;
    $('status').textContent = 'Saved. Open forum.minerva.edu to see it.';
  }

  async function remove() {
    await window.MinervaStorage.saveHeaderImage(null);
    const prefs = await window.MinervaStorage.loadPrefs();
    if (prefs.header === 'custom') await window.MinervaStorage.savePrefs(Object.assign(prefs, { header: 'default' }));
    $('remove').hidden = true;
    $('editor').hidden = true;
    image = null;
    $('drop-text').textContent = 'Choose an image or drop it here';
    $('status').textContent = '';
  }

  async function init() {
    bindDrop();
    bindDrag();
    $('zoom').addEventListener('input', (event) => {
      zoom = Number(event.target.value);
      clamp();
      render();
    });
    $('save').addEventListener('click', save);
    $('remove').addEventListener('click', remove);
    window.addEventListener('resize', () => image && render());

    const saved = await window.MinervaStorage.loadHeaderImage();
    $('remove').hidden = !saved;
    if (saved) open(saved, 'Showing your current header — choose an image to replace it');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
