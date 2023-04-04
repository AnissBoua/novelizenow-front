import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
    state: () => {
        return {
            alertModalState: {
                open:false,
                title:"",
                content:"",
                emits:""
            },
        }
    },
    getters: {
    },
    actions: {
        resetAlertModal(){
            this.alertModalState ={
                open:false,
                title:"",
                content:"",
                emits:""
            }
        }  
    },
})
