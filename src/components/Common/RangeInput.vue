<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
  rangeValue: {
    type: [Number, String],
    default: 0,
  },

  unit: {
    type: String,
    default: '',
  },

  updateRangeValue: {
    type: Function,
    default: () => {},
  },

  max: {
    type: Number,
    default: 100,
  },
})

const rangeInput = ref(null)
const indicator = ref(null)

const numericRangeValue = computed(() => Number(props.rangeValue))

const setRangeValue = (e) => {
  if (!rangeInput.value) return

  const target = rangeInput.value
  const value = e?.target?.value ?? numericRangeValue.value

  let gradientValue = 100 / target.attributes.max.value
  target.style.background =
    'linear-gradient(to right, #4f46E5 0%, #4f46E5 ' +
    gradientValue * value +
    '%, rgb(204, 204, 204) ' +
    gradientValue * value +
    '%, rgb(204, 204, 204) 100%)'


  updateIndicatorPosition()
  props.updateRangeValue(value)
}

const updateIndicatorPosition = () => {
  if (!rangeInput.value || !indicator.value) return

  const input = rangeInput.value
  const indicatorEl = indicator.value

  const min = input.min ? input.min : 0
  const max = input.max ? input.max : 100
  const val = input.value

  const rangeWidth = input.offsetWidth
  const thumbWidth = 20
  const offset = ((val - min) / (max - min)) * (rangeWidth - thumbWidth) + thumbWidth / 2

  indicatorEl.style.left = `${offset}px`
  indicatorEl.textContent = val
}

const computedUnit = computed(() => {
  return props.unit === 'deg' ? '°' : props.unit
})
// Initialize the range value on mount
onMounted(() => {
  setRangeValue()
})

watch(numericRangeValue, (newVal) => {
  setRangeValue()
})
</script>
<template>
  <div class="flex gap-4">
    <!-- BAR -->
    <label class="relative max-w-[90%] grow customRange">
      <input
        ref="rangeInput"
        @input="setRangeValue($event)"
        type="range"
        :value="numericRangeValue"
        :min="0"
        :max="max"
        class="w-full slider"
      />
      <!-- <span ref="indicator" class="indicator">{{ rangeValue }}</span> -->
    </label>
    <p class="relative">
      <input
        @input="setRangeValue($event)"
        class="w-[84px] pr-8 input-dark "
        type="text"
        :value="numericRangeValue"
      />
      <span 
        class="absolute text-sm -translate-y-1/2 top-1/2 right-2"
        :class="[props.unit === 'deg' && '!top-1 !-translate-y-0',]"
      >{{ computedUnit }}</span>
    </p>
  </div>
</template>

<style scoped>
label.customRange > .slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px; /* Adjust height as needed */
  background: #f0f0f2; /* Default bar color */
  border-radius: 5px; /* Round the corners of the bar */
  outline: none;
  /* opacity: 0.7; */
  background: linear-gradient(to right, #4f46e5 0%, #4f46e5 0%, #f0f0f2 0%, #f0f0f2 100%);
  transition: opacity 0.2s;
}

label.customRange > .slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px; /* Adjust width of the indicator */
  height: 28px; /* Adjust height of the indicator */
  border: 6px solid #4f46e5;
  background: #4f46e5; /* Color of the indicator */
  border-radius: 20px; /* Make the indicator round */
  cursor: pointer;
}

/* label.customRange > .indicator {
  width: 54px;
  height: 28px;
  position: absolute;
  bottom: -38px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #4f46e5;
  line-height: 28px;
  text-align: center;
  border-radius: 8px;
} */
</style>
