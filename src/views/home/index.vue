<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed>
      <van-button
       class="search-btn"
       slot="title"
       round
       type="info"
       size="small"
       @click="$router.push('/search')">搜索
      </van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <!-- 拿到频道数据，渲染模板 -->
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 下拉刷新包裹文章列表 -->
        <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
          <!-- 文章列表 -->
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- // 注意：article.art_id 超出js安全整数范围被 json-bigint 转换成对象了，但是 key 只能绑定字符串或是数字，所以这里要把它转为字符串来绑定给这个 key
            :title="article.title"-->
            <van-cell
              v-for="(article,index) in channel.articles"
              :key="index"
              :title="article.title"
            >
              <!-- 宫格 -->
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <!-- vant提供的一个图片的组件 -->
                    <van-image height="100" width="100" lazy-load :src="img" />
                  </van-grid-item>
                </van-grid>
                <!-- 描述信息 -->
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime}}</span>
                  </div>
                  <van-icon name="close" />
                </div>
              </div>
            </van-cell>
          </van-list>
          <!-- /文章列表 -->
        </van-pull-refresh>
      </van-tab>
      <!-- 面包按钮 -->
       <div slot="nav-right" class="wap-nav"    @click="isChannelEditShow = true">
         <van-icon name="wap-nav" size="24" />
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 弹层 -->
    <van-popup
      v-model="isChannelShow"
      round
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '90%' }">
      <div class="channel-container">
        <van-cell title="我的频道" :border="false">
             <van-button
             type="danger"
             size="mini"
             @click="isEditShow = !isEditShow"
             >{{ isEditShow ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item text="推荐" @click="switchChannel(0)" />
             <van-grid-item
             v-for="(channel,index) in channels.slice(1)"
             :key="index"
             :text="channel.name"
             @click="onMyChannelClick(index)">
              <van-icon v-show="isEditShow" class="close-icon" slot="icon" name="close" />
             </van-grid-item>
        </van-grid>
        <van-cell title="推荐频道" :border="false"/>
        <van-grid :gutter="10">
             <van-grid-item
             @click="onAddChannel(channel)"
             v-for="(channel,index) in recommonChannels"
             :key="index"
             :text="channel.name"
        />
        </van-grid>
      </div>
      </van-popup>
  </div>
</template>

<script>
import { getDefaultChannels, getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      list: [],
      channels: [], // 我的频道列表
      isChannelShow: false, // 弹窗显示隐藏
      allChannels: [], // 存储所有的频道列表
      isEditShow: false// 设置编辑按钮
    }
  },
  watch: {
    // 函数名就是要监视的数据名称
    channels (newVal) {
      // console.log(newVal)
      setItem('channels', newVal)
    }
  },
  computed: {// 为什么要用计算属性，在做添加或者删除的时候作用大
    // 获取推荐频道列表
    recommonChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        // 判断channel是否存在我的频道中
        // 如果不存在，就证明它是剩余推荐的频道
        const ret = this.channels.find(item => item.id === channel.id)
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
      // return 所有频道 - 我的频道
    }
  },
  created () {
    // 获取我的频道列表
    this.loadChannels()
    // 获取所有的频道列表
    this.loadAllChannels()
  },
  methods: {
    // 上拉加载更多
    async onLoad () {
      // 获取当期激活的频道对象
      const activeChannel = this.channels[this.active]

      // 1. 请求获取数据
      const { data } = await getArticles({
        // 注意：channel_id、timestamp、with_top 都是后端要求指定的数据字段名称，不能随便写
        channel_id: activeChannel.id, // 频道ID
        // a: 3 b: 2
        // 4    3
        // 这里的这个时间戳就好比当前频道下一页的页码
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })

      // 2. 将数据添加到当前频道.articles中
      // activeChannel.articles = activeChannel.articles.concat(data.data.results)
      activeChannel.articles.push(...data.data.results)

      // 3. 结束当前频道.loging = false
      activeChannel.loading = false

      // 4. 如果还有下一页数据
      if (data.data.pre_timestamp) {
        // 更新获取下一页数据的页码时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        // 如果没有下一页数据了，就意味着后面没有数据了
        activeChannel.finished = true
      }
    },
    // 加载我的频道列表
    async loadChannels () {
      let channels = []
      // 读取本地存储中的频道列表
      const localChannels = getItem('channels')
      // 如果有本地存储的频道列表就使用本地存储的频道列表
      if (localChannels) {
        channels = localChannels
      } else {
      // 如果没有本地储存的频道列表，则请求获取后台推荐的频道列表
        const { data } = await getDefaultChannels()
        channels = data.data.channels
      }
      // 定制频道的内容数据
      // 为每个频道初始化一个成员articles用来存储该频道的文章列表
      // 根据需要扩展自定义数据，用以满足我们的业务需求
      this.extendData(channels)
      // channels.forEach(channel => {
      //   channel.articles = [] // 频道的文章列表
      //   channel.loading = false // 频道的上拉加载更多的loading
      //   channel.finished = false // 频道的加载结束的状态
      //   channel.timestamp = null // 用于获取下一页数据的时间戳（页码）
      //   channel.isPullDownLoading = false // 存储频道的下拉刷新loading状态
      // })
      // 最后把数据更新到组件中
      this.channels = channels
    },
    // 下拉刷新
    async onRefresh () {
      // 获取当前激活的频道对象
      const activeChannel = this.channels[this.active]
      // 1. 请求获取最新推荐的文章列表
      const { data } = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 下拉刷新永远都是在获取最新推荐的文章列表，所以传递当前最新时间戳
        with_top: 1
      })

      // 2. 将数据添加到文章列表顶部
      activeChannel.articles.unshift(...data.data.results)

      // 3. 关闭下拉刷新的 loading 状态
      activeChannel.isPullDownLoading = false

      // 4. 提示
      this.$toast('刷新成功')
    },
    // 获取所有的频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      // console.log(data)
      const channels = data.data.channels
      this.extendData(channels)
      this.allChannels = channels
    },
    // 添加频道
    onAddChannel (channel) {
      // 将推荐里面的频道添加到我的频道中
      this.channels.push(channel)
    },
    // 当我的频道项点击处理函数
    onMyChannelClick (index) {
      if (this.isEditShow) {
        // 如果是编辑状态，删除频道
        this.channels.splice(index, 1)
      } else {
        // 如果是非编辑状态，切换频道展示
        // 切换当前激活的频道展示
        // this.active = index
        // 关闭频道弹层
        // this.isChannelShow = false
        // 因为这个数字不包括推荐频道，而首页中遍历的频道列表是包括推荐，所有索引+1
        this.switchChannel(index + 1)
      }
    },
    // 切换频道
    switchChannel (index) {
      this.active = index
      this.isChannelShow = false
    },
    // 封装
    extendData (channels) {
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.loading = false // 频道的上拉加载更多的loading
        channel.finished = false // 频道的加载结束的状态
        channel.timestamp = null // 用于获取下一页数据的时间戳（页码）
        channel.isPullDownLoading = false // 存储频道的下拉刷新loading状态
      })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }
  .search-btn{
    width: 100%;
    background: #5babfb;
  }
  .van-tabs /deep/ .van-tabs__wrap--scrollable {
    position: fixed;
    top: 46px;
    left: 0;
    right: 16px;
    z-index: 2;
  }
  .van-tabs /deep/ .van-tabs__content {
    margin-top: 90px;
  }
  //弹层里的单元格格式
  .channel-container{
    padding-top: 30px;
  }
  .close-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  }
  // 频道弹层
  .van-icon-wap-nav{
    position:fixed;
    right: 0;
    top:55px;
  }
}
</style>
