const desktop = document.querySelector('.desktop');
const menu   = document.getElementById('custom-context-menu');
const create = document.getElementById('create-file');

// 1) Prevent the browser’s default menu on right‑click
desktop.addEventListener('contextmenu', e => {
  e.preventDefault();
  menu.style.top  = `${e.clientY}px`;
  menu.style.left = `${e.clientX}px`;
  menu.style.display = 'block';
});

// 2) Hide it when clicking elsewhere
document.addEventListener('click', () => {
  menu.style.display = 'none';
});

function saveFile(name, content) {
    // Store under a known key prefix
    localStorage.setItem(`file_${name}`, content);
    // Update your in‑memory index
    const index = JSON.parse(localStorage.getItem('file_index') || '[]');
    index.push({ name, created: Date.now() });
    localStorage.setItem('file_index', JSON.stringify(index));
  }
  
  create.addEventListener('click', () => {
    const name    = prompt('Enter file name:');
    if (!name) return;
    const content = prompt('Enter file contents (optional):', '');
    saveFile(name, content);
    renderFiles();       // Re‑draw the desktop icons
    menu.style.display = 'none';
  });
  function renderFiles() {
    // Clear existing icons
    document.querySelectorAll('.file-icon').forEach(el => el.remove());
  
    // Load index of files
    const index = JSON.parse(localStorage.getItem('file_index') || '[]');
  
    index.forEach(({ name }) => {
      const icon = document.createElement('div');
      icon.className = 'file-icon';
      icon.style = `
        position:absolute;
        top: 10px; left: 10px;  /* layout as you wish */
        width: 60px; height: 60px;
        background:rgba(255,255,255,0.1);
        color:#fff;
        display:flex; align-items:center; justify-content:center;
        border-radius:4px;
        cursor:pointer;
      `;
      icon.textContent = name;
      // Double‑click to view content
      icon.addEventListener('dblclick', () => {
        const content = localStorage.getItem(`file_${name}`) || '';
        alert(`📄 ${name}\n\n${content}`);
      });
      desktop.append(icon);
    });
  }
  
  // On initial page load:
  renderFiles();
    