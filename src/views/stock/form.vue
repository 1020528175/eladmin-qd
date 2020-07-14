<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="550px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="170px">
      <el-form-item label="代码(sh000001,sz*)" prop="code">
        <el-input v-model="form.code" style="width: 300px;" @blur="getStockNameByCode"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="最高监控价" >
        <el-input v-model="form.maxPrice" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="最低监控价" >
        <el-input v-model="form.minPrice" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="当日下跌幅度，不需要%" >
        <el-input v-model="form.fallRate" style="width: 300px;"/>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" clearable placeholder="类型" class="filter-item" style="width: 300px">
          <el-option v-for="type in stock_types" :key="type.value" :label="type.name" :value="type.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getStockNameByCode} from '@/api/stockMonitor'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        code: '',
        name: '',
        maxPrice: '',
        minPrice: '',
        fallRate: '',
        type: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: ''
      },
      stock_types: [
        {value: 'STOCK', name: '股票'},
        {value: 'ETF', name: 'etf基金'},
        {value: 'BOND', name: '可转换债券'},
        {value: 'INDEX', name: '指数'}
      ],
      rules: {
        code: [{required: true, message: '请输入股票编码！', trigger: 'blur'}],
        name: [{required: true, message: '请输入股票名称！', trigger: 'blur'}],
        type: [{required: true, message: '请输入股票类型！', trigger: 'blur'}],
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (!valid){
          this.loading = false;
          return false;
        }
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        code: '',
        name: '',
        maxPrice: '',
        minPrice: '',
        fallRate: '',
        type: '',
        createBy: '',
        createDate: '',
        updateBy: '',
        updateDate: ''
      }
    },
    getStockNameByCode(){
      getStockNameByCode(this.form.code).then(result => {
        this.form.name = result;
      }).catch(reason => console.log(reason))
    }
  }
}
</script>

<style scoped>

</style>
