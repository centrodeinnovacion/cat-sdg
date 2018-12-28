<template>
  <v-card>
    <v-toolbar
      card
      color="primary"
      dark
    >
      <v-toolbar-title>
        <v-icon>question_answer</v-icon>
        <span>Nueva Encuesta</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn 
          flat 
          to="/"
        >
          <v-icon>keyboard_backspace</v-icon>
          <span>Inicio</span>
        </v-btn>
        <v-btn 
          flat 
          to="/monitor"
        >
          <v-icon>search</v-icon>
          <span>Monitor</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-subheader>Información del Participante</v-subheader>
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            ref="sexo"
            v-model="participante.sexo"
            @input="actualizarSexo"
            :items="sexos"
            label="Sexo"
            prepend-icon="wc"
            chips
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="participante.rangoEdad"
            @input="actualizarRangoEdad"
            :items="rangosDeEdad"
            label="Rango de Edad"
            prepend-icon="date_range"
            chips
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-autocomplete
            v-model="participante.departamento"
            @input="actualizarDepartamento"
            :items="departamentos"
            label="¿En qué departamento reside?"
            prepend-icon="terrain"
            chips
          >
          </v-autocomplete>
        </v-flex>
        <v-flex xs12>
          <v-autocomplete
            v-model="participante.ciudad"
            @input="actualizarCiudad"
            :items="ciudades"
            label="¿En qué ciudad reside?"
            prepend-icon="location_city"
            chips
          >
          </v-autocomplete>
        </v-flex>
        <v-flex xs12>
          <v-select
            v-model="participante.zona"
            @input="actualizarZona"
            :items="zonas"
            label="Origen del entrevistado"
            prepend-icon="place"
            chips
          ></v-select>
        </v-flex>
      </v-layout>
    </v-container>

    <v-subheader>Temas Prioritarios</v-subheader>
    <v-container>
      <v-layout wrap>
        <v-card-text>¿Cuáles de estos temas considera Usted que son importantes para usted y su familia? Seleccione los 6 más importantes</v-card-text>
        <v-checkbox v-for="(prioridad, indice) in preguntasSobrePrioridades" :key="indice" :name="'prioridad' + indice"
          :label="prioridad.pregunta"
          v-model="participante.prioridades[indice]"
          @change="actualizarPrioridad($event, indice)"
          type="checkbox"
        ></v-checkbox>
      </v-layout>
    </v-container>

    <v-subheader>Problemáticas</v-subheader>
    <v-card-text>
      ¿Cuáles son las tres principales problemáticas que usted enfrenta?
    </v-card-text>
    <pregunta :estados="estados" />

   
        <v-btn depressed color="white" to="/">Cancelar</v-btn>
        <v-btn depressed color="white" @click="limpiarLosContenidos">Limpiar</v-btn>
        <v-btn depressed @click="registrarParticipante" color="white">Guardar</v-btn>

    <v-snackbar
      v-model="mensaje.mostrar"
      :timeout="6000"
      :top="true"
      :vertical="true"
    >
      {{ mensaje.texto }}
      <v-btn
        color="white"
        flat
        @click="mensaje.mostrar = false"
      >
        X
      </v-btn>
    </v-snackbar>

  </v-card>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { UPDATE_INFORMATION, UPDATE_PRIORIDADES, UPDATE_MENSAJES, ADD_PREGUNTA, RESET_PREGUNTA } from '@/store/participante/mutations'
import pregunta from '@/pages/Pregunta'

export default {
  name: 'Create',
  components: { pregunta },
  data () {
    return {
      estados: [
        {
          active: '',
          problema: {
            hint: 'actualizar',
            tipo: 'problema',
            icono: 'mic_off',
            estado: 'mic_off',
            color: 'red',
            contenido: '',
            elemento: null,
            mostrar: true
          },
          accion: {
            hint: 'actualizar',
            tipo: 'accion',
            icono: 'mic_off',
            estado: 'mic_off',
            color: 'red',
            contenido: '',
            elemento: null,
            mostrar: true
          }
        },
        {
          problema: {
            hint: 'actualizar',
            tipo: 'problema',
            icono: 'mic_off',
            estado: 'mic_off',
            color: 'red',
            contenido: '',
            elemento: null,
            mostrar: true
          },
          accion: {
            hint: 'actualizar',
            tipo: 'accion',
            icono: 'mic_off',
            estado: 'mic_off',
            color: 'red',
            contenido: '',
            elemento: null,
            mostrar: true
          }
        },
        {
          problema: {
            hint: 'actualizar',
            tipo: 'problema',
            icono: 'mic_off',
            estado: 'mic_off',
            color: 'red',
            contenido: '',
            elemento: null,
            mostrar: true
          },
          accion: {
            hint: 'actualizar',
            tipo: 'accion',
            icono: 'mic_off',
            estado: 'mic_off',
            color: 'red',
            contenido: '',
            elemento: null,
            mostrar: true
          }
        }
      ]
    }
  },
  mounted: function () {
    this.limpiarLosContenidos()
  },
  methods: {
    limpiarLosContenidos () {
      for (let posActual in this.estados) {
        for (let tipoActual in this.estados[posActual]) {
          this.estados[posActual][tipoActual].contenido = ''
        }
      }
      this.reset()
    },
    registrarParticipante () {
      this.create()
      // this.$refs.sexo.focus()
      this.limpiarLosContenidos()
    },
    ...mapActions('participante', {
      create: 'create'
    }),
    ...mapMutations('participante', {
      updateInformation: UPDATE_INFORMATION,
      updatePriordad: UPDATE_PRIORIDADES,
      updateMensajes: UPDATE_MENSAJES,
      addPregunta: ADD_PREGUNTA,
      reset: RESET_PREGUNTA
    }),
    actualizarMensajes (mostrar, texto) {
      this.updateMensajes({
        mostrar: mostrar,
        texto: texto
      })
    },
    actualizarPrioridad (event, indice) {
      this.updatePriordad({
        id: indice,
        valor: event
      })
    },
    actualizarRangoEdad (value) {
      this.updateInformation({
        sexo: this.participante.sexo,
        rangoEdad: value,
        zona: this.participante.zona,
        prioridades: this.participante.prioridades,
        preguntas: this.participante.preguntas
      })
    },
    actualizarSexo (value) {
      this.updateInformation({
        sexo: value,
        rangoEdad: this.participante.rangoEdad,
        departamento: this.participante.departamento,
        ciudad: this.participante.ciudad,
        zona: this.participante.zona,
        prioridades: this.participante.prioridades,
        preguntas: this.participante.preguntas
      })
    },
    actualizarDepartamento (value) {
      this.updateInformation({
        sexo: this.participante.sexo,
        rangoEdad: this.participante.rangoEdad,
        departamento: value,
        ciudad: this.participante.ciudad,
        zona: this.participante.zona,
        prioridades: this.participante.prioridades,
        preguntas: this.participante.preguntas
      })
    },
    actualizarCiudad (value) {
      this.updateInformation({
        sexo: this.participante.sexo,
        rangoEdad: this.participante.rangoEdad,
        departamento: this.participante.departamento,
        ciudad: value,
        zona: this.participante.zona,
        prioridades: this.participante.prioridades,
        preguntas: this.participante.preguntas
      })
    },
    actualizarZona (value) {
      this.updateInformation({
        sexo: this.participante.sexo,
        rangoEdad: this.participante.rangoEdad,
        departamento: this.participante.departamento,
        ciudad: this.participante.ciudad,
        zona: value,
        prioridades: this.participante.prioridades,
        preguntas: this.participante.preguntas
      })
    }
  },
  computed: {
    departamentos: function () {
      let dptos = []
      this.$store.state.colombia.forEach(element => {
        dptos[element.id] = element.departamento
      })
      return dptos
    },
    ciudades: function () {
      let ciudades = []
      let deptoActual = this.participante.departamento
      if (deptoActual) {
        ciudades = this.$store.state.colombia.find(
          (depto) => depto.departamento === deptoActual
        ).ciudades
      }
      return ciudades
    },
    ...mapGetters('participante', {
      participante: 'nuevoParticipante',
      mensaje: 'mensaje'
    }),
    ...mapGetters('app', {
      preguntasSobrePrioridades: 'preguntasSobrePrioridades',
      sexos: 'sexos',
      rangosDeEdad: 'rangosDeEdad',
      zonas: 'zonas'
    })
  }
}
</script>
