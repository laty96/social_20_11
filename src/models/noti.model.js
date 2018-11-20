import { randomID } from "../utilities/index";

export default class Noti {
	constructor(a) {
		this.id = randomID();
		this.createdTime = Date.now();
		this.user = a.user;
		this.userId = a.userId;
		this.userImg = a.userImg;
		this.ownerId = a.ownerId;
		if (a.type == 1) {
			this.content = "mentioned you.";
		}
		if (a.type == 2) {
			this.content = "replied your comment.";
		}
		if (a.type == 3) {
			this.content = "comment in your post.";
		}
		this.isActive = true;
		this.type = a.type;
		this.postId = a.postId;
		this.parentCmtID = a.parentCmtID;
		this.commentID = a.commentID;
	}
}
