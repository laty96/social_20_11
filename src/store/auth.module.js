import {
	USER_LOGIN_G_AUTH,
	USER_LOGOUT_G_AUTH,
	REMOVE_USER,
	USER_ONLINE,
	GET_USER_LIST,
	LOGIN_WITH_G,
	ADD_FRIEND,
	UN_FRIEND,
	GET_ACTIVE_NOTIFICATION,
	GET_INACTIVE_NOTIFICATION,
	NOTIFY_READ,
	GET_CHAT_LIST,
	GET_FRIENDS_POST,
	FRIEND_REQUEST
} from "./actions.type";

import {
	SET_USER,
	UNSET_USER,
	SET_USER_LIST,
	SET_NOTIFY,
	SET_INACTIVE_NOTI
} from "./mutations.type";

import { createNotify, convertDate } from "../utilities/index";

import db from "../database/firestore";
import query from "../database/db.actions";

import router from "../router/index";

var state = {
	user: "",
	userInfo: {
		name: "",
		email: "",
		status: "",
		imgURL: ""
	},
	userList: [],
	notify: [],
	inactiveNoti: [],
	isPending: false,
	pendingRequests: []
};
var getters = {
	isSigned() {
		return JSON.parse(localStorage.getItem("signed"));
	},
	userInfo: state => state.userInfo,
	getUserList: state => state.userList,
	isPending: state => state.isPending
};
var mutations = {
	[SET_USER](state, u) {
		u.status = true;
		state.userInfo = u;
	},
	[UNSET_USER](state) {
		state.userInfo = {};
	},
	[SET_USER_LIST](state, u) {
		state.userList = u;
	},
	[SET_NOTIFY](state, noti) {
		state.notify = noti || [];
		noti.forEach(n => {
			let text = n.user + " " + n.content;
			createNotify(
				{
					body: text,
					icon: noti.imgURL
				},
				"Notice"
			);
		});
	},
	[SET_INACTIVE_NOTI](state, noti) {
		state.inactiveNoti = noti || [];
	},
	setPendingStatus(state, doc) {
		state.userList.forEach((u, i) => {
			if (u._id == doc.target) {
				state.userList[i].isPending = true;
			}
		});
		console.log(state.userList);
	},
	setRequestStatus(state, doc) {
		state.userList.forEach((u, i) => {
			if (u._id == doc.requester) {
				state.userList[i].isRequest = true;
			}
		});
	},
	unsetPendingStatus(state, doc) {
		state.userList.forEach((u, i) => {
			if (u._id == doc.u._id) {
				state.userList[i].isPending = false;
			}
		});
		console.log(state.userList);
	},
	unsetRequestStatus(state, doc) {
		state.userList.forEach((u, i) => {
			if (u._id == doc.userInfo._id) {
				state.userList[i].isRequest = false;
			}
		});
		console.log(state.userList);
	},
	setPendingRequest(state, doc) {
		state.pendingRequests = doc;
	}
};
var actions = {
	[USER_LOGIN_G_AUTH](c, u) {
		// if (this.isSigned) {
		//   return;
		// } else {
		let newUser = false;
		localStorage.setItem("signed", true);
		query.searchQuery(
			"users",
			"email",
			"==",
			u.email,
			db,
			doc => {
				if (!doc.length) {
					query.addUser(
						db,
						u,
						s => {
							let a = s;
							a.id = s.id;
							c.commit(SET_USER, a);
							newUser = true;
						},
						err => console.log("err: " + err)
					);
				} else {
					c.commit(SET_USER, doc[0]);
					c.dispatch(GET_ACTIVE_NOTIFICATION, doc[0]);
					c.dispatch(GET_INACTIVE_NOTIFICATION, doc[0]);
					c.dispatch(GET_CHAT_LIST, doc[0]);
					c.dispatch("GET_PENDING_REQUEST", doc[0]._id);
				}
			},
			err => console.log(err),
			"name"
		);
		if (newUser == false) c.dispatch(USER_ONLINE, u);
		c.dispatch(GET_USER_LIST, u);
		if (router.currentRoute.path == "/login") router.push("/");
		// }
	},
	[USER_LOGOUT_G_AUTH](c) {
		console.log(this.isSigned);
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(() => {
			window.location = "/";
			console.log("User signed out.");
			localStorage.setItem("signed", false);
			// if (this.isSigned) {
			// 	localStorage.setItem("signed", false);
			// } else {
			// 	return;
			// }
		});
	},
	[REMOVE_USER](c, u) {
		query.userOffline(db, u.email, () => {
			// c.commit(UNSET_USER);
			c.dispatch(USER_LOGOUT_G_AUTH);
		});
	},
	[USER_ONLINE](c, u) {
		query.userOnline(db, u.email);
	},
	[GET_USER_LIST](c, u) {
		query.getUserList(
			db,
			u,
			doc => {
				c.commit(SET_USER_LIST, doc);
			},
			err => console.log(err)
		);
	},
	[LOGIN_WITH_G](c) {
		gapi.signin2.render("my-signin2", {
			scope: "profile email",
			width: 240,
			height: 50,
			longtitle: true,
			theme: "dark",
			onsuccess: googleUser => {
				var profile = googleUser.getBasicProfile();
				let u = {
					name: profile.getName(),
					imgURL: profile.getImageUrl(),
					email: profile.getEmail(),
					status: true
				};
				c.dispatch(USER_LOGIN_G_AUTH, u);
			},
			onfailure: error => {
				console.log(error);
			}
		});
	},
	[ADD_FRIEND](c, u) {
		query.addFriend(db, "users", u, doc => {});
	},
	[UN_FRIEND](c, u) {
		query.unFriend(db, "users", u, doc => {});
	},
	[FRIEND_REQUEST](c, u) {
		db.collection("requests")
			.doc(u.userInfo._id + u.u._id)
			.set({
				requesterName: u.userInfo.name,
				requesterImg: u.userInfo.imgURL,
				requester: u.userInfo._id,
				requesterId: u.userInfo.id,
				targetId: u.u.id,
				target: u.u._id,
				pending: true
			});
		c.dispatch("GET_PENDING_STATUS", u);
	},
	CANCEL_REQUEST(c, u) {
		db.collection("requests")
			.doc(u.userInfo._id + u.u._id)
			.delete();
		c.commit("unsetPendingStatus", u);
	},
	DECLINE_REQUEST(c, u) {
		db.collection("requests")
			.doc(u.u._id + u.userInfo._id)
			.delete();
		c.commit("unsetRequestStatus", u);
	},
	ACCEPT_REQUEST(c, u) {
		query.acceptFriendRequest(db, u);
	},
	GET_PENDING_STATUS(c, u) {
		db.collection("requests")
			.doc(u.userInfo._id + u.u._id)
			.onSnapshot(doc => {
				if (doc.data() != undefined) c.commit("setPendingStatus", doc.data());
			});
		db.collection("requests")
			.doc(u.u._id + u.userInfo._id)
			.onSnapshot(doc => {
				if (doc.data() != undefined) c.commit("setRequestStatus", doc.data());
			});
	},
	GET_PENDING_REQUEST(c, u) {
		db.collection("requests")
			.where("target", "==", u)
			.onSnapshot(doc => {
				console.log(doc);
				let a = [];
				doc.forEach(d => {
					a.push(d.data());
				});
				c.commit("setPendingRequest", a);
			});
	},
	[GET_ACTIVE_NOTIFICATION](c, u) {
		console.log(u);
		query.getActiveNoti(
			db,
			u._id,
			doc => {
				c.commit(SET_NOTIFY, doc);
			},
			err => console.log(err)
		);
	},
	[GET_INACTIVE_NOTIFICATION](c, u) {
		query.getInactiveNoti(
			db,
			u._id,
			doc => {
				c.commit(SET_INACTIVE_NOTI, doc);
			},
			u.limit || 10
		);
	},
	[NOTIFY_READ](c, id) {
		query.notifyRead(db, id);
	}
	// [GET_FRIENDS_POST](c, i) {
	// 	console.log(i.friends);
	// 	query.getFriendPost(db, "users", i.friends, doc => {
	// 		if (doc.length) {
	// 			query.addFeed(db, "feed", doc, i.id, () => {
	// 				query.getFeed(db, 'feed', i.id, posts => {

	// 				})
	// 			});
	// 		}
	// 	});
	// }
};

var plugins = {};

export default {
	state,
	getters,
	mutations,
	actions,
	plugins
};
