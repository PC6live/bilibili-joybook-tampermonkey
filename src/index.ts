import listener from "@/components/listener";
import avatar from "@/components/avator";
import unlockVideo from "@/components/unlockVideo";
import { initState } from "./components/state";
import "./styles/global.scss";

(async () => {
	console.log("run main");
	unlockVideo();
	listener();
	await initState();
	avatar();
})();
