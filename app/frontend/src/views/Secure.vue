<template>
  <v-container class="secure">
    <BaseSecure>
      <h1 class="text-center">Secure</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin semper nunc, sed mollis turpis egestas at. Sed ornare, justo non facilisis ullamcorper, eros libero semper ligula, in euismod quam massa et dui. In vel lectus molestie, cursus urna id, vehicula felis. Mauris nec suscipit eros, vel vestibulum ex. Aenean vel gravida nulla. Morbi vel felis at arcu molestie faucibus vitae ut lacus. Nulla feugiat mi quis lectus aliquet, sit amet tristique magna pharetra. Mauris quis felis blandit est hendrerit vulputate.</p>
      <HelloCall />
    </BaseSecure>
  </v-container>
</template>

<script>
import HelloCall from '@/components/HelloCall';

export default {
  name: 'Secure',
  components: {
    HelloCall
  }
};
</script>
