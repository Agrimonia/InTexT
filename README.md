# [WIP]InTexT(抒写)

InTexT (Intelligent text editor) 是由 JoTang 开发的一款专注于智能化内容生产的文档工具。

主要技术栈：

- 前端：`React` + `Mobx` + `Tensorflow.js`
- 后端：`Flask` + `MySQL`

## 在线演示

[Demo](https://intext.jotang.party)

## 开发环境

~~建议先安装 [yarn](https://yarnpkg.com/zh-Hans/docs/install) 作为包管理器。~~

### 本地测试

#### 前端运行

```bash
git clone git@github.com:Agrimonia/InTexT.git
cd intext
yarn # or npm i
yarn dev # or npm run dev
```

#### landing_page

```bash
# ./intext
cd landing_page
npm install
gulp dev
```

#### 后端运行

建议进入虚拟环境，以 conda 为例：

1. 下载地址推荐：<https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/>
2. 安装完成后，进入 cmd 输入：
   `conda create -n intext python=3.7`
3. 进入编辑器，输入：
   `activate intext`

```bash
# ./intext
cd api

pip install -r requirements.txt
python manage.py db_create
python run.py
```

