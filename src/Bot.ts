import { Client, IntentsBitField } from "discord.js";
import { EraserTailClient } from "@pencilfoxstudios/erasertail"
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import { API, Types } from "inaturalits";
const iNaturalist = new API.iNatClient()
iNaturalist.Observations.Get(187447390).then(function (observationData:Types.Observations.ObservationsShowResponse){
  console.log(observationData)
})


const EraserTail = new EraserTailClient({
  APPLICATION_NAME: "VELOXATOR",
  APPLICATION_NAME_HUMAN: "Veloxator",
  APPLICATION_COLOR_PRIMARY: "#e5632b",
  APPLICATION_COLOR_SECONDARY: "#181818",
  APPLICATION_PREFIX: "VELOXATOR >> ",
  APPLICATION_LOGGING_STYLES: null,
  APPLICATION_ICON: "https://cdn.discordapp.com/avatars/1028019590829191230/8f9fe774f89b2f7f6d7c38c628a3da8b.webp",
  LOG_TO_CLOUD: true,
  APPLICATION_SERVICES: [
    {
      SERVICE_NAME: "BOT",
      SERVICE_NAME_HUMAN: "Veloxator Discord Bot",
      SERVICE_STATUS: "UP"
    },
    {
      SERVICE_NAME: "INATURALIST_ORG",
      SERVICE_NAME_HUMAN: "iNaturalist API",
      SERVICE_STATUS: "UP"
    },
  ],
  AUTO_HEARTBEAT: true,
  AUTO_HEARTBEAT_INTERVAL: null,
})
EraserTail.log("Info", "Bot is starting...");

const client = new Client({
  intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildBans]
});
ready(client, EraserTail);
interactionCreate(client, EraserTail);

client.login(process.env.DISCORD_BOT_TOKEN);