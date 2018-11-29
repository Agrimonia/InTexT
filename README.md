# InTexT(抒写)

InTexT (Intelligent text editor) 是由 JoTang 开发的一款专注于智能化内容生产的文档工具。

主要技术栈：

- 前端：`React` + `Mobx` + `Keras.js`
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

```bash
# ./intext
# 建议先进入虚拟环境，这里以 virtualenv 为例：

cd api

# source venv/bin/activate

pip install -r requirements.txt

python manage.py db_create

python run.py



```

## 团队配置

### 建议用 Prettier 进行代码格式化

为了避免转换代码风格的痛苦，我们用 Prettier 取代 ESlint，你可以按照自己的风格来编写代码，提交时 Prettier 会帮你自动格式化。

#### 与编辑器集成

Visual Studio Code

在 VSCode 的插件商店中搜索 Prettier 并安装。由于目前没有上 ESlint，建议在当前工作区禁用其他 Linter。

其他编辑器

见 Prettier 文档：https://prettier.io/docs/en/editors.html
