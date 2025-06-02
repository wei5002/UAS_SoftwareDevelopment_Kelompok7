import {web} from "./application/web.js";
import {logger} from "./application/logging.js";

web.listen(5001, () => {
    logger.info("App start");
});
