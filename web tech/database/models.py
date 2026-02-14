from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from datetime import datetime
import re

db = SQLAlchemy()

# Association Table for Many-to-Many relationship between Order and MenuItem
order_items = db.Table('order_items',
    db.Column('order_id', db.Integer, db.ForeignKey('order.id'), primary_key=True),
    db.Column('menu_item_id', db.Integer, db.ForeignKey('menu_item.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    orders = db.relationship('Order', backref='user', lazy=True)

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise AssertionError('Email must be provided')
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise AssertionError('Provided email is not an email address')
        return email

    def __repr__(self):
        return f'<User {self.username}>'

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(200), nullable=True)

    @validates('price')
    def validate_price(self, key, price):
        if price < 0:
            raise AssertionError('Price must be non-negative')
        return price

    def __repr__(self):
        return f'<MenuItem {self.name}>'

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_ordered = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Pending')
    total_price = db.Column(db.Float, default=0.0)
    items = db.relationship('MenuItem', secondary=order_items, lazy='subquery',
        backref=db.backref('orders', lazy=True))

    def __repr__(self):
        return f'<Order {self.id}>'
