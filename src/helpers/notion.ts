import { Client } from "@notionhq/client";
import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import * as PNFXTypes from "./types";
export class ExampleDatabase {
    private client: Client;
    private ExampleDB: any;
    private EraserTail: EraserTailClient
    private NOTION_EXAMPLE_DATABASE_ID: string = process.env.NOTION_EXAMPLE_DATABASE_ID ?? "";
    constructor(EraserTail: EraserTailClient) {
        this.client = new Client({
            auth: process.env.NOTION_TOKEN,
        });
        this.EraserTail = EraserTail;
    }
    async refreshDatabases() {
        this.ExampleDB = await this.client.databases.retrieve({
            database_id: this.NOTION_EXAMPLE_DATABASE_ID,
        });
        return;
    }
    async getSubDatabase() {
        if (!this.ExampleDB) {
            this.ExampleDB = await this.client.databases.retrieve({
                database_id: this.NOTION_EXAMPLE_DATABASE_ID,
            });
        }
        return this.ExampleDB;
    }

    async getDatabases() {
        let answer;
        if (!this.ExampleDB) {
            answer = await this.client.search({});
        }
        return answer;
    }
    users: {
        get({ ID }: { ID: string }): Promise<any>,
    } = {
            get: async ({ ID }: { ID: string }): Promise<any> => {
                return {
                    moderation: "🧼 This user is clean!",
                    verification: "🔎 This user never verified."
                }
            },
        }
    entries: {
        get({ ID }: { ID: string }): Promise<PNFXTypes.PNFX_EXAMPLE_TYPE | null>,
        create({ PROPERTIES }: { PROPERTIES: PNFXTypes.PNFX_EXAMPLE_TYPE, GUILD_ICON: string | null }): Promise<PNFXTypes.PNFX_EXAMPLE_TYPE | null>,
    } = {
            get: async ({ ID }: { ID: string }): Promise<PNFXTypes.PNFX_EXAMPLE_TYPE | null> => {
                let result: PNFXTypes.PNFX_EXAMPLE_TYPE | null = null;
                // TO-DO: Implement
                let raw: any = await this.client.pages.retrieve({
                    page_id: ID
                }).catch(() => {
                    raw = null
                })
                if (raw == null) return null;
                // Mappings of properties from Notion to result.
                result = {
                    EXAMPLE: "THIS IS JUST AN EXAMPLE TYPE"
                }
                return result
            },
            create: async ({ PROPERTIES }: { PROPERTIES: PNFXTypes.PNFX_EXAMPLE_TYPE }): Promise<PNFXTypes.PNFX_EXAMPLE_TYPE | null> => {
                let result: PNFXTypes.PNFX_EXAMPLE_TYPE | null = null;
                let successful: boolean = true;
                const raw: any = await this.client.pages.create({
                    "icon": {
                        "type": "external",
                        "external": {
                            "url": ""
                        }
                    },
                    "parent": {
                        "type": "database_id",
                        database_id: this.NOTION_EXAMPLE_DATABASE_ID,
                    },
                    "properties": {
                        "TITLE_EXAMPLE": {
                            "title": [
                                {
                                    "text": {
                                        "content": "TITLE_GOES_HERE"
                                    }
                                }
                            ]
                        },
                        "RICH_TEXT_EXAMPLE": {
                            "rich_text": [
                                {
                                    "text": {
                                        "content": "RICH_TEXT_CONTENT_GOES_HERE"
                                    }
                                }
                            ]
                        },
                        "CHECKBOX_EXAMPLE": {
                            "checkbox": true
                        },
                        "SELECT_EXAMPLE": {
                            "select": {
                                name: "SELECTION_NAME",
                            }
                        },
                        "DATE_EXAMPLE": {
                            date: {
                                start: (new Date).toISOString(),
                                time_zone: "US/Eastern"
                            }
                        },
                    },
                    "children": [
                        {
                            "object": "block",
                            "heading_2": {
                                "rich_text": [
                                    {
                                        "text": {
                                            "content": "DESCRIPTION_HEADING_HERE"
                                        }
                                    }
                                ],
                                "color": "red"
                            }
                        },
                        {
                            "object": "block",
                            "paragraph": {
                                "rich_text": [
                                    {
                                        "text": {
                                            "content": "DESCRIPTION_HERE"
                                        }
                                    }
                                ],
                                "color": "pink"
                            }
                        }
                    ]
                }).catch((err) => {
                    this.EraserTail.log("Debug", err)
                    successful = false
                })
                if (!successful) return null;
                // Mappings of properties from Notion to result.
                /*
                    raw.properties["PROPERTY"].rich_text[0]?.plain_text
                    raw.properties["PROPERTY"].title[0]?.plain_text
                    raw.properties["PROPERTY"].date?.start
                    raw.properties["PROPERTY"].checkbox
                    raw.properties["PROPERTY"].formula.<any of the above>
                */
                return {
                    EXAMPLE: "YIP YIP!"
                }
            },

        }
}

