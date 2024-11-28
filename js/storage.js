import { auth, db } from './firebaseConfig.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export class StorageManager {
  constructor(form, skillsManager) {
    this.form = form;
    this.skillsManager = skillsManager;
    this.saveBtn = document.querySelector('.save-btn');
    this.autoSaveInterval = null;
    this.hasUnsavedChanges = false;
    this.autoSaveEnabled = JSON.parse(localStorage.getItem('autoSaveEnabled')) || false;
    this.currentResumeId = null;

    if (this.saveBtn) {
      this.initializeEventListeners();
    }

    this.setupAutoSaveToggle();

    if (this.autoSaveEnabled) {
      this.startAutoSave();
    }

    // Get resume ID from URL if editing
    const urlParams = new URLSearchParams(window.location.search);
    this.currentResumeId = urlParams.get('id');
  }

  initializeEventListeners() {
    this.saveBtn.addEventListener('click', () => this.saveDraft());
    this.form.addEventListener('input', () => {
      this.hasUnsavedChanges = true;
    });
  }

  setupAutoSaveToggle() {
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    if (autoSaveToggle) {
      autoSaveToggle.checked = this.autoSaveEnabled;
      autoSaveToggle.addEventListener('change', (e) => {
        this.autoSaveEnabled = e.target.checked;
        localStorage.setItem('autoSaveEnabled', JSON.stringify(this.autoSaveEnabled));

        if (this.autoSaveEnabled) {
          this.startAutoSave();
        } else {
          this.stopAutoSave();
        }
      });
    }
  }

  startAutoSave() {
    if (this.autoSaveInterval) return;
    this.autoSaveInterval = setInterval(() => {
      if (this.hasUnsavedChanges) {
        this.saveDraft();
      }
    }, 10000);
  }

  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  async saveDraft() {
    const formData = new FormData(this.form);
    const resumePreview = document.getElementById('resumePreview');
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      const data = {
        title: formData.get('fullName') || 'Untitled Resume',
        lastModified: new Date(),
        previewHtml: resumePreview ? resumePreview.innerHTML : '',
        formData: Object.fromEntries(formData),
        skills: this.skillsManager.getSkills(),
        template: document.getElementById('templateSelect')?.value || 'default'
      };

      // Use existing ID if editing, otherwise create new
      const resumeId = this.currentResumeId || crypto.randomUUID();
      const resumeRef = doc(db, `users/${user.uid}/resumes/${resumeId}`);
      await setDoc(resumeRef, data);
      
      // Update current resume ID if it was a new resume
      if (!this.currentResumeId) {
        this.currentResumeId = resumeId;
        // Update URL without reloading the page
        window.history.replaceState({}, '', `?id=${resumeId}`);
      }
      
      this.hasUnsavedChanges = false;
      alert('Resume saved successfully!');
    } catch (error) {
      console.error("Error saving resume:", error);
      alert('Error saving resume. Please try again.');
    }
  }

  async loadDraft() {
    const user = auth.currentUser;
    if (!user || !this.currentResumeId) return false;

    try {
      const resumeRef = doc(db, `users/${user.uid}/resumes/${this.currentResumeId}`);
      const docSnap = await getDoc(resumeRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Set template
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect && data.template) {
          templateSelect.value = data.template;
          // Trigger template style update
          const event = new Event('change');
          templateSelect.dispatchEvent(event);
        }

        // Set form data
        if (data.formData) {
          Object.entries(data.formData).forEach(([key, value]) => {
            const input = this.form.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
          });
        }

        // Set skills
        if (data.skills) {
          this.skillsManager.setSkills(data.skills);
        }

        return true;
      }
    } catch (error) {
      console.error("Error loading resume:", error);
    }
    return false;
  }
}