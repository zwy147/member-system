<template>
  <div>
    <!-- 搜索 
    :inline="true" 表单在一行显示-->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px;">
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          @click.native="dialogSupplierVisible=true"
          v-model="searchMap.supplierName"
          placeholder="供应商名称"
          style="width:200px"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData">查询</el-button>

        <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="list" height="450" border style="width: 100%">
      <!-- type="index"获取索引值，从1开始，label表示标题，prop数据字段名,width是列宽
      -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
      <el-table-column prop="code" label="商品编号" width="150"></el-table-column>
      <el-table-column prop="spec" label="商品规格" width="130"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="110"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价" width="110"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量" width="110"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change=" handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[ 10,20,50,100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="text-align:center;margin-top:20px"
    ></el-pagination>
    <!-- 选择供应商对话框 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible">
      <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>
    <!-- 新增窗口 
    title是新增窗口标题-->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" @option-supplier="optionSupplier" :isDialog="true"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName" :visible.sync="dialogSupplierVisible">
          <el-input
            readonly
            placeholder="选择供应商"
            @click.native="editOptionSupplier"
            v-model="pojo.supplierName"
          >
            <!-- <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier> -->
          </el-input>
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
import goodApi from "@/api/good";
import Supplier from "@/views/supplier";

export default {
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      // 条件查询绑定的条件值
      // 控制对话框,默认不弹出
      dialogFormVisible: false,
      dialogSupplierVisible: false,
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: "",
        supplierName: "",
        supplierId: null
      },
      rules: {
        //校验规则
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编号不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      },
      isEdit: false //是否为编辑窗口
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      goodApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          //   this.pageSize = resp.data.pageSize;
          //console.log(resp.data.rows);
          console.log(this.list);
        });
    },
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
    //重置按钮
    resetForm(formName) {
      console.log("重置", formName);
      //重置会看el-form-item组件元素的prop是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
    optionSupplier(currentRow) {
      console.log("parent", currentRow);
      if (this.isEdit) {
        //编辑窗口
        this.pojo.supplierName = currentRow.name; //供应商名称
        this.pojo.supplierId = currentRow.id; //供应商id
      } else {
        //搜索窗口
        this.searchMap.supplierName = currentRow.name; //供应商名称
        this.searchMap.supplierId = currentRow.id; //供应商id
      }
      this.isEdit = false;//注意重新赋值false
      this.dialogSupplierVisible = false;
    },
    editOptionSupplier() {
      (this.isEdit = true), //当前为编辑窗口
        (this.dialogSupplierVisible = true);
    },
    //新增会员按钮
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("add");
          goodApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              console.log("新增成功");
              this.fetchData();
              
              this.dialogFormVisible = false; //关闭窗口
              // console.log("新增");
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
     //打开编辑窗口
    handleEdit(id) {
      // console.log('编辑', id)
      // 清除原来的表单数据和校验结果
      this.handleAdd();
      goodApi.getById(id).then(response => {
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
          goodApi.update(this.pojo).then(response => {
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
      this.$confirm("是否永久删除此商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定
          console.log("yes");
          goodApi.deleteById(id).then(response => {
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
    },
  }
};
</script>