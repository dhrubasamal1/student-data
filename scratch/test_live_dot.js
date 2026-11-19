const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Verify that animate-ping and bg-emerald-500 are present in the slot card time block
if (!html.includes('animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400') ||
    !html.includes('relative inline-flex rounded-full h-2 w-2 bg-emerald-500')) {
  throw new Error('Blinking green dot markup missing in index.html!');
}

// 2. Verify that it is rendered conditionally when isCurrentSlotLive is true
const cardHeaderSection = html.substring(html.indexOf('<!-- Card Header: Slot Name + Time + Status Badge -->'), html.indexOf('<!-- Card Body: Busy Classes & Direct Free Students Display -->'));
if (!cardHeaderSection.includes('isCurrentSlotLive ?')) {
  throw new Error('Blinking green dot must be conditionally rendered based on isCurrentSlotLive!');
}

if (!cardHeaderSection.includes('${col.start} – ${col.end}')) {
  throw new Error('Time string must be present in card header!');
}

console.log('LIVE CLASS BLINKING GREEN DOT VERIFIED SUCCESSFULLY!');
