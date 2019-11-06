<template>
	<view class="classBox">
		<!-- 顶部 -->
		<view class="tasksHeadBox">
			<view class="tasksBoxHead">
				<!-- 返回按钮 -->
				<view class="arrow" @tap="goBack"></view>
				<!-- 标题 -->
				<view class="title">班级管理</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="classConBox">
			<view class="classCon" v-for="item in classLists" :key='item.classId'>
				<view class="classConLeft">
					<view class="className">{{item.className}}</view>
					<view class="grade">年级：{{item.classYear}}级</view>
					<view class="grade">学生数量：{{item.studentInfo.length}}个</view>
				</view>
				<label @click="linkTo(item.classId,item.className,item.classYear)" class="classConright">
					查看详情
				</label>
			</view>
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				classLists: []
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
			// 查看详情页面跳转
			linkTo(classId,className,classYear) {
				uni.navigateTo({
					url: 'seeDetails?classId=' + classId+'&className='+className+'&classYear='+classYear
				})
			},
			// 获取当前用户管理的班级列表
			classList() {
				this.$minApi.classList({}).then(data => {
					console.log(data)
					this.classLists = data.data
				})
			}
		},
		created() {
			this.classList()
		},
		onShow() {
			this.classList()
		}
	}
</script>

<style lang="scss">
	.classBox {
		position: relative;

		// 顶部
		.tasksHeadBox {
			// position: fixed;
			top: 0;
			z-index: 100;
			background-color: #FBFBFB;

			.tasksBoxHead {
				width: 100%;
				height: 128rpx;
				background: rgba(255, 255, 255, 1);
				opacity: 1;
				text-align: center;
				overflow: hidden;
				position: fixed;
				top: 0;
				left: 0;
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

		}

		// 内容
		.classConBox {
			margin-top: 128rpx;
			overflow: hidden;
			padding: 0 40rpx;
			box-sizing: border-box;

			.classCon {
				margin-top: 48rpx;
				background-color: #FFFFFF;
				padding: 40rpx;
				box-sizing: border-box;
				width: 100%;
				height: 220rpx;
				border-radius: 16rpx;

				.classConLeft {
					float: left;

					.className {
						font-size: 32rpx;
						font-weight: bold;
						color: rgba(46, 53, 72, 1);
					}

					.grade {
						font-size: 24rpx;
						font-weight: 400;
						color: rgba(151, 157, 171, 1);
						margin-top: 16rpx;
					}
				}

				.classConright {
					float: right;
					width: 136rpx;
					height: 56rpx;
					border: 2rpx solid rgba(255, 187, 0, 1);
					border-radius: 40rpx;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 56rpx;
					color: rgba(255, 187, 0, 1);
					text-align: center;
					margin-top: 42rpx;
				}
			}
		}
	}
</style>
