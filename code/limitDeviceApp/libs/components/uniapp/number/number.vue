<template>
  <view
    class="uni-numbox"
    :class="{ 'small': size==='small'}"
  >
    <view
      :class="{'uni-numbox--disabled': inputValue <= min || disabled}"
      class="uni-numbox__minus"
      @click="_calcValue('minus')"
    >
      -
    </view>
    <input
      :disabled="true"
      v-model="inputValue"
      class="uni-numbox__value"
      type="number"
      @blur="_onBlur"
    >
    <view
      :class="{'uni-numbox--disabled': inputValue >= max || disabled || plusLock}"
      class="uni-numbox__plus"
      @click="_calcValue('plus')"
    >
      +
    </view>
  </view>
</template>
<script>
export default {
  name: 'XnwNumber',
  props: {
    value: {
      type: [Number, String],
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: [Number, String],
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plusLock: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'big'
    }
  },
  data () {
    return {
      inputValue: 0
    }
  },
  watch: {
    value (val) {
      this.inputValue = +val
    },
    inputValue (newVal, oldVal) {
      if (+newVal !== +oldVal) {
        this.$emit('change', newVal)
      }
    }
  },
  created () {
    this.inputValue = +this.value
  },
  methods: {
    _calcValue (type) {
      if (this.disabled) {
        return
      }
      const scale = this._getDecimalScale()
      let value = this.inputValue * scale
      let step = this.step * scale
      if (type === 'minus') {
        value -= step
      } else if (type === 'plus') {
        if (this.plusLock) return
        value += step
      }
      if (value < this.min || value > this.max) {
        return
      }
      this.inputValue = value / scale
    },
    _getDecimalScale () {
      let scale = 1
      // 浮点型
      if (~~this.step !== this.step) {
        scale = Math.pow(10, (this.step + '').split('.')[1].length)
      }
      return scale
    },
    _onBlur (event) {
      let value = event.detail.value
      if (!value) {
        this.inputValue = 0
        return
      }
      value = +value
      if (value > this.max) {
        value = this.max
      } else if (value < this.min) {
        value = this.min
      }
      this.inputValue = value
    }
  }
}
</script>
<style lang="scss">
.uni-numbox {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 70rpx;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    transform-origin: center;
    box-sizing: border-box;
    pointer-events: none;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    border: 1px solid #c8c7cc;
    border-radius: 12rpx;
    transform: scale(0.5);
  }

  &__minus,
  &__plus {
    margin: 0;
    background-color: #f8f8f8;
    width: 70rpx;
    font-size: 40rpx;
    height: 100%;
    line-height: 70rpx;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #333;
    position: relative;
  }

  &__value {
    position: relative;
    background-color: #fff;
    width: 80rpx;
    height: 100%;
    text-align: center;
    padding: 0;

    &:after {
      content: "";
      position: absolute;
      transform-origin: center;
      box-sizing: border-box;
      pointer-events: none;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      border-style: solid;
      border-color: #c8c7cc;
      border-left-width: 1px;
      border-right-width: 1px;
      border-top-width: 0;
      border-bottom-width: 0;
      transform: scale(0.5);
    }
  }

  &--disabled {
    color: #c0c0c0;
  }
}
.uni-numbox.small {
  height: 50rpx;

  .uni-numbox__minus,
  .uni-numbox__plus,
  .uni-numbox__value {
    width: 50rpx !important;
    font-size: 30rpx !important;
    line-height: 50rpx !important;
  }
}
</style>
