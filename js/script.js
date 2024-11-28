import { SkillsManager } from './js/skills.js';
import { PreviewManager } from './js/preview.js';
import { NavigationManager } from './js/navigation.js';
import { StorageManager } from './js/storage.js';
import { ExportManager } from './js/export.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resumeForm');
  if (!form) return;

  // Initialize managers
  const skillsManager = new SkillsManager();
  const previewManager = new PreviewManager(form);
  const navigationManager = new NavigationManager();
  const storageManager = new StorageManager(form, skillsManager);
  const exportManager = new ExportManager();

  // Event listener for dynamically adding more fields (e.g., more experience entries)
  document.querySelectorAll('.add-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fieldType = btn.dataset.field;
      const container = document.getElementById(`${fieldType}Fields`);
      if (container) {
        const entry = container.querySelector(`.${fieldType}-entry`);
        if (entry) {
          const newEntry = entry.cloneNode(true);
          newEntry.querySelectorAll('input, textarea').forEach(input => input.value = '');
          container.appendChild(newEntry);
          
          // Ensure the preview updates when a new entry is added
          previewManager.updatePreview();
        }
      }
    });
  });

  // Real-time preview update on any form input change
  form.addEventListener('input', () => previewManager.updatePreview());

  // Load draft if it exists in Firebase
  storageManager.loadDraft();

  // Show the first section of the resume form
  navigationManager.showSection(1);
});
