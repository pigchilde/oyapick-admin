import Ding from "/$/cs/static/audio/ding.wav";
import type { Cs } from "../types";
import { ElNotification } from "element-plus";
import { getEmoji } from "../utils";
import { useSession } from "./session";

export function useNotice() {
	const session = useSession();

	// ding
	const audio = new Audio(Ding);

	// 消息提示
	function create({ content, user, sessionId }: Cs.Msg, { open }: { open: () => Promise<void> }) {
		if (content) {
			const icon = <img src={user.avatarUrl} style={{ height: "32px", width: "32px" }} />;

			let message = content.data;

			switch (content.type) {
				case "image":
					message = "[图片]";
					break;

				case "voice":
					message = "[语音]";
					break;

				case "video":
					message = "[视频]";
					break;

				case "file":
					message = "[文件]";
					break;

				case "location":
					message = "[位置]";
					break;

				case "emoji":
					message = (
						<img src={getEmoji(message)} style={{ height: "22px", width: "22px" }} />
					);
					break;
			}

			ElNotification({
				title: user.nickName,
				message,
				icon,
				async onClick() {
					await open();

					// 切换会话
					session.setById(sessionId!);
				}
			});
		}

		// 播放声音
		audio?.play();
	}

	return {
		create
	};
}
