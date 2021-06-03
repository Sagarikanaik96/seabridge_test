# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in seabridge_app/__init__.py
from seabridge_app import __version__ as version

setup(
	name='seabridge_app',
	version=version,
	description='seabridge_app',
	author='seabridge_app',
	author_email='seabridge_app@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
