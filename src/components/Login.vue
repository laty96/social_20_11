<template>
	<div class="login-form container m-5">
		<div v-if="isHome != '/login'" class="align-content-center" style="text-align: center">
			<div id="loader-7">
				<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
				><span></span><span></span><span></span><span></span><span></span><span></span>
			</div>
		</div>
		<div class="row" v-show="isHome == '/login'">
			<form class="form-group col-md-4 offset-md-4 my-5"><div id="my-signin2" class="m-2 d-flex justify-content-center"></div></form>
		</div>
	</div>
</template>

<script>
import { REMOVE_USER, LOGIN_WITH_G } from "../store/actions.type";

export default {
	name: "Login",
	data() {
		return {
			isHome: this.$route.path
		};
	},
	watch: {
		$route() {
			this.isHome = this.$route.path;
		}
	},
	mounted() {
		this.$store.dispatch(LOGIN_WITH_G);
		this.isHome = this.$route.path;
		// gapi.signin2.render("my-signin2", {
		// 	scope: "profile email",
		// 	width: 240,
		// 	height: 50,
		// 	longtitle: true,
		// 	theme: "dark",
		// 	onsuccess: this.onSignIn,
		// 	onfailure: this.onFailure
		// });
		// googleLoginButton('my-signun2', gapi.signin2, this.onSignIn, this.onFailure)
	},
	computed: {
		userInfo() {
			return this.$store.getters.userInfo;
		}
	}
};
</script>

<style>
#loader-7 span {
	display: inline-block;
	height: 15px;
	width: 15px;
	background: #808080;
	border-radius: 0px;
}
#loader-7 span:nth-child(1) {
	-webkit-animation: temp 1s 0.05s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.05s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(2) {
	-webkit-animation: temp 1s 0.1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(3) {
	-webkit-animation: temp 1s 0.15s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.15s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(4) {
	-webkit-animation: temp 1s 0.2s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.2s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(5) {
	-webkit-animation: temp 1s 0.25s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.25s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(6) {
	-webkit-animation: temp 1s 0.3s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.3s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(7) {
	-webkit-animation: temp 1s 0.35s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.35s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(8) {
	-webkit-animation: temp 1s 0.4s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.4s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(9) {
	-webkit-animation: temp 1s 0.45s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.45s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(10) {
	-webkit-animation: temp 1s 0.5s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.5s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(11) {
	-webkit-animation: temp 1s 0.55s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.55s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(12) {
	-webkit-animation: temp 1s 0.6s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.6s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(13) {
	-webkit-animation: temp 1s 0.65s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.65s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(14) {
	-webkit-animation: temp 1s 0.7s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.7s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(15) {
	-webkit-animation: temp 1s 0.75s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.75s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(16) {
	-webkit-animation: temp 1s 0.8s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.8s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(17) {
	-webkit-animation: temp 1s 0.85s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.85s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(18) {
	-webkit-animation: temp 1s 0.9s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.9s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(19) {
	-webkit-animation: temp 1s 0.95s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.95s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(20) {
	-webkit-animation: temp 1s 1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
@keyframes temp {
	50% {
		-webkit-transform: scale(1, 5);
		transform: scale(1, 5);
		background: #195c53;
	}
}
</style>
