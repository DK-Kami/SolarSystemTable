import Vue from 'vue';
import Vuex from 'vuex';
import webClient from './WebClient';

Vue.use(Vuex);

const initialBody = () => ({
  name: '',
  isPlanet: false,
  discoveredBy: '',
  discoveryDate: '',
});

export default new Vuex.Store({
  state: {
    body: initialBody(),
    addedBodies: [],
    bodies: [],

    deletedIds: [],
  },

  mutations: {
    SET_BODIES: (state, bodies) => state.bodies = bodies,
    SET_BODY: (state, body) => state.body = body,

    ADD_BODY: (state, body) => state.addedBodies.push(body),
    EDIT_BODY: (state, { id, body }) => {
      state.bodies.find(b => b.id === id);
    },

    DELETE_BODY(state, id) {
      state.deletedIds.push(id);
      state.bodies.find(b => b.id === id).isDeleted = true;
    },

    CLEAN_CURRENT_BODY: state => state.body = initialBody(),
  },

  actions: {
    async loadBodies({ state, commit }, { page, filter, order }) {
      const { bodies } = (await webClient.get('/bodies', {
        params: {
          filter: [...filter, ...state.deletedIds.map(id => `id,neq,${id}`)],
          data: 'id,name,isPlanet,discoveredBy,discoveryDate',
          page,
          order,
        }
      })).data;

      const filteredBodies = bodies.map(b => ({...b, isDeleted: state.deletedIds.find(di => di === b.id)}));
      // if (page && page.split(',')[0] === 1) {
      //   const { addedBodies } = state;
      //   filteredBodies.shift(...addedBodies)
      // }
      commit('SET_BODIES', filteredBodies);
    },

    async loadBody({ commit }, id) {
      const body = (await webClient.get(`/bodies/${id}`)).data;
      commit('SET_BODY', body);
    },

    addBody({ commit, state }) {
      const { body } = state;
      commit('ADD_BODY', {
        id: body.name,
        isDeleted: false,
        ...body,
      });
    },
    editBody({ commit, state }) {
      const { body } = state;
      commit('EDIT_BODY', {
        id: body.id,
        body,
      });
    },

    deleteBody({ commit }, id) {
      commit('DELETE_BODY', id);
    },
    cleanCurrentBody({ commit }) {
      commit('CLEAN_CURRENT_BODY');
    },
  },
  getters: {
    getCurrentBody: state => state.body,
    getArchivedBodies: state => state.bodies.filter(body => body.isDeleted),
    getBodies: state => state.bodies.filter(body => !body.isDeleted),
    getAllBodies: state => state.bodies,
    // getBodies: state => [...state.bodies.filter(body => !body.isDeleted), ...state.addedBodies],
    // getAllBodies: state => [...state.bodies, ...state.addedBodies],
  },
});
