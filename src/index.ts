import listener from "@/components/listener";
import avator from "@/components/avator";
import "./styles/global";

const Main = (): void => {
	console.log("run main");
	avator();
	listener();
};

Main();
