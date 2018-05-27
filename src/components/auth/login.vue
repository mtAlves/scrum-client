<template>
  <v-layout row wrap class="text-xs-center">
    <v-flex xs12 sm6 offset-sm3 justify-space-between>

      <!-- Error dialog -->
      <v-dialog v-model="error" max-width="290">
        <v-card>
          <v-card-actions>
            <v-btn class="red darken-1" flat @click.native="error = false" block>Não foi possível fazer login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card class="blue-grey darken-3">
        <v-card-title>
          <v-card-text class="title">LOGIN</v-card-text>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="login">
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  placeholder="Usuário" single-line v-model="user.username"
                  append-icon="account_box" class="blue-grey--text mb-2" hide-details>
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  placeholder="Senha" single-line type="password" v-model="user.password"
                  append-icon="vpn_key" class="blue-grey--text mb-5" hide-details @keyup.enter="login">
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-btn class="cyan--text" @click="login">login</v-btn>
          </form>
        </v-card-text>
      </v-card>

    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'login',
  data () {
    return {
      user: {},
      error: false
    }
  },
  methods: {
    async login () {
      try {
        const authentication = await axios.post('/auth', this.user)
        axios.defaults.headers.common['Authorization'] = authentication.data.auth.token
        this.$store.commit('login', authentication.data.auth)
        this.$store.dispatch('GETUSERS')
        this.$router.push('/')
      } catch (error) {
        this.error = true
        console.log('Não foi possível fazer login', error)
      }
    }
  }
}
</script>
<style scoped>
  .title {
    font-family: 'Architects Daughter';
    font-size: 3em !important;
    color: #00b2cc;
  }
</style>
