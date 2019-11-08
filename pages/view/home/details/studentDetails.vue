<template>
	<view class="stuDetailsBox">
		<!-- 顶部背景图 -->
		<image class='site-img' src="../../../../static/images/BJ.png" catchtap='navmap'></image>
		<!-- 返回按钮 -->
		<view class="arrow" bindtap="goBack" @tap="goBack"></view>
		<!-- 标题 -->
		<view class="title">学生学习详情</view>
		<!-- 头像 -->
		<view class="touBox">
			<view class="touXiang">
				<image :src="studentAvatar"></image>
			</view>
			<view class="touName">{{studentRealname}}·{{studentNum}}</view>
		</view>
		<!-- 主体内容 -->
		<view class="conBox">
			<!-- 总列表 -->
			<view class="stuListBox">
				<view class="stuList">
					<!--  -->
					<view class="toDay">
						<view class="dayTitle">
							<image class="titleIcon" src="../../../../static/images/today.png"></image>今日学习
						</view>
						<!-- 						<view class="dayNum"><label class="bigFont">{{studentRecordList.today.length==undefined?"0":studentRecordList.today.exerciseCount}}</label>词</view> -->
						<view class="dayNum"><label class="bigFont">{{learningToday}}</label>词</view>

					</view>
					<view class="toDay">
						<view class="dayTitle">
							<image class="titleIcon" src="../../../../static/images/Cumulative.png"></image>累计学习
						</view>
						<view class="dayNum"><label class="bigFont">{{cumulativeLearning}}</label>词</view>
					</view>
					<view class="toDay">
						<view class="dayTitle">
							<image class="titleIcon" src="../../../../static/images/Duration.png"></image>今日学习时长
						</view>
						<view class="dayNum"><label class="bigFont">{{learningHoursToday}}</label>分钟</view>
					</view>
					<view class="toDay">
						<view class="dayTitle">
							<image class="titleIcon" src="../../../../static/images/Cumulativelength.png"></image>累计学习时长
						</view>
						<view class="dayNum"><label class="bigFont">{{accumulatedLearningTime}}</label>分钟</view>
					</view>
				</view>
			</view>

			<!-- 柱状统计图 -->
			<view class="histogram">
				<!-- 柱状图标题 -->
				<view class="hisTitle">
					<image class="titleIcon" src="../../../../static/images/today.png"></image>今日学习
				</view>
				<!-- 最近一周-按月查看 -->
				<view class="lookChange">
					<view :class="toDayactive=='week'?'active':''" class="week" @click="toDayChange('week')">
						<view class="">最近一周</view>
						<view class='line'></view>
					</view>
					<view :class="toDayactive=='month'?'active':''" class="month" @click="toDayChange('month')">
						<view class="">按月查看</view>
						<view class='line'></view>
					</view>
				</view>
				<!-- 柱状图 -->
				<view class="qiun-columns">
					<view class="qiun-charts">
						<!-- <myCharts :opts="opts" canvas-id="canvasColumnStack" id="canvasColumnStack" class="charts" @touchstart="touchColumn"></myCharts> -->
						<!-- <canvas canvas-id="canvasColumnStack" id="canvasColumnStack" class="charts" @touchstart="touchColumn"></canvas> -->
						<canvas canvas-id="canvasColumnStack" id="canvasColumnStack" class="charts" @touchstart="touchColumn"></canvas>

					</view>
				</view>
				<!-- 当日学习 -->
				<view class="todayStudyBox">
					<label class="study">{{toDayactive=='week'?'当日学习：':'当月学习：'}}<label class="grayColor">{{worfChartList.exerciseCount}}词</label></label>
					<label class="review">{{toDayactive=='week'?'当日复习':'当月复习'}}<label class="grayColor">{{worfChartList.reviewCount}}词</label></label>
				</view>
			</view>

			<!-- 折线统计图 -->
			<view class="histogram">
				<!-- 折线图标题 -->
				<view class="hisTitle">
					<image class="titleIcon" src="../../../../static/images/Cumulativelength.png"></image>学习时长
				</view>
				<!-- 最近一周-按月查看 -->
				<view class="lookChange">
					<label :class="timesActive=='week'?'active':''" class="week" @click="timesChange('week')">
						<view class="">
							最近一周
						</view>
						<view class="line"></view>
						</label>
					<view :class="timesActive=='month'?'active':''" class="month" @click="timesChange('month')">
						<view class="">
							按月查看
						</view>
						<view class="line"></view></view>
				</view>
				<!-- 折线图 -->
				<view class="qiun-columns">
					<view class="qiun-charts">
						<canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea"></canvas>
					</view>
				</view>
				<!-- 当日学习 -->
				<view class="todayStudyBox">
					<label class="study">{{timesActive=='week'?'当日学习：':'当月学习：'}}<label class="grayColor">{{(timeChartList.lengthOfStudy/60).toFixed(2)}}分钟</label></label>
					<label class="review">总时长：<label class="grayColor">{{(timeChartList.lengthOfStudyCount/60).toFixed(2)}}分钟</label></label>
				</view>
		
			</view>

		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaArea = null;
	var canvaColumn = null;

	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: '',
				studentId: '',
				toDayactive: 'week',
				timesActive: 'week',
				timeChartList: [],
				worfChartList: [],
				studentRecordList: [],
				studentRealname:"",
				studentNum:"",
				studentAvatar:"",

				learningToday: 0,
				cumulativeLearning: 0,
				learningHoursToday: 0,
				accumulatedLearningTime: 0,

			
			}
		},

		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取用户学习时长图表
			getTimeChart(val) {
				let _this = this
				// 折线图
				let Area = {
					categories: [],
					series: [{
						data: [],
						name: "学习时长"
					}]
				};
				if (val == 'week') {
					this.$minApi.getTimeChart({
						studentId: this.studentId,
						type: "week"
					}).then(data => {
						// console.log(data)
						let arrX = []
						let arrY = []
						this.timeChartList = data.data
						for (var i = -6; i <= 0; i++) {
							arrX.push(_this.getDay(i))
							arrY.push(0)
						}
						Area.categories = arrX
						Area.series[0].data = arrY
						let arrDuration = []
						if (this.timeChartList.studentStudyInfoVOList.length != 0) {
							arrX.forEach(data => {
								this.timeChartList.studentStudyInfoVOList.forEach(val => {
									if (data == val.recordTime.slice(5)) {
										arrX.indexOf(data)
										console.log(arrX.indexOf(data))
										arrY[arrX.indexOf(data)] = (val.lengthOfStudy/60).toFixed(2)
									}
								})
							})
						}
						Area.categories = arrX;
						Area.series[0].data = arrY;
						_self.showArea("canvasArea", Area);
					})
				}
				if (val == 'month') {
					this.$minApi.getTimeChart({
						studentId: this.studentId,
						type: "month"
					}).then(data => {
						this.timeChartList = data.data
						console.log(data)
						let arrX = []
						let arrY = []
						let month = this.timeChartList.dateTimeType.slice(5)
						for (var i = 1; i <= month; i++) {
							if (i < 10) {
								i = "0" + i
							} else {
								i = i.toString()
							}
							arrX.push(i)
							arrY.push(0)
						}
						if (this.timeChartList.studentStudyInfoVOList.length != 0) {
							arrX.forEach(data => {
								this.timeChartList.studentStudyInfoVOList.forEach(val => {
									if (data == val.recordTime.slice(5, 7)) {
										arrX.indexOf(data)
										console.log(arrX.indexOf(data))
										arrY[arrX.indexOf(data)] = (val.lengthOfStudy/60).toFixed(2)
									}
								})
							})
						}

						Area.categories = arrX;
						Area.series[0].data = arrY;
						_self.showArea("canvasArea", Area);
					})

				}
			},

			// 获取用户学习单词数图表
			getWordChart(val) {
				let _this = this
				// 柱状图
				let ColumnStack = {
					categories: [],
					series: [{
							data: [],
							name: "学习"
						},
						{
							data: [],
							name: "复习"
						},
					]
				};
				if (val == "week") {
					this.$minApi.getWordChart({
						studentId: this.studentId,
						type: "week"
					}).then(data => {
						console.log(data)
						this.worfChartList = data.data
						let arrX = []
						let arrStudy = []
						let arrReview = []
						for (var i = -6; i <= 0; i++) {
							arrX.push(_this.getDay(i))
							arrStudy.push(0)
							arrReview.push(0)
						}
						ColumnStack.categories = arrX
						ColumnStack.series[0].data = arrStudy
						ColumnStack.series[1].data = arrReview
						if (this.worfChartList.studentStudyInfoVOList.length != 0) {
							arrX.forEach(data => {
								this.worfChartList.studentStudyInfoVOList.forEach(val => {
									// console.log(val.recordTime.slice(5))
									if (data == val.recordTime.slice(5)) {
										arrX.indexOf(data)
										// console.log(arrX.indexOf(data))
										arrStudy[arrX.indexOf(data)] = val.exerciseCount
										arrReview[arrX.indexOf(data)] = val.reviewCount
									}
								})
							})
						}
						ColumnStack.categories = arrX
						ColumnStack.series[0].data = arrStudy
						ColumnStack.series[1].data = arrReview
						_self.showColumnStack("canvasColumnStack", ColumnStack);
						// console.log(ColumnStack)
					})

				}
				if (val == "month") {
					this.$minApi.getWordChart({
						studentId: this.studentId,
						type: "month"
					}).then(data => {
						// console.log(data)
						this.worfChartList = data.data
						let arrX = []
						let arrStudy = []
						let arrReview = []
						let month = this.worfChartList.dateTimeType.slice(5)
						for (var i = 1; i <= month; i++) {
							if (i < 10) {
								i = "0" + i
							} else {
								i = i.toString()
							}
							arrX.push(i)
							arrStudy.push(0)
							arrReview.push(0)
						}
						ColumnStack.categories = arrX
						ColumnStack.series[0].data = arrStudy
						ColumnStack.series[1].data = arrReview
						if (this.worfChartList.studentStudyInfoVOList.length != 0) {
							console.log(arrX)
							arrX.forEach(data => {
								this.worfChartList.studentStudyInfoVOList.forEach(val => {
									if (data == val.recordTime.slice(5, 7)) {
										arrX.indexOf(data)
										arrStudy[arrX.indexOf(data)] = val.exerciseCount
										arrReview[arrX.indexOf(data)] = val.reviewCount
									}
								})
							})
						}
						ColumnStack.categories = arrX
						ColumnStack.series[0].data = arrStudy
						ColumnStack.series[1].data = arrReview
						_self.showColumnStack("canvasColumnStack", ColumnStack);
					})
				}
			},

			timesChange(val) {
				this.timesActive = val
				this.getTimeChart(val)
			},
			toDayChange(val) {
				this.toDayactive = val
				this.getWordChart(val)
			},

			// 配置折线图   详情见u-charts
			showArea(canvasId, chartData) {
				canvaArea = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'area',
					fontSize: 11,
					legend: true,
					dataLabel: true,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: false,
					colors: ['#FFBB00'],
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						gridColor: '#F5F7F7',
						data: {

						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						area: {
							type: 'straight',
							opacity: 0.4,
							addLine: true,
							width: 2,
							gradient: true,
						}
					}
				});
			},

			// 配置柱状图   详情见u-charts
			showColumnStack(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true
					},
					colors: ['#FF5C5C', '#FFBB00', '#979DAB'],
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: false,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						disabled: true,
						gridColor: '#F5F7F7',
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'stack',
							width: _self.cWidth * _self.pixelRatio * 0.1 / chartData.categories.length
						}
					},
					padding: [15, 10, 15, 10]
				})
			},

			// 获取用户学习情况(今日时长,今日单词,总时长,总单词)
			getStudentRecord(studentId) {
				this.$minApi.getStudentRecord({
					studentId: this.studentId
				}).then(data => {
					this.studentRecordList = data.data
					console.log(this.studentRecordList, 99)
					this.studentRecordList.forEach(data => {
						console.log(data.dateType, 66)
						if (data.dateType == "all") {
							this.cumulativeLearning = data.exerciseCount
							this.accumulatedLearningTime = data.lengthOfStudy
						} else if (data.dateType == "today") {
							this.learningToday = data.exerciseCount
							this.learningHoursToday = data.lengthOfStudy
						}
					})
				})
			},
			// 获取某天前日期
			getDay(day) {
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码
				var tYear = today.getFullYear();
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				tMonth = this.doHandleMonth(tMonth + 1);
				tDate = this.doHandleMonth(tDate);
				// return tYear+"-"+tMonth+"-"+tDate;
				return tMonth + "-" + tDate;
			},
			doHandleMonth(month) {
				var m = month;
				if (month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			},

		},
		onLoad(options) {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.studentId = options.studentId
			this.studentRealname = options.studentRealname
			this.studentNum = options.studentNum
			this.studentAvatar=options.studentAvatar
			console.log(options.studentRealname)
			console.log(this.studentRealname,this.studentNum,this.studentId)
			this.getStudentRecord()
			this.getTimeChart("week")
			this.getWordChart("week")
		}



	}
</script>


<style lang="scss">
	.qiun-charts {
		width: 100%;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 100%;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.stuDetailsBox {
		// position: relative;
		overflow: hidden;

		// 顶部背景图片
		.site-img {
			width: 100%;
			position: absolute;
			left: 0;
			top: 0;
			height: 376rpx;
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

		// 头像
		.touBox {
			width: 100%;
			position: absolute;
			z-index: 30;
			top: 160rpx;

			.touXiang,
			.touXiang image {
				width: 108rpx;
				height: 108rpx;
				margin: 0 auto;
				border-radius: 50%;
				background-color: #F1F1F1;
			}

			.touName {
				text-align: center;
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
				margin-top: 26rpx;
			}
		}

		// 主体内容
		.conBox {
			margin-top: 416rpx;
			padding-bottom: 64rpx;

			// padding: 0 32rpx;
			// -webkit-box-sizing: border-box;
			// -moz-box-sizing: border-box;
			// box-sizing: border-box;
			// z-index: 50;
			// 总列表
			.stuListBox {
				padding: 0 32rpx;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				box-sizing: border-box;


				.stuList {
					width: 686rpx;
					height: 352rpx;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 8rpx 36rpx rgba(201, 201, 201, 0.15);
					opacity: 1;
					border-radius: 16rpx;
					padding: 40rpx 0 0 48rpx;
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;

					.toDay {
						width: 50%;
						height: 50%;
						float: left;

						.dayTitle {
							font-size: 24rpx;
							font-weight: bold;
							color: rgba(92, 99, 113, 1);

							.titleIcon {
								width: 28rpx;
								height: 28rpx;
								margin-right: 16rpx;
							}
						}

						.dayNum {
							font-size: 16rpx;
							font-weight: 400;
							color: rgba(153, 153, 153, 1);

							.bigFont {
								font-size: 48rpx;
								font-weight: normal;
								color: rgba(46, 53, 72, 1);
								margin-left: 44rpx;
								margin-right: 8rpx;
							}
						}
					}
				}

			}

			// 柱状统计图
			.histogram {
				width: 100%;
				height: 820rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 8rpx 36rpx rgba(201, 201, 201, 0.15);
				border-radius: 16rpx;
				margin-top: 36rpx;

				.hisTitle {
					font-size: 28rpx;
					font-weight: 800;
					color: rgba(46, 53, 72, 1);
					padding: 32rpx 32rpx 40rpx;
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;

					.titleIcon {
						width: 28rpx;
						height: 28rpx;
						margin-right: 16rpx;
					}
				}

				.lookChange {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(151, 157, 171, 1);
					margin-bottom: 40rpx;
					overflow: hidden;

					.week {
						margin-left: 228rpx;
						float: left;
					}

					.month {
						margin-left: 56rpx;
						float: left;
					}

					.active {
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 800;
						color: rgba(46, 53, 72, 1);
						.line {
							border-bottom: 4rpx solid #FFBB00;
							width: 32rpx;
							margin-left: 46rpx;
							margin-top: 16rpx;
						}
					}
				}
			}

			// 当日学习
			.todayStudyBox {
				margin-top: 32rpx;
				color: #979DAB;
				font-family: PingFang SC;
				color: rgba(46, 53, 72, 1);
				opacity: 1;
				font-size: 24rpx;

				.study {
					margin-left: 64rpx;
					font-weight: bold;
				}

				.review {
					margin-left: 180rpx;
					font-weight: bold;
				}

				.grayColor {
					color: #979DAB;
					font-weight: 500;
				}
			}
		}
	}
</style>
