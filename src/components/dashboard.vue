<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <div v-for="(user,index) in users" :key="index">
      <p>Email:{{user.email}}</p>
      <p>Age:{{user.age}}</p>
      <ul >
        <li class="text-center" v-for="(hobby, idx) in user.hobbies" :key="idx">Hobbies: {{hobby}}</li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
computed: {
  users() {
    return this.$store.getters.getUsers; 
  }
},

  created(){
  this.$store.dispatch('getUser')
}

};
</script>

<style scoped>
h1,
p {
  text-align: center;
}

p {
  color: red;
}
</style>