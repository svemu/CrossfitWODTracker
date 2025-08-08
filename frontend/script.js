// Firebase configuration placeholder (replace with your own config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Apple-style chart defaults
Chart.defaults.color = '#1d1d1f';
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

// Google sign-in
const googleBtn = document.getElementById('google-login');
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(console.error);
  });
}

// Facebook sign-in
const facebookBtn = document.getElementById('facebook-login');
if (facebookBtn) {
  facebookBtn.addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).catch(console.error);
  });
}

// Tab handling
const logTab = document.getElementById('log-tab');
const analyticsTab = document.getElementById('analytics-tab');

document.querySelectorAll('#tabs a').forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target.getAttribute('href');
    if (target === '#analytics-tab') {
      logTab.style.display = 'none';
      analyticsTab.style.display = 'block';
      loadAnalytics();
    } else {
      analyticsTab.style.display = 'none';
      logTab.style.display = 'block';
    }
  });
});

// OCR handling
const wodImage = document.getElementById('wod-image');
const wodText = document.getElementById('wod-text');
const ocrStatus = document.getElementById('ocr-status');

if (wodImage) {
  wodImage.addEventListener('change', () => {
    const file = wodImage.files[0];
    if (!file) return;
    ocrStatus.textContent = 'Processing image...';
    Tesseract.recognize(file, 'eng').then(({ data }) => {
      wodText.value = data.text;
      ocrStatus.textContent = 'OCR complete. Review and edit if needed.';
    }).catch(err => {
      console.error(err);
      ocrStatus.textContent = 'OCR failed.';
    });
  });
}

// Save WOD data
const saveBtn = document.getElementById('save-wod');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const text = wodText.value.trim();
    if (!auth.currentUser) {
      alert('Please sign in first');
      return;
    }
    if (!text) {
      alert('No workout details provided');
      return;
    }
    db.collection('wods').add({
      uid: auth.currentUser.uid,
      text,
      createdAt: new Date()
    }).then(() => {
      wodText.value = '';
      wodImage.value = '';
      M.toast({text: 'Workout saved!'});
    }).catch(err => {
      console.error(err);
      alert('Error saving workout');
    });
  });
}

// Load analytics
function loadAnalytics() {
  if (!auth.currentUser) {
    alert('Please sign in to view analytics');
    return;
  }
  db.collection('wods').where('uid', '==', auth.currentUser.uid).orderBy('createdAt').get()
    .then(snapshot => {
      const labels = [];
      const dataPoints = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        labels.push(new Date(data.createdAt.seconds * 1000).toLocaleDateString());
        dataPoints.push(data.text.length); // naive metric: text length
      });
      renderChart(labels, dataPoints);
    });
}

let chart;
function renderChart(labels, data) {
  const ctx = document.getElementById('analytics-chart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Workout text length',
        data,
        borderColor: '#0071e3',
        fill: false,
      }]
    },
    options: {
      responsive: true,
    }
  });
}
