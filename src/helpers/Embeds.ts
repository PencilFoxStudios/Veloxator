import { ColorResolvable, EmbedBuilder, EmbedField, User } from 'discord.js'
import moment from 'moment'
import * as PNFXTypes from "./types"
import { Types } from "inaturalits"
import { EraserTailClient } from '@pencilfoxstudios/erasertail'
export function error(code: PNFXTypes.PNFXBotErrorCode = "UNK"): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(0xda4453)
        .setTitle("An error has occurred.")
        .setDescription(PNFXTypes.PNFXBotError[code].PRETTY)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/768px-Flat_cross_icon.svg.png")
        .setFooter({
            text: `Error Code: ${code}`
        })
    return embed
}

export function success(text: string = "The action was proformed successfully!") {
    const embed = new EmbedBuilder()
        .setColor(0x2acd72)
        .setTitle("Success!")
        .setDescription(text)
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png")
    return embed
}
export function info(title: string | null = null, information: string | null = null, color: ColorResolvable = 0x4fc1f1) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(information)
    return embed
}
export function user(user: User | null, customText = user?.tag ?? "Unknown User") {
    const embed = new EmbedBuilder()
        .setColor(0x1e1e79)
        .setAuthor({
            iconURL: user?.avatarURL() ?? undefined,
            name: customText
        })
    return embed
}
export function veloxSighting(observationInfo:Types.Observations.ShowObservation) {
    if(observationInfo.description == ''){
        observationInfo.description = undefined;
    }
    const embed = new EmbedBuilder()
        .setColor(0xf76e10)
        .setAuthor({
            iconURL: observationInfo.user?.icon_url,
            name: observationInfo.user?.login || "Anonymous",
            url: observationInfo.user?.login?`https://www.inaturalist.org/people/${observationInfo.user?.login}`:undefined
        })
        .setDescription((observationInfo.description??`*${observationInfo.taxon?`${observationInfo.taxon?.name}`:"Something"}* was previously spotted in ${observationInfo.place_guess} <t:${moment(observationInfo.observed_on_string).unix()}:R>!`) + `\n[**View Observation**](${observationInfo.uri})`)
        .setImage(observationInfo.photos![0].url!.replace("square", "original"))
        .setTimestamp(moment(observationInfo.observed_on).toDate())
        .setThumbnail("attachment://map.png")
        .setFooter({
            text: "Powered by iNaturalist.org"
        })
    return embed
}