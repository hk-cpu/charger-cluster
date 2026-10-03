# Charger Cluster

A digital instrument cluster for a **2006 Dodge Charger** that runs in the web browser of a
spare phone (Samsung Galaxy A34) mounted in the dash. It reads live engine data from an
**ELM327 OBD-II adapter** over Bluetooth.

## What it shows

| Item | Where the data comes from |
|---|---|
| Speed | OBD adapter, or phone GPS |
| RPM, coolant temp, throttle | OBD adapter |
| Fuel level | OBD adapter, if the car reports it (shows `--` if not) |
| Battery voltage | OBD adapter |
| Check-engine light | OBD adapter |
| Overheat / battery warnings | Calculated from the values above |
| Turn signals, high beam | **Not available yet.** The car doesn't send these through the OBD port. They only light up in Demo mode for now (see "Later" below). |

## How to use it on the phone

1. Open the dashboard link in **Chrome** on the Samsung (it must be an `https://` link).
2. Tap **Connect** and choose:
   - **Demo**: fake drive, to check the screen.
   - **GPS speed only**: no adapter needed.
   - **OBD adapter – Bluetooth LE** or **Classic Bluetooth**, depending on your adapter (see below).
3. Tap **Full screen**. The screen stays on while the page is open.
4. **Dim / Night** lowers brightness for night driving. **km/h / mph** switches units.
5. Optional: Chrome menu ⋮ → **Add to Home screen** gives it an app icon that opens full screen.

### Which ELM327 do I have?

- **Bluetooth LE (4.0)**: usually doesn't show up in Android's normal Bluetooth pairing list,
  and the box or listing says "BLE" or "4.0". Use **Bluetooth LE**.
- **Classic Bluetooth**: you pair it in Android Settings → Bluetooth (PIN is usually `1234`
  or `0000`). First pair it there, then use **Classic Bluetooth**.
- **Wi-Fi ELM327**: won't work, because browsers can't talk to these.

If the Classic Bluetooth button is greyed out, the phone's Chrome version doesn't support it.
The reliable fix is a Bluetooth LE adapter (around $20, for example Vgate iCar Pro BLE).

The car's **ignition must be ON** for the adapter to answer.

## Showing your main phone's screen at the same time

Install **Headunit Reloaded** on the Samsung (this turns it into an Android Auto screen),
then use Samsung's **split screen**: open Recent apps, tap the app icon, then
"Open in split screen view". That puts the dashboard on one side and maps/music on the other.

## Later (step 3): live turn signals and high beam

These need a small ESP32 board wired to the car's indicator and high-beam wires by an
auto electrician, sending the signals to this page. Not built yet.

## Safety

- Keep the car's original warning lights working. This screen is extra, not a replacement.
- A phone charging in a hot dashboard can overheat and its battery can swell.
  Keep it out of direct sun and check it often.

## Files

- `index.html`: the whole dashboard (no installation, no build step)
- `manifest.json`, `icon.svg`: let it be added to the home screen as an app
