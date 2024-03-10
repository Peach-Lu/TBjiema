<template>
  <div class="home">
    <el-container class="home_container">
      <el-header style="line-height: 60px;background: #545c64; color: #fff;">
        <h1>接码平台取号</h1>
      </el-header>
      <el-container>
        <el-aside width="200px" class="left_menu">
          <NavMenu></NavMenu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import NavMenu from '../components/NavMenu.vue'
export default {
  name: "Home",
  components: {
    NavMenu
    // HelloWorld,
  },
  data () {
    return {
      str: '111'
    }
  },
  created () {

  }
}
</script>
<style lang="less">
.home {
  height: 100%;

  .home_container {
    height: 100%;

    .left_menu {
      background: #545c64;
    }
  }
}
</style>