import readyEvents from "./ready.js";
import messageEvents from "./message.js";
import interactionEvents from "./interaction.js";

export default [...readyEvents, ...messageEvents, ...interactionEvents];
