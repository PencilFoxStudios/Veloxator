import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { ActionRowBuilder, ButtonInteraction, ButtonStyle, Client, CommandInteraction, EmbedBuilder, Guild, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import PNFXMenu from "../../helpers/Menu";
import PNFXMember from "../../helpers/Member";
import * as PNFXEmbeds from "../../helpers/Embeds"
import * as PNFXHelpers from "../../helpers/functions"
import { iNatClient } from "inaturalits";
export default async function handleButton(client: Client, EraserTail: EraserTailClient, interaction: ButtonInteraction, pnfxMember: PNFXMember, iNaturalist:iNatClient): Promise<void> {
    const behavior = interaction.customId // Contains a custom ID that refers to the command ran.
    const originalMessage = interaction.message
    const GUILD = interaction.guild as Guild
    switch (behavior) {
        case "dismiss_message":
            await interaction.update({ content: "_ _", embeds: [], components: [] })
            break;
        case "mod_change_reason":
            // Change the reason for the action.
            const tempMenu = new PNFXMenu("#c5f9ff", false, originalMessage);
            let modal: ModalBuilder = new ModalBuilder().setCustomId("mod_change_reason_modal").setTitle("Change Action Note/Reason");
            const reasonInput = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("What should the note for this action be?")
                .setPlaceholder("None specified.")
                .setStyle(TextInputStyle.Paragraph);
            const prevEmbedData = tempMenu.getEmbed(3)
            if (prevEmbedData.data.description !== "**Reason:** *Not set*") {
                reasonInput.setValue((prevEmbedData.data.description as string).replace("**Reason:** ", ""))
            }
            const reasonRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
            modal.addComponents(reasonRow);
            interaction.showModal(modal)
            break;
        default:
            await interaction.update({
                embeds: [PNFXEmbeds.error("NOT_CONFIGURED")]
            });
            EraserTail.log("Warn", "This bot isn't configured to handle that button!")
            break;
    }
    return;
}