<template>
  <div v-on:scroll="scrollA">
    <Navbar />
    <div class="router-view mt-5">
      <router-view></router-view>
    </div>
		<div v-show="false">
			<Login />
		</div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "../views/Navbar";
import Footer from "../views/Footer";
import Login from "../components/Login";

import {
	LOGIN_WITH_G,
	FETCH_POST_LIST,
	REMOVE_USER,
	GET_USER_LIST
} from "../store/actions.type";

import { mapGetters, mapState } from "vuex";

export default {
	name: "Home",
	components: {
		Navbar,
		Footer,
		Login
	},
	data() {
		return {
			lastFetch: 0,
			isHome: this.$route.path
		};
	},
	computed: mapState({
		post: state => state.postView.postList,
		userInfo: state => state.auth.userInfo,
		unsub: state => state.postView.unsub,
		limit: state => state.postView.limit
	}),
	mounted() {
		this.$store.dispatch(LOGIN_WITH_G);
		// this.$store.dispatch(GET_USER_LIST, this.userInfo);
	},
	watch: {
		$route() {
			if (this.$route.path != '/') 
				window.removeEventListener("scroll", this.scrollA);
		}
	},
	methods: {
		scrollA(e) {
			let now = Date.now();
			let d = this.post[this.post.length - 1].createdDate;
			// let top = document.scrollingElement.scrollTop;
			// let wheight = window.innerHeight;
			// let height = document.scrollingElement.scrollHeight;
			if (
				Math.ceil(document.documentElement.scrollTop + window.innerHeight) ==
					document.documentElement.offsetHeight &&
				now - this.lastFetch > 500
			) {
				// console.log(this.post);
				// this.userInfo.email
				// 	? (document.documentElement.scrollTop = 375)
				// 	: (document.documentElement.scrollTop = 0);
				this.lastFetch = now;
				this.unsub();
				this.$store.dispatch(FETCH_POST_LIST, {
					date: d,
					operator: "<",
					limit: +this.limit + 10
				});
				this.$forceUpdate();
			}
		},
		removeUser(e) {
			this.$store.dispatch(REMOVE_USER, this.userInfo);
		}
	},
	mounted() {
			window.addEventListener("scroll", this.scrollA);
		window.addEventListener("unload", this.removeUser);
	},
	destroyed() {
	}
};
</script>

<style>
html {
	scroll-behavior: smooth;
}
</style>
