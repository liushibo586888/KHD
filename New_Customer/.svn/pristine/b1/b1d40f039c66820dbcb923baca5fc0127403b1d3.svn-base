<template>
	<view>
		<view class="NoData" v-if="dataList.length <= 0">无消费数据</view>
		<scroll-view scroll-y="true" :style="{ height: height }" style="padding: 10upx 0;" @scrolltolower="scrolltolower">
			<block v-for="(item, index) in dataList" :key="index">
				<view class="mdListBox">
					<view>时&nbsp;间: {{ timeFormat(item.Date) }}</view>
					<view>
						<text>消费门店:</text>
						<text>{{ item.StoreName }}</text>
					</view>
					<view>
						<text>收费人员:</text>
						<text>{{ item.ChargeByName }}</text>
					</view>
					<view>
						<text>经手人员:</text>
						<text>{{ item.HandledByName }}</text>
					</view>
					<view>
						<text>消费金额:</text>
						<text>{{ item.ConsumptionMoney }}</text>
					</view>
					<view>
						<text>收费情况:</text>
						<text>{{ item.StatusText }}</text>
					</view>
					<view>
						<text>是否确认:</text>
						<text v-if="item.IsConfirm" style="color: #83cbac;">已确认</text>
						<text v-else style="color: red;">未确认</text>
					</view>
					<view v-if="item.Remark">
						<text>备注:</text>
						<text>{{ item.Remark }}</text>
					</view>
					<view class="checkBtn">
						<button class="checkOrder" @click="evaluate(item.ID, index, item.IsConfirm)" type="button">查看详情</button>
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
		// console.log(common.GetNowTime(new Date())) 
	},
	onLoad() {
		let cust = uni.getStorageSync('customer');
		// console.log(cust.CustomerID);
		// console.log(cust.CustomerID==null);
		if (cust == null || cust.data == undefined || cust.data.CustomerID==null) {
			uni.reLaunch({
				url: '../login/login'
			});
		}
		this.getList(1, this.Pagesize);
	},
	onShow() {
		uni.$once('costCheck', res => {
			this.dataList[res.index].IsConfirm = 1;
		});
	},
	methods: {
		evaluate(id, i,Confirm) {
			uni.navigateTo({
				url: '../costCheck/costDesc?id=' + id + '&i=' + i + '&Confirm=' + Confirm
			});
		},

		timeFormat(time) {
			if (time) {
				let arrTime = time.split(/[-T.]/);
				let arrT2 = arrTime[3].split(':');
				// console.log(arrTime, arrT2);
				return arrTime[0] + '年' + arrTime[1] + '月' + arrTime[2] + '日' + arrT2[0] + ':' + arrT2[1];
			}
		},
		getList(page, size) {
			let url = 'NewClient/CustConsumptionConfirmList';
			let data = {
				CustomerID: uni.getStorageSync('customer').data.CustomerID,
				page,
				size
			};
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			api.httpRequestGet(url, data).then(res => {
				if (res.data.error_code == 'Success') { 
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
				}
				
				setTimeout(function() {
					uni.hideLoading();
				}, 500);
				
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
.checkBtn {
	display: flex;
}

.NoData {
	font-size: 40rpx;
	margin-top: 280rpx;
	color: #a1a1a1;
	padding-left: 285rpx;
}

.checkBtn button {
	line-height: 2;
	margin: 40upx 4upx 20upx 4upx;
	flex: 1;
	border: 1px solid;
	border-radius: 20upx;
	background: none;
}

.checked {
	color: #b2bbbe;
}

.checkOrder {
	color: #83cbac;
}

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
	border-bottom: 1px solid #bebebe;
	color: #b2b2b2;
}

.mdListBox view:nth-of-type(1) {
	font-size: 40upx;
	color: #83cbac;
	margin-bottom: 10upx;
	/* font-weight: bold; */
}
</style>
