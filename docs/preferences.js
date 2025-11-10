// Preferences Wizard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('preferencesForm');
    const steps = document.querySelectorAll('.wizard-step');
    const stepIndicators = document.querySelectorAll('.step');
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Load saved data if exists
    loadSavedData();

    // Navigation functions
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));

        // Show current step
        document.querySelector(`.wizard-step[data-step="${stepNumber}"]`).classList.add('active');
        document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');

        // Update progress bar
        const progress = ((stepNumber - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progress}%`;

        // Update buttons
        prevBtn.disabled = stepNumber === 1;
        nextBtn.style.display = stepNumber === totalSteps ? 'none' : 'inline-block';
        submitBtn.style.display = stepNumber === totalSteps ? 'inline-block' : 'none';

        currentStep = stepNumber;
    }

    function validateCurrentStep() {
        const currentStepElement = document.querySelector('.wizard-step.active');
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // Check radio buttons
        const radioGroups = currentStepElement.querySelectorAll('input[type="radio"][required]');
        const radioNames = new Set();
        radioGroups.forEach(radio => radioNames.add(radio.name));

        radioNames.forEach(name => {
            const radioGroup = currentStepElement.querySelectorAll(`input[name="${name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                radioGroup.forEach(radio => radio.closest('.radio-option').classList.add('error'));
                isValid = false;
            } else {
                radioGroup.forEach(radio => radio.closest('.radio-option').classList.remove('error'));
            }
        });

        return isValid;
    }

    function saveCurrentStepData() {
        const currentStepElement = document.querySelector('.wizard-step.active');
        const formData = new FormData(form);

        // Save to localStorage
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Handle checkboxes that aren't checked
        const checkboxes = currentStepElement.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!data[checkbox.name]) {
                data[checkbox.name] = [];
            }
        });

        localStorage.setItem('savvEatPreferences', JSON.stringify(data));
    }

    function loadSavedData() {
        const savedData = localStorage.getItem('savvEatPreferences');
        if (savedData) {
            const data = JSON.parse(savedData);

            // Populate form fields
            Object.keys(data).forEach(key => {
                const value = data[key];
                const fields = form.querySelectorAll(`[name="${key}"]`);

                if (Array.isArray(value)) {
                    // Handle checkboxes
                    fields.forEach(field => {
                        if (value.includes(field.value)) {
                            field.checked = true;
                        }
                    });
                } else {
                    // Handle other inputs
                    fields.forEach(field => {
                        if (field.type === 'radio' || field.type === 'checkbox') {
                            if (field.value === value) {
                                field.checked = true;
                            }
                        } else {
                            field.value = value;
                        }
                    });
                }
            });
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', function() {
        if (validateCurrentStep()) {
            saveCurrentStepData();
            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
            }
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCurrentStep()) {
            saveCurrentStepData();

            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Real-time validation
    form.addEventListener('input', function(e) {
        const field = e.target;
        if (field.hasAttribute('required') && field.value.trim()) {
            field.classList.remove('error');
        }
    });

    form.addEventListener('change', function(e) {
        const field = e.target;
        if (field.type === 'radio' && field.hasAttribute('required')) {
            const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
            radioGroup.forEach(radio => radio.closest('.radio-option').classList.remove('error'));
        }
    });

    // Initialize
    showStep(1);
});

// GenMenu button functionality
document.addEventListener('DOMContentLoaded', function() {
    const genMenuBtn = document.getElementById('GenMenu');
    if (genMenuBtn) {
        genMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Show loading overlay
            showLoadingOverlay();

            // Navigate to plans page after 3 seconds
            setTimeout(function() {
                window.location.href = 'plans.html';
            }, 3000);
        });
    }
});

function showLoadingOverlay() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Generating Recipes</p>
        </div>
    `;
    document.body.appendChild(overlay);

    // Show overlay
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}