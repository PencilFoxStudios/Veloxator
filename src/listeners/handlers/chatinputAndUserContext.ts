import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { ActionRowBuilder, ButtonInteraction, ButtonStyle, Client, CommandInteraction, EmbedBuilder, Guild, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import PNFXMenu from "../../helpers/Menu";
import PNFXMember from "../../helpers/Member";
import * as PNFXEmbeds from "../../helpers/Embeds"
import { Commands } from "../../Commands";
import { iNatClient } from "inaturalits";
export default async function handleChatInputMessageContextOrUserContextCommand(client: Client, EraserTail: EraserTailClient, interaction: CommandInteraction, pnfxMember: PNFXMember, iNaturalist:iNatClient): Promise<void> {
    const command = Commands.find(c => {
        return c.info().name === interaction.commandName
    });
    if (!command) {
        await interaction.reply({
            ephemeral: true,
            embeds: [PNFXEmbeds.error("COMMAND_NOT_FOUND")]
        });
        return;
    }
    command.run(client, interaction, EraserTail, iNaturalist);
}