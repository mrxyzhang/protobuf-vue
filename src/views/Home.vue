<template>
  <div class="home">
    <button @click="handleGetStudents">getStudentList</button>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { getStudentList } from "@/api/student";
import { log } from "util";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  methods: {
    handleGetStudents() {
      const req = {
        limit: 20,
        offset: 0
      };

      getStudentList(req)
        .then(res => {
          console.log("res", res);
        })
        .catch(console.log);
    }
  }
};
</script>
