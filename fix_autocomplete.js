const fs = require('fs');
const path = 'apps/web/modules/dashboard/components/tracker/components/TrackerOverlay.tsx';
let content = fs.readFileSync(path, 'utf-8');

const fieldsToTurnOff = [
  'id="goal-name"',
  'id="goal-time"',
  'id="timer-limit"',
  'id="cost-per-use"',
  'id="new-condition-title"',
  'id="edit-log-title"',
  'id="temp-stage-name"',
  'id="goal-desc"',
  'id="edit-log-desc"'
];

fieldsToTurnOff.forEach(field => {
  content = content.replace(new RegExp(field, 'g'), field + ' autoComplete="off"');
});

fs.writeFileSync(path, content, 'utf-8');
console.log('Added autoComplete=off to TrackerOverlay fields.');
