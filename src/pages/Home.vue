<template>
  <v-layout row wrap align-center>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <v-avatar>
              <img :src="logoSirio"/>
            </v-avatar>
            SIRIO-ODS
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items v-if="loggedIn">
            <v-btn flat to="/create">
              <v-icon>add</v-icon>
              <span>Encuesta</span>
            </v-btn>
            <v-btn flat to="/monitor">
              <v-icon>search</v-icon>
              <span>Monitor</span>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title primary-title>
          <div>
            <p>
              <em>
                <b>S</b>istema <b>I</b>nteligente de <b>R</b>egistro <b>I</b>nteractivo de <b>O</b>piniones sobre <b>O</b>bjetivos del <b>D</b>esarrollo <b>S</b>ostenible
              </em>
            </p>
          </div>
        </v-card-title>
        <v-img
          :src="logoActual"
          :contain=true
          max-height="250"
        ></v-img>
        <v-card-text>
          <p>Este es un proyecto de la Oficina Colombiana del Fondo de Poblaciones de las Naciones Unidas <b>(UNFPA)</b>, desarrollado por el Grupo de Investigación en Informática y Computación Cognitiva <b>(CICC)</b> de la Universidad de Córdoba <b>(UniCórdoba)</b>, Colombia. En el marco de una convocatoria pública realizada por el Centro de Innovación Pública Digital <b>(CIPD)</b> del Ministerio de las Tecnologías de la Información y las Comunicaciones <b>(MINTIC)</b> del Gobierno de Colombia</p>
        </v-card-text>
        <v-btn depressed color="primary" href="http://colombia.unfpa.org/es" target="UNFPA-Col">UNFPA</v-btn>
        <v-btn depressed color="primary" href="http://carinalab.co/" target="CarinaLab">CICC</v-btn>
        <v-btn depressed color="primary" href="http://unicordoba.edu.co/" target="UniCórdoba">UNICOR</v-btn>
        <v-btn depressed color="primary" href="http://centrodeinnovacion.gobiernoenlinea.gov.co/es" target="CIPD">CIPD</v-btn>
        <v-btn depressed color="primary" href="http://mintic.gov.co" target="MINTIC">MINTIC</v-btn>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import LogoSiROSODS from '@/assets/LogoSiROS-ODS.png'
import logoSirio from '@/assets/Sirio.svg'

export default {
  active: '',
  name: 'home',
  computed: {
    ...mapGetters('user', {
      loggedIn: 'loggedIn'
    })
  },
  data: function () {
    return {
      logoSirio,
      LogoSiROSODS,
      logoActual: LogoSiROSODS
    }
  }
}
</script>
