<template>
  <div class="tinymce-editor">
    <editor v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
    <div v-html="myValue"></div>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
import 'tinymce/plugins/code'// 代码编辑

import { uploadImg } from '../api/index'
export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table wordcount code'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat | code'
    }
  },
  data () {
    return {
      init: {
        // 本人后台管理系统放在域名下的 `/admin` 目录，
        // 所以加上了 `/admin` 前缀，读者如果不需要则解开下面两行注释了的代码，并注释掉与之相关的两行带有admin的代码
        // language_url: '/tinymce/langs/zh_CN.js',
        language_url: '/admin/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        // skin_url: '/tinymce/skins/ui/oxide',
        skin_url: '/admin/tinymce/skins/ui/oxide',
        // skin_url: '/tinymce/skins/ui/oxide-dark',//暗色系
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          // 这是base64格式的方式
          // const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          // success(img)

          // 这是ajax方式
          let formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          uploadImg(formData, config).then(data => {
            success(data)
          }).catch(() => {
            failure('上传失败！请重试！')
          })
        }
      },
      myValue: this.value
    }
  },
  mounted () {
    tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
