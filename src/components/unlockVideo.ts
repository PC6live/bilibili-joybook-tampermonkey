// 解除非会员点击切换画质限制
export function unlockVideo() {
	document.addEventListener("readystatechange", () => {
		const vip_info_iterator = document.evaluate(
			"//script[contains(., 'vip_info')]",
			document,
			null,
			XPathResult.ANY_TYPE,
			null
		);
		try {
			let node = vip_info_iterator.iterateNext();

			while (node) {
				if (node && node.textContent) {
					const vipStatusReg = new RegExp(/"vip_status.*?,/g);
					const vipTypeReg = new RegExp(/"vip_type.*?,/g);
					const vipInfoReg = new RegExp(/"vip_info.*?\}/g);

					const vipInfo = `"vip_info":{"is_vip":true,"due_date":0,"status":1,"type":2}`;
					const vipStatus = `"vip_status":1,`;
					const vipType = `"vip_type":2,`;

					node.textContent = node.textContent.replace(vipStatusReg, vipStatus);
					node.textContent = node.textContent.replace(vipTypeReg, vipType);
					node.textContent = node.textContent.replace(vipInfoReg, vipInfo);
				}

				node = vip_info_iterator.iterateNext();
			}
		} catch (e) {
			console.log("Error: Document tree modified during iteration " + e);
		}
	});
}
