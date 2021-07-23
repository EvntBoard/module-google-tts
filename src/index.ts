import process from "process";
import { getEvntComServerFromChildProcess } from "evntboard-communicate";
import * as googleTTS from 'google-tts-api';

const { config: { lang: LANG } } = JSON.parse(process.argv[2]);

const evntComServer = getEvntComServerFromChildProcess();

let tts_lang = LANG || 'en'

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

evntComServer.expose("setLang", setLang);
evntComServer.expose("getLang", getLang);
evntComServer.expose("generate", generate);