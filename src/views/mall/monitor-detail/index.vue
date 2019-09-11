<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
<!--      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
<!--      </el-select>-->
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="index" label="序号"/>
      <el-table-column prop="goodsMonitor.title" label="商品标题" sortable/>
      <el-table-column prop="price" label="当前价格" :formatter="formatterPrice" width="150"/>
      <el-table-column prop="goodsMonitor.maxPrice" label="当前监控最高价" :formatter="formatterPrice" width="150"/>
      <el-table-column prop="goodsMonitor.minPrice" label="当前监控最低价" :formatter="formatterPrice" width="150"/>
      <el-table-column prop="createDate" label="监控时间" sortable width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendMaxEmail" label="发送高价邮件" width="200" sortable align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.sendMaxEmail" class="el-icon-check"></i>
          <i v-else class="el-icon-close"></i>
        </template>
      </el-table-column>
      <el-table-column prop="sendMinEmail" label="发送最低邮件" width="200" sortable align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.sendMinEmail" type="primary" class="el-icon-check"></i>
          <i v-else class="el-icon-close"></i>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','GOODSMONITORDETAIL_ALL','GOODSMONITORDETAIL_EDIT','GOODSMONITORDETAIL_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
<!--          <el-button v-permission="['ADMIN','GOODSMONITORDETAIL_ALL','GOODSMONITORDETAIL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>-->
          <el-popover
            v-permission="['ADMIN','GOODSMONITORDETAIL_ALL','GOODSMONITORDETAIL_DELETE']"
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
import { del } from '@/api/goodsMonitorDetail'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      // queryTypeOptions: [
      //   { key: 'goodsMonitor.title', display_name: '商品标题' },
        // { key: 'createDate', display_name: '监控时间' }
      // ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/goodsMonitorDetail'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      // const type = query.type
      const value = query.value
      if (value) { this.params['goodsMonitor.title'] = value }
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
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        gmId: data.gmId,
        price: data.price,
        createDate: data.createDate,
        sendMaxEmail: data.sendMaxEmail,
        sendMinEmail: data.sendMinEmail
      }
      _this.dialog = true
    },
    //////////////////////
    //格式化成金额格式
    formatterPrice(row, column, cellValue, index){
      if (!cellValue){
        return cellValue
      }
      cellValue = cellValue.toString().replace(/\$|\,/g,'');
      if(isNaN(cellValue)){
        cellValue = "0";
      }
      const sign = (cellValue == (cellValue = Math.abs(cellValue)));
      cellValue = Math.floor(cellValue*100+0.50000000001);
      let cents = cellValue%100;
      cellValue = Math.floor(cellValue/100).toString();
      if(cents<10){
        cents = "0" + cents;
      }
      for (let i = 0; i < Math.floor((cellValue.length-(1+i))/3); i++)
        cellValue = cellValue.substring(0,cellValue.length-(4*i+3))+','+
          cellValue.substring(cellValue.length-(4*i+3));
      return (((sign)?'':'-') + cellValue + '.' + cents);
    }
  }
}
</script>

<style scoped>
  .el-icon-check{
    color: red;
    font-size: 30px;
    font-weight: bold;
  }
</style>
