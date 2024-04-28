interface vipInfo {
	is_vip: boolean;
	due_date: number;
	status: number;
	type: number;
}

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production";
	}
}

declare function switchUser(): void;
