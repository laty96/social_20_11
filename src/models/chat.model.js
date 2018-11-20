export default class Conversation {
	constructor(a) {
		this.owner = a.owner;
		this.createdTime = Date.now();
		this.message = a.message;
		this.img = a.img || [];
		this.file = a.file || [];
		this.userImg = a.userImg;
		this.ownerId = a.ownerId;
	}
}
