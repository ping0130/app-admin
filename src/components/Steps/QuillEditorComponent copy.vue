<template>
  <div>
    <!-- Quill 编辑器 -->
    <QuillEditor v-model:content="editorContent" :options="editorOptions" ref="quillEditor" contentType="html"/>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import Quill from 'quill'
// 注册 Quill 插件
Quill.register('modules/imageUploader', ImageUploader)
export default {
  name: 'QuillEditorComponent',
  components: {
    QuillEditor,  // 注册 Quill 编辑器组件
  },
  props: {
    content: String  // 这里确保接收 content 作为 prop
  },
  emits: ['update:content'],  // 声明自定义事件

  setup(props, { emit }) {
    // 编辑器内容（存储的是 Delta 格式数据）
    const editorContent = ref(props.content || '') // 确保 editorContent 初始化为传入的内容
    console.log('Initial editorContent:', editorContent.value)
    // 编辑器配置
    const editorOptions = ref({
      theme: 'snow',
      placeholder: '请输入内容...',
      modules: {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          ['image'], 
        ],
        imageUploader: {
          // 配置图片上传
          uploadUrl: '/upload',  // 上传图片的接口URL
          upload: (file) => {
            const formData = new FormData()
            formData.append('file', file)

            // 返回一个 Promise，处理图片上传并返回图片 URL
            return new Promise((resolve, reject) => {
              fetch('http://10.0.1.139:5000/upload', {
                method: 'POST',
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data && data.url) {
                    resolve(data.url)  // 返回图片 URL
                  } else {
                    reject('图片上传失败')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            })
          },
        },
      },
    })

    // 监听 editorContent 的变化，触发 update:content 事件
    watch(editorContent, (newValue) => {
      emit('update:content', newValue)  // 通知父组件内容更新
    })
    watch(() => props.content, (newValue) => {
  console.log('Content updated:', newValue)
  if (newValue !== editorContent.value) {
    editorContent.value = newValue
  }
})
    return {
      editorContent,
      editorOptions
    }
  },
}
</script>
