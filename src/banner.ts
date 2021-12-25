import path from "path";
import pkg from "../package.json";

type TField = string | string[] | boolean | undefined;

interface IHeaderObject {
	name?: string;

	namespace?: string;

	version?: string;

	author?: string;

	description?: string;

	homepage?: string;
	homepageURL?: string;
	website?: string;
	source?: string;

	icon?: string;
	iconURL?: string;
	defaulticon?: string;

	icon64?: string;
	icon64URL?: string;

	updateURL?: string;

	downloadURL?: string | "none";
	installURL?: string;

	supportURL?: string;

	include?: string | string[];

	match?: string | string[];

	exclude?: string | string[];

	require?: string | string[];

	resource?: string | string[];

	connect?: string | string[];

	"run-at"?: "document-start" | "document-body" | "document-end" | "document-idle" | "context-menu";

	grant?: string | string[] | "none";

	webRequest?: string;

	noframes?: boolean;

	unwrap?: boolean;

	nocompat?: boolean | string;

	[field: string]: TField; // For any other field not listed above.;
}

const config: IHeaderObject = {
	name: "bilibili-joybook",
	version: "0.0.7",
	description: "共享大会员",
	author: "PC6live",
	include: "*://*.bilibili.com/*",
	exclude: "*://passport.bilibili.com/*",
	homepage: "https://github.com/PC6live/joybook-tampermonkey",
	supportURL: "https://github.com/PC6live/joybook-tampermonkey/issue",
	grant: [
		"GM_cookie",
		"GM_setValue",
		"GM_getValue",
		"GM_addStyle",
		"GM_deleteValue",
		"GM_getTab",
		"GM_getTabs",
		"GM_listValues",
		"GM_saveTab",
		"unsafeWindow",
	],
	"run-at": "document-start",
	noframes: true,
};

const convertToComment = (header: IHeaderObject): string => {
	// 开始
	let comment = "// ==UserScript==\n";

	const append = (key: string, value: TField): string => {
		let text = "";
		text += `// @${key}`;
		text = text.padEnd(18);
		text += `${value}\n`;
		return text;
	};

	Object.keys(header).forEach((headerKey) => {
		const headerValue = header[headerKey];

		if (headerValue instanceof Array) {
			headerValue.forEach((headerItem) => {
				comment += append(headerKey, headerItem);
			});
		} else {
			comment += append(headerKey, header[headerKey]);
		}
	});

  // dev测试文件路径
  if (process.env.NODE_ENV === "development") {
    const filePath = path.resolve(__dirname, pkg.main)
    comment += append("require", filePath);
  }

	// 结束
	comment += "// ==/UserScript==";

	return comment;
};

export const banner = convertToComment(config);

