<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
    <el-form-item label="开发者ID" prop="appId">
      <el-input v-model="form.appId" style="width: 40%"/>
      <span style="color: #C0C0C0;margin-left: 10px;">开发者ID是公众号开发识别码，配合开发者密码可调用公众号的接口能力。</span>
    </el-form-item>
    <el-form-item label="令牌" prop="token">
      <el-input v-model="form.token" style="width: 40%;"/>
      <span style="color: #C0C0C0;margin-left: 10px;">网站接入微信公众号的令牌，跟微信公众平台-开发-基本配置-服务器配置李配置的token一致</span>
    </el-form-item>
    <el-form-item label="开发者密码" prop="appsecret">
      <el-input v-model="form.appsecret" style="width: 40%;"/>
      <span style="color: #C0C0C0;margin-left: 10px;">开发者密码是校验公众号开发者身份的密码，具有极高的安全性。切记勿把密码直接交给第三方开发者或直接存储在代码中。如需第三方代开发公众号，请使用授权方式接入。</span>
    </el-form-item>
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">保存配置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { get, update } from '@/api/wechatConfig'
export default {
  name: 'Config',
  data() {
    return {
      loading: false,
      form: { appId: '', token: '', appsecret: '',},
      rules: {
        appId: [
          { required: true, message: 'appId', trigger: 'blur' }
        ],
        token: [
          { required: true, message: '请输入token', trigger: 'blur' }
        ],
        appsecret: [
          { required: true, message: '请输入appsecret', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      get().then(res => {
        this.form = res
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          update(this.form).then(res => {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          console.log("validate不通过")
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
