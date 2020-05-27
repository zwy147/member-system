<template>
  <div>
    <!-- 搜索 
    :inline="true" 表单在一行显示-->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top:20px;">
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付方式" style="width:200px">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
          style="margin-right:20px"
        ></el-date-picker>
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
      <el-table-column prop="cardNum" label="卡号" width="180"></el-table-column>
      <el-table-column prop="name" label="会员姓名" width="90"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="110"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="130"></el-table-column>
      <el-table-column prop="integral" label="可用积分" width="80"></el-table-column>
      <el-table-column prop="money" label="开卡金额" width="90"></el-table-column>
      <el-table-column prop="payType" label="支付方式" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="300"></el-table-column>
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
    <!-- 新增窗口 
    title是新增窗口标题-->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="请选择支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address"></el-input>
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
import memberApi from "@/api/member";
//支付类型
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, //条件查询绑定的条件值
      payTypeOptions,
      //控制对话框,默认不弹出
      dialogFormVisible: false,
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: 0,
        payType: "",
        integral: 0,
        address: ""
      }, //提交的·数据·
      rules: {
        //校验规则
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    //初始化获取数据
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
    fetchData() {
      //调用分页查询数据
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          //   this.pageSize = resp.data.pageSize;
          //console.log(resp.data.rows);
        });
    },
    //打开编辑窗口
    handleEdit(id) {
      // 清空原数据
      this.handleAdd(); // 通过Id查询数据
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    //编辑之后进行更新
    updateData(formName) {
      console.log("updateData");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交更新
          memberApi.update(this.pojo).then(response => {
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
      this.$confirm("是否永久删除此会员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //确定
          console.log("yes");
          memberApi.deleteById(id).then(response => {
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
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              console.log("新增成功");
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
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
    }
  },
  filters: {
    payTypeFilter(type) {
      /* payTypeOptions.find(obj => {
                return obj.type === type
            }) */
      // 在过滤 器当中不能引用当前实例 this   this.payTypeOptions 错误的
      const payObj = payTypeOptions.find(obj => obj.type === type);
      return payObj ? payObj.name : null;
    }
  }
};
</script>