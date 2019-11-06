<template>
	<view class="checkSelectBox" :class="shows==true?'tripList_root':''">
		<view class="status_bar"></view>
		<!-- 顶部 -->
		<view class="tasksHeadBox">
			<view class="tasksBoxHead">
				<!-- 返回按钮 -->
				<view class="arrow" @tap="goBack"></view>
				<!-- 标题 -->
				<view class="title">查看已选单词</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="selectCon">
			<!-- 选择班级 -->
			<view class="selectClass" @tap="showBox()">
				<label class="classText">选择班级</label>
				<label class="selected">（已选<label class="yellowColor">{{selectedClassNum==''?'0':selectedClassNum}}</label>个）</label>
				<label class="lookClass"></label>
				<!-- <uni-icon class='typeIcon' type="arrowright"></uni-icon> -->
			</view>
			<!-- 已选班级列表 -->
			<scroll-view class="selectedList">
				<label v-if="selectedClassList.length!=0" v-for="(item,index) in selectedClassList" :key='index' class="className">{{item}}</label>
				<label v-if="selectedClassList.length==0" class="className">未选择班级</label>
			</scroll-view>
			<!-- 已选单词 -->
			<view class="selectClass">
				<label class="classText">选择单词</label>
				<label class="selected">（已选<label class="yellowColor">{{lookSelectedList.length}}</label>个）</label>
			</view>
			<!-- 已选单词列表 -->
			<view class="checkedWordList">
				<van-checkbox-group :value="result" @change="onChanges()">
					<view class="checkedBox" v-for="item in lookSelectedList" :key="item.wordId">
						<view class="box" :style="{height:'160rpx',padding:'40rpx 24rpx' ,'border-radius':'16rpx','margin-top':'32rpx',background:'#fff','box-sizing': 'border-box'}">
							<van-checkbox class="vanCheckBox" :name="item.wordId" checked-color="#FFBB00">
								<view class="words">
									<view for="" class="word">{{item.wordSpell}}</view>
									<view for="" class="Interpretation">{{item.interpretation}}</view>
								</view>
							</van-checkbox>
						</view>
					</view>
				</van-checkbox-group>

			</view>

		</view>
		<!-- 底部 发布-->
		<view class="allCheck">
			<label class="goBack" @tap="goBack()">返回</label>
			<label v-if="fabu==true" class="lookCheck" @click="publish()">发布（共{{result.length}}个）</label>
			<label v-if="fabu==false" class="lookCheck" @click="confirmClass()">确认（共{{results.length}}个）</label>
		</view>

		<!-- 弹框 -->
		<view class="headPicPopup">
			<van-popup :show='shows' position="bottom" @close="onClose()">
				<scroll-view scroll-y='true' class="botBox">
					<van-checkbox-group :value=" results " @change="onChangess()">
						<van-checkbox v-for="item in classArr" :key='item.classId' checked-color="#FFBB00" :name="item.classId">
							{{item.className}}
						</van-checkbox>
					</van-checkbox-group>
				</scroll-view>
			</van-popup>
		</view>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import popupLayer from '@/components/popup-layer.vue'
	import Toast from '@/wxcomponents/dist/toast/toast';
	export default {
		data() {
			return {
				// 控制底部弹出框
				shows: false,
				fabu: true,
				result: [],
				results: [],
				classId: [],
				wordId: [],
				classArr: [],
				selectedClassList: [],
				lookSelectedList: [],
				selectedClassNum: '',
				taskDate: '',
				belongSchoolId: ""
			}
		},
		components: {
			popupLayer
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1,
				})
			},
			// 选择单词
			onChanges(event) {
				this.result = event.detail
				console.log(this.result)
			},
			// 选择班级
			onChangess(event) {
				console.log(event)
				this.results = event.detail
				console.log(this.results)
				this.classId = []
				this.results.forEach(data => {
					this.classId.push(parseInt(data))
				})
				console.log(this.classId)
			},
			// 确认选择班级
			confirmClass() {
				this.selectedClassList = []
				this.results.forEach(data => {
					this.classArr.forEach(val => {
						if (data == val.classId) {
							this.selectedClassList.push(val.className)
						}
					})
				})

				console.log(this.selectedClassList)
				// this.selectedClassList = this.results
				this.selectedClassNum = this.results.length
				this.onClose()
			},
			// 控制---底部弹出框
			onClose() {
				this.shows = false
				this.fabu = true
			},
			showBox() {
				this.shows = true
				this.fabu = false
			},
			// 获取班级下拉列表
			classList() {
				this.$minApi.classList({
					// schoolId: uni.getStorageSync('belongSchoolId')
				}).then(data => {
					this.classArr = data.data
					console.log(data)
				})
			},
			// 教师发布任务
			publish() {
				if (this.classId.length == 0) {
					Toast("请选择班级！")
					return false
				}

				console.log(this.classId)
				this.$minApi.publish({
					classId: this.classId.toString(),
					taskDate: this.taskDate,
					wordId: this.wordId.toString()
				}).then(data => {
					console.log(data)
					if (data.code == 200) {
						uni.switchTab({
							url: "../index/index"
						})
						uni.removeStorage({
							key: 'selectedWords',
							success: function(res) {
								console.log(res)
							}
						});
						setTimeout(a => {
							Toast("布置任务成功！");
						}, 1000)
					} else {
						setTimeout(a => {
							Toast(data.msg);
						}, 1000)
					}
				})
			}
		},
		created() {
			this.classList()
			// uni.getStorage({
			// 	key: 'selectedWords',
			// 	success: (data) => {
			// 		// console.log(data)
			// 		this.lookSelectedList = data.data
			// 		console.log(this.lookSelectedList)
			// 		data.data.forEach(val => {
			// 			this.result.push(val.wordId.toString())
			// 			this.wordId.push(val.wordId)
			// 		})
			// 		console.log(this.result)
			// 	}
			// });
			// 获取发布任务的日期
			uni.getStorage({
				key: 'taskDate',
				success: (data) => {
					this.taskDate = data.data.split("-")
					console.log(this.taskDate)
					if (this.taskDate[1] < 10) {
						this.taskDate[1] = "0" + this.taskDate[1]
					}
					if (this.taskDate[2] < 10) {
						this.taskDate[2] = "0" + this.taskDate[2]
					}
					this.taskDate = this.taskDate[0] + "-" + this.taskDate[1] + "-" + this.taskDate[2]
					console.log(this.taskDate)
				}
			});

		},
		onLoad(options) {
			// console.log(options)
			console.log(JSON.parse(decodeURIComponent(options.selectWords)))
			this.lookSelectedList = JSON.parse(decodeURIComponent(options.selectWords))
			this.lookSelectedList.forEach(val => {
				this.result.push(val.wordId.toString())
				this.wordId.push(val.wordId)
			})
		}
	}
</script>

<style lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.tripList_root {
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: fixed !important;
		z-index: 0;
	}

	.checkSelectBox {
		position: relative;


		.van-checkbox {
			height: 160rpx;
		}

		.word {
			font-size: 32rpx;
			font-weight: bold;
			color: rgba(46, 53, 72, 1);
			line-height: 40rpx;
		}

		.van-checkbox__icon-wrap {
			// margin-top: 20rpx;

		}


		.Interpretation {
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(151, 157, 171, 1);
			margin-top: 12rpx;
			line-height: 40rpx;
		}

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
		.selectCon {
			padding: 0 32rpx;
			box-sizing: border-box;
			margin-top: 128rpx;

			// 选择班级
			.selectClass {
				width: 100%;
				margin-top: 40rpx;
				margin-bottom: 16rpx;

				.classText {
					font-size: 32rpx;
					font-weight: bold;
					color: rgba(46, 53, 72, 1);
				}

				.selected {
					font-size: 26rpx;
					font-weight: 500;
					color: rgba(92, 99, 113, 1);
				}

				.lookClass {
					float: right;
					display: flex;
					width: 16rpx;
					height: 16rpx;
					border-left: 2rpx solid #5C6371;
					border-top: 2rpx solid #5C6371;
					transform: rotate(135deg);
					z-index: 20;
					margin-top: 15rpx;
				}
			}

			// 已选班级列表
			.selectedList {
				width: 100%;
				background: rgba(255, 255, 255, 1);
				border-radius: 16rpx;
				padding-bottom: 32rpx;

				label {
					display: inline-block;
					height: 56rpx;
					line-height: 56rpx;
					background: rgba(243, 243, 244, 1);
					border-radius: 40rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: rgba(46, 53, 72, 1);
					margin-top: 32rpx;
					margin-left: 32rpx;
					padding: 0 32rpx;
				}
			}

			// 已选单词列表
			.checkedWordList {
				padding-bottom: 120rpx;

				.listCon {
					margin-top: 16rpx;
					width: 100%;
					height: 138rpx;
					background: rgba(255, 255, 255, 1);
					border-radius: 16rpx;
					padding: 24rpx;
					box-sizing: border-box;

					.listConRadio {
						// height: 100%;
						float: left;
						line-height: 90rpx;
					}

					.listConWord {
						float: left;
						margin-left: 24rpx;

						.word {
							font-size: 32rpx;
							font-weight: bold;
							color: rgba(46, 53, 72, 1);
						}

						.Interpretation {
							font-size: 24rpx;
							font-weight: 400;
							color: rgba(151, 157, 171, 1);
							margin-top: 12rpx;
						}
					}
				}
			}
		}

		// 底部发布
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
			z-index: 99999999;

			.goBack {
				display: inline-block;
				width: 242rpx;
				height: 84rpx;
				background: rgba(235, 235, 236, 1);
				border-radius: 44rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 400;
				line-height: 84rpx;
				color: rgba(92, 99, 113, 1);
				margin-top: 14rpx;
			}

			.lookCheck {
				display: inline-block;
				width: 396rpx;
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
				background: rgba(255, 187, 0, 1);
				color: rgba(255, 255, 255, 1);

			}


		}

		// 底部弹框

		.headPicPopup {
			.van-popup {
				background-color: rgba(0, 0, 0, 0.1);
			}
		}


		.botBox {
			// position: fixed;
			// bottom: 112rpx;
			// left: 0;
			width: 100%;
			background: rgba(255, 255, 255, 1);
			// box-shadow: 0px -6px 40px rgba(201, 201, 201, 0.3);
			border-radius: 20rpx 20rpx 0px 0px;
			padding: 64rpx 32rpx 176rpx;
			box-sizing: border-box;
			line-height: 106rpx;
			overflow: hidden;
			height: 1000rpx;
			border-radius: 20rpx 20rpx 0px 0px;



			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 106rpx;
			color: rgba(46, 53, 72, 1);
			opacity: 1;

			.selectedName {
				background: rgba(255, 255, 255, 1);
				overflow: hidden;

				checkbox {
					margin-right: 24rpx;
					float: left;
				}

				label {
					display: inline-block;
					float: left;
					width: 80%;
					font-size: 30rpx;
					font-weight: 400;
					color: rgba(46, 53, 72, 1);
					overflow: hidden; //超出一行文字自动隐藏
					text-overflow: ellipsis; //文字隐藏后添加省略号
					white-space: nowrap; //强制不换行
				}
			}
		}


	}
</style>
