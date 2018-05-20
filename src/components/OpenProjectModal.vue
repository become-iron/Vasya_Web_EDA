<template>
  <b-modal v-model="showModal"
           title="Open project"
           hide-footer>
    <b-form>
      <b-form-group label="Project file:">
        <b-form-file ref="fileInput"
                     accept="application/json, text/json"
                     plain
                     v-model="file">
        </b-form-file>
      </b-form-group>

      <b-form-group>
        <b-btn size="sm"
               variant="outline-secondary"
               :disabled="file == null"
               @click="openProject()">
          Open
        </b-btn>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
  import { Bus } from '../Bus'
  import { readFileAsText } from '../utils'

  export default {
    name: 'OpenProjectModal',

    props: {
      value: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        file: null
      }
    },

    computed: {
      showModal: {
        get () { return this.value },
        set (value) { this.$emit('input', value) }
      }
    },

    watch: {
      value () {
        // reset file on modal close
        if (!this.value) {
          this.resetFile()
        }
      }
    },

    methods: {
      resetFile () {
        this.file = null
        this.$refs.fileInput.reset()
      },

      openProject () {
        // TODO:  check file extension
        readFileAsText(this.file, file => {
          const projectDescription = JSON.parse(file)
          Bus.$emit('open-project', projectDescription)
        })

        // const reader = new FileReader()
        // reader.addEventListener('loadend', () => {
        //   const projectDescription = JSON.parse(reader.result)
        //   console.log(projectDescription)
        //   Bus.$emit('open-project', projectDescription)
        // })
        // reader.readAsText(this.file)

        // const $input = document.createElement('input')
        // $input.setAttribute('type', 'file')
        // $input.setAttribute('accept', 'application/json, text/json')
        // $input.addEventListener('change', () => {
        //   const file = $input.files.length ? $input.files[0] : null
        //
        //   if (file === null) { return }
        //
        //   const reader = new FileReader()
        //   reader.addEventListener('loadend', () => {
        //     const projectFile = JSON.parse(reader.result)
        //     console.log(projectFile)
        //   })
        //   reader.readAsText(file)
        // }, false)
        // $input.click()
      }
    }
  }
</script>

<style scoped>

</style>
