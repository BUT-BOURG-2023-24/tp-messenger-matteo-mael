import Reaction from "../enum/Reaction";

export class ReactionHelper {
    public static setReaction (reaction: string): Reaction | null
    {
        switch (reaction) {
            case "HAPPY":
                return Reaction.HAPPY;
            case "SAD":
                return Reaction.SAD;
            case "THUMBSUP":
                return Reaction.THUMBSUP;
            case "THUMBSDOWN":
                return Reaction.THUMBSDOWN;
            case "LOVE":
                return Reaction.LOVE;
            default:
                return null;
        }
    }
}