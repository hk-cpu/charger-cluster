# Charger 06 OEM: a Torque Pro theme

Factory-style chrome-ring gauges, inspired by the 2006 Dodge Charger cluster, for the
**Torque Pro** app (themes don't work in Torque Lite). Torque keeps doing the connection
to your Wi-Fi ELM327. This theme only changes how the gauges look.

![Preview mock-up](preview.png)

**Download:** [charger06oem.zip](https://github.com/hk-cpu/charger-cluster/raw/claude/phone-screen-mirror-dashboard-0n195w/torque-theme/dist/charger06oem.zip)

## What's in it

| File | What it is |
|---|---|
| `dial_background.png` | Chrome bezel + dark face for every round gauge |
| `dial_background_0c.png` | RPM face with the red zone from 6,000 to 7,000 |
| `dial_background_0d.png` | Speed face |
| `dial_background_05.png` | Coolant face with temperature icon and red zone near hot |
| `dial_background_2f.png` | Fuel face with pump icon and red zone near empty |
| `display_background.png` | Square digital displays, styled like the factory info screen |
| `background.jpg` | Dark dashboard background |
| `properties.txt` | Colours (white markings, red-orange needle), gauge sweep angles, font |

## Install

1. On the Samsung, tap the **Download** link above. The zip saves to your **Downloads** folder.
2. Open **Torque Pro** → **⚙ Settings** → **Themes** (the theme chooser).
3. Tap **Import theme** and pick `charger06oem.zip` from Downloads.
4. Select **Charger 06 OEM**. If it doesn't change straight away, close Torque fully and reopen it.

## Set up the gauges to match

The red zones are drawn into the images, so set each gauge's range in Torque to match.
In **Realtime Information**, long-press a gauge → **Edit**, or long-press empty space → **Add display** → **Dial**:

| Gauge (sensor) | Min | Max |
|---|---|---|
| Engine RPM | 0 | 7000 |
| Speed (OBD) | 0 | 260 km/h (or 160 mph) |
| Engine Coolant Temperature | 40 | 130 °C |
| Fuel Level (from engine ECU) | 0 | 100 % |

For a factory layout, place them left to right: Fuel (small), RPM (big), Speed (big), Coolant (small).

Some 2006 Chargers don't report fuel level over OBD. If the fuel gauge stays empty, that's the car, not the theme.

## Tweaking

`properties.txt` is plain text. Edit it, zip the files again (files at the top level of the zip,
no folder), and re-import. Useful settings:
- `globalDialStartAngle` / `globalDialStopAngle`: how far around the gauges sweep (55 = factory style).
- `dialNeedleColour`, `displayTickColour`: needle and marking colours (`#rrggbb`).
- `globalFontScale`: bigger or smaller numbers.
- `dialTickInnerRadius` / `dialTickOuterRadius`: move the tick marks in or out if they overlap the chrome ring.

## Rebuilding the images

`src/build.js` draws everything from code: `cd src && npm i playwright && node build.js`.
