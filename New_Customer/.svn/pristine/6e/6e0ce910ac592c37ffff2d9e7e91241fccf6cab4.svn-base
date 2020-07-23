<template>
	<view>
		<view class="logoView">
			<image :src="imgSrc" mode="widthFix"></image>
			<view class="nameView">
				<text v-if="userName != undefined && CustomerInfo != undefined">
					{{ userName }}&nbsp;({{ CustomerInfo.CustomerName != undefined ? CustomerInfo.CustomerName : '' }})
				</text>
				<text>塑青春科技祛痘{{ CustomerInfo.CustomerStoreName != undefined && CustomerInfo.CustomerStoreName != null ? CustomerInfo.CustomerStoreName : '' }}欢迎您</text>
			</view>
		</view>
		<view class="zhongView">
			<view class="zhongBox">
				<view class="zhongViewChild" @click="yyjlClick">
					<image class="mineImg" src="../../static/tabbarImg/list.png"></image>
					<text>预约记录</text>
				</view>
				<view class="zhongViewChild" @click="ddjlClick">
					<image class="mineImg" src="../../static/tabbarImg/register.png"></image>
					<text>到店记录</text>
				</view>
				<view class="zhongViewChild red" @click="costCheck">
					<image class="mineImg" src="../../static/tabbarImg/cost.png"></image>
					<text>消费确认</text>
					<view v-if="redPointCost >= 100" class="redPoint redPointCost">99+</view>
					<view v-else-if="redPointCost == 0 ? false : true" class="redPoint redPointCost">{{ redPointCost }}</view>
				</view>
			</view>
		</view>
		<view class="xiaView">
			<view class="xiaViewChild" @click="xxzxqr">
				<image class="mineImg" src="../../static/tabbarImg/check.png"></image>
				<text>项目护理确认</text>
				<view v-if="redPoint >= 100" class="redPoint">99+</view>
				<view v-else-if="redPoint == 0 ? false : true" class="redPoint">{{ redPoint }}</view>
				<image class="mineImg" src="../../static/tabbarImg/rArrow.png"></image>
			</view>

			<view class="xiaViewChild" @click="subscribe">
				<image class="mineImg" src="../../static/tabbarImg/msg.png"></image>
				<text>消息通知授权</text>
			</view>
			
			<navigator hover-class="none" class="xiaViewChild" url="../map/map">
				<image class="mineImg" src="../../static/tabbarImg/chain.png"></image>
				<text>门店详情</text>
				<image class="mineImg" src="../../static/tabbarImg/rArrow.png"></image>
			</navigator>

 
			<view class="xiaViewChild" @click="logout">
				<image class="mineImg" src="../../static/tabbarImg/logout.png"></image>
				<text>退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue';
	import api from '../../common/http.js';
	export default {
		data() {
			return {
				userName: uni.getStorageSync('UserInfo').nickName,
				imgSrc: uni.getStorageSync('UserInfo').avatarUrl,
				redPoint: 0,
				CustomerInfo: uni.getStorageSync('customer').data, //客户名称
				redPointCost: 0
			};
		},
		onShow() {
			uni.hideHomeButton();
			this.getRedPoint(); //获取执行项目未确认的数字
		},
		created() {
			const updateManager = uni.getUpdateManager();

			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function(res2) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好,是否重启应用',
							showCancel: false,
							success(res2) {
								if (res2.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
				}
			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '提示',
					content: '检查到有新版本，但下载失败，请检查网络设置',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
		},
		onLoad() {
			Vue.prototype.$mdName = '门店';
			Vue.prototype.$hlsName = '护理老师';
			Vue.prototype.$selectDate = '';
			Vue.prototype.$selectTime = '';

			// this.$loginBol 是否是重新授权过来 如果是this.$loginBol值为true 否则是undefined
			if (this.$loginBol == undefined) {
				uni.showLoading({
					title: '正在登录...',
					mask: true
				});
				uni.checkSession({
					success: () => {
						let d = uni.getStorageSync('customer');
						if (d != null && d.data != undefined && d.data.CustomerID != null && d.data.Phone != null && d.data.OpenID !=
							null) {
							let cust = d.data;
							api.httpRequestGet('NewClient/CustomerPhoneNumber', {
								openid: cust.OpenID,
								phone: cust.Phone
							}).then(result => {
								let res = result.data;
								if (res.error_code == 'Success') {
									uni.setStorageSync('customer', res);
									uni.hideLoading();
									// this.getRedPoint(); //获取执行项目未确认的数字
								} else {
									uni.showToast({
										title: '登录失败,请重新登录',
										mask: true,
										icon: 'none',
										duration: 2000
									});
									setTimeout(function() {
										uni.reLaunch({
											url: '../login/login'
										});
									}, 500);
								}
							});
						} else {
							uni.showToast({
								title: '登录已过期,请重新登录',
								mask: true,
								icon: 'none',
								duration: 2000
							});
							setTimeout(function() {
								uni.reLaunch({
									url: '../login/login'
								});
							}, 500);
						}
					},
					fail: result => {
						uni.showToast({
							title: '登录已过期,请重新登录',
							mask: true,
							icon: 'none',
							duration: 2000
						});
						setTimeout(function() {
							uni.reLaunch({
								url: '../login/login'
							});
						}, 500);
					}
				});
			}
			this.getEvaluate(); //获取评价内容
		},
		methods: {
			subscribe() {
				uni.requestSubscribeMessage({
					tmplIds: ['HLASxqUGFHt4ajy69Yb32hm_0kl80pGzdj_MastQ4x4','Vqg_Jt1y8og1BctQ1Ho1QSD9QGbWkT0tiG35aVIO-R8'],
					success(res) {
						if (res.errMsg == 'requestSubscribeMessage:ok') {
							uni.showToast({
								mask: true,
								title: '已授权',
								duration: 500,
								icon: 'none'
							})
						}
					},
					fail(f) {
						uni.showToast({
							mask: true,
							title: '授权失败',
							duration: 500,
							icon: 'none'
						})
					}

				});
			},
			//获取评价的内容
			getEvaluate() {
				api.httpRequestGet('Complaints/Evaluate').then(res => {
					if (res.data.error_code == 'Success') {
						uni.setStorageSync('evaluate', res.data.data);
					}
				});
			},
			// 点击预约记数量
			async getRedPoint() {
				if (uni.getStorageSync('customer') != null && uni.getStorageSync('customer').data != undefined) {
					await api
						.httpRequestGet('NewClient/NotConfirmItemExcute', {
							CustomerID: uni.getStorageSync('customer').data.CustomerID
						})
						.then(res => {
							// console.log(res.data.data)
							this.redPoint = res.data.data;
						});
					await api
						.httpRequestGet('NewClient/NotConsumptionConfirm', {
							CustomerID: uni.getStorageSync('customer').data.CustomerID
						})
						.then(res => {
							//console.log(res.data.data);
							this.redPointCost = res.data.data;
						});
				}
			},
			//排班的参数
			schedulParam() {
				api.httpRequestGet('CustomerReserva/SetSchedulInfo').then(res => {});
			},
			yyjlClick() {
				// let data = this.dataList[index].slist;
				// data['typeUrl']='NewAudit/AuditNursingPerformanceTargetNew'
				// data = JSON.stringify(data);
				uni.navigateTo({
					url: '../yyjl/yyjl'
				});
			},
			ddjlClick() {
				uni.navigateTo({
					url: '../ddjl/ddjl'
				});
			},
			xxzxqr() {
				uni.navigateTo({
					url: '../check/check'
				});
			},
			costCheck() {
				uni.navigateTo({ 
					url: '../costCheck/costCheck'
				});
			},
			logout() {
				uni.showModal({
					title: '提示:',
					content: '确认退出吗,退出后需要重新登录',
					success(res) {
						if (res.confirm) {
							uni.removeStorageSync('customer');
							setTimeout(() => {
								uni.redirectTo({
									url: '../login/login'
								});
							}, 500);
						} else if (res.cancel) {}
					}
				});
			}
		}
	};
</script>

<style scoped>
	.redPoint {
		background-color: #ee3f4d;
		border-radius: 10000upx;
		width: 60upx;
		height: 60upx;
		color: white;
		margin-right: 18upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.red {
		position: relative;
	}

	.redPointCost {
		width: 30upx;
		height: 30upx;
		font-size: 18upx;
		position: absolute;
		right: 0;
		top: 0;
	}

	.logoView {
		display: flex;
		padding: 30upx 100upx;
		background-color: #83cbac;
	}

	.logoView image {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.nameView {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		margin-left: 50upx;
		color: #ffffff;
	}

	.nameView text:nth-of-type(1) {
		/* font-size: 50upx; */
		font-weight: bold;
	}

	.zhongView {
		background-color: #83cbac;
		padding: 0 30upx;
	}

	.zhongBox {
		display: flex;
		background-color: #ffffff;
		justify-content: space-around;
		padding: 50upx;
	}

	.zhongViewChild {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.zhongViewChild text {
		color: #505050;
	}

	.xiaView {
		margin-top: 50upx;
		padding: 0 30upx;
		color: #6c6c6c;
		min-height: 50vh;
	}

	.xiaViewChild {
		display: flex;
		align-items: center;
		padding: 30upx 0;
		border-bottom: 1px solid #f3f3f3;
	}

	.xiaViewChild text {
		font-size: 38upx;
		flex: 1;
	}

	.xiaViewChild image {
		width: 66upx;
		height: 66upx;
		margin-right: 30upx;
	}

	/* //////////////////// */
	.zzc {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
	}

	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}

	.zhongViewChild .mineImg {
		width: 60upx;
		height: 60upx;
	}
</style>
