FROM ubuntu:20.04
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.8 python3.8-dev python3-pip python-is-python3 git gconf-service \
            libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \ 
            libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \ 
            libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
            libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 \ 
            lsb-release xdg-utils wget libcairo-gobject2 libxinerama1 libgtk2.0-0 libpangoft2-1.0-0 libthai0 libpixman-1-0 \ 
            libxcb-render0 libharfbuzz0b libdatrie1 libgraphite2-3 libgbm1 \
            libpq-dev


WORKDIR /app
ADD ./backend/requirements.txt /app/server/

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install -r server/requirements.txt


ADD ./backend/backend/acounts /app/server/acounts
ADD ./backend/backend/backend /app/server/backend
ADD ./backend/backend/conditioners /app/server/conditioners
ADD ./backend/backend/log /app/server/log
ADD ./backend/backend/setup /app/server/setup
ADD ./backend/backend/manage.py /app/server/
ADD ./docker /app/docker

RUN chmod +x /app/docker/server/entrypoint.sh