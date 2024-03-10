<template>
  <div class="home">
    <!-- left -->
    <div style="width: 48%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="token">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="token">
          </el-input>
        </el-form-item>
        <el-form-item label="id">
          <el-input v-model="taskId" placeholder="请输入内容"> </el-input>
        </el-form-item>
        <el-form-item label="延迟">
          <el-input v-model="num" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="getList">点我启动</el-button>
        </el-form-item>
      </el-form>
      <div>共查询了{{ total }}次</div>
      <div>共审核{{ sucessTotal }}次</div>
      <el-dialog title="导入数据" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div>
          <div style="display: flex; align-items: center">
            本次导入
            <h2 style="margin: 5px">{{ importText.split(",").length }}</h2>
            条数据
          </div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 9 }" placeholder="请输入内容" v-model="importText" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <div>共查询了{{ total }}次</div>
      <div>共审核{{ sucessTotal }}次</div> -->
    </div>
    <!-- right -->
    <div class="right" style="width: 50%">
      <div>黑名单</div>
      共{{ loadBlackData.length }}条
      <div style="display: flex">
        <el-input type="number" v-model="blackId" placeholder="请输入用户ID"></el-input>
        <el-button @click="addBlackId" type="danger">添加黑名单</el-button>
        <input class="base_file" @change="loadTextFromFile" type="file" name="" id="upload" style="display: none" />
        <el-button type="primary" @click="importData" style="margin-left: 5px">上传<i
            class="el-icon-upload el-icon--right"></i></el-button>
        <el-button type="primary" @click="exportData">导出</el-button>
      </div>
      <div>
        <el-tag @close="handleClose(tag)" style="margin: 5px" v-for="tag in loadBlackData" :key="tag" closable
          type="danger">
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import { getDataList, submit } from "../api/api";
// import { getDataList } from "../api/api";
export default {
  name: "Home",
  components: {
    // HelloWorld,
  },
  data () {
    return {
      dialogVisible: false,
      fileList: [],
      importText: "",
      token: "",
      textarea2: "",
      num: 5,
      taskId: "",
      timer: null,
      total: 0,
      sucessTotal: 0,
      blackId: "",
      loadBlackData: [], // 黑名单
    };
  },
  created () {
    // 判断有无token
    if (window.localStorage.getItem("token")) {
      this.token = window.localStorage.getItem("token");
    }
    // id
    if (window.localStorage.getItem("taskId")) {
      this.taskId = window.localStorage.getItem("taskId");
    }
    this.getLocalData();
  },
  methods: {
    submit () {
      const data = this.importText.split(",").map((item) => parseInt(item));
      this.getLocalData();
      this.loadBlackData = [...new Set([...data, ...this.loadBlackData])];
      // console.log("importText", this.importText.split(","));
      console.log("data", data);
      console.log("thisl.loadBlackData", this.loadBlackData);
      window.localStorage.setItem(
        "loadBlackData",
        JSON.stringify(this.loadBlackData)
      );
      this.$message.success("导入成功");
      this.importText = "";
      this.dialogVisible = false;
    },
    loadTextFromFile (e) {
      const file = e.target.files[0];
      let name = file.name.split(".").splice(-1).toString();
      if (name !== "txt") {
        this.$message.success("文件类型错误,请重新选择文件");
        return;
      }
      const reader = new FileReader();
      if (typeof FileReader === "undefined") {
        alert("您的浏览器不支持FileReader接口");
      }
      reader.onload = (e) => {
        console.log(e.target.result);
        this.importText = e.target.result;
      };
      reader.readAsText(file, "utf-8");
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    changeFile (fileList, file) {
      console.log(file, fileList);
      console.log(file.type);

      if (!fileList || fileList.length <= 0) {
        return false;
      }
      // const reg = /.txt$/;
      // if (!reg.test(fileList[0].name)) {
      //   alert("格式异常,仅支持TXT文件");
      //   return;
      // }
      var reader = new FileReader();
      reader.readAsText(fileList[0], "UTF-8");
      reader.onload = function () {
        console.log(reader.result);
      };
    },
    handlePreview (file) {
      console.log(file);
    },
    handleClose (id) {
      console.log(id);
      this.getLocalData();
      console.log("this.loadBlackData", this.loadBlackData);
      const index = this.loadBlackData.findIndex((item) => item === id);
      console.log("index", index);
      this.loadBlackData.splice(index, 1);
      window.localStorage.setItem(
        "loadBlackData",
        JSON.stringify(this.loadBlackData)
      );
    },
    importData () {
      document.getElementById("upload").click();
      this.dialogVisible = true;
    },
    exportData () {
      this.getLocalData();
      console.log("this.loadBlackData", this.loadBlackData);
      // 转成文本
      const str = this.loadBlackData.join(",");
      this.exportRaw(str, "data.txt");
    },
    exportRaw (data, name) {
      let urlObject = window.URL || window.webkitURL || window;
      let export_blob = new Blob([data]);
      let save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      save_link.click();
    },
    getLocalData () {
      const str = window.localStorage.getItem("loadBlackData");
      // console.log("str", str);
      str
        ? (this.loadBlackData = JSON.parse(str).filter((item) => Boolean(item)))
        : (this.loadBlackData = []);
      console.log("loadBlackData", this.loadBlackData);
    },
    addBlackId () {
      if (!this.blackId) return;
      console.log("this.blackId", this.blackId);
      const blackId = parseInt(this.blackId);
      console.log("this.blackId", blackId);
      const str = window.localStorage.getItem("loadBlackData");
      console.log("str", str);
      let loadBlackData = [];
      str ? (loadBlackData = JSON.parse(str)) : (loadBlackData = []);
      if (loadBlackData.length && loadBlackData.includes(blackId)) {
        this.$message.error("ID已经存在");
        return;
      }
      loadBlackData.unshift(blackId);
      console.log("loadBlackData", loadBlackData);
      window.localStorage.setItem(
        "loadBlackData",
        JSON.stringify(loadBlackData)
      );
      this.loadBlackData = JSON.parse(
        window.localStorage.getItem("loadBlackData")
      );
      this.blackId = "";
    },
    getList () {
      if (!this.token) alert("请输入token");
      // console.log("num", this.num);
      clearInterval(this.timer);
      window.localStorage.setItem("token", this.token);
      window.localStorage.setItem("taskId", this.taskId);
      this.$message.success("线程已开启");
      this.timer = setInterval(() => {
        const data = {
          taskId: this.taskId,
          current: 1,
          size: 10,
        };
        getDataList(data)
          .then((res) => {
            this.getLocalData();
            console.log(this.getTimeLine());
            console.log(res.data.data);
            this.total = ++this.total;
            if (res.data.data.records.length > 0) {
              // console.log("1");
              const list = res.data.data.records;
              console.log("allList", list);
              const loadData = list.filter(
                (val) => !this.loadBlackData.includes(val.userId)
              );
              console.log("loadData", loadData);
              const ids = loadData.map((item) => item.id);
              const data = { ids, reject: false };
              console.log("data-----提交前数据", data);
              submit(data).then((res) => {
                this.sucessTotal += res.data.data;
                console.log("message", res.data.message);
                // console.log("data", res.data.data);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, this.num * 1000);
    },
    getTimeLine () {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}`;
      return formattedDate + " " + formattedTime;
    },
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}

.home {
  display: flex;
}

.right {
  height: 100%;
  overflow: auto;
}
</style>
