<template>
  <div>
    <!-- 路由出口 -->
    <router-view />
    <!-- /路由出口 -->

    <!-- 底部导航栏 -->
    <van-tabbar>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
    <!-- /底部导航栏 -->
  </div>
</template>

<script>
export default {
  name: 'TabIndex'
}

</script>

<style lang="less">
// .van-tabbar{
//   height: 98px;
// }
// .van-tabbar-item {
//   font-size: 20px;
// }
// .van-tabbar-item__icon .van-icon {
//   font-size: 40px;
// }

</style>
