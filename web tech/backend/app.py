from flask import Flask, render_template, request, jsonify, redirect, url_for
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sys
import os

# Add the parent directory to sys.path to allow importing from database
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.models import db, User, MenuItem, Order

app = Flask(__name__, template_folder='../', static_folder='../assets')
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Implement login logic here
        pass
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Implement registration logic here
        pass
    # Assuming registration page exists or using login page for now
    return render_template('login.html') 

@app.route('/menu')
def menu():
    items = MenuItem.query.all()
    return render_template('menu.html', items=items)

# API Routes for CRUD operations
@app.route('/api/menu', methods=['GET', 'POST'])
def api_menu():
    if request.method == 'GET':
        items = MenuItem.query.all()
        return jsonify([{'id': item.id, 'name': item.name, 'price': item.price} for item in items])
    elif request.method == 'POST':
        data = request.json
        new_item = MenuItem(name=data['name'], price=data['price'], category=data['category'])
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'message': 'Item added successfully'}), 201

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    # Logic to create order
    return jsonify({'message': 'Order created'}), 201

if __name__ == '__main__':
    app.run(debug=True)
