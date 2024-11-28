import { auth, db } from './firebaseConfig.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, getDocs, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

class DashboardManager {
  constructor() {
    this.savedResumesContainer = document.getElementById('savedResumes');
    this.userName = document.getElementById('userName');
    this.templateContainer = document.getElementById('templateContainer');
    this.initializeEventListeners();
    this.checkAuthState();
    this.loadTemplates();
  }

  initializeEventListeners() {
    document.getElementById('newResumeButton')?.addEventListener('click', () => {
      window.location.href = 'builder.html';
    });

    document.getElementById('logoutButton')?.addEventListener('click', async () => {
      try {
        await signOut(auth);
        window.location.href = 'login.html';
      } catch (error) {
        console.error("Error signing out:", error);
        alert("Error signing out. Please try again.");
      }
    });
  }

  checkAuthState() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userName.textContent = user.displayName || user.email.split('@')[0];
        this.loadUserResumes(user.uid);
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  loadTemplates() {
    const templates = [
      {
        name: 'Professional Classic',
        image: 'images/template-classic.png',
        value: 'default',
        status: 'available'
      },
      {
        name: 'Modern Minimal',
        image: 'images/template-modern.png',
        value: 'modern',
        status: 'available'
      },
      {
        name: 'Elegant Executive',
        image: 'images/template-elegant.png',
        value: 'elegant',
        status: 'available'
      }
    ];

    const templateHTML = templates.map(template => `
      <div class="template-card ${template.status}">
        <div class="template-preview" style="background-image: url('${template.image}')"></div>
        <h3>${template.name}</h3>
        ${template.status === 'available' 
          ? `<a href="builder.html?template=${template.value}" class="use-template-btn">
              <i class="fas fa-plus"></i> Use Template
             </a>`
          : `<div class="coming-soon-badge">
              <i class="fas fa-clock"></i> Coming Soon
             </div>`
        }
      </div>
    `).join('');

    if (this.templateContainer) {
      this.templateContainer.innerHTML = templateHTML;
    }
  }

  async loadUserResumes(userId) {
    if (!this.savedResumesContainer) return;

    try {
      const resumesRef = collection(db, `users/${userId}/resumes`);
      const snapshot = await getDocs(resumesRef);

      if (snapshot.empty) {
        this.showEmptyState();
        return;
      }

      const resumes = [];
      snapshot.forEach((doc) => {
        resumes.push({
          id: doc.id,
          ...doc.data()
        });
      });

      resumes.sort((a, b) => b.lastModified.toDate() - a.lastModified.toDate());

      this.savedResumesContainer.innerHTML = resumes.map(resume => this.createResumeCard(resume)).join('');

      resumes.forEach(resume => {
        document.querySelector(`[data-edit="${resume.id}"]`)?.addEventListener('click', () => this.editResume(resume.id, resume.template));
        document.querySelector(`[data-download="${resume.id}"]`)?.addEventListener('click', () => this.downloadResume(resume.id));
        document.querySelector(`[data-delete="${resume.id}"]`)?.addEventListener('click', () => this.deleteResume(resume.id));
      });
    } catch (error) {
      console.error("Error loading resumes:", error);
      this.showErrorState();
    }
  }

  createResumeCard(resumeData) {
    const lastModified = resumeData.lastModified ? 
      new Date(resumeData.lastModified.toDate()).toLocaleDateString() : 
      'N/A';

    // Create a container for the preview with the correct template styling
    const previewContainer = document.createElement('div');
    previewContainer.innerHTML = resumeData.previewHtml || '';
    
    // Add the template-specific class
    const templateClass = resumeData.template || 'default';
    previewContainer.classList.add(`template-${templateClass}`);
    
    return `
      <div class="resume-card">
        <div class="resume-preview template-${templateClass}">
          <div class="preview-content">
            ${resumeData.previewHtml || ''}
          </div>
        </div>
        <div class="resume-info">
          <h3 class="resume-title">${resumeData.title || 'Untitled Resume'}</h3>
          <p class="resume-date">Last modified: ${lastModified}</p>
          <div class="resume-actions">
            <button class="action-btn edit-btn" data-edit="${resumeData.id}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn download-btn" data-download="${resumeData.id}">
              <i class="fas fa-download"></i> Download
            </button>
            <button class="action-btn delete-btn" data-delete="${resumeData.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  editResume(resumeId, template) {
    window.location.href = `builder.html?id=${resumeId}&template=${template || 'default'}`;
  }

  async downloadResume(resumeId) {
    try {
      const resumeDoc = await getDoc(doc(db, `users/${auth.currentUser.uid}/resumes/${resumeId}`));
      if (!resumeDoc.exists()) {
        throw new Error('Resume not found');
      }

      const resumeData = resumeDoc.data();
      const element = document.createElement('div');
      element.innerHTML = resumeData.previewHtml || '';
      element.classList.add(`template-${resumeData.template || 'default'}`);

      const opt = {
        margin: 0.5,
        filename: `${resumeData.title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Error downloading resume. Please try again.");
    }
  }

  async deleteResume(resumeId) {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/resumes/${resumeId}`));
      this.loadUserResumes(auth.currentUser.uid);
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Error deleting resume. Please try again.");
    }
  }

  showEmptyState() {
    this.savedResumesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-alt"></i>
        <h3>No resumes yet</h3>
        <p>Create your first resume to get started</p>
        <button class="new-resume-btn" onclick="window.location.href='builder.html'">
          <i class="fas fa-plus"></i> Create New Resume
        </button>
      </div>
    `;
  }

  showErrorState() {
    this.savedResumesContainer.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Error loading resumes</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  new DashboardManager();
});