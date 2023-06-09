# -*- encoding: utf-8 -*-


from flask_wtf          import FlaskForm
from flask_wtf.file     import FileField, FileRequired
from wtforms            import StringField, TextAreaField, SubmitField, PasswordField
from wtforms.validators import InputRequired, Email, DataRequired

class LoginForm(FlaskForm):
	username    = StringField  (u'Username'        , validators=[DataRequired()])
	password    = PasswordField(u'Password'        , validators=[DataRequired()])

class RegisterForm(FlaskForm):
	username    = StringField  (u'Username'  , validators=[DataRequired()])
	password    = PasswordField(u'Password'  , validators=[DataRequired()])
	email       = StringField  (u'Email'     , validators=[DataRequired(), Email()])
	f_name		= StringField  (u'First Name'  , validators=[DataRequired()])
	l_name		= StringField  (u'Last Name'  , validators=[DataRequired()])
	address		= StringField  (u'Address'  , validators=[DataRequired()])
	profession 	= StringField  (u'Profession'  , validators=[DataRequired()])