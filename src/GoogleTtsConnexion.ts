import { EvntComNode } from "evntcom-js/dist/node";
import * as googleTTS from "google-tts-api";

export class GoogleTtsConnexion {
  private name: string;
  private evntCom: EvntComNode;
  private lang: string;

  constructor(
    evntBoardHost: string,
    evntBoardPort: number,
    name: string,
    lang: string
  ) {
    this.name = name;
    this.lang = lang;
    this.evntCom = new EvntComNode({
      name,
      port: evntBoardPort,
      host: evntBoardHost,
    });

    this.evntCom.onOpen = async () => {
      await this.evntCom.notify("newEvent", [
        "google-tts-load",
        null,
        { emitter: this.name },
      ]);
    };

    this.evntCom.expose("setLang", this.setLang);
    this.evntCom.expose("getLang", this.getLang);
    this.evntCom.expose("generate", this.generate);
  }

  setLang = async (lang: string) => {
    this.lang = lang;
  };

  getLang = async () => this.lang;

  generate = async (message: string, lang?: string, splitPunct?: string) => {
    if (message.length < 200) {
      return await googleTTS.getAudioBase64(message, {
        lang: lang || this.lang,
        slow: false,
      });
    } else {
      const data = await googleTTS.getAllAudioBase64(message, {
        lang: lang || this.lang,
        slow: false,
        splitPunct: splitPunct || ",.?!;:",
      });
      return data.map((i) => i.base64);
    }
  };
}
