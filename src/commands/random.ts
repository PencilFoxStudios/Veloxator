import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { CommandInteraction, Client, SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import { PNFXCommandSupportString } from "src/helpers/types";
import { PNFXCommand } from "../Command";
import * as PNFXEmbeds from "../helpers/Embeds"
import PNFXMenu from "../helpers/Menu"
import { error } from "../helpers/Embeds";
import { Types, iNatClient } from "inaturalits";
import GoogleMaps from "../helpers/googleMaps";
export class Random extends PNFXCommand {
    constructor() {
        super(
            // Command Name
            "random",
            // Command Description
            "Get a random sighting",
            // Supported Methods of Running
            ["SLASH"],
            // Should I make the user the only one able to see the reply?
            false
        );
        this.SlashCommand
            ?.addStringOption(option =>
                option.setName('taxa-id')
                    .setDescription('A species to look up (defaults to Genus Vulpes)')
                    .setAutocomplete(true))
    }
    __RunSlashCommand: Function = async (client: Client, interaction: CommandInteraction, EraserTail: EraserTailClient, iNatClient:iNatClient) => {
        const taxa: string = (interaction as ChatInputCommandInteraction).options.getString('taxa-id') || "42054";
        if (!parseInt(taxa)) {
            await interaction.editReply({
                embeds: [PNFXEmbeds.error().setDescription("**Invalid species!**\nPlease wait for the autocomplete to present you with options and pick from those.")]
            });
            return
        }
        try {
            const result = await iNatClient.Observations.Random([taxa]);
            if(result){
                const GM = new GoogleMaps(client, EraserTail)
                const mapBuffer: Buffer | null = (result.geojson) ? await GM.coordinatesToBuffer(result.geojson.coordinates![0], result.geojson.coordinates![1]) : null;


                await interaction.editReply(
                    {
                        embeds: [PNFXEmbeds.veloxSighting(result)],
                        files: mapBuffer?[new AttachmentBuilder(mapBuffer, {
                            name: "map.png"
                        })]:[]
                    }
                )
            }else{
                await interaction.editReply(
                    {
                        embeds: [PNFXEmbeds.error().setDescription(`There were no observations that were found under the specified taxon. Please try again with another taxon!`).setTitle(`No observations found!`)]
                    }
                )
            }

        } catch (error) {
            // Error is API-related
            if (error instanceof Types.APIResponse.iNatError) {
                console.log(error)
                await interaction.editReply(
                    {
                        embeds: [PNFXEmbeds.error().setDescription(`The iNaturalist.org API appears to be having some issues. Please try again later!`).setTitle(`Error code ${error.code}`)]
                    }
                )
                return
            } else {
                await interaction.editReply(
                    {
                        embeds: [PNFXEmbeds.error("UNK")]
                    }
                )
                EraserTail.log("Error", error as any)
            }
        }


    };

};
