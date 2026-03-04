import type { Cs } from "../types";
import { defineStore } from "pinia";
import io, { type Socket } from "socket.io-client";
import { useSession } from "./session";
import { useBase } from "/$/base";
import { config } from "/@/config";
import { useMessage } from "./message";
import { useCool } from "/@/cool";

export const useSocket = defineStore("cs.socket", () => {
	const { mitt } = useCool();
	const { user } = useBase();
	const session = useSession();
	const message = useMessage();

	let client = undefined as Socket | undefined;

	function connect() {
		if (!user.token) {
			return false;
		}

		if (client) {
			client.disconnect();
			client = undefined;
		}

		if (!client) {
			client = io(config.host + "/cs", {
				transports: ["websocket", "polling"]
			});

			client.auth = {
				isAdmin: true,
				token: user.token
			};

			client.on("connect", () => {
				console.log("[cs] connect");
			});

			client.on("disconnect", () => {
				console.log("[cs] disconnect");
			});

			client.on("msg", (data: Cs.Msg) => {
				if ((data.type == 1 && data.userId != user.info?.id) || data.type == 0) {
					// 判断是否是当前会话
					if (data.sessionId == session.info?.id) {
						message.append({
							...data.user,
							...data
						});
					} else {
						// 设置其他会话信息
						session.list.forEach((e) => {
							if (e.id == data.sessionId) {
								if (!e.adminUnreadCount) {
									e.adminUnreadCount = 0;
								}

								e.adminUnreadCount += 1;
								e.lastMsg = data;
							}
						});
					}

					// 发送事件
					mitt.emit("cs.msg", data);
				}
			});
		}
	}

	function send(content: Cs.Content) {
		if (client) {
			// 发送事件
			client.emit("send", {
				sessionId: session.info?.id,
				content
			});

			// 追加消息
			message.append({ content });
		} else {
			console.log("[cs] client error");
		}
	}

	return {
		connect,
		client,
		send
	};
});
