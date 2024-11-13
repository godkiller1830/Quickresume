import { 
    auth,
    db,
    collection,
    getDocs,
    query,
    where,
    onAuthStateChanged
} from './firebaseConfig.js';

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userName').textContent = user.displayName || user.email;
        loadSavedResumes(user.uid);
    } else {
        window.location.href = '/';
    }
});

// Load user's saved resumes
async function loadSavedResumes(userId) {
    const savedResumesDiv = document.getElementById('savedResumes');
    const resumesRef = collection(db, `users/${userId}/resumes`);
    
    try {
        const querySnapshot = await getDocs(resumesRef);
        
        if (querySnapshot.empty) {
            savedResumesDiv.innerHTML = `
                <div class="template-card">
                    <div class="template-info">
                        <h3>No Resumes Yet</h3>
                        <p>Create your first resume using one of our templates below!</p>
                    </div>
                </div>
            `;
            return;
        }

        savedResumesDiv.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const resumeData = doc.data();
            const resumeCard = createResumeCard(doc.id, resumeData);
            savedResumesDiv.appendChild(resumeCard);
        });
    } catch (error) {
        console.error("Error loading resumes:", error);
        savedResumesDiv.innerHTML = `
            <div class="error-message">
                Error loading resumes. Please try again later.
            </div>
        `;
    }
}

// Create resume card element
function createResumeCard(id, data) {
    const div = document.createElement('div');
    div.className = 'template-card';
    div.innerHTML = `
        <div class="template-info">
            <h3>${data.title || 'Untitled Resume'}</h3>
            <p>Last edited: ${new Date(data.lastEdited).toLocaleDateString()}</p>
            <div class="template-actions">
                <button class="btn btn-primary" onclick="window.location.href='resume-builder.html?id=${id}'">
                    Edit
                </button>
                <button class="btn btn-secondary" onclick="deleteResume('${id}')">
                    Delete
                </button>
            </div>
        </div>
    `;
    return div;
}

// Delete resume
window.deleteResume = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
        const userId = auth.currentUser.uid;
        await deleteDoc(doc(db, `users/${userId}/resumes/${resumeId}`));
        loadSavedResumes(userId);
    } catch (error) {
        console.error("Error deleting resume:", error);
        alert('Error deleting resume. Please try again.');
    }
};