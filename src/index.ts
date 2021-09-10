require("dotenv").config();
import {EvntComNode} from "evntcom-js/dist/node";
import * as googleTTS from 'google-tts-api';

const NAME: string = process.env.EVNTBOARD_NAME || "google-tts";
const HOST: string = process.env.EVNTBOARD_HOST || "localhost";
const PORT: number = process.env.EVNTBOARD_PORT ? parseInt(process.env.EVNTBOARD_PORT) : 5001;
const LANG: string = process.env.EVNTBOARD_CONFIG_LANG || 'en';

const evntCom = new EvntComNode({
    name: NAME,
    port: PORT,
    host: HOST,
});

let tts_lang = LANG;

const setLang = async (lang:string) => {
    tts_lang = lang;
}

const getLang = async () => tts_lang

const generate = async (message:string, lang?: string, splitPunct?: string) => {
    if (message.length < 200) {
        return await googleTTS.getAudioBase64(message, { lang: lang || tts_lang, slow: false });
    } else {
        const data = await googleTTS.getAllAudioBase64(message, { lang: lang || tts_lang, slow: false, splitPunct: splitPunct || ',.?!;:', })
        return data.map(i => i.base64);
    }
}

evntCom.expose("setLang", setLang);
evntCom.expose("getLang", getLang);
evntCom.expose("generate", generate);