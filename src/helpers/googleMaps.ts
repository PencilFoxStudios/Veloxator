
import {

    Client as DiscordClient,

} from "discord.js";
import { EraserTailClient } from "@pencilfoxstudios/erasertail";
import { Client as GoogleMapsClient } from "@googlemaps/google-maps-services-js";
import axios from "axios"
export default class GoogleMaps {
    public MapsClient: GoogleMapsClient;
    public SecondMapsClient: any;
    public ETClient: EraserTailClient;
    private Discord: DiscordClient;
    private GoogleMapsAPIKey: string;
    constructor(client: DiscordClient, EraserTail: EraserTailClient) {
        this.Discord = client;
        this.MapsClient = new GoogleMapsClient({});
        if (!process.env.GOOGLE_MAPS_TOKEN)
            EraserTail.log("Warn", "GOOGLE_MAPS_TOKEN environment variable is undefined! The Google Maps API will be unavailable.");
        this.GoogleMapsAPIKey = process.env.GOOGLE_MAPS_TOKEN ?? "";
        this.ETClient = EraserTail
    }

    coordinatesToURL(lat: number = 0, long: number = 0) {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=11&size=600x600&maptype=hybrid&markers=color:orange%7Clabel:Sighting%7C${lat},${long}&key=${this.GoogleMapsAPIKey}`; // &signature=YOUR_SIGNATURE
    }
    async coordinatesToBuffer(lat: number = 0, long: number = 0) {
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=11&size=600x600&maptype=hybrid&markers=color:orange%7Clabel:Sighting%7C${lat},${long}&key=${this.GoogleMapsAPIKey}`;
        this.ETClient.log("Debug", url)
        return axios.get(
            url,
            {
                responseType: 'arraybuffer'
            }
        ).then(response => Buffer.from(response.data, 'binary'))
    }
}
