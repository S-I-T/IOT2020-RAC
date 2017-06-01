# IOT2020 - Realtime Access Control
Web UI for [IOT2020-RAC](https://www.hackster.io/sit/iot2020-realtime-access-control-20613a), based on nodejs and Firebase.

## Instalation
0. Create an account in [Firebase](https://firebase.google.com/) and get [configuration](https://firebase.google.com/docs/web/setup)

1. Update *main.js* with your database url

2. Run **npm install** to get code dependencies

3. Run **node main.js** to init service, we recommend [pm2](http://pm2.keymetrics.io/) to configurate script autostart at iot2020 boot.


## Note
To run serialport on IOT2020 is needed to compile the package, follow the instructions in
https://www.npmjs.com/package/serialport#illegal-instruction

The Firebase database configuration is open for simplicity, in production we recommend you secure it, follow this [instructions](https://firebase.google.com/docs/server/setup?hl=es-419)
