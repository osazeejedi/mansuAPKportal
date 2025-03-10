document.addEventListener('DOMContentLoaded', function() {
    // File upload functionality
    const fileUpload = document.querySelector('.file-upload-box');
    const fileInput = document.getElementById('apk-file');
    
    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                fileUpload.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--success);"></i>
                    <p>${fileName}</p>
                    <small>Click to change file</small>
                `;
            }
        });
        
        // Drag and drop functionality
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#e6f0ff';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        fileUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#f0f7ff';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#f0f7ff';
            this.style.borderColor = 'var(--primary-color)';
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                const fileName = e.dataTransfer.files[0].name;
                fileUpload.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--success);"></i>
                    <p>${fileName}</p>
                    <small>Click to change file</small>
                `;
            }
        });
    }
    
    // Form submission with real upload
    const uploadForm = document.querySelector('.upload-form');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const appName = document.getElementById('app-name').value;
            const version = document.getElementById('version').value;
            const buildType = document.getElementById('build-type').value;
            const releaseDate = document.getElementById('release-date').value;
            const releaseNotes = document.getElementById('release-notes').value;
            const apkFile = document.getElementById('apk-file').files[0];
            
            if (!appName || !version || !apkFile) {
                alert('Please fill in all required fields and upload an APK file.');
                return;
            }
            
            // Create form data for upload
            const formData = new FormData();
            formData.append('appName', appName);
            formData.append('version', version);
            formData.append('buildType', buildType);
            formData.append('releaseDate', releaseDate);
            formData.append('releaseNotes', releaseNotes);
            formData.append('apkFile', apkFile);
            
            // Update UI to show upload in progress
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            
            // Send to server
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Server error:', errorData);
                    throw new Error(errorData.details || 'Upload failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Upload successful:', data);
                alert('APK uploaded successfully!');
                uploadForm.reset();
                fileUpload.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop APK file here or click to browse</p>
                `;
                
                // Add the new APK to the list without page refresh
                addNewApkToList(data.apk);
            })
            .catch(error => {
                console.error('Upload error:', error);
                alert('Upload failed: ' + error.message);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload APK';
            });
        });
    }
    
    // Function to add a new APK to the list
    function addNewApkToList(apk) {
        const apkGrid = document.querySelector('.apk-grid');
        
        if (!apkGrid) return;
        
        const tagClass = getTagClassForBuildType(apk.buildType);
        
        const apkCard = document.createElement('div');
        apkCard.className = 'apk-card';
        apkCard.innerHTML = `
            <div class="apk-info">
                <h3>${apk.name}</h3>
                <p class="version">Version ${apk.version} (${apk.buildType})</p>
                <p class="date">Released: ${formatDate(apk.releaseDate)}</p>
                <p class="description">${apk.releaseNotes || 'No description available.'}</p>
                <div class="tags">
                    <span class="tag ${tagClass}">${apk.buildType}</span>
                    <span class="tag">New</span>
                </div>
            </div>
            <div class="apk-actions">
                <a href="${apk.downloadUrl}" class="btn-primary" download>Download APK</a>
                <a href="#" class="btn-secondary view-notes" data-id="${apk.id}">Release Notes</a>
            </div>
        `;
        
        // Add to the beginning of the grid
        if (apkGrid.firstChild) {
            apkGrid.insertBefore(apkCard, apkGrid.firstChild);
        } else {
            apkGrid.appendChild(apkCard);
        }
    }
    
    // Helper function to get tag class based on build type
    function getTagClassForBuildType(buildType) {
        switch(buildType.toLowerCase()) {
            case 'alpha': return 'alpha';
            case 'beta': return 'beta';
            case 'production': return '';
            default: return '';
        }
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Load existing APKs on page load
    function loadExistingApks() {
        const apkGrid = document.querySelector('.apk-grid');
        
        if (!apkGrid) return;
        
        // Clear any placeholder content
        apkGrid.innerHTML = '<div class="loading">Loading APKs...</div>';
        
        fetch('/api/apks')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch APKs');
                }
                return response.json();
            })
            .then(data => {
                apkGrid.innerHTML = '';
                
                if (data.apks && data.apks.length > 0) {
                    data.apks.forEach(apk => {
                        addNewApkToList(apk);
                    });
                } else {
                    apkGrid.innerHTML = '<div class="no-apks">No APKs available. Upload your first APK above.</div>';
                }
            })
            .catch(error => {
                console.error('Error loading APKs:', error);
                apkGrid.innerHTML = '<div class="error">Failed to load APKs. Please refresh the page.</div>';
            });
    }
    
    // Load APKs when page loads
    loadExistingApks();
    
    // APK download tracking
    document.addEventListener('click', function(e) {
        if (e.target.matches('.apk-actions .btn-primary')) {
            const appName = e.target.closest('.apk-card').querySelector('h3').textContent;
            console.log(`Download started for ${appName}`);
            // You could add analytics tracking here
        }
    });
}); 