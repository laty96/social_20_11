<template>
  <div class="pt-3" :class="{'container': !isMobile}" id="main-page">
    <div :class="{'row': !isMobile}">
      <PageContent :userInfo="userInfo"/>
      <SideMenu />
    </div>
  </div>
</template>

<script>
import PageContent from "./PageContent";
import SideMenu from "./SideMenu";
import { isMobile } from '../utilities';
import { mapState } from 'vuex';
// import { GET_USER_LIST } from "../store/actions.type";

export default {
	name: "MainPage",
	components: {
		PageContent,
		SideMenu
	},
  data() {
		return {
			isMobile: isMobile.any() ? true : false
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.auth.userInfo
		})
	},
	// mounted() {
	// 	// if (this.user.email)
	// 		this.$store.dispatch(GET_USER_LIST, this.user);
	// }
};
</script>

<style>
</style>
