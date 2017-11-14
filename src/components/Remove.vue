<template>
    <v-layout column align-center >
      <h3 class="red--text ">{{$route.params.name}}</h3>
      	<br>
      <h4 class="red--text ">removido com sucesso!</h4>
    </v-layout>
</template>

<script>
export default{

	data () {
		return{

		}
	},

	methods:{

		return (){
			setTimeout(() => {
				this.$router.go(-1);
				}, 1000)

		},
	},

	created(){
		this.return()
	}
}
</script>
<style scoped>
	*{text-align: center;}
</style>