<template>
  <div class="wrap">
    <div id="left">
      <p>已下载</p>
      <a-table :columns="cols" :data-source="down" :rowKey='record=>record.id'>
        <template slot="view" slot-scope="text, record">
          <a-button @click="toview(record.path)">预览</a-button>
        </template>
      </a-table>
    </div>

    <div id="main">
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
      <div>
        <!--<p>正在下载</p>-->
        <a-table :columns="columns" :data-source="downing">
          <template slot="progress" slot-scope="text, record">
            <a-progress :percent=record.progress size="small" />
          </template>
          <template slot="action" slot-scope="text, record">
            <a-button @click="downchange(record.id,record.finish)">暂停</a-button>
          </template>
        </a-table>
      </div>
    </div>
    <div id="right">
      <p>已暂停</p>
      <a-table :columns="columns" :data-source="undown">
        <template slot="action" slot-scope="text, record">
          <a-button @click="downchange(record.id,record.finish)">继续</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
  const cols = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      width: 100
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      width: 100
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 200
    },
    {
      title: '预览',
      dataIndex: 'view',
      width: 100,
      scopedSlots: { customRender: 'view' },
    }
  ];

  const columns = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      width: 100
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      width: 100
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 200
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 200,
      scopedSlots: { customRender: 'progress' },
    },
    {
      title: '动作',
      dataIndex: 'action',
      width: 100,
      scopedSlots: { customRender: 'action'},
    },
  ];

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
        timerstate: 0,
        columns,
        cols,
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
      toview(rpath) {
        this.$router.push({
              'path': '/imgview',
              'name': 'Imgview',
              params: { path: rpath }
            });
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

<style>
  .wrap {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: flex;
  }

  #left {
    background: #ccffff;
    flex: 0 0 400px;
  }

  #right {
    background: #ccffff;
    flex: 0 0 400px;
  }

  #main {
    background: #ffcccc;
    flex: 1;
  }
</style>
