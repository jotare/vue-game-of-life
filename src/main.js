import "../node_modules/bulma/css/bulma.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

createApp(App).use(store).mount("#app");
