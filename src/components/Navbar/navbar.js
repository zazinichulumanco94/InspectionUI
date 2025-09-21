export default {
  name: "Navbar",
  data() {
    return {
      isCollapsed: true,
    };
  },
  methods: {
    closeNavbar() {
      this.isCollapsed = true;
    },
  },
};