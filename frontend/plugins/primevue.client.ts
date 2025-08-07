import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import Menu from 'primevue/menu'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import FileUpload from 'primevue/fileupload'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog from 'primevue/confirmdialog'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

export default defineNuxtPlugin((nuxtApp) => {
  // Use PrimeVue
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined'
  })

  // Use PrimeVue services
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)

  // Register components
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('Card', Card)
  nuxtApp.vueApp.component('Avatar', Avatar)
  nuxtApp.vueApp.component('Badge', Badge)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('Menu', Menu)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('FileUpload', FileUpload)
  nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
  nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog)
}) 