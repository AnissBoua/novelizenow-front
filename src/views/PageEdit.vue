<template>
    <div class="edit_page">
        <alert-modal @acceptWarning="onWarningAccepted"/>
        <button @click="showOutput">log</button>
        <div class="editor_container">
            <QuillEditor v-model:content="editorData" ref="myQuillEditor" theme="snow" contentType="html" @ready="onEditorReady" @textChange="onEditorInput"/>
            <p class="text_counter_container text-right"><span :class="{'text-red-500': text.length > 2999}">{{text.length-1}}</span>/3000</p>
        </div>
    </div>
</template>

<script>
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modals.js';
import alertModal from "@/components/alertModal.vue";

export default {
    setup(){
        let modalStore = useModalStore();
        const { alertModalState } = storeToRefs(modalStore);
        
        return {
            modalStore,
            alertModalState
        }
    },
    components: {
        alertModal,
    },
    data() {
        return {
            disabled:false,
            quillInstance:null,
            editorData: '<p>Votre première page.</p>',
            text:"",
            alreadyWarned:false
        }
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
            this.text = text;
            //décider d'une limite /!\
            let max = 3001;
            if(text.length >= max && this.alreadyWarned === false){
                this.alertModalState = {
                    open: true,
                    title:"Limite de 3000 caractères atteinte",
                    content:`Attention vous avez atteint la limite des 3000 caractères vous ne pourrai pas sauvegarder votre page si la limite est dépassée`,
                }
                this.alreadyWarned = true;
            } else {
                return;
            }
        },
        onWarningAccepted(data){
            switch (data) {
                case "enableEditor":
                    this.quillInstance.enable();
                    break;
                case "disableEditor":
                    this.quillInstance.disable();
                    break;
                default:
                    throw new Error(`Le cas "${data}" n'est pas traité`);
            }
        }
    }
    }
</script>

<style lang="scss">
.ql-{
    &snow{
        background-color: white;
    }
    &container{
        height: 47.5rem;
    }
}
.edit_page{
    background-color:rgb(0 0 0 / 12%) ;
    height: 100%;
}
.editor_container{
    width: 30%;
    margin: auto;
    padding-top: 2rem;
    padding-bottom: 2rem;
}
</style>