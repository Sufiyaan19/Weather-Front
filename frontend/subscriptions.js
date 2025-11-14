// subscriptions.js - Weather alert subscription functionality

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('subscription-form').addEventListener('submit', handleSubscription);
    loadSubscriptions();
});

function handleSubscription(e) {
    e.preventDefault();

    const city = document.getElementById('sub-city').value.trim();
    const email = document.getElementById('sub-email').value.trim();
    const alertTypes = Array.from(document.querySelectorAll('input[name]:checked')).map(cb => cb.value);
    const frequency = document.getElementById('frequency').value;
    const smsEnabled = document.getElementById('sms-alerts').checked;

    if (!city || !email || alertTypes.length === 0) {
        alert('Please fill in all required fields and select at least one alert type.');
        return;
    }

    const subscription = {
        id: Date.now(),
        city: city,
        email: email,
        alertTypes: alertTypes,
        frequency: frequency,
        smsEnabled: smsEnabled,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage (in real app, this would be sent to server)
    const subscriptions = JSON.parse(localStorage.getItem('weatherSubscriptions') || '[]');
    subscriptions.push(subscription);
    localStorage.setItem('weatherSubscriptions', JSON.stringify(subscriptions));

    // Reset form
    document.getElementById('subscription-form').reset();

    // Reload subscriptions list
    loadSubscriptions();

    alert('Subscription created successfully! You will receive alerts based on your preferences.');
}

function loadSubscriptions() {
    const subscriptions = JSON.parse(localStorage.getItem('weatherSubscriptions') || '[]');
    const container = document.getElementById('subscriptions-list');

    if (subscriptions.length === 0) {
        container.innerHTML = '<p>No active subscriptions. Create one above!</p>';
        return;
    }

    container.innerHTML = '<div class="row">';

    subscriptions.forEach(sub => {
        const alertTypesText = sub.alertTypes.join(', ');
        const frequencyText = sub.frequency === 'immediate' ? 'Immediate' :
                             sub.frequency === 'daily' ? 'Daily Summary' : 'Weekly Summary';

        container.innerHTML += `
            <div class="col-md-6 mb-3">
                <div class="card bg-dark text-white border-secondary">
                    <div class="card-body">
                        <h6 class="card-title">${sub.city}</h6>
                        <p class="card-text mb-1"><strong>Email:</strong> ${sub.email}</p>
                        <p class="card-text mb-1"><strong>Alerts:</strong> ${alertTypesText}</p>
                        <p class="card-text mb-1"><strong>Frequency:</strong> ${frequencyText}</p>
                        <p class="card-text mb-1"><strong>SMS:</strong> ${sub.smsEnabled ? 'Enabled' : 'Disabled'}</p>
                        <button class="btn btn-danger btn-sm" onclick="deleteSubscription(${sub.id})">
                            <i class="bi bi-trash"></i> Unsubscribe
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML += '</div>';
}

function deleteSubscription(id) {
    const subscriptions = JSON.parse(localStorage.getItem('weatherSubscriptions') || '[]');
    const filtered = subscriptions.filter(sub => sub.id !== id);
    localStorage.setItem('weatherSubscriptions', JSON.stringify(filtered));
    loadSubscriptions();
    alert('Subscription cancelled successfully.');
}

// Mock alert system - in real app, this would be handled by a backend service
function checkForAlerts() {
    const subscriptions = JSON.parse(localStorage.getItem('weatherSubscriptions') || '[]');

    subscriptions.forEach(sub => {
        // Mock alert checking - in real app, this would query weather APIs for severe conditions
        const mockAlerts = [
            { type: 'heat-wave', message: `Heat wave alert for ${sub.city}: Temperatures expected to exceed 35°C` },
            { type: 'heavy-rain', message: `Heavy rain warning for ${sub.city}: Expect 50-100mm rainfall` },
            { type: 'severe-storms', message: `Storm alert for ${sub.city}: Severe thunderstorm expected` }
        ];

        sub.alertTypes.forEach(alertType => {
            const relevantAlert = mockAlerts.find(alert => alert.type === alertType);
            if (relevantAlert && Math.random() < 0.1) { // 10% chance for demo
                sendAlert(sub, relevantAlert.message);
            }
        });
    });
}

// Mock alert sending - in real app, this would send emails/SMS
function sendAlert(subscription, message) {
    console.log(`Sending alert to ${subscription.email}: ${message}`);
    // In real app: send to backend API for email/SMS sending

    // Add to alert history
    const history = JSON.parse(localStorage.getItem('alertHistory') || '[]');
    history.unshift({
        message: message,
        timestamp: new Date().toISOString(),
        subscriptionId: subscription.id
    });
    // Keep only last 10 alerts
    if (history.length > 10) history.pop();
    localStorage.setItem('alertHistory', JSON.stringify(history));

    updateAlertHistory();
}

function updateAlertHistory() {
    const history = JSON.parse(localStorage.getItem('alertHistory') || '[]');
    const container = document.getElementById('alert-history');

    if (history.length === 0) {
        container.innerHTML = '<p>No recent alerts.</p>';
        return;
    }

    container.innerHTML = '';
    history.forEach(alert => {
        const timeAgo = getTimeAgo(new Date(alert.timestamp));
        const alertClass = alert.message.includes('Heat') ? 'alert-warning' :
                          alert.message.includes('rain') ? 'alert-info' : 'alert-danger';

        container.innerHTML += `
            <div class="alert ${alertClass}">
                <strong>${alert.message.split(':')[0]}:</strong> ${alert.message.split(':')[1]}
                <br><small class="text-muted">Sent ${timeAgo}</small>
            </div>
        `;
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
}

// Check for alerts every 30 seconds (for demo purposes)
setInterval(checkForAlerts, 30000);

// Load alert history on page load
updateAlertHistory();
