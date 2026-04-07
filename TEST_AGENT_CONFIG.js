// Quick test to validate Agent Config Tab functionality

// Test 1: GET /api/agent/config
fetch('http://localhost:3001/api/agent/config')
  .then(r => r.json())
  .then(data => {
    console.log('✅ GET config:', data);
  });

// Test 2: PUT /api/agent/config (update learning mode)
fetch('http://localhost:3001/api/agent/config', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    learningMode: 'aggressive',
    autoProcessing: { enabled: true, intervalSeconds: 300 },
    notificationsEnabled: true,
    rules: []  // Will be filled with existing rules
  })
})
  .then(r => r.json())
  .then(data => {
    console.log('✅ PUT config:', data);
  });

// Test 3: GET metrics
fetch('http://localhost:3001/api/agent/metrics')
  .then(r => r.json())
  .then(data => {
    console.log('✅ GET metrics:', data);
  });

// Test 4: GET notifications/stats
fetch('http://localhost:3001/api/notifications/stats')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Notifications stats:', data);
  });

console.log('🧪 Tests initiated - check console for results');
