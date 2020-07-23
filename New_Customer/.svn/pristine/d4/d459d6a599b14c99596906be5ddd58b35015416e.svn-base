<template>
	<view>
		<view class="NoData" v-if="dataList.length<=0">无到店记录</view>
		<scroll-view scroll-y="true" :style="{ height: height }" style="padding: 10upx 0;" @scrolltolower="scrolltolower"> 
			<block v-for="(item, index) in dataList" :key="index">
				<view class="mdListBox">
					<view>时 间: {{ timeFormat(item.Date) }}</view>
					<view>
						<text>门&nbsp;&nbsp;&nbsp;店:</text>
						<text>{{ item.StoreName }}</text>
					</view>
					<view>
						<text>经办人:</text>
						<text>{{ item.HandleByName }}</text>
					</view>
					<view>
						<text>客户状态:</text>
						<text>{{ item.CustomerStatusText }}</text>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
import api from '../../common/http.js';
export default {
	data() {
		return {
			height: '500upx',
			PageIndex: 1,
			totalPage: 0,
			Pagesize: 10,
			dataList: null
		};
	},
	created() {
		this.height = this.getWindowHeight() + 'px';
		this.getList(1, this.Pagesize);
		// console.log(common.GetNowTime(new Date()))
		// console.log()
	},
	onLoad() {
		let cust = uni.getStorageSync('customer');
		if (cust == null || cust.data == undefined || cust.data.CustomerID==null) {
			uni.reLaunch({
				url: '../login/login'
			});
		}
	},
	methods: {
		timeFormat(time) {
			if(time){
				let arrTime = time.split(/[-T.]/);
			let arrT2 = arrTime[3].split(':');
			// console.log(arrTime, arrT2);
			return arrTime[0] + '年' + arrTime[1] + '月' + arrTime[2] + '日' + arrT2[0] + ':' + arrT2[1];
			}
			
		},
		getList(page, size) {
			let url = 'NewClient/CustomerComeLog';
			let data = {
				CustomerID: uni.getStorageSync('customer').data.CustomerID,
				page,
				size
			};
			uni.showLoading({
				title: '加载中'
			});
			api.httpRequestGet(url, data).then(res => {
				if (res.data.error_code == 'Success') {
					// console.log(res.data.data.list);

					let jkdata = res.data.data;
					if (page > 1) {
						var list = this.dataList;
						list = list.concat(jkdata.list);
					} else {
						var list = [];
						list = jkdata.list;
					}
					this.dataList = list;
					this.totalPage = jkdata.totalPage;
					uni.hideLoading();
				}
			});
		},
		// 下拉加载
		scrolltolower() {
			this.PageIndex++;
			if (this.PageIndex <= this.totalPage) {
				this.getList(this.PageIndex, this.Pagesize);
			} else {
				uni.showToast({
					title: '暂无更多数据',
					duration: 1000
				});
			}
		}
	}
};
</script>

<style scoped>
.mdListBox > view {
	display: flex;
}
.mdListBox > view > text {
	flex: 1;
}
.mdListBox > view > text:nth-child(2) {
	flex: 2;
}
.mdListBox {
	padding: 30upx;
	border-bottom: 1px solid #f5f5f5;
	color: #b2b2b2;
	padding-bottom: 80upx;
}
.mdListBox view:nth-of-type(1) {
	font-size: 40upx;
	color: #83cbac;
	margin-bottom: 10upx;
	/* font-weight: bold; */
}
.NoData {
	font-size: 40rpx;
	margin-top: 280rpx;
	color: #a1a1a1;
	padding-left: 285rpx;
}
</style>
