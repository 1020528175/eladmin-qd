<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane label="参数配置" name="first">
      <Config/>
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="second">
      <div>
        <blockquote class="my-blockquote">注意</blockquote>
        <pre class="my-code">
          <p>微信公众号的接入参数来自于：微信公众平台 - 开发 - 基本配置（如下图）</p>
          <el-image
            :src="require('@/assets/weChat/subscription-config.png')"
            style="max-height: 600px">
          </el-image>
        </pre>
        <blockquote class="my-blockquote"> 接入域名设置(服务器地址(URL))</blockquote>
        <pre class="my-code">
          <p>上图中的服务器配置(未启用) - 服务器地址(URL) 应根据本项目的部署情况配置为：<span>http://域名/项目根路径<span>/api/weChat/checkToken</span></span></p>
          <p>地址中的红色部门是固定的，这个地址是微信用来验证接入的合法性，是通过token来验证的，上图中的token和这里配置微信接入参数时的token是一致的，否则就不能通过微信的验证，不能接入微信公众号。</p>
        </pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import '@/styles/description.scss'
export default {
  components: { Config },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style scoped>
  p{
    font-size: 14px;
  }
  p>span{
    color: #1aaba8;
  }
  p>span>span{
    color: red;
  }
</style>
