<template>
  <div class="home">
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">火狐狸</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">待对接</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>

export default {
  name: "Nav-Menu",
  components: {
  },
  data () {
    return {
      str: '111'
    }
  },
  created () {

  },
  methods: {
    handleOpen () { },
    handleClose () { }
  }
}
</script>
<style lang="less"></style>