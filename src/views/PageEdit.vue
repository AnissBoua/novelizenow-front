<template>
    <div>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        
    </div>
    <textarea v-model="editorData"></textarea>
    <button @click="showOutput">show</button>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
    data() {
        return {
            editor: ClassicEditor,
            editorData: '<p>Votre première page.</p>',
            editorConfig: {
                toolbar: [
                    'heading', 'bulletedList', 'numberedList', 'undo', 'redo'
                ],
                fontSize: {
                    options: [
                        'tiny',
                        'default',
                        'big'
                    ],
                    supportAllValues: true
                },
            }
        }
    },
    mounted(){
        console.log(this.editorData);
    },
    methods:{
        showOutput(){
            console.log(this.editor.getData());
        },
    }
    }
</script>

<style>

</style>