<template>
	<div class="mt-5 pt-2 row">
		<div
			class="container-fluid pt-5 bg-light mb-5 border-bottom"
			style="background-size: cover"
			:style="{
				backgroundImage:
					'url(' +
					(profileBanner != '' ? profileBanner : userInfo.profileBanner) +
					')'
			}"
		>
			<button class="close" @click="profileBanner = '';" v-if="profileBanner">
				&times;
			</button>
			<div class="container">
				<h3 class="font-weight-bold">
					<i class="fas fa-cogs"></i> User settings
				</h3>
				<ul class="container nav nav-tabs font-weight-bold">
					<li class="nav-item">
						<a
							class="nav-link border-0 active text-muted"
							data-toggle="tab"
							href="#home"
							>Profile</a
						>
					</li>
					<li class="nav-item">
						<a
							class="nav-link border-0 text-muted"
							data-toggle="tab"
							href="#menu1"
							>Block</a
						>
					</li>
					<li class="nav-item">
						<a
							class="nav-link border-0 text-muted"
							data-toggle="tab"
							href="#menu2"
							>Menu 2</a
						>
					</li>
				</ul>
			</div>
		</div>
		<div class="container">
			<div class="tab-content">
				<div class="tab-pane active" id="home">
					<div class="row">
						<div class="col-md-8">
							<code class="font-weight-bold">PROFILE INFORMATION</code>
							<hr />
							<div>
								<div class="form-group">
									<label for="usr">Username:</label>
									<small class="text-muted d-block"
										>Name show on posts and comments</small
									>
									<input
										type="text"
										class="form-control"
										id="usr"
										disabled
										v-model="userInfo.name"
									/>
								</div>
								<div class="form-group">
									<label for="email">Email:</label>
									<small class="text-muted d-block"
										>Email address use to login</small
									>
									<input
										type="text"
										class="form-control"
										id="email"
										disabled
										v-model="userInfo.email"
									/>
								</div>
								<div class="form-group">
									<label for="desc">Description:</label>
									<small class="text-muted d-block"
										>Description about yourself</small
									>
									<textarea
										type="text"
										class="form-control"
										id="desc"
										v-model="userInfo.desc"
										rows="5"
										placeholder="Write something..."
									></textarea>
								</div>
							</div>
							<code class="font-weight-bold">IMAGES</code>
							<hr />
							<p class="strong">Avatar and banner (Maximum: 5mb)</p>
							<h5 class="text-danger" v-if="warning" v-html="warning"></h5>
							<div class="row">
								<label
									class="bg-light rounded p-2 border col-md-3 m-2"
									id="avatarDropzone"
									@drop.prevent="dropImage($event, 'profileIcon');"
									@dragover.prevent
									@dragenter="dragEnter($event);"
									@dragleave="dragLeave($event);"
								>
									<div class="mx-auto" style="width: 45px; margin: 0 auto">
										<svg
											class=""
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g>
												<polygon
													fill="inherit"
													opacity="0"
													points="0.610673352 20 20.625 20 20.625 0 0.610673352 0"
												></polygon>
												<path
													d="M17.451,9.14823765 C17.03,5.40791696 13.8555,2.5 10,2.5 C6.1445,2.5 2.97,5.40791696 2.549,9.14823765 C1.0455,9.84024195 0,11.3551568 0,13.1173944 C0,15.531665 1.959,17.4892627 4.375,17.4892627 L7.8125,17.4892627 L7.8125,12.8051181 L5,12.8051181 C4.8735,12.8051181 4.7595,12.7291725 4.7115,12.6122563 C4.6625,12.49534 4.6895,12.3614359 4.779,12.272 L9.779,7.2755791 C9.901,7.15366643 10.099,7.15366643 10.221,7.2755791 L15.187,12.2375247 C15.2665,12.2944839 15.3185,12.3874173 15.3185,12.4928418 C15.3185,12.6652183 15.1785,12.8051181 15.006,12.8051181 L15,12.8051181 L12.1875,12.8051181 L12.1875,17.4892627 L15.625,17.4892627 C18.041,17.4892627 20,15.531665 20,13.1173944 C20,11.3551568 18.954,9.84024195 17.451,9.14823765"
													fill="inherit"
												></path>
											</g>
										</svg>
									</div>
									<div class="small text-center px-3">
										Drag and Drop or Upload Avatar Image
									</div>
									<div class="" style="display: none">
										<input
											name="profileIcon"
											type="file"
											accept="image/x-png,image/jpeg"
											@change="imageUpload($event);"
										/></div
								></label>
								<label
									class="bg-light rounded p-2 border col-md-6 m-2"
									id="bannerDropzone"
									name="profileBanner"
									@drop.prevent="dropImage($event, 'profileBanner');"
									@dragover.prevent
									@dragenter="dragEnter($event);"
									@dragleave="dragLeave($event);"
								>
									<div class="mx-auto" style="width: 45px; margin: 0 auto">
										<svg
											class=""
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g>
												<polygon
													fill="inherit"
													opacity="0"
													points="0.610673352 20 20.625 20 20.625 0 0.610673352 0"
												></polygon>
												<path
													d="M17.451,9.14823765 C17.03,5.40791696 13.8555,2.5 10,2.5 C6.1445,2.5 2.97,5.40791696 2.549,9.14823765 C1.0455,9.84024195 0,11.3551568 0,13.1173944 C0,15.531665 1.959,17.4892627 4.375,17.4892627 L7.8125,17.4892627 L7.8125,12.8051181 L5,12.8051181 C4.8735,12.8051181 4.7595,12.7291725 4.7115,12.6122563 C4.6625,12.49534 4.6895,12.3614359 4.779,12.272 L9.779,7.2755791 C9.901,7.15366643 10.099,7.15366643 10.221,7.2755791 L15.187,12.2375247 C15.2665,12.2944839 15.3185,12.3874173 15.3185,12.4928418 C15.3185,12.6652183 15.1785,12.8051181 15.006,12.8051181 L15,12.8051181 L12.1875,12.8051181 L12.1875,17.4892627 L15.625,17.4892627 C18.041,17.4892627 20,15.531665 20,13.1173944 C20,11.3551568 18.954,9.84024195 17.451,9.14823765"
													fill="inherit"
												></path>
											</g>
										</svg>
									</div>
									<div class="small text-center">
										Drag and Drop or Upload Banner Image
									</div>
									<div class="" style="display: none">
										<input
											name="profileBanner"
											type="file"
											accept="image/x-png,image/jpeg"
											@change="imageUpload($event);"
										/></div
								></label>
							</div>
							<hr />
							<div class="d-flex">
								<button
									class="ml-auto btn btn-outline-primary"
									@click="saveSettings();"
								>
									Save
								</button>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card">
								<div
									class="card-header bg-light border border-muted"
									style="background-size: cover;height: 115px"
									:style="{
										backgroundImage:
											'url(' +
											(profileBanner != ''
												? profileBanner
												: userInfo.profileBanner) +
											')'
									}"
								>
									<button
										class="close bg-white"
										title="Undo banner"
										@click="profileBanner = '';"
										v-if="profileBanner"
									>
										&times;
									</button>
									<div class="mt-4">
										<img
											:src="profileIcon"
											alt="newAva"
											class="rounded profile-icon"
											style="cursor: pointer"
											v-if="profileIcon"
											@click="profileIcon = '';"
											title="Undo avatar"
										/>
										<img
											:src="userInfo.imgURL"
											alt="ava"
											class="rounded profile-icon"
											v-else
										/>
									</div>
								</div>
								<div class="card-body d-flex">
									<h6 class="mr-auto">
										<code>Username</code>
										<h6 class="">{{ userInfo.name }}</h6>
									</h6>
									<h6 class="">
										<code>Join day</code>
										<h6 class="">
											{{ moment(userInfo.createdTime).format("LL") }}
										</h6>
									</h6>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane" id="menu1">
					<div class="row">
						<div>
							<ul class="list-group list-group-flush">
								<li
									class="list-group-item"
									v-post
									v-for="post in userInfo.hideList"
									:key="post"
								>
									{{ post }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import { UPLOAD_IMAGE } from "../store/actions.type";

export default {
	name: "Profile",
	data() {
		return {
			profileBanner: "",
			profileIcon: "",
			files: {},
			moment: moment,
			warning: ""
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.auth.userInfo
		})
	},
	methods: {
		imageUpload(e) {
			let files = e.target.files || e.dataTransfer.files;
			if (!files.length) return;
			this.setImage(files[0], e.target.name);
		},
		dropImage(e, name) {
			e.preventDefault();
			let files = e.dataTransfer.files;
			this.setImage(files[0], name);
			this.dragLeave(e);
		},
		dragEnter(e) {
			e.target.classList.add("border-dark");
		},
		dragLeave(e) {
			e.target.classList.remove("border-dark");
		},
		setImage(file, name) {
			if (file.size > 5242880) {
				this.warning = "Exceed size limit. Maximum 5mb image";
				return;
			} else {
				this.warning = "";
			}
			if (file.type != "image/jpeg" || file.type != "image/png") {
				this.warning =
					"File type must be <code>.jpg</code> or <code>.png</code>";
			}
			let reader = new FileReader();
			let vm = this;
			reader.onload = e => {
				vm[name] = e.target.result;
			};
			reader.readAsDataURL(file);
			this.files[name] = file;
		},
		saveSettings() {
			if (!this.userInfo._id) return;
			if (this.profileIcon) {
				this.$store.dispatch(UPLOAD_IMAGE, {
					file: this.files.profileIcon,
					path:
						this.userInfo._id +
						"/profileIcon." +
						this.files.profileIcon.name.split(".").pop(),
					userId: this.userInfo.id,
					type: "imgURL"
				});
			}
			if (this.profileBanner) {
				this.$store.dispatch(UPLOAD_IMAGE, {
					file: this.files.profileBanner,
					path:
						this.userInfo._id +
						"/profileBanner." +
						this.files.profileBanner.name.split(".").pop(),
					userId: this.userInfo.id,
					type: "profileBanner"
				});
			}
		}
	},
	beforeCreate() {
		console.log(Date.now());
	},
	mounted() {
		console.log(Date.now());
	}
};
</script>

<style scoped>
.nav-link.active {
	border-bottom: 5px solid var(--blue) !important;
	box-sizing: border-box;
	color: var(--dark) !important;
}

.profile-icon {
	position: absolute;
	height: 100px;
	border: 3px solid white;
}
.close.rounded-circle.bg-white {
	height: 17px;
	width: 17px;
	line-height: 17px;
}
</style>
