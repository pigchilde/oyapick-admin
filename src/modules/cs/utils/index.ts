import dayjs from "dayjs";
import type { Cs } from "../types";

// 消息格式化
export function msgFormatter(msg: Cs.Msg) {
	if (!msg) {
		return "";
	}

	switch (msg.content.type) {
		case "text":
			return msg.content.data;

		case "emoji":
			return "【表情】";

		case "image":
			return "【图片】";

		case "link":
			return "【链接】";

		case "voice":
			return "【音频】";

		case "file":
			return "【文件】";

		case "video":
			return "【视频】";

		case "location":
			return "【定位】";
	}
}

// 日期格式化
export function dateFormatter(date?: Date) {
	const t = dayjs(date);

	// 在今天之前
	if (t.isBefore(dayjs().hour(0).minute(0).second(0))) {
		return t.format("YYYY-MM-DD HH:mm");
	} else {
		return t.format("HH:mm");
	}
}

// 表情链接
export function getEmoji(name: string) {
	return new URL(`../static/emoji/${name}`, import.meta.url).href;
}
