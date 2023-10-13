import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { ActionRowBuilder, ButtonInteraction, ButtonStyle, Client, EmbedBuilder, Guild, GuildMember, ModalBuilder, SelectMenuBuilder, SelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import PNFXMenu from "../../helpers/Menu";
import PNFXMember from "../../helpers/Member";
import * as PNFXEmbeds from "../../helpers/Embeds"
import * as PNFXHelpers from "../../helpers/functions"
export default async function handleSelectMenu(client: Client, EraserTail: EraserTailClient, interaction: SelectMenuInteraction, pnfxMember: PNFXMember): Promise<void> {
    const selectedValues = interaction.values; // Contains a list of values that were selected as part of the select menu.
    const behavior = interaction.customId // Contains a custom ID that refers to the command ran.
    const originalMessage = interaction.message
    const GUILD = interaction.guild as Guild
    switch (behavior) {
        case "mod_action":
            // /mod Action Selection Menu
            const UUID = originalMessage.content.replace("> ", "");
            const MEMBER: GuildMember | null = await PNFXHelpers.getUserInServer(UUID, GUILD, EraserTail)
            switch (selectedValues[0]) {
                case "mod_kick_user":
                    // Kick option
                    const menu = new PNFXMenu("#c5f9ff", false, originalMessage);
                    menu.editEmbed(3, (embed: EmbedBuilder) => {
                        return embed
                            .setTitle(`Kick ${MEMBER ? MEMBER.user.username : UUID}?`)
                            .setDescription("**Reason:** " + "*Not set*")
                            .setFooter({ text: "Use the select menu below to switch actions!" })
                            .setThumbnail("https://media.discordapp.net/attachments/927669761997934632/1043966855158702170/goobism.png")
                            .setColor("#e67538")
                    })
                    menu.deleteAllButtons()
                    menu.addButton("Change Reason", "mod_change_reason", ButtonStyle.Secondary)
                    menu.addButton(`Confirm Kick`, "mod_confirm_kick_user", ButtonStyle.Success)
                    menu.editSelectMenu(0, (selectMenu: SelectMenuBuilder) => {
                        return selectMenu
                            .setPlaceholder("Kick User")
                    })
                    await interaction.update(menu.toMessageObject());
                    break;
                default:
                    let defMenu = new PNFXMenu("#c5f9ff", false, originalMessage);
                    /*
                    switch(selectedValues[0]){
                        case "etc_value":
                            ...
                    }
                    */
                    EraserTail.log("Warn", "This bot isn't configured to handle that select menu option!")
                    defMenu.editEmbed(3, (embed: EmbedBuilder) => {
                        return PNFXEmbeds.error("NOT_CONFIGURED")
                    })
                    await interaction.update(defMenu.toMessageObject());
                    break;
            }
            break;
        default:
            /*
            switch(selectedValues[0]){
                case "etc_value":
                    ...
            }
            */
            EraserTail.log("Warn", "This bot isn't configured to handle that select menu!")
            await interaction.reply({
                embeds: [PNFXEmbeds.error("NOT_CONFIGURED")]
            });
            break;
    }
}