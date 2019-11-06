<template>
	<view class="byLetterBox">
		<!-- 搜索框 -->
		<view class="searchs">
			<!-- 	<view class="searchBox">
				<input class="inputText" type="text" placeholder='输入你想要的内容' confirm-type='search' value="">
				<image class="searchPic" src="../../../static/images/search.png" mode=""></image>
			</view> -->
			<van-search background='#FBFBFB' :value='value' placeholder="输入你想要的内容" @search='onSearch()' />
		</view>

		<!-- 索引列表 -->
		<view class="indexList">
			<!-- <uni-indexed-list :options="list" :showSelect="true"></uni-indexed-list> -->
			<!-- <uni-select :listData="listData" :quickPanelData="quickPanelData" @chooseItem="chooseItem"></uni-select> -->
			<lee-select @sendFwords='getZWords' :fSelectWords='fSendWords' listBackgroundColor='#fff' :listData="listData"
			 :quickPanelData="quickPanelData" @chooseItem="chooseItem" itemHeight=160></lee-select>
		</view>
		<!-- 底部全选 -->
		<view class="allCheck" v-if="false">
			<!-- <label class="radio"> -->
			<!-- <checkbox color="#FFBB00" style="transform:scale(1)" @tap="checkAll=!checkAll" :checked="checkAll" /> -->

			<van-checkbox class="radio" :value="checkAll" @change="onChange()" checked-color="#FFBB00">全选</van-checkbox>

			<!-- </label> -->
			<navigator url="/pages/view/home/arrangementTasks/checkSelected" class="lookCheck" :class="checkAll==true?'lookActive':''">
				查看已选（4）
			</navigator>
		</view>

	</view>
</template>

<script>
	import uniIndexedList from '@dcloudio/uni-ui/lib/uni-indexed-list/uni-indexed-list.vue'
	import allWord from '../../commont/city.js'
	import leeSelect from '@/components/lee-select/lee-select/lee-select.vue'
	import uniSelect from '@/components/lee-selectIndex/lee-select/lee-select.vue'

	export default {
		props: ['fSendWords'],
		data() {
			return {
				checkAll: false,
				listData: allWord,
				value: '',
				quickPanelData: [
					// {
					// 	title: '当前城市',
					// 	navName: '当前',
					// 	data: ['上海'],
					// 	height: 150
					// },
					// {
					// 	title: '热门城市',
					// 	navName: '热',
					// 	data: ['上海', '北京', '成都', '昆明', '西安'],
					// 	height: 224
					// }
				]
			};
		},
		components: {
			uniIndexedList,
			leeSelect,
			uniSelect
		},
		methods: {
			// 获取子组件传过来的数据
			getZWords(data) {
				console.log(data)
				this.$emit("sendFlwords",data)
				
			},
			onChange(event) {
				console.log(event.detail)
				this.checkAll = event.detail
			},
			chooseItem(item) {
				console.log(item)
			},
			onSearch(event) {
				console.log(event.detail)
			},
			getHeight() {
				// var query = wx.createSelectorQuery();
				// query.select('page').boundingClientRect()
				// query.exec(function(res) {
				// 	//res就是 所有标签为mjltest的元素的信息 的数组
				// 	console.log(res);
				// 	//取高度
				// 	console.log(res[0].height);
				// })
			},
			// 获取所有单词列表
			allWordList() {
				this.$minApi.allWordList().then(data => {
					this.listData = data.data
					// console.log(data.data)
				})
			}
		},
		created() {
			this.getHeight()
			this.allWordList()
			// console.log(allWord)
			// console.log(this.fSendWords)
		}

	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	html,
	body {
		height: 100%;
	}

	// .checkedBox .van-checkbox{
	// 	padding: 40rpx 0;
	// }
	// .vanCheckBox{
	// 	padding: 40rpx 0;
	// 	margin-top: 32rpx;
	// }
	.byLetterBox {
		overflow: hidden;
	}

	.box {
		padding: 40rpx 24rpx;

		box-sizing: border-box;
	}

	// .van-checkbox__icon-wrap{
	// 	margin-top: 16rpx;
	// }
	.byLetterBox {
		.searchs {
			position: fixed;
			top: 288rpx;
			z-index: 100;
			background-color: #FBFBFB;
			// margin-bottom: 32rpx;
			width: 100%;
			padding-bottom: 28rpx;

			// 搜索框
			.searchBox {
				padding: 0 32rpx;
				position: relative;
				box-sizing: border-box;
				width: 100%;

				.inputText {
					width: 100%;
					height: 64rpx;
					background-color: #EFEFF1;
					border-radius: 40rpx;
					font-size: 26rpx;
					font-weight: 400;
					line-height: 64rpx;
					color: rgba(201, 201, 201, 1);
					padding-left: 68rpx;
					box-sizing: border-box;
				}

				.searchPic {
					width: 28rpx;
					height: 28rpx;
					position: absolute;
					top: 18rpx;
					left: 56rpx;
				}
			}

		}


		// 索引列表
		.indexList {
			margin-top: 400rpx;
			padding-bottom: 120rpx;
			height: 1500rpx;
			// height: 100%;
			// padding-top: 400rpx;
		}

		// 底部全选
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

			.radio {
				display: inline-block;
				line-height: 112rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(46, 53, 72, 1);
				margin-top: 40rpx;
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
