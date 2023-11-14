### 后端,日志处理
代码部分其实不难,难的是理解整个代码的结构,到达知道怎么问chatgpt的程度就行</br>
主要任务是对日志的处理,需要你写的部分目前只有两个</br>
![Alt text](frontend/public/readme/image-9.png)
</br>
把那两个地方补全,上面的一处是对所有的日志做一个filter(过滤,筛选),下面一处要你添加一条日志记录,这都是Django最基本的用法</br>
为了完成这个任务,需要查看backend/backend/log/models.py,看看里面定义什么,它和conditioner类是链接的(外键)</br>
还要查看backend/backend/log/views.py,看看那个函数做了什么事情,如果你想添加一条'入住/结算'的记录,你可能需要在那个函数末尾增加一些内容</br>
目前先做这个,后面的任务要参考其他成员的进度.