<template>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui

export default {
  name: 'DragSelectDemo',
  components: { ElDragSelect },
  data() {
    return {
      value: ['Apple', 'Banana', 'Orange'],
      options: [{
        value: 'Apple',
        label: 'Apple'
      }, {
        value: 'Banana',
        label: 'Banana'
      }, {
        value: 'Orange',
        label: 'Orange'
      }, {
        value: 'Pear',
        label: 'Pear'
      }, {
        value: 'Strawberry',
        label: 'Strawberry'
      }]
    }
  }
}
</script>
