<template>
  <div>
    <sticky :z-index="10" class-name="sub-navbar">

      <div class="time-container">
        <el-date-picker v-model="time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Release time" />
      </div>

      <el-button style="margin-left: 10px;" type="success">
        publish
      </el-button>
    </sticky>

    <div class="components-container">
      <aside>
        Sticky header, When the page is scrolled to the preset position will be sticky on the top.
      </aside>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <sticky :sticky-top="200">
        <el-button type="primary"> placeholder</el-button>
      </sticky>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'

export default {
  name: 'StickyDemo',
  components: { Sticky },
  data() {
    return {
      time: '',
      url: '',
      platforms: ['a-platform'],
      platformsOptions: [
        { key: 'a-platform', name: 'platformA' },
        { key: 'b-platform', name: 'platformB' },
        { key: 'c-platform', name: 'platformC' }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  }
}
</script>

<style scoped>
.components-container div {
  margin: 10px;
}

.time-container {
  display: inline-block;
}
</style>
