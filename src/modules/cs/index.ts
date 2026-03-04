import { useMessage, useSession, useSocket } from "./hooks";

export function useCs() {
	const socket = useSocket();
	const message = useMessage();
	const session = useSession();

	return {
		socket,
		message,
		session
	};
}
