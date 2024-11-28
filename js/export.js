export class ExportManager {
  constructor() {
    this.exportBtn = document.querySelector('.export-btn');
    if (this.exportBtn) {
      this.initializeEventListeners();
    }
  }

  initializeEventListeners() {
    this.exportBtn.addEventListener('click', () => this.exportPDF());
  }

  exportPDF() {
    const element = document.getElementById('resumePreview');
    if (!element) return;

    const options = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Export PDF with selected template styling
    html2pdf().set(options).from(element).save().then(() => {
      alert('Resume exported successfully!');
    }).catch(error => {
      console.error("Error exporting PDF:", error);
      alert("An error occurred while exporting the resume. Please try again.");
    });
  }
}
