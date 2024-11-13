// DOM Elements
const personalForm = document.getElementById('personalForm');
const addExperience = document.getElementById('addExperience');
const addEducation = document.getElementById('addEducation');
const experienceList = document.getElementById('experienceList');
const educationList = document.getElementById('educationList');
const technicalSkills = document.getElementById('technicalSkills');
const softSkills = document.getElementById('softSkills');
const generateSummary = document.getElementById('generateSummary');
const downloadPDF = document.getElementById('downloadPDF');

// Preview Elements
const previewElements = {
    name: document.getElementById('previewName'),
    jobTitle: document.getElementById('previewJobTitle'),
    contact: document.getElementById('previewContact'),
    summary: document.getElementById('previewSummary'),
    experience: document.getElementById('previewExperience'),
    education: document.getElementById('previewEducation'),
    technicalSkills: document.getElementById('previewTechnicalSkills')
};

// Event Listeners with Debouncing
let updateTimeout;
const debouncedUpdate = (callback) => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(callback, 300);
};

// Form event listeners
personalForm.addEventListener('input', () => debouncedUpdate(updatePreview));
document.getElementById('summary').addEventListener('input', () => debouncedUpdate(updatePreview));

// Add experience entry
addExperience.addEventListener('click', () => {
    const entry = createExperienceEntry();
    experienceList.appendChild(entry);
    entry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => debouncedUpdate(updatePreview));
    });
    updatePreview();
    entry.querySelector('input').focus();
});

// Add education entry
addEducation.addEventListener('click', () => {
    const entry = createEducationEntry();
    educationList.appendChild(entry);
    entry.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => debouncedUpdate(updatePreview));
    });
    updatePreview();
    entry.querySelector('input').focus();
});

// Skills handling
[technicalSkills, softSkills].forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            e.preventDefault();
            addSkillTag(input.value.trim(), input.id === 'technicalSkills' ? 'technicalSkillsTags' : 'softSkillsTags');
            input.value = '';
            updatePreview();
        }
    });
});

// PDF Generation
downloadPDF.addEventListener('click', generatePDF);

// Functions
function createExperienceEntry() {
    const entry = document.createElement('div');
    entry.className = 'experience-entry animate-fade-in';
    entry.innerHTML = `
        <div class="input-group">
            <label>Job Title</label>
            <input type="text" name="jobTitle" class="experience-input" placeholder="e.g., Senior Developer">
        </div>
        <div class="input-group">
            <label>Company</label>
            <input type="text" name="company" class="experience-input" placeholder="e.g., Tech Corp">
        </div>
        <div class="input-group">
            <label>Duration</label>
            <input type="text" name="duration" class="experience-input" placeholder="e.g., 2020 - Present">
        </div>
        <div class="input-group">
            <label>Description</label>
            <textarea name="description" rows="3" class="experience-input" 
                      placeholder="Describe your key responsibilities and achievements..."></textarea>
        </div>
        <button type="button" class="btn" onclick="this.parentElement.remove(); updatePreview();">
            Remove Entry
        </button>
    `;
    return entry;
}

function createEducationEntry() {
    const entry = document.createElement('div');
    entry.className = 'education-entry animate-fade-in';
    entry.innerHTML = `
        <div class="input-group">
            <label>Degree</label>
            <input type="text" name="degree" class="education-input" placeholder="e.g., Bachelor of Science">
        </div>
        <div class="input-group">
            <label>Institution</label>
            <input type="text" name="institution" class="education-input" placeholder="e.g., University Name">
        </div>
        <div class="input-group">
            <label>Duration</label>
            <input type="text" name="duration" class="education-input" placeholder="e.g., 2016 - 2020">
        </div>
        <button type="button" class="btn" onclick="this.parentElement.remove(); updatePreview();">
            Remove Entry
        </button>
    `;
    return entry;
}

function addSkillTag(skill, containerId) {
    if (!skill) return;
    const container = document.getElementById(containerId);
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.innerHTML = `
        ${skill}
        <button onclick="this.parentElement.remove(); updatePreview();">×</button>
    `;
    container.appendChild(tag);
}

function updatePreview() {
    const formData = new FormData(personalForm);
    
    // Update personal information
    previewElements.name.textContent = formData.get('fullName') || 'Your Name';
    previewElements.jobTitle.textContent = formData.get('jobTitle') || 'Your Job Title';
    
    // Update contact information
    previewElements.contact.innerHTML = `
        <p>${formData.get('address') || 'Your Address'}</p>
        <p>${formData.get('phone') || 'Your Phone'}</p>
        <p>${formData.get('email') || 'Your Email'}</p>
    `;
    
    // Update summary
    previewElements.summary.textContent = document.getElementById('summary').value || 
        'Your professional summary will appear here...';
    
    // Update experience
    updateExperienceSection();
    
    // Update education
    updateEducationSection();
    
    // Update skills
    updateSkillsSection();
}

function updateExperienceSection() {
    const experiences = Array.from(document.querySelectorAll('.experience-entry'));
    previewElements.experience.innerHTML = experiences.map(exp => `
        <h3>${exp.querySelector('[name="jobTitle"]').value || 'Job Title'}</h3>
        <p class="light">${exp.querySelector('[name="company"]').value || 'Company'} - 
           ${exp.querySelector('[name="duration"]').value || 'Duration'}</p>
        <p class="justified">${exp.querySelector('[name="description"]').value || 'Job description'}</p>
    `).join('');
}

function updateEducationSection() {
    const educationItems = Array.from(document.querySelectorAll('.education-entry'));
    previewElements.education.innerHTML = educationItems.map(edu => `
        <p class="list-thing">${edu.querySelector('[name="degree"]').value || 'Degree'} - 
           ${edu.querySelector('[name="institution"]').value || 'Institution'}</p>
    `).join('');
}

function updateSkillsSection() {
    const techSkills = Array.from(document.querySelectorAll('#technicalSkillsTags .skill-tag'))
        .map(tag => tag.textContent.trim());
    previewElements.technicalSkills.innerHTML = techSkills
        .map(skill => `<p class="list-thing">${skill}</p>`)
        .join('');
}

async function generatePDF() {
    const element = document.querySelector('.page');
    const opt = {
        margin: 1,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    try {
        downloadPDF.disabled = true;
        downloadPDF.textContent = 'Generating PDF...';
        await html2pdf().set(opt).from(element).save();
    } finally {
        downloadPDF.disabled = false;
        downloadPDF.textContent = 'Download PDF';
    }
}