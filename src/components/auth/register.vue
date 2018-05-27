<template>
    <v-layout row wrap class="text-xs-center">
    <v-flex xs12 sm8 offset-sm2 justify-space-between>
      <v-card class="blue-grey darken-3">
        <v-card-title>
          <v-card-text class="title">REGISTER</v-card-text>
        </v-card-title>
        <v-card-text>
          <form @submit.prevent="register">
            <v-layout row>
              <v-flex xs5 class="mr-2">
                <v-text-field
                  label="Nome de Usuário (LOGIN)" v-model="user.username" :rules="emptyField"
                  append-icon="account_box" class="blue-grey--text mb-2">
                  </v-text-field>
              </v-flex>
              <v-flex xs7>
                <v-text-field
                  label="Nome" v-model="user.name" :rules="emptyField"
                  append-icon="fa-id-card" class="blue-grey--text mb-2">
                  </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  label="@email" v-model="user.email" :rules="emailRules"
                  append-icon="email" class="blue-grey--text mb-2">
                  </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row >
              <v-flex xs6 class="mr-2">
                <v-text-field
                  label="Senha"
                  v-model="user.password"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (showPassword = !showPassword)"
                  :type="showPassword ? 'text' : 'password'"
                  counter :rules="emptyField"
                  class="blue-grey--text"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  label="Confirmar Senha"
                  v-model="passwordConfirm"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (showPassword = !showPassword)"
                  :type="showPassword ? 'text' : 'password'"
                  counter :rules="emptyField"
                  class="blue-grey--text mb-2"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-btn class="cyan--text" type="submit">Registrar</v-btn>
          </form>
          <v-dialog v-model="errorDialog" >
            <v-btn icon @click.native="errorDialog = false" dark>
              <v-icon text-xs-left>close</v-icon>
            </v-btn>
            <v-card class="blue-grey darken-3 text-xs-center">
              <div class="headline text-xs-center red--text pa-2">ERRO</div>
              <v-card-text class="blue--text">Oops, tente mudar o Nome de Usuário e verifique a Senha.</v-card-text>
            </v-card>
          </v-dialog>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'register',
  data () {
    return {
      showPassword: false,
      errorDialog: false,
      emptyField: [
        v => {
          return !!v || 'Este campo é obrigatório'
        }
      ],
      emailRules: [
        v => /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido'
      ],
      passwordConfirm: '',
      user: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    }
  },
  methods: {
    async register () {
      try {
        if (this.user.password !== this.passwordConfirm || this.user.password === null || this.user.username === null) {
          this.errorDialog = true
        }
        const register = await axios.post('/users', this.user)
        axios.defaults.headers.common['Authorization'] = register.data.token
        this.$store.commit('login', register.data)
        this.$store.dispatch('GETUSERS')
        this.$router.push('/')
      } catch (error) {
        console.log(error)
        this.errorDialog = true
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
