import { randomID } from "../utilities/index";

export default class User {
	constructor(a) {
		this.id = randomID();
		this.name = a.name;
		// this.password = a.password;
		this.email = a.email;
		this.postIDs = [];
		this.createdTime = Date.now();
		this.personal = {};
		this.friends = [];
		this.imgURL = a.imgURL;
		this.status = a.status;
		this.hideList = [];
		this.blockedUser = [];
	}
}
