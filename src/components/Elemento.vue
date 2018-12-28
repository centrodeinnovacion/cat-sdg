<template>
  <v-container>
    <v-textarea
      prepend-icon="sync_problem"
      label="Indique un problema que aqueja a su comunidad"
      :value="pregunta.problema.descripcion"
      @input="actualizarProblema"
    ></v-textarea>
    <v-textarea
      prepend-icon="check_circle_outline"
      label="¿Sabe usted de algunas acciones que se estén desarrollando para solucionar estas problemáticas?"
      :value="pregunta.acciones.descripcion"
      @input="actualizarAcciones"
    ></v-textarea>
  </v-container>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { UPDATE_PREGUNTAS } from '@/store/participante/mutations'
export default {
  name: 'elemento',
  props: ['indicePregunta', 'pregunta'],
  computed: {
    ...mapGetters('participante', {
      participante: 'nuevoParticipante'
    })
  },
  mounted: function () {
    // this.actualizarId(this.indice)
  },
  methods: {
    ...mapMutations('participante', {
      updatePregunta: UPDATE_PREGUNTAS
    }),
    actualizarProblema (value) {
      console.log('Valor de descripción del problema')
      console.log(value)
      this.updatePregunta({
        id: this.indicePregunta,
        problema: {
          descripcion: value,
          analisis: this.participante.preguntas[this.indicePregunta].problema.analisis
        },
        acciones: this.participante.preguntas[this.indicePregunta].acciones
      })
    },
    actualizarAcciones (value) {
      this.updatePregunta({
        id: this.indicePregunta,
        problema: this.participante.preguntas[this.indicePregunta].problema,
        acciones: {
          descripcion: value,
          analisis: this.participante.preguntas[this.indicePregunta].acciones.analisis
        }
      })
    }
  }
}
</script>
