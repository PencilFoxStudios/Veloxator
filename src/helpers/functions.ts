/**
* Some helper functions for Discord.
*     @module PNFXHelpers
*     @org Pencil Fox Studios
*     @warning
*  **ATTENTION:** 
*
* Unauthorized use and/or distribution of this class, or the code that lies within, outside of the organization indicated above is a copyright violation, and may be pursued in the court of law on a case-by-case basis. You have been warned!*
*     @author Liam Shackhorn
*     @license LICENSE.MD
*/
import moment from "moment";
import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { ApplicationCommandType, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ColorResolvable, CommandInteraction, EmbedBuilder, Guild, GuildBan, GuildMember, Interaction, InteractionType, MessageContextMenuCommandInteraction, Role, UserContextMenuCommandInteraction } from "discord.js";
import PNFXMenu from "./Menu";
import * as PNFXTypes from "./types"
import * as PNFXEmbeds from "./Embeds"
import PNFXMember from "./Member";
/**
 * Converts a hex string to its equivalent ColorResolvable.
 * @param {string} hex
 * @returns {ColorResolvable} A ColorResolvable
 * @author Liam Shackhorn
 */
export function hexToColorResolvable(hex: string): ColorResolvable {
    return parseInt(hex.replace("#", "")).toString(16) as ColorResolvable;
}
/**
 * Converts a ColorResolvable to its equivalent hex string.
 * @param {ColorResolvable} color
 * @returns {string} A hex string
 * @author Liam Shackhorn
 */
export function colorResolvableToHex(color: ColorResolvable): string {
    return `${color}`.replace("0x", "#");
}
/**
 * Checks if a user is banned from a guild.
 * @param {string} userID
 * @param {Guild} guild
 * @param {EraserTailClient} EraserTail
 * @returns {Promise<GuildBan|null>} A GuildBan, or not.
 * @author Liam Shackhorn
 */
export async function isUserBanned(userID: string, guild: Guild, EraserTail: EraserTailClient): Promise<GuildBan | null> {
    try {
        const banList = await guild.bans.fetch();
        const isBanned = banList.get(userID)
        return isBanned ?? null
    } catch (err) {
        EraserTail.log("Error", err as object)
        return null
    }
}
/**
 * Checks if a user is in a guild.
 * @param {string} userID
 * @param {Guild} guild
 * @param {EraserTailClient} EraserTail
 * @returns {Promise<boolean>} A boolean representing whether the user is in the guild or not.
 * @author Liam Shackhorn
 */
export async function getUserInServer(userID: string, guild: Guild, EraserTail: EraserTailClient): Promise<GuildMember | null> {
    try {
        const memberList = await guild.members.fetch();
        const member = memberList.get(userID) ?? null
        return member
    } catch (err) {
        EraserTail.log("Error", err as object)
        return null
    }
}
/**
 * Checks if a user is timeout out in a guild.
 * @param {string} userID
 * @param {Guild} guild
 * @param {EraserTailClient} EraserTail
 * @returns {Promise<boolean>} A boolean representing whether the user is timed out or not.
 * @author Liam Shackhorn
 */
export async function isUserTimedOut(userID: string, guild: Guild, EraserTail: EraserTailClient): Promise<number | null> {
    try {
        const member = await getUserInServer(userID, guild, EraserTail);
        if (!member) return null;
        if (member.communicationDisabledUntil) {
            return member.communicationDisabledUntilTimestamp
        } else {
            return null
        }
    } catch (err) {
        EraserTail.log("Error", err as object)
        return null
    }
}
/**
 * Checks if a user is a moderator in a guild, based on an environment variable.
 * @param {string} userID
 * @param {Guild} guild
 * @param {EraserTailClient} EraserTail
 * @returns {Promise<boolean>} A boolean representing whether the user is a moderator or not, depending on the MODERATOR_ROLE_ID
 * @author Liam Shackhorn
 * @deprecated Please use getUserStaffRole instead.
 */
export async function isUserModerator(userID: string, guild: Guild, EraserTail: EraserTailClient): Promise<boolean> {
    /* To be implemented */
    try {
        const member = await getUserInServer(userID, guild, EraserTail);
        if (!member) return false;
        const isModerator = member.roles.cache.some(role => role.id === process.env.MODERATOR_ROLE_ID)
        return isModerator
    } catch (err) {
        EraserTail.log("Error", err as object)
        return false
    }
}
/**
 * Gets a user's staff role based on their current roles in a guild.
 * @param {string} userID
 * @param {Guild} guild
 * @param {EraserTailClient} EraserTail
 * @returns {Promise<PNFXTypes.PNFXStaffRole | null>} A PNFXStaffRole or null, depending on if there were any matching roles or not.
 * @author Liam Shackhorn
 */
export async function getUserStaffRole(userID: string, guild: Guild, EraserTail: EraserTailClient): Promise<PNFXTypes.PNFXStaffRole | null> {
    /* To be implemented */
    const staffRoles: PNFXTypes.PNFXStaffRole[] = [
        {
            name: "MemberRole",
            role_id: "1043990158418137128",
            level: "MEMBER"
        },
        {
            name: "ModRole",
            role_id: "1043990222796509245",
            level: "MOD"
        },
        {
            name: "AdminRole",
            role_id: "1043990228064555088",
            level: "ADMIN"
        },
    ]
    try {
        const member = await getUserInServer(userID, guild, EraserTail);
        if (!member) return null;
        var highestStaffRole: PNFXTypes.PNFXStaffRole | null = null;
        for (let role of member.roles.cache.toJSON().reverse()) {
            for (let staffRole of staffRoles) {
                if (role.id == staffRole.role_id) {
                    highestStaffRole = staffRole
                    break;
                }
            }
            if (highestStaffRole) {
                break;
            }
        }
        return highestStaffRole
    } catch (err) {
        EraserTail.log("Error", err as object)
        return null
    }
}
export async function validateMenu(interaction: Interaction, userID: string, member: GuildMember | null, EraserTail: EraserTailClient) {
    const menu = new PNFXMenu("#c5f9ff")
    let i = interaction;
    let options = []
    let UserEmbed: EmbedBuilder;
    let UserTimedOut;
    let UserBanned;
    const PNFXMemberPerson = new PNFXMember(i.user, i.guild as Guild, EraserTail)
    var guildMember = await getUserInServer(userID, i.guild as Guild, EraserTail)
    if (guildMember) {
        member = guildMember
        UserEmbed = PNFXEmbeds.user(member.user, `Moderating ${member.user.tag}`)
        if (interaction.isMessageContextMenuCommand()) {
            UserEmbed.setDescription(`*${interaction.targetMessage.cleanContent}*`)
        }
        if ((await PNFXMemberPerson.hasPermission("MAKE_REPORT"))) {
            options.push({
                label: 'Report',
                description: `Report this user (and any attached message) to ${(i.guild as Guild).name} staff.`,
                value: 'mod_report_user',
                emoji: "💬"
            })
        }
        if ((await PNFXMemberPerson.hasPermission("KICK"))) {
            options.push(
                {
                    label: 'Kick',
                    description: 'Kick this user from the server.',
                    value: 'mod_kick_user',
                    emoji: "👢"
                }
            )
        }
        if ((await PNFXMemberPerson.hasPermission("WARN"))) {
            options.push({
                label: 'Warn',
                description: "Warn this user and attempt to DM them accordingly.",
                value: 'mod_warn_user',
                emoji: "👮"
            })
        }
        UserTimedOut = await isUserTimedOut(userID, i.guild as Guild, EraserTail)
        if (UserTimedOut && (await PNFXMemberPerson.hasPermission("UNTIMEOUT"))) {
            options.push({
                label: 'Untimeout',
                description: 'Untime this user out.',
                value: 'mod_untimeout_user',
                emoji: "🔊"
            })
        } else if ((await PNFXMemberPerson.hasPermission("TIMEOUT"))) {
            options.push({
                label: 'Timeout',
                description: 'Time this user out.',
                value: 'mod_timeout_user',
                emoji: "🔇"
            })
        }
    } else {
        UserEmbed = PNFXEmbeds.user(null, `Moderating ${userID}`)
        if (interaction.isMessageContextMenuCommand()) {
            UserEmbed.setDescription(`*${interaction.targetMessage.cleanContent}*`)
        }
    }
    UserBanned = await isUserBanned(userID, i.guild as Guild, EraserTail)
    if ((await PNFXMemberPerson.hasPermission("BAN"))) {
        if (UserBanned) {
            options.push({
                label: 'Unban',
                description: 'Unban this user from the server.',
                value: 'mod_unban_user',
                emoji: "✅"
            })
            UserEmbed.setAuthor({
                name: UserBanned.user.tag,
                iconURL: UserBanned.user.avatarURL() ?? undefined
            })
        } else {
            options.push({
                label: 'Ban',
                description: 'Ban this user from the server.',
                value: 'mod_ban_user',
                emoji: "❌"
            })
        }
    }
    if ((await PNFXMemberPerson.hasPermission("ADD_NOTES"))) {
        options.push({
            label: 'Add Note',
            description: "Add a note on this user's history for other mods.",
            value: 'mod_add_note_to_user',
            emoji: "🗒️"
        })
    }
    if ((await PNFXMemberPerson.hasPermission("VIEW_HISTORY"))) {
        UserEmbed.addFields([{
            name: "Quick Summary",
            value: `This user is ${guildMember ? "" : "not "} currently in the server. ${guildMember ? `They joined${i.guild?.name ? ` ${i.guild.name} ` : " "}<t:${moment(guildMember.joinedAt).unix()}:R> and created their account <t:${moment(guildMember.user.createdAt).unix()}:R>.` : `Therefore, your options may be limited.${UserBanned ? ` They are currently banned${UserBanned.reason ? ": ``" + UserBanned.reason + "``." : "."}` : ""}`} ${UserTimedOut ? `They are currently on a timeout, and will be untimed out <t:${moment(UserTimedOut).unix()}:R>.` : ""}`
        }])
    }
    menu.addEmbed(UserEmbed)
    let userHistory = await PNFXMemberPerson.history(member?.id ?? userID)
    menu.addEmbed(PNFXEmbeds.info(null, userHistory ? userHistory.moderation : "_ _"))
    menu.addEmbed(PNFXEmbeds.info(null, userHistory ? userHistory.verification : "_ _"))
    if ((await PNFXMemberPerson.hasPermission("RESTRAIN_USER"))) {
        menu.addButton("Restrain User", "mod_restrain_user", ButtonStyle.Danger, undefined, !(await getUserInServer(userID as string, i.guild as Guild, EraserTail)))
    }
    menu.setMessageContent("> " + userID)
    if (options.length !== 0) {
        menu.addEmbed(PNFXEmbeds.info().setFooter({
            text: "Please select an option."
        }))
        menu.addSelectMenu("mod_action", "Select a mod action!",
            ...options
        )
    } else {
        menu.deleteAllButtons()
        menu.deleteAllEmbeds()
        menu.addEmbed(PNFXEmbeds.error("NO_OPTIONS_AVAILABLE"))
    }
    return menu
}