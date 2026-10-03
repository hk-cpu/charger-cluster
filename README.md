# Charger Cluster

A factory-style instrument cluster for a **2006 Dodge Charger**, running in Chrome on a spare
**Samsung Galaxy A34** mounted in the dash. All numbers come live from a **Kingbolen ELM327**
OBD-II adapter. There is no demo or made-up data: anything the car doesn't report shows `--` / `NO DATA`.

Open it on the phone: **https://hk-cpu.github.io/charger-cluster/** (after GitHub Pages is switched on).

## What's on screen

Laid out like the real 2006 cluster, left to right: **fuel, speedometer, tachometer, coolant temp**.

- Satin-silver faces with black markings, red needles and chrome rings. The speedometer is 0–260 km/h
  with the inner MPH scale (switchable to MPH first). The tachometer is 0–7 ×1000.
- Needle sweep and warning-light check every time it starts, like the real cluster.
- **Speedometer's black area** (where the factory odometer sits): digital speed plus one info line.
  Tap it to switch between battery volts / throttle, coolant / fuel, engine load / intake air,
  and RPM / number of trouble codes. Connection messages also show here.
- **Tachometer's black area**: warning lights and the clock. The warning lights are check engine
  (from the car), overheat (coolant 118 °C or more) and charging fault (low or high voltage while
  the engine runs).
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

## Coolant-only mode (phone behind the bezel)

For a phone mounted behind the cluster lens, taped off black, with only the round temperature
gauge showing through the bezel hole.

1. **MENU → Layout: Coolant only**. The screen goes black except for one factory-style temperature gauge
   (silver face, C / H, red mark at H, black lower half, no chrome ring, because the car's bezel is the ring).
2. Mount the phone behind the cluster, then **MENU → Line up the gauge…**:
   drag the gauge until it sits exactly in the hole, set the size with the slider, use **Rotate** if the
   phone is mounted sideways or upside down, then tap **Done**. It remembers the position.
3. Tape off the rest. The A34 has an AMOLED screen, so black areas are fully off and won't glow through.
4. With the MENU button under tape, **press and hold anywhere on the screen for 1.5 seconds** to open the menu.

Options in the menu:
- **Temp needle: Factory / Exact**. *Factory* (default) works like the real gauge: the needle stays in the
  middle across the whole normal range (about 80–108 °C) and only climbs toward H when the engine really
  runs hot. *Exact* shows the true temperature.
- **Lower part: Black / Cut off**. *Cut off* draws only the silver top of the gauge (C, H, needle) and leaves
  everything below it black, so the car's own working black screen in the cluster stays in use.
  Line up the flat bottom edge with the top of the car's black area.
- **Number under needle**: shows the temperature in digits in the black lower half (off by default).
  Connection messages also appear there until the adapter is connected.
- The gauge shifts by 1–2 pixels every minute. You can't see it behind the bezel, but it stops a still image
  burning into the screen.

**With the Wi-Fi Kingbolen**, the web page needs the Termux bridge (see "C. Wi-Fi" above). The alternative is
Torque Pro with the theme: one large *Engine Coolant Temperature* dial, though lining it up exactly with the
hole is harder there.

**Heat:** a phone sealed behind the cluster can get very hot, especially while charging in the sun. Use a
charger that isn't a fast charger, and check the phone after the first few drives.

## Make it start by itself with the car

Goal: car on → phone wakes, dashboard opens and connects. Car off → phone sleeps.
The phone stays switched on all the time; it just sleeps while the car is off.

**Power first:** plug the phone's charger into a socket that is **only live with the ignition on**.
If the socket stays live with the car off, the phone never knows the car is off, keeps the screen on,
and drains the car battery.

1. **Install the dashboard as an app.** Open the dashboard in Chrome → menu **⋮** → **Add to Home screen** →
   **Install**. It now has its own icon, opens full screen, and shows up as **Charger Cluster** in the app list.
2. **No screen lock**, so the phone wakes straight into the dashboard:
   Settings → **Lock screen** → **Screen lock type** → **None**.
3. **Stay awake while charging** (screen never turns off while the car is on):
   Settings → **About phone** → **Software information** → tap **Build number** 7 times →
   back to Settings → **Developer options** → turn on **Stay awake**.
4. **Short sleep when the car is off:** Settings → **Display** → **Screen timeout** → **30 seconds**.
5. **Open the dashboard automatically:** Settings → **Modes and Routines** → **Routines** → **+** →
   **If:** *Charging status* → *Charging* (wired) → **Then:** *Open an app or do an app action* → **Charger Cluster** → Save.
   Samsung phones light the screen when a charger connects, so: key on → charging starts → screen on → dashboard opens.
6. **Join the adapter's Wi-Fi automatically:** Settings → **Connections** → **Wi-Fi** → tap the adapter's network
   (e.g. `WiFi_OBDII`) → ⚙ → turn on **Auto reconnect**. When Android says *"no internet"*, choose to **stay connected**.
   Then Wi-Fi → ⋮ → **Intelligent Wi-Fi** → turn **off** *Switch to mobile data*, so the phone doesn't drop the adapter.
7. **Keep the bridge running all the time** (Wi-Fi adapter only):
   - Install **Termux:Boot** from F-Droid and open it once.
   - In Termux, paste this line once (it makes the bridge start whenever the phone starts):

     ```
     mkdir -p ~/.termux/boot && printf '#!/data/data/com.termux/files/usr/bin/sh\ntermux-wake-lock\nwebsockify 35001 192.168.0.10:35000\n' > ~/.termux/boot/start-bridge && chmod +x ~/.termux/boot/start-bridge
     ```
   - Settings → **Apps** → **Termux** → **Battery** → **Unrestricted** (same for **Termux:Boot**).
   - Restart the phone once. The bridge now runs in the background, waiting for the adapter.
   - If your adapter uses a different address, copy it from Torque (Settings → OBD2 Adapter Settings) and change `192.168.0.10:35000` in the line above.
8. **Protect the phone battery** (it will be plugged in a lot, in a hot car): Settings → **Battery** →
   **More battery settings** → **Protect battery** (stops charging at about 85 %).

The dashboard remembers the adapter, the layout and the line-up, and reconnects by itself every few seconds
until the car answers.

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

If you use the **Torque Pro** app (it connects to the Wi-Fi adapter directly), there are matching
themes in [`torque-theme/`](torque-theme/README.md): **Charger 06 OEM** (silver, like the factory
cluster) and **Charger 06 Night** (dark faces).

## Files

- `index.html`: the whole dashboard
- `sw.js`: lets it open with no internet
- `manifest.json`, `icon.svg`: home-screen app icon
- `torque-theme/`: the Torque Pro themes (ready-made zips in `torque-theme/dist/`)
