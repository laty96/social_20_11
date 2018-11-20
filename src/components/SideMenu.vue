<template>
	<div class="user-menu bg-light" v-if="userInfo.email" :style="{ right: isMobile ? '-100vw' : 0, width: isMobile ? '100vw' : '250px' }" id="userMenu">
		<div class="">
			<div class="card shadow-sm" style="{position: fixed;width: 20vw}">
				<!--
					<div class="card-header btn" data-toggle="collapse" data-target="#collapsibleSideMenu">
					    <i class="fas fa-chevron-down"></i>
					</div>
				-->
				<div class="card-content">
					<ul class="list-group list-group-flush">
						<li class="list-group-item dropdown list-group-item-action list-group-item-light" role="button" v-for="user in getUserList" :key="user.email">
							<div data-toggle="dropdown" @click="getPending(user);" class="m-0" aria-haspopup="true" aria-expanded="false">
								<img :src="user.imgURL" class="rounded-circle m-0" style="height: 2em" />
								<i class="fas fa-circle fa-xs border-white border rounded-circle" style="transform: translate(-100%, 90%)" :class="{ 'text-success': user.status }"></i>
								<a href="#" class="card-link"> {{ user.name }} </a> <small>{{ cvDate(user.lastLogedIn) }}</small>
							</div>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton" v-if="isLoading">
								<span> <i class="fas fa-spinner fa-spin text-center p-5 mx-3"></i> </span>
							</div>
							<div class="dropdown-menu" v-else>
								<a class="dropdown-item" href="javascript:void(0)" @click="openChat(user);">Chat</a>
								<a class="dropdown-item" href="javascript:void(0)" @click="declineRequest(user);" v-if="user.isRequest">Decline request</a>
								<a class="dropdown-item" href="javascript:void(0)" @click="cancelRequest(user);" v-else-if="user.isPending">Cancel friend request</a>
								<a class="dropdown-item" href="javascript:void(0)" @click="addFriend(user);" v-else-if="!user.isRequest && !user.isPending && userInfo.friends.indexOf(user.id) < 0">Add friend</a>
								<a class="dropdown-item" href="javascript:void(0)" @click="unFriend(user);" v-else>Unfriend</a>
								<router-link :to="'/user/' + user._id + '/posts'" class="dropdown-item">View posts</router-link>
								<router-link :to="'/user/' + user._id + '/liked'" class="dropdown-item">View liked post</router-link>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div v-for="(u, i) in userList" :key="i" v-if="userList.length - i <= limit()"><ChatForm :user="u" :index="i" v-on:closeChat="removeChat" :limit="limit" :isMobile="isMobile" /></div>
	</div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import ChatForm from "./ChatForm";

import { convertShortDate, isMobile, swipedetect } from "../utilities";
import { CREATE_CONVERSATION, ADD_FRIEND, UN_FRIEND, SWAP_CHATROOM } from "../store/actions.type";

export default {
	name: "SideMenu",
	components: {
		ChatForm
	},
	data() {
		return {
			userList: [],
			userIdList: [],
			isLoading: true,
			isMobile: isMobile.any() ? true : false,
			limit: () => {
				if (window.innerWidth > 720 && window.innerWidth < 970) return 2;
				else if (window.innerWidth > 970 && window.innerWidth < 1220) return 3;
				else if (window.innerWidth >= 1220) return 4;
				else return 1;
			}
		};
	},
	computed: {
		...mapGetters(["getUserList", "userInfo", "isPending"])
	},
	watch: {
		isPending(n) {
			console.log(n);
		},
		getUserList() {
			this.getUserList.forEach(u => {
				this.$store.dispatch("GET_PENDING_STATUS", {
					u,
					userInfo: this.userInfo
				});
			});
			console.log(this.getUserList);
		}
	},
	methods: {
		cvDate(d) {
			return convertShortDate(d, true);
		},
		openChat(u) {
			if (this.userList.filter(user => user.id == u.id).length) {
				let limit = this.limit();
				for (let i = 0; i < this.userList.length - limit; i++) {
					if (this.userList[i].id == u.id) {
						let a = this.userList[this.userList.length - limit];
						this.$set(this.userList, this.userList.length - 1, u);
						this.$set(this.userList, i, a);
						this.$store.dispatch(SWAP_CHATROOM, {
							i,
							limit
						});
						break;
					}
				}
			} else {
				this.userList.push(u);
			}
			// this.$store.dispatch(CREATE_CONVERSATION, {
			// 	u,
			// 	userInfo: this.userInfo
			// });
			// this.$forceUpdate();
			console.log(this.userList);
		},
		addFriend(u) {
			this.$store.dispatch("FRIEND_REQUEST", { u, userInfo: this.userInfo });
		},
		unFriend(u) {
			this.$store.dispatch(UN_FRIEND, { u, userInfo: this.userInfo });
		},
		cancelRequest(u) {
			this.$store.dispatch("CANCEL_REQUEST", { u, userInfo: this.userInfo });
			setTimeout(() => {
				this.$forceUpdate();
			}, 500);
			// console.log(this.getUserList)
		},
		declineRequest(u) {
			this.$store.dispatch("DECLINE_REQUEST", { u, userInfo: this.userInfo });
		},
		removeChat(e) {
			this.userList.splice(e, 1);
			// this.userList = null;
		},
		getPending(u) {
			this.$store.dispatch(CREATE_CONVERSATION, {
				u,
				userInfo: this.userInfo
			});
			this.isLoading = true;
			this.$store.dispatch("GET_PENDING_STATUS", {
				u,
				userInfo: this.userInfo
			});
			setTimeout(() => {
				this.isLoading = false;
			}, 500);
		}
	},
	mounted() {
		swipedetect(document.getElementById("app"), function(swipedir) {
			if (swipedir == "left") document.getElementById("userMenu").style.right = 0;
			if (swipedir == "right") document.getElementById("userMenu").style.right = "-100vw";
		});
	}
};
</script>

<style scoped>
.user-menu::-webkit-scrollbar {
	width: 10px;
}

.user-menu::-webkit-scrollbar-thumb {
	background: #666;
	border-radius: 20px;
}

.user-menu::-webkit-scrollbar-track {
	background: #ddd;
	border-radius: 20px;
}

.user-menu {
	top: 56px;
	position: fixed;
	z-index: 0;
	width: 250px;
	bottom: 0;
	// border: 1px solid #c0c0c0;
	transition: all 0.5s ease;
	overflow-y: auto;
	overflow-x: hidden;
}

.list-group-item.list-group-item-action.list-group-item-light {
	cursor: pointer;
}
</style>
