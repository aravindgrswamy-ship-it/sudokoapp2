# Sudoku (offline Android app)

- **Easy:** 4x4 grid
- **Medium:** 9x9 grid, 38 given cells
- **Hard:** 9x9 grid, 27 given cells

Every puzzle has exactly one solution. Features: notes, undo, hint, check, timer,
auto-saved game, dark mode. No internet permission, fully offline.

## Get the APK

### Option A: Android Studio (easiest if you have it)
1. Open this folder in Android Studio (File > Open).
2. Wait for Gradle sync, then Build > Build Bundle(s) / APK(s) > Build APK(s).
3. The APK is at `app/build/outputs/apk/debug/app-debug.apk`.

### Option B: Command line (needs JDK 17 and the Android SDK)
```
gradle assembleDebug
```
(or `assembleRelease`, which is signed with the debug key so it installs directly)

### Option C: No installs, GitHub builds it for you
1. Create a new GitHub repository and upload everything in this folder
   (including the hidden `.github` folder).
2. Open the repository's **Actions** tab, wait for "Build APK" to finish.
3. Download the `sudoku-apk` artifact, unzip it, and you have the APK.

## Install on your phone
Copy the APK to the phone, open it, and allow "Install unknown apps" for your
file manager or browser when asked.

## Where things live
- `app/src/main/assets/sudoku.js`: puzzle generator and solver
- `app/src/main/assets/index.html`: the game UI
- `app/src/main/java/com/example/sudoku/MainActivity.java`: WebView wrapper
- To change difficulty, edit the `clues` numbers at the top of `sudoku.js`
