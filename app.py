from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import re
from functools import wraps
from datetime import datetime
import sqlite3

app = Flask(__name__, 
    static_url_path='/static',
    static_folder='static'
)

# 配置
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456'
app.config['MYSQL_DB'] = 'ningbo_specialties'

mysql = MySQL(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# 登录验证装饰器
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('请先登录', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users WHERE username = %s', [username])
        user = cur.fetchone()
        cur.close()
        
        if user and check_password_hash(user[2], password):
            session['user_id'] = user[0]
            session['username'] = user[1]
            flash('登录成功！', 'success')
            return redirect(url_for('home'))
        
        flash('用户名或密码错误', 'error')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        real_name = request.form['real_name']
        email = request.form['email']
        phone = request.form['phone']
        # 获取并组合地址
        province = request.form.get('province', '')
        detailed_address = request.form.get('detailed_address', '')
        address = province + detailed_address if province and detailed_address else ''
        
        # 表单验证
        if not re.match(r'^[A-Za-z0-9]+$', username):
            flash('用户名只能包含字母和数字', 'error')
            return render_template('register.html')
            
        cur = mysql.connection.cursor()
        
        # 检查用户名是否已存在
        cur.execute('SELECT * FROM users WHERE username = %s', (username,))
        if cur.fetchone():
            return jsonify({'success': False, 'errors': {'username': '用户名已存在'}})
        
        # 检查邮箱是否已存在
        cur.execute('SELECT * FROM users WHERE email = %s', (email,))
        if cur.fetchone():
            return jsonify({'success': False, 'errors': {'email': '邮箱已被注册'}})
        
        # 插入新用户
        hashed_password = generate_password_hash(password)
        cur.execute('''
            INSERT INTO users (username, password, real_name, email, phone, address)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (username, hashed_password, real_name, email, phone, address))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'success': True})
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('已退出登录', 'info')
    return redirect(url_for('home'))

@app.route('/products')
def products():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM products')
    products = cur.fetchall()
    cur.close()
    
    # 不需要在这里修改路径，直接返回原始数据
    return render_template('products.html', products=products)

@app.route('/cart')
@login_required
def cart():
    # 从数据库获取用户的购物车商品
    cur = mysql.connection.cursor()
    cur.execute('''
        SELECT p.id, p.name, p.current_price, p.image_url, c.quantity 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = %s
    ''', (session['user_id'],))
    cart_items = []
    total = 0
    
    for item in cur.fetchall():
        cart_item = {
            'product_id': item[0],
            'name': item[1],
            'price': float(item[2]),
            'image_url': item[3],
            'quantity': item[4],
            'subtotal': float(item[2]) * item[4]
        }
        cart_items.append(cart_item)
        total += cart_item['subtotal']
    
    cur.close()
    return render_template('cart.html', cart_items=cart_items, total=total)

@app.route('/add_to_cart/<int:product_id>', methods=['POST'])
@login_required
def add_to_cart(product_id):
    cur = mysql.connection.cursor()
    
    # 检查商品是否已在购物车中
    cur.execute('SELECT id, quantity FROM cart_items WHERE user_id = %s AND product_id = %s', 
                (session['user_id'], product_id))
    existing_item = cur.fetchone()
    
    if existing_item:
        # 更新数量
        cur.execute('UPDATE cart_items SET quantity = quantity + 1 WHERE id = %s', 
                   (existing_item[0],))
    else:
        # 添加新商品
        cur.execute('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (%s, %s, 1)',
                   (session['user_id'], product_id))
    
    mysql.connection.commit()
    
    # 获取更新后的购物车数量
    cur.execute('SELECT SUM(quantity) FROM cart_items WHERE user_id = %s', (session['user_id'],))
    cart_count = cur.fetchone()[0] or 0
    
    cur.close()
    
    return jsonify({
        'success': True,
        'message': '商品已添加到购物车',
        'cart_count': cart_count
    })

@app.route('/comments', methods=['GET', 'POST'])
def comments():
    if request.method == 'POST':
        try:
            print("Request form:", request.form)  # 打印整个表单数据
            print("Request data:", request.get_data())  # 打印原始请求数据
            
            if 'user_id' not in session:
                return jsonify({
                    'success': False,
                    'message': '请先登录'
                }), 200
            
            if not request.form:
                print("Form data is empty")  # 调试信息
                return jsonify({
                    'success': False,
                    'message': '无效的请求数据'
                }), 200
                
            content = request.form.get('content')
            print("Content received:", content)  # 打印接收到的内容
            
            if not content or not content.strip():
                return jsonify({
                    'success': False,
                    'message': '评论内容不能为空'
                }), 200
                
            cur = mysql.connection.cursor()
            cur.execute('''
                INSERT INTO comments (user_id, content, created_at)
                VALUES (%s, %s, NOW())
            ''', (session['user_id'], content.strip()))
            mysql.connection.commit()
            cur.close()
            
            return jsonify({
                'success': True,
                'message': '评论发表成功'
            })
            
        except Exception as e:
            print(f"Error in comments POST: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'评论发表失败: {str(e)}'
            }), 200
    
    # GET 请求处理
    page = request.args.get('page', 1, type=int)
    per_page = 5
    
    cur = mysql.connection.cursor()
    cur.execute('SELECT COUNT(*) FROM comments')
    total = cur.fetchone()[0]
    total_pages = (total + per_page - 1) // per_page

    offset = (page - 1) * per_page
    cur.execute('''
        SELECT c.id, c.user_id, c.content, c.created_at, u.username 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        ORDER BY c.created_at DESC
        LIMIT %s OFFSET %s
    ''', (per_page, offset))
    comments = cur.fetchall()
    cur.close()

    return render_template('comments.html',
                         comments=comments,
                         page=page,
                         total_pages=total_pages)

@app.route('/tourism')
def tourism():
    return render_template('tourism.html')

@app.route('/food')
def food():
    return render_template('food.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/get_cart_count')
def get_cart_count():
    if 'user_id' in session:
        cur = mysql.connection.cursor()
        cur.execute('SELECT SUM(quantity) FROM cart_items WHERE user_id = %s', (session['user_id'],))
        count = cur.fetchone()[0]
        cur.close()
        return jsonify({'count': count or 0})
    return jsonify({'count': 0})

@app.route('/cart/update/<int:product_id>', methods=['POST'])
@login_required
def update_cart(product_id):
    data = request.get_json()
    change = data.get('change', 0)
    
    cur = mysql.connection.cursor()
    
    # 更新商品数量
    cur.execute('''
        UPDATE cart_items 
        SET quantity = GREATEST(0, quantity + %s)
        WHERE user_id = %s AND product_id = %s
    ''', (change, session['user_id'], product_id))
    
    # 删除数量为0的商品
    cur.execute('DELETE FROM cart_items WHERE user_id = %s AND product_id = %s AND quantity = 0',
                (session['user_id'], product_id))
    
    mysql.connection.commit()
    
    # 获取更新后的商品信息
    cur.execute('''
        SELECT c.quantity, p.current_price 
        FROM cart_items c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = %s AND c.product_id = %s
    ''', (session['user_id'], product_id))
    
    result = cur.fetchone()
    new_quantity = result[0] if result else 0
    price = float(result[1]) if result else 0
    subtotal = new_quantity * price
    
    # 获取购物车总价和总数量
    cur.execute('SELECT SUM(c.quantity * p.current_price), SUM(c.quantity) FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s',
                (session['user_id'],))
    total, cart_count = cur.fetchone()
    total = float(total) if total else 0
    cart_count = int(cart_count) if cart_count else 0
    
    cur.close()
    
    return jsonify({
        'success': True,
        'new_quantity': new_quantity,
        'subtotal': subtotal,
        'total': total,
        'cart_count': cart_count
    })

@app.route('/cart/remove/<int:product_id>', methods=['POST'])
@login_required
def remove_from_cart(product_id):
    cur = mysql.connection.cursor()
    
    # 删除商品
    cur.execute('DELETE FROM cart_items WHERE user_id = %s AND product_id = %s',
                (session['user_id'], product_id))
    
    mysql.connection.commit()
    
    # 获取新的总价和总数量
    cur.execute('SELECT SUM(c.quantity * p.current_price), SUM(c.quantity) FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s',
                (session['user_id'],))
    total, cart_count = cur.fetchone()
    total = float(total) if total else 0
    cart_count = int(cart_count) if cart_count else 0
    
    cur.close()
    
    return jsonify({
        'success': True,
        'total': total,
        'cart_count': cart_count
    })

@app.route('/get_user_info')
@login_required
def get_user_info():
    cur = mysql.connection.cursor()
    try:
        # 确保查询所有需要的字段
        cur.execute('''
            SELECT real_name, phone, address 
            FROM users 
            WHERE id = %s
        ''', (session['user_id'],))
        
        user_info = cur.fetchone()
        print(f"Database query result: {user_info}")  # 调试日志
        
        if user_info:
            # 确保字段顺序与数据库查询结果一致
            response = {
                'success': True,
                'user_info': {
                    'real_name': user_info[0],  # 第一列是 real_name
                    'phone': user_info[1],      # 第二列是 phone
                    'address': user_info[2]     # 第三列是 address
                }
            }
            print(f"Sending response: {response}")  # 调试日志
            return jsonify(response)
            
    except Exception as e:
        print(f"Database error: {str(e)}")  # 调试日志
        return jsonify({
            'success': False,
            'error': str(e)
        })
    finally:
        cur.close()
    
    return jsonify({'success': False})

@app.route('/create_order', methods=['POST'])
@login_required
def create_order():
    try:
        data = request.get_json()
        
        cur = mysql.connection.cursor()
        
        # 创建订单
        cur.execute('''
            INSERT INTO orders (user_id, receiver, phone, address, note, total_amount, status)
            VALUES (%s, %s, %s, %s, %s, 
                (SELECT current_price FROM products WHERE id = %s), 'pending')
        ''', (session['user_id'], data['receiver'], data['phone'], 
              data['address'], data.get('note', ''), data['product_id']))
        
        order_id = cur.lastrowid
        
        # 添加订单项
        cur.execute('''
            INSERT INTO order_items (order_id, product_id, quantity, price)
            SELECT %s, %s, %s, current_price
            FROM products WHERE id = %s
        ''', (order_id, data['product_id'], data['quantity'], data['product_id']))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/get_user_distribution')
def get_user_distribution():
    print("Getting user distribution...")
    
    cur = mysql.connection.cursor()
    
    try:
        # 直接匹配标准的省级行政区划名称
        cur.execute('''
            SELECT 
                CASE
                    WHEN address LIKE '北京市%' THEN '北京市'
                    WHEN address LIKE '天津市%' THEN '天津市'
                    WHEN address LIKE '上海市%' THEN '上海市'
                    WHEN address LIKE '重庆市%' THEN '重庆市'
                    WHEN address LIKE '河北省%' THEN '河北省'
                    WHEN address LIKE '山西省%' THEN '山西省'
                    WHEN address LIKE '辽宁省%' THEN '辽宁省'
                    WHEN address LIKE '吉林省%' THEN '吉林省'
                    WHEN address LIKE '黑龙江省%' THEN '黑龙江省'
                    WHEN address LIKE '江苏省%' THEN '江苏省'
                    WHEN address LIKE '浙江省%' THEN '浙江省'
                    WHEN address LIKE '安徽省%' THEN '安徽省'
                    WHEN address LIKE '福建省%' THEN '福建省'
                    WHEN address LIKE '江西省%' THEN '江西省'
                    WHEN address LIKE '山东省%' THEN '山东省'
                    WHEN address LIKE '河南省%' THEN '河南省'
                    WHEN address LIKE '湖北省%' THEN '湖北省'
                    WHEN address LIKE '湖南省%' THEN '湖南省'
                    WHEN address LIKE '广东省%' THEN '广东省'
                    WHEN address LIKE '海南省%' THEN '海南省'
                    WHEN address LIKE '四川省%' THEN '四川省'
                    WHEN address LIKE '贵州省%' THEN '贵州省'
                    WHEN address LIKE '云南省%' THEN '云南省'
                    WHEN address LIKE '陕西省%' THEN '陕西省'
                    WHEN address LIKE '甘肃省%' THEN '甘肃省'
                    WHEN address LIKE '青海省%' THEN '青海省'
                    WHEN address LIKE '台湾省%' THEN '台湾省'
                    WHEN address LIKE '内蒙古自治区%' THEN '内蒙古自治区'
                    WHEN address LIKE '广西壮族自治区%' THEN '广西壮族自治区'
                    WHEN address LIKE '西藏自治区%' THEN '西藏自治区'
                    WHEN address LIKE '宁夏回族自治区%' THEN '宁夏回族自治区'
                    WHEN address LIKE '新疆维吾尔自治区%' THEN '新疆维吾尔自治区'
                    WHEN address LIKE '香港特别行政区%' THEN '香港特别行政区'
                    WHEN address LIKE '澳门特别行政区%' THEN '澳门特别行政区'
                END as province,
                COUNT(*) as count
            FROM users
            WHERE address IS NOT NULL AND address != ''
            GROUP BY province
            HAVING province IS NOT NULL
        ''')
        
        results = cur.fetchall()
        print(f"Query results: {results}")  # 调试日志
        
        # 直接使用查询结果构建数据
        distribution_data = [
            {'name': province, 'value': int(count)}
            for province, count in results
        ]
        
        print(f"Formatted data: {distribution_data}")  # 调试日志
        return jsonify(distribution_data)
        
    except Exception as e:
        print(f"Error in get_user_distribution: {e}")
        return jsonify([])
    finally:
        cur.close()

@app.route('/api/all-comments', methods=['GET'])
def get_all_comments():
    try:
        cur = mysql.connection.cursor()
        # 获取所有评论，并关联用户名
        cur.execute('''
            SELECT comments.content, users.username 
            FROM comments 
            JOIN users ON comments.user_id = users.id 
            ORDER BY comments.created_at DESC
        ''')
        comments = cur.fetchall()
        cur.close()
        
        # 格式化评论数据
        formatted_comments = [f"{comment[1]}: {comment[0]}" for comment in comments]
        return jsonify(formatted_comments)
    except Exception as e:
        print(f"Error fetching comments: {str(e)}")
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
