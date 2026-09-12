# UX Enhancements Implementation Guide
**For Developers integrating the new UI/UX features**

---

## 🚀 Quick Start

The UX enhancements are CSS-based and require minimal JavaScript integration. Simply add data attributes to your HTML elements to activate the enhanced styles.

---

## 📦 What's Included

- ✅ **Accessibility improvements** (WCAG AA compliance, keyboard navigation, screen readers)
- ✅ **Enhanced visual feedback** (loading states, validation, progress indicators)
- ✅ **Proof runner enhancements** (timer urgency, requirements checklist, confidence meter)
- ✅ **Verified skills prominence** (badges, premium cards, share buttons)
- ✅ **Marketplace improvements** (qualification meters, sponsored badges, status timeline)

---

## 🎨 Using the Enhancements

### 1. Timer with Urgency States

**HTML:**
```html
<div class="challenge-timer" data-urgency="normal">10:00</div>
```

**JavaScript:**
```javascript
function updateTimer(seconds) {
  const timerEl = document.querySelector('.challenge-timer');
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerEl.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
  
  // Update urgency
  if (seconds <= 60) {
    timerEl.dataset.urgency = 'critical';  // Red with pulse
  } else if (seconds <= 180) {
    timerEl.dataset.urgency = 'warning';   // Orange
  } else {
    timerEl.dataset.urgency = 'normal';    // Default
  }
}
```

---

### 2. Requirements Checklist with Real-time Validation

**HTML:**
```html
<ul class="requirements-list">
  <li data-met="false" data-touched="false">Minimum 50 words</li>
  <li data-met="false" data-touched="false">No paste detected</li>
  <li data-met="true" data-touched="true">Hand-typed telemetry</li>
</ul>
```

**JavaScript:**
```javascript
function updateRequirement(index, isMet, isTouched = true) {
  const items = document.querySelectorAll('.requirements-list li');
  if (items[index]) {
    items[index].dataset.met = isMet.toString();
    items[index].dataset.touched = isTouched.toString();
  }
}

// Example: Check word count
const wordCount = submission.split(/\s+/).length;
updateRequirement(0, wordCount >= 50);
```

---

### 3. Confidence Meter

**HTML:**
```html
<div class="confidence-meter" data-level="medium">
  <div>Submission Confidence</div>
  <div class="confidence-meter-bar">
    <div class="confidence-meter-fill" style="width: 65%"></div>
  </div>
</div>
```

**JavaScript:**
```javascript
function updateConfidence(score) {
  // score: 0-100
  const meter = document.querySelector('.confidence-meter');
  const fill = document.querySelector('.confidence-meter-fill');
  
  fill.style.width = `${score}%`;
  
  if (score >= 80) {
    meter.dataset.level = 'high';  // Green styling
  } else if (score >= 50) {
    meter.dataset.level = 'medium';
  } else {
    meter.dataset.level = 'low';
  }
}
```

---

### 4. Button Loading States

**HTML:**
```html
<button class="btn btn-primary" id="submitBtn">
  Submit Proof
</button>
```

**JavaScript:**
```javascript
// Show loading
const btn = document.getElementById('submitBtn');
const originalHTML = btn.innerHTML;
btn.classList.add('btn-loading');
btn.disabled = true;
btn.setAttribute('aria-busy', 'true');

// After async operation
try {
  const result = await submitProof();
  btn.classList.remove('btn-loading');
  btn.disabled = false;
  btn.removeAttribute('aria-busy');
  btn.innerHTML = originalHTML;
} catch (err) {
  btn.classList.remove('btn-loading');
  btn.disabled = false;
  btn.removeAttribute('aria-busy');
  btn.innerHTML = originalHTML;
}
```

---

### 5. Verified Badge

**HTML:**
```html
<div class="verified-badge">VERIFIED</div>
```

Automatically styled with checkmark, green background, and shadow.

---

### 6. Verified Skill Card

**HTML:**
```html
<div class="card skill-verified">
  <div class="verified-badge">VERIFIED</div>
  <h3>JavaScript Fundamentals</h3>
  <div class="skill-verified-score">94</div>
  <button class="btn share-proof-btn">Share</button>
</div>
```

---

### 7. Form Validation with Inline Feedback

**HTML:**
```html
<div class="input-wrapper">
  <input 
    type="text" 
    id="goalInput"
    maxlength="100"
    aria-invalid="false"
    aria-describedby="goalError"
  />
  <span class="char-count">0/100</span>
  <span class="input-error" id="goalError" style="display:none"></span>
</div>
```

**JavaScript:**
```javascript
const input = document.getElementById('goalInput');
const charCount = document.querySelector('.char-count');
const errorMsg = document.getElementById('goalError');

input.addEventListener('input', (e) => {
  const length = e.target.value.length;
  const max = 100;
  
  // Update character count
  charCount.textContent = `${length}/${max}`;
  charCount.dataset.exceeded = (length > max).toString();
  
  // Validation
  if (length > max) {
    input.setAttribute('aria-invalid', 'true');
    errorMsg.textContent = 'Goal is too long';
    errorMsg.style.display = 'block';
  } else if (length < 10) {
    input.setAttribute('aria-invalid', 'true');
    errorMsg.textContent = 'Goal must be at least 10 characters';
    errorMsg.style.display = 'block';
  } else {
    input.setAttribute('aria-invalid', 'false');
    errorMsg.style.display = 'none';
  }
});
```

---

### 8. Qualification Meter

**HTML:**
```html
<div class="qualification-meter">
  <div class="qualification-meter-fill" 
       style="width: 75%" 
       data-qualified="false">
  </div>
</div>
<div class="qualification-label">
  <span>Your Score: 75</span>
  <span>Required: 80</span>
</div>
```

**JavaScript:**
```javascript
function updateQualification(userScore, requiredScore) {
  const fill = document.querySelector('.qualification-meter-fill');
  const percentage = (userScore / requiredScore) * 100;
  fill.style.width = `${Math.min(percentage, 100)}%`;
  fill.dataset.qualified = (userScore >= requiredScore).toString();
}
```

---

### 9. Sponsored Challenge Badge

**HTML:**
```html
<div class="card task-sponsored">
  <!-- Badge appears automatically via CSS ::before -->
  <h3>Build a Nimiq Wallet Interface</h3>
  <p>Premium task with 50 NIM reward</p>
</div>
```

---

### 10. Application Status Timeline

**HTML:**
```html
<div class="application-status">
  <div class="status-step" data-complete="true" data-label="Submitted"></div>
  <div class="status-step" data-active="true" data-label="Reviewing"></div>
  <div class="status-step" data-label="Accepted"></div>
  <div class="status-step" data-label="Delivered"></div>
</div>
```

**JavaScript:**
```javascript
function updateApplicationStatus(currentStage) {
  const steps = document.querySelectorAll('.status-step');
  const stages = ['submitted', 'reviewing', 'accepted', 'delivered'];
  const currentIndex = stages.indexOf(currentStage);
  
  steps.forEach((step, index) => {
    if (index < currentIndex) {
      step.dataset.complete = 'true';
      step.dataset.active = 'false';
    } else if (index === currentIndex) {
      step.dataset.complete = 'false';
      step.dataset.active = 'true';
    } else {
      step.dataset.complete = 'false';
      step.dataset.active = 'false';
    }
  });
}
```

---

### 11. Tab Navigation with ARIA

**HTML:**
```html
<div role="tablist" aria-label="Work sections">
  <button role="tab" aria-selected="true" aria-controls="tasks-panel">
    Tasks
  </button>
  <button role="tab" aria-selected="false" aria-controls="teaching-panel">
    Teaching
  </button>
  <button role="tab" aria-selected="false" aria-controls="sponsored-panel">
    Sponsored
  </button>
</div>

<div id="tasks-panel" role="tabpanel" aria-labelledby="tasks-tab">
  <!-- Content -->
</div>
```

**JavaScript:**
```javascript
document.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', (e) => {
    // Remove selected from all
    document.querySelectorAll('[role="tab"]').forEach(t => {
      t.setAttribute('aria-selected', 'false');
    });
    
    // Set selected on clicked
    e.target.setAttribute('aria-selected', 'true');
    
    // Show corresponding panel
    const panelId = e.target.getAttribute('aria-controls');
    // ... panel switching logic
  });
});
```

---

### 12. Scroll Indicators

**HTML:**
```html
<div class="scroll-container" data-at-start="true" data-at-end="false">
  <div class="scroll-indicator scroll-indicator-left"></div>
  <div class="scrollable-content">
    <!-- Horizontal scrolling chips/cards -->
  </div>
  <div class="scroll-indicator scroll-indicator-right"></div>
</div>
```

**JavaScript:**
```javascript
const container = document.querySelector('.scroll-container');
const scrollable = container.querySelector('.scrollable-content');

scrollable.addEventListener('scroll', () => {
  const atStart = scrollable.scrollLeft === 0;
  const atEnd = scrollable.scrollLeft + scrollable.clientWidth >= scrollable.scrollWidth - 1;
  
  container.dataset.atStart = atStart.toString();
  container.dataset.atEnd = atEnd.toString();
});

// Initial check
scrollable.dispatchEvent(new Event('scroll'));
```

---

### 13. Stepper Progress

**HTML:**
```html
<div class="stepper-progress">
  <div class="stepper-progress-fill" style="width: 33%"></div>
</div>
```

**JavaScript:**
```javascript
function updateProgress(currentStep, totalSteps) {
  const fill = document.querySelector('.stepper-progress-fill');
  const percentage = (currentStep / totalSteps) * 100;
  fill.style.width = `${percentage}%`;
}
```

---

## ♿ Accessibility Checklist

When implementing features, ensure:

- [ ] All interactive elements have proper `aria-label` or visible text
- [ ] Form inputs have associated `<label>` or `aria-labelledby`
- [ ] Error messages are linked with `aria-describedby`
- [ ] Loading states set `aria-busy="true"`
- [ ] Invalid inputs set `aria-invalid="true"`
- [ ] Tab navigation uses `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] Modals use `role="dialog"` and `aria-modal="true"`
- [ ] Dynamic content changes are announced (use `aria-live` if needed)

---

## 🎨 Utility Classes Available

### Spacing (use these instead of hardcoded values)
```css
.space-xs   /* 4px */
.space-sm   /* 8px */
.space-md   /* 12px */
.space-lg   /* 16px */
.space-xl   /* 24px */
.space-2xl  /* 32px */
.space-3xl  /* 48px */
.space-4xl  /* 64px */
```

### Screen Reader Only
```html
<span class="sr-only">This text is hidden but read by screen readers</span>
```

### Card Variants
```html
<div class="card">Standard card</div>
<div class="card card-nested">Nested card (less visual weight)</div>
<div class="card skill-verified">Verified skill (green tint)</div>
<div class="card task-sponsored">Sponsored task (orange tint)</div>
```

---

## 🧪 Testing Your Implementation

### Manual Tests

1. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Verify focus states are visible
   - Test Escape to close modals
   - Test Enter to submit forms

2. **Screen Reader:**
   - Test with NVDA (Windows) or VoiceOver (Mac)
   - Verify all content is announced
   - Check form labels and error messages
   - Verify button states are announced

3. **Color Contrast:**
   - Use browser dev tools contrast checker
   - Ensure all text meets WCAG AA (4.5:1 for small, 3:1 for large)

4. **Responsive:**
   - Test at 320px, 375px, 768px, 1024px, 1440px
   - Verify no horizontal scroll
   - Check touch target sizes (min 44x44px)

---

## 📚 Reference

- **Full CSS:** `web/ux-enhancements.css`
- **Applied Changes:** `UX-ENHANCEMENTS-APPLIED.md`
- **Design System:** `web/styles.css` (tokens and base styles)
- **Competition Polish:** `web/competition-polish.css`

---

## 💡 Tips

1. **Data attributes over classes:** Use `data-*` attributes for state (e.g., `data-urgency`, `data-met`) so styles can change automatically

2. **Preserve original HTML:** When showing loading states, save the original button HTML to restore it after

3. **Smooth transitions:** Most enhancements include CSS transitions - trigger changes via data attributes for smooth animations

4. **Progressive enhancement:** All enhancements degrade gracefully if JavaScript fails

5. **Test early, test often:** Run through the accessibility checklist as you build, not after

---

## 🆘 Common Issues

**Issue:** Loading spinner not appearing  
**Solution:** Ensure button has `.btn-loading` class AND is `disabled`

**Issue:** Requirements checklist not updating colors  
**Solution:** Set both `data-met` and `data-touched` attributes

**Issue:** Timer not changing color  
**Solution:** Verify `data-urgency` attribute is set to exactly "normal", "warning", or "critical"

**Issue:** Skip link not working  
**Solution:** Ensure main content has `id="main-content"` (already added to router)

**Issue:** Qualification meter not showing indicator  
**Solution:** Check that `.qualification-meter-fill` has `width` style and `data-qualified` attribute

---

## 🎯 Next Steps

1. Integrate data attributes into existing view components
2. Test with actual user interactions
3. Run accessibility audit
4. Gather user feedback
5. Iterate and improve

**Questions?** Refer to the full documentation in `UX-ENHANCEMENTS-APPLIED.md`
