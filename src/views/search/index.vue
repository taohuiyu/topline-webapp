<template>
  <div class="search">
      <!-- 搜索框 -->
      <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch(searchText)"
      @input="onSearchInput"
      >
      <div slot="action" @click="onSearch(searchText)">搜索</div>
      </van-search>
      <!-- 联想建议 -->
      <van-cell-group v-if="searchText">
        <van-cell
        :title="item"
        icon="search"
        v-for="(item,index) in searchSuggestions"
        :key="index"
        @click="onSearch(item)">
            <div v-html="highlight(item)" slot="title"></div>
        </van-cell>
      </van-cell-group>
      <!-- 搜索历史记录 -->
     <van-cell-group v-else>
         <van-cell title="历史记录">
             <template v-if="isDeleteShow">
                <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
                <span @click="isDeleteShow = false">完成</span>
             </template>
             <van-icon v-else name="delete" @click="isDeleteShow = true" />
         </van-cell>
         <van-cell
          :title="item"
          v-for="item in searchHistories"
          :key="item"
          @click="onSearch(item)"
         >
            <van-icon
             name="close"
             v-show="isDeleteShow"
             @click.stop="searchHistories.splice(index, 1)"
            />
         </van-cell>
     </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'
import { debounce } from 'lodash'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      searchSuggestions: [], // 联想建议列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false // 控制删除的显示状态
    }
  },
  watch: {
    searchHistories (newVal) {
      setItem('search-histories', newVal)
    }
  },
  methods: {
    onSearch (str) {
    //   console.log('onSearch')
    // 存储搜索历史记录
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(str)
      // 把最新的记录存储到数组的顶部
      // 持久化存储
      setItem('search-histories', this.searchHistories)
      // 跳转到搜索结果页面
      this.$router.push('/search/' + str)
    },
    onSearchInput: debounce(async function () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const { data } = await getSearchSuggestions({
        q: this.searchText
      })
      const searchSuggestions = data.data.options

      // 根据一个字符串创建一个正则表达式对象
      //   const reg = new RegExp(searchText, 'g')
      //   searchSuggestions.forEach((item, index) => {
      //     searchSuggestions[index] = item.replace(reg, '<span style="color: red">' + searchText + '</span>')
      //   })
      this.searchSuggestions = searchSuggestions
    }, 300),
    highlight (str) {
      const reg = new RegExp(this.searchText, 'g')
      return str.replace(reg, '<span style="color: red">' + this.searchText + '</span>')
    }
  }
}

</script>

<style>

</style>
