<template>
    <div>
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady" ></ckeditor>
    </div>
    <textarea v-model="editorData"></textarea>
    <button @click="showOutput">show</button>
</template>

<script>
import CustomEditor from 'ckeditor5-custom-build';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const CustomEditor = require( '../../ckeditor/build/ckeditor' );

export default {
    data() {
        return {
            editorInstance:null,
            editor: CustomEditor,
            editorData: '<p>Votre première page.</p>',
            editorConfig: {
                // toolbar: [
                //     'heading', 'bulletedList', 'numberedList', 'undo', 'redo'
                // ],
                // fontSize: {
                //     options: [
                //         'tiny',
                //         'default',
                //         'big'
                //     ],
                //     supportAllValues: true
                // },
            }
        }
    },
    mounted(){
        console.log(this.editor);
    },
    methods:{
        showOutput(){
            console.log(this.editor.getData());
        },
        onEditorReady (editor) {
            editor.model.change( writer => {
                const p = writer.createElement( 'p' );
                writer.setAttribute( 'class', 'my-class', p );
                // console.log(editor.model.document.getRoot(),'writer');
                // writer.insert( p, editor.model.document.getRoot() );
            } );
            this.editorInstance = editor;
        },
    }
    }
</script>

<style lang="scss">
// .ck-editor__editable{
//     height: 35rem;
// }    
.test > .ck-editor{
    height: 35rem;
}
</style>