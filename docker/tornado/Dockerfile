FROM python:3.6.4-slim
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD . /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt 
