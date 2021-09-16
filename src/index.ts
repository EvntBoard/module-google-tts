import { ConfigLoader } from "./ConfigLoader";
import { GoogleTtsConnexion } from "./GoogleTtsConnexion";

const main = async () => {
  const configLoader = new ConfigLoader();
  await configLoader.load();

  const conf = configLoader.getConfig();

  new GoogleTtsConnexion(
    conf.host,
    conf.port,
    conf.name || "google-tts",
    conf.lang
  );
};

main();
