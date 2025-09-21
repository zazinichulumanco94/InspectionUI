import { createStore } from "vuex"

const store = createStore({
  state: {
    inspections: JSON.parse(localStorage.getItem("inspections")) || []
  },
  mutations: {
    addInspection(state, inspection) {
      state.inspections.push(inspection)
      localStorage.setItem("inspections", JSON.stringify(state.inspections))
    }
  },
  actions: {
    addInspection({ commit }, inspection) {
      commit("addInspection", inspection)
    }
  }
})

export default store
