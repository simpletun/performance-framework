#
# build:
#   docker build -f ./Dockerfile --force-rm -t local/performance-framework .
# run:
#   docker run --rm -it --mount type=bind,source="$(pwd)"/secrets,target=/app/secrets --name performance-framework local/performance-framework
#

FROM node:16-alpine
WORKDIR /app

# Get everything ready so we can install dependencies
RUN npm config set registry https://artifactory.nike.com/artifactory/api/npm/npm-nike/

# Copy over just the package files and do an install
COPY . .
RUN npm install --only=production

CMD [ "npm", "start", "referenceExample", "log:debug" ]
