<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="商品标题" >
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="商品链接" >
        <el-input v-model="form.link" @blur="getGoods" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="商品首图" >
        <el-input v-model="form.imgUrl" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="商城" >
        <el-input v-model="form.originMall" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最高价" >
        <el-input v-model="form.maxPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最低价" >
        <el-input v-model="form.minPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开启状态" >
<!--        <el-input v-model="form.openStatus ? 1 : 0" style="width: 370px;"/>-->
        <el-select v-model="form.openStatus" placeholder="请选择">
          <el-option
            v-for="item in openStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮件地址" >
        <el-input v-model="form.email" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getGoodsInfo} from '@/api/goodsMonitor'
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
      },
      rules: {
      },
      openStatusOptions:[
        {
          value: 0,
          label: "关闭"
        },
        {
          value: 1,
          label: "开启"
        }
      ]
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
    ////////////////////////////////////////////
    //获取监控的商品信息
    getGoods(){
      getGoodsInfo({
        link: this.form.link
      }).then((res) =>{
        console.log(this.form)
        this.form = res
        this.form.openStatus = 1
        console.log(this.form)
      }).catch((res) => {
        console.log("error",res)
      })

    }

  }
}
</script>

<style scoped>

</style>
