<template>
  <v-layout>
    <v-flex xs12 md6>
      <v-text-field
        v-model="firstname"
        :rules="nameRules"
        :counter="10"
        label="First name"
        required
      ></v-text-field>
    </v-flex>

    <v-flex xs12 md6>
      <v-text-field v-model="lastname" :rules="nameRules" :counter="10" label="Last name" required></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
</script>

<style>
</style>
