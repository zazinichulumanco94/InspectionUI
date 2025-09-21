export default {
    name: "InspectionSearch",
    props: {
        searchQuery: { type: String, default: "" }
    },
    data() {
        return {
            query: this.searchQuery
        };
    }
};