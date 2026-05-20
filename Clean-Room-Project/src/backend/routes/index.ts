import { ServerRoute } from "@hapi/hapi";
import { userRoute } from "./userRoute";
import { authRoute } from "./authRoute";
import { customerRoute } from "./customerRoute";
import { projectRoute } from "./projectRoute";
import { roomRoute } from "./roomRoute";
import { zoneRoute } from "./zoneRoute";
import { resultRoute } from "./resultRoute";
import { inputRoute } from "./inputRoute";
import { screenRoute } from "./screenRoute";
import { airflowRoute } from "./airflowRoute";
import { boqRoute } from "./boqRoute";
import { profileRoute } from "./profileRoute";
import { exceloutputRoute } from "./excelRoute";

const applicationRoutes: ServerRoute[] = [
	...userRoute,
	...authRoute,
	...customerRoute,
	...projectRoute,
	...roomRoute,
	...zoneRoute,
	...resultRoute,
	...inputRoute,
	...screenRoute,
	...airflowRoute,
	...boqRoute,
	...profileRoute,
	...exceloutputRoute,
];

export default applicationRoutes;
