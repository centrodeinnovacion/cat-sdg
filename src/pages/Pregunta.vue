<template>
  <v-card-text>
    <v-container>
      <v-layout wrap>
        <v-alert
          :value="false"
          :type="alerta.tipo"
        >
          {{ alerta.texto }}
        </v-alert>
        <v-flex xs12>
          <div v-for="(pregunta, indicePregunta) in participante.preguntas" :key="indicePregunta">
            <div>{{ indicePregunta + 1 }}) Indique el problema número {{ indicePregunta + 1 }} que aqueja a su comunidad y las acciones que se han realizado al respecto</div>
            <v-textarea
              :readonly="true"
              :hint="mensaje[estados[indicePregunta].problema.hint]"
              :ref="estados[indicePregunta].problema.tipo + indicePregunta"
              :label="'Problema ' + (indicePregunta + 1)"
              v-model="estados[indicePregunta].problema.contenido"
              @input="actualizarProblema"
            >
              <v-slide-x-reverse-transition
                slot="append-outer"
                mode="out-in"
              >
                <v-icon
                  v-if="estados[indicePregunta].accion.mostrar"
                  :color="estados[indicePregunta].problema.color"
                  @click="capturarAudio(estados[indicePregunta].problema.tipo, indicePregunta)"
                >{{ estados[indicePregunta].problema.icono }}</v-icon>
              </v-slide-x-reverse-transition>
            </v-textarea>

              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex
                    v-for="ods in pregunta.problema.ods" 
                    :key="'-ods-pregunta-' + indicePregunta + '-' + ods.nombre"
                  >
                    
                      <v-avatar 
                        :tile="true"
                        :size="40"
                        color="grey lighten-4"
                      >
                        <!-- mostrarMetas(ods, indicePregunta, 'problema') -->
                        <v-img
                          :src="iconosOds[ods.nombre]"
                          alt="ods"
                          @click="metasActuales[indicePregunta].problema = calcularMetas(ods)"
                        ></v-img>
                      </v-avatar>
                      <v-progress-linear
                        color="black"
                        height="5"
                        :value="ods.porcentaje"
                      ></v-progress-linear>
                  </v-flex>
                </v-layout>
              </v-container>
            <div v-if="pregunta.problema.analisis.resultados.ods">
              {{metasActuales[indicePregunta].problema}}
            </div><br>
 
            <v-textarea
              :readonly="true"
              :hint="mensaje[estados[indicePregunta].accion.hint]"
              :ref="estados[indicePregunta].accion.tipo + indicePregunta"
              :label="'Acciones ' + (indicePregunta + 1)"
              v-model="estados[indicePregunta].accion.contenido"
              @input="actualizarAcciones"
            >
              <!-- 
                prepend-icon="check_circle_outline"
                @input="actualizarAcciones($event, indicePregunta)" -->
              <v-slide-x-reverse-transition
                slot="append-outer"
                mode="out-in"
              >
                <v-icon
                  v-if="estados[indicePregunta].accion.mostrar"
                  :color="estados[indicePregunta].accion.color"
                  @click="capturarAudio(estados[indicePregunta].accion.tipo, indicePregunta)"
                >{{ estados[indicePregunta].accion.icono }}</v-icon>
              </v-slide-x-reverse-transition>
            </v-textarea>
            
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex
                    v-for="ods in pregunta.acciones.ods" 
                    :key="'-ods-acciones-' + indicePregunta + '-' + ods.nombre"
                  >
                      <v-avatar 
                        :tile="true"
                        :size="40"
                        color="grey lighten-4"
                      >
                        <v-img
                          :src="iconosOds[ods.nombre]"
                          :alt="ods.nombre"
                          @click="metasActuales[indicePregunta].accion = calcularMetas(ods)"
                        ></v-img>
                      </v-avatar>
                      <v-progress-linear
                        color="black"
                        height="5"
                        :value="ods.porcentaje"
                      ></v-progress-linear>
                  </v-flex>
                </v-layout>
              </v-container>
            
            <div v-if="pregunta.acciones.analisis.resultados.ods">
              {{metasActuales[indicePregunta].accion}}
            </div><br>
          </div>
          <div>Pendientes de Traducir por Carina: {{traduccionesPendientes}}</div>
          <div v-for="i in traduccionesPendientes" :key="'progresoTraductor' + i">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { UPDATE_PREGUNTAS } from '@/store/participante/mutations'
import axios from 'axios'

export default {
  name: 'pregunta',
  data: function () {
    return {
      active: '',
      metasActuales: [
        {problema: '', accion: ''},
        {problema: '', accion: ''},
        {problema: '', accion: ''}
      ],
      traduccionesPendientes: 0,
      reconocimiento: null,
      textoFinal: '',
      textoIntermedio: '',
      reconociendo: false,
      ignorarFinal: null,
      tiempoDeInicio: null,
      dosLineas: `/\n\n/g`,
      unaLinea: `/\n/g`,
      primerLetra: `/\S/`,
      elementoActual: null,
      tipoActual: 'problema',
      indiceActual: 0,
      mensaje: {
        inicial: 'Puede hacer clic en el micrófono de la derecha y empezar a hablar para registrar su respuesta.',
        hablar: 'Hable ahora.',
        sinEscuchar: 'No se han detectado palabras. Es posible que requiera ajustar la configuración del micrófono',
        sinMicrofono: 'No se ha encontrado el micrófono. Asegurece que el micrófono está instalado y que la configuración del microfono esté correcta.',
        permitir: 'Haga clic en el botón "Permitir" para habilitar su micrófono.',
        denegado: 'El permiso para usar el micrófono se ha denegado.',
        bloqueado: 'El permiso para usar el micrófono está bloqueado. Para cambiarlo, debe hacer los cambios en la configuración de su navegador o equipo',
        actualizar: 'Web Speech API no está soportado en este navegador. No podemos hacer captura y reconocimiento de audio.'
      },
      alerta: {
        valor: false,
        tipo: 'info',
        texto: 'Puede hacer clic en el micrófono de la derecha y empezar a hablar para registrar su respuesta.'
      },
      estadoActual: ''
    }
  },
  props: ['estados'],
  computed: {
    ...mapGetters('participante', {
      participante: 'nuevoParticipante'
    }),
    ...mapGetters('app', {
      iconosOds: 'iconosOds'
    })
  },
  mounted: function () {
    if (!('SpeechRecognition' in window)) {
      if (!('webkitSpeechRecognition' in window)) {
        // Indique que se require actualizar el navegador
        this.ajustarTodosBotonesAudio('off')
        this.ajustarAlerta(true, 'error', 'actualizar')
        this.ajustarHint('actualizar')
        console.log('No se logró iniciar webkitSpeechRecognition')
        return
      } else {
        /* eslint new-cap: ["error", { "newIsCapExceptions": ["webkitSpeechRecognition"] }] */
        this.reconocimiento = new window.webkitSpeechRecognition()
      }
    } else {
      this.reconocimiento = new window.SpeechRecognition()
    }
    // this.reconocimiento.continuous = true // ideal para computador
    this.reconocimiento.continuous = true
    this.reconocimiento.interimResults = true
    this.reconocimiento.lang = 'es-CO'
    this.reconocimiento.onstart = this.alIniciarReconocimiento
    this.reconocimiento.onerror = this.alErrorEnReconocimiento
    this.reconocimiento.onend = this.alFinalizarReconocimiento
    this.reconocimiento.onresult = this.alResultadoDelReconocimiento
    this.ajustarTodosBotonesAudio('ok')
    this.ajustarTodosLosHints('inicial')
    console.log('Se creó el objeto para reconocimiento')
    // console.log(this.reconocimiento)
  },
  methods: {
    ...mapMutations('participante', {
      updatePregunta: UPDATE_PREGUNTAS
    }),
    mostrarMetas (datosOds, pregunta, tipo) {
      // console.log(datosOds)
      this.metasActuales[pregunta][tipo] = this.calcularMetas(datosOds)
    },
    calcularMetas (datosOds) {
      // console.log(datosOds)
      let ods = datosOds.nombre
      let metas = datosOds.metas
      let porcentaje = Math.round(datosOds.porcentaje) + '%'
      // console.log(ods, metas, porcentaje)
      let numOds = ods.slice('ods_'.length)
      let cadena = 'meta_' + numOds + '_'
      let iniciarEn = cadena.length
      let separador = ', '
      let metasOds = []
      // console.log(cadena, cadena.length)
      metasOds = metas.filter(meta => {
        return meta.includes(cadena)
      })
      // console.log(metasOds)
      let soloNumeros = ''
      let cantMetas = metasOds.length - 1
      metasOds.sort()
      metasOds.forEach((meta, indice) => {
        let agregar = ''
        if (indice === (cantMetas - 1)) {
          agregar = ' y '
        } else if (indice === cantMetas) {
          agregar = ''
        } else {
          agregar = separador
        }
        // console.log(meta)
        // console.log(meta.slice(iniciarEn))
        soloNumeros += meta.slice(iniciarEn) + agregar
      })
      let mensaje = ''
      if (metasOds.length === 1) {
        mensaje = ' la meta identificada es la: '
      } else if (metasOds.length > 1) {
        mensaje = ' las metas identificadas son: '
      }
      let textoPalabras = ''
      if (datosOds.palabras !== undefined) {
        textoPalabras = '. Con base en '
        if (datosOds.palabras.length === 0) {
          textoPalabras = ''
        } else if (datosOds.palabras.length === 1) {
          textoPalabras += 'la palabra ' + datosOds.palabras[0]
        } else if (datosOds.palabras.length > 1) {
          let lasPalabras = ''
          datosOds.palabras.forEach((palabra, indicePalabra) => {
            if (indicePalabra === (datosOds.palabras.length - 1)) {
              if (String(palabra[0]).toLowerCase() === 'i') {
                lasPalabras += ' e ' + palabra
              } else {
                lasPalabras += ' y ' + palabra
              }
            } else if (indicePalabra === (datosOds.palabras.length - 2)) {
              lasPalabras += palabra
            } else {
              lasPalabras += palabra + ', '
            }
          })
          textoPalabras += 'las palabras ' + lasPalabras
        }
      }
      let textoFinal = ''
      if (numOds === '0') {
        textoFinal = 'Carina no pudo identificar ninguna relación del texto con los ODS'
      } else {
        textoFinal = 'El Ods ' + numOds + ' tiene un porcentaje de ' + porcentaje + ' y ' + mensaje + soloNumeros + textoPalabras
      }
      return textoFinal
      // console.log(soloNumeros)
    },
    capitalizar (s) {
      return s.replace(this.primerLetra, (m) => m.toUpperCase())
    },
    quebrarLinea (s) {
      return s.replace(this.dosLineas, '<p></p>').replace(this.unaLinea, '<br>')
    },
    alResultadoDelReconocimiento (evento) {
      this.textoIntermedio = ''
      this.textoFinal = ''
      for (var i = evento.resultIndex; i < evento.results.length; ++i) {
        if (evento.results[i].isFinal) {
          this.textoFinal += event.results[i][0].transcript
        } else {
          this.textoIntermedio += event.results[i][0].transcript
        }
      }
      this.estados[this.indiceActual][this.tipoActual].contenido = this.quebrarLinea(this.textoIntermedio)
      if (this.textoFinal !== '') {
        this.textoFinal = this.capitalizar(this.textoFinal)
        this.textoFinal = this.quebrarLinea(this.textoFinal)
        this.estados[this.indiceActual][this.tipoActual].contenido = this.textoFinal
      }
      // console.log('alResultadoDelReconocimiento')
    },
    ejecutarTraduccion (datos) {
      // axios.post('https://carinalab.co:3000/api/carinaligth/v1/inputText', datos)

      axios.post('https://carina-bcb3a.appspot.com/api/carinaligth/v1/inputText', datos)
        .then(this.procesarTraduccion)
        .catch(function (error) {
          console.log(error)
          this.traduccionesPendientes -= 1
        })
      this.traduccionesPendientes += 1
    },
    procesarTraduccion (response) {
      if (response) {
        // console.log('Respuesta desde Carina: ', response)
        if (response.data.response.estado.codigo === 200) {
          // console.log('se llama a actualizarAnalisis')
          this.actualizarAnalisis(response.data.response)
        } else {
          // console.log('se llama a actualizarAnalisisSinResultados')
          this.actualizarAnalisisSinResultados(response.data.response)
        }
      } else {
        // console.log('Carina no pudo identificar relación con los ODS')
        this.traduccionesPendientes -= 1
      }
    },
    alFinalizarReconocimiento () {
      // esta es una alternativa par el registro en el store de los cambios
      if (this.tipoActual === 'problema') {
        this.actualizarProblema()
      } else if (this.tipoActual === 'accion') {
        this.actualizarAcciones()
      }
      this.reconociendo = false
      if (this.ignorarFinal) { return }
      this.ajustarTodosBotonesAudio('ok')
      if (!this.textoFinal) {
        this.ajustarHint('inicial')
        return
      }
      this.ajustarTodosLosHints('inicial')
      this.ajustarAlerta(false, 'info', 'en espera')
      let datos = {
        datos: {
          tipo: this.tipoActual,
          indice: this.indiceActual
        },
        descripcion: this.textoFinal
      }
      this.ejecutarTraduccion(datos)
      // console.log('alFinalizarReconocimiento')
    },
    alErrorEnReconocimiento (evento) {
      if (evento.error === 'no-speech') {
        this.ajustarTodosBotonesAudio('ok')
        this.ajustarAlerta(true, 'info', 'sinEscuchar')
        this.ajustarHint('sinEscuchar')
        this.ignorarFinal = true
      }
      if (evento.error === 'audio-capture') {
        this.ajustarIcono('mic_none', 'mic_none', 'info')
        this.ajustarAlerta(true, 'info', 'sinMicrofono')
        this.ajustarHint('sinMicrofono')
        this.ignorarFinal = true
      }
      if (evento.error === 'not-allowed') {
        if (evento.timeStamp - this.tiempoDeInicio < 500) {
          this.ajustarHint('bloqueado')
          this.ajustarAlerta(true, 'info', 'bloqueado')
        } else {
          this.ajustarHint('denegado')
          this.ajustarAlerta(true, 'info', 'denegado')
        }
        this.ajustarIcono('mic_none', 'mic_none', 'info')
        this.ignorarFinal = true
      }
      // console.log('alErrorEnReconocimiento')
    },
    alIniciarReconocimiento () {
      this.reconociendo = true
      this.ajustarIcono('mic', 'mic', 'success')
      this.botonesAudio('mic_off', 'red')
      this.ajustarAlerta(true, 'info', 'hablar')
      this.ajustarHint('hablar')
      // console.log('alIniciarReconocimiento')
    },
    // limpiarLosContenidos () {
    //   for (let posActual in this.estados) {
    //     for (let tipoActual in this.estados[posActual]) {
    //       this.estados[posActual][tipoActual].contenido = ''
    //     }
    //   }
    // },
    ajustarTodosBotonesAudio (ajuste) {
      let icono, color
      if (ajuste === 'ok') {
        icono = 'mic_none'
        color = 'info'
      } else if (ajuste === 'off') {
        icono = 'mic_off'
        color = 'red'
      } else if (ajuste === 'on') {
        icono = 'mic'
        color = 'success'
      }
      for (let posActual in this.estados) {
        for (let tipoActual in this.estados[posActual]) {
          this.estados[posActual][tipoActual].estado = icono
          this.estados[posActual][tipoActual].icono = icono
          this.estados[posActual][tipoActual].color = color
        }
      }
    },
    ajustarTodosLosHints (aHint) {
      for (let posActual in this.estados) {
        for (let tipoActual in this.estados[posActual]) {
          this.estados[posActual][tipoActual].hint = aHint
        }
      }
    },
    botonesAudio (icono, color, mostrar = true) {
      let indice = this.indiceActual
      let tipo = this.tipoActual
      for (let posActual in this.estados) {
        for (let tipoActual in this.estados[posActual]) {
          if (this.estados[indice][tipo] !== this.estados[posActual][tipoActual]) {
            this.estados[posActual][tipoActual].estado = icono
            this.estados[posActual][tipoActual].icono = icono
            this.estados[posActual][tipoActual].color = color
            this.estados[posActual][tipoActual].mostrar = mostrar
          }
        }
      }
    },
    ajustarAlerta (valor, tipo, texto) {
      this.alerta = {
        valor, tipo, texto: this.mensaje[texto]
      }
    },
    ajustarIcono (estado, icono, color) {
      this.estados[this.indiceActual][this.tipoActual].estado = estado
      this.estados[this.indiceActual][this.tipoActual].icono = icono
      this.estados[this.indiceActual][this.tipoActual].color = color
    },
    ajustarHint (texto) {
      this.estados[this.indiceActual][this.tipoActual].hint = texto
    },
    iniciarRegistro () {
      // console.log('iniciarRegistro')
      if (this.reconociendo) {
        this.reconocimiento.stop()
        this.ajustarIcono('mic_none', 'mic_none', 'info')
        this.botonesAudio('mic_none', 'info')
        return
      }
      this.textoFinal = ''
      this.reconocimiento.start()
      this.ignorarFinal = false
      this.estados[this.indiceActual][this.tipoActual].contenido = ''
      this.ajustarIcono('mic', 'mic', 'success')
      // this.botonesAudio('mic_off', 'red', false)
      this.estados[this.indiceActual][this.tipoActual].hint = 'permitir'
    },
    capturarAudio (tipo, indice) {
      // if (indice !== this.indiceActual) {
      //   if (this.estados[indice][tipo].icono === 'mic_off') {
      //     return
      //   }
      // }
      // console.log(evento)
      let referencia = this.estados[indice][tipo].tipo + indice
      let elemento = this.$refs[referencia][0]
      // elemento.focus()
      // Se deben calcular todos lo elementos OJO!!!!!!!!
      this.elementoActual = elemento
      this.tipoActual = tipo
      this.indiceActual = indice
      this.tiempoDeInicio = new Date()
      // if (elemento.value === '') {
      this.iniciarRegistro()
      // }
      // console.log(elemento.value)
      // console.log('capturarAudio')
    },
    actualizarProblema () {
      this.updatePregunta({
        id: this.indiceActual,
        problema: {
          descripcion: this.estados[this.indiceActual].problema.contenido,
          analisis: this.participante.preguntas[this.indiceActual].problema.analisis
        },
        acciones: this.participante.preguntas[this.indiceActual].acciones
      })
      // console.log('actualizarProblema')
    },
    actualizarAcciones () {
      this.updatePregunta({
        id: this.indiceActual,
        problema: this.participante.preguntas[this.indiceActual].problema,
        acciones: {
          descripcion: this.estados[this.indiceActual].accion.contenido,
          analisis: this.participante.preguntas[this.indiceActual].acciones.analisis
        }
      })
      // console.log('actualizarAcciones')
    },
    actualizarAnalisisSinResultados (datos) {
      // console.log('actualizarAnalisisSinResultados, inicio: ', datos)
      let pregunta = {
        id: datos.datos.indice,
        problema: this.participante.preguntas[datos.datos.indice].problema,
        acciones: this.participante.preguntas[datos.datos.indice].acciones
      }
      if (datos.datos.tipo === 'accion') {
        pregunta.acciones.analisis = {
          evidencias: {},
          resultados: {
            metas: ['meta_0_0'],
            ods: ['ods_0'],
            words: {}
          }
        }
        pregunta.acciones.cantidad = 0
        pregunta.acciones.ods = [
          {
            cantidad: 0,
            metas: ['meta_0_0'],
            nombre: 'ods_0',
            porcentaje: 0
          }
        ]
        pregunta.acciones.palabras = datos.palabras
        // Actualizar mensaje de no traducción
        this.metasActuales[datos.datos.indice].accion = 'Carina no pudo identificar una relación con los ODS'
      } else if (datos.datos.tipo === 'problema') {
        pregunta.problema.analisis = {
          evidencias: {},
          resultados: {
            metas: ['meta_0_0'],
            ods: ['ods_0'],
            words: {}
          }
        }
        pregunta.problema.cantidad = 0
        pregunta.problema.ods = [
          {
            cantidad: 0,
            metas: ['meta_0_0'],
            nombre: 'ods_0',
            porcentaje: 0
          }
        ]
        pregunta.problema.palabras = datos.palabras
        // Actualizar mensaje de no traducción
        this.metasActuales[datos.datos.indice].problema = 'Carina no pudo identificar una relación con los ODS'
      } else { return }
      // console.log('actualizarAnalisisSinResultados, final: ', pregunta)
      this.updatePregunta(pregunta)
      this.traduccionesPendientes -= 1
      // console.log('actualizarAnalisis')
    },
    agregarPalabrasEnOds (ods, palabras) {
      // console.log('Ods que entra: ', ods)
      let nuevoOds = [...ods]
      palabras.forEach((palabra) => {
        palabra.ods.forEach((odsActual) => {
          nuevoOds.forEach((odsCambiar) => {
            if (odsCambiar.nombre === odsActual.nombre) {
              if (odsCambiar.palabras === undefined) {
                odsCambiar['palabras'] = []
              }
              odsCambiar.palabras.push(palabra.nombre)
            }
          })
        })
      })
      // console.log('Ods con palabras: ', nuevoOds)
      return nuevoOds
    },
    actualizarAnalisis (datos) {
      // console.log('actualizarAnalisis: ', datos)
      let pregunta = {
        id: datos.datos.indice,
        problema: this.participante.preguntas[datos.datos.indice].problema,
        acciones: this.participante.preguntas[datos.datos.indice].acciones
      }
      datos.ods = this.agregarPalabrasEnOds(datos.ods, datos.palabras)
      if (datos.datos.tipo === 'accion') {
        pregunta.acciones.analisis = datos.analisis
        pregunta.acciones.palabras = datos.palabras
        pregunta.acciones.ods = datos.ods
      } else if (datos.datos.tipo === 'problema') {
        pregunta.problema.analisis = datos.analisis
        pregunta.problema.palabras = datos.palabras
        pregunta.problema.ods = datos.ods
      } else { return }
      this.updatePregunta(pregunta)
      this.traduccionesPendientes -= 1
      // console.log('actualizarAnalisis')
    }
  }
}
</script>

<style>
/* .v-badge {
  margin-right: 10px;
  margin-bottom: 10px;
} */
.d-flex {
  flex: initial !important;
}
.v-avatar {
  margin-right: 5px !important;
}
.v-progress-linear {
  margin: 0 !important;
  padding: 0 !important;
  width: 40px !important;
}
</style>
