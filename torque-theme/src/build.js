// Renders the Torque Pro theme images from SVG and zips them.
// Run: node build.js  (needs playwright + chromium)
// Writes one folder per theme next to src/, and ready-to-import zips in ../dist
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');

const THEMES = path.join(__dirname, '..');
const DIST = path.join(__dirname, '..', 'dist');

// Geometry shared with the web dashboard: angles measured from 12 o'clock.
const pt = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [240 + r * Math.cos(a), 240 + r * Math.sin(a)]; };
const arc = (r, d0, d1) => {
  const [x0, y0] = pt(r, d0), [x1, y1] = pt(r, d1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

const DEFS = `
<defs>
  <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f6f8fa"/><stop offset=".22" stop-color="#8f969e"/>
    <stop offset=".48" stop-color="#eef1f4"/><stop offset=".72" stop-color="#4f565e"/>
    <stop offset="1" stop-color="#cfd4da"/>
  </linearGradient>
  <linearGradient id="chromeIn" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#5c636b"/><stop offset="1" stop-color="#d7dce1"/>
  </linearGradient>
  <radialGradient id="face" cx=".5" cy=".4" r=".62">
    <stop offset="0" stop-color="#1c2025"/><stop offset=".7" stop-color="#0b0d10"/><stop offset="1" stop-color="#020203"/>
  </radialGradient>
  <radialGradient id="silver" cx=".46" cy=".38" r=".7">
    <stop offset="0" stop-color="#f7f8f6"/><stop offset=".55" stop-color="#e3e5e2"/>
    <stop offset=".9" stop-color="#c8cbc9"/><stop offset="1" stop-color="#aeb2b1"/>
  </radialGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="cap" cx=".35" cy=".3" r=".85">
    <stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#a3a9b0"/><stop offset="1" stop-color="#2e343a"/>
  </radialGradient>
</defs>`;

// Chrome bezel + dark face, as on the factory cluster. Torque draws ticks, numbers and needle on top.
function dial(extra = '', silver = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${DEFS}
    <circle cx="240" cy="240" r="238" fill="url(#chrome)"/>
    <circle cx="240" cy="240" r="226" fill="url(#chromeIn)"/>
    <circle cx="240" cy="240" r="221" fill="#020203"/>
    <circle cx="240" cy="240" r="218" fill="url(#${silver ? 'silver' : 'face'})"/>
    <circle cx="240" cy="240" r="207" fill="none" stroke="${silver ? '#9a9ea0' : '#252a30'}" stroke-width="2"/>
    ${extra}
    <path d="M240 22a218 218 0 0 1 218 218H22A218 218 0 0 1 240 22z" fill="url(#glass)"/>
  </svg>`;
}
const redArc = (from, to, r = 200, w = 14) =>
  `<path d="${arc(r, from, to)}" fill="none" stroke="#d81e17" stroke-width="${w}" stroke-linecap="butt"/>`;
const icon = (d, y, fill = '#7d8792') => `<g transform="translate(216 ${y}) scale(2)" fill="${fill}">${d}</g>`;
const ICON_FUEL = '<path d="M2 2h9v19H2zm2 2v5h5V4zm8 3 1-1 3.5 3.5V18a1 1 0 0 0 2 0v-6.5L17 10V7h1.5l1.5 1.5V18a3 3 0 0 1-6 0V12h-1z"/>';
const ICON_TEMP = '<path d="M10 1h3v12.5a4.2 4.2 0 1 1-3 0zm5 2h5v1.6h-5zm0 3.5h5v1.6h-5zm0 3.5h5v1.6h-5z"/>';

// Square display (digital readouts): chrome frame + EVIC-style dark blue glass.
function display() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${DEFS}
    <linearGradient id="evic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03070a"/><stop offset="1" stop-color="#071422"/></linearGradient>
    <rect x="4" y="4" width="472" height="472" rx="34" fill="url(#chrome)"/>
    <rect x="16" y="16" width="448" height="448" rx="26" fill="url(#chromeIn)"/>
    <rect x="22" y="22" width="436" height="436" rx="22" fill="#020203"/>
    <rect x="26" y="26" width="428" height="428" rx="20" fill="url(#evic)"/>
    <rect x="26" y="26" width="428" height="200" rx="20" fill="url(#glass)"/>
  </svg>`;
}

// Main screen background: dark dash hood with soft centre light, sized for a 20:9 phone in landscape.
function background() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1080" viewBox="0 0 2400 1080">
    <defs>
      <radialGradient id="bg" cx=".5" cy=".42" r=".75">
        <stop offset="0" stop-color="#16191d"/><stop offset=".6" stop-color="#07080a"/><stop offset="1" stop-color="#000"/>
      </radialGradient>
      <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="none"/><circle cx="1" cy="1" r=".7" fill="#fff" opacity=".018"/><circle cx="4" cy="4" r=".7" fill="#000" opacity=".25"/>
      </pattern>
    </defs>
    <rect width="2400" height="1080" fill="url(#bg)"/>
    <rect width="2400" height="1080" fill="url(#grain)"/>
  </svg>`;
}

function thumb(silver) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 480 480">${DEFS}
    <rect width="480" height="480" rx="60" fill="#050607"/>
    <g transform="translate(24 24) scale(.9)">
      <circle cx="240" cy="240" r="238" fill="url(#chrome)"/><circle cx="240" cy="240" r="218" fill="url(#${silver ? 'silver' : 'face'})"/>
      <polygon points="232,262 248,262 243,70 240,58 237,70" fill="${silver ? '#e3211b' : '#ff4a1c'}" transform="rotate(-40 240 240)"/>
      <circle cx="240" cy="240" r="26" fill="url(#cap)"/>
    </g>
  </svg>`;
}

// Sweep angles measured from the factory cluster: big dials about 224° (0 and max 68° either side of
// the bottom), fuel and coolant about 100° across the top (130° either side of the bottom).
// Red marks assume these dial ranges in Torque: fuel 0–100 %, coolant 40–130 °C.
const BIG = 112, SMALL = 50;
const at = (v, min, max, half) => -half + (v - min) / (max - min) * 2 * half;
const fuelRed = () => redArc(at(0, 0, 100, SMALL), at(8, 0, 100, SMALL));
const tempRed = () => redArc(at(121, 40, 130, SMALL), at(130, 40, 130, SMALL));

const VARIANTS = {
  // Matches the real 2006 cluster: satin-silver faces, black markings, red needles.
  charger06oem: {
    name: 'Charger 06 OEM',
    description: 'Factory 2006 Charger look: silver faces, black markings, red needles, chrome rings',
    silver: true,
    colours: { tick: '#141516', title: '#3a3d40', value: '#141516', needle: '#e3211b' },
  },
  // Same layout with dark faces, easier on the eyes at night.
  charger06night: {
    name: 'Charger 06 Night',
    description: 'Charger-style chrome rings with dark faces and white markings for night driving',
    silver: false,
    colours: { tick: '#f4f6f8', title: '#9aa3ad', value: '#f4f6f8', needle: '#ff4a1c' },
  },
};

function images(v) {
  const iconFill = v.silver ? '#5b6065' : '#7d8792';
  return {
    'dial_background.png': dial('', v.silver),
    'dial_background_05.png': dial(tempRed() + icon(ICON_TEMP, 300, iconFill), v.silver),  // coolant
    'dial_background_2f.png': dial(fuelRed() + icon(ICON_FUEL, 300, iconFill), v.silver),  // fuel
    'display_background.png': display(),
    'background.jpg': background(),
  };
}

const props = v => `# ${v.name}: theme for Torque Pro
name=${v.name}
description=${v.description}
author=charger-cluster

# Sweep like the factory gauges (degrees each side of the bottom of the dial)
globalDialStartAngle=${180 - BIG}
globalDialStopAngle=${180 - BIG}
# Fuel and coolant: small arcs across the top, like the factory side gauges
dialStartAngle_05=${180 - SMALL}
dialStopAngle_05=${180 - SMALL}
dialStartAngle_2f=${180 - SMALL}
dialStopAngle_2f=${180 - SMALL}

displayTickColour=${v.colours.tick}
displayTextTitleColour=${v.colours.title}
displayTextValueColour=${v.colours.value}
displayIndicatorColour=${v.colours.needle}
dialNeedleColour=${v.colours.needle}
graphLineColour=${v.colours.needle}
updateFlasherColour=#2bff6a
showUpdateFlasher=false

font=sans-serif-condensed
globalFontScale=1
dialTickStyle=1
backgroundScrolls=false
`;

(async () => {
  fs.mkdirSync(DIST, { recursive: true });
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await browser.newPage();
  const render = async (svg, file, w, h, jpg) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await page.screenshot({ path: file, omitBackground: !jpg, type: jpg ? 'jpeg' : 'png', quality: jpg ? 90 : undefined,
                            clip: { x: 0, y: 0, width: w, height: h } });
  };
  for (const [id, v] of Object.entries(VARIANTS)) {
    const out = path.join(THEMES, id);
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out, { recursive: true });
    for (const [name, svg] of Object.entries(images(v))) {
      const [w, h] = name === 'background.jpg' ? [2400, 1080] : [480, 480];
      await render(svg, path.join(out, name), w, h, name.endsWith('.jpg'));
    }
    fs.writeFileSync(path.join(out, 'properties.txt'), props(v));
    await render(thumb(v.silver), path.join(DIST, id + '.png'), 128, 128, false);
    const zip = path.join(DIST, id + '.zip');
    fs.rmSync(zip, { force: true });
    execSync(`cd "${out}" && zip -q -X "${zip}" *`);
    console.log('built', zip);
  }
  await browser.close();
})();
