<template>
    <div id="popup-content">
        <div style="margin-top: 15px;text-align: center;">
            <h4 style="margin:-15px 0 10px 0;">
                <span v-if="type == 'add'">添加事件</span>
                <span v-if="type == 'edit'">编辑事件</span>
                <span v-if="type == 'query'">事件信息</span>
            </h4>
            <el-form ref="form" :rules="rules" :disabled="type == 'query'" size="mini" :label-position="'left'"
                label-width="80px" :model="form">
                <el-form-item label="事件编号" prop="事件编号">
                    <el-input v-model="form.事件编号"></el-input>
                </el-form-item>
                <el-form-item label="事件类型" prop="事件类型">
                    <el-input v-model="form.事件类型"></el-input>
                </el-form-item>
                <el-form-item label="事件等级" prop="事件等级">
                    <el-input v-model="form.事件等级"></el-input>
                </el-form-item>
                <el-form-item label="发生时间" prop="发生时间">
                    <el-input v-model="form.发生时间"></el-input>
                </el-form-item>
                <el-form-item label="发生地点" prop="发生地点">
                    <el-input v-model="form.发生地点"></el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="车牌号">
                    <el-input v-model="form.车牌号"></el-input>
                </el-form-item>
                <el-form-item label="驾驶员" prop="驾驶员">
                    <el-input v-model="form.驾驶员"></el-input>
                </el-form-item>
                <el-form-item label="处理状态" prop="处理状态">
                    <el-input v-model="form.处理状态"></el-input>
                </el-form-item>
            </el-form>
            <el-button v-if="type == 'add'" size="mini" style="margin-top: 10px;" @click="toAdd" type="primary">
                添加</el-button>
            <el-button v-if="type == 'edit'" size="mini" style="margin-top: 10px;" @click="toEdit" type="primary">
                编辑</el-button>
        </div>
    </div>

</template>
<script>
const inputRule = [{ required: true, message: '信息不能为空!', trigger: ['blur', 'change'] }]
export default {
    data() {
        return {
            rules: {
                事件编号: inputRule,
                事件类型: inputRule,
                事件等级: inputRule,
                发生时间: inputRule,
                发生地点: inputRule,
                车牌号: inputRule,
                驾驶员: inputRule,
                处理状态: inputRule,
            }
        };
    },
    methods: {
        toAdd() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$parent.addToSql()
                }
            })
        },
        toEdit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$parent.editToSql()
                }
            })
        },
        formClear() {
            this.$refs.form.clearValidate()
        }
    },
    mounted() {
    },
    props: ['form', 'type']
}
</script>

<style lang="scss">
#popup-content {
    .el-form-item--mini.el-form-item {
        margin-bottom: 5px;
    }

    .el-form-item__error {
        top: 27%;
        left: 15px;
        z-index: 500;
    }

    .el-input__inner {
        background-color: transparent;
    }

    .el-input--mini {
        z-index: 1500;
    }
}


.ol-popup {
    width: 300px;
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 45px;
    left: -50px;
    z-index: 998;
}

.ol-popup:after,
.ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}

.ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
}

.ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
}

.ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
}

.ol-popup-closer:after {
    content: '✖';
}

#popup-content {
    font-size: 14px;
    font-family: '微软雅黑';
}
</style>
