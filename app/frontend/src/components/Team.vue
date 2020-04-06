<template>
  <v-container>
    <p class="text-right">
      <strong>
        <v-icon class="pr-2">group</v-icon>Team members
        <span v-if="usersLoaded">({{users.length}})</span>
        <v-tooltip bottom open-delay="1000">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon color="primary" @click="addDialog = true">
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
      <v-container>
        <v-alert
          v-if="errorLoadingUsers"
          type="error"
          tile
          dense
        >An error occurred while loading the users, please refresh and try again</v-alert>
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
              <tr v-for="item in users" :key="item.idir">
                <td>{{ item.name }}</td>
                <td>{{ item.idir }}</td>
                <td>{{ item.email }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-skeleton-loader>

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
      addDialog: false,
      errorLoadingUsers: false,
      users: [],
      usersLoaded: false
    };
  },
  async mounted() {
    try {
      const res = await acronymService.getUsers(this.acronym);
      this.users = res.data.map(u => {
        return{
          name: `${u.user.firstName} ${u.user.lastName}`,
          idir: u.user.username,
          email: u.user.email
        };
      });
    } catch {
      //TODO: still pending descisions on global error standardization
      this.errorLoadingUsers = true;
    } finally {
      this.usersLoaded = true;
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
