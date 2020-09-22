<template>
  <div class="thumbs">
    <vue-preview :slides="imglist" class="preview"></vue-preview>
  </div>
</template>

<script>

  export default {
    name: 'Imgview',
    data() {
      return {
        path: '',
        imglist: [],
        tlist: []
      }
    },
    mounted() {
      this.path = this.$route.params.path;
      console.log(this.path);
      this.$nextTick(function () {
        this.getView()
      })
    },
    methods: {
      getView() {
        console.log("**" + this.path);
        this.$axios
          .get('/api/img/view', {
            params: {
              path: this.path
            }
          })
          .then(res => {
            console.log(res.data);
            res.data.forEach(item => {
              item.w = 600;
              item.h = 400;
              item.src = 'data:image/jpeg;base64,' + item.src;
              item.msrc = item.src;
            });
            console.log(res.data);
            //this.tlist = res.data;
            this.imglist = res.data;
            console.log(this.imglist.length);
          })
          .catch(failResponse => {
            console.log(failResponse);
          });
      }
    }
  }
</script>



<style>
 
</style>
