<template>
	<view>
		<view class="box" v-if="hlsList.length == 0 ? false : true">
			<view style="font-weight: bold;font-size: 35upx;">{{ month }} 月 {{ year }}</view>
			<scroll-view scroll-x="true">
				<block v-for="(item, index) in dayList" :key="index">
					<view class="dayTitle" :class="current == index ? 'select' : ''" @click="timeSelectd(index)">
						<view>{{ item.day }}</view>
						<view v-if="index == 0" style="font-size: 25upx;">今天</view>
						<view v-else style="font-size: 25upx;">星期{{ item.week }}</view>
					</view>
				</block>
			</scroll-view>
			<view class="timeItem">
				<view class="NoData" v-if="timeList.length <= 0">护理老师今日休息</view>
				<block v-for="(item, index) in timeList" :key="index">
					<view class="timechild" :class="[timeIndex == index ? 'tabselected' : '', item.isSelect == true ? 'select_true' : '']"
					 @click="tabClick(index, item)">
						{{ item.time }}
						<label class="labelfont" v-if="item.start == 1">&nbsp;已预约</label>
					</view>
				</block>
			</view>
		</view>
		<view v-if="hlsList.length <= 0 ? false : true" class="btn">
			<button type="default" :disabled="timeIndex == -1 ? true : false" :class="timeIndex == -1 ? '' : 'notstop'" @click="submitBtn">确定</button>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue';
	import common from '../../common/common.js';
	import schedulTime from '../../common/date.js';
	import api from '../../common/http.js';
	export default {
		data() {
			return {
				isShow: false,
				current: 0,
				dayList: [],
				month: new Date().getMonth() + 1,
				year: new Date().getFullYear(),
				timeIndex: -1,
				timeList: [],
				nowDate: common.GetNowTime(new Date()),
				xzTime: '',
				hlsList: uni.getStorageSync('customer').data.listEmployees,
				employeeID: '', //护理师id
				userPhone: '', //用户手机号
				timediff: 30 //时间差
			};
		},
		onShow() {},
		onLoad() {
			this.dayList = common.weekDate().dayList;
			//获取护理师id
			let t = uni.getStorageSync('customer').data;
			if (t != '' && t != null && t != undefined) {
				this.userPhone = t.Phone;
				if (t.listEmployees.length > 0) {
					this.employeeID = t.listEmployees[0].ID;
					//如果预约哪里选择的有时间直接用哪里的时间 显示出来
					if (
						Vue.prototype.$current != undefined &&
						Vue.prototype.$selectDate != undefined &&
						Vue.prototype.$selectTime != undefined &&
						Vue.prototype.$timeIndex != undefined
					) {
						this.current = Vue.prototype.$current;
						this.timeIndex = Vue.prototype.$timeIndex;
						this.nowDate = Vue.prototype.$selectDate;
						this.xzTime = Vue.prototype.$selectTime;
						this.getschedultime(this.employeeID, Vue.prototype.$selectDate);
					} else {
						//加载当前选中的护理师的排班时间
						this.getschedultime(this.employeeID, this.nowDate);
					}
				}
			} else {
				uni.showToast({
					title: '登录信息有误,请重新登录',
					mask: true,
					duration: 2000
				});
				return;
			}
		},
		methods: {
			// 日期选择
			timeSelectd(index) {
				let _this = this;
				_this.xzTime = ''; //选择别的日期时间时把当前选择的时间段为空
				_this.current = index;
				let newDate='';
				let date = '';
				let y = _this.dayList[index].year;
				let m = '';
				let d = '';
				//判断月份
				if (_this.dayList[index].month >= 10) {
					m = '-'+ _this.dayList[index].month + '-';

				} else {
					m = '-0'+ _this.dayList[index].month + '-';
				}
				//判断天
				if (_this.dayList[index].day >= 10) {
					d = _this.dayList[index].day
				} else {
					d = '0'+ _this.dayList[index].day
				}
				date = y + m + d;
				 newDate = common.GetNowTime(new Date(date)); 
				_this.month = _this.dayList[index].month;
				_this.timeIndex = -1;
				_this.nowDate = newDate;
				//点击日期查询不同日期的排班情况  
				  _this.getschedultime(_this.employeeID, newDate); 
			},
			// 时间段选择
			tabClick(index, item) {
				let selectedtime = this.timeList[index].time; //选中的时间段
				let n = schedulTime.getNowMinutes(); //当前时间
				//日期是否为同一天 true 是
				var d = schedulTime.getNowFullYear();
				var isequal = schedulTime.dateIsEqual(d, this.nowDate);
				//计算小时差 大于30分钟才能预约
				var hour = schedulTime.shortDataDiff(n, selectedtime, this.timediff);

				if (!isequal && item.start == 0 && item.isSelect == true) {
					this.timeIndex = index;
					this.xzTime = selectedtime;
				} else if (isequal && hour && item.start == 0 && item.isSelect == true) {
					this.timeIndex = index;
					this.xzTime = selectedtime;
				} else {
					return;
				}
			},
			//获取护理师的排班信息
			getschedultime(employeeId, worktime) {
				let _this = this;
				uni.showLoading({
					title: '正在加载...',
					mask: true
				});

				api.httpRequestGet('CustomerReserva/StoreBySchedul', {
					EmployeeId: employeeId,
					workTime: worktime,
					phone: _this.userPhone
				}).then(res => {
					let tm = res.data.data;
					if (tm != null && tm.length > 0) {
						//排班时间设置参数
						let param = uni.getStorageSync('schedulparam');
						if (param != '' || param != null) {
							_this.timediff = param.TimeDiff;
							_this.timeList = schedulTime.timeData(param.StartTime, param.EndTime, param.TimeInterval);
						} else {
							_this.timeList = schedulTime.timeData();
						}
						//日期是否为同一天 true 是
						let d = schedulTime.getNowFullYear();
						let isequal = schedulTime.dateIsEqual(d, worktime);
						let n = schedulTime.getNowMinutes(); //当前系统时间

						tm.forEach(x => {
							_this.timeList.forEach((e, index) => {
								let exits = e.time.includes(x.time);
								if (exits) {
									_this.timeList[index].start = x.start;
									//计算小时差 大于30分钟才能预约
									let hour = schedulTime.shortDataDiff(n, x.time, _this.timediff);
									if (!isequal && x.start == 0) {
										_this.timeList[index].isSelect = true;
									} else if (isequal && x.start == 0 && hour) {
										_this.timeList[index].isSelect = true;
									}
								}
							});
						});
					} else {
						_this.timeList = [];
					}
					uni.hideLoading();
				});
			},
			// 确定选择预约的时间按钮
			submitBtn() {
				let n = schedulTime.getNowMinutes(); //当前时间
				//日期是否为同一天 true 是
				var d = schedulTime.getNowFullYear();
				var isequal = schedulTime.dateIsEqual(d, this.nowDate);
				//计算小时差 大于30分钟才能预约
				var hour = schedulTime.shortDataDiff(n, this.xzTime, this.timediff);

				if (!isequal) {
					uni.switchTab({
						url: '../index/index'
					});
				} else if (isequal && hour) {
					uni.switchTab({
						url: '../index/index'
					});
				} else {
					uni.showToast({
						title: '当前时间段小于30分钟或者已被预约',
						mask: true,
						duration: 2000
					});
					return;
				}
				Vue.prototype.$selectDate = this.nowDate;
				Vue.prototype.$selectTime = this.xzTime;
				Vue.prototype.$current = this.current;
				Vue.prototype.$timeIndex = this.timeIndex;
			}
		}
	};
</script>

<style scoped>
	.box {
		padding: 30upx;
	}

	scroll-view {
		padding: 20upx 0;
		width: 100%;
		white-space: nowrap;
	}

	.dayTitle {
		width: 120upx;
		height: 120upx;
		border-radius: 120upx;
		margin-left: 20upx;
		text-align: center;
		display: inline-block;
		padding-top: 20upx;
	}

	.select {
		color: #ffffff;
		background-color: #83cbac;
	}

	.timeItem {
		display: flex;
		flex-wrap: wrap;
	}

	.timechild {
		padding: 20upx 0;
		/* background-color: #dedede; */
		color: #999999;
		border-radius: 5upx;
		margin: 15upx 1.5%;
		text-align: center;
		width: 30%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.select_true {
		border: 4upx solid #83cbac;
		/* border: 4upx solid #F76260; */
	}

	.tabselected {
		color: #ffffff;
		/* font-weight: bold; */
		background-color: #83cbac;
	}

	.btn {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.notstop {
		background-color: #83cbac;
		color: #ffffff;
	}


	.labelfont {
		font-size: 22rpx;
		color: #f76260;
	}

	.NoData {
		font-size: 40rpx;
		margin-top: 280rpx;
		color: #a1a1a1;
		padding-left: 223rpx;
	}

	button {
		font-weight: 550;
	}
</style>
