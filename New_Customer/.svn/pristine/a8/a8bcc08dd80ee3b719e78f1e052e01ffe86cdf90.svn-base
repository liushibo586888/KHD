<template>
	<view class="padding margin-top-30">
		<view class="text-large">
			<view class="text-Bcyan margin-top-15">1. 请您授权消息通知的权限、到店消费、护理后便于信息确认；</view>
			<view class="text-Bcyan margin-top-15">2. 塑青春门店前台收银，消费金额请在小程序确认；</view>
			<view class="text-Bcyan margin-top-15">3. 如有疑问，请与总监或前台联系。</view>
		</view>
		<view class="w100"><image @click="subscribe" class="w100" src="../../static/subscribe.jpg" mode="widthFix"></image></view>

		<!-- <button @click="subscribe" class="bg-cyan text-white">消息通知授权</button> -->
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onLoad() {
		uni.hideHomeButton();
		uni.hideShareMenu();
	},
	methods: { 
		subscribe() {
			uni.requestSubscribeMessage({
				tmplIds: ['HLASxqUGFHt4ajy69Yb32hm_0kl80pGzdj_MastQ4x4','Vqg_Jt1y8og1BctQ1Ho1QSD9QGbWkT0tiG35aVIO-R8'],
				complete(res) { 
					if(res.errMsg=='requestSubscribeMessage:ok')
					{
						uni.showToast({
							title:'授权成功',
							icon:'none',
							mask:true,
							duration:2000
						})
					}
					else
					{
						uni.showToast({
							title:'授权失败',
							icon:'none',
							mask:true,
							duration:2000 
						})
					}
					uni.reLaunch({
						url: '../mine/mine'
					});
					// uni.switchTab({
					// 	url: '../mine/mine'
					// });
				}
			});
		}
	}
};
</script>

<style>
.w100 {
	width: 100%;
}
.margin-top-30 {
	margin-top: 60rpx;
}
.margin-top-15 {
	margin-top: 30rpx;
}
.padding {
	padding: 15rpx;
}
.text-large {
	font-size: 30rpx;
}
.text-Bcyan {
	color: #64a488;
}
.bg-cyan {
	background-color: #83cbac;
}
.text-white {
	color: white;
}
</style>
