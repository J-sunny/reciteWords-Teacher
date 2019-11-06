<template>
	<view class="approvalStudents">
		<!-- 顶部 -->
		<view class="tasksHeadBox">
			<view class="tasksBoxHead">
				<!-- 返回按钮 -->
				<view class="arrow" @tap="goBack"></view>
				<!-- 标题 -->
				<view class="title">审批学生</view>
			</view>
		</view>

		<!-- 内容 -->
		<view class="approvalCon">
			<van-tabs :active="active" @change="onChange()">
				<van-tab title="未审批">
					<view class="frameBox">
						<view class="frame" v-for="item in notApprovalStudentList" :key='item.studentId'>
							<!-- 左边 -->
							<view class="frameLeft">
								<view class="studentName">{{item.studentName}}</view>
								<view class="stuName">年级：<label class="stuNames">{{item.classYear}}级</label></view>
								<view class="stuName">班级：<label class="stuNames">{{item.className}}级</label></view>
								<view class="stuName">学号：<label class="stuNames">{{item.studentNum}}</label></view>
							</view>
							<!-- 右边通过、不通过按钮 -->
							<view class="frameRight">
								<label class="adopt" @click="adopt(item.studentId,item.studentClass)">通过</label>
								<label class="noPassage" @click="notPass()">不通过</label>
							</view>
						</view>

					</view>

				</van-tab>
				<van-tab title="已审批">
					<view class="frameBox">
						<view class="frame" v-for="(item,index) in approvalStudentList" :key='item'>
							<!-- 左边 -->
							<view class="frameLeft">
								<view class="studentName">{{item.studentName}}</view>
								<view class="stuName">年级：<label class="stuNames">{{item.classYear}}级</label></view>
								<view class="stuName">班级：<label class="stuNames">{{item.className}}班</label></view>
								<view class="stuName">学号：<label class="stuNames">{{item.studentNum}}</label></view>
							</view>
							<!-- 右边通过、不通过按钮 -->
							<view class="frameRights">
								<view class="statused">已通过</view>
							</view>
						</view>
					</view>
				</van-tab>
				<van-tab title="待分配">
					<view class="allocatedListBox">
						<view class="allocatedBox" v-for="item in pendingLists" :key="item.studentId">
							<!-- 左边 -->
							<view class="frameLeft">
								<view class="studentName">{{item.studentName}}</view>
								<view class="stuName">年级：<label class="stuNames">{{item.studentGrade}}级</label></view>
								<view class="stuName">学号：<label class="stuNames">{{item.studentNum}}</label></view>
							</view>
							<!-- 按钮 -->
							<view class="frameRight" @click="changeRanking(item.studentId)">
								分配班级
							</view>
						</view>
					</view>
				</van-tab>
			</van-tabs>

		</view>


		<!-- 轻提示 -->
		<van-toast id="van-toast" />
		<!-- 分配班级弹框 -->

		<!-- 选择班级  弹出框 -->
		<van-popup :show="show" position="bottom" style="height: 356rpx">
			<van-picker show-toolbar title="选择班级" :columns="classLists" @cancel="onCancel()" @confirm="onConfirm()" />
		</van-popup>

	</view>
</template>

<script>
	import Toast from '@/wxcomponents/dist/toast/toast';
	export default {
		data() {
			return {
				showPass: 'unapproval',
				pendingLists: [],
				active: 0,
				show: false,
				studentId: "",
				classLists: [],
				approvalStudentList:[],
				notApprovalStudentList:[]
				
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 切换审批状态
			change(val) {
				this.showPass = val
			},
			// 获取待分配的学生列表
			pendingList() {
				this.$minApi.pendingList({}).then(data => {
					this.pendingLists = data.data
					// console.log(this.pendingLists[0].studentAccount)
				})
			},
			// 获取已审批学生
			getApprovalStudentList(){
				this.$minApi.getApprovalStudentList({}).then(data=>{
					this.approvalStudentList=data.data
				})
			},
			// 获取未审批学生
			getNotApprovalStudentList(){
				this.$minApi.getNotApprovalStudentList({}).then(data=>{
					this.notApprovalStudentList=data.data
				})
			},
			
			// 选中mtab
			onChange(event) {
				console.log(event)
			},
			// 通过
			adopt(studentId,classId) {
				this.$minApi.approvalStudent({
					studentId: studentId
				}).then(data => {
					if (data.code == 200) {
						Toast("加入班级成功！")
						this.getNotApprovalStudentList()
					} else {
						Toast(data.msg)
					}
					// console.log(data)
				})
				Toast("通过")
			},
			// 不通过
			notPass() {
				// Toast("不通过")
				uni.showToast({
					title:'不通过',
					icon:'none'
				})
			},
			// 未分配

			// 显示选择班级弹框
			changeRanking(studentId) {
				this.show = true;
				this.studentId = studentId
			},
			// picker选择器

			// 确认班级
			onConfirm(event) {
				const {
					picker,
					value,
					index
				} = event.detail;
				var classId = value.classId;
				var text = value.text;
				console.log(classId)
				console.log(this.studentId)
				// console.log('当前值' + text + '当前索引' + keyId);
				this.show = false;
				this.$minApi.assignStudent({
					classId: classId,
					studentId: this.studentId
				}).then(data => {
					if (data.code == 200) {
						Toast("加入班级成功！")
						this.pendingList()
					} else {
						Toast(data.msg)
					}
					// console.log(data)
				})
			},
			// 取消按钮
			onCancel() {
				this.show = false;
			},
			// 获取当前老师班级下拉列表
			classList() {
				this.$minApi.classList({
					
				}).then(data => {
					data.data.forEach(val => {
						val.text = val.className
					})
					this.classLists = data.data
				})
			}

		},
		created() {
			this.pendingList()
			this.classList()
			this.getApprovalStudentList()
			this.getNotApprovalStudentList()
		}

	}
</script>

<style lang="scss">
	.approvalStudents {

		// 顶部
		.tasksHeadBox {
			position: fixed;
			top: 0;
			z-index: 100;
			background-color: #FBFBFB;
			width: 100%;

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

			// 未审批--已审批按钮
			.approvalNav {
				text-align: center;
				line-height: 90rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 6rpx 24rpx rgba(201, 201, 201, 0.15);
				border-top: 2rpx solid #F0F0F0;
				overflow: hidden;
				font-size: 30rpx;
				font-weight: bold;
				color: rgba(92, 99, 113, 1);

				.unapproval {
					width: 375rpx;
					float: left;
				}

				.approved {
					width: 374rpx;
					border-left: 2rpx solid #F0F0F0;
					float: left;
				}

				.active {
					color: #FFBB00;
					border-bottom: 4rpx solid #FFBB00;
				}
			}
		}

		// 内容
		.approvalCon {
			padding-top: 128rpx;
			box-sizing: border-box;

			// 框框
			.van-tabs__line {
				background-color: #FFBC01 !important;
			}

			.van-tab--active {
				color: #FFBC01 !important;
			}


			// 已审批

			.frameBox {
				padding: 0 40rpx;
				box-sizing: border-box;

				.frame {
					width: 100%;
					height: 248rpx;
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
							margin-bottom: 4rpx;
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


					.frameRight {
						float: right;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						line-height: 52rpx;
						text-align: center;
						margin-top: 98rpx;

						.adopt {
							display: inline-block;
							width: 112rpx;
							height: 52rpx;
							background: linear-gradient(90deg, rgba(254, 201, 27, 1) 0%, rgba(255, 187, 0, 1) 100%);
							box-shadow: 0px 2rpx 12rpx rgba(255, 187, 0, 0.4);
							opacity: 1;
							border-radius: 40rpx;
							color: rgba(255, 255, 255, 1);
						}

						.noPassage {
							display: inline-block;
							width: 128rpx;
							height: 52rpx;
							background: rgba(255, 255, 255, 1);
							border: 2rpx solid rgba(254, 102, 28, 1);
							opacity: 1;
							border-radius: 40rpx;
							margin-left: 24rpx;
							color: #FE661C;
						}

					}

					// 已审批
					.frameRights {
						float: right;

						.statused {
							font-size: 30rpx;
							font-weight: 500;
							line-height: 202rpx;
							color: rgba(201, 201, 201, 1);
							opacity: 1;
						}
					}
				}
			}



			// 未分配
			.allocatedListBox {
				padding: 0 40rpx;
				box-sizing: border-box;

				.allocatedBox {
					width: 100%;
					height: 202rpx;
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
							margin-bottom: 4rpx;
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
					.frameRight {
						float: right;
						text-align: center;
						font-weight: 500;
						font-size: 30rpx;
						line-height: 52rpx;
						margin-top: 76rpx;
						color: #FFFFFF;
						width: 144rpx;
						height: 52rpx;
						background: linear-gradient(90deg, rgba(254, 201, 27, 1) 0%, rgba(255, 187, 0, 1) 100%);
						box-shadow: 0px 2rpx 12rpx rgba(255, 187, 0, 0.4);
						opacity: 1;
						border-radius: 40rpx;
					}


				}

			}
		}

	}
</style>
