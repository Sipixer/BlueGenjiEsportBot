import * as deepl from "deepl-node";
import { TargetLanguageCode } from "deepl-node";

const authKey = "49ec69d1-1ced-2140-7875-2e6385e59312:fx"; // Replace with your key
const translator = new deepl.Translator(authKey);

export const Translate = async (Text: string, lang: TargetLanguageCode) => {
  try {
    const result = await translator.translateText(Text, null, lang);
    return result.text;
  } catch (error) {
    console.log(error);
    return "Error";
  }
};

export const Usage = async () => {
  return await translator.getUsage();
};

export const ComputedUsage = async () => {
  const usage = await Usage();
  const pourcentage = await UsagePourcentage(usage);
  const left = await UsageLeft(usage);
  return { pourcentage, left };
};

const UsagePourcentage = async (usage: deepl.Usage) => {
  if (
    usage.character?.count != undefined &&
    usage.character?.limit != undefined
  ) {
    return usage.character?.count / usage.character?.limit;
  }
  return undefined;
};

const UsageLeft = async (usage: deepl.Usage) => {
  if (
    usage.character?.count != undefined &&
    usage.character?.limit != undefined
  ) {
    return usage.character?.limit - usage.character?.count;
  }
  return undefined;
};
