<template>
  <nav class="navigation-main">
    <div class="container">
      <ul>
        <li>
          <router-link :to="{ name: 'Home' }">Home</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Secure' }">Secure</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'BCGovNavBar'
};
</script>

<style scoped>
.navigation-main {
  display: flex;
  color: #fcba19;
  background-color: #38598a;
  width: 100%;
  -webkit-box-shadow: 0 6px 8px -4px #b3b1b3;
  -moz-box-shadow: 0 6px 8px -4px #b3b1b3;
  box-shadow: 0 6px 8px -4px #b3b1b3;
}

.navigation-main .container {
  padding: 0;
}

.navigation-main .container ul {
  display: flex;
  flex-direction: row;
  margin: 0;
  color: #ffffff;
  list-style: none;
  margin-left: -1.7rem;
}

.navigation-main .container ul li ~ li {
  border-left: 1px solid #9b9b9b;
  margin: 0;
}

.navigation-main .container ul li a {
  display: flex;
  font-size: 0.8rem;
  font-weight: normal;
  min-height: 2rem;
  color: #ffffff;
  padding: 0.5rem 1rem 0.5rem 1rem;
  text-decoration: none;
}

.navigation-main .container ul li a:hover  {
  text-decoration: underline;
}

.navigation-main .container ul li a:focus {
  outline: none;
  outline-offset: 0;
}

.navigation-main .container ul .router-link-exact-active {
  background-color: #7ba2cc80;
  border-bottom: 2px solid #fcba19;
  font-weight: bold;
}
</style>
