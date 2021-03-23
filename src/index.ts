import listener from "@/components/listener";
import unlockVideo from "@/components/unlockVideo";
import { initState } from "@/components/state";
import settings from "@/components/settings";
import { isVideo } from "@/utils/helper";

if (isVideo()) {
	unlockVideo();
	listener();
}

initState();

window.addEventListener("load", () => {
	import("@/styles/global.scss");
	settings();
});
