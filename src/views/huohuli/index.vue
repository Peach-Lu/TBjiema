<template>
  <div class="huo">
    <div class="left-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="账号">
          <el-input v-model="form.ApiName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.PassWord" show-password></el-input>
        </el-form-item>
        <el-form-item label="国家代码">
          <el-input v-model="form.country"></el-input>
        </el-form-item>
        <el-form-item label="项目id">
          <el-input v-model="form.iid"></el-input>
        </el-form-item>
        <el-form-item label="延迟(毫秒)">
          1000等于1秒
          <el-input v-model="speed"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="login" type="default">登录</el-button>
      <input class="base_file" @change="loadTextFromFile" type="file" name="" id="upload" style="display: none" />
      <el-button type="primary" @click="importData" style="margin-left: 5px">上传<i
          class="el-icon-upload el-icon--right"></i></el-button>
      <el-button type="primary" style="margin-left: 5px" @click="start">{{ this.startStatus ? '停止' : '启动' }}</el-button>
    </div>
    <div class="right-box">
      <h2> 运行日志 </h2>
      <el-button @click="exportText" type="primary">导出成功文本</el-button>
      <el-button @click="clearLog" type="danger">清空日志</el-button>
      token:{{ token }}
      <el-input style="margin-top:10px;" type="textarea" placeholder="日志" :autosize="{ minRows: 15, maxRows: 15 }"
        v-model="logText" show-word-limit>
      </el-input>
      文本内容 共 {{ allPhone.length }} 条数据
      <el-input type="textarea" placeholder="请上传文本内容" :autosize="{ minRows: 10, maxRows: 10 }" v-model="textarea"
        show-word-limit>
      </el-input>

    </div>
  </div>
</template>
<script>
import { yhapi } from '@/api/api'
// const res =
//   '1|7FE78DCBD19F3AE33772B60FBBDA058483FF09B81AE29306|2024-03-10T21:04:54|hkg|852||COM26|44553295'
// const status = res.split('|')
import { exportRaw } from '@/utils/index'
export default {
  name: "huo",
  components: {
  },
  data () {
    return {
      allPhone: [],
      textarea: '',
      logText: '',
      timer: null,
      speed: 1000,
      startStatus: false,
      logData: [
        // {
        //   pkey: status[1],//pkey
        //   time: status[2],//提取时间
        //   country: status[3],//国家代码
        //   countryNum: status[4],//国家区号
        //   归属地: status[5],//归属地
        //   端口号: status[6],//端口号
        //   手机号: status[7],//手机号
        //   对接码: status[8],//手机号
        //   isSuccess: true
        // }, {
        //   pkey: status[1],//pkey
        //   time: status[2],//提取时间
        //   country: status[3],//国家代码
        //   countryNum: status[4],//国家区号
        //   归属地: status[5],//归属地
        //   端口号: status[6],//端口号
        //   手机号: status[7],//手机号
        //   对接码: status[8],//手机号
        //   isSuccess: true
        // }
      ],
      token: window.localStorage.getItem('token'),
      form: {
        ApiName: '413853767@qq.com11',
        PassWord: 'swm87812773',
        iid: '1011',
        country: 'mac'
      },
      errStatus: {
        '-1': '用户账号不允许为空',
        '-2': '用户账号长度必须在3-30之间',
        '-3': '用户账号不能包含特殊符号“|”',
        '-4': '用户账号不能包含汉字',
        '-5': '用户密码不允许为空',
        '-6': '用户密码长度必须在3-30之间',
        '-7': '同IP情况下,上次请求失败,1分钟后重试【请确保Api用户名与登录密码正确再重试】',
        '-8': '账号已被禁用',
        '-9': '账号或密码错误',
      },
      errorCodes: {
        '-1': '暂时无号',
        '-2': 'Token不存在',
        '-3': '项目ID不存在',
        '-4': '国家代码有误',
        '-5': '项目未审核',
        '-6': '项目已禁用',
        '-7': '用户已禁用',
        '-8': '余额不足，请充值',
        '-9': '占号过多，请补充余额。未收到验证码强烈建议主动调用释放接口，否则在余额不多的情况下会提示占号过多',
        '-10': '项目不允许指定取号'
      },
      errorMessages: {
        '-1': 'Token不存在',
        '-2': 'pkey无效',
        '-3': '加黑原因不能为空',
        '-4': '手机号不存在或已释放',
        '-5': '未回码，请释放',
        '-6': '帐号已被禁止加黑号码'
      }
    }
  },
  created () {
    // setTimeout(() => {
    //   // exportRaw('1\n2\n3\n4\n5', 'data.txt')
    // }, 3000)
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    test () {
      this.$notify.error('这是一条消息的提示消息');
    },
    async login () {
      const data = {
        act: 'login',
        ...this.form,
      }
      delete data.iid
      delete data.country
      const res = await yhapi(data)
      const status = res.split('|')
      // console.log(status);
      // console.log('res', res);
      if (status[0] === '0') {
        this.$notify.error(`${this.errStatus[status[1]]}`);
      } else if (status[0] === '1') {
        this.$notify.success('登录成功')
        window.localStorage.setItem('token', status[1])
        this.token = status[1]
      }
      // console.log(typeof (res))
    },
    importData () {
      document.getElementById("upload").click();
    },
    loadTextFromFile (e) {
      const file = e.target.files[0];
      let name = file.name.split(".").splice(-1).toString();
      if (name !== "txt") {
        this.$notify.success("文件类型错误,请重新选择文件");
        return;
      }
      const reader = new FileReader();
      if (typeof FileReader === "undefined") {
        alert("您的浏览器不支持FileReader接口");
      }
      reader.onload = (e) => {
        // console.log(e.target.result);
        this.allPhone = e.target.result.split(/\r?\n/);
        console.log('-----------------------', this.allPhone)
        this.textarea = e.target.result
        // if (this.allPhone.length > 0) {
        //   this.$notify.success(`导入成功,共${this.allPhone.length}条数据`)
        // }
        this.$notify.success(`导入成功,共${this.allPhone.length}条数据`)
      };
      reader.readAsText(file, "utf-8");
    },
    async start () {

      if (this.startStatus) {
        console.log('停止');
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
          this.startStatus = false
          return
        }
      }

      // console.log('执行', this.startStatus);
      this.timer = setInterval(async () => {
        this.startStatus = true
        if (this.allPhone) {
        // if (true) {
          // this.$notify.success('成功')
          const data = {
            act: 'getPhone',
            ...this.form,
            token: window.localStorage.getItem('token')
          }
          delete data.ApiName
          delete data.PassWord
          const res = await yhapi(data)
          // const res =
          //   '1|7FE78DCBD19F3AE33772B60FBBDA058483FF09B81AE29306|2024-03-10T21:04:54|hkg|852||COM26|44553295'
          const status = res.split('|')

          console.log(res);
          if (status[0] === '0') {
            this.$notify.error(`${this.errorCodes[status[1]]}`);
          } else {
            // this.$notify.success('获取成功')
            // 1|pkey|提取时间|国家代码|国家区号|归属地|端口号|手机号|对接码
            const data = {
              pkey: status[1],//pkey
              time: status[2],//提取时间
              country: status[3],//国家代码
              countryNum: status[4],//国家区号
              归属地: status[5],//归属地
              端口号: status[6],//端口号
              手机号: status[7],//手机号
              对接码: status[8],//手机号
            }
            const phoneNumber = data.countryNum + '-' + data['手机号']
            console.log('phoneNumber', phoneNumber)
            if (this.allPhone.includes(phoneNumber)) {
              data.isSuccess = false
              console.log('拉黑')
              this.$notify.error(`拉黑${phoneNumber}`)
              // this.$notify.error('请先导入文本')
              this.logText = `${this.logData.length}${phoneNumber}|拉黑\r\n` + this.logText
            } else {
              data.isSuccess = true
              this.logText = `${phoneNumber}|成功\r\n` + this.logText
            }
            this.logData.push(data)
            console.log('logData', this.logData)
            // 获取成功后延迟一秒再拉黑
           setTimeout(async () => {
            const params = {
              act: 'addBlack',
              pkey: data.pkey,
              // pkey: '7FE78DCBD19F3AE33772B60FBBDA058483FF09B81AE29306',
              token: window.localStorage.getItem('token'),
              reason: 'used'
            }
          //  try {
            // yhapi(params).then(res2=>{
            //   const status2 = res2.split('|')
            // if (status2[0] === '0') {
            //   this.$notify.error(`${this.errorMessages[status2[1]]}`);
            // } else if (status2[0] === '1') {
            //   this.$notify.success(`拉黑成功`);
            // }
            // }).catch(err=>{
            //   console.log(err);
            // console.log(params);
            // console.log(params.pkey);
            // })
            const res2 = await yhapi(params)
            const status2 = res2.split('|')
            if (status2[0] === '0') {
              this.$notify.error(`${this.errorMessages[status2[1]]}`);
            } else if (status2[0] === '1') {
              this.$notify.success(`拉黑成功`);
            }
          //  } catch (error) {
          //   console.log(error);
          //   console.log(params);
          //   console.log(params.pkey);
          //  }
           }, 1000); 
          }
        } else {
          this.$notify.error('请先导入文本')
        }
      }, this.speed)
      // this.textarea = this.allPhone.length + '16483648683468\n' + this.textarea

    },
    // 清空日志
    clearLog () {
      this.$confirm('确认清空日志吗', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.logData = []
          this.logText = ''
        })
        .catch(action => {
          this.$notify({
            type: 'info',
            message: action === 'cancel'
              ? '取消该操作'
              : ''
          })
        });
    },
    exportText () {
      this.$confirm('导出成功后会清空日志', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {

          const data = this.logData.filter(item => item.isSuccess).reduce((all, item) => {
            return all + item.countryNum + '-' + item['手机号'] + '\r\n'
          }, '')
          // console.log('data', data);
          exportRaw(data, 'data.txt')
          this.$notify.success('导出成功')
          this.logData = []
          this.logText = ''
        })
        .catch(action => {
          this.$notify({
            type: 'info',
            message: action === 'cancel'
              ? '取消该操作'
              : ''
          })
        });

    }
  }
}
</script>
<style lang="less">
.huo {
  display: flex;
  height: 100%;

  .left-box {
    width: 30%;
    padding-right: 40px;
    box-sizing: border-box;
  }

  .right-box {
    width: 70%;
    height: 100%;
    // border: 1px solid #ccc;
  }
}
</style>