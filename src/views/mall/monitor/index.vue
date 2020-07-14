<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <!-- 搜索 -->
        <el-input v-model="query.title" clearable placeholder="输入商品标题搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
        <el-select v-model="query.openStatus" clearable placeholder="开启状态" class="filter-item" style="width: 120px" @change="toQuery">
          <el-option v-for="item in dicts" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button
          v-permission="['ADMIN','GOODSMONITOR_ALL','GOODSMONITOR_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" :highlight-current-row="true" style="width: 100%;">
      <el-table-column type="index" label="序号"/>
      <el-table-column prop="title" label="商品标题"/>
      <el-table-column prop="link" label="商品链接" >
        <template slot-scope="scope">
          <a target="_blank" style="color: #0066cc" :href="scope.row.link">{{scope.row.link}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="imgUrl" label="商品首图" width="100">
        <template slot-scope="scope">
            <el-image
              :src="scope.row.imgUrl"
              :preview-src-list="[scope.row.imgUrl]">
            </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="originMall" label="商城" width="100"/>
      <el-table-column prop="maxPrice" label="最高价" width="80"/>
      <el-table-column prop="minPrice" label="最低价" width="80"/>
      <el-table-column prop="openStatus" label="开启状态" width="100">
        <template slot-scope="scope">
<!--          {{scope.row.openStatus ? "开启中" : "已停止"}}-->
          <el-switch ref="switch"
            v-model="scope.row.openStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateGoodsMonitorStatus(scope.row.id,scope.row.openStatus)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮件地址" width="160"/>
      <el-table-column prop="createBy" label="创建人" width="80"/>
      <el-table-column prop="createDate" label="创建时间" width="140">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','GOODSMONITOR_ALL','GOODSMONITOR_EDIT','GOODSMONITOR_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','GOODSMONITOR_ALL','GOODSMONITOR_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','GOODSMONITOR_ALL','GOODSMONITOR_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del, getCurrentPrice,updateOpenStatusById} from '@/api/goodsMonitor'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData,initDict],
  data() {
    return {
      delLoading: false,
      imgUrls:[
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDict("goods_monitor_status")
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/goodsMonitor'
      const sort = 'openStatus,id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      this.query.title ? this.params['title'] = this.query.title : ''
      this.query.openStatus  != undefined ? this.params['openStatus'] = this.query.openStatus : ''
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      const _this = this.$refs.form
      _this.form = {
        id: '',
        title: '',
        link: '',
        imgUrl: '',
        originMall: '',
        maxPrice: '',
        minPrice: '',
        openStatus: '',
        email: '',
        deleteStatus: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: ''
      }
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        title: data.title,
        link: data.link,
        imgUrl: data.imgUrl,
        originMall: data.originMall,
        maxPrice: data.maxPrice,
        minPrice: data.minPrice,
        openStatus: data.openStatus + '',
        email: data.email,
        deleteStatus: data.deleteStatus,
        createBy: data.createBy,
        createDate: data.createDate,
        updateBy: data.updateBy,
        updateDate: data.updateDate
      }

      //编辑时，自动加载当前价格
      getCurrentPrice({
        link: _this.form.link.trim()
      }).then((res) =>{
        _this.form.currentPrice = res
        _this.dialog = true
      }).catch((res) => {
        console.log("error",res)
      })
    },
    /**
     * 快捷更新商品监控的开启状态
     * @param goodsId
     * @param openStatus
     */
    updateGoodsMonitorStatus(goodsId,openStatus){
      updateOpenStatusById({
        id: goodsId,
        openStatus: openStatus
      }).catch(res =>{
          console.log(res)
          const row = this.data.filter((item) => item.id == goodsId)
          row[0].openStatus = !openStatus
        })
    }
  }
}
</script>

<style scoped>
.table-img{
  width: 50px;
  height: 50px;
}
</style>
