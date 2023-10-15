import { PNFXCommand } from "./Command";
// Import Commands
import { Ping } from "./commands/ping";
import { Random } from "./commands/random";

const Commands: PNFXCommand[] = []; 

/** 
 * Initializes all commands here. 
 * Change the boolean in the if statement to "enable" or "disable" them.
 * */ 

            if(true){ 
                Commands.push(new Ping())
            }

            if(true){ 
                Commands.push(new Random())
            }

export {Commands};