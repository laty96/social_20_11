import Vue from "vue";
import router from "vue-router";
import { store } from "../store/index";
Vue.use(router);

export default new router({
	routes: [
		{
			name: "home",
			path: "/",
			component: () => import("@/components/MainPage")
		},
		{
			name: "login",
			path: "/login",
			component: () => import("@/components/Login"),
			beforeEnter: (to, from, next) => {
				let user = store.getters.userInfo.name;
				console.log(user);
				if (user) {
					next("/");
				} else {
					next();
				}
			}
		},
		{
			name: "friends-post",
			path: "/friends-posts/:name",
			component: () => import("@/components/FriendPost"),
			props: true
		},
		{
			name: "userProfile",
			path: "/user/:userId/:type",
			component: () => import("@/components/UserPostView"),
			props: true
		},
		{
			name: "post",
			path: "/posts/:postId/:title",
			component: () => import("@/components/ViewPost")
		},
		{
			name: "profile",
			path: "/profile",
			component: () => import("@/components/Profile"),
			beforeEnter: (to, from, next) => {
				let user = store.getters.userInfo.name;
				console.log(user);
				if (user) {
					next();
				} else {
					next("/");
				}
			}
		}
		// {
		//   name: 'home',
		//   path: '/',
		//   component: () => import("@/components/Login")
		// }
	]
});
