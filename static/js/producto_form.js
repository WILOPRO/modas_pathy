// static/js/producto_form.js

let filesList = [];
let mainIndex = null;            // índice para nuevas imágenes
let existingMainId = null;       // id para imágenes existentes
const preview = document.getElementById('preview-container');
const fileInput = document.getElementById('image-input');
const mainIndexInput = document.getElementById('main_image_index');
const MAX_UPLOAD = 16 * 1024 * 1024; // 16MB

// Si al cargar la página ya hay una principal (backend), la leemos:
document.addEventListener('DOMContentLoaded', () => {
  const marked = preview.querySelector('.image-thumbnail.main[data-backend="true"]');
  if (marked) {
    existingMainId = marked.dataset.id;
    mainIndexInput.value = `b_${existingMainId}`;
  }
});

// Al cambiar el input de archivos
fileInput.addEventListener('change', (e) => {
  for (const file of e.target.files) {
    filesList.push(file);
  }

  // Auto-marca la primera imagen al crear un producto nuevo
  if (fileInput.dataset.nuevo === 'true' && mainIndex === null && filesList.length > 0) {
    mainIndex = 0;
  }

  renderImages();
  setFileInputFiles(filesList);
  fileInput.value = '';
});

function renderImages() {
  // Guardamos el botón “+”
  const plusBtn = preview.querySelector('.add-image');
  // Tomamos miniaturas existentes (backend) y limpiamos
  const backendThumbs = Array.from(preview.querySelectorAll('[data-backend="true"]'));
  preview.innerHTML = '';
  backendThumbs.forEach(div => preview.appendChild(div));
  preview.appendChild(plusBtn);

  // Agregamos nuevas miniaturas
  filesList.forEach((file, i) => {
    const url = URL.createObjectURL(file);
    const div = document.createElement('div');
    div.className = 'image-thumbnail';
    div.setAttribute('data-new', 'true');
    if (mainIndex === i) div.classList.add('main');
    div.innerHTML = `
      <img src="${url}">
      <div class="main-indicator" onclick="setMainImage(${i})">
        ${ mainIndex === i ? '✔' : '' }
      </div>
      <button type="button" class="remove-btn" onclick="removeImage(${i})">&times;</button>
    `;
    preview.insertBefore(div, plusBtn);
  });
}

// Sincroniza el FileList real con filesList
function setFileInputFiles(files) {
  const dt = new DataTransfer();
  files.forEach(f => dt.items.add(f));
  fileInput.files = dt.files;
}

// ————— Marcar nueva imagen como principal —————
window.setMainImage = function(idx) {
  // Desmarcamos cualquier miniatura
  document.querySelectorAll('.image-thumbnail').forEach(div => {
    div.classList.remove('main');
    const mi = div.querySelector('.main-indicator');
    if (mi) mi.innerText = '';
  });
  // Marcamos esta nueva
  mainIndex = idx;
  existingMainId = null;  // anulamos la existente
  renderImages();
  mainIndexInput.value = mainIndex;
};
// ————————————————————————————————————————————

// ————— Marcar imagen existente como principal —————
window.selectExistingImage = function(el) {
  // Desmarcamos cualquier miniatura
  document.querySelectorAll('.image-thumbnail').forEach(div => {
    div.classList.remove('main');
    const mi = div.querySelector('.main-indicator');
    if (mi) mi.innerText = '';
  });
  // Marcamos esta existente
  const thumb = el.parentElement;
  thumb.classList.add('main');
  thumb.querySelector('.main-indicator').innerText = '✔';

  // Limpiamos selección de nuevas
  mainIndex = null;
  existingMainId = thumb.dataset.id;
  mainIndexInput.value = `b_${existingMainId}`;
};
// ———————————————————————————————————————————————

// Eliminar nueva imagen de la lista
window.removeImage = function(idx) {
  filesList.splice(idx, 1);
  if (mainIndex === idx) mainIndex = null;
  if (mainIndex > filesList.length - 1) mainIndex = null;
  renderImages();
  setFileInputFiles(filesList);
  mainIndexInput.value = mainIndex !== null
    ? mainIndex
    : existingMainId
      ? `b_${existingMainId}`
      : '';
};

// Eliminar imagen existente (backend)
window.removeExistingImage = function(imgId, el) {
  if (!confirm('¿Seguro que deseas eliminar esta imagen?')) return;
  el.parentElement.remove();

  // Si era la principal, resetear
  if (existingMainId === String(imgId)) {
    existingMainId = null;
    mainIndexInput.value = '';
  }

  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.name = 'delete_image_ids';
  hidden.value = imgId;
  document.querySelector('form').appendChild(hidden);
};

// Validación antes de submit
document.querySelector('form').addEventListener('submit', function (e) {
  setFileInputFiles(filesList);
  // Asegurarnos de que mainIndexInput esté actualizado
  if (mainIndex !== null) {
    mainIndexInput.value = mainIndex;
  } else if (existingMainId) {
    mainIndexInput.value = `b_${existingMainId}`;
  } else {
    mainIndexInput.value = '';
  }

  const esNuevo = fileInput.dataset.nuevo === 'true';
  const hasExisting = document.querySelectorAll('[data-backend="true"]').length > 0;
  const totalSize = filesList.reduce((t, f) => t + f.size, 0);
  if (totalSize > MAX_UPLOAD) {
    alert('El tamaño total de las imágenes supera el límite de 16MB.');
    e.preventDefault();
    return;
  }
  if (esNuevo && fileInput.files.length === 0 && !hasExisting) {
    alert('Por favor, sube al menos una imagen del producto.');
    e.preventDefault();
  }
});
