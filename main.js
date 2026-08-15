import { updatePrimary } from "./scripts/update-primary.js";
import { animate } from "./scripts/animate.js";
import "./scripts/event-handler.js";

updatePrimary();
requestAnimationFrame(animate);