# hotel-air-manager
2023/9/28
尝试了一下上学期的框架,与hammer沟通后发现功能差别挺大的,还是老老实实从0开始构建吧

2023/10/10
没有可以用的电脑,只能大致讲一下怎么搭环境
需要linux或者windows的WSL,编辑器推荐vscode

1.在ubuntu的文件夹里找一个合适的位置克隆项目
git clone https://github.com/bbnoYuan/hotel-air-manager.git

2.用vscode打开该项目,连接WSL(linux不需要这一步,相当于在windows跑linux环境)
这时系统可能会提示用WSL打开,没有的话要下载一个插件,记不清了,看chatgpt吧
![Alt text](Screenshot_20231010_145305-1.png)

3.为后端创建一个虚拟环境
在终端依次输入以下命令
导航到后端对应目录
cd backend
创建虚拟环境(.env是你的虚拟环境名,我推荐使用.env)
python3 -m venv .env
激活虚拟环境(不出意外地址前面会多出一个"(.env)")
source venv_name/bin/activate

4.为前端安装必需的包
pip install -r requirements.txt

5.数据库迁移
cd backend
python manage.py makemigrations
python manage.py migrate

6.启动后端服务器
python manage.py runserver

7.新建一个终端,启动前端服务器
使用的包管理器是yarn,好像是要安装nodejs
cd frontend
sudo apt update
sudo apt install nodejs npm
npm install -g yarn
yarn install
yarn start

8.默认前端跑的本地3000端口localhost:3000,后端跑的本地8000端口127.0.0.1:8000,数据库是默认的db.sqlite3

9.目前就前端画了2个UI,在localhost:3000/customer和localhost:3000/login,后端还没动(汗)

10.有问题的话直接找我吧,相关学习资料以后补上