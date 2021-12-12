<template>
  <div id="app">
    <k-dialog
      v-model="dialog"
      :title="currentTitle"
    >
      <div class="form">
        <div
          v-for="input in formData"
          :key="input.name"
          class="form-item"
        >
          <label for="planetName">{{ input.title }}</label>
          <input v-model="currentBody[input.name]" :type="input.type">
        </div>

        <div class="form-actions">
          <button class="button" @click="handleSubmit">{{ currentButtonTitle }}</button>
        </div>
      </div>
    </k-dialog>

    <k-table
      :tableOptions.sync="tableOptions"
      :items="getCurrentBodies"
      :loading="loading"
      :headers="headers"
      @refresh="loadBodies"
      @add="openDialog"
    >
      <template #before-action>
        <label for="showArchived">Показать удаленные</label>
        <input v-model="isArchived" type="checkbox" id="showArchived" />
      </template>

      <template #after-action>
        <div @click="handleCreate">
          <button id="addButto" class="button button__primary button__circle">+</button>
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
import KDialog from '@/components/KDialog.vue';

const dataConfigure = [
  { name: 'name',           type: 'text',     title: 'Имя космического объекта'},
  { name: 'isPlanet',       type: 'checkbox', title: 'Является ли планетой'},
  { name: 'discoveredBy',   type: 'text',     title: 'Кем открыта'},
  { name: 'discoveryDate',  type: 'text',     title: 'Дата открытия'},
  { name: 'actions',        type: 'none',     title: ''},
]

export default {
  name: 'MainPage',

  components: {
    KTable,
    KDialog,
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
      return this.dataConfigure.map(({ name, title }) => ({ name, title }));
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

    currentBody() {
      return this.$store.getters['getCurrentBody'];
    },

    currentTitle() {
      return this.isEdit ? 'Редактирование объекта' : 'Добавление объекта';
    },
    currentButtonTitle() {
      return this.isEdit ? 'Редактировать' : 'Добавить';
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
      await this.$store.dispatch('loadBody', { id, isLocal });
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
      this.cleanCurrentBody();
      this.openDialog();
    },
    handleSubmit() {
      if (this.isEdit) {
        return this.editBody();
      }
      return this.createBody();
    },

    createBody() {
      this.$store.dispatch('addBody');
      this.cleanCurrentBody();
    },
    editBody() {
      this.$store.dispatch('editBody');
    },

    cleanCurrentBody() {
      this.$store.dispatch('cleanCurrentBody');
    },

    openDialog() {
      this.dialog = true;
    },
  },
};
</script>