<template>
  <div>
    <div>
      <p>已下载</p>
      <p v-for="item in down">
        关键字: {{item.keyword}}  数量: {{item.count}} 路径: {{item.path}}
      </p>
    </div>
    <div>
      <p>已暂停</p>
      <div v-for="item in undown" >
        <p>关键字: {{item.keyword}}  数量: {{item.count}} 路径: {{item.path}} 进度：{{item.addcnt}} 目标：{{item.target}}</p>
        <button @click="downchange(item.id,item.finish)">继续</button>
      </div>
    </div>
    <div>
      <p>正在下载</p>
      <div v-for="item in downing">
        <p>关键字: {{item.keyword}}  数量: {{item.count}} 路径: {{item.path}} 进度：{{item.addcnt}} 目标：{{item.target}}</p>
        <button @click="downchange(item.id,item.finish)">暂停</button>
      </div>
    </div>
    <div>
      <p>Home关键字</p>
      <input v-model="keyword" placeholder="请输入关键字" />
      <div>
        <input type="radio" id="one" value="baidu" v-model="picked">
        <label for="one">baidu</label>
        <br>
        <input type="radio" id="two" value="sougou" v-model="picked">
        <label for="two">sougou</label>
        <br>
        <input type="radio" id="three" value="360" v-model="picked">
        <label for="three">360</label>
        <br>
        <span>Picked: {{ picked }}</span>
      </div>
      <p>请输入图片页数(baidu:50张/页，sougou:48张/页，360:100张/页)</p>
      <input v-model.number="page" type="number" placeholder="请输入页数" />
      <p>存储路径</p>
      <input v-model="path" placeholder="请输入存储路径" />
      <button @click="home">爬取</button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Home',
    data () {
      return {
        keyword: '',
        picked: '',
        page: 1,
        path: '',
        down: [],
        undown: [],
        downing: [],
        timer: null,
        timerstate: 0
      }
    },
    watch: {
      timerstate: {
        handler(newValue, oldValue) {
          if (newValue == 1 && oldValue == 0) {
            console.log("timerstate从0到1");
            this.startimer();
          }
          if (newValue == 0 && oldValue == 1) {
            console.log("timerstate从1到0");
            this.stoptimer();
          }
        }
      },
      downing: {
        handler(newValue, oldValue) {
          if ((oldValue != undefined && oldValue.length > 0) && (newValue == undefined || newValue.length <= 0)) {
            this.stoptimer();
            this.timerstate = 0;
          }
        }
      }
    },
    created() {
      //this.downinfo();
      //this.timer = setInterval(this.downinfo, 1000*40);
    },
    beforeDestory() {
      clearInterval(this.timer);
    },
    mounted: function () {
      this.$nextTick(function () {
        this.downinfo()
      })
    },
    methods: {
      startimer() {
        this.downinfo();
        this.timer = setInterval(this.downinfo, 1000 * 10);
      },
      stoptimer() {
        clearInterval(this.timer);
      },
      downchange(rid,finish) {
        if (finish == 0) {
          if (this.timerstate == 0) {
            this.timerstate = 1;
          }
          setTimeout(() => {
            this.downinfo()
          }, 1000); 
          this.$axios
            .get('/api/down/continue', {
              params: {
                rid: rid
              }
            })
            .then(res => {
              console.log(res.data.data);
              this.downinfo();
            })
            .catch(failResponse => {
              console.log(failResponse);
            });
        }
        else if (finish == 2) {
          this.$axios
            .get('/api/down/pause', {
              params: {
                rid: rid
              }
            })
            .then(res => {
              console.log(res.data.data);
              this.downinfo();
            })
            .catch(failResponse => {
              console.log(failResponse);
            });
        }

      },
      downinfo: function () {
        console.log(this.downing);
        console.log(this.timerstate);
        //var _this = this;
        let Uid = localStorage.getItem('ID');
        if (Uid == null || Uid.length == 0) {
          alert("缓存失效，请重新登录。");
          this.$router.replace({ path: '/' });
        }
        this.$axios
          .get('/api/info/down', {
            params: {
              id: Uid
            }
          })
          .then(res => {
            console.log(res);
            this.down = res.data.data;
          })
          .catch(failResponse => {
            console.log(failResponse);
          });
        this.$axios
          .get('/api/info/undown', {
            params: {
              id: Uid
            }
          })
          .then(res => {
            console.log(res);
            this.undown = res.data.data;
          })
          .catch(failResponse => {
            console.log(failResponse);
          });
        this.$axios
          .get('/api/info/downing', {
            params: {
              id: Uid
            }
          })
          .then(res => {
            console.log(res);
            this.downing = res.data.data;
          })
          .catch(failResponse => {
            console.log(failResponse);
          });
      },
      home() {
        let Uid = localStorage.getItem('ID');
        if (Uid == null || Uid.length == 0) {
          alert("缓存失效，请重新登录。");
          this.$router.replace({ path: '/' });
        }

        if (this.timerstate == 0) {
          this.timerstate = 1;
        }
        //setTimeout(() => {
         // this.downinfo()
        //}, 1000);
        this.$axios
          .get('/api/spider/new', {
            params: {
              id: Uid,
              keyword: this.keyword,
              engine: this.picked,
              path: this.path,
              page: this.page
            }
          })
          .then(res => {
            this.downinfo();
            let r = JSON.stringify(res);
            let info = eval('(' + r + ')');
            console.log(info.data);
          })
          .catch(failResponse => {
            console.log(failResponse);
          });
        this.$axios
          .get('/api/spider', {
            params: {
              id: Uid,
              keyword: this.keyword,
              engine: this.picked,
              path: this.path,
              page: this.page
            }
          })
          .then(res => {
            this.downinfo();
            let r = JSON.stringify(res);
            let info = eval('(' + r + ')');
            console.log(info.data);
            //alert(info.data);
          })
          .catch(failResponse => {
            console.log(failResponse);
          })

      }
    }
  }
</script>

