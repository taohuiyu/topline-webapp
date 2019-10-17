<template>
  <div class="search">
      <!-- 搜索框 -->
      <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      >
      <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <!-- 联想建议 -->
      <van-cell-group>
        <van-cell title="单元格" icon="search" />
        <van-cell title="单元格" icon="search" />
      </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      searchSuggestions: [] // 联想建议列表
    }
  },
  methods: {
    onSearch () {
      console.log('onSearch')
    },
    async onSearchInput () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const { data } = await getSearchSuggestions({
        q: this.searchText
      })

      this.searchSuggestions = data.data.options
    }
  }
}

</script>

<style>

</style>
