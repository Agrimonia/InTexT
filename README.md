# InTexT

InTexT is an intelligent text editor by JoTang.

## 开发环境

~~建议先安装 [yarn](https://yarnpkg.com/zh-Hans/docs/install) 作为包管理器。~~

### 本地测试

#### 前端运行

```bash
git clone git@git.swcontest.cn:swc_20180117/intext.git
cd intext
yarn
yarn dev
```

#### landing_page

```bash
cd landing_page
npm install
gulp dev
```

#### 后端运行

```bash
# 建议先进入虚拟环境
cd api
pip install -r requirements
python manage.py db_create
python run.py

```

### 用 Prettier 进行代码格式化

为了避免转换代码风格的痛苦，我们用 Prettier 取代 ESlint，你可以按照自己的风格来编写代码，然后按下魔法按钮：`alt` + `shift` + `f`。

#### 与编辑器集成

Visual Studio Code

在 VSCode 的插件商店中搜索 Prettier 并安装。由于目前没有上 ESlint，建议在当前工作区禁用其他 Linter。

其他编辑器

见 Prettier 文档：https://prettier.io/docs/en/editors.html
