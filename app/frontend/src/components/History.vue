<template>
  <v-container>
    <v-skeleton-loader
      type="table"
      :types="{
        table: 'table-thead, table-tbody',
        'table-row': 'table-cell@3',
        'table-thead': 'heading@3',
      }"
      :loading="!loaded"
      transition="scale-transition"
    >
      <v-container>
        <p class="text-right">Application <strong>{{ acronym }}</strong> created on: {{ formatDate(acronymCreated) }}</p>
        <v-alert v-if="errorLoading" type="error" tile dense>
          An error occurred while loading history, please refresh and try again
        </v-alert>
        <v-simple-table class="getok-simple-table">
          <template>
            <thead>
              <tr>
                <th class="text-left">Date</th>
                <th class="text-left">IDIR</th>
                <th class="text-left">Environment Deployed To</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in histories" :key="item.idir">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.idir }}</td>
                <td>{{ item.env }}</td>
              </tr>
              <tr v-if="histories.length === 0">
                <small>No Service Client deployments have occurred yet for application <strong>{{ acronym }}</strong>.</small>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import acronymService from '@/services/acronymService';

export default {
  name: 'History',
  props: ['acronym'],
  data() {
    return {
      acronymCreated: undefined,
      errorLoading: false,
      histories: [],
      loaded: false,
    };
  },
  methods: {
    formatDate(date){
      return (date) ? new Date(date).toLocaleString() : 'N/A';
    },
  },
  async mounted() {
    try {
      const res = await acronymService.getServiceClientHistory(this.acronym);
      this.acronymCreated = res.data.createdAt;
      this.histories = res.data.DeploymentHistories.map((dh) => {
        return {
          date: dh.createdAt,
          idir: dh.User ? dh.User.username : '',
          env: dh.env
        };
      });
    } catch (error) {
      this.errorLoading = true;
    } finally {
      this.loaded = true;
    }
  },
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
