// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import { store } from "./store";
import router from "./router/index";
import VModal from "vue-js-modal";
import "./utilities/directives";
import "./utilities/filters";

Vue.use(VModal, { dynamic: true, injectModalsContainer: true, dialog: true });
Vue.config.productionTip = false;
// router.beforeEach((to, from, next) => {
// 	// console.log(store.state.userInfo);
// 	// next();
// 	if (store.state.userInfo) {
// 		next();
// 	} else {
// 		next({ path: "/login" });
// 	}
// });
/* eslint-disable no-new */
new Vue({
	el: "#app",
	components: { App },
	router,
	store,
	template: "<App/>"
});
