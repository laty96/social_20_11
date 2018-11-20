import { randomID } from "../utilities/index";

export default class Conversation {
	constructor(a) {
		this.groupId = randomID();
		this.owner = a.members;
		this.createdTime = Date.now();
		this.content = [];
		this.membersId = [a.members[0] + a.members[1], a.members[1] + a.members[0]];
		this.membersName = a.membersName;
		this.membersEmail = a.membersEmail;
		this.membersImg = a.membersImg;
	}
}
