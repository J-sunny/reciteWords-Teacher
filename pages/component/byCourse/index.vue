<template>
	<view class="byCourseBox" :class="show==true?'preventTouchMove':''">
		<!-- 分类 -->
		<view class="byList">
			<!-- 分类标题 -->
			<view class="courseNavBox">
				<view>
					<view class="courseType" @tap="actives1()">
						<text class="typeTitle">{{thesauruNameTitle}}</text>
						<uni-icon class='typeIcon' :type="thesauruNameActive==1?'arrowdown ':'arrowup'" style='font-size: 20rpx;'></uni-icon>
					</view>
					<!-- 分类选项--第一级 -->
					<scroll-view scroll-y='true' class="courseOptions" v-if='thesauruNameShow'>
						<view class="options" :class="item.thesaurusName==thesauruNameTitle?'activeColor':''" v-for="item in thesaurusLists" :key='item'
						 @tap="optionsthesauruNameActive(item.thesaurusName,item.thesaurusId)">{{item.thesaurusName}}</view>
					</scroll-view>
				</view>

				<view>
					<view class="courseType courseBorder" @tap="actives2()">
						<label class="typeTitle">{{chapterTitle}}</label>
						<uni-icon class='typeIcon' :type="chapterActive==1?'arrowdown ':'arrowup'"></uni-icon>
					</view>
					<!-- 分类选项--第二级 -->
					<scroll-view scroll-y='true' class="courseOptions" v-if='chapterShow'>
						<view class="options" :class="item.belong_chapter==chapterTitle?'activeColor':''" v-for="(item,index) in chapterLists"
						 :key='index' @tap="optionschapterActive(item.belong_chapter)">{{item.belong_chapter}}</view>
					</scroll-view>
				</view>

				<view>
					<view class="courseType" @tap="actives3()">
						<label class="typeTitle" for="">{{lessonTitle}}</label>
						<uni-icon class='typeIcon' :type="lessonActive==1?'arrowdown ':'arrowup'"></uni-icon>
					</view>
					<!-- 分类选项--第三级 -->
					<scroll-view scroll-y='true' class="courseOptions" v-if='lessonShow'>
						<view class="options" :class="item.belong_lesson==lessonTitle?'activeColor':''" v-for="(item,index) in lessonLists"
						 :key='index' @tap="optionslessonActive(item.belong_lesson)">{{item.belong_lesson}}</view>
					</scroll-view>
				</view>


			</view>
		</view>

		<!-- 内容 -->
		<view class="courseConBox">
			<view class="courseList">
				<view class="Title">
					<label class="bigTitle">{{thesauruNameTitle}}</label>
					<label class="smallTitle" for="">{{chapterTitle}}-{{lessonTitle}}</label></view>
				<van-checkbox-group :value="result" @change="onChanges()">
					<view class="checkedBox" v-for="item in list" :key="item.wordId">
						<view class="box" :style="{height:'',padding:'40rpx 24rpx' ,'border-radius':'16rpx','margin-top':'32rpx',background:'#fff','box-sizing': 'border-box'}">
							<!-- 复选框组 -->
							<van-checkbox class="vanCheckBox" :name="item.wordId" checked-color="#FFBB00">
								<view class="words">
									<view class="word">{{item.wordSpell}}</view>
									<view class="Interpretation">{{item.interpretation}}</view>
								</view>
							</van-checkbox>
						</view>
					</view>
				</van-checkbox-group>
			</view>
		</view>
		<!-- 底部全选 -->
		<view class="allCheck" v-if="false">
			<!-- <label class="radio"> -->
			<!-- <checkbox  color="#FFBB00" style="transform:scale(1)" @tap="checkAll=!checkAll" :checked="checkAll"/>全选 -->
			<van-checkbox class="radio" :value="checkAll" @change="onChange()" checked-color="#FFBB00">全选</van-checkbox>
			<!-- </label> -->
			<label v-if='lookSelects==false' class="lookCheck">
				查看已选（{{wordCount}}）
			</label>
			<label v-if="lookSelects!=false" class="lookCheck lookActive">
				查看已选（{{wordCount}}）
			</label>
		</view>

		<!-- 遮罩层 -->
		<view :class="show==true?'backgrounds':''">
		</view>

	</view>
</template>

<script>
	// import uniIcon from "../../../components/uni-icon/uni-icon.vue"
	import {
		uniIcon
	} from '@dcloudio/uni-ui/lib/uni-icon/uni-icon.vue'
	export default {
		name: "allcourse",
		props: ['fSendWords', 'sendFlaf'],
		data() {
			return {
				thesauruNameTitle: '全部',
				chapterTitle: '全部',
				lessonTitle: '全部',
				thesauruNameActive: 1,
				chapterActive: 1,
				lessonActive: 1,
				show: false,
				thesauruNameShow: false,
				chapterShow: false,
				lessonShow: false,
				checkAll: false,
				lookSelects: false,
				wordCount: 0,
			
				list: [],
				result: [],
				thesaurusLists: [],
				chapterLists: [],
				lessonLists: [],
				arr: [],
				arrb: [],
				allList: [],
				listb: [],
				listc: []

			};
		},
		mounted() {
			console.log(this.fSendWords)
			this.fSendWords.forEach(val => {
				this.result.push(val.wordId.toString())
			})
		},
		components: {
			uniIcon
		},
		watch: {
			thesauruNameTitle() {
				// console.log(this.thesauruNameTitle)
				this.chapterList(this.thesauruNameTitle)
				this.chapterTitle = "全部"
				this.lessonTitle = "全部"
				this.chapterLists = [],
					this.lessonLists = [],
					this.list = []
			},
			chapterTitle() {
				this.lessonList(this.thesauruNameTitle, this.chapterTitle)
			}
		},
		methods: {
			actives1() {
				if (this.show == true && (this.chapterShow == true || this.lessonShow == true)) {
					this.show = this.show
					// console.log(1)
				} else if (this.show == true && this.thesauruNameShow == false) {
					this.show = false
					// console.log(2)
				} else {
					this.show = !this.show
					// console.log(3)
				}
				// console.log(this.show)
				this.thesauruNameActive = !this.thesauruNameActive
				this.thesauruNameShow = !this.thesauruNameShow
				this.chapterShow = false
				this.lessonShow = false
				this.chapterActive = false
				this.lessonActive = false
				// console.log(this.thesauruNameActive, 'thesauruNameActive')
			},
			actives2() {
				if (this.show == true && (this.thesauruNameShow == true || this.lessonShow == true)) {
					this.show = this.show
				} else {
					this.show = !this.show
				}

				this.chapterActive = !this.chapterActive
				this.chapterShow = !this.chapterShow
				this.thesauruNameShow = false
				this.lessonShow = false
				this.thesauruNameActive = false
				this.lessonActive = false
				// console.log(this.chapterActive, 'chapterActive')
			},
			actives3() {
				if (this.show == true && (this.thesauruNameShow == true || this.chapterShow == true)) {
					this.show = this.show
				} else {
					this.show = !this.show
				}

				this.thesauruNameShow = false
				this.chapterShow = false
				this.chapterActive = false
				this.thesauruNameActive = false
				this.lessonActive = !this.lessonActive
				this.lessonShow = !this.lessonShow
				// console.log(this.lessonActive)
			},
			optionsthesauruNameActive(val) {
				this.thesauruNameTitle = val
				// console.log(this.thesauruNameTitle, this.thesaurusId1)
				this.show = !this.show
				this.thesauruNameShow = false
				this.thesauruNameActive = !this.thesauruNameActive
				this.wordListByChapter()
			},
			optionschapterActive(val) {
				this.chapterTitle = val
				// console.log(val)
				this.show = !this.show
				this.chapterShow = false
				this.chapterActive = !this.chapterActive
				this.wordListByChapter()
			},
			optionslessonActive(val) {
				this.lessonTitle = val
				// console.log(val)
				this.show = !this.show
				this.lessonShow = false
				this.lessonActive = !this.lessonActive


				// console.log(999)
				// console.log(this.thesauruNameTitle)
				// console.log(this.chapterTitle)
				// console.log(this.lessonTitle)
				this.wordListByChapter()

			},

			indexOf(arr, val) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == val) return i;
				}
				return -1;
			},
			remove(arr, val) {
				var index = this.indexOf(arr, val);
				if (index > -1) {
					arr.splice(index, 1);
				}
			},
			// 全选
			onChange(event) {
				if (this.sendFlaf == false) {
					console.log("false")
					console.log(this.result)
					if (this.result.length != 0) {
						this.list.forEach(data => {
							this.result.forEach(val => {
								if (data.wordId == val) {
									this.remove(this.result, val)
								}
							})
						})
					}
					// this.result = []
					// console.log(this.list)
					this.list.forEach(data => {
						data.flag = false
					})
					console.log(this.list)

					this.list.forEach(data => {
						this.list.forEach(val => {
							if (data.wordId == val.wordId) {
								this.remove(this.allList, val)
							}
						})
					})

				} else {
					console.log("true")
					this.result = []
					this.list.forEach(data => {
						// console.log(data)						
						this.result.push(data.wordId.toString())
						// data.flag=true
					})
				}
				console.log(this.result)

				this.result.forEach(data => {
					this.list.forEach(val => {
						if (data == val.wordId) {
							this.allList.push(val)
						}
					})
				})
				this.listb = []
				console.log(this.listb)
				this.result.forEach(data => {
					this.allList.forEach(val => {
						if (data == val.wordId) {
							// console.log(val)
							this.listb.push(val)
						}
					})
				})
				// 去重复
				let hashb = {}
				this.listb = this.listb.reduce((preVal, curVal) => {
					hashb[curVal.wordId] ? '' : hashb[curVal.wordId] = true && preVal.push(curVal);
					return preVal
				}, [])
				console.log(this.allList)
				console.log(this.listb)
				this.$emit('sendCwords', this.listb)
				// this.lookSelects = event.detail
			},

			onChanges(event) {
				this.result = event.detail
				console.log(this.result)
				this.result.forEach(data => {
					this.list.forEach(val => {
						if (data == val.wordId) {
							this.arr.push(val)
						}
					})
				})
				// 去除重复
				let hash = {}
				this.arr = this.arr.reduce((preVal, curVal) => {
					hash[curVal.wordId] ? '' : hash[curVal.wordId] = true && preVal.push(curVal);
					return preVal
				}, [])

				// console.log(this.arr)

				// 取消选择的单词
				if (this.result.length == 0) {
					this.arr = []
				} else {
					this.arrb = []
					this.result.forEach(data => {
						this.arr.forEach(val => {
							if (data == val.wordId) {
								console.log(val)
								this.arrb.push(val)
							}
						})
					})
				}
				// 去重复
				let hashb = {}
				this.arrb = this.arrb.reduce((preVal, curVal) => {
					hashb[curVal.wordId] ? '' : hashb[curVal.wordId] = true && preVal.push(curVal);
					return preVal
				}, [])
				console.log(this.arrb)
				// 传值给父级
				this.$emit('sendCwords', this.arrb)
				// let flag = false
				// if (this.arrb.length == this.list.length) {
				// 	flag = true
				// } else {
				// 	flag = false
				// }
				// this.$emit('sendFlag', flag)
			},

			// 获取课程下拉列表
			thesaurusList() {
				this.$minApi.thesaurusList({}).then(data => {
					// console.log(data)
					this.thesaurusLists = data.data
					// this.thesauruNameTitle = data.data[0].thesaurusName
				})
				console.log(this.thesauruNameTitle)
				// this.chapterList(this.thesauruNameTitle)
			},
			// 获取章下拉列表
			chapterList(thesauruName) {
				this.$minApi.chapterList({
					thesauruName: thesauruName
				}).then(data => {
					console.log(data)
					this.chapterLists = data.data
					if (data.data.length != 0) {
						// this.chapterTitle = data.data[0].belong_chapter
						// this.lessonList(this.thesauruNameTitle, this.chapterTitle)
					}
				})
			},
			// 获取节下拉列表
			lessonList(thesauruName, chapter) {
				// console.log(chapter, thesauruName)
				this.$minApi.lessonList({
					chapter: chapter,
					thesauruName: thesauruName
				}).then(data => {
					console.log(data)
					this.lessonLists = data.data
					if (data.data.length != 0) {
						// this.lessonTitle = data.data[0].belong_lesson
						// console.log(data.data[0].belong_lesson)
						this.wordListByChapter()
					}
				})
			},
			// 通过课程章节获取单词列表
			wordListByChapter() {
				// console.log(this.lessonTitle,lesson)
				let titleThesauru = ''
				let titleLesson = ''
				let titleChapter = ''
				if (this.thesauruNameTitle == "全部") {
					titleThesauru == ""
				} else {
					titleThesauru = this.thesauruNameTitle
				}
				if (this.chapterTitle == "全部") {
					titleLesson == ""
				} else {
					titleLesson = this.chapterTitle
				}
				if (this.lessonTitle == "全部") {
					titleChapter == ""
				} else {
					titleChapter = this.lessonTitle
				}
				this.$minApi.wordListByChapter({
					thesauruName: titleThesauru,
					chapter: titleLesson,
					lesson: titleChapter
				}).then(data => {
					// data.data.forEach(res => {
					// 	res.flag = false
					// })
					this.list = data.data
					this.list.forEach(data=>{
						data.flag=false
					})
					// console.log(data)
					// console.log(this.arrb.length)
					console.log(this.list)
					console.log(this.result)
					this.result.forEach(data => {
						this.list.forEach(val => {
							if (data = val.wordId) {
								val.flag = true
							} else {
								val.flag = false
							}
						})
					})
					console.log(this.list)
					let flag = false
					this.list.forEach(data => {
						if (data.flag == true) {
							flag = true
						} else {
							flag == false
							return
						}
					})
					console.log(flag)
					this.$emit('sendFlag', flag)
				})

			},

		},
		created() {
			this.thesaurusList()
			this.wordListByChapter()
			// uni.getStorage({
			// 	key: 'selectedWords',
			// 	success: (data) => {
			// 		console.log(data)
			// 		data.data.forEach(val => {
			// 			this.result.push(val.wordId.toString())
			// 		})
			// 		console.log(this.result)
			// 	}
			// });
		},

	}
</script>

<style lang="scss">
	.backgrounds {
		background-color: rgba(0, 0, 0, 0.5);
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: fixed !important;
		z-index: 100;
	}

	.preventTouchMove {
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: fixed !important;
		z-index: 100;
	}

	.byCourseBox {
		position: relative;

		.van-checkbox {
			// height: 160rpx;
		}

		.word {
			font-size: 32rpx;
			font-weight: bold;
			color: rgba(46, 53, 72, 1);
		}

		.van-checkbox__icon-wrap {
			// margin-top: 20rpx;

		}


		.Interpretation {
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(151, 157, 171, 1);
			margin-top: 12rpx;
		}

		// 分类
		.byList {
			position: fixed;
			top: 288rpx;
			z-index: 100;
			background-color: #FBFBFB;
			margin-bottom: 32rpx;
			z-index: 101;
			width: 100%;

			// 分类标题
			.courseNavBox {
				border-bottom: 1rpx solid #F5F7F7;
				overflow: hidden;
				padding: 24rpx 0 18rpx 0;
				background: rgba(255, 255, 255, 1);

				.courseBorder {
					border-left: 2rpx solid #F5F7F7;
					border-right: 2rpx solid #F5F7F7;
				}

				.courseType {
					// padding: 24rpx 0 18rpx 0;
					display: inline-block;
					width: 248rpx;
					height: 48rpx;
					line-height: 48rpx;
					background: rgba(255, 255, 255, 1);
					font-size: 30rpx;
					font-weight: 400;
					color: #5C6371;
					text-align: center;
					float: left;



					.typeTitle {
						margin-right: -12rpx;
						// width: 198rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						display: inline-block;
					}

					.typeIcon {
						float: right;
						margin-right: 30rpx;
					}
				}
			}

			// 分类选项
			.courseOptions {
				padding-bottom: 16rpx;
				border-radius: 0px 0px 20rpx 20rpx;
				background-color: #fff;
				box-shadow: 0px 30rpx 40rpx rgba(201, 201, 201, 0.3);
				position: absolute;
				// position: fixed;
				top: 90rpx;
				left: 0;
				z-index: 50;
				width: 100%;
				height: 600rpx;

				.options {
					width: 100%;
					height: 96rpx;
					background: rgba(255, 255, 255, 1);
					text-align: center;
					line-height: 96rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #5C6371;
				}

				.activeColor {
					color: #FFBB00;
				}
			}
		}

		// 内容
		.courseConBox {
			padding: 0 32rpx 120rpx 32rpx;
			box-sizing: border-box;
			margin-top: 410rpx;


			.courseList {
				.Title {
					margin-top: 32rpx;

					.bigTitle {
						font-size: 32rpx;
						font-weight: bold;
						color: rgba(46, 53, 72, 1);
					}

					.smallTitle {
						font-size: 26rpx;
						font-weight: 500;
						color: rgba(92, 99, 113, 1);
						margin-left: 24rpx;
					}
				}

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

		// 		// 底部全选
		// 		.allCheck {
		// 			padding: 0 32rpx;
		// 			box-sizing: border-box;
		// 			position: fixed;
		// 			bottom: 0;
		// 			width: 100%;
		// 			height: 112rpx;
		// 			background: #FFFFFF;
		// 			box-shadow: 0px -6rpx 24rpx rgba(201, 201, 201, 1);
		// 			opacity: 1;
		// 			z-index: 100;
		// 
		// 			.radio {
		// 				line-height: 112rpx;
		// 				font-size: 32rpx;
		// 				font-weight: 500;
		// 				color: rgba(46, 53, 72, 1);
		// 				margin-top: 40rpx;
		// 				display: inline-block;
		// 			}
		// 
		// 			.lookCheck {
		// 				display: inline-block;
		// 				width: 456rpx;
		// 				height: 84rpx;
		// 				opacity: 1;
		// 				border-radius: 44rpx;
		// 				float: right;
		// 				text-align: center;
		// 				font-size: 32rpx;
		// 				font-weight: 400;
		// 				line-height: 84rpx;
		// 				opacity: 1;
		// 				margin-top: 14rpx;
		// 				background-color: #EFEFF1;
		// 				color: #979DAB;
		// 
		// 			}
		// 
		// 			.lookActive {
		// 				background: rgba(255, 187, 0, 1);
		// 				color: rgba(255, 255, 255, 1);
		// 			}
		// 		}
		// 	
	}
</style>
