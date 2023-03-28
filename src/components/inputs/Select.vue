<template>
  <div>
    <label v-if="label" class="font-bold">{{ label }}</label>
    <select
      class="bg-novelize-dark font-bold outline-none"
      :class="{
        [`${textColor}`]: textColor != undefined,
        [`${bgColor}`]: bgColor != undefined,
        'text-novelize-primary': bgColor === undefined
      }"
      @change="$emit('selection-change',$event.target.value)"
    >
      <option v-for="(option, index) in options" :key="index" :value="option" :selected="option === initialValue">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
// TODO INCOMPLETE COMPONENT
export default {
  props: {
    options: {
      type: Array,
      default: ["Day", "Month", "Year"],
    },
    label: {
      type: String,
      default: undefined,
    },
    textColor: {
      type: String,
      default: undefined,
    },
    bgColor: {
      type: String,
      default: undefined,
    },
    initialValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  mounted() {
  },
};
</script>
