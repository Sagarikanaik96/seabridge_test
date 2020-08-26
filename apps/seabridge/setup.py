# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in seabridge/__init__.py
from seabridge import __version__ as version

setup(
	name='seabridge',
	version=version,
	description='seabridge',
	author='seabridge',
	author_email='seabridge@gmail.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
