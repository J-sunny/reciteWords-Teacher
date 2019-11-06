<template>
	<view class="revisionClassBox">
		<!-- 顶部 -->
		<view class="tasksHeadBox">
			<view class="tasksBoxHead">
				<!-- 返回按钮 -->
				<view class="arrow" @tap="goBack"></view>
				<!-- 标题 -->
				<view class="title">修改班级信息</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="revisionConBox">
			<!-- 班级名称 -->
			<view class="classNameBox">
				<label class="className">班级名称</label>
				<input class="classNameInput" type="text" v-model="className">
			</view>
			<!-- 年级 -->
			<view class="gradeBox" @click="changeRanking()">
				<label class="className">年级</label>
				<view class="gradeNum">
					<label>{{gradeName}}级</label>
					<label class="arrowRight"></label>
				</view>
			</view>
			<!-- 班级学生 -->
			<view class="classStudentsBox">
				<view class="title">班级学生</view>
				<view class="studentListBox">

					<view class="studentBox" v-for="item in classLists" :key="item.studentId">
						<!-- 左边 -->
						<view class="studentleft">
							<view class="studentName">{{item.studentName}}</view>
							<view class="studentInfo">
								<label class="grade">年级：<label class="gradeNum">{{item.studentGrade}}级</label></label>
								<label class="grade">学号：<label class="gradeNum">{{item.studentNum}}</label></label>
							</view>
						</view>
						<!-- 删除学生 -->
						<view class="delectStudent" @click="delectStudent(item.studentId,item.studentName)">删除学生</view>
					</view>
				</view>
			</view>
		</view>


		<!-- 底部 -->
		<view class="bottomBox">
			<view class="back" @click="goBack()">返回</view>
			<view class="confirm" @click="classSave()">确认</view>
		</view>

		<!-- 选择年级  弹出框 -->
		<van-popup :show="show" position="bottom" style="height: 356rpx">
			<van-picker show-toolbar title="选择班级" :columns="columns" @cancel="onCancel()" @confirm="onConfirm()" />
		</van-popup>

		<!-- 删除学生弹框 -->
		<van-dialog confirm-button-color="#FFBB00 " cancel-button-color="#CCCCCC" use-slot :show="showDelect"
		 show-cancel-button @confirm="onConfirmDel()" @cancel="onCancelDel()">
			<view class="dialogText">是否确定将﻿{{delectedName}}移出该班级？</view>
		</van-dialog>
		<van-toast id="van-toast" />
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
				gradeName: "",
				className: this.className,
				columns: ['2014', '2015', '2016', '2017', '2018', '2019'],
				classLists: [],
				delectedId: "",
				delectedName: "",
				classId:"",
				belongSchoolId:""
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
				this.gradeName = value
			},
			onCancel() {
				this.show = false;
			},
			// 显示修改班级弹框
			changeRanking() {
				this.show = true;
			},
			// 删除学生
			delectStudent(delectedId, delectedName) {
				this.showDelect = true
				console.log(this.showDelect)
				this.delectedId = delectedId
				this.delectedName = delectedName
			},
			// 删除学生弹框取消按钮
			onConfirmDel() {
				// console.log("确认")
				console.log(this.delectedId)
				this.showDelect = false
				console.log(this.showDelect)
				this.$minApi.studentDelete({
					studentId: this.delectedId
				}).then(data => {
					if (data.code == 200) {
						Toast("删除成功")
						this.classList()
					} else {
						Toast(data.msg)
					}
				})
			},
			onCancelDel() {
				console.log("取消")
				this.showDelect = false
				console.log(this.showDelect)
			},
			// 获取班级id获取学生信息
			classList(classId) {
				console.log(classId)
				this.$minApi.getStudentListByClassId({
					classId:classId
				}).then(data => {
					console.log(data)
					this.classLists = data.data
					// this.gradeName = data.data[0].classYear
					// this.classId=data.data[0].classId
					this.belongSchoolId=data.data[0].belongSchoolId
				})
			},
			// 修改班级信息
			classSave() {
				this.$minApi.classSave({
					belongSchoolId: this.belongSchoolId,
					classId: this.classId,
					className: this.className,
					classYear: this.gradeName,
					managerTeacher: getApp().globalData.teacherId
				}).then(data => {
					console.log(data)
					if (data.code == 200) {
						Toast("修改成功")
					} else {
						Toast(data.msg)
					}
				})
			}
		},
		onLoad(options) {
			this.classList(options.classId)
			this.className = options.className
			this.classId=options.classId
			this.gradeName=options.classYear
		}
	}
</script>

<style lang="scss">
	.page {
		background: rgba(251, 251, 251, 1) !important;
		opacity: 1;
	}

	.revisionClassBox {

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
		.revisionConBox {
			margin-top: 128rpx;
			overflow: hidden;
			padding: 38rpx 40rpx 0;
			box-sizing: border-box;

			// 班级名称
			.classNameBox {
				height: 114rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 6rpx 12rpx rgba(201, 201, 201, 0.1);
				opacity: 1;
				border-radius: 16rpx;
				overflow: hidden;
				font-size: 30rpx;
				font-family: PingFang SC;
				line-height: 114rpx;
				padding: 0 32rpx;
				box-sizing: border-box;

				.className {
					float: left;
					font-weight: bold;
					color: rgba(46, 53, 72, 1);
					opacity: 1;
				}

				.classNameInput {
					height: 114rpx;
					float: right;
					font-weight: 400;
					color: rgba(92, 99, 113, 1);
					opacity: 1;
					text-align: right;
				}

			}

			// 年级
			.gradeBox {
				height: 114rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 6rpx 12rpx rgba(201, 201, 201, 0.1);
				opacity: 1;
				border-radius: 16rpx;
				overflow: hidden;
				font-size: 30rpx;
				font-family: PingFang SC;
				line-height: 114rpx;
				margin-top: 16rpx;
				padding: 0 32rpx;
				box-sizing: border-box;

				.className {
					float: left;
					font-weight: bold;
					color: rgba(46, 53, 72, 1);
					opacity: 1;
				}

				.gradeNum {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 114rpx;
					color: rgba(92, 99, 113, 1);
					opacity: 1;
					float: right;

					.arrowRight {
						display: inline-block;
						width: 15rpx;
						height: 15rpx;
						border-left: 2rpx solid #979DAB;
						border-top: 2rpx solid #979DAB;
						transform: rotate(135deg);
						z-index: 20;
						right: 0;
						margin-top: -8rpx;
					}
				}

			}

			// 班级学生
			.classStudentsBox {
				overflow: hidden;

				.title {
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(46, 53, 72, 1);
					opacity: 1;
					margin: 32rpx 0 16rpx;
					box-sizing: border-box;
				}

				.studentListBox {
					overflow: hidden;
					padding-bottom: 134rpx;
					box-sizing: border-box;

					.studentBox {
						width: 100%;
						height: 156rpx;
						background: rgba(255, 255, 255, 1);
						box-shadow: 0px 6rpx 12rpx rgba(201, 201, 201, 0.1);
						opacity: 1;
						border-radius: 16rpx;
						padding: 32rpx;
						box-sizing: border-box;
						margin-bottom: 32rpx;

						// 左边
						.studentleft {
							float: left;

							.studentName {
								font-size: 30rpx;
								font-family: PingFang SC;
								font-weight: bold;
								color: rgba(46, 53, 72, 1);
								opacity: 1;
							}

							.studentInfo {
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 400;
								margin-top: 16rpx;

								.grade {
									color: rgba(46, 53, 72, 1);
								}

								.gradeNum {
									color: rgba(151, 157, 171, 1);
								}
							}
						}

						// 删除学生
						.delectStudent {
							float: right;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: rgba(255, 92, 92, 1);
							margin-top: 28rpx;
							opacity: 1;
						}
					}
				}
			}
		}

		// 底部
		.bottomBox {
			position: fixed;
			bottom: 0;
			left: 0;

			width: 100%;
			height: 112rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px -6rpx 24rpx rgba(201, 201, 201, 0.1);
			opacity: 1;
			padding: 14rpx 40rpx;
			box-sizing: border-box;
			overflow: hidden;

			.back {
				width: 242rpx;
				height: 84rpx;
				background: rgba(235, 235, 236, 1);
				opacity: 1;
				border-radius: 44rpx;
				text-align: center;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 84rpx;
				color: rgba(92, 99, 113, 1);
				opacity: 1;
				float: left;
			}

			.confirm {
				float: left;
				width: 396rpx;
				height: 84rpx;
				background: rgba(255, 187, 0, 1);
				opacity: 1;
				border-radius: 44rpx;
				text-align: center;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 84rpx;
				color: #FFFFFF;
				opacity: 1;
				float: right;

			}
		}

		// 删除弹框内容
		.dialogText {
			margin: 0 auto;
			width: 540rpx;
			padding: 60rpx 104rpx 34rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 48rpx;
			color: rgba(46, 53, 72, 1);
			opacity: 1;
			text-align: center;
			box-sizing: border-box;
		}
	}
</style>
