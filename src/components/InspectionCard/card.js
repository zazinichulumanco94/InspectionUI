export default {
  name: "InspectionCard",
  props: {
    inspection: { type: Object, required: true },
    selectedInspection: { type: Object, default: null }
  }
};