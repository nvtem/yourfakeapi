<template lang="pug">
    C_EditURL(:id="$route.params.id" @cancel="$router.push(`/endpoints/${$route.params.endpoint_id}/urls`)" :endpointID="$route.params.endpoint_id")
</template>

<script>
  import C_EditURL from "../components/EditURL";

  export default {
    name: "EditURL",
    components: { C_EditURL }
  }
</script>

<style scoped>

</style>