import { UPLOAD_IMAGE } from "./actions.type";
import {} from "./mutations.type";
import firebase from "firebase";
import db from "../database/firestore";
import { storageRef } from "../database/firestore";
import query from "../database/db.actions";

var state = {};
var getters = {};
var mutations = {};
var actions = {
	[UPLOAD_IMAGE](c, data) {
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
					console.log("File available at", downloadURL);
					query.saveProfileImage(db, data.userId, downloadURL, data.type);
				});
			}
		);
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
