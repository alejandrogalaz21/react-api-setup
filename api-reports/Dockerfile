FROM jsreport/jsreport:2.10.0-full

WORKDIR '/app'

# Copy only package.json and yarn.lock for cache
COPY package*.json ./
# Install some depenendencies
RUN npm install

# Copies everything over to Docker environment
COPY . .

# Uses port which is used by the actual application
EXPOSE 5488

# we want to preserve the chrome version of 2.7.2 and just update the jsreport
RUN npm install jsreport@2.10.0 && npm cache clean -f

COPY --chown=jsreport:jsreport run.sh /app/run.sh

CMD ["bash", "/app/run.sh"]