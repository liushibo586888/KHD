<template>
	<view>
		<view v-if="hlsList.length <= 0 ? true : false" class="StoreNull">暂无护理老师</view>
		<scroll-view v-else="hlsList.length == 0 ? false : true" scroll-y="true" :style="{ height }" style="padding: 10upx 0;" @scrolltolower="scrolltolower">
			<block v-for="(item, index) in hlsList" :key="index">
				<navigator url="../yytime/yytime" hover-class="none">
					<view class="mdListBox" @click="selectHLS(index)">
						<view class="imgView"><image src="../../static/yuyue/logo.jpg" mode="aspectFill"></image></view>
						<view class="flex1">{{ item.Name }}</view>
						<!-- <view style="font-size: 25upx;">今日已约满</view> -->
						<image src="../../static/tabbarImg/rArrow.png" class="rArrow" mode=""></image>
					</view>
				</navigator>
			</block>
		</scroll-view> 
	</view>
</template>

<script>
import Vue from 'vue';
import api from '../../common/http.js';
export default {
	data() {
		return {
			height: '500upx',
			PageIndex: 1,
			totalPage: 0,
			hlsList: []
		};
	},
	created() {
		let that = this;
		that.height = that.getWindowHeight() + 'px';
		this.getList();
	},
	onLoad() {
		
	},
	methods: {
		selectHLS(index) {
			Vue.prototype.$hlsId = this.hlsList[index].ID;
			Vue.prototype.$hlsName = this.hlsList[index].Name;
		},
		getList() {
			let hl = uni.getStorageSync('customer').data;
			if(hl!=undefined){
				this.hlsList = uni.getStorageSync('customer').data.listEmployees;
			}
			
		}
	}
};
</script>

<style scoped>
.mdListBox .flex1 {
	flex: 1;
	text-align: left;
}
.StoreNull {
	text-align: center;   
	font-size: 40rpx;
	margin-top: 280rpx;
	color: #a1a1a1; 
}
.rArrow {
	width: 60upx;
	height: 60upx;
}
image {
	width: 100upx;
	height: 100upx;
	border-radius: 50upx;
}
.mdListBox {
	padding: 20upx 50upx;
	display: flex;
	align-items: center;
	font-size: 46upx;
	border-bottom: 1px solid #b2b2b2;
}
.mdListBox view {
	width: 25%;
	text-align: center;
}
.mdListBox view:nth-of-type(3) {
	color: red;
	flex: 1;
}
.mdListBox image:nth-of-type(4) {
	text-align: right;
	color: #b2b2b2;
}
/* .noshadow{
	hover-class:none
} */
</style>
