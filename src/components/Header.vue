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
        <v-btn class="title hidden-sm-and-down" color="text" flat to="/">Natural Resources Get Token</v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat v-on="on">Language</v-btn>
        </template>
        <v-layout align-center justify-center row fill-height>
          <v-flex xs12>
            <v-list class="header-menu-secondary">
              <v-list-tile @click="setLanguage('en')">English</v-list-tile>
              <v-list-tile @click="setLanguage('fr')">Français</v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-menu>

      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon x-large>menu</v-icon>
          </v-btn>
        </template>
        <v-layout align-center justify-center row fill-height>
          <v-flex xs6>
            <v-list class="header-menu">
              <v-list-tile v-for="(item, key) in menuSecondary" :key="'secondary-menu-'+key">
                <v-btn v-if="item.link" flat :to="item.link" class="navbar-link lvl2-link">
                  <v-icon v-if="item.icon">{{item.icon}}</v-icon>
                  {{ item.title }}
                </v-btn>
                <v-btn v-else flat :href="item.href" class="navbar-link lvl2-link">
                  <v-icon v-if="item.icon">{{item.icon}}</v-icon>
                  {{ item.title }}
                </v-btn>
              </v-list-tile>
            </v-list>
          </v-flex>
          <v-flex xs6>
            <v-list class="header-menu-secondary">
              <v-list-tile v-for="(item, key) in menuTertiary" :key="'tertiary-menu-'+key">
                <v-btn v-if="item.link" flat :to="item.link" class="navbar-link lvl2-link">
                  <v-icon v-if="item.icon">{{item.icon}}</v-icon>
                  {{ item.title }}
                </v-btn>
                <v-btn v-else flat :href="item.href" class="navbar-link lvl2-link">
                  <v-icon v-if="item.icon">{{item.icon}}</v-icon>
                  {{ item.title }}
                </v-btn>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-menu>
    </v-toolbar>
  </header>
</template>

<script>
  export default {
    data: () => ({
      logInUrl: '/api/login',
      searchText: '',
      showSearch: false,
      classicUrl: '',
      menuSecondary: [
        {
          title: 'What is NR Get Token?',
          href: 'https://developer.gov.bc.ca/'
        },
        {
          title: 'Placeholder',
          href: 'https://developer.gov.bc.ca/'
        },
        {
          title: 'Developers',
          href: 'https://www.bcdevexchange.org/'
        },
        {
          title: 'Contact',
          href: 'https://developer.gov.bc.ca/'
        }
      ]
    }),
    computed: {
      menuTertiary: () => ([
        {
          title: 'Datasets',
          link: '/datasets'
        },
        {
          title: 'Organizations',
          link: '/organization'
        },
        {
          title: 'Groups',
          link: '/groups'
        },
        {
          title: 'About',
          link: '/about'
        }
      ])
    },
  };
</script>

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

  .v-list.header-menu.theme--dark {
    background-color: var(--v-primary-base);
  }

  .v-list.header-menu-secondary.theme--dark {
    background-color: var(--v-secondary-base);
  }

  .secondary_color {
    background-color: var(--v-secondary-base);
  }
</style>
