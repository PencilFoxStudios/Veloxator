import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { ActionRowBuilder, AutocompleteInteraction, ButtonInteraction, ButtonStyle, Client, EmbedBuilder, Guild, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import PNFXMenu from "../../helpers/Menu";
import PNFXMember from "../../helpers/Member";
import * as PNFXEmbeds from "../../helpers/Embeds"
import { Types, iNatClient } from "inaturalits";
export default async function handleAutocomplete(client: Client, EraserTail: EraserTailClient, interaction: AutocompleteInteraction, pnfxMember: PNFXMember, iNaturalist: iNatClient): Promise<void> {
    const focusedValue = interaction.options.getFocused(true);
    switch (focusedValue.name) {
        case "taxa-id":
            try {
                const apiResponse = await iNaturalist.Taxa.Autocomplete({ q: focusedValue.value })

                const filtered: any[] = apiResponse.results!.map((taxon: Types.Taxa.ShowTaxon) => {
                    return { name: taxon.preferred_common_name ?? taxon.name, value: `${taxon.id}` }
                })

                await interaction.respond(
                    filtered
                );
            } catch (error) {
                // Error is API-related
                if (error instanceof Types.APIResponse.iNatError) {
                    console.log(error)
                    await interaction.respond(
                        [{ name: "iNaturalist.org's API is unavailable for the following reason:", value: 0 }, { name: error.message, value: 1 }, { name: "Please try again later.", value: 2 }]
                    );
                    return
                } else {
                    throw error
                }
            }

            break;
        default:
            EraserTail.log("Warn", "This bot isn't configured to handle autocompletes!")
            break;
    }

}