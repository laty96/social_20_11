<template>
  <div class="container pt-3">
    <div class="row">
      <FriendPostView :name="name"/>
      <SideMenu />
    </div>
  </div>
</template>

<script>
import FriendPostView from "./FriendPostView";
import SideMenu from "./SideMenu";

export default {
	name: "MainPage",
	components: {
		FriendPostView,
		SideMenu
	},
	props: ["name"]
};
</script>

<style>
</style>
