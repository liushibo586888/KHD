<template>
	<view class="xiaView">
		<view class="xiaViewChild" @click="subscribe">
			<image class="mineImg" src="../../static/tabbarImg/msg.png"></image>
			<text>消息通知授权</text>
		</view>

		<view class="xiaViewChild" @click="logout">
			<image class="mineImg" src="../../static/tabbarImg/logout.png"></image>
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
import api from '../../common/http.js';
export default {
	data() {
		return {};
	},
	methods: {
		subscribe() {
			uni.requestSubscribeMessage({
				tmplIds: ['HLASxqUGFHt4ajy69Yb32hm_0kl80pGzdj_MastQ4x4', 'Vqg_Jt1y8og1BctQ1Ho1QSD9QGbWkT0tiG35aVIO-R8', 'mFZ2vrY2IlyDDnu6sDT98k_Xu6AY5Q3o9c-di3LuT_A'],
				success(res) {
					if (res.errMsg == 'requestSubscribeMessage:ok') {
						uni.showToast({
							mask: true,
							title: '已授权',
							duration: 500,
							icon: 'none'
						});
					}
				},
				fail(f) {
					uni.showToast({
						mask: true,
						title: '授权失败',
						duration: 500,
						icon: 'none'
					});
				}
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
							uni.reLaunch({
								url: '../login/login'
							});
						}, 500);
					} else if (res.cancel) {
					}
				}
			});
		}
	}
};
</script>

<style>
	
	.xiaView {
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
</style>
