/* 99 Nights in the Forest - JavaScript Functionality */

let selectedCoinsAmount = 0;
let selectedCurrencyType = 'diamonds';

// Configuration
const verificationUrl = "https://example.com/verify"; // Fallback URL

// Dark/Light Mode functionality
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const themeIcon = document.getElementById('theme-icon');
  if (document.body.classList.contains('light-mode')) {
    themeIcon.className = "fas fa-sun";
    themeIcon.alt = "Light Mode";
    localStorage.setItem('theme', 'light');
  } else {
    themeIcon.className = "fas fa-moon";
    themeIcon.alt = "Dark Mode";
    localStorage.setItem('theme', 'dark');
  }
}

// Apply saved theme on load and initialize features
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-icon').className = "fas fa-sun";
    document.getElementById('theme-icon').alt = "Light Mode";
  }
  
  // Initialize input validation
  initializeInputValidation();
  
  // Update currency display
  updateCurrencyDisplay();
  
  // Add loading animations to page transitions
  addPageTransitionEffects();
});

// Enhanced Input Validation
function initializeInputValidation() {
  const usernameInput = document.getElementById('username');
  const searchBtn = document.getElementById('search');
  
  if (usernameInput && searchBtn) {
    usernameInput.addEventListener('input', validateUsername);
    usernameInput.addEventListener('blur', validateUsername);
    usernameInput.addEventListener('focus', clearValidation);
  }
}

function validateUsername() {
  const input = document.getElementById('username');
  const searchBtn = document.getElementById('search');
  const value = input.value.trim();
  
  // Remove previous validation classes
  input.classList.remove('valid', 'invalid');
  
  if (value.length === 0) {
    searchBtn.disabled = true;
    return;
  }
  
  // Username validation rules
  const isValid = value.length >= 3 && 
                  value.length <= 25 && 
                  /^[a-zA-Z0-9_-]+$/.test(value) &&
                  !(/^\d+$/.test(value)); // Not all numbers
  
  if (isValid) {
    input.classList.add('valid');
    searchBtn.disabled = false;
  } else {
    input.classList.add('invalid');
    searchBtn.disabled = true;
  }
}

function clearValidation() {
  const input = document.getElementById('username');
  input.classList.remove('valid', 'invalid');
}

// Update Currency Display
function updateCurrencyDisplay() {
  if (selectedCoinsAmount > 0) {
    const amountElement = document.getElementById('selected-amount');
    const typeElement = document.getElementById('selected-type');
    const iconElement = document.getElementById('selected-currency-icon');
    
    if (amountElement && typeElement && iconElement) {
      amountElement.textContent = selectedCoinsAmount.toLocaleString();
      typeElement.textContent = selectedCurrencyType === 'diamonds' ? 'Diamonds' : 'Robux';
      
      // Update icon based on currency type
      if (selectedCurrencyType === 'diamonds') {
        iconElement.src = 'images/1000diamond.png';
      } else {
        iconElement.src = 'https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/e/d/f/edfae9388da4cd8496b885a8a2df613372500d9c.png';
      }
    }
  }
}

// Enhanced Page Transition Effects
function addPageTransitionEffects() {
  // Add subtle loading effect when switching pages
  const originalShowPage = showPage;
  window.showPage = function(pageId) {
    document.body.style.pointerEvents = 'none';
    setTimeout(() => {
      originalShowPage(pageId);
      document.body.style.pointerEvents = 'auto';
    }, 100);
  };
}

const loadingOverlay = document.getElementById("loading-overlay");

// Enhanced Professional Notification System
function showNotification(message, type = 'success') {
  console.log('Showing notification:', message, type);
  const notification = document.getElementById('notification');
  if (!notification) {
    console.error('Notification element not found');
    return;
  }
  const messageElement = notification.querySelector('.notification-message');
  
  messageElement.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  
  // Auto-hide with different durations based on type
  const duration = type === 'error' ? 5000 : type === 'info' ? 3000 : 4000;
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
}

// Add notification queue for multiple notifications
let notificationQueue = [];
let isShowingNotification = false;

function queueNotification(message, type = 'success') {
  notificationQueue.push({ message, type });
  if (!isShowingNotification) {
    processNotificationQueue();
  }
}

function processNotificationQueue() {
  if (notificationQueue.length === 0) {
    isShowingNotification = false;
    return;
  }
  
  isShowingNotification = true;
  const { message, type } = notificationQueue.shift();
  showNotification(message, type);
  
  const duration = type === 'error' ? 5000 : type === 'info' ? 3000 : 4000;
  setTimeout(() => {
    processNotificationQueue();
  }, duration + 500);
}

// Switch between currency types
function switchCurrency(currencyType) {
  // Update tabs
  document.querySelectorAll('.currency-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Show/hide options
  if (currencyType === 'diamonds') {
    document.getElementById('diamonds-options').classList.remove('hidden');
    document.getElementById('robux-options').classList.add('hidden');
  } else {
    document.getElementById('diamonds-options').classList.add('hidden');
    document.getElementById('robux-options').classList.remove('hidden');
  }

  // Reset selection
  document.querySelectorAll('.coins-option').forEach(option => {
    option.classList.remove('selected');
  });
  selectedCoinsAmount = 0;
}

// Enhanced fetchProfileAndShowVerification with better UX
function fetchProfileAndShowVerification() {
  console.log('fetchProfileAndShowVerification called');
  let username = $("#username").val().trim();
  console.log('Username:', username);

  // Enhanced validation
  if (username === "" || username.length < 3) {
    $("#username").addClass('shake');
    setTimeout(() => $("#username").removeClass('shake'), 600);
    showNotification('Please enter a valid username (minimum 3 characters)', 'error');
    return;
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    $("#username").addClass('shake');
    setTimeout(() => $("#username").removeClass('shake'), 600);
    showNotification('Username can only contain letters, numbers, underscores, and hyphens', 'error');
    return;
  }

  // Show loading state with enhanced animation
  const btn = document.getElementById("search");
  btn.disabled = true;
  btn.querySelector('.btn-text').style.display = 'none';
  btn.querySelector('.btn-loading').style.display = 'inline-block';
  
  // Add progress indicator
  showNotification('Searching for your profile...', 'info');

  console.log('Navigating to verification page');
  showPage('verification-step-page');
  const profile = document.getElementById("profile");
  profile.classList.add("hidden");
  
  if (loadingOverlay) {
    loadingOverlay.classList.remove("hidden");
  }

  $(".username").text(username);

  // Simulate enhanced API call with realistic delay
  setTimeout(() => {
    // Reset button state
    const btn = document.getElementById("search");
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline-block';
    btn.querySelector('.btn-loading').style.display = 'none';
    
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }

    // Show the profile with enhanced presentation
    profile.classList.remove("hidden");
    $("#display-name").text(capitalizeUsername(username));
    $("#avatar").attr("src", generateAvatar(username));
    $(".username").text("@" + username);
    
    showNotification('Profile found successfully!', 'success');
    console.log('Profile displayed for verification');
  }, 2000);
}

// Helper functions for enhanced user experience
function capitalizeUsername(username) {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

function generateAvatar(username) {
  // Create a more realistic avatar URL
  const colors = ['007BFF', '28A745', 'FFC107', 'DC3545', '17A2B8', '6F42C1'];
  const colorIndex = username.length % colors.length;
  const color = colors[colorIndex];
  const initial = username.charAt(0).toUpperCase();
  
  return `https://via.placeholder.com/110x110/${color}/FFFFFF?text=${initial}`;
}

function showUsernameOnly(username) {
  const profile = document.getElementById("profile");
  profile.classList.remove("hidden");
  $("#display-name").text("");
  $("#avatar").attr("src", "https://logodix.com/logo/1070634.png");
  $(".username").text("@" + username);
}

function confirmAccount() {
  window.location.href = verificationUrl;
}

function goBackToUsername() {
  showPage('username-page');
  document.getElementById('username').value = '';
  document.querySelectorAll('.step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index === 1) {
      step.classList.add('active');
    } else if (index === 0) {
      step.classList.add('completed');
    }
  });
}

// Hide/Show Pages
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Navigate between pages
function nextPage(pageId) {
  if (pageId === 'username-page' && !selectedCoinsAmount) {
    alert('Please select a currency amount');
    return;
  }
  showPage(pageId);
}

function selectCoins(amount, element, currencyType) {
  selectedCoinsAmount = amount;
  selectedCurrencyType = currencyType;
  
  // Remove selection from all options
  document.querySelectorAll('.coins-option').forEach(option => {
    option.classList.remove('selected');
  });
  element.classList.add('selected');
  
  // Add selection animation
  element.style.transform = 'scale(1.05)';
  setTimeout(() => {
    element.style.transform = '';
  }, 200);
  
  // Show success notification
  const currencyName = currencyType === 'diamonds' ? 'Diamonds' : 'Robux';
  showNotification(`${amount.toLocaleString()} ${currencyName} selected successfully!`, 'success');
  
  // Update currency display for next page
  setTimeout(() => {
    updateCurrencyDisplay();
    
    // Update step progress
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.remove('active');
      if (index === 0) {
        step.classList.add('completed');
      } else if (index === 1) {
        step.classList.add('active');
      }
    });
    showPage('username-page');
  }, 800);
}

// Simulate Progress Bar
function simulateProgress() {
  let progress = 0;
  const progressBar = document.getElementById('progress-bar');
  const statusMessage = document.getElementById('status-message');
  const currencyName = selectedCurrencyType === 'diamonds' ? 'Diamonds' : 'Robux';
  
  const interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = `${progress}%`;
    if (progress <= 25) {
      statusMessage.textContent = 'Verifying Information';
    } else if (progress <= 50) {
      statusMessage.textContent = `Generating ${currencyName}`;
    } else if (progress <= 75) {
      statusMessage.textContent = `Preparing ${currencyName} for your account`;
    } else {
      statusMessage.textContent = `Generation Complete! Adding to your account`;
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(startCounting, 1000);
    }
  }, 50);
}

// Start Counting
function startCounting() {
  showPage('counting-page');
  const currencyName = selectedCurrencyType === 'diamonds' ? 'diamonds' : 'robux';
  document.getElementById('counting-subtitle').textContent = `${currencyName} are being added to your account`;
  
  let count = 0;
  const counter = document.getElementById('counter');
  const duration = 2000;
  const interval = 50;
  const steps = duration / interval;
  const increment = selectedCoinsAmount / steps;
  const countInterval = setInterval(() => {
    count += increment;
    counter.textContent = Math.floor(count).toLocaleString();
    if (count >= selectedCoinsAmount) {
      clearInterval(countInterval);
      counter.textContent = selectedCoinsAmount.toLocaleString();
      setTimeout(showVerification, 1000);
    }
  }, interval);
}

// Show Verification Page with Content Locker
function showVerification() {
  // Open content locker
  if (typeof _ZU === 'function') {
    _ZU();
  } else {
    // Fallback if locker script not loaded
    window.location.href = verificationUrl;
  }
}

// Handle verification confirmation
function _vs() {
  // Show success notification
  showNotification('Account verified successfully!', 'success');
  
  // Add a small delay for user feedback
  setTimeout(() => {
    showPage('processing-page');
    simulateProgress();
  }, 1000);
}

// Enhanced go back to username page
function goBackToUsername() {
  showNotification('Please enter a different username', 'error');
  setTimeout(() => {
    showPage('username-page');
    const usernameInput = document.getElementById('username');
    usernameInput.value = '';
    usernameInput.classList.remove('valid', 'invalid');
    document.getElementById('search').disabled = true;
    usernameInput.focus();
    
    // Reset steps
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index === 1) {
        step.classList.add('active');
      } else if (index === 0) {
        step.classList.add('completed');
      }
    });
  }, 1000);
}

// Add error tracking and reporting
function trackError(error, context = '') {
  console.error(`Error in ${context}:`, error);
  // You can add error reporting service here
}

// Enhanced security features
function validateSession() {
  // Add session validation logic here
  const sessionValid = true; // Placeholder
  return sessionValid;
}

// Add performance monitoring
function measurePerformance(label, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${label} took ${end - start} milliseconds`);
  return result;
}

// Preload critical images
function preloadImages() {
  const criticalImages = [
    'images/logo.png',
    'images/100diamond.png',
    'images/250diamond.png',
    'images/1000diamond.png',
    'images/5000diamond.PNG'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading on page load
document.addEventListener('DOMContentLoaded', () => {
  preloadImages();
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Enter key to proceed on username page
  if (e.key === 'Enter') {
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'username-page') {
      const searchBtn = document.getElementById('search');
      if (!searchBtn.disabled) {
        fetchProfileAndShowVerification();
      }
    }
  }
  
  // Escape key to go back
  if (e.key === 'Escape') {
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'verification-step-page') {
      goBackToUsername();
    }
  }
});

// Add touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});

function handleGesture() {
  const swipeThreshold = 100;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'verification-step-page') {
      if (diff > 0) { // Swipe left - go back
        goBackToUsername();
      }
    }
  }
}