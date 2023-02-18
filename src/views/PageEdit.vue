<template>
    <div class="edit_page">
        <QuillEditor v-model:content="editorData" ref="myQuillEditor" theme="snow" contentType="html" @ready="onEditorReady" @textChange="onEditorInput"/>
        <!-- <textarea v-model="editorData"></textarea> -->
        <button @click="showOutput">log</button>
    </div>
</template>

<script>
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
    data() {
        return {
            disabled:false,
            quillInstance:null,
            editorData: '<p>Votre première page.</p>',
        }
    },
    mounted(){
    },
    methods:{
        onEditorReady(editor) {
            this.quillInstance = editor;
            if(this.disabled === false){
                this.quillInstance.enable();
            } else {
                this.quillInstance.disable();
            }
        },
        showOutput(){
            console.log(this.editorData);
        },
        onEditorInput(){
            let text = this.quillInstance.getText();
            //décider d'une limite /!\
            if(text.length > 3000){
                this.quillInstance.disable();
                this.disabled = true;
            } else {
                this.quillInstance.enable();
                this.disabled = false;
            }
        }
    }
    }
</script>

<style lang="scss">

// .edit_page{
//     background-color:rgb(0 0 0 / 12%) ;
//     height: 100%;
// }
.editor_container{
    width: 30%;
    margin: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
}
.ck-editor__editable{
    height: 50rem;
}
// .test > .ck-editor{
//     height: 35rem;
// }
</style>