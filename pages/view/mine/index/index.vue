<template>
	<view class="myIndexBOx">
		<!-- 顶部导航背景图 -->
		<image class='site-img' src="../../../../static/images/BJ.png" catchtap='navmap'></image>
		<view class="navTitle">我的</view>
		<!--用户信息  -->
		<navigator hover-class='none' url="../myInformation/index" class="userInfoBox">
			<image class="userPic" :src="userImg" mode=""></image>
			<view class="userText">
				<text class="userName">{{getUserInfoList.teacherRealname}}</text><br>
				<label class="userUni">{{getUserInfoList.schoolName}}&emsp;&emsp;&emsp;</label>
				<label class="userUni" style="margin-left: 20rpx;">{{getUserInfoList.teacherNum}}</label>
			</view>
		</navigator>
		<!-- 内容 -->
		<view class="conBox">
			<navigator hover-class='none' url="../classManagement/index" class="classManagement">
				<view class="conTitle">班级管理</view>
				<view class="conIdes">管理班级，学生</view>
			</navigator>
			<navigator hover-class='none' url="../approvalStudents/index" class="examinationStu">
				<view class="conTitle">审批学生</view>
				<view class="conIdes">审核学生信息</view>
			</navigator>
			<!-- 推退出登录 -->
			<view class="loginOutBox">
				<label class="loginOut"  @click="bindClick('1')" >退出登录</label>
			</view>
		</view>

		<!-- 退出登录弹出框 -->
		<neil-modal :show="show" @close="closeModal('1')" align="center" @confirm='confirm()' @cancel='cancel()' content="是否确定退出登录？">
		</neil-modal>
	</view>
</template>

<script>
	import neilModal from '@/components/neilModal/neil-modal.vue';
	export default {
		data() {
			return {
				show: false,
				getUserInfoList: []
			}
		},
		components: {
			neilModal
		},
		created() {
			// console.log(uni.getStorageSync('token'))
			// 没有登录则跳转到登录页面
			if (!uni.getStorageSync('token')) {
				// uni.redirectTo({
				// 	url: '../../../view/login/index'
				// });
			}
			this.getUserInfo()
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取用户信息
			getUserInfo() {
				this.$minApi.getUserInfo({}).then(data => {
					// console.log(data)
					this.getUserInfoList = data.data
					this.userImg="http://148.70.55.201:8089/backwordSystem"+data.data.teacherAvatar
					getApp().globalData.teacherId=data.data.teacherId
					getApp().globalData.studentName=data.data.studentName
				})
			},
			// 退出登录
			loginOut() {
				this.$minApi.loginOut({}).then(data => {
					// console.log(data)
					uni.clearStorageSync();
					uni.redirectTo({
						url: '../../../view/login/index'
					});
				})
			},
			bindClick(type) {
				// this[`show${type}`] = true
				this.show = true
			},
			closeModal(type) {
				// this[`show${type}`] = false
				this.show = false
			},
			confirm() {
				this.loginOut()
			},
			cancel() {
			}

		},
	}
</script>

<style lang="scss">
	.myIndexBOx {
		position: relative;

		// 顶部导航背景图
		.site-img {
			width: 100%;
			height: 454rpx;
		}

		.navTitle {
			width: 100%;
			position: absolute;
			text-align: center;
			top: 58rpx;
			font-size: 36rpx;
			font-weight: 800;
			color: rgba(255, 255, 255, 1);
		}

		// 用户信息
		.userInfoBox {
			position: absolute;
			overflow: hidden;
			top: 192rpx;

			.userPic {
				width: 96rpx;
				height: 96rpx;
				border: 6rpx solid rgba(255, 220, 122, 1);
				border-radius: 50%;
				opacity: 1;
				float: left;
				margin-left: 48rpx;
				background-color: #F1F1F1;
			}

			.userText {
				color: rgba(255, 255, 255, 1);
				float: left;
				margin-left: 32rpx;

				.userName {
					font-size: 36rpx;
					font-weight: bold;
				}

				.userUni {
					font-size: 24rpx;
					font-weight: 500;
				}
			}
		}

		// 内容
		.conBox {
			width: 100%;
			background: rgba(251, 251, 251, 1);
			border-radius: 20rpx 20rpx 0px 0px;
			padding-top: 50rpx;
			padding-left: 18rpx;
			box-sizing: border-box;
			position: absolute;
			top: 368rpx;
			left: 0;
			width: 100%;
			overflow: hidden;

			padding-bottom: 36rpx;

			.conTitle {
				font-size: 32rpx;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				margin-top: 66rpx;
			}

			.conIdes {

				font-size: 24rpx;
				font-weight: 300;
				color: rgba(255, 255, 255, 1);
				margin-top: 8rpx;
			}

			.classManagement {
				width: 100%;
				height: 236rpx;
				background-image: url('../../../../static/images/beijing.png');
				background-size: 100% 100%;
				padding-left: 54rpx;
				box-sizing: border-box;
				overflow: hidden;
			}

			.examinationStu {
				width: 100%;
				height: 236rpx;
				background-image: url('../../../../static/images/beijing2.png');
				padding-left: 54rpx;
				box-sizing: border-box;
				overflow: hidden;
				background-size: 100% 100%;
			}

			// 退出登录
			.loginOutBox {
				width: 100%;
				// background: rgba(255, 255, 255, 1);
				line-height: 108rpx;
				text-align: center;
				padding: 0 40rpx;
				box-sizing: border-box;
				// position: fixed;
				// bottom: 36rpx;
				margin-top: 214rpx;
				overflow: hidden;
				box-sizing: border-box;

				.loginOut {
					display: inline-block;
					height: 108rpx;
					width: 100%;
					background-color: #FFFFFF;
					font-size: 32rpx;
					font-weight: 400;
					border-radius: 20rpx;
					color: rgba(46, 53, 72, 1);
				}
			}
		}
	}
</style>
