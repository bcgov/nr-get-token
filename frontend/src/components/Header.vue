<template>
  <header class="gov-header">
    <v-toolbar>
      <!-- Navbar content -->
      <a href="https://www2.gov.bc.ca">
        <img
          src="@/assets/images/17_gov3_bc_logo.svg"
          width="152"
          height="55"
          alt="B.C. Government Logo"
        >
      </a>

      <v-toolbar-title>
        <v-btn class="title hidden-sm-and-down" color="text" flat>Natural Resources Get Token</v-btn>
      </v-toolbar-title>
    </v-toolbar>
  </header>
</template>

<style>
.gov-header .title {
  color: #fff;
  text-decoration: none;
}

.gov-header .v-toolbar {
  background-color: rgb(0, 51, 102);
  border-bottom: 2px solid rgb(252, 186, 25);
}

.gov-header .v-btn,
.v-btn--active.title:before,
.v-btn.title:focus:before,
.v-btn.title:hover:before {
  color: #fff;
  background: none;
}

.secondary_color {
  background-color: var(--v-secondary-base);
}
</style>
