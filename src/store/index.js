import Vue from "vue";
import Vuex from "vuex";

import postView from "./postView.module";
import newPost from "./newPost.module";
import postComment from "./postComment.module";
import auth from "./auth.module";
import chat from "./chat.module";
import userProfile from "./userProfile.module";
import profile from "./profile.module";

Vue.use(Vuex);

export const store = new Vuex.Store({
	modules: {
		postView,
		newPost,
		postComment,
		auth,
		chat,
		userProfile,
		profile
	}
});
