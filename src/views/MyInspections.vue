<template>
  <NavbarView />
  <div class="container mt-4">
    <h4 class="mb-3">My Inspections</h4>

    <div v-if="inspections && inspections.length">
      <div
        v-for="(insp, index) in inspections"
        :key="insp.id || index"
        class="card mb-3 bg-white shadow-sm rounded-5 border-0 p-2"
      >
        <!-- Card Header -->
        <div
          class="card-header border-0 d-flex justify-content-between align-items-center bg-white rounded-5"
          @click="toggleCollapse(index)"
          style="cursor: pointer;"
        >
          <div class="d-flex">
          <img src="@/assets/images/inspection.png" class="inspection-icon" alt="icon" />
            <div class="mx-3">
            <p class="mb-0">{{ insp.name || "Unnamed Inspection" }}</p>
            <small class="text-muted"><i class="bi bi-calendar-check-fill"></i> {{ insp.inspection_date || "No Date" }}</small>
          </div>
          </div>

          <div class="d-flex align-items-center">
            <i class="bi bi-clock-history text-warning mx-2"></i>
            <span class="bg-warning-light text-xs p-1 rounded-pill text-dark me-3">In-Progress</span>
            <i class="bi" :class="collapsed[index] ? 'bi-chevron-down' : 'bi-chevron-up'"></i>
          </div>
        </div>

        <!-- Card Body -->
        <transition name="collapse">
          <div v-show="!collapsed[index]" class="card-body">
            <ul v-if="insp.lines && insp.lines.length" class="list-group list-group-flush">
              <li
                v-for="(line, lineIndex) in insp.lines"
                :key="line.id || lineIndex"
                class="list-group-item"
              >
                <strong>{{ line.name }}</strong>
                <span v-if="line.condition"> - Condition: {{ line.condition.label }}</span>
                <span v-if="line.note"> - Note: {{ line.note }}</span>
                <span v-if="line.files"> - Photos: {{ line.files.length }}</span>
              </li>
            </ul>

            <p v-else class="text-muted mt-2">No lines available for this inspection.</p>
          </div>
        </transition>
      </div>
    </div>

    <div v-else>
      <p class="text-muted">You don’t have any inspections yet.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reactive } from "vue"
import NavbarView from "@/components/Navbar/NavbarView.vue";

export default {
  name: "MyInspections",
  components: { NavbarView },
  setup() {
    const collapsed = reactive({}); // track collapsed state per index

    // Initialize collapsed state for all inspections
    const initializeCollapse = (inspections) => {
      inspections.forEach((_, index) => {
        collapsed[index] = true; // true = collapsed
      });
    };

    const toggleCollapse = (index) => {
      collapsed[index] = !collapsed[index]; // toggle state
    };

    return { collapsed, toggleCollapse, initializeCollapse };
  },
  computed: {
    ...mapState({
      inspections: (state) => state.inspections || []
    })
  },
  mounted() {
    // Initialize all cards as collapsed
    this.initializeCollapse(this.inspections);
  }
};
</script>

