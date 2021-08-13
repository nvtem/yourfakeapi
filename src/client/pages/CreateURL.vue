<template lang="pug">
  EditURL(id="new" class="mt-3" @cancel="$router.push(`/endpoints/${$route.params.endpoint_id}/urls`)" :endpointID="$route.params.endpoint_id")
</template>

<script>
  import EditURL from "../components/EditURL";

  export default {
    name: "CreateURL",
    components: { EditURL },
  }
</script>

<style scoped lang="stylus">
</style>