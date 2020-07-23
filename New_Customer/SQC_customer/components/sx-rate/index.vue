<template>
  <view
    class="rate-box"
    :class="[{animation},containerClass]"
   
  > 
<!--   <view
    class="rate-box"
    :class="[{animation},containerClass]"
    @touchmove="ontouchmove"
    @touchend="touchMoving=false"
  > -->
    <view
      v-for="(val,i) in list"
      :key="val"
      class="rate"
      :style="{fontSize, paddingLeft: i!==0 ? rateMargin : 0, paddingRight: i<list.length-1 ? rateMargin : 0, color: val<=rateValue ? activeColor : defaultColor}"
      :class="[{scale: !disabled && val<=rateValue && animation},`rate-${i}`,rateClass]"
      :data-val="val"
      @click="onItemClick"
    >
      <text class="iconfont icon-star" />
    </view>
  </view>
</template>

<script>
  import {getClientRect} from "./common";

  export default {
    name: 'sxRate',
    props: {
      // 当前值
      value: {
        type: Number,
        default: 3
      },
      // 最大星星数量
      max: {
        type: Number,
        default: 5
      },
      // 禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 动画效果
      animation: {
        type: Boolean,
        default: true
      },
      // 默认星星颜色
      defaultColor: {
        type: String,
        default: '#ccc'
      },
      // 滑选后星星颜色
      activeColor: {
        type: String,
        default: '#83cbac'
      },
      // 星星大小
      fontSize: {
        type: String,
        default: 'inherit'
      },
      // 星星间距
      margin: {
        type: String,
        default: ''
      },
      // 自定义类名-容器
      containerClass: {
        type: String,
        default: ''
      },
      // 自定义类名-星星
      rateClass: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        rateValue: 0,
        startX: [],
        startW: 30
      }
    },
    computed: {
      list() {
        return [...new Array(this.max)].map((_, i) => i + 1)
      },
      rateMargin() {
        let margin = this.margin;
        if (!margin)
          return 0;

        switch (typeof margin) {
          case "number":
            margin += 'px';
          case "string":
            break;
          default:
            return 0;
        }

        let reg = /^(\d+)([^\d]*)/;
        let result = reg.exec(margin);
        if (!result)
          return 0;

        let [_, num, unit] = result;
        return num / 2 + unit;
      }
    },
    watch: {
      value: {
        handler(val) {
          this.rateValue = val;
        },
        immediate: true
      }
    },
    methods: {
      // 计算星星位置
      async initStartX() {
        let {max} = this;
        this.startX = [];

        for (let i = 0; i < max; i++) {

          let selector = `.rate-${i}`;
          let {left, width} = await getClientRect(selector, this);

          this.startX.push(left);
          this.startW = width;
        }
      },

      /**
       * 手指滑动事件回调
       * https://github.com/sunxi1997/uni-app-sx-rate/pull/1
       * 原本的触摸处理在自定了样式后可能会出现bug, 已解决
       */
      // async ontouchmove(e) {
      //   if (!this.touchMoving) {
      //     this.touchMoving = true;
      //     // 开始手指滑动时重新计算星星位置,防止星星位置意外变化
      //     await this.initStartX();
      //   }

      //   let {startX, startW, max} = this;
      //   let {touches} = e;

      //   // 触摸焦点停留的位置
      //   let {pageX} = touches[touches.length - 1];


      //   // 超出最左边, 0 星
      //   if (pageX <= startX[0])
      //     return this.toggle(1);

      //   // 刚好在第一颗星
      //   else if (pageX <= startX[0] + startW)
      //     return this.toggle(1);

      //   // 超出最右边, 最大星
      //   else if (pageX >= startX[max - 1])
      //     return this.toggle(max);

      //   //计算星星停留的位置
      //   let startXHash = startX.concat(pageX).sort((a, b) => a - b);
      //   this.toggle(startXHash.indexOf(pageX));
      // },
      // 点击回调
      onItemClick(e) {
        let {val} = e.currentTarget.dataset;
        this.toggle(val)
      },
      // 修改值
      toggle(val) {
        let {disabled} = this;
        if (disabled)
          return;
        if (this.rateValue !== val) {
          this.rateValue = val;
          this.$emit('update:value', val);
          this.$emit('change', val)
        }
      }
    },
    mounted() {

    },
  }
</script>

<style scoped>
 
  @font-face {
  	font-family: "iconfont";
  	src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAK8AAsAAAAABnAAAAJwAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAp8gQgBNgIkAwgLBgAEIAWEbQcuG6wFyA4lTcHACOEZBUg8fL/2O3f3fTHEkoh28SSayCSxkkgQG6Uz3UvYITu9Qr5K0Vh6Ij6f+8CXKzVBHDvWa6d0lSfK57mc3gQ6kGt8oBz3ojUG9QLqxYEU6B4YRVYqecPYBS7hMYG6QWF0dlOycoGxxFoViFuxkALGuYAksXRVKNccTOJdSTV7zbSAt/D78Y8XxmRKOavq5CZZAOK+7u2svLVode0TggR0vIQc84BEXNQmjugJxumpJ/SNAvsqD77ui8K3i71aBPvrrNIm6IfSe5K58ltNZ3BbU40Blkf9OmKsIW/Un1qddc4dcSma3ArIX7PPXdlxK5l2zJ+aD6TXnQqmu330wqpeWkYN/OnNm/0trU+YvqNR4UN99f+x/tApIFTfR7u39X4gKPnb9pOX5RAQB6DYyc/zOKCD4OUp6KiiPeqnapbAp56NdegrdhLo5wKq+3UG/0fWcyDpCsuWJVVWO5oZO29bXR0FwJ4uV2ONvTeTCVW9I1wVAylyVeNkYudR0rCOsqoN1M1JPd7QDdMTqYZZXQChwwYybT6Q63BIJvYSJX1eUNYReqi7CrsLGyZDbJqIEUWQAPLroJhWKhjHQUyj8mwkrJJROKsI+XyENeIw5LI4xXQqUiA8xxZNtZBHCAMZrJTDFPAcksmUUIWVEkQTlogQVQSbzdS9iUUr5cDUDgyhEIgAxFcHEqMpKTD+eMK09PlsiFAVGQpu6atJ5kMwDfHsEBcLpweZqlX06ruXVzSqCfEQBANiYEpyUAqYh8jIKEGq+nkSCI1gEY2IqURg28OYvlrW+nr5152AOsuUhV2fSy+EwgAAAA==') format('woff2'),
	url(data:font/truetype;charset=utf-8;base64,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) format('truetype');
  }
  
  .iconfont {
  	font-family: "iconfont" !important;
  	font-size: inherit;
  	font-style: normal;
  	-webkit-font-smoothing: antialiased;
  	-moz-osx-font-smoothing: grayscale;
  }
  
  .icon-star:before {
  	content: "\e6e3";
  }

  .rate-box {
    min-height: 1.4em;
    display: flex;
    align-items: center;
  }

  .rate {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 1.2em;
    transition: all .15s linear;
  }

  .rate.scale {
    transform: scale(1.1);
  }
</style>
