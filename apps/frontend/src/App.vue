<script setup lang="ts">
import SampleInput from './components/SampleInput.vue';
import { reactive, ref } from 'vue';

const form = reactive({
  username: '',
  password: '',
});

function submit() {
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  })
      .then(res => res.json())
      .then(({ redirectUrl }) => {
        location.href = redirectUrl;
      });
}
</script>

<template>
  <div>
    <h1>Login Sample</h1>

    <form @submit.prevent="submit">
      <SampleInput title="Username" type="text" v-model="form.username"/>
      <SampleInput title="Password" type="password" v-model="form.password"/>
      <button type="submit">Login</button>
    </form>
    <div v-if="response">{{ response }}</div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
