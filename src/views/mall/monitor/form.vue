<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="商品标题" prop="title">
        <el-input v-model="form.title" style="width: 370px;"/>
      </el-form-item>
      <p style="margin-left: 10px;font-size: 12px">可以直接填写商品链接，就会自动填充商品信息</p>
      <el-form-item label="商品链接" prop="link">
        <el-input v-model="form.link" @blur="getGoods" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="商品首图" prop="imgUrl">
        <el-input v-model="form.imgUrl" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="来源商城" prop="originMall">
        <el-input v-model="form.originMall" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最高价">
        <el-input v-model="form.maxPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最低价" prop="minPrice">
        <el-input v-model="form.minPrice" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开启状态" prop="openStatus">
<!--        <el-input v-model="form.openStatus ? 1 : 0" style="width: 370px;"/>-->
        <el-select v-model="form.openStatus" placeholder="请选择">
          <el-option
            v-for="item in openStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :select="item.value == form.openStatus">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮件地址" prop="email">
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
        title: [
          { required: true, message: '商品标题不能为空', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '商品链接不能为空', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '图片地址不能为空', trigger: 'blur' }
        ],
        originMall: [
          { required: true, message: '来源商城不能为空', trigger: 'blur' }
        ],
        minPrice: [
          { required: true, message: '监控最低价不能为空', trigger: 'blur' }
        ],
        openStatus: [
          { required: true, message: '开启状态不能为空', trigger: 'change' }
        ],
        email: [
          { type: 'email', required: true, message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      },
      openStatusOptions:[
        {
          value: true,
          label: "开启"

        },
        {
          value: false,
          label: "关闭"
        }
      ]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid){
          return false
        }
        this.loading = true
        if (this.isAdd) {
          this.doAdd()
        } else {
          this.doEdit()
        }
      })

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
