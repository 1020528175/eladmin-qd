<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="商品标题" >
        <el-input v-model="form.gmId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="当前价格" >
        <el-input v-model="form.price" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="监控时间" >
        <el-input v-model="form.createDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="高于最高监控价" >
        <el-input v-model="form.sendMaxEmail" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="低于最低监控价" >
        <el-input v-model="form.sendMinEmail" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/goodsMonitorDetail'
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
        gmId: '',
        price: '',
        createDate: '',
        sendMaxEmail: '',
        sendMinEmail: ''
      },
      rules: {
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
        gmId: '',
        price: '',
        createDate: '',
        sendMaxEmail: '',
        sendMinEmail: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
