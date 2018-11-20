<template>
  <div class="container">
    <div class="row py-3">
      <UserPost :userId="userId" :type="type"/>
      <SideMenu />  
    </div>
  </div>
</template>

<script>
import SideMenu from "./SideMenu";
import UserPost from "./UserPost";

export default {
	name: "UserPostView",
	props: {
		type: "",
		userId: ""
	},
	components: {
		UserPost,
		SideMenu
	}
};
</script>

<style>
</style>
