document.addEventListener('DOMContentLoaded', function() {
    console.log("forms.js: DOMContentLoaded fired.");

    // --- Brochure Form Handling ---
    const brochureForm = document.getElementById('brochureForm');
    
    if (brochureForm) {
        console.log("forms.js: Brochure form found. Attaching submit listener.");
        brochureForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("forms.js: Brochure form submitted.");

            // Get form data
            const name = document.getElementById('brochureName').value;
            const email = document.getElementById('brochureEmail').value;
            const phone = document.getElementById('brochurePhone').value || '';

            // Show loading state
            const submitButton = brochureForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Processing...';
            submitButton.disabled = true;

            // Direct HubSpot API submission
            const portalId = "242639779"; // Your HubSpot portal ID
            const formId = "bb460223-e3af-4172-9c0e-2671eb85b832"; // Replace with your actual HubSpot form ID

            const data = {
                fields: [
                    {
                        name: "firstname",
                        value: name
                    },
                    {
                        name: "email",
                        value: email
                    },
                    {
                        name: "phone",
                        value: phone
                    },
                    {
                        name: "source",
                        value: "Website Brochure Download"
                    }
                ],
                context: {
                    pageUri: window.location.href,
                    pageName: document.title
                }
            };

            fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("forms.js: HubSpot submission successful:", data);
                
                // Open brochure in new tab
                window.open('brochures/srew-company-profile.pdf', '_blank');
                
                // Hide the modal
                const modalElement = document.getElementById('brochureModal');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    } else {
                        const bsModal = new bootstrap.Modal(modalElement);
                        bsModal.hide();
                    }
                }
                
                // Show success message
                setTimeout(function() {
                    alert('Thank you! Your brochure should have opened in a new tab. If not, please check your popup blocker.');
                }, 300);
                
                // Reset form
                brochureForm.reset();
            })
            .catch(error => {
                console.error("forms.js: Error submitting to HubSpot:", error);
                alert('There was an error processing your request. Please try again later.');
            })
            .finally(() => {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');
    
    if (contactForm && formMessages) {
        console.log("forms.js: Contact form found. Attaching submit listener.");
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("forms.js: Contact form submitted.");

            // Get form data
            const name = contactForm.querySelector('[name="name"]')?.value || '';
            const email = contactForm.querySelector('[name="email"]')?.value || '';
            const subject = contactForm.querySelector('[name="subject"]')?.value || '';
            const message = contactForm.querySelector('[name="message"]')?.value || '';
            const phone = contactForm.querySelector('[name="phone"]')?.value || '';

            // Basic validation
            if (!name || !email || !subject || !message) {
                formMessages.innerHTML = '<div class="alert alert-danger" role="alert">Please fill out all required fields.</div>';
                return;
            }

            // Show loading state
            formMessages.innerHTML = '<div class="alert alert-info" role="alert">Sending your message...</div>';
            
            // Direct HubSpot API submission
            const portalId = "242639779"; // Your HubSpot portal ID
            const formId = "bb460223-e3af-4172-9c0e-2671eb85b832"; // Replace with your actual HubSpot form ID for contact form

            const data = {
                fields: [
                    {
                        name: "firstname",
                        value: name
                    },
                    {
                        name: "email",
                        value: email
                    },
                    {
                        name: "phone",
                        value: phone
                    },
                    {
                        name: "subject",
                        value: subject
                    },
                    {
                        name: "message",
                        value: message
                    },
                    {
                        name: "source",
                        value: "Website Contact Form"
                    }
                ],
                context: {
                    pageUri: window.location.href,
                    pageName: document.title
                }
            };

            fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("forms.js: HubSpot submission successful:", data);
                formMessages.innerHTML = '<div class="alert alert-success" role="alert">Thank you! Your message has been submitted. We will get back to you soon.</div>';
                contactForm.reset();
            })
            .catch(error => {
                console.error("forms.js: Error submitting to HubSpot:", error);
                formMessages.innerHTML = '<div class="alert alert-danger" role="alert">There was an error sending your message. Please try again later.</div>';
            });
        });
    }

    // Pre-fill subject line if query parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const inquirySubjectParam = urlParams.get('inquiry') || urlParams.get('product') || urlParams.get('project_inquiry') || urlParams.get('industry');
    const contactSubjectField = document.getElementById('contactSubject');

    if (inquirySubjectParam && contactSubjectField) {
        contactSubjectField.value = "Inquiry about " + decodeURIComponent(inquirySubjectParam);
        console.log("forms.js: Contact form subject pre-filled from URL param:", contactSubjectField.value);
    }
});