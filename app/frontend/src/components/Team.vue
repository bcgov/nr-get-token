<template>
  <v-container>
    <p class="text-right">
      <strong>
        <v-icon class="pr-2">group</v-icon>Team members (x)
        <v-tooltip bottom open-delay="1000">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon class="BC-Gov-IconButton" @click="addDialog = true">
              <v-icon>add_circle</v-icon>
            </v-btn>
          </template>
          <span>Invite a new user to your team</span>
        </v-tooltip>
      </strong>
    </p>
    <v-skeleton-loader
      type="table"
      :types="{'table': 'table-thead, table-tbody', 'table-row': 'table-cell@3', 'table-thead': 'heading@3' }"
      :loading="!usersLoaded"
      transition="scale-transition"
    >
      <v-container>Loaded</v-container>
    </v-skeleton-loader>

    <br />
    <br />
    <br />
    <v-simple-table class="getok-simple-table">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">IDIR</th>
            <th class="text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.IDIR }}</td>
            <td>{{ item.email }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <BaseDialog :show="addDialog" width="500" @close-dialog="addDialog = false">
      <template v-slot:icon>
        <v-icon large color="blue darken-2">info</v-icon>
      </template>
      <template v-slot:text>
        <h4 class="mb-5">Invitation functionality coming soon</h4>
        <p>To add a new user for your application, please instruct them to log and use the Request Account page to request access to your application.</p>
        <p>The Common Service Showcase team will action the request to add them once submitted.</p>
      </template>
    </BaseDialog>
  </v-container>
</template>

<script>
import acronymService from '@/services/acronymService';

export default {
  name: 'Team',
  props: ['acronym'],
  data() {
    return {
      desserts: [
        {
          name: 'Lucas ONeil',
          IDIR: 'loneil',
          email: 'lucas.oneil@gov.bc.ca'
        },
        {
          name: 'Lucas ONeil',
          IDIR: 'loneil',
          email: 'lucas.oneil@gov.bc.ca'
        },
        {
          name: 'Lucas ONeil',
          IDIR: 'loneil',
          email: 'lucas.oneil@gov.bc.ca'
        },
        {
          name: 'Lucas ONeil',
          IDIR: 'loneil',
          email: 'lucas.oneil@gov.bc.ca'
        },
        {
          name: 'Lucas ONeil',
          IDIR: 'loneil',
          email: 'lucas.oneil@gov.bc.ca'
        },
      ],
      addDialog: false,
      errorLoadingUsers: false,
      usersLoaded: false
    };
  },
  async mounted() {
    try {
      const users = await acronymService.getUsers(this.acronym);
    } catch {

    } finally {
      this.usersLoaded= true;
    }
  }
};
</script>

<style lang="scss" scoped>
.getok-simple-table {
  thead tr th {
    color: #292929;
    font-size: 1em;
  }
  tbody tr:nth-of-type(even) {
    background-color: #f7f7f7;
  }
}
</style>
