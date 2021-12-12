<template>
  <div id="app">
    <kami-table
      :tableOptions.sync="tableOptions"
      :loading="loading"
      :headers="headers"
      :items="bodies"
      @refresh="loadBodies"
    >
      <template #item.isPlanet="{ item }">
        {{ item.isPlanet ? '✓' : 'х' }}
      </template>

      <template #item.actions="{ item }">
        <button class="button button__primary">Edit</button>
        <button class="button button__primary" @click="deleteBody(item.id)">Delete</button>
      </template>
    </kami-table>
  </div>
</template>

<script>
import KamiTable from './components/KamiTable';

const headers = [
  { name: 'name',           title: 'Имя космического объекта'},
  { name: 'isPlanet',       title: 'Является ли планетой'},
  { name: 'discoveredBy',   title: 'Кем открыта'},
  { name: 'discoveryDate',  title: 'Дата открытия'},
  { name: 'actions',        title: ''},
]

export default {
  components: { KamiTable },
  name: 'App',

  created() {
    this.loadBodies();
  },

  data: () => ({
    loading: true,
    headers,

    tableOptions: {
      rowsPerPage: 20,
      page: 1,

      orderAsc: true,
      orderBy: 'id',
      filters: [],
    }
  }),

  computed: {
    bodies() {
      return this.$store.getters['getBodies'];
    },
    currentBody() {
      return this.$store.getters['getCurrentBody'];
    },
  },

  methods: {
    async loadBodies() {
      this.loading = true;

      let page = '';
      if (this.tableOptions.rowsPerPage !== -1) {
        page = `${this.tableOptions.page},${this.tableOptions.rowsPerPage}`;
      }
      await this.$store.dispatch('loadBodies', {
        order: `${this.tableOptions.orderBy},${this.tableOptions.orderAsc ? 'asc' : 'desc'}`,
        filter: this.tableOptions.filters,
        page,
      });
      this.loading = false;
    },
    deleteBody(id) {
      this.$store.dispatch('deleteBody', id);
      this.loadBodies();
    },

  },
};
</script>

<style lang="scss">


</style>
