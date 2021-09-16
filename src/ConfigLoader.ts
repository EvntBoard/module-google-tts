import path from "path";
import fs from "fs";

export interface IConfig {
  host?: string;
  port?: number;
  name?: string;
  lang: string;
}

export class ConfigLoader {
  private _config: IConfig = {
    lang: "en",
  };

  async load() {
    const configFilePath = path.join(process.cwd(), "config.json");
    if (fs.existsSync(configFilePath)) {
      const configFile = <IConfig>await import(configFilePath);
      this._config = {
        host: configFile.host || process.env.EVNTBOARD_HOST || "localhost",
        port:
          configFile.port ||
          (process.env.EVNTBOARD_PORT
            ? parseInt(process.env.EVNTBOARD_PORT, 10)
            : 5001),
        lang: configFile.lang,
        name: configFile.name,
      };
    } else {
      fs.writeFileSync(configFilePath, JSON.stringify(this._config, null, 2), {
        mode: 0o755,
      });
    }
  }

  getConfig = () => {
    return this._config;
  };
}
