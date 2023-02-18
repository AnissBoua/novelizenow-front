<template>
    <div class="edit_page">
        <alert-modal @acceptWarning="onWarningAccepted"/>
        <button @click="showOutput">log</button>
        <div class="editor_container">
            <QuillEditor v-model:content="editorData" ref="myQuillEditor" theme="snow" contentType="html" @ready="onEditorReady" @textChange="onEditorInput"/>
        </div>
        <!-- <textarea v-model="editorData"></textarea> -->
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
            let max = 3000;
            console.log(text.length);
            if(text.length >= max && text.length < 3010){
                this.quillInstance.disable();
                this.alertModalState = {
                    open: true,
                    title:"Limite de 3000 caractères atteinte",
                    content:`Attention vous avez atteint la limite des 3000 caractères ${text.length===3000 ? "" : `(${text.length})`}, passez à la page suivante ${text.length<=3010 ? `ou effacez des caractères pour continuer.`:"."}`,
                    emits:"enableEditor"
                }
            } else if(text.length > 3010){
                this.alertModalState = {
                    open: true,
                    title:"Limite de 3000 caractères atteinte",
                    content:`Au dessus des 3000 caractères l'éditeur est désactivé`,
                    emits:"disableEditor"
                }
                this.quillInstance.disable();
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