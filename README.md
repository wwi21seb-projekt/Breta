# Readme for Breta
Ein Client für eine Social Media App, welche im Rahmen der Vorlesungen Projektkonzeption und Projektrealisation entwickelt wurde.

## Start the project
Um das Projekt lokal auf dem Handy via der Expo App zu testen, kann der Expo Development Server gestartet werden, welcher sich mit der Expo App verbindet. Dieser wird durch folgenden Befehl gestartet:

```console
foo@bar:~$ npx expo start
```

Anschließend kann der QR-Code gescanned werden, wodurch sich die App mit dem Server verbindet. Vorraussetzung ist, dass sich der Rechner und das mobile Gerät in einem Netzwerk befinden!

## Build local
Um aus dem Source Code eine APK für Androidgeräte zu bauen, wird der folgende Befehlt verwendet:
eas build --platform android --profile apk --local

Im laufe des Befehls, wird ein aus dem Expo Projekt ein natives Android Projekt generiert, sprich die Expo abstraktionen übersetzt. Das Android-Projekt wird dann mit den entsprechenden Build Skripten kopiliert und gebaut. Es wird eine signierte APK Datei erstellt, welche auf Androidgeräten (oder eben einem Android Emulator bspw. mit Android Studio) ausgeführt werden kann. Der Build gibt außerdem Fehler aus, falls welche aufgetreten sind, die nicht zu einem Abbruch des Builds führen.

# Konfigurationseinstellungen
Mögliche Konfigurationseinstellungen lassen sich in der env.ts Datei vornehmen. Einerseits lässt sich hier der verwendete Server festlegen und andererseits die WebSocket URL für den Chat. Für beide Parameter sind die einzelnen Auswahlmöglichkeiten in Kommentaren in der Datei dokumentiert.

## IP Adress for android Emulator
Läuft der Mockserver lokal auf dem PC, dann darf nicht die Localhost IP Adresse verwendet werden um den Server anzugeben. Es muss hier die IP-Adresse des Rechners im Wlan netzwerk angegeben werden, sodass die Expo App den Mockserver auf dem PC findet. Bestimmt wird dies durch folgenden Befehl:

```console
foo@bar:~$ ipconfig getifaddr en0
```