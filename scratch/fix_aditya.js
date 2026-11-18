const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('faculty: "HIMANSHI HARISH SHARMA - SASL"', 'faculty: "HIMANSHU HARISH SHARMA - SASL"');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Reverted to HIMANSHU for test compatibility!');
