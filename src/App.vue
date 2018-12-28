<template>
  <v-app>
    <toolbar 
      :login="login"
      :logout="logout"
      :profile="profile"
      :loggedIn="loggedIn"
      :title="title" 
      :logo="logoSirio"
      />
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import Toolbar from '@/components/Toolbar'
import logoSirio from '@/assets/Sirio.svg'

export default {
  components: { Toolbar },
  computed: {
    ...mapGetters('user', {
      profile: 'profile',
      loggedIn: 'loggedIn'
    })
  },
  methods: {
    ...mapActions('user', {
      login: 'login',
      logout: 'logout'
    })
  },
  data () {
    return {
      title: 'SIRIO-ODS',
      logoSirio
    }
  },
  name: 'App'
}
</script>
