export declare namespace Cs {
	interface Content {
		type: "text" | "image" | "voice" | "video" | "file" | "link" | "location" | "emoji";
		data: string;
	}

	interface Msg extends Eps.CsMsgEntity {
		content: Content;
		sessionId?: number;
	}

	interface Session extends Eps.CsSessionEntity {}
}
