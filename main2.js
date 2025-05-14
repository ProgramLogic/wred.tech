function renderFiles() {
    const desktop = document.getElementById('desktop');
    desktop.innerHTML = ''; 
  
    const fileIndex = JSON.parse(localStorage.getItem('file_index') || '[]');
    fileIndex.forEach(file => {
      const fileEl = document.createElement('div');
      fileEl.className = 'file';
      fileEl.textContent = file.name;
      fileEl.dataset.filename = file.name;
  
      fileEl.addEventListener('click', () => {
        const content = localStorage.getItem(`file_${file.name}`);
        alert(`Opening file "${file.name}":\n\n${content}`);
      });
  
      desktop.appendChild(fileEl);
    });
  }
  