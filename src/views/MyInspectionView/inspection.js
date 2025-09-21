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