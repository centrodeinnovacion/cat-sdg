import ods1 from '@/assets/S_SDG_goals_icons-individual-rgb-01.png'
import ods2 from '@/assets/S_SDG_goals_icons-individual-rgb-02.png'
import ods3 from '@/assets/S_SDG_goals_icons-individual-rgb-03.png'
import ods4 from '@/assets/S_SDG_goals_icons-individual-rgb-04.png'
import ods5 from '@/assets/S_SDG_goals_icons-individual-rgb-05.png'
import ods6 from '@/assets/S_SDG_goals_icons-individual-rgb-06.png'
import ods7 from '@/assets/S_SDG_goals_icons-individual-rgb-07.png'
import ods8 from '@/assets/S_SDG_goals_icons-individual-rgb-08.png'
import ods9 from '@/assets/S_SDG_goals_icons-individual-rgb-09.png'
import ods10 from '@/assets/S_SDG_goals_icons-individual-rgb-10.png'
import ods11 from '@/assets/S_SDG_goals_icons-individual-rgb-11.png'
import ods12 from '@/assets/S_SDG_goals_icons-individual-rgb-12.png'
import ods13 from '@/assets/S_SDG_goals_icons-individual-rgb-13.png'
import ods14 from '@/assets/S_SDG_goals_icons-individual-rgb-14.png'
import ods15 from '@/assets/S_SDG_goals_icons-individual-rgb-15.png'
import ods16 from '@/assets/S_SDG_goals_icons-individual-rgb-16.png'
import ods17 from '@/assets/S_SDG_goals_icons-individual-rgb-17.png'
import ods0 from '@/assets/R_SDG_logo_with_UN_Emblem_square_rgb-negado.png'

const state = {
  iconosOds: {ods_0: ods0, ods_1: ods1, ods_2: ods2, ods_3: ods3, ods_4: ods4, ods_5: ods5, ods_6: ods6, ods_7: ods7, ods_8: ods8, ods_9: ods9, ods_10: ods10, ods_11: ods11, ods_12: ods12, ods_13: ods13, ods_14: ods14, ods_15: ods15, ods_16: ods16, ods_17: ods17},
  preguntasSobrePrioridades: [
    { pregunta: 'Acciones para reducir el cambio climático', ods: [13] },
    { pregunta: 'Libertad de pensamiento y derechos humanos', ods: [16] },
    { pregunta: 'Acceso a internet y telefonía celular', ods: [9] },
    { pregunta: 'Mejor sistema de salud', ods: [3] },
    { pregunta: 'Mejores oportunidades de empleo', ods: [8] },
    { pregunta: 'Protección a los Bosques. ríos y mares', ods: [14, 15] },
    { pregunta: 'Apoyo para personas discapacitadas o con dificultades para trabajar', ods: [10, 8] },
    { pregunta: 'Acceso a servicios de acueducto y alcantarillado', ods: [6] },
    { pregunta: 'Gobiernos transparentes y eficientes', ods: [16] },
    { pregunta: 'Igualdad entre hombres y mujeres', ods: [10] },
    { pregunta: 'Sistemas eficientes y constantes de energía en casa', ods: [7] },
    { pregunta: 'Protección contra el crimen y la violencia', ods: [11] },
    { pregunta: 'Acceso a alimentación suficiente y nutritiva', ods: [2] },
    { pregunta: 'Mejor educación', ods: [4] },
    { pregunta: 'Libertades políticas', ods: [16] }
  ],
  sexos: [
    'Femenino',
    'Masculino'
  ],
  rangosDeEdad: [
    '0 a 9',
    '10 a 14',
    '15 a 19',
    '20 a 24',
    '25 a 29',
    '30 a 34',
    '35 a 39',
    '40 a 44',
    '45 a 49',
    '50 a 54',
    '55 a 59',
    '60 a 64',
    '65 a 69',
    '70 a 74',
    '75 a 79',
    '80 o más'
  ],
  zonas: [
    'Urbano',
    'Rural'
  ]
}

const getters = {
  iconosOds: ({ iconosOds }) => iconosOds,
  preguntasSobrePrioridades: ({ preguntasSobrePrioridades }) => preguntasSobrePrioridades,
  sexos: ({ sexos }) => sexos,
  rangosDeEdad: ({ rangosDeEdad }) => rangosDeEdad,
  zonas: ({ zonas }) => zonas
}

export default {
  namespaced: true,
  state,
  getters
  // mutations,
  // actions
}
