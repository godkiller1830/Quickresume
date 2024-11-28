export class SkillsManager {
  constructor() {
    this.skills = new Set();
    this.skillInput = document.getElementById('skillInput');
    this.addSkillBtn = document.getElementById('addSkillBtn');
    this.skillTags = document.getElementById('skillTags');
    this.skillsHidden = document.getElementById('skillsHidden');

    if (this.addSkillBtn && this.skillInput) {
      this.initializeEventListeners();
    }
  }

  initializeEventListeners() {
    this.addSkillBtn.addEventListener('click', () => this.addSkill(this.skillInput.value.trim()));
    this.skillInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addSkill(this.skillInput.value.trim());
      }
    });
  }

  addSkill(skill) {
    if (skill && !this.skills.has(skill)) {
      this.skills.add(skill);
      this.updateSkillTags();
      this.updatePreview();
    }
    if (this.skillInput) {
      this.skillInput.value = '';
    }
  }

  removeSkill(skill) {
    this.skills.delete(skill);
    this.updateSkillTags();
    this.updatePreview();
  }

  updateSkillTags() {
    if (!this.skillTags || !this.skillsHidden) return;

    this.skillTags.innerHTML = '';
    this.skillsHidden.value = Array.from(this.skills).join(',');
    
    this.skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.innerHTML = `${skill} <span class="remove-skill">&times;</span>`;
      tag.querySelector('.remove-skill').addEventListener('click', () => this.removeSkill(skill));
      this.skillTags.appendChild(tag);
    });
  }

  updatePreview() {
    const preview = document.getElementById('resumePreview');
    if (!preview) return;

    const skillsList = preview.querySelector('.skills-list');
    if (skillsList) {
      skillsList.innerHTML = Array.from(this.skills)
        .map(skill => `<p class="rela-block list-thing">${skill}</p>`)
        .join('');
    }
  }

  getSkills() {
    return Array.from(this.skills);
  }

  setSkills(skillsArray) {
    this.skills = new Set(skillsArray);
    this.updateSkillTags();
    this.updatePreview();
  }
}