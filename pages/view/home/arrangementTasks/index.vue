<template>
	<!-- 布置任务 -->
	<view class="arrangementTasksBox">
		<view class="tasksHeadBox">
			<!-- 顶部 -->
			<view class="tasksBoxHead">
				<!-- 返回按钮 -->
				<view class="arrow" @tap="goBack"></view>
				<!-- 标题 -->
				<view class="title">布置任务</view>
			</view>
			<!-- tab -->
			<view class="lesson">
				<!-- 按课程选择 -->
				<view class="byCourse mr" @tap="show='course'" :class="show=='course'?'byCourseBorder':''">
					<image class="byCoursePic" src="../../../../static/images/lesson.png" mode=""></image>
					<label class="byCourseTxt" for="">按课程选择</label>
				</view>
				<!-- 按字母选择 -->
				<view class="byCourse" @tap="show='word'" :class="show=='word'?'byCourseBorder':''">
					<image class="byCoursePic" src="../../../../static/images/zimu.png" mode=""></image>
					<label class="byCourseTxt" for="">按字母选择</label>
				</view>
			</view>

		</view>
		<!-- 内容 -->
		<view class="contentBox">
			<!-- 按课程 -->
			<byCourse @sendCwords='getCwords()' @sendFlag='getFlag()' :fSendWords='wordCount' :sendFlaf='checkAllCourse' v-if="show=='course'" ref="allcourse"></byCourse>
			<!-- 按字母 -->
			<buLetter @sendFlwords='getLwords()' :fSendWords='wordCount' v-if="show=='word'"></buLetter>
		</view>
		<!-- 底部全选 -->
		<view class="allCheck">
			<!-- <label class="radio"> -->
			<!-- <checkbox  color="#FFBB00" style="transform:scale(1)" @tap="checkAll=!checkAll" :checked="checkAll"/>全选 -->
			<!-- 按课程全选 -->
			<van-checkbox v-if="show=='course'"  @click.native="getSelectAllCourse()"  class="radio" :value="checkAllCourse" @change="selectAllCourse()"  checked-color="#FFBB00">全选</van-checkbox>
			<!-- 按字母全选 -->
			<van-checkbox v-if="show=='word'" class="radio" :value="checkAllWord" @change="selectAllWord()" checked-color="#FFBB00">全选</van-checkbox>
			<!-- </label> -->
			<!-- <label v-if="wordCount!=0" url='/pages/view/home/arrangementTasks/checkSelected' class="lookCheck">
				查看已选（{{wordCount}}）
			</label> -->
			<label @click="linkTo()" class="lookCheck lookActive">
				查看已选（{{wordCount.length}}）
			</label>
		</view>
	</view>
</template>

<script>
	import byCourse from '../../../component/byCourse/index.vue'
	import buLetter from '../../../component/byLetter/index.vue'

	export default {
		data() {
			return {
				show: 'course',
				checkAllCourse: false,
				checkAllWord: false,
				wordCount: []
			}
		},
		components: {
			byCourse,
			buLetter
		},
		methods: {
			// 查看已选单词跳转
			linkTo() {
				uni.navigateTo({
					url: '/pages/view/home/arrangementTasks/checkSelected?selectWords=' + encodeURIComponent(JSON.stringify(this.wordCount)),
				})
			},
			// 获取按课程传过来的数据
			getCwords(data) {
				// console.log(data)
				this.wordCount = data
			},
			// 获取按字母传过来的值
			getLwords(data) {
				console.log(data)
				this.wordCount = data
			},

			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 课程全选
			selectAllCourse(event) {
				// console.log(event.detail)
				this.checkAllCourse = event.detail
				// this.getSelectAllCourse()
			},
			getSelectAllCourse(){
				this.$refs.allcourse.onChange()
			},
			// 字母全选
			selectAllWord(event) {
				// console.log(event.detail)
				this.checkAllWord = event.detail
			},
			// 获取全选按钮状态
			getFlag(data){
				console.log(data)
				this.checkAllCourse=data
			}

		},
		created() {
			// uni.getStorage({
			// 	key: 'selectedWords',
			// 	success: (data) => {
			// 		console.log(data)
			// 		this.wordCount = data.data.length
			// 		// data.data.forEach(val => {
			// 		// 	this.result.push(val.wordId.toString())
			// 		// })
			// 		// console.log(this.result)
			// 	}
			// });
		}
	}
</script>

<style lang="scss">
	.arrangementTasksBox {
		.tasksHeadBox {
			position: fixed;
			top: 0;
			z-index: 101;
			background-color: #FBFBFB;
			width: 100%;
		}

		// 顶部
		.tasksBoxHead {
			width: 100%;
			height: 128rpx;
			background: rgba(255, 255, 255, 1);
			opacity: 1;
			text-align: center;
			overflow: hidden;
			position: relative;

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

		// tab
		.lesson {
			padding: 0 32rpx;
			box-sizing: border-box;
			margin-top: 24rpx;
			overflow: hidden;
			margin-bottom: 24rpx;

			.mr {
				margin-right: 31rpx;
			}

			.byCourseBorder {
				border: 2px solid rgba(255, 187, 0, 0.30196078431372547);
				box-shadow: 0px 6rpx 12rpx rgba(255, 187, 0, 0.1);
			}

			.byCourse {
				width: 320rpx;
				height: 112rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 6rpx 12rpx rgba(201, 201, 201, 0.15);
				opacity: 1;
				border-radius: 16px;
				line-height: 112rpx;
				text-align: center;
				float: left;

				.byCoursePic {
					width: 54rpx;
					height: 56rpx;
					vertical-align: middle;
					margin-right: 12rpx;
				}

				.byCourseTxt {
					font-size: 32rpx;
					font-weight: bold;
					color: rgba(46, 53, 72, 1);
				}
			}
		}

		// 内容
		.contentBox {
			margin-top: 24rpx;
		}

		// 底部
		.allCheck {
			padding: 0 32rpx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 112rpx;
			background: #FFFFFF;
			box-shadow: 0px -6rpx 24rpx rgba(201, 201, 201, 1);
			opacity: 1;
			z-index: 100;

			.radio {
				line-height: 112rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(46, 53, 72, 1);
				margin-top: 40rpx;
				display: inline-block;
			}

			.lookCheck {
				display: inline-block;
				width: 456rpx;
				height: 84rpx;
				opacity: 1;
				border-radius: 44rpx;
				float: right;
				text-align: center;
				font-size: 32rpx;
				font-weight: 400;
				line-height: 84rpx;
				opacity: 1;
				margin-top: 14rpx;
				background-color: #EFEFF1;
				color: #979DAB;

			}

			.lookActive {
				background: rgba(255, 187, 0, 1);
				color: rgba(255, 255, 255, 1);
			}
		}

	}
</style>
