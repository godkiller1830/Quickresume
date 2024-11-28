export class PreviewManager {
  constructor(form) {
    this.form = form;
    this.preview = document.getElementById('resumePreview');
    this.initializeTemplateSelection();
  }

  initializeTemplateSelection() {
    const templateSelect = document.getElementById('templateSelect');
    if (templateSelect) {
      // Get template from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const templateParam = urlParams.get('template');
      
      if (templateParam) {
        templateSelect.value = templateParam;
      }
      
      this.loadTemplateStyle(templateSelect.value);
      
      templateSelect.addEventListener('change', (event) => {
        this.loadTemplateStyle(event.target.value);
      });
    }
  }

  loadTemplateStyle(templateName) {
    document.querySelectorAll('.template-style').forEach(style => style.remove());
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/template-${templateName}.css`;
    link.classList.add('template-style');
    document.head.appendChild(link);
    this.updatePreview();
  }

  updatePreview() {
    if (!this.preview) return;

    const formData = new FormData(this.form);
    
    const fullName = formData.get('fullName') || 'Your Name';
    const email = formData.get('email') || 'email@example.com';
    const phone = formData.get('phone') || 'Phone Number';
    const location = formData.get('location') || 'Location';
    const professionalTitle = formData.get('professionalTitle') || 'Professional Title';
    const summary = formData.get('summary') || 'Professional summary will appear here...';
    const linkedin = formData.get('linkedin');
    const portfolio = formData.get('portfolio');

    const socialLinksHtml = `
      ${linkedin ? `<a href="${linkedin}" target="_blank" class="social-link"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
      ${portfolio ? `<a href="${portfolio}" target="_blank" class="social-link"><i class="fas fa-globe"></i> Portfolio</a>` : ''}
    `;

    this.preview.innerHTML = `
      <div class="header">
        <div class="full-name">${fullName}</div>
        <div id="position">${professionalTitle}</div>
        <div class="contact-info">
          <span><i class="fas fa-envelope"></i> ${email}</span>
          <span class="separator">|</span>
          <span><i class="fas fa-phone"></i> ${phone}</span>
          <span class="separator">|</span>
          <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
        </div>
        <div class="social-links">
          ${socialLinksHtml}
        </div>
        <div class="about">
          <p id="aboutDesc">${summary}</p>
        </div>
      </div>
      <div class="details">
        <div class="section" id="experienceSection">
          <div class="section__title">Experience</div>
          <div class="section__list" id="experienceList"></div>
        </div>
        <div class="section" id="educationSection">
          <div class="section__title">Education</div>
          <div class="section__list" id="educationList"></div>
        </div>
        <div class="section" id="skillsSection">
          <div class="section__title">Skills</div>
          <div class="skills-list" id="skillsList"></div>
        </div>
        <div class="section" id="additionalSection">
          <div class="section__title">Additional Information</div>
          <div class="section__list" id="additionalList"></div>
        </div>
      </div>
    `;

    this.updateExperience(formData);
    this.updateEducation(formData);
    this.updateSkills();
    this.updateAdditional(formData);
  }

  updateExperience(formData) {
    const experienceList = this.preview.querySelector('#experienceList');
    if (!experienceList) return;

    const jobTitles = formData.getAll('jobTitle[]');
    const companies = formData.getAll('company[]');
    const locations = formData.getAll('location[]');
    const startDates = formData.getAll('startDate[]');
    const endDates = formData.getAll('endDate[]');
    const descriptions = formData.getAll('jobDescription[]');

    experienceList.innerHTML = jobTitles.map((title, i) => `
      <div class="section__list-item">
        <h3>${title}</h3>
        <p class="light">${companies[i]} ${locations[i] ? `| ${locations[i]}` : ''} | ${this.formatDate(startDates[i])} - ${this.formatDate(endDates[i])}</p>
        <p>${descriptions[i]}</p>
      </div>
    `).join('');
  }

  updateEducation(formData) {
    const educationList = this.preview.querySelector('#educationList');
    if (!educationList) return;

    const degrees = formData.getAll('degree[]');
    const schools = formData.getAll('school[]');
    const locations = formData.getAll('eduLocation[]');
    const eduStartDates = formData.getAll('eduStartDate[]');
    const eduEndDates = formData.getAll('eduEndDate[]');

    educationList.innerHTML = degrees.map((degree, i) => `
      <div class="section__list-item">
        <h3>${degree}</h3>
        <p class="light">${schools[i]} ${locations[i] ? `| ${locations[i]}` : ''} | ${this.formatDate(eduStartDates[i])} - ${this.formatDate(eduEndDates[i])}</p>
      </div>
    `).join('');
  }

  updateSkills() {
    const skillsList = this.preview.querySelector('#skillsList');
    if (!skillsList) return;

    const skillsHidden = document.getElementById('skillsHidden');
    const skills = skillsHidden?.value.split(',').filter(Boolean) || [];

    skillsList.innerHTML = skills.map(skill => `
      <span class="skill-tag">${skill}</span>
    `).join('');
  }

  updateAdditional(formData) {
    const additionalList = this.preview.querySelector('#additionalList');
    if (!additionalList) return;

    const types = formData.getAll('additionalType[]');
    const titles = formData.getAll('additionalTitle[]');
    const descriptions = formData.getAll('additionalDescription[]');

    const groupedItems = types.reduce((acc, type, i) => {
      if (titles[i] && descriptions[i]) {
        if (!acc[type]) acc[type] = [];
        acc[type].push({ title: titles[i], description: descriptions[i] });
      }
      return acc;
    }, {});

    additionalList.innerHTML = Object.entries(groupedItems).map(([type, items]) => `
      <div class="additional-group">
        <h3 class="additional-type-title">${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        ${items.map(item => `
          <div class="additional-item">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}