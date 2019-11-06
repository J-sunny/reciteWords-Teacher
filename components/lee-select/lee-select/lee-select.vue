<template>
	<view class="select-page">
		<scroll-view class="scroll-list-panel" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation="true" @scroll="scroll">

			<base-classes v-for="(item, index) in quickPanelData" :classesAttr="item" :key="index" @chooseItem="chooseItem"></base-classes>
			<view class="main-wrap">
				<view class="sort-wrap" v-for="(sort,index1) in listData" :key="index1" :id="'view'+ index" :style="{backgroundColor:getListAttrListBackgroundColor}">
					<view class="title" :style="{fontSize:'32rpx',color:getListAttrTitleColor,height:getListAttrTitleHeight,background:getListAttrTitleBackground,paddingLeft:getListAttrTitlePadding}">{{sort.initial}}</view>
					<view class="list">
						<!-- <text v-for="(city, index2) in sort.list" :key="index2" :style="{height:getListAttrItemHeight, lineHeight:getListAttrItemHeight,  fontSize:getListAttrItemFontSize,borderBottom:getListAttrItemBorderBottom,margin:getListAttrItemMargin,color:getListAttrItemColor,background:getListAttrItemBackgroundColor}" @click="chooseItem(city.name)">{{city.name}}								22222</text> -->
						<!-- <view v-for="(city, index2) in sort.list" :key="index2" :style="{height:getListAttrItemHeight,  fontSize:getListAttrItemFontSize,borderBottom:getListAttrItemBorderBottom,margin:getListAttrItemMargin,color:getListAttrItemColor,background:getListAttrItemBackgroundColor}"
						 @click="chooseItem(city.name)"> -->
						<!-- <view class="listCon" :style="{'margin-top':getListAttrItemHeightMargin }"> -->
						<!-- <view class="listConRadio">
									<checkbox value="cb" color="#FFBB00" style="transform:scale(1)" />
								</view>
								<view class="listConWord">
									<view for="" class="word">{{city.name}}</view>
									<view for="" class="Interpretation">n.同谋，从犯；附件</view>
								</view> -->


						<van-checkbox-group :value="result" @change="onChange()">
							<view class="checkedBox" v-for="(allWord, index2) in sort.list" :key="index2">
								<view class="box" :style="{height:getListAttrItemHeight,padding:'40rpx 24rpx' ,'border-radius':'16rpx', borderBottom:getListAttrItemBorderBottom,'margin-top':getListAttrItemHeightMargin,background:getListAttrItemBackgroundColor}">
									<van-checkbox class="vanCheckBox" :name="allWord.wordId" checked-color="#FFBB00">
										<view class="words">
											<view for="" class="word">{{allWord.wordSpell}}</view>
											<view for="" class="Interpretation">{{allWord.interpretation}}</view>
										</view>
									</van-checkbox>
								</view>
							</view>
						</van-checkbox-group>
					</view>
				</view>
			</view>
		</scroll-view>
		<view v-if="getNavData.length > 0" class="now-sort" :style="{fontSize:'32rpx',color:getListAttrTitleColor,height:getListAttrTitleHeight,background:getListAttrTitleBackground,paddingLeft:getListAttrTitlePadding}">{{getNavData[activeIndex]}}</view>
		<view :class="['now-letter', fadeFlag?'fadeIn':'']">{{getNavData[activeIndex]}}</view>
		<view class="letter-nav" v-if="getNavAttrEnable" :style="{backgroundColor:getNavAttrbackgroundColor,padding:getNavAttrPadding,borderRadius:getNavAttrBorderRadius}">
			<text :class="['item',index === activeIndex ? 'active': '']" v-for="(item,index) in getNavData" :key="index" @click="scrollSelect(index)"
			 :style="{fontSize:getNavAttrFontSize,color:index === activeIndex ? getNavAttrActiveColor : getNavAttrColor,padding:getNavAttrItemPadding}">{{item}}</text>
		</view>
	</view>
</template>

<script>
	import baseClasses from '../base-classes/base-classes.vue'
	export default {
		components: {
			baseClasses
		},
		data() {
			return {
				list: ['a', 'b', 'c'],
				result: [],
				index: "",
				scrollTop: 0,
				disArray: [0],
				activeIndex: 0,
				fadeFlag: false,
				Timer: null,
				arr: [],
				arrb: [],
				// flag:false
			}
		},
		props: {
			listData: {
				type: Array,
				default: function() {
					return []
				}
			},
			quickPanelData: {
				type: Array,
				default: function() {
					return []
				}
			},
			navAttr: {
				type: Object,
				default: function() {
					return {}
				}
			},
			listAttr: {
				type: Object,
				default: function() {
					return {}
				}
			},
			fSelectWords: {}
		},
		computed: {
			getNavData() {
				let navData = [];
				this.quickPanelData.forEach((item, index) => {
					const navItem = item.navName || item.title || '标题'
					navData.push(navItem)
				})
				this.listData.forEach((item, index) => {
					navData.push(item.initial)
				})
				return navData;
			},
			getListAttrListBackgroundColor() {
				return this.listAttr.listBackgroundColor || 'transport'
			},
			getListAttrTitleColor() {
				return this.listAttr.titleColor || '#333'
			},
			getListAttrTitleFontSize() {
				return uni.upx2px(this.listAttr.titleFontSize || 24) + 'px'
			},
			getListAttrTitleHeight() {
				return uni.upx2px(this.listAttr.titleHeight || 72) + 'px'
			},
			getListAttrTitleBackground() {
				return this.listAttr.titleBackground || '#FBFBFB'
			},
			getListAttrTitlePadding() {
				return uni.upx2px(this.listAttr.titlePadding || 20) + 'px'
			},
			getListAttrItemHeight() {
				return uni.upx2px(this.listAttr.itemHeight || 168) + 'px'
			},
			getListAttrItemHeightMargin() {
				return uni.upx2px(this.listAttr.itemHeightMargin || 32) + 'px'
			},
			getListAttrItemFontSize() {
				return uni.upx2px(this.listAttr.itemFontSize || 28) + 'px'
			},
			getListAttrItemColor() {
				return this.listAttr.itemColor || '#333'
			},
			getListAttrItemBackgroundColor() {
				return this.listAttr.itemBackgroundColor || '#fff'
			},
			getListAttrItemBorderBottom() {
				// return this.listAttr.itemBorderBottom || '1px solid rgba(0, 0, 0, 0.1)'
			},
			getListAttrItemMargin() {
				return 0 + ' ' + uni.upx2px(this.listAttr.itemFontSize || 20) + 'px'
			},
			getNavAttrEnable() {
				return this.navAttr.hasOwnProperty('enable') ? this.navAttr.enable : true
			},
			getNavAttrbackgroundColor() {
				return this.navAttr.backgroundColor || ''
			},
			getNavAttrColor() {
				return this.navAttr.color || '#999'
			},
			getNavAttrActiveColor() {
				return this.navAttr.activeColor || '#000'
			},
			getNavAttrFontSize() {
				return uni.upx2px(this.navAttr.fontSize || 24) + 'px'
			},
			getNavAttrItemPadding() {
				if (this.navAttr.itemPadding) {
					let temp = ''
					const arr = this.navAttr.itemPadding.split(' ')
					arr.forEach((item, index) => {
						temp += uni.upx2px(item) + 'px' + ' '
					})
					return temp
				} else {
					return uni.upx2px(6) + 'px' + ' ' + uni.upx2px(0) + 'px'
				}
			},
			getNavAttrBorderRadius() {
				return uni.upx2px(this.navAttr.borderRadius || 100) + 'px'
			},
			getNavAttrPadding() {
				if (this.navAttr.itemPadding) {
					let temp = ''
					const arr = this.navAttr.padding.split(' ')
					arr.forEach((item, index) => {
						temp += uni.upx2px(item) + 'px' + ' '
					})
					return temp
				} else {
					return uni.upx2px(0) + 'px' + ' ' + uni.upx2px(0) + 'px'
				}
			}
		},
		mounted() {
			this.getDisArray()
			this.fSelectWords.forEach(val => {
				this.result.push(val.wordId.toString())
			})

			// console.log(this.result)
		},
		methods: {
			scrollSelect(index) {
				// console.log(index)
				clearTimeout(this.Timer)
				this.scrollTop = this.disArray[index]
				// console.log(this.scrollTop)
				this.activeIndex = index
				this.fadeFlag = true
				this.Timer = setTimeout(() => {
					this.fadeFlag = false
				}, 1000)
			},
			scroll(e) {
				// console.log(e)
				const length = this.disArray.length
				for (let i = 0; i < length; i++) {
					if (this.disArray[i] < e.detail.scrollTop && this.disArray[i + 1] > e.detail.scrollTop) {
						this.activeIndex = i
						// console.log(this.activeIndex)
					}
				}
			},
			getDisArray() {
				let dis = this.disArray[0]
				this.quickPanelData.forEach((item, index) => {
					dis = dis + uni.upx2px(item.height || 84)
					this.disArray.push(dis)
				})
				this.listData.forEach((item, index) => {
					const length = this.disArray.length - 1
					dis = this.disArray[length] + (parseInt(this.getListAttrTitleHeight) + (parseInt(this.getListAttrItemHeight) +
							parseInt(this.getListAttrItemHeightMargin)) *
						item.list.length)
					this.disArray.push(dis)
					// console.log(item.list.length)
				})
				// console.log(this.disArray)
				// this.flag=true
			},
			chooseItem(item) {
				this.$emit('chooseItem', item)
			},
			onChange(event) {
				this.result = event.detail
				console.log(this.result)
				console.log(this.listData)
				this.result.forEach(data => {
					this.listData.forEach(val => {
						val.list.forEach(nVal => {
							if (data == nVal.wordId) {
								this.arr.push(nVal)
							}
						})
					})
				})
				console.log(this.arr)

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
				this.$emit('sendFwords', this.arrb)

			},

		},
	}
</script>

<style lang="scss" scoped>
	.word {
		font-size: 32rpx;
		font-weight: bold;
		color: rgba(46, 53, 72, 1);
		line-height: 40rpx;
	}

	.Interpretation {
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(151, 157, 171, 1);
		line-height: 40rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}

	.select-page {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		height: 100%;

		.scroll-list-panel {
			height: inherit;

			.title {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				overflow: hidden;
			}

			.list {

				box-sizing: border-box;

				text {
					display: block;
					align-items: center;
					box-sizing: border-box;

					&:last-child {
						border: none;
					}

				}

				.checkedBox {
					background-color: #FBFBFB;
					padding: 0 32rpx;
					box-sizing: border-box;
				}

				.listCon {
					// margin-top: 16rpx;
					width: 100%;
					// height: 138rpx;
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
					}
				}

			}
		}

		.now-sort {
			position: fixed;
			top: 417rpx;
			left: 0;
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			// z-index: 999999;
			background-color: #0190A0;
		}

		.now-letter {
			font-size: 160upx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			opacity: 0;

			&.fadeIn {
				animation: fade 1s linear 0ms;
			}
		}

		.letter-nav {
			position: fixed;
			top: 50%;
			transform: translateY(-50%);
			right: 0;
			display: flex;
			flex-direction: column;
			text-align: center;
			z-index: 99999;
		}

	}

	@keyframes fade {
		0% {
			opacity: 0;
			display: block !important;
		}

		50% {
			opacity: 0.4;
		}

		100% {
			display: none;
			opacity: 0 !important;
		}
	}
</style>
