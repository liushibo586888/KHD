<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map
					id="localCenter"
					style="width: 100vw;height:100vh;"
					:latitude="latitude"
					:longitude="longitude"
					@callouttap="callouttap"
					show-location
					scale="12"
					:markers="covers"
				></map>
			</view>
		</view>
		<view class="hideModel" v-show="calloutDetailsTF" @click="showModel"></view>
		<view class="MapBottom" v-show="calloutDetailsTF">
			<view class="MapBottomL">
				<view class="calloutDetailsTitle">{{ calloutDetailsTitle }}</view>
				<view>{{ calloutDetailsAddress }}</view>
				<view @click="CallPhone(calloutDetailsPhone)">{{ calloutDetailsPhone }}</view>
			</view>
			<view @click="mapOpen" class="MapBottomR"><image mode="widthFix" src="../../static/tabbarImg/guide.png"></image></view>
		</view>
	</view>
</template>

<script>
import api from '../../common/http.js';
export default {
	data() {
		return {
			id: 0,
			title: 'map',
			latitude: 39.909,
			longitude: 116.39742,
			covers: [],
			calloutDetailsTF: false,
			calloutDetailsTitle: '',
			calloutDetailsAddress: '',
			calloutDetailsPhone: '',
			calloutDetailslatitude: '',
			calloutDetailslongitude: ''
		};
	},
	onShow() {
		// let localCenter = uni.createMapContext('localCenter')
		// localCenter.moveToLocation()
	},
	methods: {
		CallPhone(calloutDetailsPhone) {
			uni.makePhoneCall({
				phoneNumber: calloutDetailsPhone //仅为示例
			});
		},
		mapOpen() {
			uni.openLocation({
				name: this.calloutDetailsTitle,
				address: this.calloutDetailsAddress,
				latitude: this.calloutDetailslatitude,
				longitude: this.calloutDetailslongitude,
				success() {
					// console.log('success');
				}
			});
		},
		callouttap(e) {
			this.calloutDetailsTF = true;
			let i = e.markerId;
			let c = this.covers;
			this.calloutDetailsTitle = c[i].title;
			this.calloutDetailsAddress = c[i].address;
			this.calloutDetailsPhone = c[i].phone;
			this.calloutDetailslatitude = c[i].latitude;
			this.calloutDetailslongitude = c[i].longitude;
		},
		showModel() {
			this.calloutDetailsTF = false;
		}
	},
	onLoad() {
		let that = this;
		uni.getLocation({
			type: 'wgs84',
			altitude: true,
			success(res) {
				var markers = new Array();
				// console.log('当前位置的经度：' + res.longitude);
				// console.log('当前位置的纬度：' + res.latitude);
				that.latitude = res.latitude;
				that.longitude = res.longitude;
				api.httpRequestGet('NewClient/GetStoreAllByMap', {
					CityId: '',
					LatItude: res.latitude,
					LongItude: res.longitude
				}).then(res => {
					// console.log(res.data.data.list);
					let mapData = res.data.data.list;
					for (let i = 0; i < mapData.length; i++) {
						let mapInfo = {
							id: i,
							title: mapData[i].StoreName,
							latitude: mapData[i].LatItude,
							longitude: mapData[i].LongItude,
							phone: mapData[i].Phone,
							address: mapData[i].Address,
							iconPath: '/static/tabbarImg/locate.png',
							callout: {
								content: mapData[i].StoreName,
								fontSize: '16',
								borderRadius: '10',
								bgColor: '#ffffff',
								padding: '10',
								display: 'ALWAYS'
							}
						};
						markers.push(mapInfo);
					}
					// console.log(markers);
					that.covers = markers;
				});
			},
			fail() {
				uni.getSetting({
					success(res) {
						let statu = res.authSetting;

						if (!statu['scope.userLocation']) {
							uni.showModal({
								title: '是否授权当前位置',
								content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
								success(tip) {
									if (tip.confirm) {
										uni.openSetting({
											success(data) {
												if (data.authSetting['scope.userLocation'] === true) {
													uni.showToast({
														title: '授权成功',
														icon: 'success',
														duration: 1000
													});
													setTimeout(() => {
														uni.redirectTo({
															url: '../map/map'
														});
													}, 1000);
												} else {
													uni.showToast({
														title: '授权失败',
														icon: 'success',
														duration: 1000
													});
												}
											}
										});
									}
								}
							});
						}
					},
					fail() {
						uni.showToast({
							title: '调用授权窗口失败',
							duration: 1000
						});
					}
				});
			}
		});
	}
};
</script>

<style>
.hideModel {
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: 0;
}
.MapBottom {
	background-color: white;
	position: fixed;
	bottom: 0;
	width: 100vw;
	height: 20vh;
	padding: 20upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.MapBottomL {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100%;
}
.MapBottomR,
.MapBottomR image {
	width: 60upx;
	height: 60upx;
	margin-right: 15upx;
}
.calloutDetailsTitle {
	color: #83cbac;
	font-size: 40upx;
}
</style>
