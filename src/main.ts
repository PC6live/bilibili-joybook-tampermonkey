import "src/styles/global.scss";
import { message } from "./utils/helper";

async function main() {
	const components: Record<string, () => void> = import.meta.glob(
		"./components/*.ts",
		{
			eager: true,
			import: "default",
		}
	);
	for (const script of Object.values(components)) {
		script();
	}
	message("所有组件加载完成");
}

main();
