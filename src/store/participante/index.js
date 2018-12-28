import db from '@/db'
import firebase from '@/firebase'

import {
  UPDATE_INFORMATION,
  UPDATE_PRIORIDADES,
  UPDATE_PREGUNTAS,
  UPDATE_MENSAJES,
  ADD_PREGUNTA,
  RESET_PREGUNTA
} from './mutations'

const state = {
  mensaje: {
    mostrar: false,
    texto: ''
  },
  nuevoParticipante: {
    sexo: '',
    rangoEdad: '',
    departamento: '',
    ciudad: '',
    zona: '',
    prioridades: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    preguntas: [
      {
        id: '0',
        problema: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        },
        acciones: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        }
      },
      {
        id: '1',
        problema: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        },
        acciones: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        }
      },
      {
        id: '2',
        problema: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        },
        acciones: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        }
      }
    ]
  }
}

const getters = {
  nuevoParticipante: ({ nuevoParticipante }) => nuevoParticipante,
  user: ({ user }) => user,
  mensaje: ({ mensaje }) => mensaje
}

const mutations = {
  [UPDATE_INFORMATION] (state, info) {
    state.nuevoParticipante = info
    // console.log(info)
  },
  [UPDATE_PRIORIDADES] (state, info) {
    state.nuevoParticipante.prioridades[info.id] = info.valor
  },
  [UPDATE_PREGUNTAS] (state, info) {
    state.nuevoParticipante.preguntas[info.id] = info
  },
  [UPDATE_MENSAJES] (state, info) {
    state.mensaje = info
  },
  [RESET_PREGUNTA] (state) {
    state.nuevoParticipante = {
      sexo: '',
      rangoEdad: '',
      departamento: '',
      ciudad: '',
      zona: '',
      prioridades: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      preguntas: [
        {
          id: '0',
          problema: {
            descripcion: '',
            analisis: {
              evidencias: {},
              resultados: {
                metas: [],
                ods: [],
                words: {}
              }
            },
            palabras: [],
            ods: []
          },
          acciones: {
            descripcion: '',
            analisis: {
              evidencias: {},
              resultados: {
                metas: [],
                ods: [],
                words: {}
              }
            },
            palabras: [],
            ods: []
          }
        },
        {
          id: '1',
          problema: {
            descripcion: '',
            analisis: {
              evidencias: {},
              resultados: {
                metas: [],
                ods: [],
                words: {}
              }
            },
            palabras: [],
            ods: []
          },
          acciones: {
            descripcion: '',
            analisis: {
              evidencias: {},
              resultados: {
                metas: [],
                ods: [],
                words: {}
              }
            },
            palabras: [],
            ods: []
          }
        },
        {
          id: '2',
          problema: {
            descripcion: '',
            analisis: {
              evidencias: {},
              resultados: {
                metas: [],
                ods: [],
                words: {}
              }
            },
            palabras: [],
            ods: []
          },
          acciones: {
            descripcion: '',
            analisis: {
              evidencias: {},
              resultados: {
                metas: [],
                ods: [],
                words: {}
              }
            },
            palabras: [],
            ods: []
          }
        }
      ]
    }
  },
  [ADD_PREGUNTA] (state, info) {
    const preguntas = state.nuevoParticipante.preguntas
    if (preguntas.length < 3) {
      preguntas.push({
        id: preguntas.length,
        problema: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        },
        acciones: {
          descripcion: '',
          analisis: {
            evidencias: {},
            resultados: {
              metas: [],
              ods: [],
              words: {}
            }
          },
          palabras: [],
          ods: []
        }
      })
    }
  }
}

const actions = {
  async create (context) {
    const user = firebase.auth().currentUser
    if (user) {
      // save to database
      await db.collection('entrevistas').add({
        ...context.state.nuevoParticipante,
        usuario: user.uid,
        fecha: new Date()
      })
      await db.collection('usuarios').doc(user.uid).set({
        userId: user.uid,
        nombre: user.displayName,
        email: user.email,
        foto: user.photoURL
      })
      // console.log('Participante Creado')
      context.commit(UPDATE_MENSAJES, {
        texto: 'La participación ha sido registrado correctamente en la base de datos, puede registrar una nueva intervención.',
        mostrar: true
      })
      context.commit(RESET_PREGUNTA)
    } else {
      context.commit(UPDATE_MENSAJES, {
        texto: 'No está autorizado, debe estar correctamente logueado en la aplicación.',
        mostrar: true
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
