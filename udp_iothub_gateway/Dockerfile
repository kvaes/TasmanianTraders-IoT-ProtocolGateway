FROM node:carbon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Set the environment
ENV HOSTNAME "myazureiothub.azure-devices.net"
ENV HUBCS "HostName=myazureiot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=mynotsosecretkey"
ENV API_PORT 8080
ENV RADIUS_PORT 1812
ENV ACC_PORT 49001
ENV GW_HOST "::1"
ENV GW_PORT 41234
ENV DEV_PORT 41235
ENV GW_SOCKET "{address: \'::1\',port: 51000}"
ENV AAA_SOCKET "{address: \'0.0.0.0\',port: 49001}"
ENV REDISCACHEHOSTNAME "dummy.redis.cache.windows.net"
ENV REDISCACHEKEY "mynotsosecretkey"
ENV REDISCACHEPORT 6379

# Expose Ports
EXPOSE 1812
EXPOSE 8080
EXPOSE 41234
EXPOSE 51000

ENTRYPOINT [ "npm", "start" ]