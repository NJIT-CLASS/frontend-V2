import {SUCCESSFUL} from "../constants/NOTIFICATION_TYPES";

/**\
 * Creates A Notification object for the global notification system.
 */
export default function makeNotification (message, type=SUCCESSFUL, duration=8000) {
    return {
        message: message,
        type: type,
        duration: duration
    }
}