<template>
	<view class="missionDetailsBox">
		<view class="headBox">
			<!-- 顶部背景图 -->
			<image class='site-img' src="../../../../static/images/BJ2.png" catchtap='navmap'></image>
			<!-- 返回按钮 -->
			<view class="arrow" @tap="goBack()"></view>
			<!-- 标题 -->
			<view class="title">任务详情</view>
			<!-- 任务词汇量 -->
			<view class="taskVocabulary">
				<!-- 左边--任务词汇量 -->
				<view class="taskLeft">
					<view class='taskTitle'>任务词汇量：<label class='yellowColor'>{{allWordCount}}个</label><label class="status" v-if="taskDetailsLists.taskIsStart!=1">未开始</label></view>
					<view class='taskTime'>{{taskTime}}</view>
				</view>
				<!-- 右边查看排名 -->
				<label class="viewBtn" @tap="linkToRanking()" v-if="false">
					查看排名
				</label>
				<label class="delectBtn" @tap="delectTask()">
					删除任务
				</label>
			</view>
		</view>

		<!-- 内容 -->
		<view class="contentBox">
			<!-- 班级 -->
			<view class="classMajor">
				班级：<label class='major'> XX专业XX系{{className}}（ <label class='yellowColor'>{{taskDetailsLists.completeStudentNum}}</label>
					/{{taskDetailsLists.studentTotal}}人）</label>
			</view>
			<!-- 框框 -->
			<view class="frame" v-for="item in taskDetailsLists.teacherTaskDetailsList" :key='item.studentId'>
				<!-- 左边 -->
				<view class="frameLeft">
					<view class="stuName">
						姓名：<label class="stuNames">{{item.studentRealname}}</label>
						<label v-if="item.completeStatus==1" class="completionStatus do">已完成</label>
						<label v-if="item.completeStatus==0" class="completionStatus notDo">未完成</label>
					</view>
					<view class="stuName">学号：<label class="stuNames">{{item.studentNum}}</label></view>
				</view>
				<!-- 右边查看详情按钮 -->
				<label class="frameRightBtn" @click="linkTo(item.studentId,item.studentNum,item.studentRealname)">查看详情</label>
			</view>
		</view>
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Dialog from '@/wxcomponents/dist/dialog/dialog';
	import Toast from '@/wxcomponents/dist/toast/toast';
	export default {
		data() {
			return {
				taskId: '',
				allWordCount: '',
				taskTime: '',
				className: '',
				taskDetailsLists: [],
				show: true,
				classId: ''
			}
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 查看详情跳转
			linkTo(studentId, studentNum, studentRealname) {
				console.log(studentRealname)
				uni.navigateTo({
					url: 'studentDetails?studentId=' + studentId + "&studentNum=" + studentNum + "&studentRealname=" +
						studentRealname
				})
			},
			// 查看排名跳转
			linkToRanking() {
				uni.navigateTo({
					url: 'ranking?taskId=' + this.taskId + '&allWordCount=' + this.allWordCount
				})
			},
			// 任务详情列表
			taskDetailsList(taskId, classId) {
				console.log(taskId)
				this.$minApi.taskDetailsList({
					taskId: taskId,
					classId: classId
				}, ).then(data => {
					console.log(data)
					this.taskDetailsLists = data.data

					console.log(this.taskDetailsLists)
				}).catch(err => {
					// console.log(err)
				})
			},
			// 删除任务事件
			delectTask() {
				Dialog.confirm({
					title: '  ',
					message: '是否确定删除任务？'
				}).then(() => {
					if (this.taskDetailsLists.taskIsStart != 1) {
						this.$minApi.deleteTask({
							taskId: this.taskId,
							taskTime: this.taskTime
						}).then(data => {
							console.log(data)
							uni.switchTab({
								url: "../index/index"
							})
							uni.showToast({
								title: data.msg,
								icon: "none"
							})
						})
					}
					else{
						uni.showToast({
							title: "任务已开始，无法删除！",
							icon: "none"
						})
					}

				}).catch(() => {
					// on cancel
				});
			},

		},
		onLoad(options) {
			// var data = JSON.parse(options.index); // 字符串转对象
			console.log(options)
			this.taskId = options.taskId
			this.taskTime = options.taskTime
			this.allWordCount = options.allWordCount
			this.className = options.className
			this.classId = options.classId

			this.taskDetailsList(options.taskId, options.classId)

		}
	}
</script>

<style lang="scss">
	.missionDetailsBox {
		position: relative;
		overflow: hidden;

		.makeSureTxt {
			text-align: center;
			font-size: 323rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 48rpx;
			color: rgba(46, 53, 72, 1);
			opacity: 1;
		}

		.headBox {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
		}

		// 顶部背景图片
		.site-img {
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			height: 288rpx;
			z-index: 10;
		}

		// 返回按钮
		.arrow {
			position: fixed;
			left: 40rpx;
			top: 73rpx;
			display: flex;
			width: 20rpx;
			height: 20rpx;
			border-left: 4rpx solid #fff;
			border-top: 4rpx solid #fff;
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
			color: rgba(255, 255, 255, 1);
			opacity: 1;
			z-index: 15;
		}

		// 任务词汇量
		.taskVocabulary {
			position: absolute;
			top: 130rpx;
			width: 100%;
			height: 288rpx;
			background-image: url('../../../../static/images/BJ1.png');
			z-index: 12;
			// right: 20rpx;
			background-size: 100% 100%;
			padding: 86rpx 64rpx 0;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;

			// 任务词汇量--左边
			.taskLeft {
				float: left;

				.taskTitle {
					font-size: 36rpx;
					font-weight: bold;
					color: rgba(46, 53, 72, 1);
					opacity: 1;
				}

				.taskTime {
					font-size: 24rpx;
					font-weight: 400;
					color: rgba(151, 157, 171, 1);
					opacity: 1;
					margin-top: 16rpx;
				}

				.status {
					display: inline-block;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 44rpx;
					color: rgba(151, 157, 171, 1);
					opacity: 1;
					width: 90rpx;
					height: 44rpx;
					background: rgba(239, 239, 241, 0.5);
					border: 2rpx solid rgba(201, 201, 201, 1);
					opacity: 1;
					border-radius: 4rpx;
					text-align: center;
					margin-left: 16rpx;
				}
			}

			// 右边查看排名按钮
			.viewBtn {
				width: 140rpx;
				height: 56rpx;
				float: right;
				line-height: 56rpx;
				background: linear-gradient(90deg, rgba(254, 201, 27, 1) 0%, rgba(255, 187, 0, 1) 100%);
				opacity: 1;
				border-radius: 40rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: 400;
				margin-top: 22rpx;
				color: rgba(255, 255, 255, 1);
			}

			.delectBtn {
				width: 140rpx;
				height: 56rpx;
				float: right;
				line-height: 56rpx;
				background: #FE661C;
				opacity: 1;
				border-radius: 40rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: 400;
				margin-top: 22rpx;
				color: rgba(255, 255, 255, 1);
			}
		}

		// 内容
		.contentBox {
			padding: 0 32rpx 50rpx;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			margin-top: 400rpx;

			// 班级
			.classMajor {
				margin-top: 390rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: rgba(46, 53, 72, 1);

				.major {
					font-size: 26rpx;
					font-weight: 400;
				}
			}

			// 框框
			.frame {
				width: 100%;
				height: 160rpx;
				background: rgba(255, 255, 255, 1);
				opacity: 1;
				border-radius: 16rpx;
				margin-top: 32rpx;
				padding: 0 32rpx;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;

				// 左边
				.frameLeft {
					float: left;

					.stuName {
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(46, 53, 72, 1);
						opacity: 1;
						margin-top: 30rpx;

						.stuNames {
							font-size: 26rpx;
							font-weight: 400;
							color: rgba(151, 157, 171, 1);
							opacity: 1;
						}

						// 完成状态
						.completionStatus {
							font-size: 22rpx;
							font-weight: 400;
							width: 84rpx;
							height: 40rpx;
							border-radius: 2px;
							display: inline-block;
							text-align: center;
							line-height: 40rpx;
							margin-left: 24rpx;
						}

						.completionStatus.do {
							color: rgba(255, 187, 0, 1);
							border: 1px solid rgba(255, 187, 0, 1);
						}

						.completionStatus.notDo {
							border: 1px solid rgba(201, 201, 201, 1);
							color: #C9C9C9;

						}

					}

				}

				// 右边按钮
				.frameRightBtn {
					float: right;
					font-size: 26rpx;
					font-weight: 400;
					color: rgba(255, 187, 0, 1);
					opacity: 1;
					margin-top: 62rpx;
				}
			}

		}
	}
</style>
