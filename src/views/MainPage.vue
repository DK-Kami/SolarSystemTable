<template>
  <div id="app">
    <dialog-form v-model="dialog" :is-edit="isEdit" :form-data="formData" />

    <k-table
      :tableOptions.sync="tableOptions"
      :items="getCurrentBodies"
      :loading="loading"
      :headers="headers"
      @refresh="loadBodies"
      @add="openDialog"
    >

      <template #actions>
        <div>
          <label for="showArchived">Показать удаленные</label>
          <input v-model="isArchived" type="checkbox" id="showArchived" />
        </div>

        <div @click="handleCreate">
          <button id="addButto" class="button button__secondary button__circle">+</button>
          <label for="addButton">Добавить</label>
        </div>
      </template>

      <template #item.isPlanet="{ item }">
        {{ item.isPlanet ? '✓' : 'х' }}
      </template>

      <template #item.actions="{ item }">
        <button :disabled="item.isLocal" class="button button__primary" @click="handleView(item.id, item.isLocal)">View</button>
        <button class="button button__primary" @click="handleEdit(item.id, item.isLocal)">Edit</button>
        <button class="button button__primary" @click="handleDelete(item.id, item.isLocal)">Delete</button>
      </template>
    </k-table>
  </div>
</template>

<script>
import KTable from '@/components/KTable';
import KDialog from '@/components/KDialog';
import DialogForm from './DialogForm';

const dataConfigure = [
  { name: 'name',           width: '20%',  type: 'text',     title: 'Имя космического объекта'},
  { name: 'isPlanet',       width: '20%',  type: 'checkbox', title: 'Является ли планетой'},
  { name: 'discoveredBy',   width: '20%',  type: 'text',     title: 'Кем открыта'},
  { name: 'discoveryDate',  width: '20%',  type: 'text',     title: 'Дата открытия'},
  { name: 'actions',        width: '20%',  type: 'none',     title: ''},
]

export default {
  name: 'MainPage',

  components: {
    DialogForm,
    KDialog,
    KTable,
  },

  created() {
    this.loadBodies();
  },

  data: () => ({
    dataConfigure,

    isArchived: false,
    loading: true, // TODO сделать загрузку
    dialog: false,

    isEdit: false,

    tableOptions: {
      rowsPerPage: 20,
      page: 1,

      orderAsc: true,
      orderBy: 'id',
      filters: [],
    }
  }),

  computed: {
    headers() {
      return this.dataConfigure.map(({ name, title, width }) => ({ name, title, width }));
    },
    formData() {
      return this.dataConfigure.filter(dc => dc.type !== 'none');
    },

    bodies() {
      return this.$store.getters['getBodies'];
    },
    getArchivedBodies() {
      return this.$store.getters['getArchivedBodies'];
    },
    getCurrentBodies() {
      return this.isArchived ? this.getArchivedBodies : this.bodies;
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

    async handleEdit(id, isLocal) {
      this.isEdit = true;
      await this.$store.dispatch('loadBodyFromLocal', { id, isLocal });
      this.openDialog();
    },
    handleView(id) {
      this.$router.push({
        name: 'ViewPage',
        params: { id },
      });
    },
    handleDelete(id, isLocal) {
      this.$store.dispatch('deleteBody', { id, isLocal });
      this.loadBodies();
    },
    handleCreate() {
      this.isEdit = false;
      this.openDialog();
    },



    openDialog() {
      this.dialog = true;
    },
  },
};
</script>
