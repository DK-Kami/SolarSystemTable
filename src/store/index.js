import Vue from 'vue';
import Vuex from 'vuex';
import webClient from './WebClient';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bodies: [],
    body: {},

    deletedIds: [],
  },

  mutations: {
    SET_BODIES: (state, bodies) => state.bodies = bodies,
    SET_BODY: (state, body) => state.body = body,

    DELETE_BODY(state, id) {
      state.deletedIds.push(id);
      state.bodies.find(b => b.id === id).isDeleted = true;
    }
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

      // console.log(bodies.map(b => ({...b, isDeleted: false})));
      commit('SET_BODIES', bodies.map(b => ({...b, isDeleted: state.deletedIds.find(di => di === b.id)})));
    },

    async loadBody({ commit }, id) {
      const body = (await webClient.get(`/bodies/${id}`)).data;
      commit('SET_BODY', body);
    },

    deleteBody({ commit }, id) {
      commit('DELETE_BODY', id);
    },
  },
  getters: {
    getCurrentBody: state => state.body,
    getArchivedBodies: state => state.bodies.filter(body => body.isDeleted),
    getBodies: state => state.bodies.filter(body => !body.isDeleted),
    getAllBodies: state => state.bodies,
  },
});
