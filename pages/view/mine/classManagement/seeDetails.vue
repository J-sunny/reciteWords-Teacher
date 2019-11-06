<template>
	<view class="missionDetailsBox">
		<view class="headBox">
			<!-- 顶部背景图 -->
			<image class='site-img' src="../../../../static/images/BJ2.png" catchtap='navmap'></image>
			<!-- 返回按钮 -->
			<view class="arrow" @tap="goBack"></view>
			<!-- 标题 -->
			<view class="title">班级管理</view>
			<!-- 任务词汇量 -->
			<view class="taskVocabulary">
				<!-- 左边--任务词汇量 -->
				<view class="taskLeft">
					<view class='taskTitle' @click="changeRanking()">{{className}}</view>
					<view class='taskTime'><label>年级：</label>{{classYear}}级</view>
					<view class='taskTime'><label>学生数量：</label>{{classLists.length}}个</view>
				</view>
				<!-- 右边 -->
				<view class="taskRight">
					<label class="editClass" @click="linkTo()">编辑</label>
					<label class="delectClass" @click="delectClass()">删除</label>
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="contentBox">
			<!-- 框框 -->
			<view class="frame" v-for="item in classLists" :key='item.studentId'>
				<!-- 左边 -->
				<view class="frameLeft">
					<view class="studentName">{{item.studentName}}</view>
					<view class="stuName">年级：<label class="stuNames">{{item.studentGrade}}级</label></view>
					<view class="stuName">学号：<label class="stuNames">{{item.studentNum}}</label></view>
				</view>
				<!-- 右边查看详情按钮 -->
				<label class="frameRightBtn" @click="viewDetails(item.studentId,item.studentNum,item.studentRealname,item.studentAvatar)">查看详情</label>
			</view>

		</view>

		<!-- 选择班级  弹出框 -->
		<van-popup :show="show" position="bottom" style="height: 356rpx">
			<van-picker show-toolbar title="选择班级" :columns="columns" @cancel="onCancel()" @confirm="onConfirm()" />
		</van-popup>

		<van-toast id="van-toast" />

		<!-- 删除弹框 -->
		<van-dialog confirm-button-color="#FFBB00 " cancel-button-color="#CCCCCC" use-slot :show="showDelect"
		 show-cancel-button @confirm="onConfirmDel()" @cancel="onCancelDel()">
			<view class="dialogText">是否确定删除班级？删除班级之后，原班级学生将在“<label class="yellowColor">审批学生-待分配</label>”里。</view>
		</van-dialog>
	</view>
</template>

<script>
	import Dialog from '@/wxcomponents/dist/dialog/dialog';
	import Toast from '@/wxcomponents/dist/toast/toast';
	export default {
		data() {
			return {
				show: false,
				showDelect: false,
				columns: ['一班', '二班', '三班'],
				className: "一班",
				classLists: [],
				classId:"",
				classYear:''
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// picker选择器
			onConfirm(event) {
				const {
					picker,
					value,
					index
				} = event.detail;
				console.log((`当前值：${value}, 当前索引：${index}`));
				this.show = false;
				this.className = value
			},
			onCancel() {
				this.show = false;
			},
			// 改变班级
			changeRanking() {
				console.log(222)
				this.show = true;
			},
			// 根据当前用户获取班级列表
			getStudentListByClassId() {
				this.$minApi.getStudentListByClassId({
					classId:this.classId
				}).then(data => {
					this.classLists = data.data
					console.log(data)
				})
			},
			// 查看详情
			viewDetails(studentId,studentNum,studentRealname,studentAvatar) {
				console.log(studentNum)
				uni.navigateTo({
					url: '../../home/details/studentDetails?studentId=' + studentId+"&studentNum="+studentNum+"&studentRealname="+studentRealname+"&studentAvatar="+studentAvatar
				})
			},
			// 删除班级
			delectClass() {
				this.showDelect = true
				console.log(this.showDelect)
			},
			// 删除班级弹框确认按钮
			onConfirmDel() {
				console.log("确认")
				this.showDelect = false
				// console.log(this.showDelect)
				// 删除班级
				this.$minApi.classDelete({
					classId:this.classId
				}).then(data => {
					if (data.code == 200) {
						Toast("删除成功")
						uni.navigateTo({
							url:"index"
						})
					} else {
						Toast(data.msg)
					}
					console.log(data)
				})
			},
			// 删除班级弹框取消按钮
			onCancelDel() {
				console.log("取消")
				this.showDelect = false
				// console.log(this.showDelect)
			
			},
			// 修改班级信息页面跳转
			linkTo() {
				uni.navigateTo({
					url: 'revisionClass?className='+this.className+'&classId='+this.classId+'&classYear='+this.classYear
				})
			}

		},
	
		onShow() {
			this.getStudentListByClassId()
		},
		onLoad(options) {
			console.log(options)
			this.classId=options.classId
			this.className=options.className
			this.classYear=options.classYear
		}

	}


	// uni.navigateBack({
	// 		// console.log(11);
	// 	delta: 1,
	// 	animationType: 'pop-out',
	// 	animationDuration: 200
	// });
</script>

<style lang="scss">
	.missionDetailsBox {
		position: relative;
		overflow: hidden;

		.headBox {
			position: fixed;
			top: 0;
			left: 0;
			overflow: hidden;
			height: 400rpx;
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
			height: 334rpx;
			background-image: url('../../../../static/images/BJj2.png');
			z-index: 12;
			// right: 20rpx;
			background-size: 100% 100%;
			padding: 86rpx 72rpx 0;
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

					label {
						color: #2E3548;
					}
				}
			}

			// 任务词汇量  右边
			.taskRight {
				float: right;
				text-align: center;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 56rpx;
				color: rgba(255, 255, 255, 1);
				opacity: 1;
				margin-top: 44rpx;

				.editClass {
					display: inline-block;
					width: 112rpx;
					height: 56rpx;
					background: linear-gradient(90deg, rgba(254, 201, 27, 1) 0%, rgba(255, 187, 0, 1) 100%);
					opacity: 1;
					border-radius: 40rpx;

				}

				.delectClass {
					display: inline-block;
					width: 112rpx;
					height: 56rpx;
					background: rgba(254, 102, 28, 1);
					opacity: 1;
					border-radius: 40rpx;
					margin-left: 32rpx;
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
		}

		// 内容
		.contentBox {
			padding: 0 32rpx 50rpx;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			box-sizing: border-box;
			margin-top: 440rpx;


			// 框框
			.frame {
				width: 100%;
				height: 201rpx;
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

					.studentName {
						font-size: 30rpx;
						font-weight: bold;
						color: rgba(46, 53, 72, 1);
						margin-top: 32rpx;
					}

					.stuName {
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(46, 53, 72, 1);
						opacity: 1;
						margin-top: 12rpx;

						.stuNames {
							font-size: 26rpx;
							font-weight: 400;
							color: rgba(151, 157, 171, 1);
							opacity: 1;
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
					margin-top: 82rpx;
				}
			}

		}

		// 删除弹框内容
		.dialogText {
			width: 100%;
			padding: 64rpx 44rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 48rpx;
			color: rgba(46, 53, 72, 1);
			opacity: 1;
			text-align: center;
			box-sizing: border-box;
			// height: 266rpx;
		}
	}
</style>
