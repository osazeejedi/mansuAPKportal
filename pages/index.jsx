import Head from 'next/head'
import Image from 'next/image'
import '../styles/globals.css'

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mansu Internal - APK Testing Portal</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script src="/script.js" defer></script>
      </Head>

      <div>
        <header>
          <div className="container">
            <div className="logo">
              <img src="/mansu-logo.png" alt="Mansu Logo" />
            </div>
            <nav>
              <ul>
                <li><a href="#" className="active">APK Testing</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="https://mansu.io" target="_blank">Main Website</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <section className="hero">
          <div className="container">
            <h1>Internal APK Testing Portal</h1>
            <p>Access and test the latest builds of Mansu applications</p>
          </div>
        </section>

        <section className="apk-section">
          <div className="container">
            <h2>Available APK Builds</h2>
            
            <div className="apk-grid">
              <div className="apk-card">
                <div className="apk-info">
                  <h3>Mansu Wallet</h3>
                  <p className="version">Version 3.1.0 (Alpha)</p>
                  <p className="date">Released: June 8, 2024</p>
                  <p className="description">Mobile wallet application for the Mansu ecosystem.</p>
                  <div className="tags">
                    <span className="tag alpha">Alpha</span>
                    <span className="tag">Internal</span>
                  </div>
                </div>
                <div className="apk-actions">
                  <a href="#" className="btn-primary">Download APK</a>
                  <a href="#" className="btn-secondary">Release Notes</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="upload-section">
          <div className="container">
            <h2>Upload New APK</h2>
            <p>For development team members only</p>
            
            <form className="upload-form">
              <div className="form-group">
                <label htmlFor="app-name">Application Name</label>
                <input type="text" id="app-name" placeholder="Enter application name" />
              </div>
              
              <div className="form-group">
                <label htmlFor="version">Version</label>
                <input type="text" id="version" placeholder="e.g., 1.0.0" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="build-type">Build Type</label>
                  <select id="build-type">
                    <option value="production">Production</option>
                    <option value="beta">Beta</option>
                    <option value="alpha">Alpha</option>
                    <option value="dev">Development</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="release-date">Release Date</label>
                  <input type="date" id="release-date" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="release-notes">Release Notes</label>
                <textarea id="release-notes" placeholder="Describe what's new in this build"></textarea>
              </div>
              
              <div className="form-group file-upload">
                <label htmlFor="apk-file">APK File</label>
                <input type="file" id="apk-file" accept=".apk" />
                <div className="file-upload-box">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Drag and drop APK file here or click to browse</p>
                </div>
              </div>
              
              <button type="submit" className="btn-primary">Upload APK</button>
            </form>
          </div>
        </section>

        <section className="testing-guide">
          <div className="container">
            <h2>Testing Guidelines</h2>
            
            <div className="guide-cards">
              <div className="guide-card">
                <div className="icon">
                  <i className="fas fa-download"></i>
                </div>
                <h3>1. Download</h3>
                <p>Download the APK file to your Android device or emulator</p>
              </div>
              
              <div className="guide-card">
                <div className="icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3>2. Install</h3>
                <p>Enable "Install from Unknown Sources" in settings and install the APK</p>
              </div>
              
              <div className="guide-card">
                <div className="icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>3. Test</h3>
                <p>Follow the test plan and document any issues you encounter</p>
              </div>
              
              <div className="guide-card">
                <div className="icon">
                  <i className="fas fa-bug"></i>
                </div>
                <h3>4. Report</h3>
                <p>Submit bug reports through the internal ticketing system</p>
              </div>
            </div>
            
            <a href="#" className="btn-secondary">View Detailed Testing Documentation</a>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <img src="/mansu-logo.png" alt="Mansu Logo" />
                <p>Connecting Businesses Globally: Procurement, Logistics, and Financial Solutions Tailored to Your Needs.</p>
              </div>
              
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#">APK Testing</a></li>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Support</a></li>
                  <li><a href="https://mansu.io" target="_blank">Main Website</a></li>
                </ul>
              </div>
              
              <div className="footer-contact">
                <h4>Contact</h4>
                <p>Building 3 North London Business Park</p>
                <p>Oakleigh Road South</p>
                <p>Email: <a href="osazee:internal@mansu.io">internal@mansu.io</a></p>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2025 Mansu Company. All Rights Reserved. Internal Use Only.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 