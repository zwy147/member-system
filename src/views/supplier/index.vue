<template>
  <div>
    <!-- 搜索 
    :inline="true" 表单在一行显示-->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px;">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>

        <el-button
          v-if="!isDialog"
          type="primary"
          icon="el-icon-plus"
          @click="dialogFormVisible = true"
        >新增</el-button>
        <el-button v-if="!isDialog" @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <!-- highlight-current-row激活单选行 -->
    <!-- @current-change当点击某一行后，会触发这个事件，从而调用相关函数handleCurrentChange
    并且这个函数会调用两个参数：currentRow,oldCurrentRow-->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="list"
      height="450"
      border
      style="width: 100%"
    >
      <!-- type="index"获取索引值，从1开始，label表示标题，prop数据字段名,width是列宽
      -->
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="250"></el-table-column>
      <el-table-column prop="linkman" label="联系人姓名" width="200"></el-table-column>
      <el-table-column v-if="!isDialog" prop="mobile" label="联系电话" width="250"></el-table-column>
      <el-table-column v-if="!isDialog" prop="remark" label="备注" width="300"></el-table-column>
      <el-table-column v-if="!isDialog" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      @size-change=" handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[ 10,20,50,100]"
      :page-size="pageSize"
      :total="total"
      style="text-align:center;margin-top:20px"
    ></el-pagination>
    <!-- 新增窗口 
    title是新增窗口标题-->
    <el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="handleAdd">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import supplierApi from "@/api/supplier.js";
export default {
  props: {
    //接收父组件传递过来的数据，通过isDialog来判断是否为弹框
    //如果为true,则为弹框，否则false就是列表
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      // 条件查询绑定的条件值
      // 控制对话框,默认不弹出
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        linkman: "",
        mobile: "",
        remark: ""
      },
      rules: {
        //校验规则
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "联系人姓名不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" }
        ]
      }
    };
  }, //提交的·数据·
  created() {
    this.fetchData();
  },
  methods: {
    //当每页显示条数改变后，被触发，val是最新每日显示条数
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.fetchData();
    },
    //当页码改变之后被触发，val是最新页码
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.fetchData();
    },
 //打开编辑窗口
    handleEdit(id) {
      // console.log('编辑', id)
      // 清除原来的表单数据和校验结果
      this.handleAdd();
      supplierApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          //提示获取数据失败
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    //编辑之后进行更新
    updateData(formName) {
      console.log("updateData");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交更新
          supplierApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除会员
    handleDelete(id) {
      console.log("删除", id);
      this.$confirm("是否永久删除此供应商?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定
          console.log("yes");
          supplierApi.deleteById(id).then(response => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
            });
            if (resp.flag) {
              //删除成功，刷新列表数据
              this.fetchData();
            }
          });
        })
        .catch(() => {
          console.log("no");
          //取消
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          //   this.pageSize = resp.data.pageSize;
          console.log(resp.data.rows);
        });
    },
   
    //重置按钮
    resetForm(formName) {
      console.log("重置", formName);
      //重置会看el-form-item组件元素的prop是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    //新增会员按钮
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("add");
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              console.log("新增成功");
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
              console.log("新增");
            } else {
              //新增失败
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //弹出新增窗口，新增之后清除
    handleAdd() {
      console.log(this.pojo);
      // this.pojo = {}
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    //当点击某一行时，会调用这个参数进行处理
    clickCurrentChange(currentRow, oldCurrentRow) {
      // 点击后，要将数据传递到父组件（商品管理）中，则可以通过触发父组件中的option-supplier，
      //触发之后，父组件可以在option-supplier这个事件对于的处理函数中进行接收数据currentRow
      console.log(currentRow);
      this.$emit("option-supplier", currentRow);
    }
  }
};
</script>