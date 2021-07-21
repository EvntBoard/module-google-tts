import process from 'process';
import { EvntComClient, EvntComServer } from "evntboard-communicate";
import * as googleTTS from 'google-tts-api';

// parse params
const { name: NAME, customName: CUSTOM_NAME, config: { lang: LANG } } = JSON.parse(process.argv[2]);
const EMITTER = CUSTOM_NAME || NAME;

let tts_lang = LANG || 'fr'

// create Client and Server COM
const evntComClient = new EvntComClient(
    (cb: any) => process.on('message', cb),
    (data: any) => process.send(data),
);

const evntComServer = new EvntComServer();

evntComServer.registerOnData((cb: any) => process.on('message', async (data) => {
    const toSend = await cb(data);
    if (toSend) process.send(toSend);
}));

evntComServer.expose("newEvent", () => {});
evntComServer.expose("load", () => {});
evntComServer.expose("unload", () => {});
evntComServer.expose("reload", () => {});

evntComServer.expose("generate", async (message:string, lang?: string, splitPunct?: string) => {
    if (message.length < 200) {
        return await googleTTS.getAudioBase64(message, { lang: lang || tts_lang, slow: false });
    } else {
        const data = await googleTTS.getAllAudioBase64(message, { lang: lang || tts_lang, slow: false, splitPunct: splitPunct || ',.?!;:', })
        return data.map(i => i.base64);
    }
});

evntComServer.expose("setLang", async (lang:string) => {
    tts_lang = lang;
});

evntComServer.expose("getLang", async () => tts_lang);