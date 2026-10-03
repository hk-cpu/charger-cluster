# Charger Cluster

A factory-style instrument cluster for a **2006 Dodge Charger**, running in Chrome on a spare
**Samsung Galaxy A34** mounted in the dash. All numbers come live from a **Kingbolen ELM327**
OBD-II adapter. There is no demo or made-up data: anything the car doesn't report shows `--` / `NO DATA`.

Open it on the phone: **https://hk-cpu.github.io/charger-cluster/** (after GitHub Pages is switched on).

## What's on screen

- Chrome-ringed gauges: tachometer, speedometer (km/h with an inner mph scale, or the other way round),
  fuel and coolant temperature.
- Needle sweep and warning-light check every time it starts, like the real cluster.
- Centre info screen: big digital speed, plus four pages (tap it to switch):
  battery volts / throttle, coolant / fuel, engine load / intake air, RPM / number of trouble codes.
- Warning lights: check engine (from the car), overheat (coolant 118 °C or more),
  charging fault (low or high voltage while the engine runs).
- Turn signals and high beam only light during the start-up check. **The car doesn't send these
  through the OBD port.** They need extra wiring later.

## Testing in the car

1. Plug the Kingbolen adapter into the OBD port under the steering wheel. Turn the **ignition ON**
   (engine running is best).
2. Connect it to the phone. Which steps you follow depends on your Kingbolen model:

   **A. Bluetooth Classic** (shows up in Android Settings → Connections → Bluetooth, usually as
   "OBDII" or "V-LINK", PIN `1234` or `0000`):
   1. Pair it in Android Bluetooth settings first.
   2. Open the dashboard link in Chrome → **MENU** → **Bluetooth Classic** → pick the adapter → **Connect**.
   3. Needs Chrome 138 or newer. If the button is greyed out, update Chrome in the Play Store.

   **B. Bluetooth LE / 4.0** (works with iPhones too, and doesn't pair in settings):
   1. Open the dashboard → **MENU** → **Bluetooth LE / 4.0** → pick the adapter → **Pair**.
   2. If Chrome asks for "Nearby devices" or Location permission, allow it.

   **C. Wi-Fi** (the phone joins a Wi-Fi network called something like "WiFi_OBDII"):
   browsers can't talk to Wi-Fi adapters directly, so a small free bridge app relays the data:
   1. Install **Termux** from F-Droid (the Play Store version is outdated).
   2. In Termux, type once: `pkg install python -y && pip install websockify`
   3. Open the dashboard once **while you still have internet** (so it saves itself for offline use).
   4. Join the adapter's Wi-Fi network, then in Termux type:
      `websockify 35001 192.168.0.10:35000` and leave Termux running.
   5. In the dashboard: **MENU** → **Wi-Fi adapter** → keep `ws://127.0.0.1:35001` → OK.

3. The centre screen walks through `WAKING ADAPTER…` → `TALKING TO CAR…` → `CONNECTED`, then the
   needles move. The green dot means data is flowing.
4. Next time, it reconnects to the same adapter by itself. If the link drops, it retries every few seconds.

### If something doesn't work

Open **MENU → Connection log**, tap **Copy log** (or take a screenshot) and send it to me.
It shows every message between the phone and the adapter.

| Message | What to do |
|---|---|
| `CAR NOT ANSWERING – IGNITION ON?` | Turn the key to ON / start the engine. Check the adapter is pushed in fully. |
| `NO ADAPTER CHOSEN` | The adapter wasn't picked in the list. Try again, or use the other Bluetooth option. |
| `NOT AN OBD ADAPTER` | The wrong device was picked in the BLE list. |
| `BRIDGE APP NOT RUNNING` | Wi-Fi only: start the `websockify` command in Termux. |
| Fuel shows `NO DATA` | Some 2006 cars don't report fuel level over OBD. That's normal, not a fault. |

## Other settings (MENU)

- **Units**: km/h / °C or mph / °F (the speedometer face redraws to match).
- **Brightness**: Day / Dusk / Night.
- **Full screen**: also locks the screen sideways. Chrome menu ⋮ → **Add to Home screen** gives an app
  icon that always opens full screen.
- The screen stays on while the dashboard is open.

## Safety

- Keep the car's original warning lights working. This screen is extra, not a replacement.
- A phone charging in a hot dashboard can overheat and its battery can swell. Keep it out of direct sun.
- Unplug the adapter when the car is parked for days, because it slowly drains the battery.

## Torque Pro theme

If you use the **Torque Pro** app (it connects to the Wi-Fi adapter directly), there's a matching
factory-style theme in [`torque-theme/`](torque-theme/README.md).

## Files

- `index.html`: the whole dashboard
- `sw.js`: lets it open with no internet
- `manifest.json`, `icon.svg`: home-screen app icon
- `torque-theme/`: the Torque Pro theme (ready-made zip in `torque-theme/dist/`)
