<template>
  <v-card flat>
    <v-toolbar
      card
      color="primary"
      dark
    >
      <v-toolbar-title>
        <v-icon>question_answer</v-icon>
        <span>Monitoreo</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn 
          flat
          dark to="/">
          <v-icon>keyboard_backspace</v-icon>
          <span>Inicio</span>
        </v-btn>
        <v-btn 
          flat
          to="/create">
          <v-icon>add</v-icon>
          <span>Encuesta</span>
        </v-btn>
      </v-toolbar-items>  
    </v-toolbar>
    
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex>

              <v-btn 
                flat 
                color="teal" 
                @click="ajustarDatosAMostrar(entrevistasUsuarioActual, 'realizadas por el Usuario Actual')"> 
                <v-icon>person</v-icon>
                <span>Usuario ({{entrevistasUsuarioActual.length}})</span>        
              </v-btn>
              <v-menu>
                <v-btn
                  flat
                  slot="activator"
                  color="teal"
                >
                  <v-icon>terrain</v-icon>
                  <span>Depto</span>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-for="(item, index) in itemsDepartamentos"
                    :key="index"
                    @click="ajustarDatosAMostrar(entrevistasPorDepartamento[item.nombre], ' de ' + item.nombre)"
                  >
                    <v-list-tile-title>{{ item.nombreCantidad }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-menu>
                <v-btn
                  slot="activator"
                  color="teal"
                  flat
                >
                  <v-icon>wc</v-icon>
                  <span>Sexo</span>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-for="(item, index) in itemsSexo"
                    :key="index"
                    @click="ajustarDatosAMostrar(entrevistasPorSexo[item.nombre], ' de personas del sexo ' + item.nombre)"
                  >
                    <v-list-tile-title>{{ item.nombreCantidad }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-menu>
                <v-btn
                  slot="activator"
                  color="teal"
                  flat
                >
                  <v-icon>date_range</v-icon>
                  <span>Edad</span>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-for="(item, index) in itemsRangoEdad"
                    :key="index"
                    @click="ajustarDatosAMostrar(entrevistasPorRangoEdad[item.nombre], 'de personas en el rango de edad entre ' + item.nombre + ' años')"
                  >
                    <v-list-tile-title>{{ item.nombreCantidad }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-btn 
                flat
                color="teal" 
                @click="ajustarDatosAMostrar(todasLasEntrevistas, ' que se encuentran en toda la base de datos.')"> 
                <v-icon>done_all</v-icon>
                <span>Todos ({{todasLasEntrevistas.length}})</span>
              </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      
    <v-divider class="my-2"></v-divider>

    <v-card-text v-if="datosAMostrarResumen && (datosAMostrarResumen.length > 0)"> 
      <v-subheader>Encuestas sobre Objetivos de Desarrollo Sustentable (ODS) <b><em>{{mostrandoActualmente}}</em></b></v-subheader>
      <v-divider class="my-2"></v-divider>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex
              v-for="odsActual in datosAMostrarResumen" 
              :key="'-ods-resumen-' + odsActual.nombre"
            >
                <v-avatar 
                  :tile="true"
                  :size="40"
                >
                  <v-img
                    :src="iconosOds[odsActual.nombre]"
                    :alt="odsActual.nombre"
                    @click="detalleResumen = construirMensajeResumen(odsActual)"
                  ></v-img>
                </v-avatar>
                <v-progress-linear
                  color="black"
                  height="5"
                  :value="odsActual.porcentaje"
                ></v-progress-linear>    
            </v-flex>
          </v-layout>
        </v-container>

      <div v-if="detalleResumen">
        {{detalleResumen}}
      </div><br>
    
      <v-expansion-panel>
        <v-expansion-panel-content v-for="(entrevista, indiceEntrevista) in datosAMostrar" :key="'entrevista' + indiceEntrevista">
          <div slot="header">Participante {{ indiceEntrevista + 1 }}</div>
          <v-subheader>Información del Participante {{ indiceEntrevista }}</v-subheader>
          <v-card-text>
            <div>
              <span class="grey--text">Fecha: </span>
              <span>{{entrevista.fecha}}</span><br>
              <span class="grey--text">Sexo: </span>
              <span>{{entrevista.sexo}}</span><br>
              <span class="grey--text">Rango de Edad: </span>
              <span>{{entrevista.rangoEdad}}</span><br>
              <span class="grey--text">Departamento: </span>
              <span>{{entrevista.departamento}}</span><br>
              <span class="grey--text">Ciudad: </span>
              <span>{{entrevista.Ciudad}}</span><br>
              <span class="grey--text">Zona: </span>
              <span>{{entrevista.zona}}</span><br>
            </div>
          </v-card-text>
          <v-subheader>Temas Prioritarios</v-subheader>
          <v-card-text>
            <div v-for="(prioridad, indicePrioridad) in entrevista.prioridades" :key="'prioridad' + indicePrioridad" :indice="indicePrioridad">
              <div v-if="prioridad">
                <span class="grey--text">{{indicePrioridad + 1}}) {{ preguntasSobrePrioridades[indicePrioridad].pregunta }}  </span>
                <v-flex>
                  <v-avatar 
                    v-for="ods in preguntasSobrePrioridades[indicePrioridad].ods" 
                    :key="indicePrioridad + '-ods-prioridades-' + ods"
                    :tile="true"
                    :size="40"
                    color="grey lighten-4"
                  >
                    <v-img
                      :src="iconosOds['ods_' + ods]"
                      :alt="'ods_' + ods"
                    ></v-img>
                  </v-avatar>
                </v-flex>
              </div>
            </div>
          </v-card-text>
          <v-subheader>Problemas</v-subheader>
          <v-card-text v-for="(pregunta, indicePregunta) in entrevista.preguntas" :key="'problematica' + indicePregunta" :indice="'problematica' + indicePregunta">
            <div>
              <span class="grey--text">Problema  {{ indicePregunta + 1 }}</span>
              <span>{{pregunta.problema.descripcion}}</span>
             
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      v-for="ods in pregunta.problema.ods" 
                      :key="'-ods-pregunta-' + indicePregunta + '-' + ods.nombre"
                    >
                        <v-avatar 
                          :tile="true"
                          :size="40"
                        >
                          <v-img
                            :src="iconosOds[ods.nombre]"
                            alt="ods.nombre"
                            @click="datosAMostrar[indiceEntrevista].detalleMetas[indicePregunta].problema = calcularMetas(ods)"
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
                {{entrevista.detalleMetas[indicePregunta].problema}}
              </div><br>



              <span class="grey--text">Acciones {{ indicePregunta  + 1 }}</span>
              <span>{{pregunta.acciones.descripcion}}</span><br>

                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      v-for="ods in pregunta.acciones.ods" 
                      :key="indicePregunta + '-ods-acciones-' + ods.nombre"
                    >
                        <v-avatar 
                          :tile="true"
                          :size="40"
                        >
                          <v-img
                            :src="iconosOds[ods.nombre]"
                            alt="ods.nombre"
                            @click="datosAMostrar[indiceEntrevista].detalleMetas[indicePregunta].accion = calcularMetas(ods)"
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
                {{entrevista.detalleMetas[indicePregunta].accion}}
              </div><br>

              <v-divider />
            </div>
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card-text>
  </v-card>
</template>

<script>
import db from '@/db'
import firebase from '@/firebase'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'Monitor',
  data: function () {
    return {
      active: '',
      mostrandoActualmente: '',
      bottomNav: 'usuario',
      metasActuales: [
        {problema: '', accion: ''},
        {problema: '', accion: ''},
        {problema: '', accion: ''}
      ],
      detalleResumen: '',
      backupDb: null,
      traducciones: [],
      datosCargados: false,
      entrevistasUsuarioActual: [],
      todasLasEntrevistas: [],
      entrevistasPorDepartamento: {},
      entrevistasPorSexo: {},
      entrevistasPorRangoEdad: {},
      datosAMostrar: [],
      datosAMostrarResumen: [],
      usuarioActual: firebase.auth().currentUser,
      departamentosActuales: [],
      sexosActuales: [],
      rangosEdadActuales: [],
      departamentoSeleccionado: '',
      observer: null
    }
  },
  computed: {
    ...mapGetters('app', {
      iconosOds: 'iconosOds',
      preguntasSobrePrioridades: 'preguntasSobrePrioridades'
    }),
    datosParaResumen () {
      // calcular los ods generales con el valor y las metas ...
      let datos = []
      let resumen = {}
      let acumulado = 0
      if (this.datosAMostrar.length > 0) {
        this.datosAMostrar.forEach((entrevista) => {
          entrevista.preguntas.forEach((pregunta) => {
            pregunta.acciones.ods.forEach((ods) => {
              if (ods.nombre !== 'ods_0') {
                if (resumen[ods.nombre] === undefined) {
                  resumen[ods.nombre] = {}
                  resumen[ods.nombre] = ods
                  resumen[ods.nombre] = this.agregarPalabrasEnOds(resumen[ods.nombre], pregunta.acciones.palabras)
                } else {
                  resumen[ods.nombre].cantidad += ods.cantidad
                  resumen[ods.nombre].metas.concat(ods.metas)
                  resumen[ods.nombre] = this.agregarPalabrasEnOds(resumen[ods.nombre], pregunta.acciones.palabras)
                }
                acumulado += ods.cantidad
              }
            })
            pregunta.problema.ods.forEach((ods) => {
              if (ods.nombre !== 'ods_0') {
                if (resumen[ods.nombre] === undefined) {
                  resumen[ods.nombre] = {}
                  resumen[ods.nombre] = ods
                  resumen[ods.nombre] = this.agregarPalabrasEnOds(resumen[ods.nombre], pregunta.problema.palabras)
                } else {
                  resumen[ods.nombre].cantidad += ods.cantidad
                  resumen[ods.nombre].metas.concat(ods.metas)
                  resumen[ods.nombre] = this.agregarPalabrasEnOds(resumen[ods.nombre], pregunta.problema.palabras)
                }
                acumulado += ods.cantidad
              }
            })
          })
        })
        for (const ods in resumen) {
          resumen[ods].porcentaje = resumen[ods].cantidad / acumulado * 100
          resumen[ods].metas = [...new Set(resumen[ods].metas)]
          resumen[ods].metas = resumen[ods].metas.filter(Boolean)
          resumen[ods].palabras = [...new Set(resumen[ods].palabras)]
          resumen[ods].palabras = resumen[ods].palabras.filter(Boolean)
          datos.push(resumen[ods])
        }
        // datos.sort((a, b) => {
        //   let numA = parseInt(String(a).slice('ods_'.length))
        //   let numB = parseInt(String(b).slice('ods_'.length))
        //   if (numA > numB) {
        //     return 1
        //   }
        //   if (numA < numB) {
        //     return -1
        //   }
        //   return 0
        // })
      }
      console.log(datos)
      return datos
    },
    itemsDepartamentos () {
      let itemsParaDeptos = []
      this.departamentosActuales.forEach((depto, indiceDepto) => {
        itemsParaDeptos[indiceDepto] = {}
        if (depto === '') {
          itemsParaDeptos[indiceDepto]['nombre'] = 'Sin registro'
        } else {
          itemsParaDeptos[indiceDepto]['nombre'] = depto
        }
        // itemsParaDeptos[cant] = this.entrevistasPorDepartamento[depto].length
        itemsParaDeptos[indiceDepto]['nombreCantidad'] = depto + ' (' + this.entrevistasPorDepartamento[depto].length + ')'
      })
      return itemsParaDeptos
    },
    itemsSexo () {
      let itemsParaSexo = []
      this.sexosActuales.forEach((sexo, indiceSexo) => {
        itemsParaSexo[indiceSexo] = {}
        if (sexo === '') {
          itemsParaSexo[indiceSexo]['nombre'] = 'Sin Registro'
        } else {
          itemsParaSexo[indiceSexo]['nombre'] = sexo
        }
        itemsParaSexo[indiceSexo]['nombreCantidad'] = sexo + ' (' + this.entrevistasPorSexo[sexo].length + ')'
      })
      return itemsParaSexo
    },
    itemsRangoEdad () {
      let itemsParaRangoEdad = []
      this.rangosEdadActuales.forEach((rango, indiceRango) => {
        itemsParaRangoEdad[indiceRango] = {}
        if (rango === '') {
          itemsParaRangoEdad[indiceRango]['nombre'] = 'Sin Registro'
        } else {
          itemsParaRangoEdad[indiceRango]['nombre'] = rango
        }
        itemsParaRangoEdad[indiceRango]['nombreCantidad'] = rango + ' (' + this.entrevistasPorRangoEdad[rango].length + ')'
      })
      return itemsParaRangoEdad
    }
  },
  created: function () {
    let usuario = firebase.auth().currentUser
    let entrevistasRef = db.collection('entrevistas')
    // let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    this.observer = entrevistasRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        // console.log(change)
        let datoActual = change.doc.data()
        datoActual.id = change.doc.id
        // console.log(moment(datoActual.fecha))
        // let fechaActual = (new Date(datoActual.fecha)).toLocaleDateString(['es-CO', 'es'])
        datoActual.fecha = Date(datoActual.fecha)
        let metasActuales = this.metasActuales.slice()
        datoActual.detalleMetas = metasActuales
        this.todasLasEntrevistas.push(datoActual)
        if (usuario.uid === datoActual.usuario) {
          this.entrevistasUsuarioActual.push(datoActual)
        }
        if (datoActual.sexo === '') {
          datoActual.sexo = 'Sin registro'
        }
        if (this.entrevistasPorSexo[datoActual.sexo] === undefined) {
          this.entrevistasPorSexo[datoActual.sexo] = []
        }
        this.entrevistasPorSexo[datoActual.sexo].push(datoActual)
        if (datoActual.rangoEdad === '') {
          datoActual.rangoEdad = 'Sin registro'
        }
        if (this.entrevistasPorRangoEdad[datoActual.rangoEdad] === undefined) {
          this.entrevistasPorRangoEdad[datoActual.rangoEdad] = []
        }
        this.entrevistasPorRangoEdad[datoActual.rangoEdad].push(datoActual)
        if (datoActual.departamento === '') {
          datoActual.departamento = 'Sin registro'
        }
        if (this.entrevistasPorDepartamento[datoActual.departamento] === undefined) {
          this.entrevistasPorDepartamento[datoActual.departamento] = []
        }
        this.entrevistasPorDepartamento[datoActual.departamento].push(datoActual)
        // console.log(datoActual)
      })
      this.departamentosActuales = Object.keys(this.entrevistasPorDepartamento)
      this.sexosActuales = Object.keys(this.entrevistasPorSexo)
      this.rangosEdadActuales = Object.keys(this.entrevistasPorRangoEdad)
      // console.log(this.departamentosActuales)
      // console.log(this.entrevistasPorDepartamento)
      this.datosCargados = true
    }, err => {
      console.log(`Encountered error: ${err}`)
    })
  },
  methods: {
    mostrarDetalleResumen (datosOds) {
      // console.log(datosOds)
      this.detalleResumen = this.construirMensajeResumen(datosOds)
    },
    agregarPalabrasEnOds (ods, palabras) {
      // console.log('Ods que entra: ', ods)
      // console.log('Palabras que entra: ', palabras)
      palabras.forEach((palabra) => {
        palabra.ods.forEach((odsActual) => {
          if (ods.nombre === odsActual.nombre) {
            if (ods.palabras === undefined) {
              ods['palabras'] = []
            }
            ods.palabras.push(palabra.nombre)
          }
        })
      })
      // console.log('Ods con palabras: ', ods)
      return ods
    },
    construirMensajeResumen (datosOds) {
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
      return 'El Ods ' + numOds + ' tiene un porcentaje de ' + porcentaje + ' y ' + mensaje + soloNumeros + textoPalabras
    },
    ajustarDatosAMostrar (datos, mostrar) {
      this.datosAMostrar = datos
      this.mostrandoActualmente = mostrar
      this.datosAMostrarResumen = this.datosParaResumen
      console.log(this.datosAMostrar)
    },
    actualizarDepartamento () {
      if (this.departamentoSeleccionado !== '') {
        this.datosAMostrar = this.entrevistasPorDepartamento[this.departamentoSeleccionado]
      }
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
      return 'El Ods ' + numOds + ' tiene un porcentaje de ' + porcentaje + ' y ' + mensaje + soloNumeros + textoPalabras
      // console.log(soloNumeros)
    },
    // mostrarMetas (ods, metas, entrevista, pregunta, tipo) {
    //   this.datosAMostrar[entrevista].detalleMetas[pregunta][tipo] = this.calcularMetas(ods, metas)
    // },
    mostrarTraducciones () {
      this.traducciones.forEach(traduccion => {
        this.todasLasEntrevistas[traduccion.data.datos.indiceEntrevista].preguntas[traduccion.data.datos.indice][traduccion.data.datos.tipo].analisis.evidencias = traduccion.data.analisis.evidencias
        this.todasLasEntrevistas[traduccion.data.datos.indiceEntrevista].preguntas[traduccion.data.datos.indice][traduccion.data.datos.tipo].analisis.resultados[0] = traduccion.data.analisis.resultados.metas
        this.todasLasEntrevistas[traduccion.data.datos.indiceEntrevista].preguntas[traduccion.data.datos.indice][traduccion.data.datos.tipo].analisis.resultados[1] = traduccion.data.analisis.resultados.ods
      })
    },
    hacerBackup () {
    },
    remitirTextoCarina () {
      // console.log(this.todasLasEntrevistas)
      this.todasLasEntrevistas.forEach((entrevista, indiceEntrevista) => {
        entrevista.preguntas.forEach((pregunta, indicePregunta) => {
          if (pregunta.acciones.analisis.resultados.length === 0) {
            if (pregunta.acciones.descripcion !== '') {
              let datos = {
                datos: {
                  id: entrevista.id,
                  indiceEntrevista: indiceEntrevista,
                  tipo: 'acciones',
                  indice: indicePregunta
                },
                descripcion: pregunta.acciones.descripcion
              }
              this.ejecutarTraduccion(datos)
            }
          }
          if (pregunta.problema.analisis.resultados === []) {
            if (pregunta.problema.descripcion !== '') {
              let datos = {
                datos: {
                  id: entrevista.id,
                  indiceEntrevista: indiceEntrevista,
                  tipo: 'problema',
                  indice: indicePregunta
                },
                descripcion: pregunta.problema.descripcion
              }
              this.ejecutarTraduccion(datos)
            }
          }
        })
      })
    },
    ejecutarTraduccion (datos) {
      axios.post('https://carina-bcb3a.appspot.com/api/carinaligth/v1/inputText', datos)
      .then(response => {
        this.traducciones.push(response)
        // console.log('Descripción: ', response.data.descripcion)
        // console.log('Resultados - Metas: ', response.data.analisis.resultados.metas)
        // console.log('Resultados - ODS: ', response.data.analisis.resultados.ods)

        // let preguntas = [{}, {}, {}]
        // preguntas[response.data.datos.indice] = {}
        // preguntas[response.data.datos.indice][response.data.datos.tipo] = {}
        // preguntas[response.data.datos.indice][response.data.datos.tipo]['analisis'] = {}
        // preguntas[response.data.datos.indice][response.data.datos.tipo]['analisis']['evidencias'] = response.data.analisis.evidencias
        // preguntas[response.data.datos.indice][response.data.datos.tipo]['analisis']['resultados'] = []
        // preguntas[response.data.datos.indice][response.data.datos.tipo]['analisis']['resultados'].push(response.data.analisis.resultados.metas)
        // preguntas[response.data.datos.indice][response.data.datos.tipo]['analisis']['resultados'].push(response.data.analisis.resultados.ods)
        // console.log(preguntas)

        // Ultima aproximación
        this.todasLasEntrevistas[response.data.datos.indiceEntrevista].preguntas[response.data.datos.indice][response.data.datos.tipo].analisis.evidencias = response.data.analisis.evidencias
        this.todasLasEntrevistas[response.data.datos.indiceEntrevista].preguntas[response.data.datos.indice][response.data.datos.tipo].analisis.resultados[0] = response.data.analisis.resultados.metas
        this.todasLasEntrevistas[response.data.datos.indiceEntrevista].preguntas[response.data.datos.indice][response.data.datos.tipo].analisis.resultados[1] = response.data.analisis.resultados.ods

        // var analisisDocRef = db.collection('entrevistas').doc(response.data.datos.id)
        // analisisDocRef.get().then(analisisDoc => {
        //   if (analisisDoc.exists) {
        //     let preguntas = analisisDoc.data().preguntas
        //     preguntas[response.data.datos.indice][response.data.datos.tipo].analisis.evidencias = response.data.analisis.evidencias
        //     preguntas[response.data.datos.indice][response.data.datos.tipo].analisis.resultados.push(response.data.analisis.resultados.metas)
        //     preguntas[response.data.datos.indice][response.data.datos.tipo].analisis.resultados.push(response.data.analisis.resultados.ods)
        //     console.log(preguntas)
        //     analisisDocRef.set({ preguntas: preguntas }, { merge: true })
        //   }
        // })
        // return db.runTransaction(transaction => {
        //   return transaction.get(analisisDocRef).then(analisisDoc => {
        //     if (!analisisDoc.exists) {
        //       console.log('El documento no existe!')
        //     }
        //   })
        // })
        // console.log(preguntas)
        // db.collection('entrevistas').doc(response.data.datos.id).update({
        //   preguntas: preguntas}).then(() => {
        //     console.log('Documento Actualizado Satisafactoriamente!', preguntas)
        //   })
        // }, { merge: true })
        // console.log(preguntas)
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  }
  // computed: {
  //   usuario: function () {
  //     return firebase.auth().currentUser
  //   },
  //   entrevistas: function () {
  //     // let usuario = firebase.auth().currentUser
  //     let entrevistasRef = db.collection('entrevistas')
  //     let entrevistas = []
  //     entrevistasRef.get()
  //       .then(snapshot => {
  //         snapshot.forEach(doc => {
  //           entrevistas.push(doc.data())
  //         })
  //         this.datosCargados = true
  //       })
  //       .catch(err => {
  //         console.log('Error obteniendo los documentos', err)
  //       })
  //     return entrevistas
  //   }
  // }
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
