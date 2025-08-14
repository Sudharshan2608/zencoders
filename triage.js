async function submitSymptoms() {
    // --- Get all form inputs ---
    const age = document.getElementById('age').value;
    const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
    const symptomDuration = document.getElementById('symptomDuration').value;
    const severity = document.getElementById('severity').value;
    const exposure = document.getElementById('exposure').value;
    const conditionCheckboxes = document.querySelectorAll('input[name="conditions"]:checked');
    const medications = document.getElementById('medications').value.trim();
    const temperature = document.getElementById('temperature').value;
    const oxygen = document.getElementById('oxygen').value;
    const heartRate = document.getElementById('heartRate').value;
    const resultBox = document.getElementById('result');

    // --- Basic validation ---
    if (!age || symptomCheckboxes.length === 0 || !symptomDuration || !severity || !exposure) {
        alert('Please fill in your age, select at least one symptom, symptom duration, severity, and exposure status.');
        return;
    }

    // --- Prepare payload for the API ---
    const symptoms = Array.from(symptomCheckboxes).map(cb => cb.value);
    const conditions = Array.from(conditionCheckboxes).map(cb => cb.value);

    // If "none" is selected with others, only send "none"
    if (conditions.includes('none') && conditions.length > 1) {
        conditions.splice(0, conditions.length, 'none');
    }

    const payload = {
        age: parseInt(age),
        symptoms: symptoms,
        symptom_duration_days: parseInt(symptomDuration),
        severity: severity,
        recent_exposure: exposure,
        pre_existing_conditions: conditions,
        medications: medications,
        // Send null if optional fields are empty
        temperature: temperature ? parseFloat(temperature) : null,
        oxygen_saturation: oxygen ? parseInt(oxygen) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
    };

    // --- Show loading state (optional but good UI) ---
    resultBox.style.display = 'block';
    resultBox.style.color = '#555';
    resultBox.innerHTML = 'Analyzing...';
    
    // --- Make the API call ---
    try {
        const response = await fetch('http://127.0.0.1:8000/triage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Handle server-side errors
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Server error');
        }
        
        const data = await response.json();

        // --- Display the result ---
        resultBox.style.color = '#003974'; // Reset color
        resultBox.innerHTML = `<strong>Urgency:</strong> ${data.urgency}<br>
                               <strong>Reason:</strong> ${data.reason}<br><br>
                               <em>${data.disclaimer}</em>`;

    } catch (error) {
        // --- Display any error ---
        resultBox.style.color = '#d9534f'; // Error color
        resultBox.innerHTML = `<strong>Error:</strong> Could not get a response. Please ensure the server is running and try again. <br><small>(${error.message})</small>`;
    }
}