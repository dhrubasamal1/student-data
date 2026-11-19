const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Verify navigation tab buttons
const matches = [...html.matchAll(/class="tab-btn[^"]*"[^>]*>\s*([A-Za-z]+)\s*<\/button>/g)].map(m => m[1]);
console.log('Visible Tabs in navigation:', matches);

if (JSON.stringify(matches) !== JSON.stringify(['Schedule', 'Teachers', 'Parcels'])) {
  throw new Error('Visible tabs must be exactly Schedule, Teachers, Parcels! Got: ' + JSON.stringify(matches));
}

// 2. Verify individualDetailsContainer exists inside tabPanel-master
if (!html.includes('id="individualDetailsContainer"')) {
  throw new Error('individualDetailsContainer missing in index.html!');
}

// 3. Verify that individual registered courses feed and stats are inside tabPanel-master
const masterPanel = html.substring(html.indexOf('id="tabPanel-master"'), html.indexOf('id="tabPanel-teacher"'));
if (!masterPanel.includes('id="individualDetailsContainer"') || 
    !masterPanel.includes('id="individualStatsRow"') ||
    !masterPanel.includes('id="individualCourseCardsFeed"')) {
  throw new Error('individualDetailsContainer and its contents must be inside tabPanel-master!');
}

console.log('ALL MERGED MENU TESTS PASSED!');
