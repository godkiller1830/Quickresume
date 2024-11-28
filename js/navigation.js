export class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll('.form-section');
    this.progressSteps = document.querySelectorAll('.progress-step');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentSection = 1;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate('prev'));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate('next'));
    }
  }

  navigate(direction) {
    if (direction === 'next' && this.currentSection < 6) {
      this.currentSection++;
      this.showSection(this.currentSection);
    } else if (direction === 'prev' && this.currentSection > 1) {
      this.currentSection--;
      this.showSection(this.currentSection);
    }
  }

  showSection(sectionNumber) {
    this.sections.forEach(section => section.classList.remove('active'));
    this.progressSteps.forEach(step => step.classList.remove('active'));
    
    const activeSection = document.querySelector(`[data-section="${sectionNumber}"]`);
    const activeStep = document.querySelector(`[data-step="${sectionNumber}"]`);
    
    if (activeSection) activeSection.classList.add('active');
    if (activeStep) activeStep.classList.add('active');
    
    if (this.prevBtn) {
      this.prevBtn.style.display = sectionNumber === 1 ? 'none' : 'block';
    }
    if (this.nextBtn) {
      this.nextBtn.textContent = sectionNumber === 6 ? 'Finish' : 'Next';
    }
  }
}