import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  MessagePayload,
  MessageReaction,
  PartialMessageReaction,
  Partials,
  PartialUser,
  User,
} from "discord.js";
import { config } from "./app";
import { ComputedUsage, Translate } from "./utils/Translator";

import { Client, GatewayIntentBits } from "discord.js";
import { TargetLanguageCode } from "deepl-node";
const ReactionLang = new Map([
  ["🇫🇷", "fr"],
  ["🇬🇧", "en-GB"],
  ["🇺🇸", "en-US"],
  ["🇪🇸", "es"],
  ["🇩🇪", "de"],
  ["🏴󠁧󠁢󠁥󠁮󠁧󠁿", "en-GB"],
]);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

export const StartClient = () => {
  client.login(config.token);
};

export const SetListener = () => {
  client.on("ready", () => {
    if (client == null || client.user == null) return;
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("interactionCreate", async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "usage") {
      await UsageCommandHandler(interaction);
    }
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message:", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    TranslateReaction(reaction, user);
  });
};

const UsageCommandHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const usage = await ComputedUsage();
  const pourcentage = usage.pourcentage
    ? (usage.pourcentage * 100).toFixed(2) + "%"
    : "indéfini";
  const Message = {
    embeds: [
      {
        title: `Utilisation de l'API DeepL`,
        description:
          "Nombre de character restant: `" +
          usage.left +
          "` \n Quantité utilisé: `" +
          pourcentage +
          "`",
        color: 0x00ffff,
        footer: {
          text: `Reset tous les mois`,
          icon_url: `https://play-lh.googleusercontent.com/0IH4L3pX-jqQXKYCDmxTM5t3Tvak2cb_zUuIs9nKCHPeOqkaRJ_bRTq1qKawsSvunw`,
        },
      },
    ],
    ephemeral: true,
  };
  await interaction.reply(Message);
};

const TranslateReaction = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  if (reaction.emoji.name == undefined) return;
  if (!ReactionLang.has(reaction.emoji.name)) return;
  const lang = ReactionLang.get(reaction.emoji.name);
  if (reaction.message.content == undefined || reaction.message.content == "")
    return;
  const text = reaction.message.content;
  const wpm = 5;
  const words = text.trim().split(/\s+/).length;

  const time = words / wpm + 20;

  const msg = await reaction.message.reply({
    embeds: [
      {
        title: reaction.emoji.name,
        description: await Translate(text, lang as TargetLanguageCode),
        color: 10181046,
        author: {
          name: user.username as string,
          icon_url: user.avatarURL() as string,
        },
        footer: {
          text: "Delete in " + time + " sec.",
        },
      },
    ],
  });
  setTimeout(() => {
    if (msg.deletable) {
      msg.delete();
    }
  }, time * 1000);
};
