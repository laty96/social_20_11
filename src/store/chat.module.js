import db from "../database/firestore";
import firebase from "firebase";
import { storageRef } from "../database/firestore";
import query from "../database/db.actions";
import {
	CREATE_CONVERSATION,
	GET_CONVERSATION,
	SEND_MESSAGE,
	CLOSE_CHAT,
	GET_CHAT_LIST,
	CHAT_NOTIFY_READ,
	SWAP_CHATROOM,
	UPLOAD_IMAGE_TO_CHAT,
	REMOVE_UPLOAD_IMAGE,
	FILE_UPLOAD,
	REMOVE_UPLOAD_FILE
} from "./actions.type";
import converModel from "../models/conversation.model";
import chatModel from "../models/chat.model";
import { createNotify } from "../utilities";

import Vue from "vue";

var state = {
	conversations: [],
	unsub: [],
	chat1: {},
	chat2: {},
	chat3: {},
	chat4: {},
	chatList: [],
	images: {},
	files: {},
	imageCount: 0,
	fileCount: 0
};
var getters = {
	getConver() {
		return state.conversations;
	}
};
var mutations = {
	setChat(state, data) {
		// state.conversations = data.doc[0];
		// state.unsub = data.unsub;
		let index = null;
		// if (state.conversations.length == 4) {
		// 	state.conversations.forEach((conver, i) => {
		// 		if (conver.id == data.doc[0].id) {
		// 			index = i;
		// 		}
		// 	});
		// 	if (index) {
		// 		Vue.set(state.conversations, index, data.doc[0]);
		// 		// state.conversations[index] = data.doc[0];
		// 		state.unsub[index] = data.unsub;
		// 	} else {
		// 		state.conversations.pop();
		// 		state.conversations.push(data.doc[0]);
		// 		state.unsub.push(data.unsub);
		// 	}
		// } else
		if (state.conversations[0] != undefined) {
			state.conversations.forEach((conver, i) => {
				if (conver.id == data.doc[0].id) {
					index = i;
				}
			});
			if (index !== null) {
				Vue.set(state.conversations, index, data.doc[0]);
				// state.conversations[index] = data.doc[0];
				state.unsub[index] = data.unsub;
			} else {
				state.conversations.push(data.doc[0]);
				state.unsub.push(data.unsub);
			}
		} else {
			state.conversations.push(data.doc[0]);
			state.unsub.push(data.unsub);
		}
		console.log(state.conversations);
	},
	addChat(state, data) {
		// state.conversations[data.index] = data.doc[0];
	},
	closeChat(state, k) {
		state.conversations.splice(k, 1);
		// state.conversations = null;
		state.unsub.splice(k, 1);
	},
	setChatList(state, data) {
		console.log(data.doc);
		if (JSON.stringify(state.chatList) != JSON.stringify(data.doc)) {
			data.doc.forEach(n => {
				if (!document.hasFocus() && n.hasNew && n.ownerId != data._id) {
					let text = n.isNotified + ": " + n.content[n.content.length - 1].message;
					createNotify(
						{
							body: text,
							icon: n.content[n.content.length - 1].userImg
						},
						n.isNotified + " send you a message"
					);
				}
			});
			state.chatList = data.doc;
		}
	},
	swapChatroom(state, data) {
		let a = state.conversations[state.conversations.length - data.limit];
		Vue.set(state.conversations, state.conversations.length - 1, state.conversations[data.i]);
		Vue.set(state.conversations, data.i, a);

		let b = state.unsub[state.unsub.length - data.limit];
		Vue.set(state.unsub, state.unsub.length - 1, state.unsub[data.i]);
		Vue.set(state.unsub, data.i, b);
	},
	//images
	setUploadImage(state, data) {
		state.images[data.id].push(data.url);
		state.imageCount++;
		console.log(state.images);
	},
	removeUploadImage(state, data) {
		if (data.amount == 1) {
			state.images[data.id].splice(data.index, 1);
		}
		if (data.amount == 0) {
			state.imageCount = 0;
			state.images[data.id].splice(0, state.images[data.id].length);
		}
	},
	setImageHolder(state, id) {
		console.log(!state.images[id]);
		if (!state.images[id]) Vue.set(state.images, id, []);
	},
	// files
	setUploadFile(state, data) {
		state.files[data.id].push({ url: data.url, name: data.name });
		state.fileCount++;
		console.log(state.files);
	},
	removeUploadFile(state, data) {
		if (data.amount == 1) {
			state.files[data.id].splice(data.index, 1);
		}
		if (data.amount == 0) {
			state.fileCount = 0;
			state.files[data.id].splice(0, state.files[data.id].length);
		}
	},
	setFileHolder(state, id) {
		console.log(!state.files[id]);
		if (!state.files[id]) Vue.set(state.files, id, []);
	}
};
var actions = {
	[CREATE_CONVERSATION](c, i) {
		console.log(i);
		let conver = new converModel({
			members: [i.u.id, i.userInfo.id],
			membersName: [i.u.name, i.userInfo.name],
			membersEmail: [i.u.email, i.userInfo.email],
			membersImg: [i.u.imgURL, i.userInfo.imgURL]
		});
		query.createConversation(
			db,
			conver,
			doc => {
				console.log(doc);
				c.dispatch(GET_CONVERSATION, i.userInfo.id + i.u.id);
			},
			err => console.log(err)
		);
	},
	[GET_CONVERSATION](c, i) {
		query.getConversation(
			db,
			i,
			(doc, unsub) => {
				console.log(doc);
				c.commit("setChat", { doc, unsub });
			},
			(doc, index) => {
				console.log(doc, index);
				// c.commit("addChat", { doc, index });
			}
		);
	},
	[SEND_MESSAGE](c, mes) {
		console.log("mes", mes);
		let a = new chatModel(mes);
		query.sendMessage(db, mes._id, a, doc => {
			// console.log(a);
			c.state.this.$forceUpdate();
		});
		query.notifyChat(db, mes._id, a.owner);
	},
	[GET_CHAT_LIST](c, user) {
		query.getChatList(db, user.id, doc => {
			console.log(doc);
			c.commit("setChatList", { doc, id: user._id });
		});
	},
	[CLOSE_CHAT](c, k) {
		c.commit("closeChat", k);
	},
	[CHAT_NOTIFY_READ](c, id) {
		query.notifyChatRead(db, id);
	},
	[SWAP_CHATROOM](c, data) {
		c.commit("swapChatroom", data);
	},
	[UPLOAD_IMAGE_TO_CHAT](c, data) {
		c.commit("setImageHolder", data.id);
		let uploadTask = storageRef.child(data.path).put(data.file);
		uploadTask.on(
			"state_changed",
			function(snapshot) {
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log("Upload is paused");
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log("Upload is running");
						break;
				}
			},
			function(error) {
				console.log(error);
			},
			function() {
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					c.commit("setUploadImage", {
						url: downloadURL,
						id: data.id
					});
				});
			}
		);
	},
	[REMOVE_UPLOAD_IMAGE](c, data) {
		if (data.amount == 1) {
			let desertRef = storageRef.child(data.path);
			desertRef
				.delete()
				.then(function() {
					c.commit("removeUploadImage", {
						amount: 1,
						index: data.index,
						id: data.id
					});
				})
				.catch(e => console.log(e));
		}
		if (data.amount == 0) {
			c.commit("removeUploadImage", {
				amount: 0,
				id: data.id
			});
		}
	},
	[FILE_UPLOAD](c, data) {
		c.commit("setFileHolder", data.id);
		let uploadTask = storageRef.child(data.path).put(data.file);
		uploadTask.on(
			"state_changed",
			function(snapshot) {
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log("Upload is paused");
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log("Upload is running");
						break;
				}
			},
			function(error) {
				console.log(error);
			},
			function() {
				uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
					c.commit("setUploadFile", {
						url: downloadURL,
						id: data.id,
						name: data.file.name
					});
				});
			}
		);
	},
	[REMOVE_UPLOAD_FILE](c, data) {
		if (data.amount == 1) {
			let desertRef = storageRef.child(data.path);
			desertRef
				.delete()
				.then(function() {
					c.commit("removeUploadFile", {
						amount: 1,
						index: data.index,
						id: data.id
					});
				})
				.catch(e => console.log(e));
		}
		if (data.amount == 0) {
			c.commit("removeUploadFile", {
				amount: 0,
				id: data.id
			});
		}
	}
};

var plugins = {};

export default {
	state,
	getters,
	mutations,
	actions,
	plugins
};
