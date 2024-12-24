宁波特产网站项目说明
==================

一、数据库初始化说明
================

1. 数据库配置
-------------
数据库名称: ningbo_specialties
数据库类型: MySQL
字符集: UTF-8

2. 表结构
---------

users (用户表)
- id: 自增主键
- username: 用户名(唯一)
- password: 密码(加密存储)
- real_name: 真实姓名
- email: 电子邮箱
- address: 地址
- phone: 电话号码
- created_at: 创建时间

products (商品表)
- id: 自增主键
- name: 商品名称
- description: 商品描述
- original_price: 原价
- current_price: 现价
- image_url: 图片路径

cart_items (购物车表)
- id: 自增主键
- user_id: 用户ID(外键)
- product_id: 商品ID(外键)
- quantity: 数量

comments (评论表)
- id: 自增主键
- user_id: 用户ID(外键)
- content: 评论内容
- created_at: 创建时间

3. 初始化步骤
-------------
1) 创建数据库:
   CREATE DATABASE ningbo_specialties;

2) 使用数据库:
   USE ningbo_specialties;

3) 创建用户表:
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       real_name VARCHAR(50) NOT NULL,
       email VARCHAR(100) NOT NULL,
       address TEXT NOT NULL,
       phone VARCHAR(20) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

4) 创建商品表:
   CREATE TABLE products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       description TEXT,
       original_price DECIMAL(10,2) NOT NULL,
       current_price DECIMAL(10,2) NOT NULL,
       image_url VARCHAR(255) NOT NULL
   );

5) 创建购物车表:
   CREATE TABLE cart_items (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       product_id INT NOT NULL,
       quantity INT NOT NULL DEFAULT 1,
       FOREIGN KEY (user_id) REFERENCES users(id),
       FOREIGN KEY (product_id) REFERENCES products(id)
   );

6) 创建评论表:
   CREATE TABLE comments (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id)
   );

4. 注意事项
-----------
- 执行SQL语句前请确保MySQL服务已启动
- 请确保数据库用户具有创建数据库和表的权限
- 建议在执行初始化脚本前备份已有数据
- 所有表采用InnoDB引擎以支持外键约束
- 字符集推荐使用utf8mb4以支持完整的Unicode字符

5. 联系方式
-----------
如有问题请联系数据库管理员 


二、环境要求
-----------
1. Python环境
   - Python 3.6+
   - pip 包管理工具

2. 必需的Python包
   - Flask==2.0.1
   - Flask-MySQLdb==0.2.0
   - Werkzeug==2.0.1
   - mysqlclient==2.0.3

3. 数据库环境
   - MySQL 5.7+
   - SQLite 3 (用于部分功能)

4. 前端依赖
   - Bootstrap 4.5.2
   - jQuery 3.5.1
   - Font Awesome 5.15.4

三、项目结构
-----------
ningbo_specialties/
├── app.py                # 主应用文件
├── static/              # 静态资源目录
│   ├── css/            # CSS样式文件
│   ├── js/             # JavaScript文件
│   └── images/         # 图片资源
│       ├── food/       # 美食图片
│       ├── products/   # 商品图片
│       └── tourism/    # 旅游景点图片
├── templates/          # HTML模板目录
└── readme.txt         # 说明文档

四、安装步骤
-----------
1. 克隆或下载项目到本地

2. 创建虚拟环境(推荐)：
   python -m venv venv
   
3. 激活虚拟环境：
   Windows: venv\Scripts\activate
   Linux/Mac: source venv/bin/activate

4. 安装依赖：
   pip install -r requirements.txt

5. 配置数据库：
   - 执行第一部分的数据库初始化脚本
   - 修改app.py中的数据库连接信息

6. 运行项目：
   python app.py

五、功能模块
-----------
1. 用户管理
   - 注册/登录
   - 个人信息管理
   - 密码修改

2. 商品系统
   - 特产展示
   - 购物车
   - 订单管理

3. 美食展示
   - 特色小吃介绍
   - 美食图片展示

4. 旅游信息
   - 景点介绍
   - 地址导航
   - 门票信息

5. 评论系统
   - 发表评论
   - 弹幕展示
   - 用户分布统计

六、文件说明
-----------
1. 模板文件(templates/)
   - base.html: 基础模板
   - home.html: 首页
   - about.html: 关于页面
   - login.html: 登录页面
   - register.html: 注册页面
   - products.html: 商品页面
   - food.html: 美食页面
   - tourism.html: 旅游页面
   - comments.html: 评论页面
   - cart.html: 购物车页面
   - profile.html: 个人中心

2. 静态文件(static/)
   - CSS文件：页面样式
   - JS文件：交互功能
   - 图片资源：网站所需图片

七、特色功能
-----------
1. 交互效果
   - 鼠标移动轨迹特效
   - 点击爆炸动画
   - 评论弹幕展示

2. 数据可视化
   - 用户地理分布
   - 评论数据统计

3. 响应式设计
   - 适配多种设备
   - 良好的用户体验

八、注意事项
-----------
1. 运行环境
   - 确保Python和MySQL环境正确配置
   - 检查所有依赖包是否安装完整
   - 确保数据库服务正常运行

2. 图片资源
   - 商品图片需放在static/images/products/目录
   - 美食图片需放在static/images/food/目录
   - 景点图片需放在static/images/tourism/目录

3. 安全建议
   - 定期修改数据库密码
   - 及时更新依赖包版本
   - 做好数据备份

九、常见问题
-----------
1. 数据库连接失败
   - 检查MySQL服务是否启动
   - 验证数据库用户名和密码
   - 确认数据库名称正确

2. 图片显示问题
   - 检查图片路径是否正确
   - 确认图片格式支持
   - 验证文件权限设置

3. 样式加载问题
   - 清除浏览器缓存
   - 检查CSS文件路径
   - 确认静态文件配置



