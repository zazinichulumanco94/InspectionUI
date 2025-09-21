import NavbarView from "@/components/Navbar/NavbarView.vue"
import InspectionCard from "@/components/InspectionCard/InspectionCard.vue";
import InspectionSearch from "@/components/SearchBox/SearchBox.vue";
import { Modal } from 'bootstrap';


export default {
    components: { NavbarView, InspectionCard, InspectionSearch },
    data() {
        return {
            inspections: [],
            selectedInspection: "",
            inspection: null,
            errors: {},
            searchQuery: ""
        }
    },
    computed: {
        filteredInspections() {
            if (!this.searchQuery) return this.inspections;
            const query = this.searchQuery.toLowerCase();
            return this.inspections.filter(insp =>
                insp.name.toLowerCase().includes(query)
            );
        }
    },
    mounted() {
        Promise.all([
            fetch("/inspections/site.json").then((res) => res.json()).then((data) => data.result),
            fetch("/inspections/supplier.json").then((res) => res.json()).then((data) => data.result),
            fetch("/inspections/vehicle.json").then((res) => res.json()).then((data) => data.result),
        ]).then((result) => {
            this.inspections = result
        })
    },
    methods: {
        selectInspection(insp) {
            this.selectedInspection = insp
            this.inspection = JSON.parse(JSON.stringify(insp))
        },
        showNote(line) {
            if (line.is_note_required) return true
            if (line.note_requirement === "Required") return true
            if (line.note_requirement === "Conditional") {
                return this.evaluateExpression(line.note_requirement_condition, line)
            }
            return line.note_requirement === "Optional"
        },
        showPhotos(line) {
            if (line.is_pic_required) return true
            if (line.pic_requirement === "Required") return true
            if (line.pic_requirement === "Conditional") {
                return this.evaluateExpression(line.pic_requirement_condition, line)
            }
            return line.pic_requirement === "Optional"
        },
        evaluateExpression(expr, line) {
            if (!expr) return false
            const severity = line.condition?.severity_level ?? 0
            return eval(expr.replace("{{severity_level}}", severity))
        },
        handleFileUpload(event, line) {
            line.files = Array.from(event.target.files)
        },
        submitForm() {
            this.errors = {};

            this.inspection.lines.forEach((line) => {
                const lineErrors = [];

                if ((line.is_note_required || line.note_requirement === "Required") && !line.note) {
                    lineErrors.push("Note is required");
                }

                if ((line.is_pic_required || line.pic_requirement === "Required") && !line.files) {
                    lineErrors.push("Photo is required");
                }

                if (lineErrors.length) {
                    this.errors[line.id] = lineErrors;
                }
            });

            if (Object.keys(this.errors).length) {
                return;
            }

            this.$store.dispatch("addInspection", this.inspection);

            const modalEl = document.getElementById('inspectionModal');
            let modal = Modal.getInstance(modalEl);
            if (!modal) {
                modal = new Modal(modalEl);
            }
            modal.hide();

            const modalBackdrops = document.getElementsByClassName('modal-backdrop');
            while (modalBackdrops[0]) {
                modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
            }

            this.$router.push("/my_inspections");
        }
    },
}