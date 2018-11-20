import { randomID } from "../utilities/index";

export default class Comment {
	constructor(a) {
		this.commentID = randomID();
		this.owner = a.owner;
		this.ownerId = a.ownerId;
		this.createdTime = Date.now();
		this.like = [];
		this.content = a.content;
		this.reply = [];
		a.mentioned ? (this.mentioned = a.mentioned) : null;
		this.floor = a.floor ? a.floor : 0;
	}
}
