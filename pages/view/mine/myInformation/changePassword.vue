<template>
	<view class="pwdBox">
		<!-- 顶部 -->
		<view class="tasksBoxHead">
			<!-- 返回按钮 -->
			<view class="arrow" @tap="goBack"></view>
			<!-- 标题 -->
			<view class="title">修改密码</view>
		</view>
		<!-- 内容 -->
		<view class="pwdConBox">
			<view class="allBox">
				<view class="oldBox borderBto">
					<label class="pwdName ">旧密码</label>
					<!-- <input class="pwdInput" type="{{pwdTypeOld}}" placeholder="请填写旧密码" /> -->
					<input class="pwdInput" :password="isPwdOld" type="text" placeholder="请填写旧密码" v-model="oldPwd"></input>

					<view class="pwdEyeBox" @click="lookPwd(1)">
						<image class="open" :src="isPwdOld==true?'../../../../static/images/eye@2x.png':'../../../../static/images/@2x.png'"
						 mode=""></image>
					</view>
				</view>
				<view class="oldBox ">
					<label class="pwdName">新密码</label>
					<!-- <input class="pwdInput" type="{{pwdTypeNew}}" placeholder="请填写新密码" /> -->
					<input class="pwdInput" :password='isPwdNew' type="text" placeholder="请填写新密码" v-model="newPwd"></input>
					<view class="pwdEyeBox" @tap="lookPwd(2)">
						<image class="open" :src="isPwdNew==true?'../../../../static/images/eye@2x.png':'../../../../static/images/closeEye@2x.png'"
						 mode=""></image>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="explain">密码长度8-12位，需包含数字、字母、符号至少两种或以上元素</view>
			<!-- <view class="saveBtn" :class="showNew==true&&showOld==true?'activeSaveBtn':''">保存</view> -->

			<view v-if='oldPwd.length==0||newPwd.length==0' class="saveBtn">保存</view>
			<view v-if='oldPwd.length>0&&newPwd.length>0' class="saveBtn activeSaveBtn" @click="changePwd()">保存</view>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '../../../../wxcomponents/dist/toast/toast';
	export default {
		data() {
			return {
				pwdTypeOld: 'password',
				pwdTypeNew: 'password',
				isPwdOld: true,
				isPwdNew: true,
				oldPwd: '',
				newPwd: '',
				teacherPwd: '',
				userId: ''
			}
		},
		components: {

		},

		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 切换input框类型
			lookPwd(val) {
				// console.log(val)
				if (val == 1) {
					this.isPwdOld = !this.isPwdOld
					if (this.pwdTypeOld == 'password') {
						this.pwdTypeOld = 'text'
					} else if (this.pwdTypeOld == 'text') {
						this.pwdTypeOld = 'password'
					}
				}
				if (val == 2) {
					this.isPwdNew = !this.isPwdNew
					// console.log(this.isPwdNew, '111’')
					if (this.pwdTypeNew == 'password') {
						this.pwdTypeNew = 'text'
					} else if (this.pwdTypeNew == 'text') {
						this.pwdTypeNew = 'password'
					}
				}
			},
			// 获取用户信息
			getUserInfo() {
				this.$minApi.getUserInfo({}).then(data => {
					this.teacherPwd = data.data.teacherPwd
					this.userId = data.data.teacherId
					console.log(data.data.teacherPwd)
				})
			},
			// 修改密码
			changePwd() {
				// console.log(this.teacherPwd)
				// console.log(this.oldPwd)
				if (this.teacherPwd != this.oldPwd) {
					Toast('旧密码不正确')
					return
				}
				var reg = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{8,12}$/;
				if (!reg.test(this.newPwd)) {
					Toast('新密码格式不正确！')
					return
				} else {
					this.$minApi.updatePassword({
						newPassWord: this.newPwd,
						oldPassWord: this.oldPwd,
						userId: this.userId,
						userIdenty:"1"
					}).then(data => {
						console.log(data)
						// Toast('修改成功！')
					})
				}
			}
		},
		created() {
			this.getUserInfo()
		}
	}
</script>

<style lang="scss">
	.pwdBox {
		.tasksBoxHead {
			width: 100%;
			height: 128rpx;
			background: rgba(255, 255, 255, 1);
			opacity: 1;
			text-align: center;
			overflow: hidden;
			// position: fixed;
			// top: 0;
			// left: 0;
			z-index: 100;

			// 返回按钮
			.arrow {
				position: fixed;
				left: 40rpx;
				top: 73rpx;
				display: flex;
				width: 20rpx;
				height: 20rpx;
				border-left: 4rpx solid #000;
				border-top: 4rpx solid #000;
				transform: rotate(-45deg);
				z-index: 20;
			}

			// 标题
			.title {
				width: 100%;
				text-align: center;
				position: absolute;
				left: 0;
				top: 60rpx;
				font-size: 36rpx;
				font-weight: 800;
				opacity: 1;
				z-index: 15;
				color: rgba(35, 37, 42, 1);
			}
		}

		// 内容
		.pwdConBox {
			margin-top: 32rpx;

			.allBox {
				padding: 0 32rpx;
				background-color: #FFFFFF;
				box-sizing: border-box;

				.borderBto {
					border-bottom: 2rpx solid #EBEBEB;
				}

				.oldBox {
					width: 100%;
					height: 112rpx;
					background-color: #FFFFFF;
					position: relative;

					.pwdName {
						position: absolute;
						margin-top: 34rpx;
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(46, 53, 72, 1);
					}

					.pwdInput {
						width: 100%;
						height: 112rpx;
						background-color: #FFFFFF;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(201, 201, 201, 1);
						opacity: 1;
						padding-left: 128rpx;
						line-height: 112rpx;
						box-sizing: border-box;
					}

					.pwdEyeBox {
						position: absolute;
						right: 0;
						top: 34rpx;
						width: 44rpx;
						height: 44rpx;
						z-index: 20;

						.open {
							width: 44rpx;
							height: 44rpx;
						}

						.close {
							width: 44rpx;
							height: 44rpx;
						}
					}
				}

			}

			.explain {
				padding: 0 32rpx;
				box-sizing: border-box;
				width: 100%;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 40rpx;
				color: rgba(151, 157, 171, 1);
				opacity: 1;
				margin-top: 24rpx;
			}

			.saveBtn {
				width: 480rpx;
				height: 88rpx;
				background: rgba(217, 217, 217, 1);
				opacity: 1;
				border-radius: 60rpx;
				margin: 64rpx auto;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 88rpx;
				color: rgba(255, 255, 255, 1);
				opacity: 1;
				text-align: center;
			}

			.activeSaveBtn {
				background: linear-gradient(180deg, rgba(254, 201, 27, 1) 0%, rgba(255, 187, 0, 1) 100%);
			}
		}
	}
</style>
